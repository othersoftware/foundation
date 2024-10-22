<?php

namespace OtherSoftware\Support\Facades;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Facade;
use OtherSoftware\Bridge\ResponseFactory;
use OtherSoftware\Bridge\Stack\StackMeta;
use OtherSoftware\Bridge\Stack\View;
use Symfony\Component\HttpFoundation\Response;


/**
 * @method bool isVuePowered(Request $request)
 * @method ResponseFactory view(string $view, array $props = [])
 * @method ResponseFactory getFacadeRoot()
 * @method ResponseFactory setErrors(array $errors)
 * @method ResponseFactory setRaw(mixed $raw)
 * @method ResponseFactory setRedirect(string $target, bool $reload = false)
 * @method ResponseFactory setStack(View $stack)
 * @method ResponseFactory setStackMeta(StackMeta $meta)
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
