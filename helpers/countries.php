<?php

use Illuminate\Support\Facades\App;
use Symfony\Component\Intl\Countries;


if (! function_exists('countries_dictionary')) {
    function countries_dictionary(): array
    {
        return collect(Countries::getNames(App::getLocale()))->map(fn(string $label, string $value) => compact('label', 'value'))->values()->toArray();
    }
}

if (! function_exists('countries_implicitly_addressed')) {
    function countries_implicitly_addressed(): array
    {
        return ['PL'];
    }
}
