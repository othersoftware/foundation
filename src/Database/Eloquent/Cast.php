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


    public static function collection(): string
    {
        return 'collection';
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


    public static function double(): string
    {
        return 'double';
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


    public static function float(): string
    {
        return 'float';
    }


    public static function hashed(): string
    {
        return 'hashed';
    }


    public static function immutableDate(): string
    {
        return 'immutable_date';
    }


    public static function immutableDatetime(): string
    {
        return 'immutable_datetime';
    }


    public static function integer(): string
    {
        return 'integer';
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
        return sprintf('%s:%s', E164PhoneNumberCast::class, $country ?: config('app.country'));
    }


    public static function real(): string
    {
        return 'real';
    }


    public static function string(): string
    {
        return 'string';
    }


    public static function timestamp(): string
    {
        return 'timestamp';
    }
}
