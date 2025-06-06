<?php

namespace OtherSoftware\Bridge;


use Illuminate\Contracts\Support\Responsable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View as IlluminateView;
use OtherSoftware\Auth\Access\AbilityResponse;
use OtherSoftware\Bridge\Protocol\Redirect;
use OtherSoftware\Bridge\Stack\Stack;
use OtherSoftware\Bridge\Stack\View;
use OtherSoftware\Support\Facades\Toast;
use Symfony\Component\HttpFoundation\Response;


final class ResponseFactory implements Responsable
{
    private array $abilities = [];


    private array $errors = [];


    private string $guard = 'web';


    private mixed $raw;


    private Redirect $redirect;


    private View $rendered;


    private bool $rendersVueResponse = false;


    private Request $request;


    private Stack $stack;


    private string $view;


    public function __construct(Request $request)
    {
        $this->request = $request;
    }


    public function isVuePowered(?Request $request = null): bool
    {
        return (bool) ($request ?? $this->request)->header('X-Stack-Router');
    }


    public function noContent(): ResponseFactory
    {
        $this->raw = null;

        return $this;
    }


    public function rendersVueResponse(?Request $request = null): bool
    {
        return $this->rendersVueResponse || $this->isVuePowered($request);
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


    public function setRaw(mixed $raw): ResponseFactory
    {
        $this->raw = $raw;

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


    public function view(string $view, array $props = []): View
    {
        return $this->rendered = new View($view, $props);
    }


    private function encodeJsonState(array $data): string
    {
        return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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

        return view($this->view, ['initial' => $this->encodeJsonState($data)]);
    }
}
