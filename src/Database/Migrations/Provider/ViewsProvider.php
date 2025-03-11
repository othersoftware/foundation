<?php

namespace OtherSoftware\Database\Migrations\Provider;


use Illuminate\Support\Facades\DB;
use Symfony\Component\Finder\Finder;


class ViewsProvider
{
    public function createViews()
    {
        $finder = new Finder();
        $finder->in(__DIR__ . '/../../../../../../database/views');
        $finder->name('*.php');
        $finder->sortByName();

        foreach ($finder as $file) {
            $generator = require $file->getRealPath();
            $name = explode('_', $file->getBasename('.php'));
            array_shift($name);
            $name = implode('_', $name);

            call_user_func($generator, $query = DB::query());

            DB::unprepared("create or replace view $name as ({$query->toRawSql()})");
        }
    }
}
