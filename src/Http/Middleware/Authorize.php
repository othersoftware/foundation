<?php

namespace OtherSoftware\Http\Middleware;


use Closure;
use Illuminate\Auth\Access\Response;
use Illuminate\Container\Container;
use Illuminate\Http\Request;
use Illuminate\Routing\ResolvesRouteDependencies;
use ReflectionMethod;
use RuntimeException;


class Authorize
{
    use ResolvesRouteDependencies;


    private Container $container;


    public function __construct(Container $container)
    {
        $this->container = $container;
    }


    public function handle(Request $request, Closure $next, string $class, string $method)
    {
        if (! method_exists($class, $method)) {
            throw new RuntimeException("Method {$class}::{$method} does not exist.");
        }

        $route = $request->route();
        $parameters = $this->resolveMethodDependencies($route->parametersWithoutNulls(), new ReflectionMethod($class, $method));
        $response = forward_static_call([$class, $method], ...array_values($parameters));

        if (false === $response instanceof Response) {
            throw new RuntimeException("Method {$class}::{$method} must return an access Response object.");
        }

        $response->authorize();

        return $next($request);
    }
}
