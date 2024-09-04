<?php

namespace OtherSoftware\Foundation\Frontend;


use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use OtherSoftware\Foundation\Routing\Stack\StackedView;
use OtherSoftware\Foundation\Routing\Stack\StackedViewMap;
use OtherSoftware\Foundation\Routing\Support\RouterRedirect;
use Symfony\Component\HttpFoundation\Response;


class Factory implements Responsable
{
    private array $errors = [];


    private StackedViewMap $meta;


    private mixed $raw;


    private RouterRedirect $redirect;


    private StackedView $stack;


    private string $view;


    public function setErrors(array $errors): Factory
    {
        $this->errors = $errors;

        return $this;
    }


    public function setRaw(mixed $raw): Factory
    {
        $this->raw = $raw;

        return $this;
    }


    public function setRedirect(string $target, bool $reload = false): static
    {
        $this->redirect = new RouterRedirect($target, $reload);

        return $this;
    }


    public function setStack(StackedView $stack): Factory
    {
        $this->stack = $stack;

        return $this;
    }


    public function setStackMeta(StackedViewMap $meta): Factory
    {
        $this->meta = $meta;

        return $this;
    }


    public function setView(string $view): Factory
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

        if ($request->header('X-Stack-Router')) {
            $response = $this->getContinuousResponse($data);
        } else {
            $response = $this->getInitialResponse($data);
        }

        $response->headers->set('X-Stack-Signature', $data['signature']);

        return $response;
    }


    public function view(string $view, array $props = []): static
    {
        return $this->setStack(new StackedView($view, $props));
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


    private function renderInitialView(array $data): View
    {
        return view($this->view, ['initial' => $this->encodeJsonState($data)]);
    }
}
