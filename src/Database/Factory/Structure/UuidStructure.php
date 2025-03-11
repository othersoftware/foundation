<?php

namespace OtherSoftware\Database\Factory\Structure;


use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractStructure;


class UuidStructure extends AbstractStructure
{
    public function __construct(string $name)
    {
        parent::__construct($name);

        $this->options['length'] = 36;
        $this->options['fixed'] = true;
    }


    public function booted(): void
    {
        $this->factory->primary($this->name);
    }


    function type(): string
    {
        return Types::STRING;
    }
}
