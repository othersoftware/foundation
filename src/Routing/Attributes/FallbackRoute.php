<?php

namespace OtherSoftware\Routing\Attributes;


use Attribute;


#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD)]
readonly class FallbackRoute
{

}
