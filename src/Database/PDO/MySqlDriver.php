<?php

namespace OtherSoftware\Database\PDO;

use Doctrine\DBAL\Driver\AbstractMySQLDriver;
use OtherSoftware\Database\PDO\Concerns\ConnectsToDatabase;


class MySqlDriver extends AbstractMySQLDriver
{
    use ConnectsToDatabase;

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'pdo_mysql';
    }
}
