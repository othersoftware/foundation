<?php

namespace OtherSoftware\Database\Factory\Presets;


use Doctrine\DBAL\Schema\Table;
use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractPreset;


class SoftDeletesPreset extends AbstractPreset
{
    public function make(Table $table): void
    {
        $table->addColumn('deleted_at', Types::DATETIME_MUTABLE, [
            'notnull' => false,
        ]);
    }
}
