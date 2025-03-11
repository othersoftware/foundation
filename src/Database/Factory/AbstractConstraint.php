<?php

namespace OtherSoftware\Database\Factory;


use Doctrine\DBAL\Schema\Table;


abstract class AbstractConstraint
{
    abstract public function make(Table $table): void;
}
