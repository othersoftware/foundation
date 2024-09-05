<?php

namespace OtherSoftware\Support\Facades;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Facade;
use OtherSoftware\Bridge\ResponseFactory;
use OtherSoftware\Foundation\Routing\Stack\StackedView;
use OtherSoftware\Foundation\Routing\Stack\StackedViewMap;
use Symfony\Component\HttpFoundation\Response;


/**
 * @method ResponseFactory view(string $view, array $props = [])
 * @method ResponseFactory getFacadeRoot()
 * @method ResponseFactory setErrors(array $errors)
 * @method ResponseFactory setRaw(mixed $raw)
 * @method ResponseFactory setRedirect(string $target, bool $reload = false)
 * @method ResponseFactory setStack(StackedView $stack)
 * @method ResponseFactory setStackMeta(StackedViewMap $meta)
 * @method ResponseFactory setView(string $view)
 * @method Response toResponse(Request $request)
 */
final class Vue extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ResponseFactory::class;
    }
}
