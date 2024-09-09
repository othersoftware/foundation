<?php

namespace OtherSoftware\Routing;


use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Http\Request;
use Illuminate\Routing\Pipeline;
use Illuminate\Routing\Route as BaseRoute;
use Illuminate\Routing\Router as BaseRouter;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use OtherSoftware\Bridge\Stack\Meta;
use OtherSoftware\Bridge\Stack\StackMeta;
use OtherSoftware\Bridge\Stack\View;
use OtherSoftware\Routing\Exceptions\MissingParentRouteException;
use OtherSoftware\Routing\Exceptions\OutsideRouterScopeException;
use OtherSoftware\Support\Facades\Vue;
use Override;
use Symfony\Component\HttpFoundation\Response;


final class Router extends BaseRouter
{
    protected Route $running;


    protected StackMeta $stack;


    protected UrlGenerator $url;


    public function exportForVue(): Collection
    {
        return collect($this->getRoutes()->getRoutesByName())->map(fn(Route $route) => $route->toArray());
    }


    #[Override]
    public function gatherRouteMiddleware(BaseRoute $route): array
    {
        assert($route instanceof Route);

        $current = $route;
        $result = [];

        while ($route->isNested()) {
            $route = $this->findParentRoute($route, skipBinding: true);
            $middleware = parent::gatherRouteMiddleware($route);
            $unique = array_diff($middleware, $result);

            array_push($result, ...$unique);
        }

        $middleware = parent::gatherRouteMiddleware($current);
        $unique = array_diff($middleware, $result);

        array_push($result, ...$unique);

        return $result;
    }


    public function getRunningRoute(): Route
    {
        if (! isset($this->running)) {
            throw new OutsideRouterScopeException();
        }

        return $this->running;
    }


    #[Override]
    public function newRoute($methods, $uri, $action): Route
    {
        return (new Route($methods, $uri, $action))->setRouter($this)->setContainer($this->container);
    }


    #[Override]
    protected function runRouteWithinStack(BaseRoute $route, Request $request): Response
    {
        assert($route instanceof Route);

        $shouldSkipMiddleware = $this->container->bound('middleware.disable') && $this->container->make('middleware.disable') === true;
        $middleware = $shouldSkipMiddleware ? [] : $this->gatherRouteMiddleware($route);

        $this->stack = $this->buildViewStack($route, $request);
        $this->url = url();

        return (new Pipeline($this->container))->send($request)->through($middleware)->then(function ($request) use ($route) {
            return $this->prepareResponse($request, $this->wrapStack($this->runRouteUp($route, $request)));
        });
    }


    private function buildViewStack(Route $route, Request $request): StackMeta
    {
        $previous = $this->buildViewStackFromRequest($request);
        $next = $this->buildViewStackFromRoute($route);
        $total = count($next) - 1;

        $changed = false;
        $stack = new StackMeta();

        for ($i = 0; $i <= $total; $i++) {
            $isLast = ($i === $total);

            $a = $next[$i];
            $b = $previous[$i] ?? null;

            $stack->push($view = new Meta($a));

            if ($changed || $isLast) {
                $view->forceRun();
                continue;
            }

            if ($a === $b) {
                $view->keep();
                continue;
            }

            $changed = true;
        }

        return $stack;
    }


    private function buildViewStackFromRequest(Request $request): array
    {
        $stack = $request->header('X-Stack-Signature');

        if (is_null($stack)) {
            return [];
        }

        return decrypt($stack);
    }


    private function buildViewStackFromRoute(Route $route): array
    {
        $map = Arr::wrap($route->hash());

        while ($route->isNested()) {
            $parent = $this->findParentRoute($route);

            array_unshift($map, $parent->hash());

            $route = $parent;
        }

        return $map;
    }


    private function findParentRoute(Route $route, bool $skipBinding = false): Route
    {
        $parent = $this->routes->getByName($route->getParent());

        if (is_null($parent)) {
            throw new MissingParentRouteException($route->getParent(), $route->getName());
        }

        assert($parent instanceof Route);

        // When route was not bound, bind parameters from nested route.
        if (! isset($parent->parameters) && ! $skipBinding) {
            $parent->bindNested($route);
        }

        return $parent;
    }


    private function runRouteUp(Route $route, Request $request, View $nested = null)
    {
        $this->running = $route;

        if ($this->stack->findByRoute($route)->shouldKeep()) {
            $response = new View(keep: true);
        } else {
            $response = $route->run();
        }

        unset($this->running);

        // When route returns other kind of response, rather than View,
        // skip nested route resolving as it has no point.
        if ($response instanceof View) {
            $response->setLocation($this->url->toRoute($route, $route->parameters, true));

            if (! is_null($nested)) {
                $response->nested($nested);
            }

            if ($route->isNested()) {
                return $this->runRouteUp($this->findParentRoute($route), $request, $response);
            }
        }

        return $response;
    }


    private function wrapStack(mixed $response): mixed
    {
        if ($response instanceof View) {
            $instance = Vue::getFacadeRoot();

            $instance->setStackMeta($this->stack);
            $instance->setStack($response);

            return $instance;
        }

        return $response;
    }
}
