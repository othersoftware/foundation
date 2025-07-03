<?php

namespace OtherSoftware\Bridge;


use Illuminate\Contracts\Config\Repository;
use RuntimeException;


final class ServerConfiguration
{
    private string $bundle;


    private bool $enabled;


    private string $port;


    private string $runtime;


    private string $url;


    public function __construct(Repository $config)
    {
        $this->enabled = (bool) $config->get('foundation.ssr.enabled', false);
        $this->bundle = $config->get('foundation.ssr.bundle', 'bootstrap/ssr/server.js');
        $this->port = $config->get('foundation.ssr.port', '2137');
        $this->url = $config->get('foundation.ssr.url', '127.0.0.1');
        $this->runtime = $config->get('foundation.ssr.runtime', 'node');
    }


    public function getServerHealthUrl(): string
    {
        return sprintf('http://%s:%s/health', $this->getServerRenderingHost(), $this->getServerRenderingPort());
    }


    public function getServerRenderUrl(): string
    {
        return sprintf('http://%s:%s/render', $this->getServerRenderingHost(), $this->getServerRenderingPort());
    }


    public function getServerRenderingBundle(): string
    {
        if (! file_exists($this->bundle)) {
            throw new RuntimeException("SSR bundle was not found in specified path \"{$this->bundle}\".");
        }

        return $this->bundle;
    }


    public function getServerRenderingHost(): string
    {
        return $this->url;
    }


    public function getServerRenderingPort(): string
    {
        return $this->port;
    }


    public function getServerRenderingRuntime(): string
    {
        return $this->runtime;
    }


    public function getServerShutdownUrl(): string
    {
        return sprintf('http://%s:%s/shutdown', $this->getServerRenderingHost(), $this->getServerRenderingPort());
    }


    public function isServerRenderingEnabled(): bool
    {
        return $this->enabled;
    }
}
