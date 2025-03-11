<?php

namespace OtherSoftware\Database\Factory\Structure;


use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractStructure;
use OtherSoftware\Database\Factory\Definitions\DefinesIndex;


class TimeStructure extends AbstractStructure
{
    use DefinesIndex;


    public function __construct(string $name)
    {
        parent::__construct($name);
    }


    function type(): string
    {
        return Types::TIME_MUTABLE;
    }
}
