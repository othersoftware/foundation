<?php

namespace OtherSoftware\Bridge\Stack;


use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Jsonable;
use InvalidArgumentException;
use JsonSerializable;


final class View implements Arrayable, Jsonable, JsonSerializable
{
    protected string $component;


    protected bool $keep = false;


    protected string $location;


    protected array $props;


    protected array $query;


    private ?View $child = null;


    public function __construct(string $component = null, array $props = [], ?true $keep = null)
    {
        if (is_null($component) && is_null($keep)) {
            throw new InvalidArgumentException('You must decide that you want to keep stacked view in SPA, or that you want to rerender it.');
        }

        if ($keep) {
            $this->keep = $keep;

            return;
        }

        $this->component = $component;
        $this->props = $props;
        $this->query = request()->query();
    }


    public function jsonSerialize(): array
    {
        return $this->toArray();
    }


    public function nested(View $nested): View
    {
        $this->child = $nested;

        return $this;
    }


    public function setLocation(string $location): View
    {
        $this->location = $location;

        return $this;
    }


    public function toArray(): array
    {
        $data = [];

        if ($this->keep) {
            $data['keep'] = $this->keep;
        } else {
            $data['component'] = $this->component;
            $data['props'] = count($this->props) > 0 ? $this->props : null;

            if (isset($this->location)) {
                $data['location'] = $this->location;
            }

            $data['query'] = $this->query;
        }

        if ($this->child) {
            $data['child'] = $this->child->toArray();
        }

        return $data;
    }


    public function toJson($options = 0): string
    {
        return json_encode($this->toArray(), $options);
    }
}
