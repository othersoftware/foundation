<?php

namespace OtherSoftware\Foundation\Routing\Attributes;


use Attribute;


#[Attribute(Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
readonly class Method
{
    public array $methods;


    public function __construct(string $method, string ...$methods)
    {
        $this->methods = array_merge([$method], $methods);
    }
}
