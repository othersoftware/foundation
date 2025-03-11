<?php

namespace OtherSoftware\Database\Console\Commands;


use Illuminate\Console\Command;
use OtherSoftware\Database\DoctrineConnectionFactory;


class SchemaCreateCommand extends Command
{
    protected $signature = 'database:schema:create';


    public function handle(DoctrineConnectionFactory $factory): int
    {
        $schemaManager = $factory->getDoctrineSchemaManager(true);
        $existing = $schemaManager->listDatabases();

        if (in_array($database = $factory->getDoctrineSchemaName(), $existing)) {
            $this->getOutput()->info('Database ' . $database . ' already exists!');

            return 0;
        }

        $schemaManager->createDatabase($database);

        $this->getOutput()->success('Database ' . $database . ' has been created!');

        return 0;
    }
}
