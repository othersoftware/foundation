<?php

namespace OtherSoftware\Database\Factory\Definitions;


use Doctrine\DBAL\Schema\Table;


trait DefinesPrimaryKey
{
    private bool $isPrimary = false;


    public function afterDefinesPrimaryKey(Table $table, string $name): void
    {
        if ($this->isPrimary) {
            $table->setPrimaryKey([$name]);
        }
    }


    public function primary(): static
    {
        $this->isPrimary = true;

        return $this;
    }
}
