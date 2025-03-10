<?php

namespace OtherSoftware\Validation\Rules;


use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Symfony\Component\Intl\Countries;


class Country implements ValidationRule
{
    public bool $implicit = true;


    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! Countries::exists($value)) {
            $fail(trans('Podana wartość jest nieprawidłowa.'));
        }
    }
}
