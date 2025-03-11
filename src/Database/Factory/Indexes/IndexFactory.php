<?php

namespace OtherSoftware\Database\Factory\Indexes;


use Doctrine\DBAL\Schema\Table;
use Illuminate\Support\Arr;


class IndexFactory
{
    private array $columns;


    private array $flags;


    private string|null $index;


    public function __construct(array|string $columns, string $index = null, array $flags = [])
    {
        $this->columns = Arr::wrap($columns);
        $this->index = $index;
        $this->flags = $flags;
    }


    public function make(Table $table): void
    {
        $table->addIndex($this->columns, $this->index, $this->flags);
    }
}
