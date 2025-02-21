<?php

namespace OtherSoftware\Auth\Access;


use Illuminate\Auth\Access\Response;
use Illuminate\Support\Str;
use Override;
use RuntimeException;


class AbilityResponse extends Response
{
    public readonly string $ability;


    #[Override]
    public static function allow($message = null, $code = null)
    {
        return new static(static::resolveAbilityName(), true, $message, $code);
    }


    #[Override]
    public static function deny($message = null, $code = null)
    {
        return new static(static::resolveAbilityName(), false, $message, $code);
    }


    private static function resolveAbilityName(): string
    {
        $ability = collect(debug_backtrace())->where(fn(array $trace) => Str::startsWith(data_get($trace, 'function', ''), ['can', 'cannot']))->value('function');

        assert(filled($ability), new RuntimeException('Cannot resolve ability name. Abilities functions must start with "can" or "cannot".'));

        return $ability;
    }


    public function __construct($ability, $allowed, $message = '', $code = null)
    {
        $this->ability = $ability;
        parent::__construct($allowed, $message, $code);
    }


    #[Override]
    public function toArray(): array
    {
        return array_merge(parent::toArray(), ['denied' => $this->denied()]);
    }
}
