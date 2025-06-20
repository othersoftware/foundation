<?php

namespace OtherSoftware\Database\Eloquent\Casts;


use BackedEnum;
use Illuminate\Contracts\Database\Eloquent\Castable;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Support\Collection;
use UnitEnum;
use function Illuminate\Support\enum_value;


class AsEnumArray implements Castable
{
    /**
     * Get the caster class to use when casting from / to this cast target.
     *
     * @template TEnum of UnitEnum
     *
     * @param array{class-string<TEnum>} $arguments
     *
     * @return CastsAttributes<array<array-key, TEnum>, iterable<TEnum>>
     */
    public static function castUsing(array $arguments)
    {
        return new class($arguments) implements CastsAttributes {
            protected $arguments;


            public function __construct(array $arguments)
            {
                $this->arguments = $arguments;
            }


            public function get($model, $key, $value, $attributes)
            {
                if (! isset($attributes[$key])) {
                    return null;
                }

                $data = Json::decode($attributes[$key]);

                if (! is_array($data)) {
                    return null;
                }

                $enumClass = $this->arguments[0];

                return (new Collection($data))->map(fn($value) => is_subclass_of($enumClass, BackedEnum::class) ? $enumClass::from($value) : constant($enumClass . '::' . $value))->toArray();
            }


            public function set($model, $key, $value, $attributes)
            {
                if ($value !== null) {
                    $value = Json::encode((new Collection($value))->map(fn($enum) => $this->getStorableEnumValue($enum))->jsonSerialize());
                }

                return [$key => $value];
            }


            public function serialize($model, string $key, $value, array $attributes)
            {
                return (new Collection($value))->map(fn($enum) => $this->getStorableEnumValue($enum))->toArray();
            }


            protected function getStorableEnumValue($enum)
            {
                if (is_string($enum) || is_int($enum)) {
                    return $enum;
                }

                return enum_value($enum);
            }
        };
    }


    /**
     * Specify the Enum for the cast.
     *
     * @param class-string $class
     *
     * @return string
     */
    public static function of($class)
    {
        return static::class . ':' . $class;
    }
}
