<?php

/** @noinspection PhpMissingReturnTypeInspection */

namespace OtherSoftware\Database\Eloquent;


use Carbon\CarbonImmutable;
use DateTimeImmutable;
use DateTimeInterface;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Model as EloquentModel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use IntlDateFormatter;
use IntlDatePatternGenerator;
use OtherSoftware\Contracts\Translatable;
use OtherSoftware\Http\Resources\FormResource;
use OtherSoftware\Support\Facades\Vue;
use Override;


abstract class Model extends EloquentModel
{
    /**
     * List of relations that should be loaded and serialized as an array of
     * keys for form resources.
     *
     * @var array
     */
    protected array $formRelations = [];


    #[Override]
    public function asDateTime($value)
    {
        // We make this protected function public, as we need it in custom
        // date and datetime casters.
        return parent::asDateTime($value);
    }


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
    public function getOriginal($key = null, $default = null)
    {
        if ($key) {
            return parent::getOriginal(Str::snake($key), $default);
        }

        return parent::getOriginal($key, $default);
    }


    public function getSerializedDates()
    {
        $dates = [];

        foreach ($this->getArrayableAttributes() as $key => $value) {
            if ($this->isDateAttribute($key) || $this->hasCast($key, [Cast::datetime(), Cast::date()])) {
                $dates[$key] = empty($value) ? $value : $this->serializeDate($this->asDateTime($value));
            }
        }

        return array_camel_keys($dates);
    }


    #[Override]
    public function isDirty($attributes = null)
    {
        if (is_null($attributes)) {
            return parent::isDirty();
        }

        if (is_array($attributes)) {
            return parent::isDirty(array_map(fn($attr) => Str::snake($attr), $attributes));
        }

        return parent::isDirty(array_map(fn($attr) => Str::snake($attr), func_get_args()));
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
    public function relationsToArray()
    {
        if (FormResource::rendersForForm()) {
            $attributes = [];

            foreach ($this->formRelations as $name) {
                $this->loadMissing($name);
            }

            foreach ($this->getArrayableRelations() as $key => $value) {
                // Skip translations, as this relation is processed separately
                // in the FormResource class.
                if ($this instanceof Translatable && $key === 'translations') {
                    continue;
                }

                if ($value instanceof Collection) {
                    if (in_array($key, $this->formRelations)) {
                        $relation = $value->map(fn(EloquentModel $related) => $related->getKey())->toArray();
                    } else {
                        $relation = $value->map(fn(EloquentModel $related) => FormResource::make($related))->toArray();
                    }
                } elseif ($value instanceof EloquentModel) {
                    $relation = FormResource::make($value);
                } elseif (is_null($value)) {
                    $relation = $value;
                }

                if (isset($relation)) {
                    $attributes[$key] = $relation;
                }

                unset($relation);
            }

            return $attributes;
        }

        return parent::relationsToArray();
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


    /**
     * This method provides an option to run a callback once a transaction
     * has been committed. When called outside of transaction it will be
     * executed straight away.
     *
     * @param callable $callback
     *
     * @return void
     */
    protected function runHandlerAfterCommit(callable $callback): void
    {
        if (Container::getInstance()->bound('db.transactions')) {
            if (! is_null($transactions = Container::getInstance()->make('db.transactions'))) {
                $transactions->addCallback($callback);
                return;
            }
        }

        $callback();
    }


    #[Override]
    protected function serializeDate(DateTimeInterface $date)
    {
        if (FormResource::rendersForForm()) {
            $instance = $date instanceof DateTimeImmutable ? CarbonImmutable::instance($date) : Carbon::instance($date);

            if ($instance->isStartOfDay()) {
                return $instance->format('Y-m-d');
            }

            return $instance->format('Y-m-d H:i');
        }

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


    #[Override]
    protected function setKeysForSaveQuery($query)
    {
        if (is_array($this->primaryKey)) {
            return $query->where($this->getKeysForCompositePrimaryKey());
        }

        return parent::setKeysForSaveQuery($query);
    }


    #[Override]
    protected function setKeysForSelectQuery($query)
    {
        if (is_array($this->primaryKey)) {
            return $query->where($this->getKeysForCompositePrimaryKey());
        }

        return parent::setKeysForSelectQuery($query);
    }


    private function getKeysForCompositePrimaryKey(): array
    {
        assert(is_array($this->primaryKey));

        $keys = [];

        foreach ($this->primaryKey as $attr) {
            $keys[$attr] = $this->original[$attr] ?? $this->getAttribute($attr);
        }

        return $keys;
    }
}
