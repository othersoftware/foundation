<?php

use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;
use Symfony\Component\Intl\Countries;
use Symfony\Component\Intl\Currencies;


if (! function_exists('countries_dictionary')) {
    function countries_dictionary(): array
    {
        return collect(Countries::getNames(App::getLocale()))->map(fn($name, $code) => ['label' => sprintf('%s - %s', $code, $name), 'value' => $code])->values()->toArray();
    }
}

if (! function_exists('currencies_dictionary')) {
    function currencies_dictionary(): array
    {
        return collect(Currencies::getNames(App::getLocale()))->map(fn($name, $code) => ['label' => sprintf('%s - %s', $code, Str::ucfirst($name)), 'value' => $code])->values()->toArray();
    }
}

if (! function_exists('countries_implicitly_addressed')) {
    function countries_implicitly_addressed(): array
    {
        return ['PL'];
    }
}
