<?php

namespace OtherSoftware\Bridge\Protocol;


use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Jsonable;


final class Redirect implements Arrayable, Jsonable
{
    public bool $reload;


    public string $target;


    public function __construct(string $target, bool $reload = false)
    {
        $this->target = $target;
        $this->reload = $reload;
    }


    public function toArray(): array
    {
        return [
            'target' => $this->target,
            'reload' => $this->reload,
        ];
    }


    public function toJson($options = 0): string
    {
        return json_encode($this->toArray(), $options);
    }
}
