<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ExchangeTest extends WebTestCase
{
    private function createAuthenticatedClient(string $suffix = ''): array
    {
        $client = static::createClient();
        $email = 'exchange_test_' . $suffix . uniqid() . '@test.com';

        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'ExchangeUser' . $suffix,
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

    private function createSkill($client, string $titre): int
    {
        $client->request(
            'POST',
            '/api/skills/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'titre' => $titre,
                'description' => 'Description de ' . $titre,
                'categorie' => 'Test'
            ])
        );
        $data = json_decode($client->getResponse()->getContent(), true);
        return $data['id'];
    }

    public function testGetExchanges(): void
    {
        [$client] = $this->createAuthenticatedClient('get');
        $client->request('GET', '/api/exchanges/');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('sent', $data);
        $this->assertArrayHasKey('received', $data);
    }

    public function testCreateExchange(): void
    {
        [$client, $userAId] = $this->createAuthenticatedClient('A');

        $skillId = $this->createSkill($client, 'React');

        $email = 'exchange_b_' . uniqid() . '@test.com';
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
            '/api/exchanges/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'skill_id' => $skillId,
                'receiver_id' => $userBId
            ])
        );

        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
    }

    public function testExchangeWithoutAuth(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/exchanges/');
        $this->assertResponseStatusCodeSame(401);
    }

    public function testUpdateExchangeStatus(): void
    {
        [$client, $userAId] = $this->createAuthenticatedClient('C');

        $skillId = $this->createSkill($client, 'Python');

        // Envoyer une demande à soi-même pour le test
        $client->request(
            'POST',
            '/api/exchanges/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'skill_id' => $skillId,
                'receiver_id' => $userAId
            ])
        );

        $data = json_decode($client->getResponse()->getContent(), true);
        $exchangeId = $data['id'];

        // Accepter la demande
        $client->request(
            'PUT',
            '/api/exchanges/' . $exchangeId,
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['status' => 'accepted'])
        );

        $this->assertResponseStatusCodeSame(200);
    }
}