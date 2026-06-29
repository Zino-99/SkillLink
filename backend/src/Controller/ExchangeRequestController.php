<?php
namespace App\Controller;

use App\Entity\ExchangeRequest;
use App\Entity\User;
use App\Repository\ExchangeRequestRepository;
use App\Repository\SkillRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/exchanges')]
final class ExchangeRequestController extends AbstractController
{
    #[Route('/', name: 'exchanges_list', methods: ['GET'])]
    public function list(ExchangeRequestRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        $exchanges = $repo->findBy(['sender' => $user]);
        $data = array_map(fn(ExchangeRequest $e) => [
            'id'          => $e->getId(),
            'status'      => $e->getStatus(),
            'date'        => $e->getDate()->format('Y-m-d H:i:s'),
            'skill_id'    => $e->getSkill()->getId(),
            'receiver_id' => $e->getReceiver()->getId(),
        ], $exchanges);

        return $this->json($data);
    }

    #[Route('/', name: 'exchanges_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, SkillRepository $skillRepo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        $data = json_decode($request->getContent(), true);
        if (empty($data['skill_id']) || empty($data['receiver_id'])) {
            return $this->json(['error' => 'Champs manquants'], 400);
        }

        $skill = $skillRepo->find($data['skill_id']);
        if (!$skill) return $this->json(['error' => 'Skill introuvable'], 404);

        $receiver = $em->getRepository(User::class)->find($data['receiver_id']);
        if (!$receiver) return $this->json(['error' => 'Utilisateur introuvable'], 404);

        $exchange = new ExchangeRequest();
        $exchange->setStatus('pending');
        $exchange->setDate(new \DateTime());
        $exchange->setSender($user);
        $exchange->setReceiver($receiver);
        $exchange->setSkill($skill);

        $em->persist($exchange);
        $em->flush();

        return $this->json(['message' => 'Demande envoyée', 'id' => $exchange->getId()], 201);
    }

    #[Route('/{id}', name: 'exchanges_update', methods: ['PUT'])]
    public function update(ExchangeRequest $exchange, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        if ($exchange->getReceiver()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        $data = json_decode($request->getContent(), true);
        if (empty($data['status'])) return $this->json(['error' => 'Status manquant'], 400);

        $exchange->setStatus($data['status']);
        $em->flush();

        return $this->json(['message' => 'Statut mis à jour']);
    }

    #[Route('/{id}', name: 'exchanges_delete', methods: ['DELETE'])]
    public function delete(ExchangeRequest $exchange, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        if ($exchange->getSender()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        $em->remove($exchange);
        $em->flush();

        return $this->json(['message' => 'Demande supprimée']);
    }
}