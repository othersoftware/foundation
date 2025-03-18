<?php

namespace OtherSoftware\Validation\Rules;


use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Symfony\Component\Intl\Currencies;


class Currency implements ValidationRule
{
    public bool $implicit = true;


    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! Currencies::exists($value)) {
            $fail(trans('Podana wartość jest nieprawidłowa.'));
        }
    }
}
