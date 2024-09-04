<?php

namespace OtherSoftware\Foundation\Routing;


use Illuminate\Http\Request;
use Illuminate\Routing\Pipeline;
use Illuminate\Routing\Route as BaseRoute;
use Illuminate\Routing\Router as BaseRouter;
use Illuminate\Support\Arr;
use OtherSoftware\Foundation\Exceptions\Routing\MissingParentRouteException;
use OtherSoftware\Foundation\Exceptions\Routing\OutsideRouterScopeException;
use OtherSoftware\Foundation\Frontend\Factory;
use OtherSoftware\Foundation\Routing\Routes\Route;
use OtherSoftware\Foundation\Routing\Stack\StackedView;
use OtherSoftware\Foundation\Routing\Stack\StackedViewMap;
use OtherSoftware\Foundation\Routing\Stack\StackedViewMeta;
use Override;
use Symfony\Component\HttpFoundation\Response;


final class Router extends BaseRouter
{
    protected Route $running;


    protected StackedViewMap $stack;


    private string $initialView;


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


    public function setInitialView(string $view): static
    {
        $this->initialView = $view;

        return $this;
    }


    #[Override]
    protected function runRouteWithinStack(BaseRoute $route, Request $request): Response
    {
        assert($route instanceof Route);

        $shouldSkipMiddleware = $this->container->bound('middleware.disable') && $this->container->make('middleware.disable') === true;
        $middleware = $shouldSkipMiddleware ? [] : $this->gatherRouteMiddleware($route);

        $this->stack = $this->buildViewStack($route, $request);

        return (new Pipeline($this->container))->send($request)->through($middleware)->then(function ($request) use ($route) {
            return $this->prepareResponse($request, $this->wrapStack($this->runRouteUp($route, $request)));
        });
    }


    private function buildViewStack(Route $route, Request $request): StackedViewMap
    {
        $previous = $this->buildViewStackFromRequest($request);
        $next = $this->buildViewStackFromRoute($route);
        $total = count($next) - 1;

        $changed = false;
        $stack = new StackedViewMap();

        for ($i = 0; $i <= $total; $i++) {
            $isLast = ($i === $total);

            $a = $next[$i];
            $b = $previous[$i] ?? null;

            $stack->push($view = new StackedViewMeta($a));

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


    private function runRouteUp(Route $route, Request $request, StackedView $nested = null)
    {
        $this->running = $route;

        if ($this->stack->findByRoute($route)->shouldKeep()) {
            $response = new StackedView(keep: true);
        } else {
            $response = $route->run();
        }

        unset($this->running);

        // When route returns other kind of response, rather than ViewLayer,
        // skip nested route resolving as it has no point.
        if ($response instanceof StackedView) {
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
        if ($response instanceof StackedView) {
            $instance = new Factory();

            $instance->setStackMeta($this->stack);
            $instance->setStack($response);
            $instance->setView($this->initialView);

            return $instance;
        }

        return $response;
    }
}
