<?php


if (! function_exists('forward')) {
    function forward($to, $status = 302, $headers = [], $secure = null)
    {
        return app('redirect')->forward($to, $status, $headers, $secure);
    }
}
