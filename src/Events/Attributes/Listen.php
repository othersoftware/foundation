<?php

namespace OtherSoftware\Events\Attributes;


use Attribute;


#[Attribute(Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
readonly class Listen
{
    public string $event;


    public function __construct(string $event)
    {
        $this->event = $event;
    }
}
