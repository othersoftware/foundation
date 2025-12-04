<?php

namespace OtherSoftware\Database\Migrations;


use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;


abstract class AbstractDataMigration extends AbstractMigration
{
    public function preUp(Schema $schema): void
    {
        $this->skipIf(in_array('database:schema:upgrade', app('request')->server('argv', [])), 'Skipping as data migrations does not affect schema.');
    }
}
