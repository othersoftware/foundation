<?php

namespace OtherSoftware\Database\Factory\Structure;


use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractStructure;
use OtherSoftware\Database\Factory\Definitions\DefinesAutoIncrement;
use OtherSoftware\Database\Factory\Definitions\DefinesIndex;
use OtherSoftware\Database\Factory\Definitions\DefinesUnsignedNumber;


class IntegerStructure extends AbstractStructure
{
    use DefinesIndex;
    use DefinesUnsignedNumber;
    use DefinesAutoIncrement;


    public function __construct(string $name)
    {
        parent::__construct($name);
    }


    function type(): string
    {
        return Types::INTEGER;
    }
}
