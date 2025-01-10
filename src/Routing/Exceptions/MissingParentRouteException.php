<?php

namespace OtherSoftware\Routing\Exceptions;


use LogicException;
use Throwable;


class MissingParentRouteException extends LogicException
{
    public function __construct(string $parent, string $current, int $code = 0, ?Throwable $previous = null)
    {
        $message = "Route [$current] is defined as child route of [$parent] which does not exist.";

        parent::__construct($message, $code, $previous);
    }
}
