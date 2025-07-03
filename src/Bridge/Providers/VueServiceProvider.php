<?php

namespace OtherSoftware\Bridge\Providers;


use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Foundation\CachesConfiguration;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\ValidationException;
use OtherSoftware\Bridge\ResponseFactory;
use OtherSoftware\Bridge\ServerConfiguration;
use OtherSoftware\Bridge\Toasts\ToastsManager;
use OtherSoftware\Bridge\View\Directives\RenderFoundationApp;
use OtherSoftware\Bridge\View\Directives\RenderFoundationHead;
use OtherSoftware\Bridge\View\Directives\RenderFoundationScript;
use OtherSoftware\Support\Facades\Toast;
use OtherSoftware\Support\Facades\Vue;


class VueServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->bootPublishable();

        $this->app->afterResolving(Handler::class, function (Handler $instance) {
            $this->bootAuthenticationRenderable($instance);
            $this->bootValidationRenderable($instance);
        });
    }


    public function register(): void
    {
        $this->mergeFoundationConfig();
        $this->mergeCacheStores();

        $this->registerServices();
        $this->registerBladeDirectives();
    }


    private function bootAuthenticationRenderable(Handler $instance): void
    {
        $instance->renderable(function (AuthenticationException $exception, Request $request) {
            if ($request->header('X-Stack-Router')) {
                if ($target = $exception->redirectTo($request)) {
                    return Vue::setRedirect($target);
                }
            }

            return null;
        });
    }


    private function bootPublishable(): void
    {
        $this->publishes([$this->getConfigurationPath() => config_path('foundation.php')], ['config']);
    }


    private function bootValidationRenderable(Handler $instance): void
    {
        $instance->renderable(function (ValidationException $exception, Request $request) {
            if ($request->header('X-Stack-Router')) {
                Vue::setErrors($exception->errors());
                Toast::danger(trans('validation.errors'));

                return Vue::toResponse($request)->setStatusCode($exception->status);
            }

            return null;
        });
    }


    private function getConfigurationPath(): string
    {
        return __DIR__ . '/../../../config/foundation.php';
    }


    private function mergeCacheStores(): void
    {
        if (! ($this->app instanceof CachesConfiguration && $this->app->configurationIsCached())) {
            config([
                'cache.stores.foundation.meta' => [
                    'driver' => 'file',
                    'path' => storage_path('framework/cache/foundation/meta'),
                ],
                'cache.stores.foundation.data' => [
                    'driver' => 'file',
                    'path' => storage_path('framework/cache/foundation/data'),
                ],
                'cache.stores.foundation.views' => [
                    'driver' => 'file',
                    'path' => storage_path('framework/cache/foundation/views'),
                ],
            ]);
        }
    }


    private function mergeFoundationConfig(): void
    {
        $this->mergeConfigFrom($this->getConfigurationPath(), 'foundation');
    }


    private function registerBladeDirectives(): void
    {
        $this->callAfterResolving('blade.compiler', function ($blade) {
            $blade->directive('foundationApp', [RenderFoundationApp::class, 'compile']);
            $blade->directive('foundationHead', [RenderFoundationHead::class, 'compile']);
            $blade->directive('foundationScript', [RenderFoundationScript::class, 'compile']);
        });
    }


    private function registerServices(): void
    {
        $this->app->singleton(ServerConfiguration::class);

        $this->app->scoped('frontend', ResponseFactory::class);
        $this->app->scoped('toasts', ToastsManager::class);
    }
}
