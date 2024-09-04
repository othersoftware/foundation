<?php

namespace OtherSoftware\Foundation\Providers;


use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\ValidationException;
use OtherSoftware\Foundation\Facades\Frontend;
use OtherSoftware\Foundation\Frontend\Factory;


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
            return new Factory();
        });
    }


    private function bootVisitorValidationRenderable(Handler $instance): void
    {
        $instance->renderable(function (ValidationException $e, Request $request) {
            if ($request->header('X-Stack-Router')) {
                return Frontend::setErrors($e->errors())->toResponse($request)->setStatusCode($e->status, $e->getMessage());
            }

            return null;
        });
    }
}
