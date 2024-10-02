<?php

namespace OtherSoftware\Database\Eloquent;


use Propaganistas\LaravelPhone\Casts\E164PhoneNumberCast;


final readonly class Cast
{
    public static function array(): string
    {
        return 'array';
    }


    public static function boolean(): string
    {
        return 'boolean';
    }


    public static function date(): string
    {
        return 'date';
    }


    public static function datetime(): string
    {
        return 'datetime';
    }


    public static function decimal(int $precision): string
    {
        return sprintf('decimal:%d', $precision);
    }


    /**
     * @param class-string $enum Class name of enumeration
     *
     * @return string
     */
    public static function enum(string $enum): string
    {
        return $enum;
    }


    public static function hashed(): string
    {
        return 'hashed';
    }


    /**
     * @param string|null $country Name of country field for which phone should be validated.
     *
     * @return string
     */
    public static function phone(string $country = null): string
    {
        return sprintf('%s:%s', E164PhoneNumberCast::class, $country ?: config('app.country'));
    }
}
