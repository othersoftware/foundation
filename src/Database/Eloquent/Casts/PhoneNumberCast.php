<?php

namespace OtherSoftware\Database\Eloquent\Casts;


use Illuminate\Database\Eloquent\Model;
use Propaganistas\LaravelPhone\Casts\E164PhoneNumberCast;
use Propaganistas\LaravelPhone\PhoneNumber;


class PhoneNumberCast extends E164PhoneNumberCast
{
    /**
     * @param Model $model
     * @param string $key
     * @param PhoneNumber|null $value
     * @param array $attributes
     *
     * @return array|null
     */
    public function serialize($model, string $key, $value, array $attributes): ?array
    {
        if (! $value) {
            return null;
        }

        return [
            'national' => $value->formatNational(),
            'country' => $value->getCountry(),
            'rfc' => $value->formatRFC3966(),
        ];
    }
}
