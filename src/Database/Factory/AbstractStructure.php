<?php

namespace OtherSoftware\Database\Factory;


use Doctrine\DBAL\Schema\Table as SchemaTable;
use OtherSoftware\Database\Contracts\IStructureMaker;
use OtherSoftware\Database\Factory\Definitions\DefinesUniqueConstraint;


abstract class AbstractStructure implements IStructureMaker
{
    use DefinesUniqueConstraint;


    abstract function type(): string;


    protected Table $factory;


    protected string $name;


    protected array $options = [];


    public function __construct(string $name)
    {
        $this->name = $name;
    }


    public function after(SchemaTable $table, string $name): void
    {
        foreach (class_uses_recursive($class = static::class) as $trait) {
            $method = 'after' . class_basename($trait);

            if (! method_exists($class, $method)) {
                continue;
            }

            call_user_func([$this, $method], $table, $name);
        }
    }


    public function before(SchemaTable $table, string $name): void
    {
        foreach (class_uses_recursive($class = static::class) as $trait) {
            $method = 'before' . class_basename($trait);

            if (! method_exists($class, $method)) {
                continue;
            }

            call_user_func([$this, $method], $table, $name);
        }
    }


    public function boot(): void
    {
        foreach (class_uses_recursive($class = static::class) as $trait) {
            $method = 'boot' . class_basename($trait);

            if (! method_exists($class, $method)) {
                continue;
            }

            call_user_func([$this, $method]);
        }

        $this->booted();
    }


    public function booted(): void
    {
        // This method is called once the factory has been injected and all traits where booted.
    }


    public function comment(string $value): static
    {
        $this->options['comment'] = $value;

        return $this;
    }


    public function default(mixed $value): static
    {
        $this->options['default'] = $value;

        return $this;
    }


    public function make(SchemaTable $table): void
    {
        $this->before($table, $this->name);

        $table->addColumn($this->name, $this->type(), $this->options);

        $this->after($table, $this->name);
    }


    public function nullable(bool $value = true): static
    {
        $this->options['notnull'] = ! $value;

        return $this;
    }


    public function setTableFactory(Table $factory): static
    {
        $this->factory = $factory;

        return $this;
    }
}
