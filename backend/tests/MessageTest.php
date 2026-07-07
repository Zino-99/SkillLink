<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class MessageTest extends WebTestCase
{
    private function createAuthenticatedClient(string $suffix = ''): array
    {
        $client = static::createClient();
        $email = 'message_test_' . $suffix . uniqid() . '@test.com';

        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'MessageUser' . $suffix,
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

    public function testGetMessages(): void
    {
        [$client] = $this->createAuthenticatedClient('get');
        $client->request('GET', '/api/messages/');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('sent', $data);
        $this->assertArrayHasKey('received', $data);
    }

    public function testCreateMessage(): void
    {
        [$client, $userAId] = $this->createAuthenticatedClient('A');

        // Créer un deuxième user
        $email = 'message_b_' . uniqid() . '@test.com';
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
            '/api/messages/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'contenu' => 'Bonjour, je voudrais échanger !',
                'receiver_id' => $userBId
            ])
        );

        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
    }

    public function testCreateMessageWithMissingFields(): void
    {
        [$client, $userAId] = $this->createAuthenticatedClient('B');

        $client->request(
            'POST',
            '/api/messages/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'contenu' => 'Bonjour'
            ])
        );

        $this->assertResponseStatusCodeSame(400);
    }

    public function testGetMessagesWithoutAuth(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/messages/');
        $this->assertResponseStatusCodeSame(401);
    }
}