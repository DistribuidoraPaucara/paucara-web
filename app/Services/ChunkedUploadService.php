<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Exception;

class ChunkedUploadService
{
    protected $uploadDisk = 'local';
    protected $chunksTempDir = 'backups/temp_chunks';
    protected $backupDir = 'backups/images';

    /**
     * Obtener ruta completa del directorio de chunks temporales
     */
    protected function getChunksTempDir(): string
    {
        $dir = storage_path('app' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $this->chunksTempDir));
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        return $dir;
    }

    /**
     * Obtener ruta completa del directorio de backups
     */
    protected function getBackupDir(): string
    {
        $dir = storage_path('app' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $this->backupDir));
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        return $dir;
    }

    /**
     * Obtener información del espacio en disco
     */
    public function getDiskSpaceInfo(): array
    {
        try {
            $backupDir = $this->getBackupDir();

            // Obtener espacio disponible en la partición
            $diskFree = disk_free_space($backupDir);
            $diskTotal = disk_total_space($backupDir);
            $diskUsed = $diskTotal - $diskFree;

            // Calcular tamaño total de backups actuales
            $backupSize = $this->calculateDirSize($backupDir);

            return [
                'success' => true,
                'disk_free' => $diskFree,
                'disk_free_formatted' => $this->formatBytes($diskFree),
                'disk_total' => $diskTotal,
                'disk_total_formatted' => $this->formatBytes($diskTotal),
                'disk_used' => $diskUsed,
                'disk_used_formatted' => $this->formatBytes($diskUsed),
                'disk_used_percent' => round(($diskUsed / $diskTotal) * 100, 2),
                'backups_size' => $backupSize,
                'backups_size_formatted' => $this->formatBytes($backupSize),
                'available_for_backups' => $diskFree - (100 * 1024 * 1024), // Reservar 100MB
                'available_for_backups_formatted' => $this->formatBytes(max(0, $diskFree - (100 * 1024 * 1024)))
            ];
        } catch (Exception $e) {
            Log::error('Error obteniendo espacio en disco: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al obtener información del disco'
            ];
        }
    }

    /**
     * Procesar un chunk de archivo
     */
    public function processChunk($file, string $uploadId, int $chunkIndex, int $totalChunks, string $originalName): array
    {
        try {
            // Validar espacio disponible
            $diskInfo = $this->getDiskSpaceInfo();
            if ($diskInfo['available_for_backups'] < $file->getSize()) {
                throw new Exception('Espacio insuficiente en disco para este chunk');
            }

            $chunksTempDir = $this->getChunksTempDir();
            $uploadDir = $chunksTempDir . DIRECTORY_SEPARATOR . $uploadId;

            // Crear directorio específico para este upload
            if (!is_dir($uploadDir)) {
                @mkdir($uploadDir, 0755, true);
            }

            // Guardar el chunk
            $chunkName = "chunk_{$chunkIndex}";
            $chunkPath = $uploadDir . DIRECTORY_SEPARATOR . $chunkName;

            // Guardar archivo chunk
            $file->move($uploadDir, $chunkName);

            Log::info("Chunk procesado: $uploadId - Chunk $chunkIndex/$totalChunks");

            return [
                'success' => true,
                'upload_id' => $uploadId,
                'chunk_index' => $chunkIndex,
                'total_chunks' => $totalChunks,
                'received' => $chunkIndex + 1,
                'progress_percent' => round((($chunkIndex + 1) / $totalChunks) * 100, 2)
            ];
        } catch (Exception $e) {
            Log::error("Error procesando chunk: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Finalizar la subida y ensamblar chunks
     */
    public function finishUpload(string $uploadId, string $originalName): array
    {
        try {
            $chunksTempDir = $this->getChunksTempDir();
            $uploadDir = $chunksTempDir . DIRECTORY_SEPARATOR . $uploadId;

            if (!is_dir($uploadDir)) {
                throw new Exception("Directorio de upload no encontrado: $uploadDir");
            }

            // Obtener lista de chunks
            $files = scandir($uploadDir);
            $chunks = [];

            foreach ($files as $file) {
                if ($file !== '.' && $file !== '..' && preg_match('/^chunk_(\d+)$/', $file, $matches)) {
                    $chunks[$matches[1]] = $uploadDir . DIRECTORY_SEPARATOR . $file;
                }
            }

            if (empty($chunks)) {
                throw new Exception("No se encontraron chunks para ensamblar");
            }

            // Ordenar chunks por índice
            ksort($chunks);

            // Ensamblar archivo final
            $backupDir = $this->getBackupDir();
            $finalPath = $backupDir . DIRECTORY_SEPARATOR . $originalName;

            // Crear archivo final escribiendo chunks en orden
            $finalFile = fopen($finalPath, 'wb');
            if (!$finalFile) {
                throw new Exception("No se pudo crear archivo final: $finalPath");
            }

            $totalSize = 0;
            foreach ($chunks as $chunkPath) {
                $chunkContent = file_get_contents($chunkPath);
                if ($chunkContent === false) {
                    fclose($finalFile);
                    throw new Exception("Error leyendo chunk: $chunkPath");
                }

                $written = fwrite($finalFile, $chunkContent);
                if ($written === false) {
                    fclose($finalFile);
                    throw new Exception("Error escribiendo en archivo final");
                }

                $totalSize += $written;
                unlink($chunkPath); // Eliminar chunk después de escribir
            }

            fclose($finalFile);

            // Verificar que el archivo se creó correctamente
            if (!file_exists($finalPath)) {
                throw new Exception("El archivo final no se creó correctamente");
            }

            $fileSize = filesize($finalPath);
            Log::info("Upload finalizado: $uploadId -> $originalName (Tamaño: " . $this->formatBytes($fileSize) . ")");

            // Limpiar directorio temporal
            @rmdir($uploadDir);

            return [
                'success' => true,
                'backup_name' => $originalName,
                'file_size' => $fileSize,
                'file_size_formatted' => $this->formatBytes($fileSize),
                'upload_id' => $uploadId
            ];
        } catch (Exception $e) {
            Log::error("Error finalizando upload: " . $e->getMessage());
            // Limpiar en caso de error
            $this->cleanupUpload($uploadId);
            throw $e;
        }
    }

    /**
     * Obtener estado de un upload en progreso
     */
    public function getUploadStatus(string $uploadId): array
    {
        try {
            $chunksTempDir = $this->getChunksTempDir();
            $uploadDir = $chunksTempDir . DIRECTORY_SEPARATOR . $uploadId;

            if (!is_dir($uploadDir)) {
                return [
                    'success' => false,
                    'message' => 'Upload no encontrado'
                ];
            }

            // Contar chunks
            $files = scandir($uploadDir);
            $chunks = [];

            foreach ($files as $file) {
                if ($file !== '.' && $file !== '..' && preg_match('/^chunk_(\d+)$/', $file, $matches)) {
                    $chunks[$matches[1]] = true;
                }
            }

            if (empty($chunks)) {
                return [
                    'success' => false,
                    'message' => 'No hay chunks en este upload'
                ];
            }

            $totalChunks = max(array_keys($chunks)) + 1;
            $receivedChunks = count($chunks);

            return [
                'success' => true,
                'upload_id' => $uploadId,
                'received_chunks' => $receivedChunks,
                'total_chunks' => $totalChunks,
                'progress_percent' => round(($receivedChunks / $totalChunks) * 100, 2)
            ];
        } catch (Exception $e) {
            Log::error("Error obteniendo estado de upload: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al obtener estado'
            ];
        }
    }

    /**
     * Limpiar upload incompleto
     */
    public function cleanupUpload(string $uploadId): bool
    {
        try {
            $chunksTempDir = $this->getChunksTempDir();
            $uploadDir = $chunksTempDir . DIRECTORY_SEPARATOR . $uploadId;

            if (is_dir($uploadDir)) {
                $files = scandir($uploadDir);
                foreach ($files as $file) {
                    if ($file !== '.' && $file !== '..') {
                        @unlink($uploadDir . DIRECTORY_SEPARATOR . $file);
                    }
                }
                @rmdir($uploadDir);
                Log::info("Upload limpiado: $uploadId");
                return true;
            }

            return false;
        } catch (Exception $e) {
            Log::error("Error limpiando upload: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Calcular tamaño total de una carpeta
     */
    protected function calculateDirSize(string $path): int
    {
        $size = 0;

        try {
            if (!is_dir($path)) {
                return 0;
            }

            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($path, \RecursiveDirectoryIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::SELF_FIRST
            );

            foreach ($files as $file) {
                if ($file->isFile()) {
                    $size += $file->getSize();
                }
            }
        } catch (Exception $e) {
            Log::warning("Error calculando tamaño de $path: " . $e->getMessage());
        }

        return $size;
    }

    /**
     * Formatear bytes a string legible
     */
    protected function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
