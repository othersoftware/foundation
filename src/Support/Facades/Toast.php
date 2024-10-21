<?php

namespace OtherSoftware\Support\Facades;


use Illuminate\Support\Facades\Facade;
use OtherSoftware\Bridge\Toasts\ToastFactory;


/**
 * @method ToastFactory danger(string $description)
 * @method ToastFactory info(string $description)
 * @method ToastFactory success(string $description)
 * @method ToastFactory warning(string $description)
 * @method ToastFactory[] flush()
 */
final class Toast extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'toasts';
    }
}
