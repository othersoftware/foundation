<?php

namespace OtherSoftware\Database\Factory\Concerns;


use OtherSoftware\Database\Factory\Indexes\IndexFactory;


trait CreatesIndexes
{
    public function fullText(array|string $columns, ?string $index = null): IndexFactory
    {
        return tap(new IndexFactory($columns, $index, ['fulltext']), function ($factory) {
            $this->indexes[] = $factory;
        });
    }


    public function index(array|string $columns, ?string $index = null): IndexFactory
    {
        return tap(new IndexFactory($columns, $index), function ($factory) {
            $this->indexes[] = $factory;
        });
    }
}
