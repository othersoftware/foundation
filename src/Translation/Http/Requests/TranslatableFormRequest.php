<?php

namespace OtherSoftware\Translation\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;


class TranslatableFormRequest extends FormRequest
{
    public function validatedTranslations(): mixed
    {
        return Arr::only($this->validated(), $this->translatableLocales());
    }


    protected function translatableDefaultLocale(): string
    {
        return config('translations.default');
    }


    protected function translatableLocales(): array
    {
        return resolve('translations.locales')->all();
    }


    protected function translatableValidationRules(): array
    {
        return method_exists($this, 'translatable') ? $this->container->call([$this, 'translatable']) : [];
    }


    protected function validationRules(): array
    {
        $rules = parent::validationRules();
        $translated = $this->translatableValidationRules();
        $default = $this->translatableDefaultLocale();


        foreach ($this->translatableLocales() as $locale) {
            if (! $this->has($locale) && $default !== $locale) {
                continue;
            }

            $rules[$locale] = $this->createTranslatableGroupRules($locale, $default);

            $mapper = function ($rule) use ($locale, $default) {
                if (str_starts_with($rule, 'required') && $locale !== $default) {
                    return 'nullable';
                }

                if (is_string($rule)) {
                    return str_replace('{locale}', $locale, $rule);
                }

                return $rule;
            };

            foreach ($translated as $field => $fieldRules) {
                $rules["$locale.$field"] = array_map($mapper, $fieldRules);
            }
        }

        return $rules;
    }


    private function createTranslatableGroupRules(string $locale, string $default): array
    {
        if ($locale === $default) {
            return ['required', 'array'];
        } else {
            return ['sometimes', 'array'];
        }
    }
}
