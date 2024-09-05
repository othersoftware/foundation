<?php

namespace OtherSoftware\Translation\Providers;


use Illuminate\Support\ServiceProvider;


class TranslationServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__ . '/../../../config/translations.php' => config_path('translations.php'),
            ], 'config');
        }
    }


    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../../../config/translations.php', 'translation');
    }
}
