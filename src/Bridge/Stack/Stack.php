<?php

namespace OtherSoftware\Bridge\Stack;


use ArrayAccess;
use ArrayIterator;
use Countable;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Arr;
use RuntimeException;
use Serializable;


final class Stack implements Countable, ArrayAccess, Serializable, Arrayable
{
    /**
     * An array containing all stack entries being resolved.
     *
     * @var StackEntry[]
     */
    private array $entries;


    private ArrayIterator $iterator;


    /**
     * Indicated whether a stack has been built and hydrated with necessary
     * data. It is then sealed to avoid any "unintended" data changes
     * to the stack.
     *
     * @var bool
     */
    private bool $sealed = false;


    /**
     * Creates a new stack instance.
     *
     * @param StackEntry|array $entries Initial entries for the stack.
     */
    public function __construct(StackEntry|array $entries = [])
    {
        $this->entries = $entries instanceof StackEntry ? [$entries] : $entries;
    }


    /**
     * Returns a serialization-friendly arbitrary representation of the object.
     *
     * @return array[]
     */
    public function __serialize(): array
    {
        return [
            'entries' => $this->entries,
        ];
    }


    /**
     * Restores the object from a serialized representation array.
     *
     * @param array $data The serialized object representation.
     *
     * @return void
     */
    public function __unserialize(array $data): void
    {
        $this->entries = $data['entries'];
    }


    public function append(StackEntry $entry): self
    {
        $this->preventSealedStackModification();

        if ($offset = array_find_key($this->entries, fn(StackEntry $item) => $item->is($entry->getRouteName()))) {
            array_splice($this->entries, $offset);
        }

        $this->entries[] = $entry;

        return $this;
    }


    public function compare(Stack $next, bool $changed = false): Stack
    {
        $previous = $this;
        $total = count($next) - 1;

        $fresh = new Stack();

        for ($i = 0; $i <= $total; $i++) {
            $isLast = ($i === $total);

            $a = $next[$i];
            $b = $previous[$i] ?? null;

            $fresh->append($a);

            if ($changed || $isLast) {
                $a->forceRun();
                continue;
            }

            if ($a->hasNotChanged($b)) {
                $a->keep($b);
                continue;
            }

            $changed = true;
        }

        return $fresh;
    }


    /**
     * {@inheritDoc}
     */
    public function count(): int
    {
        return count($this->entries);
    }


    public function current(): ?StackEntry
    {
        if (isset($this->iterator)) {
            return $this->iterator->current();
        }

        return null;
    }


    /**
     * Returns and stores an ArrayIterator for the stack. This method should be
     * used when running a stack within the router.
     *
     * @return ArrayIterator
     */
    public function getIterator(): ArrayIterator
    {
        return $this->iterator = new ArrayIterator($this->entries);
    }


    /**
     * This method allows hydration of stack entries without generating
     * an ArrayIterator. This method should only be used when hydrating a stack
     * from the request.
     *
     * @param callable(StackEntry $entry): void $callback
     *
     * @return $this
     */
    public function hydrate(callable $callback): self
    {
        foreach ($this->entries as $entry) {
            if (false === $callback($entry)) {
                return new self();
            }
        }

        return $this;
    }


    public function isEmpty(): bool
    {
        return $this->count() <= 0;
    }


    public function isNotEmpty(): bool
    {
        return $this->count() > 0;
    }


    public function last(): ?StackEntry
    {
        return Arr::last($this->entries);
    }


    public function next(): ?StackEntry
    {
        if (isset($this->iterator)) {
            return $this->entries[$this->iterator->key() + 1] ?? null;
        }

        return null;
    }


    /**
     * {@inheritDoc}
     */
    public function offsetExists(mixed $offset): bool
    {
        return isset($this->entries[$offset]);
    }


    /**
     * {@inheritDoc}
     */
    public function offsetGet(mixed $offset): StackEntry
    {
        return $this->entries[$offset];
    }


    /**
     * {@inheritDoc}
     */
    public function offsetSet(mixed $offset, mixed $value): void
    {
        throw new RuntimeException('Cannot directly set a StackEntry into Stack, use append() or prepend() methods instead.');
    }


    /**
     * {@inheritDoc}
     */
    public function offsetUnset(mixed $offset): void
    {
        throw new RuntimeException('Cannot directly unset a StackEntry from a Stack.');
    }


    public function pop(): self
    {
        $this->preventSealedStackModification();

        array_pop($this->entries);

        return $this;
    }


    public function prepend(StackEntry $entry): self
    {
        $this->preventSealedStackModification();

        array_unshift($this->entries, $entry);

        return $this;
    }


    public function previous(): ?StackEntry
    {
        if (isset($this->iterator)) {
            return $this->entries[$this->iterator->key() - 1] ?? null;
        }

        return Arr::last($this->entries);
    }


    public function seal(): self
    {
        if ($this->sealed) {
            return $this;
        }

        foreach ($this->entries as $entry) {
            $entry->seal();
        }

        $this->sealed = true;

        return $this;
    }


    /**
     * {@inheritDoc}
     */
    public function serialize(): string
    {
        return serialize([$this->entries]);
    }


    /**
     * {@inheritDoc}
     */
    public function toArray(): array
    {
        return array_map(fn(StackEntry $entry) => $entry->toArray(), $this->entries);
    }


    /**
     * {@inheritDoc}
     */
    public function unserialize(string $data): void
    {
        [$this->entries] = unserialize($data);
    }


    private function preventSealedStackModification(): void
    {
        if ($this->sealed) {
            throw new RuntimeException('This stack has already been sealed. You cannot modify it at this stage.');
        }
    }
}
