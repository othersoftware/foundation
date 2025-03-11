<?php

namespace OtherSoftware\Database\Factory\Structure;


use Doctrine\DBAL\Types\Types;
use OtherSoftware\Database\Factory\AbstractStructure;
use OtherSoftware\Database\Factory\Definitions\DefinesIndex;
use OtherSoftware\Database\Factory\Definitions\DefinesUnsignedNumber;


class MoneyStructure extends AbstractStructure
{
    use DefinesIndex;
    use DefinesUnsignedNumber;


    public function __construct(string $name, int $precision = 19, int $scale = 4)
    {
        parent::__construct($name);

        $this->options['precision'] = $precision;
        $this->options['scale'] = $scale;
    }


    function type(): string
    {
        return Types::DECIMAL;
    }
}
