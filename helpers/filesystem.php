<?php

use function Illuminate\Filesystem\join_paths;


if (! function_exists('filesize_for_human')) {
    function filesize_for_human(string $bytes, int $fractions = 2): string
    {
        $size = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        $factor = floor((strlen($bytes) - 1) / 3);

        return sprintf("%.{$fractions}f", $bytes / pow(1024, $factor)) . @$size[$factor];
    }
}

if (! function_exists('filesize_parse')) {
    function filesize_parse(string $size): int
    {
        $unit = preg_replace('/[^bkmgtpezy]/i', '', $size);
        $size = preg_replace('/[^0-9\.]/', '', $size);

        if ($unit) {
            return (int) round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
        }

        return (int) round((float) $size);
    }
}

if (! function_exists('server_max_size')) {
    function server_max_size(): int
    {
        static $serverMaxSizeCache;

        if (! isset($serverMaxSizeCache)) {
            $serverMaxSizeCache = min(
                filesize_parse(ini_get('post_max_size')),
                filesize_parse(ini_get('upload_max_filesize'))
            );
        }

        return $serverMaxSizeCache;
    }
}

if (! function_exists('rmdir_recursive')) {
    function rmdir_recursive($dir): bool
    {
        if (! is_dir($dir)) {
            return false;
        }

        $files = array_diff(scandir($dir), ['.', '..']);

        foreach ($files as $file) {
            if (is_dir($path = join_paths($dir, $file))) {
                @rmdir_recursive($dir);
            } else {
                @unlink($path);
            }
        }

        return @rmdir($dir);
    }
}
