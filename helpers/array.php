<?php

use Illuminate\Support\Str;


if (! function_exists('array_camel_keys')) {
    function array_camel_keys(array $array): array
    {
        return array_combine(array_map(fn($key) => Str::camel($key), array_keys($array)), $array);
    }
}


if (! function_exists('array_matrix')) {
    function array_matrix(array $input): array
    {
        $result = [[]];

        foreach ($input as $key => $values) {
            $append = [];

            foreach ($result as $product) {
                foreach ($values as $item) {
                    $product[$key] = $item;
                    $append[] = $product;
                }
            }

            $result = $append;
        }

        return $result;
    }
}

if (! function_exists('array_merge_deep')) {
    function array_merge_deep(array ...$arrays): array
    {
        $result = [];

        foreach ($arrays as $array) {
            foreach ($array as $key => $value) {
                if (is_integer($key)) {
                    $result[] = $value;
                } elseif (isset($result[$key]) && is_array($result[$key]) && is_array($value)) {
                    $result[$key] = array_merge_deep([$result[$key], $value]);
                } else {
                    $result[$key] = $value;
                }
            }
        }

        return $result;
    }
}
