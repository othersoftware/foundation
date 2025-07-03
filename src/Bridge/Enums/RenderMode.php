<?php

namespace OtherSoftware\Bridge\Enums;


enum RenderMode: string
{
    case CLIENT = 'CSR';
    case STATIC = 'SSG';
    case SERVER = 'SSR';


    public function isClient(): bool
    {
        return $this === self::CLIENT;
    }


    public function isServer(): bool
    {
        return $this === self::SERVER;
    }


    public function isStatic(): bool
    {
        return $this === self::STATIC;
    }
}
