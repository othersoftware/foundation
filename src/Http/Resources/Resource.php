<?php

namespace OtherSoftware\Http\Resources;


use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Collection;


abstract class Resource implements Arrayable
{
    /**
     * @param mixed $items
     * @param callable|null $callback
     *
     * @return Collection<static>
     */
    public static function collect(mixed $items, ?callable $callback = null): Collection
    {
        return collect($items)->map($callback ?: fn($item) => new static($item));
    }


    public function toArray(): array
    {
        $reflection = new \ReflectionClass($this);
        $properties = $reflection->getProperties(\ReflectionProperty::IS_PUBLIC);
        $data = [];

        foreach ($properties as $property) {
            $name = $property->getName();

            if (! $property->isInitialized($this)) {
                continue;
            }

            $value = $property->getValue($this);

            if ($value instanceof Arrayable) {
                $value = $value->toArray();
            }

            if ($value instanceof \BackedEnum) {
                if (method_exists($value, 'toRecord')) {
                    $value = $value->toRecord();
                }
            }

            $data[$name] = $value;
        }

        return $data;
    }
}
