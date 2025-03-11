<?php

namespace OtherSoftware\Database\Console\Commands;


use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;
use Symfony\Component\Console\Attribute\AsCommand;


#[AsCommand(name: 'db:seed:dictionaries')]
class SeedDictionariesCommand extends Command
{
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the database with dictionaries records';


    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'db:seed:dictionaries';


    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $this->components->info('Seeding database with dictionaries...');

        Model::unguarded(function () {
            if (class_exists($seeder = 'Database\\Dictionaries\\DictionariesSeeder')) {
                call_user_func($this->laravel->make($seeder)->setContainer($this->laravel)->setCommand($this));
            }
        });

        return 0;
    }
}
