<?php

namespace OtherSoftware\Database;


use Doctrine\DBAL\Connection as DoctrineConnection;
use Illuminate\Database\Connection;
use Illuminate\Database\Connectors\ConnectionFactory;
use Illuminate\Database\MariaDbConnection;
use Illuminate\Database\MySqlConnection;
use Illuminate\Database\PostgresConnection;
use Illuminate\Database\SQLiteConnection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use OtherSoftware\Database\PDO\MySqlDriver;
use OtherSoftware\Database\PDO\PostgresDriver;
use OtherSoftware\Database\PDO\SQLiteDriver;
use OtherSoftware\Database\PDO\SqlServerConnection;
use OtherSoftware\Database\PDO\SqlServerDriver;


class DoctrineConnectionFactory
{
    private Connection $connection;


    private DoctrineConnection $doctrineConnection;


    private ConnectionFactory $factory;


    public function __construct(ConnectionFactory $factory)
    {
        $this->factory = $factory;
    }


    public function getConnection(bool $withoutSchema = false)
    {
        return $this->factory->make($this->getConnectionConfig($withoutSchema));
    }


    /**
     * Get the Doctrine DBAL database connection instance.
     *
     * @return DoctrineConnection
     */
    public function getDoctrineConnection(bool $withoutSchema = false): DoctrineConnection
    {
        $connection = $this->getConnection($withoutSchema);
        $driver = $this->getDoctrineDriver($connection);

        $params = array_filter([
            'pdo' => $connection->getPdo(),
            'dbname' => $connection->getDatabaseName(),
            'driver' => $driver->getName(),
            'serverVersion' => $connection->getConfig('server_version'),
        ]);

        return new DoctrineConnection($params, $driver);
    }


    public function getDoctrineSchemaManager(bool $withoutSchema = false)
    {
        return $this->getDoctrineConnection($withoutSchema)->createSchemaManager();
    }


    public function getDoctrineSchemaName(): string
    {
        return DB::connection()->getConfig('database');
    }


    protected function getConnectionConfig(bool $withoutSchema = false): array
    {
        $config = DB::connection()->getConfig();

        if ($withoutSchema) {
            Arr::set($config, 'database', '');
        }

        return $config;
    }


    private function getDoctrineDriver(Connection $connection)
    {
        return match (true) {
            $connection instanceof MySqlConnection => new MySqlDriver(),
            $connection instanceof MariaDbConnection => new MySqlDriver(),
            $connection instanceof SQLiteConnection => new SQLiteDriver(),
            $connection instanceof PostgresConnection => new PostgresDriver(),
            $connection instanceof SqlServerConnection => new SqlServerDriver(),
            default => throw new \RuntimeException('Unsupported SQL driver!'),
        };
    }
}
