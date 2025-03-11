<?php

namespace OtherSoftware\Database\Factory\Definitions;


trait DefinesUnsignedNumber
{
    public function unsigned(bool $value = true): static
    {
        $this->options['unsigned'] = $value;

        return $this;
    }
}
