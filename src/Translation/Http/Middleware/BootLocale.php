<?php

namespace OtherSoftware\Translation\Http\Middleware;


use Closure;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\App;
use OtherSoftware\Translation\Locales;


class BootLocale
{
    private Repository $config;


    private string $default;


    private array $domains;


    private Locales $locales;


    public function __construct(Locales $locales, Repository $config)
    {
        $this->locales = $locales;
        $this->config = $config;
        $this->domains = $this->resolveDomainsMap();
        $this->default = $this->config->get('translations.default');
    }


    public function handle(Request $request, Closure $next)
    {
        if ($host = $request->getHost()) {
            if (array_key_exists($host, $this->domains)) {
                App::setLocale($this->domains[$host]);
                Carbon::setLocale($this->domains[$host]);

                return $next($request);
            }
        }

        if ($prefix = $request->segment(1)) {
            if ($this->locales->has($prefix)) {
                App::setLocale($prefix);
                Carbon::setLocale($prefix);

                return $next($request);
            }
        }

        if ($header = $this->localeFromHeader($request)) {
            if ($this->locales->has($header)) {
                App::setLocale($header);
                Carbon::setLocale($header);

                return $next($request);
            }
        }

        App::setLocale($this->default);
        Carbon::setLocale($this->default);

        return $next($request);
    }


    private function localeFromHeader(Request $request): ?string
    {
        return Arr::first(Arr::wrap($request->header('Language')));
    }


    private function resolveDomainsMap(): array
    {
        $locales = $this->config->get('translation.routing', []);
        $results = [];

        foreach ($locales as $locale => $attributes) {
            if (! empty($attributes['domain'])) {
                $results[$attributes['domain']] = $locale;
            }
        }

        return $results;
    }
}
