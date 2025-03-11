<?php

namespace OtherSoftware\Database\Contracts;


use Doctrine\DBAL\Schema\Table as SchemaTable;
use OtherSoftware\Database\Factory\Table;


interface IStructureMaker
{
    public function after(SchemaTable $table, string $name): void;


    public function before(SchemaTable $table, string $name): void;


    public function boot(): void;


    public function make(SchemaTable $table): void;


    public function setTableFactory(Table $factory): static;
}
