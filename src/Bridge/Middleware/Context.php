<?php

namespace OtherSoftware\Bridge\Middleware;


use Closure;
use Illuminate\Http\Request;
use OtherSoftware\Support\Facades\Vue;
use Symfony\Component\HttpFoundation\RedirectResponse;


class Context
{
    public static function using(string $view): string
    {
        return static::class . ':' . $view;
    }


    public function handle(Request $request, Closure $next, string $view)
    {
        Vue::setView($view);

        $response = $next($request);

        if ($request->header('X-Stack-Router')) {
            if ($response instanceof RedirectResponse) {
                return Vue::setRedirect($response->getTargetUrl());
            }
        }

        return $response;
    }
}
