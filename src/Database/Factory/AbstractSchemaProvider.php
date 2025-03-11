<?php

namespace OtherSoftware\Database\Factory;


use ReflectionClass;


abstract class AbstractSchemaProvider
{
    abstract public function provide(Table $table): void;


    public function getTableName(): string
    {
        $reflection = new ReflectionClass($this);

        $path = $reflection->getFileName();

        return pathinfo($path, PATHINFO_FILENAME);
    }
}
