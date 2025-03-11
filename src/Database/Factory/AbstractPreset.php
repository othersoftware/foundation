<?php

namespace OtherSoftware\Database\Factory;


use Doctrine\DBAL\Schema\Table as SchemaTable;
use OtherSoftware\Database\Contracts\IStructureMaker;


abstract class AbstractPreset implements IStructureMaker
{
    protected Table $factory;


    public function after(SchemaTable $table, string $name): void
    {
        // This method is called before make column.
    }


    public function before(SchemaTable $table, string $name): void
    {
        // This method is called after make column.
    }


    public function boot(): void
    {
        // This method is called once factory has been injected.
    }


    public function setTableFactory(Table $factory): static
    {
        $this->factory = $factory;

        return $this;
    }
}
