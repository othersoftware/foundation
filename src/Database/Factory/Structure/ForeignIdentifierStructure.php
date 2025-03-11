<?php

namespace OtherSoftware\Database\Factory\Structure;


use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractStructure;
use OtherSoftware\Database\Factory\Definitions\DefinesForeignKey;


class ForeignIdentifierStructure extends AbstractStructure
{
    use DefinesForeignKey;


    public function __construct(string $name)
    {
        parent::__construct($name);

        $this->options['unsigned'] = true;
    }


    public function type(): string
    {
        return Types::BIGINT;
    }
}
