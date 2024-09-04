# Nested Routes

When you want to create a nested route with, for example, modal window where
user can enter just basic information about product to create it, you can make
a `create` action nested under `index` action using `Nested` attribute.

```php
<?php

use Illuminate\Routing\Controller;
use OtherSoftware\Foundation\Routing\Attributes\Method;
use OtherSoftware\Foundation\Routing\Attributes\Name;
use OtherSoftware\Foundation\Routing\Attributes\Nested;
use OtherSoftware\Foundation\Routing\Attributes\Route;

class ProductController extends Controller {
    
    #[Route('/products')]
    #[Name('app.products.index')]
    public function index() {
        // ...
    }
    
    #[Route('/products/create')]
    #[Name('app.products.create')]
    #[Nested('app.products.index')]
    public function create() {
        // ...
    }
}
```

This will create a relation where a `create` action is a child of `index`
action. Basically when router will receive an initial request for `create`,
it will first process the `index` action, and then it will run `create`
action. The frontend on the other hand will keep the `index` page "underneath"
the `create` page.

We call this mechanism a "View Stack", you can read more about how it works
[here](View-Stack.md).

> **Important!** Keep in mind when creating a nested routes, that the parent
> route should contain within the child route. For example when you have
> a parent route URL like that:
> ```
> /products/{product}/variants
> ```
> Then the nested child route should start with its parent like that:
> ```
> /products/{product}/variants/create
> ```
> Check the View Stack docs where it's explained in details why.
