<?php

namespace OtherSoftware\Translation\Providers;


use Illuminate\Support\ServiceProvider;
use OtherSoftware\Translation\Locales;


class TranslationServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([__DIR__ . '/../../../config/translations.php' => config_path('translations.php')], 'config');
        }

        $this->loadJsonTranslationsFrom(__DIR__ . '/../../../lang/validation');
    }


    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../../../config/translations.php', 'translations');

        $this->registerTranslatableHelper();
    }


    protected function registerTranslatableHelper(): void
    {
        $this->app->singleton('translatable.locales', Locales::class);
        $this->app->singleton(Locales::class);
    }
}
