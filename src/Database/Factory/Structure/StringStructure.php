<?php

namespace OtherSoftware\Database\Factory\Structure;


use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractStructure;
use OtherSoftware\Database\Factory\Definitions\DefinesIndex;
use OtherSoftware\Database\Factory\Definitions\DefinesPrimaryKey;


class StringStructure extends AbstractStructure
{
    use DefinesPrimaryKey;
    use DefinesIndex;


    public function __construct(string $name, int $length)
    {
        parent::__construct($name);

        $this->options['length'] = $length;
    }


    function type(): string
    {
        return Types::STRING;
    }
}
