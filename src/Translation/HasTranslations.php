<?php

namespace OtherSoftware\Translation;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Str;
use OtherSoftware\Translation\Traits\Relationship;
use OtherSoftware\Translation\Traits\Scopes;


/**
 * @property-read null|Model $translation
 * @property-read Collection|Model[] $translations
 * @property-read string $translationModel
 * @property-read string $translationForeignKey
 * @property-read string $localeKey
 * @property-read bool $useTranslationFallback
 *
 * @mixin Model
 */
trait HasTranslations
{
    use Scopes, Relationship;


    protected static $autoloadTranslations = null;


    protected static $deleteTranslationsCascade = true;


    protected $defaultLocale;


    public static function bootHasTranslations(): void
    {
        static::saved(function (Model $model) {
            /* @var HasTranslations $model */
            $model->saveTranslations();
        });

        static::deleting(function (Model $model) {
            /* @var HasTranslations $model */
            if (self::$deleteTranslationsCascade === true) {
                $model->deleteTranslations();
            }
        });
    }


    public static function defaultAutoloadTranslations(): void
    {
        self::$autoloadTranslations = null;
    }


    public static function disableAutoloadTranslations(): void
    {
        self::$autoloadTranslations = false;
    }


    public static function disableDeleteTranslationsCascade(): void
    {
        self::$deleteTranslationsCascade = false;
    }


    public static function enableAutoloadTranslations(): void
    {
        self::$autoloadTranslations = true;
    }


    public static function enableDeleteTranslationsCascade(): void
    {
        self::$deleteTranslationsCascade = true;
    }


    public function __isset($key)
    {
        return $this->isTranslationAttribute($key) || parent::__isset($key);
    }


    public function attributesToArray(): array
    {
        $attributes = parent::attributesToArray();
        $relationLoaded = $this->relationLoaded('translations') || $this->relationLoaded('translation');
        $relationForced = $this->toArrayAlwaysLoadsTranslations();

        if ((! $relationLoaded && ! $relationForced && is_null(self::$autoloadTranslations)) || self::$autoloadTranslations === false) {
            return $attributes;
        }

        $hiddenAttributes = $this->getHidden();

        foreach ($this->translatedAttributes as $field) {
            if (in_array($field, $hiddenAttributes)) {
                continue;
            }

            $attributes[$field] = $this->getAttributeOrFallback(null, $field);
        }

        return $attributes;
    }


    /**
     * @param string|array|null $locales The locales to be deleted
     */
    public function deleteTranslations($locales = null): void
    {
        if ($locales === null) {
            $translations = $this->translations()->get();
        } else {
            $locales = (array) $locales;
            $translations = $this->translations()->whereIn($this->getLocaleKey(), $locales)->get();
        }

        $translations->each->delete();

        // we need to manually "reload" the collection built from the relationship
        // otherwise $this->translations()->get() would NOT be the same as $this->translations
        $this->load('translations');
    }


    public function fill(array $attributes)
    {
        foreach ($attributes as $key => $values) {
            if (
                $this->getLocalesHelper()->has($key)
                && is_array($values)
            ) {
                $this->getTranslationOrNew($key)->fill($values);
                unset($attributes[$key]);
            } else {
                [$attribute, $locale] = $this->getAttributeAndLocale($key);

                if (
                    $this->getLocalesHelper()->has($locale)
                    && $this->isTranslationAttribute($attribute)
                ) {
                    $this->getTranslationOrNew($locale)->fill([$attribute => $values]);
                    unset($attributes[$key]);
                }
            }
        }

        return parent::fill($attributes);
    }


    public function getAttribute($key)
    {
        [$attribute, $locale] = $this->getAttributeAndLocale($key);

        if ($this->isTranslationAttribute($attribute)) {
            if ($this->getTranslation($locale) === null) {
                return $this->getAttributeValue($attribute);
            }

            // If the given $attribute has a mutator, we push it to $attributes and then call getAttributeValue
            // on it. This way, we can use Eloquent's checking for Mutation, type casting, and
            // Date fields.
            if ($this->hasGetMutator($attribute)) {
                $this->attributes[$attribute] = $this->getAttributeOrFallback($locale, $attribute);

                return $this->getAttributeValue($attribute);
            }

            return $this->getAttributeOrFallback($locale, $attribute);
        }

        return parent::getAttribute($key);
    }


    public function getDefaultLocale(): ?string
    {
        return $this->defaultLocale;
    }


    public function setDefaultLocale(?string $locale)
    {
        $this->defaultLocale = $locale;

        return $this;
    }


    /**
     * @internal will change to protected
     */
    public function getLocaleKey(): string
    {
        return $this->localeKey ?: config('translations.locale_key', 'locale');
    }


    public function getNewTranslation(string $locale): Model
    {
        $translation = $this->translations()->make();

        $translation->setAttribute($this->getLocaleKey(), $locale);

        $this->translations->add($translation);

        return $translation;
    }


    public function getTranslation(?string $locale = null, bool $withFallback = false): ?Model
    {
        $configFallbackLocale = $this->getFallbackLocale();
        $locale = $locale ?: $this->locale();
        $fallbackLocale = $this->getFallbackLocale();

        if ($translation = $this->getTranslationByLocaleKey($locale)) {
            return $translation;
        }

        if ($withFallback && $fallbackLocale) {
            if ($translation = $this->getTranslationByLocaleKey($fallbackLocale)) {
                return $translation;
            }

            if (
                is_string($configFallbackLocale)
                && $fallbackLocale !== $configFallbackLocale
                && $translation = $this->getTranslationByLocaleKey($configFallbackLocale)
            ) {
                return $translation;
            }
        }

        if ($withFallback && $configFallbackLocale === null) {
            $configuredLocales = $this->getLocalesHelper()->all();

            foreach ($configuredLocales as $configuredLocale) {
                if (
                    $locale !== $configuredLocale
                    && $fallbackLocale !== $configuredLocale
                    && $translation = $this->getTranslationByLocaleKey($configuredLocale)
                ) {
                    return $translation;
                }
            }
        }

        return null;
    }


    public function getTranslationOrFail(string $locale): Model
    {
        if (($translation = $this->getTranslation($locale, false)) === null) {
            throw (new ModelNotFoundException)->setModel($this->getTranslationModelName(), $locale);
        }

        return $translation;
    }


    public function getTranslationOrNew(?string $locale = null): Model
    {
        $locale = $locale ?: $this->locale();

        if (($translation = $this->getTranslation($locale, false)) === null) {
            $translation = $this->getNewTranslation($locale);
        }

        return $translation;
    }


    public function getTranslationsArray(): array
    {
        $translations = [];

        foreach ($this->translations as $translation) {
            foreach ($this->translatedAttributes as $attr) {
                $translations[$translation->{$this->getLocaleKey()}][$attr] = $translation->{$attr};
            }
        }

        return $translations;
    }


    public function hasTranslation(?string $locale = null): bool
    {
        $locale = $locale ?: $this->locale();

        foreach ($this->translations as $translation) {
            if ($translation->getAttribute($this->getLocaleKey()) == $locale) {
                return true;
            }
        }

        return false;
    }


    public function isTranslationAttribute(string $key): bool
    {
        return in_array($key, $this->translatedAttributes);
    }


    public function replicateWithTranslations(array $except = null): Model
    {
        $newInstance = $this->replicate($except);

        unset($newInstance->translations);
        foreach ($this->translations as $translation) {
            $newTranslation = $translation->replicate();
            $newInstance->translations->add($newTranslation);
        }

        return $newInstance;
    }


    /**
     * @deprecated 2.0.0 Define your joins manually in your queries!
     */
    public function scopeJoinTranslation(Builder $builder): Builder
    {
        $table = $this->getTranslationsTable();

        $builder->leftJoin($table, function (JoinClause $builder) {
            $builder->on(
                str_concat_dot($this->getTable(), $this->getKeyName()),
                str_concat_dot($this->getTranslationsTable(), $this->getTranslationRelationKey())
            );

            $builder->where($this->getLocaleKey(), $this->localeOrFallback());
        });

        $builder->select(str_concat_dot($this->getTable(), '*'));

        foreach ($this->translatedAttributes as $attribute) {
            $builder->addSelect(str_concat_dot($this->getTranslationsTable(), $attribute));
        }

        return $builder;
    }


    public function setAttribute($key, $value)
    {
        [$attribute, $locale] = $this->getAttributeAndLocale($key);

        if ($this->isTranslationAttribute($attribute)) {
            $this->getTranslationOrNew($locale)->$attribute = $value;

            return $this;
        }

        return parent::setAttribute($key, $value);
    }


    public function translate(?string $locale = null, bool $withFallback = false): ?Model
    {
        return $this->getTranslation($locale, $withFallback);
    }


    public function translateOrDefault(?string $locale = null): ?Model
    {
        return $this->getTranslation($locale, true);
    }


    public function translateOrFail(string $locale): Model
    {
        return $this->getTranslationOrFail($locale);
    }


    public function translateOrNew(?string $locale = null): Model
    {
        return $this->getTranslationOrNew($locale);
    }


    protected function getAttributeAndLocale(string $key): array
    {
        if (Str::contains($key, ':')) {
            return explode(':', $key);
        }

        return [$key, $this->locale()];
    }


    protected function getAttributeOrFallback(?string $locale, string $attribute)
    {
        $translation = $this->getTranslation($locale);

        if (
            (
                ! $translation instanceof Model
                || $this->isEmptyTranslatableAttribute($attribute, $translation->$attribute)
            )
            && $this->usePropertyFallback()
        ) {
            $translation = $this->getTranslation($this->getFallbackLocale(), false);
        }

        if ($translation instanceof Model) {
            return $translation->$attribute;
        }

        return null;
    }


    protected function getFallbackLocale(): ?string
    {
        return config('translations.default');
    }


    protected function getLocalesHelper(): Locales
    {
        return app(Locales::class);
    }


    protected function getTranslationByLocaleKey(string $key): ?Model
    {
        if (
            $this->relationLoaded('translation')
            && $this->translation
            && $this->translation->getAttribute($this->getLocaleKey()) == $key
        ) {
            return $this->translation;
        }

        return $this->translations->firstWhere($this->getLocaleKey(), $key);
    }


    protected function isEmptyTranslatableAttribute(string $key, $value): bool
    {
        return empty($value);
    }


    protected function isTranslationDirty(Model $translation): bool
    {
        $dirtyAttributes = $translation->getDirty();
        unset($dirtyAttributes[$this->getLocaleKey()]);

        return count($dirtyAttributes) > 0;
    }


    protected function locale(): string
    {
        if ($this->getDefaultLocale()) {
            return $this->getDefaultLocale();
        }

        return $this->getLocalesHelper()->current();
    }


    protected function saveTranslations(): bool
    {
        $saved = true;

        if (! $this->relationLoaded('translations')) {
            return $saved;
        }

        foreach ($this->translations as $translation) {
            if ($saved && $this->isTranslationDirty($translation)) {
                if (! empty($connectionName = $this->getConnectionName())) {
                    $translation->setConnection($connectionName);
                }

                $translation->setAttribute($this->getTranslationRelationKey(), $this->getKey());
                $saved = $translation->save();
            }
        }

        if ($saved) {
            $this->fireModelEvent('translation.saved', false);
        }

        return $saved;
    }


    protected function toArrayAlwaysLoadsTranslations(): bool
    {
        return config('translations.to_array_always_loads_translations', true);
    }


    protected function useFallback(): bool
    {
        if (isset($this->useTranslationFallback) && is_bool($this->useTranslationFallback)) {
            return $this->useTranslationFallback;
        }

        return (bool) config('translations.use_fallback');
    }


    protected function usePropertyFallback(): bool
    {
        return $this->useFallback() && config('translations.use_property_fallback', false);
    }
}
