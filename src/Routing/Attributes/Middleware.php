<?php

namespace OtherSoftware\Foundation\Routing\Attributes;


use Attribute;


#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
readonly class Middleware
{
    public string $middleware;


    public function __construct(string $middleware)
    {
        $this->middleware = $middleware;
    }
}
