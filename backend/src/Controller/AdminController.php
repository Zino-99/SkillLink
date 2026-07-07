<?php
namespace App\Controller;

use App\Entity\Report;
use App\Entity\User;
use App\Repository\ExchangeRequestRepository;
use App\Repository\ReportRepository;
use App\Repository\SkillRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin')]
final class AdminController extends AbstractController
{
    #[Route('/stats', methods: ['GET'])]
    public function stats(
        EntityManagerInterface $em,
        SkillRepository $skillRepo,
        ExchangeRequestRepository $exchangeRepo,
        ReportRepository $reportRepo
    ): JsonResponse {
        return $this->json([
            'users'     => $em->getRepository(User::class)->count([]),
            'skills'    => $skillRepo->count([]),
            'exchanges' => $exchangeRepo->count([]),
            'reports'   => $reportRepo->count(['status' => 'pending']),
        ]);
    }

    #[Route('/users', methods: ['GET'])]
    public function users(EntityManagerInterface $em, SkillRepository $skillRepo): JsonResponse
    {
        $users = $em->getRepository(User::class)->findAll();
        $data = array_map(fn(User $u) => [
            'id'           => $u->getId(),
            'nom'          => $u->getNom(),
            'email'        => $u->getEmail(),
            'roles'        => $u->getRoles(),
            'skills_count' => $skillRepo->count(['user' => $u]),
        ], $users);
        return $this->json($data);
    }

    #[Route('/users', methods: ['POST'])]
    public function createUser(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (empty($data['nom']) || empty($data['email']) || empty($data['password'])) {
            return $this->json(['error' => 'Champs manquants'], 400);
        }
        $user = new User();
        $user->setNom($data['nom']);
        $user->setEmail($data['email']);
        $user->setDescription('');
        $user->setRoles($data['roles'] ?? ['ROLE_USER']);
        $user->setPassword($hasher->hashPassword($user, $data['password']));
        $em->persist($user);
        $em->flush();
        return $this->json(['message' => 'Utilisateur créé', 'id' => $user->getId()], 201);
    }

    #[Route('/users/{id}', methods: ['PUT'])]
    public function updateUser(User $user, Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!empty($data['nom']))      $user->setNom($data['nom']);
        if (!empty($data['email']))    $user->setEmail($data['email']);
        if (!empty($data['password'])) $user->setPassword($hasher->hashPassword($user, $data['password']));
        if (!empty($data['roles']))    $user->setRoles($data['roles']);
        $em->flush();
        return $this->json(['message' => 'Utilisateur mis à jour']);
    }

        #[Route('/users/{id}', methods: ['DELETE'])]
public function deleteUser(User $user, EntityManagerInterface $em): JsonResponse
{
    // Supprimer les skills
    foreach ($em->getRepository(\App\Entity\Skill::class)->findBy(['user' => $user]) as $skill) {
        $em->remove($skill);
    }
    // Supprimer les exchanges
    foreach ($em->getRepository(\App\Entity\ExchangeRequest::class)->findBy(['sender' => $user]) as $e) {
        $em->remove($e);
    }
    foreach ($em->getRepository(\App\Entity\ExchangeRequest::class)->findBy(['receiver' => $user]) as $e) {
        $em->remove($e);
    }
    // Supprimer les messages
    foreach ($em->getRepository(\App\Entity\Message::class)->findBy(['sender' => $user]) as $m) {
        $em->remove($m);
    }
    foreach ($em->getRepository(\App\Entity\Message::class)->findBy(['receiver' => $user]) as $m) {
        $em->remove($m);
    }
    // Supprimer les ratings
    foreach ($em->getRepository(\App\Entity\Rating::class)->findBy(['rater' => $user]) as $r) {
        $em->remove($r);
    }
    foreach ($em->getRepository(\App\Entity\Rating::class)->findBy(['rated' => $user]) as $r) {
        $em->remove($r);
    }
    // Supprimer les reports
    foreach ($em->getRepository(\App\Entity\Report::class)->findBy(['reporter' => $user]) as $r) {
        $em->remove($r);
    }
    foreach ($em->getRepository(\App\Entity\Report::class)->findBy(['reported' => $user]) as $r) {
        $em->remove($r);
    }

    $em->remove($user);
    $em->flush();

    return $this->json(['message' => 'Utilisateur supprimé']);
}

    #[Route('/reports', methods: ['GET'])]
    public function reports(ReportRepository $repo): JsonResponse
    {
        $reports = $repo->findAll();
        $data = array_map(fn(Report $r) => [
            'id'           => $r->getId(),
            'description'  => $r->getDescription(),
            'status'       => $r->getStatus(),
            'date'         => '',
            'reporter_nom' => $r->getReporter()->getNom(),
            'reported_nom' => $r->getReported()->getNom(),
        ], $reports);
        return $this->json($data);
    }

    #[Route('/reports/{id}', methods: ['PUT'])]
    public function updateReport(Report $report, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!empty($data['status'])) {
            $report->setStatus($data['status']);
            $em->flush();
        }
        return $this->json(['message' => 'Signalement mis à jour']);
    }
}