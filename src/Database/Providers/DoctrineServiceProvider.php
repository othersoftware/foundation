<?php

namespace OtherSoftware\Database\Providers;


use Doctrine\Migrations\Configuration\Connection\ExistingConnection;
use Doctrine\Migrations\Configuration\Migration\ConfigurationArray;
use Doctrine\Migrations\DependencyFactory;
use Doctrine\Migrations\Provider\SchemaProvider as DoctrineSchemaProvider;
use Doctrine\Migrations\Tools\Console\Command\DiffCommand;
use Doctrine\Migrations\Tools\Console\Command\DumpSchemaCommand;
use Doctrine\Migrations\Tools\Console\Command\GenerateCommand;
use Doctrine\Migrations\Tools\Console\Command\MigrateCommand;
use Doctrine\Migrations\Tools\Console\Command\SyncMetadataCommand;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;
use OtherSoftware\Database\Console\Commands\SchemaCreateCommand;
use OtherSoftware\Database\Console\Commands\SchemaDropCommand;
use OtherSoftware\Database\Console\Commands\SchemaFreshCommand;
use OtherSoftware\Database\Console\Commands\SchemaUpdateCommand;
use OtherSoftware\Database\Console\Commands\SchemaUpgradeCommand;
use OtherSoftware\Database\Console\Commands\SeedDictionariesCommand;
use OtherSoftware\Database\DoctrineConnectionFactory;
use OtherSoftware\Database\Migrations\Provider\SchemaProvider;


class DoctrineServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->registerDoctrineConfig();
        $this->registerSchemaProvider();
        $this->registerDependencyFactory();
        $this->registerCommands();
    }


    private function registerCommands(): void
    {
        $this->commands([
            DiffCommand::class,
            MigrateCommand::class,
            DumpSchemaCommand::class,
            SyncMetadataCommand::class,
            GenerateCommand::class,
            SchemaCreateCommand::class,
            SchemaDropCommand::class,
            SchemaFreshCommand::class,
            SchemaUpdateCommand::class,
            SchemaUpgradeCommand::class,
            SeedDictionariesCommand::class,
        ]);
    }


    private function registerDependencyFactory(): void
    {
        $this->app->singleton(DependencyFactory::class, function (Application $app) {
            $connection = $app->make(DoctrineConnectionFactory::class)->getDoctrineConnection();

            $dependencyFactory = DependencyFactory::fromConnection(
                new ConfigurationArray($app['config']['doctrine']['basic']),
                new ExistingConnection($connection),
            );

            $dependencyFactory->setDefinition(
                DoctrineSchemaProvider::class,
                static fn() => $app['doctrine_schema_provider']
            );

            return $dependencyFactory;
        });
    }


    private function registerDoctrineConfig(): void
    {
        $this->publishes([__DIR__ . '/../../../config/doctrine.php' => config_path('doctrine.php')], ['config']);
        $this->mergeConfigFrom(__DIR__ . '/../../../config/doctrine.php', 'doctrine');
    }


    private function registerSchemaProvider(): void
    {
        $this->app->bind(DoctrineSchemaProvider::class, function () {
            return new SchemaProvider();
        });

        $this->app->alias(DoctrineSchemaProvider::class, 'doctrine_schema_provider');
    }
}
