<?php

return [

    'ssr' => [
        'enabled' => env('FOUNDATION_SSR_ENABLED', false),
        'url' => env('FOUNDATION_SSR_URL', '127.0.0.1'),
        'port' => env('FOUNDATION_SSR_PORT', 2137),
        'bundle' => env('FOUNDATION_SSR_BUNDLE', 'bootstrap/ssr/server.js'),
        'runtime' => env('FOUNDATION_SSR_RUNTIME', 'node'),
    ],

];
