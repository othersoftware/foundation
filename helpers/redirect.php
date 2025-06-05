<?php


if (! function_exists('forward')) {
    function forward($to, $status = 302, $headers = [], $secure = null)
    {
        return app('redirect')->forward($to, $status, $headers, $secure);
    }
}

if (! function_exists('refresh')) {
    function refresh($status = 302, $headers = [], $fallback = false)
    {
        return app('redirect')->refresh($status, $headers, $fallback);
    }
}
