<?php

namespace OtherSoftware\Database\Console\Commands;


use Doctrine\DBAL\Configuration;
use Doctrine\DBAL\Schema\AbstractSchemaManager;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\Provider\SchemaProvider;
use Illuminate\Config\Repository;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;


class SchemaUpgradeCommand extends Command
{
    protected $signature = 'database:schema:upgrade';


    public function handle(Repository $config): int
    {
        $connection = $config->get('database.default');
        $name = Str::random(8);

        $config->set("database.connections.$connection.database", $name);

        $this->callSilent('database:schema:create');

        try {

            $this->callSilent('migrations:migrate', [
                '--allow-no-migration' => true,
                '--no-interaction' => true,
            ]);

            $this->call('migrations:diff', [
                '--allow-empty-diff' => true,
                '--no-interaction' => true,
            ]);

        } catch (Throwable $e) {
            $this->callSilent('database:schema:drop');
            throw $e;
        }

        $this->callSilent('database:schema:drop');

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
