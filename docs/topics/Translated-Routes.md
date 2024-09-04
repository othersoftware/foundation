# Translated Routes

With our custom Router implementation, you can create translations for your
routes in different locales supported by your app.

## Configuration

The package provides a configuration file for localization. You can configure
specific prefix and domain for certain locales, which then are applied during
routes registration, and when resolving app locale during a user visit based
on current URL.

```php
<?php

// config/translations.php

return [

    'default' => env('APP_FALLBACK_LOCALE', 'en'),

    'locales' => env('APP_AVAILABLE_LOCALES', ['en', 'pl', 'de']),

    'routing' => [
        'en' => [
            'prefix' => null,
            'domain' => null,
        ],
        'pl' => [
            'prefix' => 'pl',
            'domain' => null,
        ],
        'de' => [
            'prefix' => null,
            'domain' => 'test.de',
        ],
    ],

];
```

The example above provides the application with 3 different locales: English,
Polish and German. Let's say our app will be hosted by default under `test.com`
domain, and it has a route `/products` which has been translated.

Such configuration would lead to generate following routes:

```
EN: https://test.com/products
PL: https://test.com/pl/produkty
DE: https://test.de/produkte
```

For more specific localisation, you can combine both domain and prefixes in
configuration to generate routes, like below:

```
EN: https://test.co.uk/en/products
GD: https://test.co.uk/gd/products
```

> In such case you should also create some route for `https://test.co.uk/` which
> would attempt to detect preferred language and redirect user to a specific
> version (English or Scottish).

## Providing route translations

To provide route translations you can simply add multiple `Route` attributes
for your actions passing the `locale` argument to them. You have to provide
a `TranslatedRoute` attribute to the action to mark that it should be
translated.

```php
<?php

use Illuminate\Routing\Controller;
use OtherSoftware\Foundation\Routing\Attributes\Name;
use OtherSoftware\Foundation\Routing\Attributes\Route;
use OtherSoftware\Foundation\Routing\Attributes\TranslatedRoute;

class ProductController extends Controller {
    
    #[TranslatedRoute]
    #[Route('/products', locale: 'en')]
    #[Route('/produkty', locale: 'pl')]
    #[Route('/produkte', locale: 'de')]
    #[Name('app.products.index')]
    public function index() {
        // ...
    }
}
```

To make life a bit easier, when all actions within your controller are
translated, you can apply `TranslatedRoute` attribute to the controller class.

> **Remember!** It's not required to provide translations for your routes. When
> you want to keep your routes in English, and only apply domain / prefix rules
> to distinguish language versions, you can simply provide only one `Route`
> attribute along with `TranslatedRoute`, and the `Router` will generate all
> route localization variants based on your config and a route definition with
> default locale, or without specified locale at all. For example:
> ```php
> <?php
> 
> use Illuminate\Routing\Controller;
> use OtherSoftware\Foundation\Routing\Attributes\Name;
> use OtherSoftware\Foundation\Routing\Attributes\Route;
> use OtherSoftware\Foundation\Routing\Attributes\TranslatedRoute;
> 
> class ProductController extends Controller {
> 
>     #[TranslatedRoute]
>     #[Route('/products')]
>     #[Name('app.products.index')]
>     public function index() {
>         // ...
>     }
> }
> ```
> Would generate routes like:
> ```
> EN: https://test.com/products
> PL: https://test.com/pl/products
> DE: https://test.de/products
> ```

## Generating URL

The Router registers translated routes simply as a separate routes in the map.
To distinguish which routes are in which locale it generates route translations
with locale prefix in name. For example, the route:

```
app.products.index
```

will be generated in all variants like this:

```
pl.app.products.index
de.app.products.index
```

We provide our custom `UrlGenerator` service which automatically resolves proper
route name based on current app locale. When generating the URL you simply use
the basic route name like:

```php
route('app.products.index')
```

When app locale is set to `pl`, the `UrlGenerator` will automatically convert
it to `pl.app.products.index`, and will generate a URL with Polish translation.

When you need a URL in specific locale, you can pass a full route name with
locale prefix to `UrlGenerator` to force it generate URL in specific locale.

```php
route('en.app.products.index') // => https://test.com/products
route('pl.app.products.index') // => https://test.com/pl/produkty
route('de.app.products.index') // => https://test.de/produkte
```

This can be very useful, when you want to create a language switcher on your
website, and provide some URLs for it in all locales available.
