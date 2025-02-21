<?php

namespace OtherSoftware\Support\Facades;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Facade;
use OtherSoftware\Bridge\ResponseFactory;
use OtherSoftware\Bridge\Stack\StackMeta;
use OtherSoftware\Bridge\Stack\View;
use Symfony\Component\HttpFoundation\Response;


/**
 * @method static bool isVuePowered(?Request $request = null)
 * @method static bool rendersVueResponse(?Request $request = null)
 * @method static ResponseFactory view(string $view, array $props = [])
 * @method static ResponseFactory getFacadeRoot()
 * @method static ResponseFactory setErrors(array $errors)
 * @method static ResponseFactory setRaw(mixed $raw)
 * @method static ResponseFactory setRedirect(string $target, bool $reload = false)
 * @method static ResponseFactory setStack(View $stack)
 * @method static ResponseFactory setStackMeta(StackMeta $meta)
 * @method static ResponseFactory setView(string $view)
 * @method static ResponseFactory setAbilities(array $abilities)
 * @method static Response toResponse(Request $request)
 */
final class Vue extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ResponseFactory::class;
    }
}
