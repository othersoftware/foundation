<?php

namespace OtherSoftware\Exceptions;


use RuntimeException;
use Throwable;


class LocalDebuggingException extends RuntimeException
{
    public function __construct(Throwable $previous)
    {
        parent::__construct($previous->getMessage(), $previous->getCode(), $previous);
    }
}
