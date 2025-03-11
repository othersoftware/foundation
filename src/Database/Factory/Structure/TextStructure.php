<?php

namespace OtherSoftware\Database\Factory\Structure;


use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractStructure;
use OtherSoftware\Database\Factory\Definitions\DefinesIndex;


class TextStructure extends AbstractStructure
{
    use DefinesIndex;


    public function __construct(string $name)
    {
        parent::__construct($name);

        $this->options['length'] = 65535;
    }


    function type(): string
    {
        return Types::TEXT;
    }
}
