<?php

namespace OtherSoftware\Routing;


use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Routing\Exceptions\UrlGenerationException;
use Illuminate\Routing\Route as BaseRoute;
use Illuminate\Support\Facades\URL;


final class Route extends BaseRoute implements Arrayable
{
    private string $location;


    public function bindNested(Route $route): Route
    {
        $this->compileRoute();

        $this->parameters = array_intersect_key($route->parameters(), array_flip($this->parameterNames()));
        $this->originalParameters = $this->parameters;

        return $this;
    }


    public function getParent(): ?string
    {
        if ($this->isModal()) {
            return $this->action['modal'] ?? null;
        }

        return $this->action['parent'] ?? null;
    }


    public function isModal(): bool
    {
        return $this->action['modal'] ?? false;
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

        if (isset($this->action['modal'])) {
            $this->action['modal'] = $locale . '.' . $this->action['modal'];
        }

        return $this;
    }


    /**
     * @throws UrlGenerationException
     */
    public function location(): string
    {
        if (! isset($this->location)) {
            $this->location = URL::toRoute($this, $this->parameters(), true);
        }

        return $this->location;
    }


    public function modal(string $parent): Route
    {
        $this->action['modal'] = $parent;

        return $this;
    }


    public function parent(string $parent): Route
    {
        $this->action['parent'] = $parent;

        return $this;
    }


    public function toArray(): array
    {
        return [
            'uri' => $this->uri(),
            'domain' => $this->domain(),
            'params' => $this->parameterNames(),
            'binding' => (object) $this->bindingFields(),
        ];
    }
}
