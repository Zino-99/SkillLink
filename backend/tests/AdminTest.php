<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AdminTest extends WebTestCase
{
    private function createAdminClient(): array
    {
        $client = static::createClient();
        $email = 'admin_test_' . uniqid() . '@test.com';

        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'AdminTest',
                'email' => $email,
                'password' => 'password123'
            ])
        );

        $data = json_decode($client->getResponse()->getContent(), true);
        $userId = $data['user']['id'];

        $container = static::getContainer();
        $em = $container->get('doctrine')->getManager();
        $user = $em->getRepository(\App\Entity\User::class)->find($userId);
        $user->setRoles(['ROLE_ADMIN']);
        $em->flush();

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

        return [$client, $userId];
    }

    private function createUserClient(): array
    {
        $client = static::createClient();
        $email = 'user_test_' . uniqid() . '@test.com';

        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'UserTest',
                'email' => $email,
                'password' => 'password123'
            ])
        );

        $data = json_decode($client->getResponse()->getContent(), true);

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

        return [$client, $data['user']['id']];
    }

    public function testGetStats(): void
    {
        [$client] = $this->createAdminClient();
        $client->request('GET', '/api/admin/stats');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('users', $data);
        $this->assertArrayHasKey('skills', $data);
        $this->assertArrayHasKey('exchanges', $data);
        $this->assertArrayHasKey('reports', $data);
    }

    public function testGetUsers(): void
    {
        [$client] = $this->createAdminClient();
        $client->request('GET', '/api/admin/users');
        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
    }

    public function testAdminCanCreateUser(): void
    {
        [$client] = $this->createAdminClient();

        $client->request(
            'POST',
            '/api/admin/users',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'NewUser',
                'email' => 'newuser_' . uniqid() . '@test.com',
                'password' => 'password123',
                'roles' => ['ROLE_USER']
            ])
        );

        $this->assertResponseStatusCodeSame(201);
    }

    public function testAdminCanDeleteUser(): void
    {
        [$client] = $this->createAdminClient();

        // Créer un user à supprimer via l'API admin
        $client->request(
            'POST',
            '/api/admin/users',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'UserToDelete',
                'email' => 'delete_' . uniqid() . '@test.com',
                'password' => 'password123',
                'roles' => ['ROLE_USER']
            ])
        );

        $data = json_decode($client->getResponse()->getContent(), true);
        $userId = $data['id'];

        $client->request('DELETE', '/api/admin/users/' . $userId);
        $this->assertResponseStatusCodeSame(200);
    }

    public function testUserCannotAccessAdminRoutes(): void
    {
        [$client] = $this->createUserClient();
        $client->request('GET', '/api/admin/stats');
        $this->assertResponseStatusCodeSame(403);
    }

    public function testGetReports(): void
    {
        [$client] = $this->createAdminClient();
        $client->request('GET', '/api/admin/reports');
        $this->assertResponseStatusCodeSame(200);
    }
}