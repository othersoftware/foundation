<?php

namespace OtherSoftware\Routing\Exceptions;


use LogicException;
use Throwable;


class OutsideRouterScopeException extends LogicException
{
    public function __construct(int $code = 0, ?Throwable $previous = null)
    {
        $message = "You are trying to access currently running route, outside of router scope. You can only access currently running route instance only within router action callbacks.";

        parent::__construct($message, $code, $previous);
    }
}
