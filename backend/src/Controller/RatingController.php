<?php
namespace App\Controller;

use App\Entity\Rating;
use App\Entity\User;
use App\Repository\RatingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/ratings')]
final class RatingController extends AbstractController
{
    #[Route('/', name: 'ratings_list', methods: ['GET'])]
    public function list(RatingRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        $ratings = $repo->findBy(['rated' => $user]);
        $data = array_map(fn(Rating $r) => [
            'id'          => $r->getId(),
            'note'        => $r->getNote(),
            'commentaire' => $r->getCommentaire(),
            'rater_id'    => $r->getRater()->getId(),
        ], $ratings);

        return $this->json($data);
    }

    #[Route('/', name: 'ratings_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        $data = json_decode($request->getContent(), true);
        if (empty($data['note']) || empty($data['commentaire']) || empty($data['rated_id'])) {
            return $this->json(['error' => 'Champs manquants'], 400);
        }

        if ($data['note'] < 1 || $data['note'] > 5) {
            return $this->json(['error' => 'La note doit être entre 1 et 5'], 400);
        }

        $rated = $em->getRepository(User::class)->find($data['rated_id']);
        if (!$rated) return $this->json(['error' => 'Utilisateur introuvable'], 404);

        if ($rated->getId() === $user->getId()) {
            return $this->json(['error' => 'Vous ne pouvez pas vous noter vous-même'], 400);
        }

        $rating = new Rating();
        $rating->setNote($data['note']);
        $rating->setCommentaire($data['commentaire']);
        $rating->setRater($user);
        $rating->setRated($rated);

        $em->persist($rating);
        $em->flush();

        return $this->json(['message' => 'Note ajoutée', 'id' => $rating->getId()], 201);
    }

    #[Route('/{id}', name: 'ratings_delete', methods: ['DELETE'])]
    public function delete(Rating $rating, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non authentifié'], 401);
        assert($user instanceof User);

        if ($rating->getRater()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        $em->remove($rating);
        $em->flush();

        return $this->json(['message' => 'Note supprimée']);
    }
}