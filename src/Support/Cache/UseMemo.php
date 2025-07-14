<?php

namespace OtherSoftware\Support\Cache;


trait UseMemo
{
    protected array $memoizedEntries = [];


    /**
     * @template TReturn
     *
     * @param string $key
     * @param callable(): TReturn $callable
     *
     * @return TReturn
     */
    protected function memoize(string $key, callable $callable): mixed
    {
        if (! isset($this->memoizedEntries[$key])) {
            $this->memoizedEntries[$key] = $callable();
        }

        return $this->memoizedEntries[$key];
    }
}
