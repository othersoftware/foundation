<?php

namespace OtherSoftware\Bridge\Http\Node;


use Illuminate\Support\Facades\Http;
use OtherSoftware\Bridge\Exceptions\ServerRenderingException;
use OtherSoftware\Bridge\ServerConfiguration;
use Throwable;


class ServerRenderingGateway
{
    private ServerConfiguration $config;


    public function __construct(ServerConfiguration $config)
    {
        $this->config = $config;
    }


    public function render(array $visit): ?string
    {
        if (! $this->config->isServerRenderingEnabled()) {
            throw new ServerRenderingException("Invalid SSR configuration or JS bundle missing!");
        }

        try {
            $rendered = Http::post($this->config->getServerRenderUrl(), $visit)->throw()->body();
        } catch (Throwable $e) {
            throw new ServerRenderingException("SSR request failed!", previous: $e);
        }

        if (is_null($rendered)) {
            throw new ServerRenderingException("Empty SSR response detected!");
        }

        return $rendered;
    }
}
