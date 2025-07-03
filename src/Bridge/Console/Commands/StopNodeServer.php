<?php

namespace OtherSoftware\Bridge\Console\Commands;


use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use OtherSoftware\Bridge\ServerConfiguration;


class StopNodeServer extends Command
{
    protected $description = 'Stop the SSR server';


    protected $signature = 'frontend:stop';


    public function handle(ServerConfiguration $config): int
    {
        $ch = curl_init($config->getServerShutdownUrl());
        curl_exec($ch);

        if (curl_error($ch) !== 'Empty reply from server') {
            Log::error(curl_error($ch));
            $this->error('Unable to connect to SSR server.');

            return self::FAILURE;
        }

        $this->info('SSR server stopped.');

        curl_close($ch);

        return self::SUCCESS;
    }
}
