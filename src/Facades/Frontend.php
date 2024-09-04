<?php

namespace OtherSoftware\Foundation\Facades;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Facade;
use OtherSoftware\Foundation\Frontend\Factory;
use OtherSoftware\Foundation\Routing\Stack\StackedView;
use OtherSoftware\Foundation\Routing\Stack\StackedViewMap;
use Symfony\Component\HttpFoundation\Response;


/**
 * @method Factory view(string $view, array $props = [])
 * @method Factory setErrors(array $errors)
 * @method Factory setRaw(mixed $raw)
 * @method Factory setRedirect(string $target, bool $reload = false)
 * @method Factory setStack(StackedView $stack)
 * @method Factory setStackMeta(StackedViewMap $meta)
 * @method Factory setView(string $view)
 * @method Response toResponse(Request $request)
 */
final class Frontend extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return Factory::class;
    }
}
