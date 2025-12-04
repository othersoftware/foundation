<?php

namespace OtherSoftware\Database\Console\Commands;


use Illuminate\Console\Command;
use Symfony\Component\Console\Attribute\AsCommand;


#[AsCommand(name: 'database:schema:fresh')]
class SchemaFreshCommand extends Command
{
    public function handle(): int
    {
        $this->call('database:schema:drop');
        $this->call('database:schema:create');
        $this->call('migrations:migrate', ['--allow-no-migration' => true, '--no-interaction' => true]);
        $this->call('database:schema:update');
        $this->call('db:seed:dictionaries', ['--no-interaction' => true]);
        $this->call('db:seed', ['--force' => true, '--no-interaction' => true]);

        return 0;
    }
}
