<?php

namespace OtherSoftware\Validation\Rules;


class MaxUploadSize
{
    protected string $rule = 'max';


    public function __toString(): string
    {
        return $this->rule . ':' . $this->maxSizeInKilobytes();
    }


    private function maxSizeInKilobytes(): int
    {
        return (int) floor(server_max_size() / 1024);
    }
}
