<?php

/** @noinspection PhpMissingReturnTypeInspection */

namespace OtherSoftware\Database\Eloquent;


use Carbon\CarbonImmutable;
use DateTimeImmutable;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model as EloquentModel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use IntlDateFormatter;
use IntlDatePatternGenerator;
use OtherSoftware\Support\Facades\Vue;
use Override;


abstract class Model extends EloquentModel
{
    #[Override]
    public function fill(array $attributes)
    {
        return parent::fill(array_snake_keys($attributes));
    }


    #[Override]
    public function getAttribute($key)
    {
        if (! $key) {
            return null;
        }

        if ($this->isRelation($key)) {
            return parent::getAttribute($key);
        }

        $key = Str::snake($key);

        return parent::getAttribute($key);
    }


    #[Override]
    public function isFillable($key): bool
    {
        return parent::isFillable(Str::snake($key));
    }


    #[Override]
    public function isGuarded($key): bool
    {
        return parent::isGuarded(Str::snake($key));
    }


    #[Override]
    public function setAttribute($key, $value)
    {
        if (str_contains($key, '->')) {
            $key = join('->', array_map(Str::snake(...), explode('->', $key)));
        } else {
            $key = Str::snake($key);
        }

        return parent::setAttribute($key, $value);
    }


    #[Override]
    public function toArray()
    {
        return array_camel_keys(parent::toArray());
    }


    #[Override]
    protected function serializeDate(DateTimeInterface $date)
    {
        if (Vue::rendersVueResponse()) {
            $instance = $date instanceof DateTimeImmutable ? CarbonImmutable::instance($date) : Carbon::instance($date);
            $locale = config('app.locale');

            if ($instance->isStartOfDay()) {
                $pattern = (new IntlDatePatternGenerator($locale))->getBestPattern('dd/MM/yyyy');
            } else {
                $pattern = (new IntlDatePatternGenerator($locale))->getBestPattern('dd/MM/yyyy HH:mm');
            }

            $formatter = new IntlDateFormatter(locale: $locale, pattern: $pattern);

            return $formatter->format($instance);
        }

        return parent::serializeDate($date);
    }
}
