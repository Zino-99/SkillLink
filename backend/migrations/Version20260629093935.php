<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260629093935 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE exchange_request (id INT AUTO_INCREMENT NOT NULL, status VARCHAR(255) NOT NULL, date DATETIME NOT NULL, sender_id INT NOT NULL, receiver_id INT NOT NULL, skill_id INT NOT NULL, INDEX IDX_7C5D591EF624B39D (sender_id), INDEX IDX_7C5D591ECD53EDB6 (receiver_id), INDEX IDX_7C5D591E5585C142 (skill_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE exchange_request ADD CONSTRAINT FK_7C5D591EF624B39D FOREIGN KEY (sender_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE exchange_request ADD CONSTRAINT FK_7C5D591ECD53EDB6 FOREIGN KEY (receiver_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE exchange_request ADD CONSTRAINT FK_7C5D591E5585C142 FOREIGN KEY (skill_id) REFERENCES skill (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE exchange_request DROP FOREIGN KEY FK_7C5D591EF624B39D');
        $this->addSql('ALTER TABLE exchange_request DROP FOREIGN KEY FK_7C5D591ECD53EDB6');
        $this->addSql('ALTER TABLE exchange_request DROP FOREIGN KEY FK_7C5D591E5585C142');
        $this->addSql('DROP TABLE exchange_request');
    }
}
