<?php

namespace OtherSoftware\Database\Factory\Structure;


use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractStructure;
use OtherSoftware\Database\Factory\Definitions\DefinesForeignKey;


class ForeignUuidStructure extends AbstractStructure
{
    use DefinesForeignKey;


    public function __construct(string $name)
    {
        parent::__construct($name);

        $this->options['length'] = 36;
        $this->options['fixed'] = true;
    }


    public function type(): string
    {
        return Types::STRING;
    }
}
