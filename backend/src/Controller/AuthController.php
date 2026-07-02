<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class AuthController extends AbstractController
{
    #[Route('/register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (empty($data['email']) || empty($data['password']) || empty($data['nom'])) {
            return $this->json(['message' => 'Email, mot de passe et nom sont obligatoires'], 400);
        }

        $existing = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existing) {
            return $this->json(['message' => 'Cet email est déjà utilisé'], 409);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setNom($data['nom']);
        $user->setDescription($data['description'] ?? '');
        $user->setPassword($hasher->hashPassword($user, $data['password']));

        $em->persist($user);
        $em->flush();

        return $this->json([
            'message' => 'Compte créé',
            'user' => [
                'id'          => $user->getId(),
                'email'       => $user->getEmail(),
                'nom'         => $user->getNom(),
                'roles'       => $user->getRoles(),
                'description' => $user->getDescription(),
            ]
        ], 201);
    }

    #[Route('/login', methods: ['POST'])]
    public function login(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (empty($data['email']) || empty($data['password'])) {
            return $this->json(['message' => 'Email et mot de passe sont obligatoires'], 400);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user || !$hasher->isPasswordValid($user, $data['password'])) {
            return $this->json(['message' => 'Identifiants invalides'], 401);
        }

        $request->getSession()->set('user_id', $user->getId());

        return $this->json([
            'message' => 'Connecté',
            'user' => [
                'id'          => $user->getId(),
                'email'       => $user->getEmail(),
                'nom'         => $user->getNom(),
                'roles'       => $user->getRoles(),
                'description' => $user->getDescription(),
                'photo'       => $user->getPhoto(),
            ]
        ]);
    }

    #[Route('/logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $request->getSession()->invalidate();

        return $this->json(['message' => 'Déconnecté']);
    }

    #[Route('/me', methods: ['GET'])]
    public function me(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $userId = $request->getSession()->get('user_id');

        if (!$userId) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $user = $em->getRepository(User::class)->find($userId);

        return $this->json([
            'id'          => $user->getId(),
            'email'       => $user->getEmail(),
            'nom'         => $user->getNom(),
            'roles'       => $user->getRoles(),
            'description' => $user->getDescription(),
            'photo'       => $user->getPhoto(),
        ]);
    }

    #[Route('/me', methods: ['PUT'])]
    public function updateMe(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $userId = $request->getSession()->get('user_id');

        if (!$userId) {
            return $this->json(['message' => 'Non authentifié'], 401);
        }

        $user = $em->getRepository(User::class)->find($userId);
        $data = json_decode($request->getContent(), true);

        if (isset($data['nom']))         $user->setNom($data['nom']);
        if (isset($data['description'])) $user->setDescription($data['description']);

        $em->flush();

        return $this->json([
            'message' => 'Profil mis à jour',
            'user' => [
                'id'          => $user->getId(),
                'email'       => $user->getEmail(),
                'nom'         => $user->getNom(),
                'roles'       => $user->getRoles(),
                'description' => $user->getDescription(),
                'photo'       => $user->getPhoto(),
            ]
        ]);
    }

    #[Route('/users', methods: ['GET'])]
    public function users(EntityManagerInterface $em): JsonResponse
    {
        $users = $em->getRepository(User::class)->findAll();
        $data = array_map(fn(User $u) => [
            'id'  => $u->getId(),
            'nom' => $u->getNom(),
        ], $users);
        return $this->json($data);
    }
}