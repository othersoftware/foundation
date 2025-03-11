<?php

return [
    'charset' => [
        'default' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
    ],

    'paths' => [
        base_path('app'),
        base_path('vendor'),
    ],

    'basic' => [

        'table_storage' => [
            'table_name' => 'doctrine_migration_versions',
            'version_column_name' => 'version',
            'version_column_length' => 1024,
            'executed_at_column_name' => 'executed_at',
            'execution_time_column_name' => 'execution_time',
        ],

        'migrations_paths' => [
            'Database\\Migrations' => database_path('migrations'),
        ],

        'all_or_nothing' => true,
        'transactional' => true,
        'check_database_platform' => true,
        'organize_migrations' => 'none',
        'connection' => null,
        'em' => null,

    ],
];
