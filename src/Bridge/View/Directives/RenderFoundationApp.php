<?php

namespace OtherSoftware\Bridge\View\Directives;


class RenderFoundationApp
{
    public static function compile($expression = ''): string
    {
        $id = trim(trim($expression), "\'\"") ?: 'app';

        return '<div id="' . $id . '"><?php echo $rendered; ?></div>';
    }
}
