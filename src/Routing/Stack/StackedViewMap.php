<?php

namespace OtherSoftware\Foundation\Routing\Stack;


use Illuminate\Contracts\Support\Arrayable;
use OtherSoftware\Foundation\Routing\Routes\Route;
use Serializable;


final class StackedViewMap implements Arrayable, Serializable
{
    private array $map = [];


    private array $views = [];


    public function __serialize(): array
    {
        return [
            'map' => $this->map,
            'views' => $this->views,
        ];
    }


    public function __unserialize(array $data): void
    {
        $this->map = $data['map'];
        $this->views = $data['views'];
    }


    public function findByHash(string $hash): StackedViewMeta
    {
        return $this->map[$hash];
    }


    public function findByRoute(Route $route): StackedViewMeta
    {
        return $this->findByHash($route->hash());
    }


    public function getViewStack(): array
    {
        return array_keys($this->map);
    }


    public function push(StackedViewMeta $view): StackedViewMap
    {
        $this->views[] = $view;
        $this->map[$view->hash] = $view;

        return $this;
    }


    public function serialize(): string
    {
        return serialize([$this->views, $this->map]);
    }


    public function toArray(): array
    {
        return $this->views();
    }


    public function unserialize(string $data): void
    {
        [$this->views, $this->map] = unserialize($data);
    }


    public function views(): array
    {
        return $this->views;
    }
}
