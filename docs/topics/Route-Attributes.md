# Route Attributes

This package provides some PHP attributes which can be used to define your
routes directly above your actions in controllers. It uses our custom
`RouteRegistrar` service to collect these attributes and map it into a standard
Laravel's route map. Thanks to that, all existing Laravel routing features
still works fine (for example route caching).

We found it's much better to define your routes like that, since you have your
action and all routing data at the same place. You don't need to jump to
separate routing files to check what middlewares are applied for a certain
route.

> You can keep going with a traditional way of defining routes, but at the
> moment, nested routes, and translated routes are available only using
> PHP attributes and `RouteRegistrar` service.
> {style="warning"}

## Setup

To use our `RouteRegistrar` service, simply go to one of your existing Laravel
route files, for example `web.php`, and declare which path you want to scan
for route attributes:

```php
<?php

use Illuminate\Support\Facades\Route;
use OtherSoftware\Foundation\Routing\Router;
use OtherSoftware\Foundation\Routing\Routes\RouteRegistrar;

Route::middleware('web')->group(function (Router $router) {
    RouteRegistrar::register($router, app_path('Http/Controllers'));
});
```

Route registrar will work within that group defined, so all middlewares,
prefixes, names, etc. configured for that route group, would be applied to
the routes created by registrar.

> We recommend to only provide there some base middlewares, like `web` or `api`,
> so you can keep your configured middlewares just next to routes definitions
> inside controllers.

## Creating new routes

Simply define an attribute above your action within controller. The `Route`
attribute takes two parameters: path and locale (about which you can read
[here](Translated-Routes.md)).

By default, when you define a route, it's matching HTTP method will be `GET`.
To define other HTTP method for a route you can use `Method` attribute which
accepts one or more methods as its arguments.

Below there is an example of Laravel resource controller with example basic
routes attributes configured:

```php
<?php

use App\Models\Product;
use Illuminate\Routing\Controller;
use OtherSoftware\Foundation\Routing\Attributes\Method;
use OtherSoftware\Foundation\Routing\Attributes\Route;

class ProductController extends Controller {
    
    #[Route('/products')]
    public function index() {
        // ...
    }
    
    #[Route('/products/create')]
    public function create() {
        // ...
    }
    
    #[Route('/products')]
    #[Method('POST')]
    public function store() {
        // ...
    }
    
    #[Route('/products/{product}')]
    public function show(Product $product) {
        // ...
    }
    
    #[Route('/products/{product}/edit')]
    public function edit(Product $product) {
        // ...
    }
    
    #[Route('/products/{product}')]
    #[Method('PATCH')]
    public function update(Product $product) {
        // ...
    }
    
    #[Route('/products/{product}')]
    #[Method('DELETE')]
    public function destroy(Product $product) {
        // ...
    }
}
```

As you might know when defining API routes you must also take care about CORS
and `HEAD` requests sent by browsers before the actual `GET` request being sent.
Laravel handles that in a way that every `GET` route will also match `HEAD`.
We keep this the same way, so everything is kept consistent.

Similar approach happens for `PATCH` / `PUT` methods, and as in modern web apps
`PUT` methods doesn't make a lot of sense, Laravel resource controllers matches
both `PATCH` and `PUT` for `update` actions. We do the same, so when you define
a route method to be either `PUT` or `PATCH` it will always match both.

> In our opinion, it's better to avoid prefixes for paths and names within
> Laravel route files where you run `RouteRegistrar`, and within
> controllers using PHP attributes on the class level, and to use absolute
> paths and names in your route attributes for certain actions, since it makes
> it much easier to find some specific routes by the path or name later on.

## Naming routes

To specify names for your routes, which are required for example, to create
nested routes, you can use `Name` attribute.

```php
<?php

use Illuminate\Routing\Controller;
use OtherSoftware\Foundation\Routing\Attributes\Method;
use OtherSoftware\Foundation\Routing\Attributes\Name;
use OtherSoftware\Foundation\Routing\Attributes\Route;

class ProductController extends Controller {
    
    #[Route('/products')]
    #[Name('app.products.index')]
    public function index() {
        // ...
    }
}
```

## Middleware

You can apply middleware for routes by using `Middleware` attribute both
at the controller or action level. When you add middleware for controller class,
it will apply for all actions defined within it.

```php
<?php

use Illuminate\Routing\Controller;
use OtherSoftware\Foundation\Routing\Attributes\Middleware;
use OtherSoftware\Foundation\Routing\Attributes\Name;
use OtherSoftware\Foundation\Routing\Attributes\Route;

#[Middleware('auth')]
class ProductController extends Controller {
    
    #[Route('/products')]
    #[Name('app.products.index')]
    public function index() {
        // ...
    }
    
    #[Route('/products/create')]
    #[Name('app.products.create')]
    #[Middleware('verified')]
    public function create() {
        // ...
    }
}
```

> For nested routes, middlewares are collected from parent routes as well and
> will run before currently requested route.
