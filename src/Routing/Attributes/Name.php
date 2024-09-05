<?php

namespace OtherSoftware\Routing\Attributes;


use Attribute;


#[Attribute(Attribute::TARGET_METHOD)]
readonly class Name
{
    public string $name;


    public function __construct(string $name)
    {
        $this->name = $name;
    }
}
