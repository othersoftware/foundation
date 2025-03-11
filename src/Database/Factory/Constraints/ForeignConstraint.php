<?php

namespace OtherSoftware\Database\Factory\Constraints;


use Doctrine\DBAL\Schema\Table;
use Illuminate\Support\Arr;
use OtherSoftware\Database\Factory\AbstractConstraint;


final class ForeignConstraint extends AbstractConstraint
{
    private array $foreignColumns;


    private string $foreignTable;


    private string|null $index;


    private array $localColumns;


    private array $options = [];


    public function __construct(array|string $columns, string $index = null)
    {
        $this->localColumns = Arr::wrap($columns);
        $this->index = $index;
    }


    public function cascadeOnDelete(): ForeignConstraint
    {
        $this->options['onDelete'] = 'CASCADE';

        return $this;
    }


    public function cascadeOnUpdate(): ForeignConstraint
    {
        $this->options['onUpdate'] = 'CASCADE';

        return $this;
    }


    public function make(Table $table): void
    {
        if (isset($this->foreignTable) && isset($this->foreignColumns)) {
            $table->addForeignKeyConstraint($this->foreignTable, $this->localColumns, $this->foreignColumns, $this->options, $this->index);
        }
    }


    public function noActionOnDelete(): ForeignConstraint
    {
        $this->options['onDelete'] = 'NO ACTION';

        return $this;
    }


    public function noActionOnUpdate(): ForeignConstraint
    {
        $this->options['onUpdate'] = 'NO ACTION';

        return $this;
    }


    public function on(string $table): ForeignConstraint
    {
        $this->foreignTable = $table;

        return $this;
    }


    public function references(array|string $columns): ForeignConstraint
    {
        $this->foreignColumns = Arr::wrap($columns);

        return $this;
    }


    public function restrictOnDelete(): ForeignConstraint
    {
        $this->options['onDelete'] = 'RESTRICT';

        return $this;
    }


    public function restrictOnUpdate(): ForeignConstraint
    {
        $this->options['onUpdate'] = 'RESTRICT';

        return $this;
    }


    public function setDefaultOnDelete(): ForeignConstraint
    {
        $this->options['onDelete'] = 'SET DEFAULT';

        return $this;
    }


    public function setDefaultOnUpdate(): ForeignConstraint
    {
        $this->options['onUpdate'] = 'SET DEFAULT';

        return $this;
    }


    public function setNullOnDelete(): ForeignConstraint
    {
        $this->options['onDelete'] = 'SET NULL';

        return $this;
    }


    public function setNullOnUpdate(): ForeignConstraint
    {
        $this->options['onUpdate'] = 'SET NULL';

        return $this;
    }
}
