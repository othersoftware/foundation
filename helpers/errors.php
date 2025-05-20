<?php


if (! function_exists('impossible')) {
    function impossible(string $message = 'Something very weird has just happened here. Happy debugging!'): never
    {
        throw new OtherSoftware\Exceptions\WhatTheHellJustHappenedException($message);
    }
}
