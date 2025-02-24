<?php

namespace OtherSoftware\Database\Eloquent;


use OtherSoftware\Database\Eloquent\Casts\DateCast;
use OtherSoftware\Database\Eloquent\Casts\DatetimeCast;
use OtherSoftware\Database\Eloquent\Casts\PhoneNumberCast;


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
        return DateCast::class;
    }


    public static function datetime(): string
    {
        return DatetimeCast::class;
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


    public static function json(): string
    {
        return 'json';
    }


    /**
     * @param string|null $country Name of country field for which phone should be validated.
     *
     * @return string
     */
    public static function phone(string $country = null): string
    {
        return sprintf('%s:%s', PhoneNumberCast::class, $country ?: config('app.country'));
    }
}
