<?php

namespace OtherSoftware\Bridge\Stack;


use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Routing\Exceptions\UrlGenerationException;
use OtherSoftware\Routing\Route;
use RuntimeException;
use Serializable;


final class StackEntry implements Serializable, Arrayable
{
    /**
     * @var string
     */
    protected string $hash;


    /**
     * @var string
     */
    protected string $location;


    /**
     * @var string
     */
    protected string $name;


    /**
     * @var bool
     */
    private bool $keep = false;


    /**
     * @var Route
     */
    private Route $route;


    /**
     * @var bool
     */
    private bool $sealed = false;


    public function __construct(string $location)
    {
        $this->location = $location;
        $this->hash = $this->buildComparatorHashFromLocation($location);
    }


    public function __serialize(): array
    {
        return [
            'location' => $this->location,
            'hash' => $this->hash,
            'name' => $this->name,
        ];
    }


    public function __unserialize(array $data): void
    {
        $this->location = $data['location'];
        $this->hash = $data['hash'];
        $this->name = $data['name'];
    }


    /**
     * Creates a new StackEntry instance from a Route instance.
     *
     * @param Route $route A bound Route instance.
     *
     * @return self
     */
    public static function fromRoute(Route $route): self
    {
        try {
            return (new self($route->location()))->setRoute($route);
        } catch (UrlGenerationException $e) {
            throw new RuntimeException('Cannot generate route location for a stack entry. Make sure the route exists and you generate location after the route has been bound.', previous: $e);
        }
    }


    public function forceRun(): self
    {
        $this->preventSealedEntryModification();

        $this->keep = false;

        return $this;
    }


    public function getHash(): string
    {
        return $this->hash;
    }


    public function getLocation(): string
    {
        return $this->location;
    }


    public function getRoute(): Route
    {
        return $this->route;
    }


    public function setRoute(Route $route): StackEntry
    {
        $this->preventSealedEntryModification();

        $this->route = $route;

        $name = $route->getName();

        if (is_null($name)) {
            throw new RuntimeException('All routes must have a unique name to be used within the stack.');
        }

        $this->name = $name;

        return $this;
    }


    public function getRouteName(): string
    {
        return $this->name;
    }


    /**
     * This method checks if the current StackEntry is the same as the provided
     * one. It compares the hash of the two entries.
     *
     * @param StackEntry|null $entry The entry to compare with.
     *
     * @return bool
     */
    public function hasNotChanged(?StackEntry $entry): bool
    {
        if ($entry !== null) {
            return $this->getHash() === $entry->getHash();
        }

        return false;
    }


    /**
     * This method verifies if current entry matches given route name.
     *
     * @param string $name The route name to compare with.
     *
     * @return bool
     */
    public function is(string $name): bool
    {
        return $this->name === $name;
    }


    /**
     * This method marks StackEntry to be kept by the Router. Location and hash
     * are copied over, to make sure we keep the exact location from
     * the previous stack entry.
     *
     * @param StackEntry $previous The previous stack entry to be kept.
     *
     * @return $this
     */
    public function keep(StackEntry $previous): self
    {
        $this->preventSealedEntryModification();

        $this->location = $previous->getLocation();
        $this->hash = $previous->getHash();

        $this->keep = true;

        return $this;
    }


    public function seal(): self
    {
        $this->sealed = true;

        return $this;
    }


    /**
     * {@inheritDoc}
     */
    public function serialize(): string
    {
        return serialize([$this->location, $this->hash, $this->name]);
    }


    public function shouldKeep(): bool
    {
        return $this->keep;
    }


    /**
     * {@inheritDoc}
     */
    public function toArray(): array
    {
        return [
            'location' => $this->location,
            'hash' => $this->hash,
            'name' => $this->name,
            'keep' => $this->keep,
        ];
    }


    /**
     * {@inheritDoc}
     */
    public function unserialize(string $data): void
    {
        [$this->location, $this->hash, $this->name] = unserialize($data);
    }


    /**
     * This method builds a hash from the location string, which must be a valid
     * URL. It excludes query parameters and fragments from the location as we
     * don't take them into account when comparing two locations.
     *
     * @param string $location A valid URL of stack entry.
     *
     * @return string
     */
    private function buildComparatorHashFromLocation(string $location): string
    {
        $components = parse_url($location);

        if ($components === false) {
            throw new RuntimeException('Invalid location provided for stack entry.');
        }

        $scheme = $components['scheme'] ?? 'https';
        $host = $components['host'] ?? '';
        $path = $components['path'] ?? '';

        return hash('sha256', "{$scheme}://{$host}{$path}");
    }


    /**
     * @return void
     * @throws RuntimeException
     */
    private function preventSealedEntryModification(): void
    {
        if ($this->sealed) {
            throw new RuntimeException('This entry has already been resolved. You cannot modify it at this stage.');
        }
    }
}
