<?php
namespace App\Controller;

use App\Entity\Skill;
use App\Entity\User;
use App\Repository\SkillRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/skills')]
final class SkillController extends AbstractController
{
    #[Route('/', name: 'skills_list', methods: ['GET'])]
    public function list(SkillRepository $repo): JsonResponse
    {
        $skills = $repo->findAll();
        $data = array_map(fn(Skill $s) => [
            'id'          => $s->getId(),
            'titre'       => $s->getTitre(),
            'description' => $s->getDescription(),
            'categorie'   => $s->getCategorie(),
            'user_id'     => $s->getUser()->getId(),
        ], $skills);
        return $this->json($data);
    }

    #[Route('/', name: 'skills_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        $data = json_decode($request->getContent(), true);
        if (empty($data['titre']) || empty($data['description']) || empty($data['categorie'])) {
            return $this->json(['error' => 'Champs manquants'], 400);
        }

        $skill = new Skill();
        $skill->setTitre($data['titre']);
        $skill->setDescription($data['description']);
        $skill->setCategorie($data['categorie']);
        $skill->setUser($user);

        $em->persist($skill);
        $em->flush();

        return $this->json(['message' => 'Skill créée', 'id' => $skill->getId()], 201);
    }

    #[Route('/{id}', name: 'skills_show', methods: ['GET'])]
    public function show(Skill $skill): JsonResponse
    {
        return $this->json([
            'id'          => $skill->getId(),
            'titre'       => $skill->getTitre(),
            'description' => $skill->getDescription(),
            'categorie'   => $skill->getCategorie(),
            'user_id'     => $skill->getUser()->getId(),
        ]);
    }

    #[Route('/{id}', name: 'skills_update', methods: ['PUT'])]
    public function update(Skill $skill, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        if ($skill->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        $data = json_decode($request->getContent(), true);
        if (!empty($data['titre']))       $skill->setTitre($data['titre']);
        if (!empty($data['description'])) $skill->setDescription($data['description']);
        if (!empty($data['categorie']))   $skill->setCategorie($data['categorie']);

        $em->flush();
        return $this->json(['message' => 'Skill mise à jour']);
    }

    #[Route('/{id}', name: 'skills_delete', methods: ['DELETE'])]
    public function delete(Skill $skill, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        if ($skill->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        $em->remove($skill);
        $em->flush();
        return $this->json(['message' => 'Skill supprimée']);
    }
}