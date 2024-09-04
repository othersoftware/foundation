<?php

namespace OtherSoftware\Foundation\Routing\Stack;


use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Jsonable;
use InvalidArgumentException;


final class StackedView implements Arrayable, Jsonable
{
    protected string $component;


    protected bool $keep = false;


    protected array $props;


    private ?StackedView $child = null;


    public function __construct(string $component = null, array $props = [], true $keep = null)
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
    }


    public function nested(StackedView $nested): StackedView
    {
        $this->child = $nested;

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
