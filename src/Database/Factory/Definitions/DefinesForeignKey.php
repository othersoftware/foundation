<?php

namespace OtherSoftware\Database\Factory\Definitions;


use Illuminate\Support\Str;
use OtherSoftware\Database\Factory\Constraints\ForeignConstraint;


trait DefinesForeignKey
{
    private ForeignConstraint $foreignKey;


    public function bootDefinesForeignKey(): void
    {
        $this->foreignKey = $this->factory->foreign($this->name);
    }


    public function cascadeOnDelete(): static
    {
        $this->foreignKey->cascadeOnDelete();

        return $this;
    }


    public function cascadeOnUpdate(): static
    {
        $this->foreignKey->cascadeOnUpdate();

        return $this;
    }


    public function constrained($table = null, $column = 'id')
    {
        return $this->references($column)->on($table ?? Str::of($this->name)->beforeLast('_' . $column)->plural());
    }


    public function noActionOnDelete(): static
    {
        $this->foreignKey->noActionOnDelete();

        return $this;
    }


    public function noActionOnUpdate(): static
    {
        $this->foreignKey->noActionOnUpdate();

        return $this;
    }


    public function nullOnDelete(): static
    {
        $this->foreignKey->setNullOnDelete();

        return $this;
    }


    public function on(string $table): static
    {
        $this->foreignKey->on($table);

        return $this;
    }


    public function references(array|string $columns): static
    {
        $this->foreignKey->references($columns);

        return $this;
    }


    public function restrictOnDelete(): static
    {
        $this->foreignKey->restrictOnDelete();

        return $this;
    }


    public function restrictOnUpdate(): static
    {
        $this->foreignKey->restrictOnUpdate();

        return $this;
    }


    public function setDefaultOnDelete(): static
    {
        $this->foreignKey->setDefaultOnDelete();

        return $this;
    }


    public function setDefaultOnUpdate(): static
    {
        $this->foreignKey->setDefaultOnUpdate();

        return $this;
    }


    public function setNullOnDelete(): static
    {
        $this->foreignKey->setNullOnDelete();

        return $this;
    }


    public function setNullOnUpdate(): static
    {
        $this->foreignKey->setNullOnUpdate();

        return $this;
    }


    protected function setForeignKey(ForeignConstraint $foreignKey): static
    {
        $this->foreignKey = $foreignKey;

        return $this;
    }
}
