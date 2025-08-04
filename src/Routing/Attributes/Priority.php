<?php

namespace OtherSoftware\Routing\Attributes;


use Attribute;


#[Attribute(Attribute::TARGET_METHOD)]
readonly class Priority
{
    public int $priority;


    public function __construct(string $priority)
    {
        $this->priority = $priority;
    }
}
