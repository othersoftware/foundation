<?php

namespace OtherSoftware\Foundation\Http\Middleware;


use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use OtherSoftware\Foundation\Facades\Frontend;
use Symfony\Component\HttpFoundation\RedirectResponse;


class Context
{
    /**
     * @var \OtherSoftware\Foundation\Routing\Router
     */
    private Router $router;


    public static function using(string $view): string
    {
        return static::class . ':' . $view;
    }


    public function __construct(Router $router)
    {
        $this->router = $router;
    }


    public function handle(Request $request, Closure $next, string $view)
    {
        $this->router->setInitialView($view);

        $response = $next($request);

        if ($request->header('X-Stack-Router')) {
            if ($response instanceof RedirectResponse) {
                return Frontend::setRedirect($response->getTargetUrl());
            }
        }

        return $response;
    }
}
