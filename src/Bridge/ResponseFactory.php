<?php

namespace OtherSoftware\Bridge;


use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View as IlluminateView;
use OtherSoftware\Bridge\Protocol\Redirect;
use OtherSoftware\Bridge\Stack\StackMeta;
use OtherSoftware\Bridge\Stack\View;
use OtherSoftware\Support\Facades\Toast;
use Symfony\Component\HttpFoundation\Response;


final class ResponseFactory implements Responsable
{
    private array $errors = [];


    private StackMeta $meta;


    private mixed $raw;


    private Redirect $redirect;


    private View $stack;


    private string $view;


    public function setErrors(array $errors): ResponseFactory
    {
        $this->errors = $errors;

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


    public function setStack(View $stack): ResponseFactory
    {
        $this->stack = $stack;

        return $this;
    }


    public function setStackMeta(StackMeta $meta): ResponseFactory
    {
        $this->meta = $meta;

        return $this;
    }


    public function setView(string $view): ResponseFactory
    {
        $this->view = $view;

        return $this;
    }


    public function toResponse($request): Response
    {
        $data = [];

        $data['location'] = $request->fullUrl();

        if (isset($this->meta)) {
            $data['signature'] = encrypt($this->meta->getViewStack());
        } else {
            $data['signature'] = $request->header('X-Stack-Signature');
        }

        if (isset($this->redirect)) {
            $data['redirect'] = $this->redirect->toArray();
        }

        $data['errors'] = $this->errors;

        if (isset($this->stack)) {
            $data['stack'] = $this->stack->toArray();
        }

        if (isset($this->raw)) {
            $data['raw'] = $this->raw;
        }

        $data['toasts'] = Toast::flush();

        if ($request->header('X-Stack-Router')) {
            $response = $this->getContinuousResponse($data);
        } else {
            $response = $this->getInitialResponse($data);
        }

        $response->headers->set('X-Stack-Signature', $data['signature']);

        return $response;
    }


    public function view(string $view, array $props = []): View
    {
        $this->setStack($instance = new View($view, $props));

        return $instance;
    }


    private function encodeJsonState(array $data): string
    {
        return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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
