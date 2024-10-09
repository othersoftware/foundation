<?php

namespace OtherSoftware\Support;


use Illuminate\Support\ServiceProvider as BaseServiceProvider;
use Symfony\Component\Finder\Finder;


class ServiceProvider extends BaseServiceProvider
{
    /**
     * This method provides a functionality to register JSON translations
     * by recursively scanning provided path for directories, where every
     * directory found provides a set of JSON files with translations
     * for each application locale.
     *
     * It allows you to split your JSON translations files into separate
     * directories and files, without the need to manually register
     * all of them.
     *
     * @param string $path
     *
     * @return void
     */
    protected function bootRecursiveTranslations(string $path): void
    {
        foreach (Finder::create()->in($path)->directories() as $directory) {
            $this->loadJsonTranslationsFrom($directory);
        }
    }
}
