<?php

namespace OtherSoftware\Exceptions;


use Exception;
use Throwable;


class LocalDebuggingException extends Exception
{
    public function __construct(Throwable $previous)
    {
        parent::__construct($previous->getMessage(), $previous->getCode(), $previous);
    }
}
