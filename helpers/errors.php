<?php


if (! function_exists('impossible')) {
    function impossible(string $message = 'Something very weird has just happened here. Happy debugging!'): never
    {
        throw new OtherSoftware\Exceptions\WhatTheHellJustHappenedException($message);
    }
}


if (! function_exists('report_with_result')) {
    /**
     * Reports given exception and returns a given result.
     * By default, a `false` value is returned.
     *
     * @template TResult
     *
     * @param string|Throwable $exception
     * @param TResult $result
     *
     * @return TResult
     */
    function report_with_result(string|Throwable $exception, mixed $result = false): mixed
    {
        report($exception);

        return $result;
    }
}
