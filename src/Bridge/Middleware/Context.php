<?php

namespace OtherSoftware\Bridge\Middleware;


use Closure;
use Illuminate\Http\Request;
use OtherSoftware\Support\Facades\Vue;
use Symfony\Component\HttpFoundation\RedirectResponse;


class Context
{
    public static function using(string $view, string $guard = 'web'): string
    {
        return static::class . ':' . $view . ',' . $guard;
    }


    public function handle(Request $request, Closure $next, ...$args)
    {
        [$view, $guard] = $args;

        Vue::setView($view);
        Vue::setGuard($guard);

        $response = $next($request);
        $response->headers->set('Vary', 'X-Stack-Router');

        if ($request->header('X-Stack-Router')) {
            if ($response instanceof RedirectResponse) {
                return Vue::setRedirect($response->getTargetUrl());
            }
        }

        return $response;
    }
}
