<?php

namespace OtherSoftware\Contracts;


use Illuminate\Support\Collection;
use Illuminate\Support\Enumerable;


interface DictionaryConvertible
{
    public static function toDictionary(Enumerable|array|null $keys = null): Collection;
}
