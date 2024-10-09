<?php

namespace OtherSoftware\Support\Components;


use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Jsonable;
use JsonSerializable;


class VueComponent implements Arrayable, Jsonable, JsonSerializable
{
    public string $name;


    public array $props;


    public function __construct(string $name, array $props = [])
    {
        $this->name = $name;
        $this->props = $props;
    }


    public function jsonSerialize(): array
    {
        return $this->toArray();
    }


    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'props' => $this->props,
        ];
    }


    public function toJson($options = 0): string
    {
        return json_encode($this->toArray(), $options);
    }
}
