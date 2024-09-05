<?php

namespace OtherSoftware\Foundation\Providers;


use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\ValidationException;
use OtherSoftware\Bridge\ResponseFactory;
use OtherSoftware\Support\Facades\Vue;


class FrontendServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->app->afterResolving(Handler::class, function (Handler $instance) {
            $this->bootVisitorValidationRenderable($instance);
        });
    }


    public function register(): void
    {
        $this->app->singleton('frontend', function () {
            return new ResponseFactory();
        });
    }


    private function bootVisitorValidationRenderable(Handler $instance): void
    {
        $instance->renderable(function (ValidationException $exception, Request $request) {
            if ($request->header('X-Stack-Router')) {
                return Vue::setErrors($exception->errors())->toResponse($request)->setStatusCode($exception->status);
            }

            return null;
        });
    }
}
