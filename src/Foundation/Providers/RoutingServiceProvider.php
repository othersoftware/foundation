<?php

namespace OtherSoftware\Foundation\Providers;


use Illuminate\Contracts\Routing\UrlGenerator as UrlGeneratorContract;
use Illuminate\Routing\RoutingServiceProvider as BaseRoutingServiceProvider;
use OtherSoftware\Routing\Router;
use OtherSoftware\Routing\UrlGenerator;
use Override;


class RoutingServiceProvider extends BaseRoutingServiceProvider
{
    #[Override]
    protected function registerRouter(): void
    {
        $this->app->singleton('router', function ($app) {
            return new Router($app['events'], $app);
        });
    }


    #[Override]
    protected function registerUrlGenerator(): void
    {
        $this->app->singleton('url', function ($app) {
            $routes = $app['router']->getRoutes();

            // The URL generator needs the route collection that exists on the router.
            // Keep in mind this is an object, so we're passing by references here
            // and all the registered routes will be available to the generator.
            $app->instance('routes', $routes);

            return new UrlGenerator(
                $routes, $app->rebinding('request', $this->requestRebinder()), $app['config']['app.asset_url']
            );
        });

        $this->app->extend('url', function (UrlGeneratorContract $url, $app) {
            // Next we will set a few service resolvers on the URL generator so it can
            // get the information it needs to function. This just provides some of
            // the convenience features to this URL generator like "signed" URLs.
            $url->setSessionResolver(function () {
                return $this->app['session'] ?? null;
            });

            $url->setKeyResolver(function () {
                $config = $this->app->make('config');

                return [$config->get('app.key'), ...($config->get('app.previous_keys') ?? [])];
            });

            // If the route collection is "rebound", for example, when the routes stay
            // cached for the application, we will need to rebind the routes on the
            // URL generator instance so it has the latest version of the routes.
            $app->rebinding('routes', function ($app, $routes) {
                $app['url']->setRoutes($routes);
            });

            return $url;
        });
    }
}
