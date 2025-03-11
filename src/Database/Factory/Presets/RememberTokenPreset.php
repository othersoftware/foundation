<?php

namespace OtherSoftware\Database\Factory\Presets;


use Doctrine\DBAL\Schema\Table;
use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractPreset;


class RememberTokenPreset extends AbstractPreset
{
    public function make(Table $table): void
    {
        $table->addColumn('remember_token', Types::STRING, [
            'notnull' => false,
            'length'  => 100,
        ]);
    }
}
