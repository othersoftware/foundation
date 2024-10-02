<?php

namespace OtherSoftware\Validation\Rules;


use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Validation\Validator;


class RequiredWithExplicitAddress implements ValidationRule, ValidatorAwareRule
{

    private string $countryField;


    private Validator $validator;


    public function __construct(string $countryField)
    {
        $this->countryField = $countryField;
    }


    public function setValidator(Validator $validator): static
    {
        $this->validator = $validator;

        return $this;
    }


    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! in_array($this->getCountry(), countries_with_implicit_address())) {
            if (! $this->validator->validateRequired($attribute, $value)) {
                $fail(trans('To pole jest wymagane dla wybranego kraju.'));
            }
        }
    }


    protected function getCountry()
    {
        return $this->validator->getValue($this->countryField);
    }
}
