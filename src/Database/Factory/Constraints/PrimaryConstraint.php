<?php

namespace OtherSoftware\Database\Factory\Constraints;


use Doctrine\DBAL\Schema\Table;
use Illuminate\Support\Arr;
use OtherSoftware\Database\Factory\AbstractConstraint;


final class PrimaryConstraint extends AbstractConstraint
{
    private array $columns;

    private string|false $index;


    public function __construct(array|string $columns, string|false $index = false)
    {
        $this->columns = Arr::wrap($columns);
        $this->index = $index;
    }


    public function make(Table $table): void
    {
        $table->setPrimaryKey($this->columns, $this->index);
    }
}
