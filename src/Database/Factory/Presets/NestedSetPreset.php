<?php

namespace OtherSoftware\Database\Factory\Presets;


use Doctrine\DBAL\Schema\Table;
use Doctrine\DBAL\Types\Types;
use Exception;
use Kalnoy\Nestedset\NestedSet;
use OtherSoftware\Database\Factory\AbstractPreset;


class NestedSetPreset extends AbstractPreset
{
    public function make(Table $table): void
    {
        if (! class_exists('Kalnoy\Nestedset\NestedSet')) {
            throw new Exception("This preset requires kalnoy/nestedset package!");
        }

        $table->addColumn(NestedSet::LFT, Types::INTEGER, [
            'notnull'  => false,
            'default'  => 0,
            'unsigned' => true,
        ]);

        $table->addColumn(NestedSet::RGT, Types::INTEGER, [
            'notnull'  => false,
            'default'  => 0,
            'unsigned' => true,
        ]);

        $table->addColumn(NestedSet::PARENT_ID, Types::BIGINT, [
            'notnull'  => false,
            'default'  => null,
            'unsigned' => true,
        ]);

        $table->addIndex([NestedSet::LFT, NestedSet::RGT, NestedSet::PARENT_ID]);
    }
}
