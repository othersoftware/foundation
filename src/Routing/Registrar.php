<?php

namespace OtherSoftware\Routing;


use Composer\ClassMapGenerator\ClassMapGenerator;
use Illuminate\Support\Arr;
use OtherSoftware\Routing\Attributes\Method;
use OtherSoftware\Routing\Attributes\Middleware;
use OtherSoftware\Routing\Attributes\Name;
use OtherSoftware\Routing\Attributes\Nested;
use OtherSoftware\Routing\Attributes\Route;
use OtherSoftware\Routing\Attributes\TranslatedRoute;
use ReflectionClass;
use ReflectionException;
use ReflectionMethod;


final class Registrar
{
    protected string $path;


    protected Router $router;


    /**
     * @throws ReflectionException
     */
    public static function register(Router $router, string $path): Registrar
    {
        return new self($router, $path);
    }


    /**
     * @throws ReflectionException
     */
    public function __construct(Router $router, string $path)
    {
        $this->router = $router;
        $this->path = $path;

        $this->compile();
    }


    /**
     * @throws ReflectionException
     */
    public function compile(): void
    {
        foreach ($this->scan() as $class) {
            $this->compileGroup(new ReflectionClass($class));
        }
    }


    protected function scan(): array
    {
        return array_keys(ClassMapGenerator::createMap($this->path));
    }


    private function compileGroup(ReflectionClass $reflection): void
    {
        $this->router->group($this->compileGroupAttributes($reflection), function (Router $router) use ($reflection) {
            $this->compileRoutes($reflection, $router);
        });
    }


    private function compileGroupAttributes(ReflectionClass $reflection): array
    {
        $options = [];

        if (count($middleware = $this->getMiddlewareAttributes($reflection)) > 0) {
            $options['middleware'] = array_map(fn($attribute) => $attribute->middleware, $middleware);
        }

        return $options;
    }


    private function compileRoutes(ReflectionClass $reflection, Router $router): void
    {
        foreach ($reflection->getMethods(ReflectionMethod::IS_PUBLIC) as $method) {
            $this->compileRoutesForMethod($reflection, $method, $router);
        }
    }


    private function compileRoutesForMethod(ReflectionClass $class, ReflectionMethod $method, Router $router): void
    {
        $attributes = collect($this->getRouteAttributes($method));
        $default = config('translations.default');
        $enabled = config('translations.locales', []);
        $locales = collect(array_combine($enabled, $enabled))->except($default);

        if ($this->isTranslated($class) || $this->isTranslated($method)) {
            foreach ($locales as $locale) {
                $attribute = $attributes->firstWhere('locale', $locale);

                if (! $attribute) {
                    $attribute = $attributes->firstWhere(function (Route $attr) use ($default) {
                        return is_null($attr->locale) || $attr->locale === $default;
                    });
                }

                if (is_null($attribute)) {
                    continue;
                }

                $this->compileSingleRoute($method, $attribute, $router, $locale);
            }
        }

        $attribute = $attributes->firstWhere('locale', $default);

        if (! $attribute) {
            $attribute = $attributes->firstWhere(function (Route $attr) use ($default) {
                return is_null($attr->locale) || $attr->locale === $default;
            });
        }

        if (is_null($attribute)) {
            return;
        }

        $this->compileSingleRoute($method, $attribute, $router, $default);
    }


    private function compileSingleRoute(ReflectionMethod $reflection, Route $attribute, Router $router, string $locale): void
    {
        $methods = $this->getMethodsAttributes($reflection);
        $action = [$reflection->class, $reflection->name];

        $uri = $attribute->uri;

        if ($prefix = config("translations.routing.{$locale}.prefix")) {
            $uri = trim($prefix, '/') . $uri;
        }

        /** @var \OtherSoftware\Routing\Route $route */
        $route = $router->match($methods, $uri, $action);

        if ($name = $this->getNameAttribute($reflection)) {
            $name = trim($name->name, '.');
        } else {
            $name = sha1($reflection->class . $reflection->name);
        }

        if ($locale !== config('translations.default')) {
            $name = $locale . '.' . $name;
        }

        $route->name($name);

        if (count($middleware = $this->getMiddlewareAttributes($reflection)) > 0) {
            $route->middleware(array_map(fn($attribute) => $attribute->middleware, $middleware));
        }

        if ($nested = $this->getNestedAttribute($reflection)) {
            $route->parent($nested->parent);
        }

        if ($domain = config("translations.routing.{$locale}.domain")) {
            $route->domain($domain);
        }

        if ($locale !== config('translations.default')) {
            $route->localize($locale);
        }
    }


    /**
     * @param ReflectionMethod $reflection
     *
     * @return string[]
     */
    private function getMethodsAttributes(ReflectionMethod $reflection): array
    {
        if (count($attributes = $reflection->getAttributes(Method::class)) > 0) {
            $attributes = array_map(fn($attribute) => $attribute->newInstance(), $attributes);
            $methods = array_unique(array_merge(...array_map(fn($attribute) => $attribute->methods, $attributes)));

            // Make sure we allow HEAD requests for GET routes as well.
            // This would be required in CORS mode, as browser in such case
            // sends HEAD request first.
            if (in_array('GET', $methods) && ! in_array('HEAD', $methods)) {
                $methods[] = 'HEAD';
            }

            // When PATCH method is defined make sure it also allows PUT methods
            // and vice versa as in PHP it doesn't really matter.
            if (in_array('PATCH', $methods) && ! in_array('PUT', $methods)) {
                $methods[] = 'PUT';
            }

            if (in_array('PUT', $methods) && ! in_array('PATCH', $methods)) {
                $methods[] = 'PATCH';
            }

            return $methods;
        }

        return ['GET', 'HEAD'];
    }


    /**
     * @param ReflectionClass|ReflectionMethod $reflection
     *
     * @return Middleware[]
     */
    private function getMiddlewareAttributes(ReflectionClass|ReflectionMethod $reflection): array
    {
        if (count($attributes = $reflection->getAttributes(Middleware::class)) > 0) {
            return array_map(fn($attribute) => $attribute->newInstance(), $attributes);
        }

        return [];
    }


    private function getNameAttribute(ReflectionMethod $reflection): ?Name
    {
        if ($attribute = Arr::first($reflection->getAttributes(Name::class))) {
            return $attribute->newInstance();
        }

        return null;
    }


    private function getNestedAttribute(ReflectionMethod $reflection): ?Nested
    {
        if ($attribute = Arr::first($reflection->getAttributes(Nested::class))) {
            return $attribute->newInstance();
        }

        return null;
    }


    /**
     * @param ReflectionMethod $reflection
     *
     * @return \OtherSoftware\Routing\Route[]
     */
    private function getRouteAttributes(ReflectionMethod $reflection): array
    {
        if (count($attributes = $reflection->getAttributes(Route::class)) > 0) {
            return array_map(fn($attribute) => $attribute->newInstance(), $attributes);
        }

        return [];
    }


    private function isTranslated(ReflectionClass|ReflectionMethod $reflection): bool
    {
        return count($reflection->getAttributes(TranslatedRoute::class)) > 0;
    }
}
