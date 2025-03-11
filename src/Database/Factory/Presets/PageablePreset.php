<?php

namespace OtherSoftware\Database\Factory\Presets;


use Doctrine\DBAL\Schema\Table;
use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractPreset;


class PageablePreset extends AbstractPreset
{
    public function make(Table $table): void
    {
        $table->addColumn('path', Types::STRING, [
            'notnull' => false,
            'length' => 512,
        ]);

        $table->addColumn('slug', Types::STRING, [
            'notnull' => false,
            'length' => 512,
        ]);
    }
}
