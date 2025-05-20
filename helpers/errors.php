<?php

if (! function_exists('impossible')) {
    function impossible(string $message = 'This should never happen.'): never
    {
        throw new \RuntimeException($message);
    }
}
