<?php

namespace OtherSoftware\Database\PDO;

use Doctrine\DBAL\Driver\AbstractPostgreSQLDriver;
use OtherSoftware\Database\PDO\Concerns\ConnectsToDatabase;


class PostgresDriver extends AbstractPostgreSQLDriver
{
    use ConnectsToDatabase;

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'pdo_pgsql';
    }
}
