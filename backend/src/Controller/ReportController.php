<?php
namespace App\Controller;

use App\Entity\Report;
use App\Entity\User;
use App\Repository\ReportRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/reports')]
final class ReportController extends AbstractController
{
    #[Route('/', name: 'reports_list', methods: ['GET'])]
    public function list(ReportRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        $reports = $repo->findBy(['reporter' => $user]);
        $data = array_map(fn(Report $r) => [
            'id'          => $r->getId(),
            'description' => $r->getDescription(),
            'status'      => $r->getStatus(),
            'reported_id' => $r->getReported()->getId(),
        ], $reports);

        return $this->json($data);
    }

    #[Route('/', name: 'reports_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        $data = json_decode($request->getContent(), true);
        if (empty($data['description']) || empty($data['reported_id'])) {
            return $this->json(['error' => 'Champs manquants'], 400);
        }

        $reported = $em->getRepository(User::class)->find($data['reported_id']);
        if (!$reported) return $this->json(['error' => 'Utilisateur introuvable'], 404);

        if ($reported->getId() === $user->getId()) {
            return $this->json(['error' => 'Vous ne pouvez pas vous signaler vous-même'], 400);
        }

        $report = new Report();
        $report->setDescription($data['description']);
        $report->setStatus('pending');
        $report->setReporter($user);
        $report->setReported($reported);

        $em->persist($report);
        $em->flush();

        return $this->json(['message' => 'Signalement envoyé', 'id' => $report->getId()], 201);
    }

    #[Route('/{id}', name: 'reports_delete', methods: ['DELETE'])]
    public function delete(Report $report, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        if ($report->getReporter()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        $em->remove($report);
        $em->flush();

        return $this->json(['message' => 'Signalement supprimé']);
    }
}