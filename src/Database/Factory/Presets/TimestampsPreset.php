<?php

namespace OtherSoftware\Database\Factory\Presets;


use Doctrine\DBAL\Schema\Table;
use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractPreset;


class TimestampsPreset extends AbstractPreset
{
    public function make(Table $table): void
    {
        $table->addColumn('created_at', Types::DATETIME_MUTABLE, [
            'notnull'   => false,
        ]);

        $table->addColumn('updated_at', Types::DATETIME_MUTABLE, [
            'notnull'   => false,
        ]);
    }
}
