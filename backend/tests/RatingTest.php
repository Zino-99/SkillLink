<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class RatingTest extends WebTestCase
{
    private function createAuthenticatedClient(string $suffix = ''): array
    {
        $client = static::createClient();
        $email = 'rating_test_' . $suffix . uniqid() . '@test.com';

        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'RatingUser' . $suffix,
                'email' => $email,
                'password' => 'password123'
            ])
        );

        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => $email,
                'password' => 'password123'
            ])
        );

        $data = json_decode($client->getResponse()->getContent(), true);
        return [$client, $data['user']['id']];
    }

    public function testGetRatings(): void
    {
        [$client] = $this->createAuthenticatedClient('get');
        $client->request('GET', '/api/ratings/');
        $this->assertResponseStatusCodeSame(200);
    }

    public function testCreateRating(): void
    {
        [$client, $userAId] = $this->createAuthenticatedClient('A');

        // Créer un deuxième user à noter
        $email = 'rating_b_' . uniqid() . '@test.com';
        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'UserB',
                'email' => $email,
                'password' => 'password123'
            ])
        );
        $dataB = json_decode($client->getResponse()->getContent(), true);
        $userBId = $dataB['user']['id'];

        $client->request(
            'POST',
            '/api/ratings/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'note' => 5,
                'commentaire' => 'Excellent échange !',
                'rated_id' => $userBId
            ])
        );

        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
    }

    public function testCannotRateSelf(): void
    {
        [$client, $userAId] = $this->createAuthenticatedClient('B');

        $client->request(
            'POST',
            '/api/ratings/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'note' => 5,
                'commentaire' => 'Test auto-notation',
                'rated_id' => $userAId
            ])
        );

        $this->assertResponseStatusCodeSame(400);
    }

    public function testInvalidNote(): void
    {
        [$client, $userAId] = $this->createAuthenticatedClient('C');

        $email = 'rating_d_' . uniqid() . '@test.com';
        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'UserD',
                'email' => $email,
                'password' => 'password123'
            ])
        );
        $dataB = json_decode($client->getResponse()->getContent(), true);
        $userBId = $dataB['user']['id'];

        $client->request(
            'POST',
            '/api/ratings/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'note' => 10,
                'commentaire' => 'Note invalide',
                'rated_id' => $userBId
            ])
        );

        $this->assertResponseStatusCodeSame(400);
    }

    public function testGetRatingsWithoutAuth(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/ratings/');
        $this->assertResponseStatusCodeSame(401);
    }
}