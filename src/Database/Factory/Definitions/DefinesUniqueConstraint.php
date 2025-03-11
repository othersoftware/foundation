<?php

namespace OtherSoftware\Database\Factory\Definitions;


use Doctrine\DBAL\Schema\Table;


trait DefinesUniqueConstraint
{
    private bool $uniqueConstraint = false;


    public function afterDefinesUniqueConstraint(Table $table, string $name): void
    {
        if ($this->uniqueConstraint) {
            $table->addUniqueIndex([$name]);
        }
    }


    public function unique(): static
    {
        $this->uniqueConstraint = true;

        return $this;
    }
}
