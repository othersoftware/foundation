<?php

namespace OtherSoftware\Database\Eloquent;


use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Casts\AsEnumCollection;
use OtherSoftware\Database\Eloquent\Casts\AsEnumArray;
use OtherSoftware\Database\Eloquent\Casts\DateCast;
use OtherSoftware\Database\Eloquent\Casts\DatetimeCast;
use OtherSoftware\Database\Eloquent\Casts\PhoneNumberCast;
use UnitEnum;


final readonly class Cast
{
    public static function array(): string
    {
        return 'array';
    }


    public static function asCollectionOf(mixed $map): string
    {
        return AsCollection::of($map);
    }


    /**
     * @param class-string<UnitEnum> $class
     *
     * @return string
     */
    public static function asEnumArray(string $class): string
    {
        return AsEnumArray::of($class);
    }


    /**
     * @param class-string<UnitEnum> $class
     *
     * @return string
     */
    public static function asEnumCollection(string $class): string
    {
        return AsEnumCollection::of($class);
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


    public static function encrypted(): string
    {
        return 'encrypted';
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


    public static function object(): string
    {
        return 'object';
    }


    /**
     * @param string|null $country Name of country field for which phone should be validated.
     *
     * @return string
     */
    public static function phone(?string $country = null): string
    {
        return sprintf('%s:%s', PhoneNumberCast::class, $country ?: config('app.country'));
    }
}
