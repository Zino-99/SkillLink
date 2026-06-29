<?php
namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/messages')]
final class MessageController extends AbstractController
{
    #[Route('/', name: 'messages_list', methods: ['GET'])]
    public function list(MessageRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        $messages = $repo->findBy(['sender' => $user]);
        $data = array_map(fn(Message $m) => [
            'id'          => $m->getId(),
            'contenu'     => $m->getContenu(),
            'date'        => $m->getDate()->format('Y-m-d H:i:s'),
            'receiver_id' => $m->getReceiver()->getId(),
        ], $messages);

        return $this->json($data);
    }

    #[Route('/', name: 'messages_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        $data = json_decode($request->getContent(), true);
        if (empty($data['contenu']) || empty($data['receiver_id'])) {
            return $this->json(['error' => 'Champs manquants'], 400);
        }

        $receiver = $em->getRepository(User::class)->find($data['receiver_id']);
        if (!$receiver) return $this->json(['error' => 'Utilisateur introuvable'], 404);

        $message = new Message();
        $message->setContenu($data['contenu']);
        $message->setDate(new \DateTime());
        $message->setSender($user);
        $message->setReceiver($receiver);

        $em->persist($message);
        $em->flush();

        return $this->json(['message' => 'Message envoyé', 'id' => $message->getId()], 201);
    }

    #[Route('/{id}', name: 'messages_delete', methods: ['DELETE'])]
    public function delete(Message $message, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        if ($message->getSender()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        $em->remove($message);
        $em->flush();

        return $this->json(['message' => 'Message supprimé']);
    }
}