<?php

namespace OtherSoftware\Routing;


use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Http\Request;
use Illuminate\Routing\RouteCollectionInterface;
use Illuminate\Routing\UrlGenerator as IlluminateUrlGenerator;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;
use OtherSoftware\Bridge\Stack\Stack;
use OtherSoftware\Translation\Locales;
use Override;
use RuntimeException;


final class UrlGenerator extends IlluminateUrlGenerator
{
    private Locales $availableLocales;


    private string $defaultLocale;


    public function __construct(RouteCollectionInterface $routes, Request $request, $assetRoot = null)
    {
        parent::__construct($routes, $request, $assetRoot);

        $this->availableLocales = resolve(Locales::class);
        $this->defaultLocale = config('app.fallback_locale');
    }


    #[Override]
    public function previous($fallback = false): string
    {
        $referrer = $this->getPreviousStackLocation() ?: $this->request->headers->get('X-Stack-Referer') ?: $this->request->headers->get('Referer');
        $url = $referrer ? $this->to($referrer) : $this->getPreviousUrlFromSession();

        if ($url) {
            return $url;
        }

        if ($fallback) {
            return $this->to($fallback);
        }

        return $this->to('/');
    }


    #[Override]
    public function route($name, $parameters = [], $absolute = true): string
    {
        // Routes in the default language don't have a prefix of locale code.
        // But as we sometimes want to force generation in the default language
        // even when being in different (for example, language switcher),
        // we provide a way to pass the default language prefix in route.
        // Otherwise, it would simply follow the convention and prepend
        // the current locale to route name which could lead to errors.
        if (Str::startsWith($name, $this->defaultLocale)) {
            $name = Str::replaceFirst($this->defaultLocale . '.', '', $name);

            return parent::route($name, $parameters, $absolute);
        }

        // When a route is prefixed with a known locale code, it means we should
        // force generation in that language.
        if (Str::startsWith($name, $this->availableLocales->all())) {
            return parent::route($name, $parameters, $absolute);
        }

        // For routes which names don't start with `web.` we ignore
        // localization as these might not handle localization or handle it
        // differently (for example, cookies).
        if (! Str::startsWith($name, 'web')) {
            return parent::route($name, $parameters, $absolute);
        }

        // The default convention is to stick current locale to route name.
        // This will generate a URL in the current language being used.
        // The exception is the default language which routes don't have
        // a locale prefix.
        $locale = $this->availableLocales->current();

        if ($locale !== $this->defaultLocale) {
            $name = $locale . '.' . $name;
        }

        return parent::route($name, $parameters, $absolute);
    }


    /**
     * Returns the previous location from the Stack instance.
     *
     * @return string|null
     */
    private function getPreviousStackLocation(): ?string
    {
        if (App::bound(Stack::class)) {
            try {
                return App::make(Stack::class)->previous()?->getLocation();
            } catch (BindingResolutionException $e) {
                throw new RuntimeException('Stack instance should be always available here.', previous: $e);
            }
        }

        return null;
    }
}
