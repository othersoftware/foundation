<?php

namespace OtherSoftware\Support\Enums;


use BackedEnum;


/**
 * @mixin BackedEnum
 */
trait UsesDatabaseColumn
{
    public static function getDatabaseSize(): int
    {
        return max(array_map(fn(self $case) => strlen($case->value), self::cases()));
    }
}
