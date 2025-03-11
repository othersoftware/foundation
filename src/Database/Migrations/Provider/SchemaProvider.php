<?php

namespace OtherSoftware\Database\Migrations\Provider;


use Closure;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\Provider\SchemaProvider as DoctrineSchemaProvider;
use FilesystemIterator;
use Illuminate\Database\Eloquent\Model;
use OtherSoftware\Database\Factory\SchemaFactory;
use RecursiveIteratorIterator;
use Symfony\Component\Finder\Iterator\RecursiveDirectoryIterator;


class SchemaProvider implements DoctrineSchemaProvider
{
    private static array $registered = [];


    public static function registerSchema(Closure $builder): void
    {
        static::$registered[] = $builder;
    }


    public function createSchema(): Schema
    {
        $schema = new Schema();
        $factory = new SchemaFactory($schema);

        foreach (static::$registered as $builder) {
            call_user_func($builder, $factory);
        }

        foreach ($this->findModels() as $model) {
            call_user_func([$model, 'schema'], $factory);
        }

        return $schema;
    }


    /**
     * @return array
     */
    protected function findModels(): array
    {
        $psr = require_once base_path('vendor/composer/autoload_psr4.php');
        $models = [];

        foreach ($psr as $namespace => $dirs) {
            foreach ($dirs as $dir) {
                $path = str_concat_path($dir, 'Models');

                if (false === (file_exists($path) && is_dir($path))) {
                    continue;
                }

                $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS));

                /** @var \SplFileInfo $file */
                foreach ($iterator as $file) {
                    $relative = str_replace($path, '', $file->getPath());
                    $basename = $file->getBasename('.php');
                    $class = $namespace . 'Models\\' . (! empty($relative) ? $relative . '\\' : '') . $basename;

                    if (! class_exists($class)) {
                        continue;
                    }

                    $reflection = new \ReflectionClass($class);

                    if (! $reflection->isSubclassOf(Model::class)) {
                        continue;
                    }

                    if (! $reflection->hasMethod('schema')) {
                        continue;
                    }

                    $models[] = $class;
                }
            }
        }

        return $models;
    }
}
