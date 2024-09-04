<?php

namespace OtherSoftware\Foundation\Exceptions\Routing;


use Exception;
use Throwable;


class MissingParentRouteException extends Exception
{
    public function __construct(string $parent, string $current, int $code = 0, ?Throwable $previous = null)
    {
        $message = "Route [$current] is defined as child route of [$parent] which does not exist.";

        parent::__construct($message, $code, $previous);
    }
}
