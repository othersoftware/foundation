<?php

use Illuminate\Support\Facades\App;
use Symfony\Component\Intl\Countries;


if (! function_exists('countries_dictionary')) {
    function countries_dictionary(): array
    {
        static $dict;

        if (! isset($dict)) {
            $dict = collect(Countries::getNames(App::getLocale()))->map(fn($name, $code) => ['label' => sprintf('%s - %s', $code, $name), 'value' => $code])->values()->toArray();
        }

        return $dict;
    }
}

if (! function_exists('countries_implicitly_addressed')) {
    function countries_implicitly_addressed(): array
    {
        return ['PL'];
    }
}
