<?php

namespace OtherSoftware\Database\Eloquent\Casts;


use DateTimeInterface;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Contracts\Database\Eloquent\SerializesCastableAttributes;
use Illuminate\Database\Eloquent\Model;
use IntlDateFormatter;
use IntlDatePatternGenerator;
use OtherSoftware\Http\Resources\FormResource;
use OtherSoftware\Support\Facades\Vue;


class DateCast implements CastsAttributes, SerializesCastableAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes)
    {
        if (is_null($value)) {
            return null;
        }

        assert($model instanceof \OtherSoftware\Database\Eloquent\Model, 'This cast can work only with OtherSoftware based models.');

        return $model->asDateTime($value)->startOfDay();
    }


    public function serialize(Model $model, string $key, mixed $value, array $attributes)
    {
        if (is_null($value)) {
            return null;
        }

        if ($date = $model->asDateTime($value)) {
            return match (true) {
                FormResource::rendersForForm() => $date->format('Y-m-d'),
                Vue::rendersVueResponse() => $this->format($date),
                default => $date->toJSON(),
            };
        }

        return null;
    }


    public function set(Model $model, string $key, mixed $value, array $attributes)
    {
        return $model->fromDateTime($value);
    }


    protected function format(DateTimeInterface $date): string
    {
        $locale = config('app.locale');
        $pattern = (new IntlDatePatternGenerator($locale))->getBestPattern('dd-MM-yyyy');
        $formatter = new IntlDateFormatter(locale: $locale, pattern: $pattern);

        return $formatter->format($date);
    }
}
