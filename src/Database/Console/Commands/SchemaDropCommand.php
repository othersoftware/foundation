<?php

namespace OtherSoftware\Database\Console\Commands;


use Illuminate\Console\Command;
use OtherSoftware\Database\DoctrineConnectionFactory;


class SchemaDropCommand extends Command
{
    protected $signature = 'database:schema:drop';


    public function handle(DoctrineConnectionFactory $factory): int
    {
        $schemaManager = $factory->getDoctrineSchemaManager(true);
        $existing = $schemaManager->listDatabases();

        if (! in_array($database = $factory->getDoctrineSchemaName(), $existing)) {
            $this->getOutput()->info("Database {$database} doesn't exists!");

            return 0;
        }

        $schemaManager->dropDatabase($database);

        $this->getOutput()->success("Database {$database} has been dropped!");

        return 0;
    }
}
