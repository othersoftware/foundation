<?php

return [

    'default' => env('APP_FALLBACK_LOCALE', 'en'),

    'locales' => explode(',', env('APP_AVAILABLE_LOCALES', 'en')),

    'routing' => [
        'en' => [
            'prefix' => null,
            'domain' => null,
        ],
    ],

];
