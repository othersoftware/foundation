<?php

namespace OtherSoftware\Translation;


use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Translation\Translator;
use OtherSoftware\Translation\Exception\LocalesNotDefinedException;


class Locales implements Arrayable
{
    protected Repository $config;


    /**
     * @var string[]
     */
    protected array $locales = [];


    protected Translator $translator;


    public function __construct(Repository $config, Translator $translator)
    {
        $config = (array) $config->get('translations.locales', []);

        if (empty($config)) {
            throw LocalesNotDefinedException::make();
        }

        $this->locales = $config;
        $this->translator = $translator;
    }


    public function add(string $locale): void
    {
        $this->locales[$locale] = $locale;
    }


    public function all(): array
    {
        return array_values($this->locales);
    }


    public function current(): string
    {
        return $this->translator->getLocale();
    }


    public function forget(string $locale): void
    {
        unset($this->locales[$locale]);
    }


    public function get(string $locale): ?string
    {
        return $this->locales[$locale] ?? null;
    }


    public function has(string $locale): bool
    {
        return isset($this->locales[$locale]);
    }


    public function toArray(): array
    {
        return $this->all();
    }
}
