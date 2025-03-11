<?php

namespace OtherSoftware\Database\Factory\Definitions;


trait DefinesAutoIncrement
{
    public function autoIncrement(bool $value = true): static
    {
        $this->options['autoincrement'] = $value;

        return $this;
    }
}
