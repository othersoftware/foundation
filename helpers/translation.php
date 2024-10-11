<?php

use Astrotomic\Translatable\Locales;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;


if (! function_exists('run_with_locale')) {
    function run_with_locale(string $locale, callable $callback)
    {
        $previous = App::getLocale();
        App::setLocale($locale);

        return tap($callback(), function () use ($previous) {
            App::setLocale($previous);
        });
    }
}

if (! function_exists('locales')) {
    function locales(): Collection
    {
        return collect(resolve(Locales::class)->all());
    }
}
