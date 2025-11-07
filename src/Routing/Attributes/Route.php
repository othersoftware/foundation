<?php

namespace OtherSoftware\Routing\Attributes;


use Attribute;


#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
readonly class Route
{
    public string $uri;
    public ?string $locale;


    public function __construct(string $uri, ?string $locale = null)
    {
        $this->uri = $uri;
        $this->locale = $locale;
    }
}
