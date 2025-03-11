<?php

namespace OtherSoftware\Database\Factory\Constraints;


use Doctrine\DBAL\Schema\Table;
use Illuminate\Support\Arr;
use OtherSoftware\Database\Factory\AbstractConstraint;


final class UniqueConstraint extends AbstractConstraint
{
    private array $columns;

    private string|null $index;


    public function __construct(array|string $columns, string $index = null)
    {
        $this->columns = Arr::wrap($columns);
        $this->index = $index;
    }


    public function make(Table $table): void
    {
        $table->addUniqueIndex($this->columns, $this->index);
    }
}
