<?php

namespace OtherSoftware\Validation\Rules;


use Closure;
use Illuminate\Contracts\Validation\ValidationRule;


class Gtin implements ValidationRule
{
    public bool $implicit = true;


    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $this->isValidBarcode($value)) {
            $fail('validation.gtin');
        }
    }


    /**
     * Verifies if a given code is a valid EAN (GTIN-8, GTIN-12, GTIN-13, GTIN-14).
     */
    protected function isValidBarcode(string $barcode): bool
    {
        $barcode = trim($barcode);

        if (! ctype_digit($barcode)) {
            return false;
        }

        $length = strlen($barcode);

        if (! in_array($length, [8, 12, 13, 14])) {
            return false;
        }

        $core = substr($barcode, 0, -1);
        $checkDigit = (int) substr($barcode, -1);
        $reversedCore = strrev($core);
        $sum = 0;

        for ($i = 0; $i < strlen($reversedCore); $i++) {
            $digit = (int) $reversedCore[$i];
            $weight = ($i % 2 === 0) ? 3 : 1;
            $sum += $digit * $weight;
        }

        $calc = (10 - ($sum % 10)) % 10;

        return $calc === $checkDigit;
    }
}
