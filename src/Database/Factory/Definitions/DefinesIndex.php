<?php

namespace OtherSoftware\Database\Factory\Definitions;


use Doctrine\DBAL\Schema\Table;


trait DefinesIndex
{
    private bool $hasIndex = false;


    public function index(): static
    {
        $this->hasIndex = true;

        return $this;
    }


    public function afterDefinesIndex(Table $table, string $name): void
    {
        if ($this->hasIndex) {
            $table->addIndex([$name]);
        }
    }
}
