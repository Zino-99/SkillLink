<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ReportTest extends WebTestCase
{
    private function createAuthenticatedClient(string $suffix = ''): array
    {
        $client = static::createClient();
        $email = 'report_test_' . $suffix . uniqid() . '@test.com';

        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'ReportUser' . $suffix,
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

    public function testGetReports(): void
    {
        [$client] = $this->createAuthenticatedClient('get');
        $client->request('GET', '/api/reports/');
        $this->assertResponseStatusCodeSame(200);
    }

    public function testCreateReport(): void
    {
        [$client, $userAId] = $this->createAuthenticatedClient('A');

        // Créer un deuxième user à signaler
        $email = 'report_b_' . uniqid() . '@test.com';
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
            '/api/reports/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'description' => 'Comportement inapproprié',
                'reported_id' => $userBId
            ])
        );

        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
    }

    public function testCannotReportSelf(): void
    {
        [$client, $userAId] = $this->createAuthenticatedClient('B');

        $client->request(
            'POST',
            '/api/reports/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'description' => 'Test auto-signalement',
                'reported_id' => $userAId
            ])
        );

        $this->assertResponseStatusCodeSame(400);
    }

    public function testGetReportsWithoutAuth(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/reports/');
        $this->assertResponseStatusCodeSame(401);
    }
}