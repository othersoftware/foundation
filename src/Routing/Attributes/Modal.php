<?php

namespace OtherSoftware\Routing\Attributes;


use Attribute;


#[Attribute(Attribute::TARGET_METHOD)]
readonly class Modal
{
    public mixed $parent;


    public function __construct(callable|string $parent)
    {
        $this->parent = $parent;
    }
}
