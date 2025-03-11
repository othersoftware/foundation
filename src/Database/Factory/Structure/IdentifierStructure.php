<?php

namespace OtherSoftware\Database\Factory\Structure;


use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractStructure;


class IdentifierStructure extends AbstractStructure
{
    public function __construct(string $name)
    {
        parent::__construct($name);

        $this->options['autoincrement'] = true;
        $this->options['unsigned'] = true;
    }


    public function booted(): void
    {
        $this->factory->primary($this->name);
    }


    function type(): string
    {
        return Types::BIGINT;
    }
}
