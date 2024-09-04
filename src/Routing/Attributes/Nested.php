<?php

namespace OtherSoftware\Foundation\Routing\Attributes;


use Attribute;


#[Attribute(Attribute::TARGET_METHOD)]
readonly class Nested
{
    public mixed $parent;


    public function __construct(callable|string $parent)
    {
        $this->parent = $parent;
    }
}
