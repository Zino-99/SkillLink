<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class SkillTest extends WebTestCase
{
    private function getAuthenticatedClient(): array
    {
        $client = static::createClient();

        // Créer un utilisateur
        $email = 'skill_test_' . uniqid() . '@test.com';
        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'SkillTestUser',
                'email' => $email,
                'password' => 'password123'
            ])
        );

        // Se connecter
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

        return [$client, $email];
    }

    public function testGetSkills(): void
    {
        [$client] = $this->getAuthenticatedClient();

        $client->request('GET', '/api/skills/');

        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
    }

    public function testCreateSkill(): void
    {
        [$client] = $this->getAuthenticatedClient();

        $client->request(
            'POST',
            '/api/skills/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'titre' => 'React',
                'description' => 'Développement frontend avec React',
                'categorie' => 'Développement web'
            ])
        );

        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
    }

    public function testCreateSkillWithMissingFields(): void
    {
        [$client] = $this->getAuthenticatedClient();

        $client->request(
            'POST',
            '/api/skills/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'titre' => 'React'
            ])
        );

        $this->assertResponseStatusCodeSame(400);
    }

    public function testGetSkillsWithoutAuth(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/skills/');

        $this->assertResponseStatusCodeSame(401);
    }

    public function testDeleteSkill(): void
    {
        [$client] = $this->getAuthenticatedClient();

        // Créer une skill
        $client->request(
            'POST',
            '/api/skills/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'titre' => 'Python',
                'description' => 'Programmation Python',
                'categorie' => 'Développement'
            ])
        );

        $data = json_decode($client->getResponse()->getContent(), true);
        $skillId = $data['id'];

        // Supprimer la skill
        $client->request('DELETE', '/api/skills/' . $skillId);

        $this->assertResponseStatusCodeSame(200);
    }
}