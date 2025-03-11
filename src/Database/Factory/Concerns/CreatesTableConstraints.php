<?php

namespace OtherSoftware\Database\Factory\Concerns;


use OtherSoftware\Database\Factory\Constraints\ForeignConstraint;
use OtherSoftware\Database\Factory\Constraints\PrimaryConstraint;
use OtherSoftware\Database\Factory\Constraints\UniqueConstraint;


trait CreatesTableConstraints
{
    public function foreign(array|string $columns, string $index = null): ForeignConstraint
    {
        return tap(new ForeignConstraint($columns, $index), function ($factory) {
            $this->constraints[] = $factory;
        });
    }


    public function primary(array|string $columns, string|false $index = false)
    {
        return tap(new PrimaryConstraint($columns, $index), function ($factory) {
            $this->constraints[] = $factory;
        });
    }


    public function unique(array|string $columns, string $index = null)
    {
        return tap(new UniqueConstraint($columns, $index), function ($factory) {
            $this->constraints[] = $factory;
        });
    }
}
