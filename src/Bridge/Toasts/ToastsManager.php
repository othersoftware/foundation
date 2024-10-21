<?php

namespace OtherSoftware\Bridge\Toasts;


use OtherSoftware\Bridge\Enums\ToastKind;


class ToastsManager
{
    private array $toasts = [];


    public function danger(string $description): ToastFactory
    {
        return $this->push(new ToastFactory($description, ToastKind::DANGER));
    }


    public function flush(): array
    {
        return tap($this->toasts, function () {
            $this->toasts = [];
        });
    }


    public function info(string $description): ToastFactory
    {
        return $this->push(new ToastFactory($description, ToastKind::INFO));
    }


    public function success(string $description): ToastFactory
    {
        return $this->push(new ToastFactory($description, ToastKind::SUCCESS));
    }


    public function warning(string $description): ToastFactory
    {
        return $this->push(new ToastFactory($description, ToastKind::WARNING));
    }


    protected function push(ToastFactory $toast): ToastFactory
    {
        $this->toasts[] = $toast;

        return $toast;
    }
}
