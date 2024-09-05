<?php

namespace OtherSoftware\Foundation\Providers;


use Illuminate\Routing\RoutingServiceProvider as BaseRoutingServiceProvider;
use OtherSoftware\Routing\Router;


class RoutingServiceProvider extends BaseRoutingServiceProvider
{
    protected function registerRouter(): void
    {
        $this->app->singleton('router', function ($app) {
            return new Router($app['events'], $app);
        });
    }
}
