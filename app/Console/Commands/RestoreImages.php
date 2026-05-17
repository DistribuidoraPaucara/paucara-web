<?php

namespace App\Console\Commands;

use App\Services\ImageBackupService;
use Illuminate\Console\Command;
use Exception;

class RestoreImages extends Command
{
    protected $signature = 'images:restore {backup? : Nombre del archivo de backup (sin la ruta completa)} {--skip-existing : Saltar archivos que ya existen} {--list : Listar backups disponibles}';

    protected $description = 'Restaura imágenes desde un backup ZIP';

    protected $backupService;

    public function __construct(ImageBackupService $backupService)
    {
        parent::__construct();
        $this->backupService = $backupService;
    }

    public function handle(): int
    {
        try {
            // Mostrar lista de backups si se solicita
            if ($this->option('list')) {
                return $this->listBackups();
            }

            $backup = $this->argument('backup');

            // Si no se proporciona backup, mostrar lista y pedir que seleccione
            if (!$backup) {
                return $this->selectBackup();
            }

            $skipExisting = $this->option('skip-existing');

            $this->info('🔄 Iniciando restauración de imágenes...');
            $this->newLine();
            $this->info("📦 Restaurando desde: $backup");

            if ($skipExisting) {
                $this->info('⏭️  Modo: Saltar archivos existentes');
            } else {
                $this->warn('⚠️  Modo: Sobrescribir archivos existentes');
            }

            // Confirmar antes de restaurar
            if (!$this->confirm('¿Deseas continuar con la restauración?')) {
                $this->info('Restauración cancelada.');
                return Command::SUCCESS;
            }

            $this->newLine();

            $result = $this->backupService->restoreBackup($backup, $skipExisting);

            $this->newLine();
            $this->info('✅ Restauración completada exitosamente!');
            $this->newLine();

            $this->table(
                ['Métrica', 'Cantidad'],
                [
                    ['Archivos restaurados', $result['stats']['archivos_restaurados']],
                    ['Archivos saltados', $result['stats']['archivos_saltados']],
                    ['Errores', count($result['stats']['errores'])],
                ]
            );

            if (!empty($result['stats']['errores'])) {
                $this->newLine();
                $this->warn('⚠️ Errores encontrados:');
                foreach ($result['stats']['errores'] as $error) {
                    $this->line("  • $error");
                }
            }

            return Command::SUCCESS;
        } catch (Exception $e) {
            $this->error('❌ Error durante la restauración: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }

    protected function listBackups(): int
    {
        $backups = $this->backupService->listBackups();

        if (empty($backups)) {
            $this->warn('No hay backups disponibles.');
            return Command::SUCCESS;
        }

        $this->info('📋 Backups disponibles:');
        $this->newLine();

        $rows = [];
        foreach ($backups as $index => $backup) {
            $rows[] = [
                $index + 1,
                $backup['name'],
                $backup['size_formatted'],
                $backup['created_at_formatted']
            ];
        }

        $this->table(
            ['#', 'Nombre', 'Tamaño', 'Creado'],
            $rows
        );

        return Command::SUCCESS;
    }

    protected function selectBackup(): int
    {
        $backups = $this->backupService->listBackups();

        if (empty($backups)) {
            $this->warn('No hay backups disponibles.');
            $this->info('Crea uno primero usando: php artisan images:backup');
            return Command::FAILURE;
        }

        $this->info('📋 Backups disponibles:');
        $this->newLine();

        $choices = [];
        foreach ($backups as $backup) {
            $choices[] = $backup['name'] . ' (' . $backup['size_formatted'] . ') - ' . $backup['created_at_formatted'];
        }

        $selected = $this->choice('Selecciona un backup para restaurar:', $choices);

        // Extraer nombre del backup desde la selección
        $backupName = explode(' ', $selected)[0];

        $skipExisting = $this->confirm('¿Saltar archivos que ya existen?', true);

        $this->info('🔄 Iniciando restauración...');
        $this->newLine();

        $result = $this->backupService->restoreBackup($backupName, $skipExisting);

        $this->newLine();
        $this->info('✅ Restauración completada exitosamente!');
        $this->newLine();

        $this->table(
            ['Métrica', 'Cantidad'],
            [
                ['Archivos restaurados', $result['stats']['archivos_restaurados']],
                ['Archivos saltados', $result['stats']['archivos_saltados']],
                ['Errores', count($result['stats']['errores'])],
            ]
        );

        if (!empty($result['stats']['errores'])) {
            $this->newLine();
            $this->warn('⚠️ Errores encontrados:');
            foreach ($result['stats']['errores'] as $error) {
                $this->line("  • $error");
            }
        }

        return Command::SUCCESS;
    }
}
