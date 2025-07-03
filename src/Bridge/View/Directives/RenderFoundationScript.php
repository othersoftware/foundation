<?php

namespace OtherSoftware\Bridge\View\Directives;


class RenderFoundationScript
{
    public static function compile(): string
    {
        return '<script id="fdn-init" type="application/json"><?php echo json_encode($initial, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?></script>';
    }
}
