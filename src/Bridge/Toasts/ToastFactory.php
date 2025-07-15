<?php

namespace OtherSoftware\Bridge\Toasts;


use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Jsonable;
use Illuminate\Support\Str;
use JsonSerializable;
use OtherSoftware\Bridge\Enums\ToastKind;


final class ToastFactory implements Arrayable, Jsonable, JsonSerializable
{
    private string $id;


    private string $description;


    private int $duration;


    private ToastKind $kind;


    public function __construct(string $description, ToastKind $kind = ToastKind::SUCCESS, ?int $duration = null)
    {
        $this->id = Str::random(6);
        $this->description = $description;
        $this->duration = $duration ?: $this->getAverageDuration($description);
        $this->kind = $kind;
    }


    /**
     * This function computes a toast duration, based on an average reading
     * speed of 180 words per minute. For short toasts, a minimum 3-second
     * duration is always returned, to avoid toasts only blinking
     * on the screen.
     *
     * @param string $description
     *
     * @return int
     */
    private function getAverageDuration(string $description): int
    {
        $words = (int) preg_match_all('/\p{L}+/u', $description);
        $rate = 180;

        $minutes = $words / $rate;
        $seconds = round($minutes * 60);

        return max($seconds, 3);
    }


    public function getDescription(): string
    {
        return $this->description;
    }


    public function setDescription(string $description): ToastFactory
    {
        $this->description = $description;

        return $this;
    }


    public function getDuration(): int
    {
        return $this->duration;
    }


    public function setDuration(int $duration): ToastFactory
    {
        $this->duration = $duration;

        return $this;
    }


    public function getKind(): ToastKind
    {
        return $this->kind;
    }


    public function setKind(ToastKind $kind): ToastFactory
    {
        $this->kind = $kind;

        return $this;
    }


    public function jsonSerialize(): array
    {
        return $this->toArray();
    }


    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'duration' => $this->duration,
            'kind' => $this->kind->value,
        ];
    }


    public function toJson($options = 0): string
    {
        return json_encode($this->toArray(), $options);
    }
}
