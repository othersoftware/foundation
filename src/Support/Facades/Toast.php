<?php

namespace OtherSoftware\Support\Facades;


use Illuminate\Support\Facades\Facade;
use OtherSoftware\Bridge\Toasts\ToastFactory;
use OtherSoftware\Bridge\Toasts\ToastsManager;


/**
 * @method static ToastFactory danger(string $description)
 * @method static ToastFactory info(string $description)
 * @method static ToastFactory success(string $description)
 * @method static ToastFactory warning(string $description)
 * @method static ToastFactory[] flush()
 *
 * @see ToastsManager For implementation.
 */
final class Toast extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'toasts';
    }
}
