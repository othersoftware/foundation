<?php

namespace OtherSoftware\Database\Eloquent;


use Illuminate\Database\Eloquent\Model as EloquentModel;
use Illuminate\Support\Str;
use Override;


abstract class Model extends EloquentModel
{
    #[Override]
    public function fill(array $attributes)
    {
        return parent::fill($this->convertAttributeKeysToSnakeKeys($attributes));
    }


    #[Override]
    public function getAttribute($key)
    {
        if (! $key) {
            return null;
        }

        if ($this->isRelation($key)) {
            return parent::getAttribute($key);
        }

        $key = Str::snake($key);

        return parent::getAttribute($key);
    }


    #[Override]
    public function isFillable($key): bool
    {
        return parent::isFillable(Str::snake($key));
    }


    #[Override]
    public function isGuarded($key): bool
    {
        return parent::isGuarded(Str::snake($key));
    }


    #[Override]
    public function setAttribute($key, $value)
    {
        if (str_contains($key, '->')) {
            $key = join('->', array_map(Str::snake(...), explode('->', $key)));
        } else {
            $key = Str::snake($key);
        }

        return parent::setAttribute($key, $value);
    }


    private function convertAttributeKeysToSnakeKeys(array $attributes): array
    {
        return array_reduce(array_keys($attributes), function ($carry, $item) use ($attributes) {
            $key = Str::snake($item);

            $carry[$key] = $attributes[$item];

            return $carry;
        }, []);
    }
}
