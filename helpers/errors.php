<?php


use OtherSoftware\Exceptions\LocalDebuggingException;


if (! function_exists('impossible')) {
    function impossible(string $message = 'Something very weird has just happened here. Happy debugging!'): never
    {
        throw new OtherSoftware\Exceptions\WhatTheHellJustHappenedException($message);
    }
}


if (! function_exists('report_with_result')) {
    /**
     * Reports given exception and returns a given result, if in production.
     * By default, a `false` value is returned.
     *
     * @template TResult of mixed
     *
     * @param Throwable|string $exception
     * @param TResult $result
     *
     * @return TResult
     * @noinspection PhpDocMissingThrowsInspection
     */
    function report_with_result(Throwable|string $exception, mixed $result = false): mixed
    {
        if (app()->isLocal()) {
            /** @noinspection PhpUnhandledExceptionInspection */
            throw new LocalDebuggingException(is_string($exception) ? new Exception($exception) : $exception);
        }

        report($exception);

        return $result;
    }
}
