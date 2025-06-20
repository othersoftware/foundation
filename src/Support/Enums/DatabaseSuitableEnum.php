<?php

namespace OtherSoftware\Support\Enums;


use BackedEnum;
use Illuminate\Database\Eloquent\Casts\Json;


/**
 * This trait includes useful methods for string-backed enums which are intended
 * to be used within database columns.
 *
 * @author Rafał Krawiec <rafal.krawiec@promoznawcy.pl>
 * @copyright 2025 Promoznawcy Sp. z o.o.
 * @since 1.0.0
 *
 * @noinspection PhpUnused
 * @mixin BackedEnum
 */
trait DatabaseSuitableEnum
{
    /**
     * Returns a maximum column size for all cases being stored as an JSON
     * array within a database column.
     *
     * @return int
     */
    public static function getDatabaseArraySize(): int
    {
        return strlen(Json::encode(array_map(fn(self $case) => $case->value, self::cases())));
    }


    /**
     * Returns a longest enum case length.
     *
     * @return int
     */
    public static function getDatabaseSize(): int
    {
        return max(array_map(fn(self $case) => strlen($case->value), self::cases()));
    }
}
