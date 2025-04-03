<?php

namespace OtherSoftware\Validation\Rules;


use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Validation\Validator;


class ExcludeWithImplicitAddress implements ValidationRule, ValidatorAwareRule
{
    public bool $implicit = true;


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
        if (in_array($this->getCountry(), countries_implicitly_addressed())) {
            // This is a bit hacky, as Laravel doesn't let you define custom
            // exclude rules, but since attributes are marked as excluded when
            // a new failure is added, this will work.
            $this->validator->addFailure($attribute, 'Exclude');
        }
    }


    protected function getCountry()
    {
        return $this->validator->getValue($this->countryField);
    }
}
