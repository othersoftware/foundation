<?php

namespace OtherSoftware\Foundation\Routing\Routes;


use Illuminate\Routing\Route as BaseRoute;
use Illuminate\Support\Facades\URL;


final class Route extends BaseRoute
{
    private string $hash;


    public function bindNested(Route $route): Route
    {
        $this->compileRoute();

        $this->parameters = array_intersect_key($route->parameters(), array_flip($this->parameterNames()));
        $this->originalParameters = $this->parameters;

        return $this;
    }


    public function getParent(): ?string
    {
        return $this->action['parent'] ?? null;
    }


    public function hash(): string
    {
        if (! isset($this->hash)) {
            $this->hash = URL::toRoute($this, $this->parameters(), true);
        }

        return $this->hash;
    }


    public function isNested(): bool
    {
        return $this->action['parent'] ?? false;
    }


    public function localize($locale): Route
    {
        $this->action['locale'] = $locale;

        if (isset($this->action['parent'])) {
            $this->action['parent'] = $locale . '.' . $this->action['parent'];
        }

        return $this;
    }


    public function parent(string $parent): Route
    {
        $this->action['parent'] = $parent;

        return $this;
    }
}
