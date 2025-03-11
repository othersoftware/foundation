<?php

namespace OtherSoftware\Database\Console\Commands;


use Doctrine\DBAL\Configuration;
use Doctrine\DBAL\Schema\AbstractSchemaManager;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\DependencyFactory;
use Doctrine\Migrations\Provider\SchemaProvider;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;


class SchemaUpdateCommand extends Command
{
    protected $signature = 'database:schema:update';


    public function handle(DependencyFactory $dependencyFactory): int
    {
        $connection = $dependencyFactory->getConnection();
        $configuration = $connection->getConfiguration();
        $schemaProvider = $dependencyFactory->getSchemaProvider();
        $schemaManager = $connection->createSchemaManager();
        $platform = $connection->getDatabasePlatform();

        $comparator = $schemaManager->createComparator();

        $fromSchema = $this->createFromSchema($schemaManager);
        $toSchema = $this->createToSchema($schemaProvider, $configuration);

        $sql = $platform->getAlterSchemaSQL($comparator->compareSchemas($fromSchema, $toSchema));

        if (count($sql) === 0) {
            $this->getOutput()->success('You\'re up to date with your schema!');

            return 0;
        }

        $this->getOutput()->info('Updating your schema with ' . count($sql) . ' changes.');

        // Since PHP 8 we cannot use transactions for CREATE/ALTER/DROP etc.
        // in MySQL platform, since these statements auto-commit transactions
        // which causes PDO driver to fail.
        $this->withProgressBar($sql, function ($query) use ($connection) {
            $connection->executeStatement($query);
        });

        $this->line("\n");
        $this->getOutput()->success('You\'re up to date with your schema!');

        return 0;
    }


    protected function connectionConfigWithoutDatabase(): array
    {
        $config = DB::connection()->getConfig();

        return Arr::set($config, 'database', '');
    }


    protected function schemaName(): string
    {
        return DB::connection()->getConfig('database');
    }


    private function createFromSchema(AbstractSchemaManager $schemaManager): Schema
    {
        return $schemaManager->introspectSchema();
    }


    private function createToSchema(SchemaProvider $schemaProvider, Configuration $configuration): Schema
    {
        $toSchema = $schemaProvider->createSchema();
        $schemaAssetsFilter = $configuration->getSchemaAssetsFilter();

        if ($schemaAssetsFilter !== null) {
            foreach ($toSchema->getTables() as $table) {
                $tableName = $table->getName();

                if ($schemaAssetsFilter($this->resolveTableName($tableName))) {
                    continue;
                }

                $toSchema->dropTable($tableName);
            }
        }

        return $toSchema;
    }


    /**
     * Resolve a table name from its fully qualified name. The `$name` argument
     * comes from Doctrine\DBAL\Schema\Table#getName which can sometimes return
     * a namespaced name with the form `{namespace}.{tableName}`. This extracts
     * the table name from that.
     */
    private function resolveTableName(string $name): string
    {
        $pos = strpos($name, '.');

        return $pos === false ? $name : substr($name, $pos + 1);
    }
}
