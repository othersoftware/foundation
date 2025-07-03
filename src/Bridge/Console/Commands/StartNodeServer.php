<?php

namespace OtherSoftware\Bridge\Console\Commands;


use Illuminate\Console\Command;
use OtherSoftware\Bridge\Exceptions\ServerRenderingException;
use OtherSoftware\Bridge\ServerConfiguration;
use Symfony\Component\Process\Process;


class StartNodeServer extends Command
{
    protected $description = 'Start the SSR node server.';


    protected $signature = 'frontend:start {--runtime : The runtime to use (`node` or `bun`)}';


    public function handle(ServerConfiguration $config): int
    {
        if (! $config->isServerRenderingEnabled()) {
            $this->error('SSR is not enabled. Enable it via the `visitor.ssr.enabled` config option.');

            return self::FAILURE;
        }

        $this->callSilently('frontend:stop');

        $runtime = $this->option('runtime') ?: $config->getServerRenderingRuntime();

        $process = new Process([$runtime, $config->getServerRenderingBundle()]);
        $process->setTimeout(null);
        $process->start();

        $stop = function () use ($process) {
            $process->stop();
        };

        pcntl_async_signals(true);
        pcntl_signal(SIGINT, $stop);
        pcntl_signal(SIGQUIT, $stop);
        pcntl_signal(SIGTERM, $stop);

        foreach ($process as $type => $data) {
            if ($process::OUT === $type) {
                $this->info(trim($data));
            } else {
                $this->error(trim($data));

                report(new ServerRenderingException($data));
            }
        }

        return self::SUCCESS;
    }
}
