<?php

namespace OtherSoftware\Routing;


use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector as IlluminateRedirector;


final class Redirector extends IlluminateRedirector
{
    /**
     * @var UrlGenerator
     */
    protected $generator;


    public function __construct(UrlGenerator $generator)
    {
        parent::__construct($generator);
    }


    public function forward($path, $status = 302, $headers = [], $secure = null): RedirectResponse
    {
        return $this->createRedirect($this->generator->forward($path, [], $secure), $status, $headers);
    }


    public function refresh($status = 302, $headers = [], $fallback = false): RedirectResponse
    {
        return $this->createRedirect($this->generator->refresh($fallback), $status, $headers);
    }
}
