<?php

namespace OtherSoftware\Events;


use Illuminate\Events\Dispatcher;
use OtherSoftware\Events\Attributes\Listen;
use ReflectionAttribute;
use ReflectionClass;
use ReflectionMethod;


abstract class AbstractSubscriber
{
    public function subscribe(Dispatcher $dispatcher): void
    {
        $reflection = new ReflectionClass($this);
        $methods = $reflection->getMethods(ReflectionMethod::IS_PUBLIC);

        foreach ($methods as $method) {
            foreach ($method->getAttributes(Listen::class) as $attribute) {
                $dispatcher->listen($this->getEventFromAttribute($attribute), [static::class, $method->getName()]);
            }
        }
    }


    private function getEventFromAttribute(ReflectionAttribute $attribute): string
    {
        return $attribute->newInstance()->event;
    }
}
