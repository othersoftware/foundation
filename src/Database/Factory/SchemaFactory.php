<?php

namespace OtherSoftware\Database\Factory;


use Closure;
use Doctrine\DBAL\Schema\Schema;
use Illuminate\Support\Facades\Event;


final class SchemaFactory
{
    public function __construct(
        private readonly Schema $schema,
    ) {
    }


    /**
     * @param string             $name
     * @param Closure(self):void $builder
     *
     * @return void
     */
    public function table(string $name, Closure $builder): void
    {
        $table = new Table($name);

        $table->setOptionCharset(config('doctrine.charset.default'));
        $table->setOptionCollation(config('doctrine.charset.collation'));

        $builder->call($table, $table);

        Event::dispatch('schema.create.' . $name, compact('table'));

        $table->make($this->schema);
    }
}
