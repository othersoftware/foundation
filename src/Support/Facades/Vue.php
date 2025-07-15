<?php

namespace OtherSoftware\Support\Facades;


use Closure;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Facade;
use OtherSoftware\Bridge\ResponseFactory;
use OtherSoftware\Bridge\Stack\StackMeta;
use OtherSoftware\Bridge\Stack\View;
use Symfony\Component\HttpFoundation\Response;


/**
 * @method static bool isVuePowered(?Request $request = null)
 * @method static bool rendersVueResponse(?Request $request = null)
 * @method static View view(string $view, Closure|array $props = [])
 * @method static View serverView(string $view, Closure|array $props = [])
 * @method static View staticView(string $view, Closure|array $props = [])
 * @method static ResponseFactory share(Arrayable|array|string $key, mixed $value = null)
 * @method static ResponseFactory getFacadeRoot()
 * @method static ResponseFactory setGuard(string $guard)
 * @method static ResponseFactory raw(mixed $raw)
 * @method static ResponseFactory setRedirect(string $target, bool $reload = false)
 * @method static ResponseFactory setStack(View $stack)
 * @method static ResponseFactory setStackMeta(StackMeta $meta)
 * @method static ResponseFactory setView(string $view)
 * @method static ResponseFactory setAbilities(array $abilities)
 * @method static ResponseFactory setMeta(array $meta)
 * @method static ResponseFactory noContent()
 * @method static ResponseFactory withErrors($provider, $key = 'default')
 * @method static Response toResponse(Request $request)
 */
final class Vue extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ResponseFactory::class;
    }
}
