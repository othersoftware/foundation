<?php

namespace OtherSoftware\Routing\Attributes;


use Attribute;
use Illuminate\Routing\Route;
use Illuminate\Routing\RouteRegistrar;


#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
readonly class Where
{
    public string $param;


    public string $regex;


    public array $values;


    public function __construct(string $param, string $regex, array|string $values = [])
    {
        $this->param = $param;
        $this->regex = $regex;
        $this->values = $this->parseValues($values);
    }


    public function bind(RouteRegistrar|Route $registrar): void
    {
        match ($this->regex) {
            'number' => $registrar->whereNumber($this->param),
            'alpha' => $registrar->whereAlpha($this->param),
            'alphanumeric' => $registrar->whereAlphaNumeric($this->param),
            'uuid' => $registrar->whereUuid($this->param),
            'ulid' => $registrar->whereUlid($this->param),
            'in' => $registrar->whereIn($this->param, $this->values),
            default => $registrar->where([$this->param => $this->regex]),
        };
    }


    private function parseValues(array|string $values): array
    {
        if (is_string($values)) {
            if (enum_exists($values)) {
                return forward_static_call([$values, 'cases']);
            }

            return explode(',', $values);
        }

        return $values;
    }
}
