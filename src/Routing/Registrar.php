<?php

namespace OtherSoftware\Routing;


use Composer\ClassMapGenerator\ClassMapGenerator;
use Illuminate\Support\Arr;
use OtherSoftware\Routing\Attributes\Authorize;
use OtherSoftware\Routing\Attributes\FallbackRoute;
use OtherSoftware\Routing\Attributes\Method;
use OtherSoftware\Routing\Attributes\Middleware;
use OtherSoftware\Routing\Attributes\Modal;
use OtherSoftware\Routing\Attributes\Name;
use OtherSoftware\Routing\Attributes\Nested;
use OtherSoftware\Routing\Attributes\Priority;
use OtherSoftware\Routing\Attributes\Route;
use OtherSoftware\Routing\Attributes\TranslatedRoute;
use OtherSoftware\Routing\Attributes\Where;
use ReflectionClass;
use ReflectionException;
use ReflectionMethod;


final class Registrar
{
    protected Router $router;
    protected string $path;


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
    public static function register(Router $router, string $path): Registrar
    {
        return new self($router, $path);
    }


    /**
     * @throws ReflectionException
     */
    public function compile(): void
    {
        $routes = [];

        foreach ($this->scan() as $class) {
            $reflection = new ReflectionClass($class);

            foreach ($reflection->getMethods(ReflectionMethod::IS_PUBLIC) as $method) {
                $routes[] = [
                    'reflection' => $reflection,
                    'method' => $method,
                    'priority' => $this->getPriorityAttribute($method)->priority ?? 0,
                ];
            }
        }

        usort($routes, fn($a, $b) => $b['priority'] <=> $a['priority']);

        foreach ($routes as $route) {
            $this->compileRoutesForMethod($route['reflection'], $route['method'], $this->router);
        }
    }


    protected function scan(): array
    {
        return array_keys(ClassMapGenerator::createMap($this->path));
    }


    private function bindAttributeFromReflection(\OtherSoftware\Routing\Route $route, ReflectionClass|ReflectionMethod $reflection): void
    {
        if (count($middleware = $this->getMiddlewareAttributes($reflection)) > 0) {
            $route->middleware(array_map(fn($attribute) => $attribute->middleware, $middleware));
        }

        if (count($authorizations = $this->getAuthorizationAttributes($reflection)) > 0) {
            $route->middleware(array_map(fn($attribute) => $attribute->middleware, $authorizations));
        }

        foreach ($this->getWhereAttributes($reflection) as $where) {
            $where->bind($route);
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

                $this->compileSingleRoute($class, $method, $attribute, $router, $locale);
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

        $this->compileSingleRoute($class, $method, $attribute, $router, $default);
    }


    private function compileSingleRoute(ReflectionClass $class, ReflectionMethod $reflection, Route $attribute, Router $router, string $locale): void
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

        $this->bindAttributeFromReflection($route, $class);
        $this->bindAttributeFromReflection($route, $reflection);

        if ($nested = $this->getNestedAttribute($reflection)) {
            $route->parent($nested->parent);
        }

        if ($modal = $this->getModalAttribute($reflection)) {
            $route->modal($modal->parent);
        }

        if ($domain = config("translations.routing.{$locale}.domain")) {
            $route->domain($domain);
        }

        if ($locale !== config('translations.default')) {
            $route->localize($locale);
        }

        if ($this->isFallback($reflection)) {
            $route->fallback();
        }
    }


    /**
     * @param ReflectionClass|ReflectionMethod $reflection
     *
     * @return Authorize[]
     */
    private function getAuthorizationAttributes(ReflectionClass|ReflectionMethod $reflection): array
    {
        if (count($attributes = $reflection->getAttributes(Authorize::class)) > 0) {
            return array_map(fn($attribute) => $attribute->newInstance(), $attributes);
        }

        return [];
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


    private function getModalAttribute(ReflectionMethod $reflection): ?Modal
    {
        if ($attribute = Arr::first($reflection->getAttributes(Modal::class))) {
            return $attribute->newInstance();
        }

        return null;
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


    private function getPriorityAttribute(ReflectionMethod $reflection): ?Priority
    {
        if ($attribute = Arr::first($reflection->getAttributes(Priority::class))) {
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


    /**
     * @param ReflectionClass|ReflectionMethod $reflection
     *
     * @return Where[]
     */
    private function getWhereAttributes(ReflectionClass|ReflectionMethod $reflection): array
    {
        if (count($attributes = $reflection->getAttributes(Where::class)) > 0) {
            return array_map(fn($attribute) => $attribute->newInstance(), $attributes);
        }

        return [];
    }


    private function isFallback(ReflectionClass|ReflectionMethod $reflection): bool
    {
        return count($reflection->getAttributes(FallbackRoute::class)) > 0;
    }


    private function isTranslated(ReflectionClass|ReflectionMethod $reflection): bool
    {
        return count($reflection->getAttributes(TranslatedRoute::class)) > 0;
    }
}
