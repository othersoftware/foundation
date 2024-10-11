<?php

use Illuminate\Support\Str;


if (! function_exists('str_concat_dash')) {
    function str_concat_dash(...$args): string
    {
        return implode('-', $args);
    }
}

if (! function_exists('str_concat_underscore')) {
    function str_concat_underscore(...$args): string
    {
        return implode('_', $args);
    }
}

if (! function_exists('str_concat_dot')) {
    function str_concat_dot(...$args): string
    {
        return implode('.', $args);
    }
}

if (! function_exists('str_concat_uri')) {
    function str_concat_uri(...$args): string
    {
        return implode('/', $args);
    }
}

if (! function_exists('str_normalize_path')) {
    function str_normalize_path(string $path): string
    {
        return preg_replace('/\/+/', '/', str_replace(['/', '\\'], '/', $path));
    }
}

if (! function_exists('str_initials')) {
    function str_initials(string $name): string
    {
        $parts = explode(' ', trim($name));

        $firstName = array_shift($parts);
        $lastName = array_pop($parts);

        return Str::substr($firstName, 0, 1) . Str::substr($lastName, 0, 1);
    }
}

if (! function_exists('str_concat_path')) {
    function str_concat_path($args): string
    {
        $segments = is_array($args) ? $args : func_get_args();

        return str_replace('/', DIRECTORY_SEPARATOR, str_normalize_path(join('/', $segments)));
    }
}

if (! function_exists('str_shifted')) {
    function str_shifted(mixed $content, int $depth = 0, int $spaces = 1, string $char = ' '): string
    {
        $content = (string) $content;

        for ($i = 1; $i <= ($depth * $spaces); $i++) {
            $content = $char . $content;
        }

        return $content;
    }
}

if (! function_exists('str_leading_zeros')) {
    function str_leading_zeros(mixed $number, int $min = 5): string
    {
        return str_pad((string) $number, $min, '0', STR_PAD_LEFT);
    }
}

if (! function_exists('str_to_dot')) {
    function str_to_dot(string $name): string
    {
        return (string) Str::of($name)->replace('[', '.')->remove(']')->trim('.');
    }
}

if (! function_exists('str_prefixed')) {
    function str_prefixed(string $name, string $prefix = null): string
    {
        return $prefix ? str_concat_underscore($prefix, $name) : $name;
    }
}
