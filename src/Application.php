<?php

namespace OtherSoftware\Foundation;


use Illuminate\Events\EventServiceProvider;
use Illuminate\Foundation\Application as BaseApplication;
use Illuminate\Log\Context\ContextServiceProvider;
use Illuminate\Log\LogServiceProvider;
use OtherSoftware\Foundation\Providers\FrontendServiceProvider;
use OtherSoftware\Foundation\Providers\RoutingServiceProvider;
use OtherSoftware\Foundation\Providers\TranslationServiceProvider;
use Override;


class Application extends BaseApplication
{
    #[Override]
    protected function registerBaseServiceProviders(): void
    {
        $this->register(new EventServiceProvider($this));
        $this->register(new LogServiceProvider($this));
        $this->register(new ContextServiceProvider($this));
        $this->register(new TranslationServiceProvider($this));
        $this->register(new RoutingServiceProvider($this));
        $this->register(new FrontendServiceProvider($this));
    }
}
