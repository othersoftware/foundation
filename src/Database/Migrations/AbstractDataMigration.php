<?php

namespace OtherSoftware\Database\Migrations;


use Doctrine\Migrations\AbstractMigration;


abstract class AbstractDataMigration extends AbstractMigration
{
    public function processSourceFile(string $path): void
    {
        if ($this->isRunningInUpgrade()) {
            return;
        }

        $stream = fopen($path, 'r');

        while (($line = fgets($stream)) !== false) {
            $this->addSql($line);
        }

        fclose($stream);
    }


    private function isRunningInUpgrade(): bool
    {
        return in_array('database:schema:upgrade', app('request')->server('argv', []));
    }
}
