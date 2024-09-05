<?php

namespace OtherSoftware\Bridge\Stack;


use Serializable;


final class Meta implements Serializable
{
    public readonly string $hash;


    private bool $keep = false;


    private bool $run = false;


    public function __construct(string $hash)
    {
        $this->hash = $hash;
    }


    public function __serialize(): array
    {
        return [
            'hash' => $this->hash,
            'keep' => $this->keep,
            'run' => $this->run,
        ];
    }


    public function __unserialize(array $data): void
    {
        $this->hash = $data['hash'];
        $this->keep = $data['keep'];
        $this->run = $data['run'];
    }


    public function forceRun(): self
    {
        $this->run = true;
        $this->keep = false;

        return $this;
    }


    public function keep(): self
    {
        $this->run = false;
        $this->keep = true;

        return $this;
    }


    public function reload(): self
    {
        return $this->forceRun();
    }


    public function serialize(): string
    {
        return serialize([
            'hash' => $this->hash,
            'keep' => $this->keep,
            'run' => $this->run,
        ]);
    }


    public function shouldKeep(): bool
    {
        return $this->keep;
    }


    public function shouldRun(): bool
    {
        return $this->run;
    }


    public function unserialize(string $data): void
    {
        [$this->hash, $this->keep, $this->run] = unserialize($data);
    }
}
