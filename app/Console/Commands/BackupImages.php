<?php

namespace App\Console\Commands;

use App\Services\ImageBackupService;
use Illuminate\Console\Command;
use Exception;

class BackupImages extends Command
{
    protected $signature = 'images:backup {--tables=* : Tablas a respaldar (clientes, proveedores, productos, fotos_lugar). Dejar vacío para backup completo}';

    protected $description = 'Crea un backup ZIP de todas las imágenes del sistema';

    protected $backupService;

    public function __construct(ImageBackupService $backupService)
    {
        parent::__construct();
        $this->backupService = $backupService;
    }

    public function handle(): int
    {
        try {
            $tables = $this->option('tables');

            $this->info('🔄 Iniciando backup de imágenes...');
            $this->newLine();

            if (empty($tables)) {
                // Backup completo
                $this->info('📦 Creando backup COMPLETO de todas las imágenes...');
                $result = $this->backupService->createFullBackup();
            } else {
                // Backup selectivo
                $this->info('📦 Creando backup selectivo para: ' . implode(', ', $tables));
                $result = $this->backupService->createSelectiveBackup($tables);
            }

            $this->newLine();
            $this->info('✅ Backup completado exitosamente!');
            $this->newLine();

            $this->table(
                ['Propiedad', 'Valor'],
                [
                    ['Nombre del archivo', $result['backup_name']],
                    ['Tamaño', $result['file_size_formatted']],
                    ['Fecha de creación', $result['created_at']],
                    ['Ruta almacenada', $result['backup_path']],
                ]
            );

            $this->newLine();
            $this->info('📊 Estadísticas:');
            foreach ($result['stats'] as $key => $value) {
                if ($key !== 'errores') {
                    $this->line("  • $key: $value");
                }
            }

            if (!empty($result['stats']['errores'])) {
                $this->newLine();
                $this->warn('⚠️ Errores encontrados:');
                foreach ($result['stats']['errores'] as $error) {
                    $this->line("  • $error");
                }
            }

            $this->newLine();
            $this->info('💾 El backup se ha almacenado en: storage/app/' . $result['backup_path']);

            return Command::SUCCESS;
        } catch (Exception $e) {
            $this->error('❌ Error durante el backup: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
