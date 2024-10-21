<?php

namespace OtherSoftware\Bridge\Providers;


use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\ValidationException;
use OtherSoftware\Bridge\ResponseFactory;
use OtherSoftware\Bridge\Toasts\ToastsManager;
use OtherSoftware\Support\Facades\Vue;


class VueServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->app->afterResolving(Handler::class, function (Handler $instance) {
            $this->bootAuthenticationRenderable($instance);
            $this->bootValidationRenderable($instance);
        });
    }


    public function register(): void
    {
        $this->app->singleton('frontend', function () {
            return new ResponseFactory();
        });

        $this->app->singleton('toasts', function () {
            return new ToastsManager();
        });
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


    private function bootValidationRenderable(Handler $instance): void
    {
        $instance->renderable(function (ValidationException $exception, Request $request) {
            if ($request->header('X-Stack-Router')) {
                return Vue::setErrors($exception->errors())->toResponse($request)->setStatusCode($exception->status);
            }

            return null;
        });
    }
}
