<?php

namespace OtherSoftware\Routing\Attributes;


use Attribute;


#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
class Authorize
{
    public string $middleware;


    public function __construct(callable $ability)
    {
        assert(is_array($ability) && is_callable($ability), 'Ability must be a valid array type callable like [SomeGate::class, \'canDoSomething\'].');

        $this->middleware = \OtherSoftware\Http\Middleware\Authorize::class . ':' . join(',', $ability);
    }
}
