<?php

namespace OtherSoftware\Http\Requests;


use Illuminate\Foundation\Http\FormRequest as IlluminateFormRequest;


class FormRequest extends IlluminateFormRequest
{
    public function validationRules(): array
    {
        $rules = parent::validationRules();

        if (method_exists($this, 'additional')) {
            $rules = array_merge($rules, $this->container->call([$this, 'additional']));
        }

        if (method_exists($this, 'overrides')) {
            $rules = array_merge($rules, $this->container->call([$this, 'overrides']));
        }

        return $rules;
    }
}
