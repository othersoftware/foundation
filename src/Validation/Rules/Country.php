<?php

namespace OtherSoftware\Validation\Rules;


use Closure;
use Illuminate\Contracts\Validation\ValidationRule;


class Country implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! in_array($value, country_codes())) {
            $fail(trans('Podana wartość jest nieprawidłowa.'));
        }
    }
}
