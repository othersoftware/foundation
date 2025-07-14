<?php

namespace OtherSoftware\Routing;


use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Routing\Pipeline;
use Illuminate\Routing\Route as BaseRoute;
use Illuminate\Routing\Router as BaseRouter;
use Illuminate\Support\Collection;
use OtherSoftware\Bridge\Middleware\Context;
use OtherSoftware\Bridge\Stack\Stack;
use OtherSoftware\Bridge\Stack\StackEntry;
use OtherSoftware\Bridge\Stack\View;
use OtherSoftware\Routing\Exceptions\MissingParentRouteException;
use OtherSoftware\Routing\Exceptions\OutsideRouterScopeException;
use OtherSoftware\Support\Facades\Vue;
use Override;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;
use Symfony\Component\HttpFoundation\Response;


final class Router extends BaseRouter
{
    protected Route $running;


    protected Stack $stack;


    public function exportForVue(): Collection
    {
        return collect($this->getRoutes()->getRoutesByName())->map(fn(Route $route) => $route->toArray());
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

        // When the route is not within Foundation's context, run the route without a stack.
        if (count(array_filter($middleware, fn($entry) => str_starts_with($entry, Context::class))) <= 0) {
            return (new Pipeline($this->container))->send($request)->through($middleware)->then(function ($request) use ($route) {
                return $this->prepareResponse($request, $route->run());
            });
        }

        $this->stack = $this->buildViewStack($route, $request);

        // Bind stack to the service container.
        $this->container->instance(Stack::class, $this->stack);

        return (new Pipeline($this->container))->send($request)->through($middleware)->then(function ($request) use ($route) {
            return $this->prepareResponse($request, $this->wrapStack($this->runStack($request, $route)));
        });
    }


    #[Override]
    public function gatherRouteMiddleware(BaseRoute $route): array
    {
        assert($route instanceof Route);

        $current = $route;
        $result = [];

        while ($route->isNested() || $route->isModal()) {
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


    private function buildViewStack(Route $route, Request $request): Stack
    {
        $previous = $this->buildViewStackFromRequest($request);

        // When the request coming is not a GET method, we do not build the next
        // stack as it would be pointless. Other than GET methods, by default
        // return redirects, which won't return the new stack.
        if ($request->method() !== 'GET') {
            return $previous;
        }

        $next = $this->buildViewStackFromRoute($request, $previous, $route);

        // Check for the stack refresh header. At some points, for example,
        // forms in modals, we might want to refresh the whole stack to reload
        // data underneath the modal window.
        $changed = $request->header('X-Stack-Refresh') === 'true';

        return $previous->compare($next, $changed);
    }


    private function wrapStack(mixed $response): mixed
    {
        Vue::setStack($this->stack);

        if ($response instanceof View) {
            return Vue::setRendered($response);
        }

        return $response;
    }


    private function runStack(Request $request, Route $route)
    {
        $response = null;
        $parent = null;

        if ($request->method() !== 'GET') {
            $this->running = $route;

            $response = $route->run();

            unset($this->running);

            return $response;
        }

        /** @var StackEntry $entry */
        foreach ($this->stack->getIterator() as $entry) {
            $this->running = $entry->getRoute();

            if ($entry->shouldKeep()) {
                $view = (new View(keep: true));
            } else {
                $view = $this->bindRouteParameters($request, $this->running)->run();
            }

            // When route returns other kind of response, rather than View,
            // skip nested route resolving as it has no point.
            if (false === $view instanceof View) {
                return $view;
            }

            if ($response === null) {
                $response = $view;
            }

            $view->setLocation($entry->getLocation());

            if ($parent !== null) {
                $parent->nested($view);
            }

            $parent = $view;

            unset($this->running);
        }

        return $response;
    }


    private function findParentRoute(Route $route, bool $skipBinding = false): Route
    {
        $parent = $this->routes->getByName($route->getParent());

        if (is_null($parent)) {
            throw new MissingParentRouteException($route->getParent(), $route->getName());
        }

        assert($parent instanceof Route);

        // When the route was not bound, bind parameters from the nested route.
        if (! isset($parent->parameters) && ! $skipBinding) {
            $parent->bindNested($route);
        }

        return $parent;
    }


    private function buildViewStackFromRequest(Request $request): Stack
    {
        if ($stack = $request->header('X-Stack-Signature')) {
            return $this->hydrateRequestStackRoutes(decrypt($stack));
        }

        return new Stack();
    }


    /**
     * This method builds a stack for the current request Route. It will go
     * through the nested routes and create a new stack to compare with
     * the previous stack.
     *
     * Modal routes should be handled differently, as they should simply append
     * to the previous stack. But when the request is not coming from a JS
     * router (usually meaning the page is refreshed or entered directly with
     * the exact URL) or the previous stack is empty, we should build a fallback
     * full modal stack instead.
     *
     * @param Request $request The current request.
     * @param Stack $previous The previous stack built from the request.
     * @param Route $route The current route.
     *
     * @return Stack
     */
    private function buildViewStackFromRoute(Request $request, Stack $previous, Route $route): Stack
    {
        if ($route->isModal()) {
            if ($request->headers->get('X-Stack-Router') && $previous->isNotEmpty()) {
                return $previous->append(StackEntry::fromRoute($route));
            }
        }

        $stack = new Stack(StackEntry::fromRoute($route));

        while ($route->isNested() || $route->isModal()) {
            $stack->prepend(StackEntry::fromRoute($route = $this->findParentRoute($route)));
        }

        return $stack;
    }


    private function bindRouteParameters(Request $request, Route $route): Route
    {
        try {
            $this->substituteBindings($route);
            $this->substituteImplicitBindings($route);
        } catch (ModelNotFoundException $exception) {
            if ($route->getMissing()) {
                return $route->getMissing()($request, $exception);
            }

            throw $exception;
        }

        return $route;
    }


    /**
     * This method hydrates routes into the stack based on serialized route
     * names. When any of the serialized routes is not found, an empty stack is
     * returned, forcing a fresh stack to be built for the next route.
     *
     * @param Stack $stack A stack to be hydrated with routes.
     *
     * @return Stack
     */
    private function hydrateRequestStackRoutes(Stack $stack): Stack
    {
        return $stack->hydrate(function (StackEntry $entry) {
            $route = $this->routes->getByName($entry->getRouteName());

            if (is_null($route)) {
                return false;
            }

            // Create the clone of the route. RouteCollection returns the same
            // instances of the routes, which will cause the next stack routes
            // to work on the previous entries.
            $route = clone $route;

            assert($route instanceof Route);

            $request = Request::createFromBase(SymfonyRequest::create($entry->getLocation()));

            $entry->setRoute($route->bind($request));

            return true;
        });
    }
}
