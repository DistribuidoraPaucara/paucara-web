<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PrinterService;

class TestPrinterConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'printer:test {--verbose : Mostrar información detallada}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Prueba la conexión a la impresora térmica en red';

    /**
     * Execute the console command.
     */
    public function handle(PrinterService $printerService)
    {
        $this->info('🖨️  Probando conexión a impresora térmica...');
        $this->newLine();

        // Mostrar configuración
        $config = $printerService->getConfig();
        $this->table(
            ['Parámetro', 'Valor'],
            [
                ['Host', $config['host']],
                ['Puerto', $config['port']],
                ['Ancho Papel', $config['paperWidth'] . 'mm'],
                ['Habilitada', $config['enabled'] ? 'Sí ✅' : 'No ❌'],
            ]
        );

        $this->newLine();

        // Si no está habilitada, avisar
        if (!$config['enabled']) {
            $this->warn('⚠️  La impresora está deshabilitada en la configuración.');
            $this->info('Para habilitarla, establece PRINTER_ENABLED=true en .env');
            return self::FAILURE;
        }

        // Intentar conexión
        $this->info('Intentando conectar...');

        if ($printerService->testConnection()) {
            $this->newLine();
            $this->info('✅ ¡Conexión exitosa!');
            $this->info('La impresora está configurada correctamente y es accesible en red.');
            $this->newLine();

            if ($this->option('verbose')) {
                $this->info('La impresora está lista para imprimir tickets automáticamente cuando se creen ventas.');
                $this->info('Verificar que:');
                $this->info('  • La IP ' . $config['host'] . ' es correcta');
                $this->info('  • El puerto ' . $config['port'] . ' está habilitado en la impresora');
                $this->info('  • La impresora no tiene restricciones de red/firewall');
            }

            return self::SUCCESS;
        } else {
            $this->newLine();
            $this->error('❌ Error de conexión');
            $this->error('No se pudo conectar a la impresora.');
            $this->newLine();

            $this->info('Verificar:');
            $this->info('  1. IP correcta: ' . $config['host']);
            $this->info('  2. Puerto correcto: ' . $config['port']);
            $this->info('  3. Impresora encendida y en red');
            $this->info('  4. Firewall/Red permite conexión');
            $this->info('  5. IP asignada a la impresora (revisar panel impresora)');
            $this->newLine();

            $this->info('Para cambiar configuración, edita .env:');
            $this->info('  PRINTER_HOST=<ip_correcta>');
            $this->info('  PRINTER_PORT=<puerto_correcto>');

            return self::FAILURE;
        }
    }
}
