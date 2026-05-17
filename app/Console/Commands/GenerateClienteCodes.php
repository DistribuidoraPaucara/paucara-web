<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateClienteCodes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clientes:generate-codes {--localidad= : ID de la localidad específica}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generar códigos de cliente para registros existentes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $localidadId = $this->option('localidad');

        $query = \App\Models\Cliente::whereNull('codigo_cliente');

        if ($localidadId) {
            $query->where('localidad_id', $localidadId);
        }

        $clientes = $query->get();

        if ($clientes->isEmpty()) {
            $this->info('No hay clientes sin código.');
            return;
        }

        $this->info("Generando códigos para {$clientes->count()} clientes...");

        $bar = $this->output->createProgressBar($clientes->count());

        foreach ($clientes as $cliente) {
            if ($cliente->localidad_id) {
                $cliente->codigo_cliente = $cliente->generateCodigoCliente();
                $cliente->save();
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Códigos generados exitosamente.');
    }
}
