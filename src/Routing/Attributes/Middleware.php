<?php

namespace OtherSoftware\Routing\Attributes;


use Attribute;


#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
readonly class Middleware
{
    public string $middleware;


    public function __construct(string $middleware, ...$args)
    {
        if (count($args) > 0) {
            $this->middleware = $middleware . ':' . implode(',', $args);
        } else {
            $this->middleware = $middleware;
        }
    }
}
