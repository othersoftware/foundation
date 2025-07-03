<?php

namespace OtherSoftware\Bridge;


use Closure;
use Illuminate\Contracts\Cache\Factory as CacheFactory;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View as IlluminateView;
use OtherSoftware\Auth\Access\AbilityResponse;
use OtherSoftware\Bridge\Enums\RenderMode;
use OtherSoftware\Bridge\Http\Node\ServerRenderingGateway;
use OtherSoftware\Bridge\Protocol\Redirect;
use OtherSoftware\Bridge\Stack\Stack;
use OtherSoftware\Bridge\Stack\View;
use OtherSoftware\Support\Facades\Toast;
use Symfony\Component\HttpFoundation\Response;


final class ResponseFactory implements Responsable
{
    protected CacheFactory $cache;


    protected ServerConfiguration $server;


    private array $abilities = [];


    private array $errors = [];


    private string $guard = 'web';


    private array $meta;


    private RenderMode $mode = RenderMode::CLIENT;


    private mixed $raw;


    private Redirect $redirect;


    private View $rendered;


    private bool $rendersVueResponse = false;


    private array $shared;


    private Stack $stack;


    private string $view;


    public function __construct(ServerConfiguration $server, CacheFactory $cache)
    {
        $this->server = $server;
        $this->cache = $cache;
    }


    public function isVuePowered(?Request $request = null): bool
    {
        return (bool) ($request ?? request())->header('X-Stack-Router');
    }


    public function noContent(): ResponseFactory
    {
        $this->raw = null;

        return $this;
    }


    public function raw(mixed $raw): ResponseFactory
    {
        $this->raw = $raw;

        return $this;
    }


    public function rendersVueResponse(?Request $request = null): bool
    {
        return $this->rendersVueResponse || $this->isVuePowered($request);
    }


    public function serverView(string $view, array $props = []): View
    {
        $this->mode = RenderMode::SERVER;
        $this->rendered = new View($view, $props);

        return $this->rendered;
    }


    public function setAbilities(array $abilities): ResponseFactory
    {
        $this->abilities = array_merge($this->abilities, collect($abilities)->mapWithKeys(fn(AbilityResponse $res) => [$res->ability => $res->toArray()])->toArray());

        return $this;
    }


    public function setErrors(array $errors): ResponseFactory
    {
        $this->errors = $errors;

        return $this;
    }


    public function setGuard(string $guard): ResponseFactory
    {
        $this->guard = $guard;

        return $this;
    }


    public function setMeta(array $meta): ResponseFactory
    {
        $this->meta = $meta;

        return $this;
    }


    public function setRedirect(string $target, bool $reload = false): static
    {
        $this->redirect = new Redirect($target, $reload);

        return $this;
    }


    public function setRendered(View $rendered): ResponseFactory
    {
        $this->rendered = $rendered;

        return $this;
    }


    public function setStack(Stack $stack): ResponseFactory
    {
        $this->stack = $stack;

        return $this;
    }


    public function setView(string $view): ResponseFactory
    {
        $this->view = $view;

        return $this;
    }


    public function share(Arrayable|array|string $key, mixed $value = null): ResponseFactory
    {
        if (! isset($this->shared)) {
            $this->shared = [];
        }

        if (is_array($key)) {
            $this->shared = array_merge($this->shared, $key);
        } elseif ($key instanceof Arrayable) {
            $this->shared = array_merge($this->shared, $key->toArray());
        } else {
            Arr::set($this->shared, $key, value($value));
        }

        return $this;
    }


    public function staticView(string $view, Closure|array $props = []): View
    {
        $this->mode = RenderMode::STATIC;
        $this->rendered = new View($view, value($props));

        return $this->rendered;
    }


    public function toResponse($request): Response
    {
        $this->rendersVueResponse = true;

        $data = [];

        if (! isset($this->raw)) {
            if (isset($this->stack)) {
                $data['signature'] = encrypt($this->stack);
                $data['rawStack'] = $this->stack->toArray();
                $data['location'] = $request->fullUrl();
            } else {
                $data['signature'] = $request->header('X-Stack-Signature');
            }
        }

        if (isset($this->meta)) {
            $data['meta'] = $this->meta;
        }

        if (isset($this->shared)) {
            $data['shared'] = $this->shared;
        }

        if (isset($this->rendered)) {
            $data['stack'] = $this->rendered->toArray();
        }

        if (isset($this->redirect)) {
            $data['redirect'] = $this->redirect->toArray();
        }

        $data['abilities'] = (object) $this->abilities;
        $data['errors'] = $this->errors;

        if (isset($this->raw)) {
            $data['raw'] = $this->raw;
        }

        $data['toasts'] = Toast::flush();
        $data['authenticated'] = $this->getAuthenticatedUser();

        if ($this->isVuePowered($request)) {
            $response = $this->getContinuousResponse($data);
        } else {
            $response = $this->getInitialResponse($data);
        }

        if (isset($data['signature'])) {
            $response->headers->set('X-Stack-Signature', $data['signature']);
        }

        if (isset($this->raw)) {
            $response->headers->set('X-Raw', 'true');
        }

        return $response;
    }


    public function view(string $view, Closure|array $props = []): View
    {
        $this->mode = RenderMode::CLIENT;
        $this->rendered = new View($view, $props);

        return $this->rendered;
    }


    private function getAuthenticatedUser(): ?array
    {
        /** @var Model $authenticated */
        if ($authenticated = Auth::guard($this->guard)->user()) {
            return $authenticated->toArray();
        }

        return null;
    }


    private function getContinuousResponse(array $data): JsonResponse
    {
        return new JsonResponse($data);
    }


    private function getInitialResponse(array $data): Response
    {
        $content = $this->renderInitialView($data)->render();
        $headers = ['Content-Type' => 'text/html'];

        return new Response($content, 200, $headers);
    }


    private function renderInitialView(array $data): IlluminateView
    {
        assert(isset($this->view), 'Cannot find initial Blade view to render. Make sure you have wrapped your routes within Context middleware.');

        $rendered = match (true) {

            // When in SSG mode, we want to cache the rendered view in
            // the separate store. We want to keep separate the cached data
            // and the view. Since when a request is a continuous SPA request,
            // we no longer need a rendered view, only the data to be rendered
            // client side. Only initial page visits are rendered in this mode.
            $this->shouldRenderStatic() => $this->sendStaticRenderingRequest($data),

            // SSR mode is simply the same as SSG except it does not cache
            // the data or view. It is also used only for initial page loads.
            $this->shouldRenderServer() => $this->sendServerRenderingRequest($data),

            // For CSR mode we don't render anything since everything will be
            // rendered on the client side. There is no need to waste resources
            // here for rendering on server.
            default => '',

        };

        return view($this->view, ['initial' => $data, 'rendered' => $rendered]);
    }


    private function sendServerRenderingRequest(array $data): string
    {
        return App::make(ServerRenderingGateway::class)->render($data);
    }


    private function sendStaticRenderingRequest(array $data): string
    {
        return $this->sendServerRenderingRequest($data);

        // TODO Implement caching mechanisms for meta, props and rendered views.
        // return $this->cache->driver('foundation.views')->rememberForever(
        //     key: $this->cacheKey,
        //     callback: fn() => $this->sendServerRenderingRequest($data),
        // );
    }


    private function shouldRenderServer(): bool
    {
        return $this->mode->isServer() && $this->server->isServerRenderingEnabled();
    }


    private function shouldRenderStatic(): bool
    {
        return $this->mode->isStatic() && $this->server->isServerRenderingEnabled() && App::environment('production');
    }
}
