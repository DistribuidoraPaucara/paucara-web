<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use ZipArchive;
use Exception;
use DateTime;

class ImageBackupService
{
    protected $backupDisk = 'local';
    protected $publicDisk = 'public';
    protected $publicPath = 'storage/app/public';

    /**
     * Obtener ruta del directorio de backups
     */
    protected function getBackupDir(): string
    {
        $dir = storage_path('app' . DIRECTORY_SEPARATOR . 'backups' . DIRECTORY_SEPARATOR . 'images');
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        return $dir;
    }

    /**
     * Crear un backup completo de todas las imágenes
     */
    public function createFullBackup(): array
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $backupName = "backup_completo_{$timestamp}.zip";
        $backupDir = $this->getBackupDir();
        $zipPath = $backupDir . DIRECTORY_SEPARATOR . $backupName;

        Log::info("Iniciando backup completo: $backupName");

        try {
            // Asegurarse de que el directorio existe
            if (!is_dir($backupDir)) {
                @mkdir($backupDir, 0755, true);
            }

            $zip = new ZipArchive();
            $zipResult = $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

            if ($zipResult !== true) {
                $errors = [
                    ZipArchive::ER_EXISTS => 'El archivo ya existe',
                    ZipArchive::ER_INVAL => 'Argumento inválido',
                    ZipArchive::ER_MEMORY => 'Falta de memoria',
                    ZipArchive::ER_NOENT => 'No se encontró el archivo',
                    ZipArchive::ER_NOZIP => 'No es un archivo ZIP válido',
                    ZipArchive::ER_OPEN => 'No se puede abrir el archivo',
                    ZipArchive::ER_READ => 'Error de lectura',
                    ZipArchive::ER_SEEK => 'Error de búsqueda',
                ];
                $errorMsg = $errors[$zipResult] ?? "Error desconocido ($zipResult)";
                Log::error("Error creando ZIP: $errorMsg (Código: $zipResult) - Ruta: $zipPath");
                throw new Exception("No se pudo crear archivo ZIP: $errorMsg");
            }

            $stats = [
                'clientes_fotos' => 0,
                'proveedores_fotos' => 0,
                'productos_imagenes' => 0,
                'empresas_datos' => 0,
                'entregas_fotos' => 0,
                'visitas_fotos' => 0,
                'fotos_lugar_cliente' => 0,
                'otros_archivos' => 0,
                'errores' => []
            ];

            // Backup de todas las carpetas en storage/app/public
            $publicStoragePath = storage_path('app/public');

            if (is_dir($publicStoragePath)) {
                // Hacer backup de carpetas conocidas
                $stats['clientes_fotos'] = $this->backupFolder($zip, $publicStoragePath, 'clientes');
                $stats['proveedores_fotos'] = $this->backupFolder($zip, $publicStoragePath, 'proveedores');
                $stats['productos_imagenes'] = $this->backupFolder($zip, $publicStoragePath, 'productos');
                $stats['empresas_datos'] = $this->backupFolder($zip, $publicStoragePath, 'empresas');
                $stats['entregas_fotos'] = $this->backupFolder($zip, $publicStoragePath, 'entregas');
                $stats['visitas_fotos'] = $this->backupFolder($zip, $publicStoragePath, 'visitas');
                $stats['banners_publicitarios'] = $this->backupFolder($zip, $publicStoragePath, 'banners-publicitarios');
                $stats['fotos_lugar_cliente'] = $this->backupFolder($zip, $publicStoragePath, 'clientes/*/fotos_lugar');

                // Hacer backup de TODAS las demás carpetas (completamente exhaustivo)
                $stats['otros_archivos'] = $this->backupAllRemainingFolders($zip, $publicStoragePath);
            }

            // Agregar metadatos
            $metadata = "Backup created: " . now()->format('Y-m-d H:i:s') . "\n";
            $metadata .= "Total files: " . array_sum($stats) . "\n";
            $zip->addFromString('BACKUP_INFO.txt', $metadata);

            $closeResult = $zip->close();
            Log::info("ZIP close() result: " . ($closeResult ? 'true' : 'false'));

            // Verificar que el archivo se creó
            for ($i = 0; $i < 5; $i++) {
                if (file_exists($zipPath)) {
                    break;
                }
                sleep(1);
                Log::warning("Esperando archivo ZIP... intento $i");
            }

            if (!file_exists($zipPath)) {
                throw new Exception("El archivo ZIP no se pudo crear después de esperar: $zipPath");
            }

            $fileSize = @filesize($zipPath);
            if ($fileSize === false) {
                throw new Exception("No se puede obtener el tamaño del archivo ZIP: $zipPath");
            }
            Log::info("Backup completado: $backupName - Tamaño: " . $this->formatBytes($fileSize));

            return [
                'success' => true,
                'backup_name' => $backupName,
                'backup_path' => 'backups/images/' . $backupName,
                'file_size' => $fileSize,
                'file_size_formatted' => $this->formatBytes($fileSize),
                'created_at' => $timestamp,
                'stats' => $stats
            ];
        } catch (Exception $e) {
            Log::error("Error en backup: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Crear backup selectivo por carpeta
     */
    public function createSelectiveBackup(array $tables = []): array
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $backupName = "backup_" . implode('_', $tables) . "_{$timestamp}.zip";
        $backupDir = $this->getBackupDir();
        $zipPath = $backupDir . DIRECTORY_SEPARATOR . $backupName;

        Log::info("Iniciando backup selectivo: $backupName");

        try {
            if (!is_dir($backupDir)) {
                @mkdir($backupDir, 0755, true);
            }

            $zip = new ZipArchive();
            $zipResult = $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

            if ($zipResult !== true) {
                $errors = [
                    ZipArchive::ER_EXISTS => 'El archivo ya existe',
                    ZipArchive::ER_INVAL => 'Argumento inválido',
                    ZipArchive::ER_MEMORY => 'Falta de memoria',
                    ZipArchive::ER_NOENT => 'No se encontró el archivo',
                    ZipArchive::ER_NOZIP => 'No es un archivo ZIP válido',
                    ZipArchive::ER_OPEN => 'No se puede abrir el archivo',
                    ZipArchive::ER_READ => 'Error de lectura',
                    ZipArchive::ER_SEEK => 'Error de búsqueda',
                ];
                $errorMsg = $errors[$zipResult] ?? "Error desconocido ($zipResult)";
                Log::error("Error creando ZIP selectivo: $errorMsg (Código: $zipResult) - Ruta: $zipPath");
                throw new Exception("No se pudo crear archivo ZIP: $errorMsg");
            }

            $stats = [
                'clientes' => 0,
                'proveedores' => 0,
                'productos' => 0,
                'empresas' => 0,
                'entregas' => 0,
                'visitas' => 0,
                'fotos_lugar' => 0,
                'otros' => 0,
                'errores' => []
            ];

            $publicStoragePath = storage_path('app/public');

            if (is_dir($publicStoragePath)) {
                if (in_array('clientes', $tables)) {
                    $stats['clientes'] = $this->backupFolder($zip, $publicStoragePath, 'clientes');
                }
                if (in_array('proveedores', $tables)) {
                    $stats['proveedores'] = $this->backupFolder($zip, $publicStoragePath, 'proveedores');
                }
                if (in_array('productos', $tables)) {
                    $stats['productos'] = $this->backupFolder($zip, $publicStoragePath, 'productos');
                }
                if (in_array('empresas', $tables)) {
                    $stats['empresas'] = $this->backupFolder($zip, $publicStoragePath, 'empresas');
                }
                if (in_array('entregas', $tables)) {
                    $stats['entregas'] = $this->backupFolder($zip, $publicStoragePath, 'entregas');
                }
                if (in_array('visitas', $tables)) {
                    $stats['visitas'] = $this->backupFolder($zip, $publicStoragePath, 'visitas');
                }
                if (in_array('fotos_lugar', $tables)) {
                    $stats['fotos_lugar'] = $this->backupFolder($zip, $publicStoragePath, 'clientes/*/fotos_lugar');
                }
            }

            // Agregar metadatos
            $metadata = "Backup created: " . now()->format('Y-m-d H:i:s') . "\n";
            $metadata .= "Total files: " . array_sum($stats) . "\n";
            $zip->addFromString('BACKUP_INFO.txt', $metadata);

            $closeResult = $zip->close();
            Log::info("ZIP close() result (selectivo): " . ($closeResult ? 'true' : 'false'));

            // Verificar que el archivo se creó
            for ($i = 0; $i < 5; $i++) {
                if (file_exists($zipPath)) {
                    break;
                }
                sleep(1);
                Log::warning("Esperando archivo ZIP selectivo... intento $i");
            }

            if (!file_exists($zipPath)) {
                throw new Exception("El archivo ZIP selectivo no se pudo crear después de esperar: $zipPath");
            }

            $fileSize = @filesize($zipPath);
            if ($fileSize === false) {
                throw new Exception("No se puede obtener el tamaño del archivo ZIP selectivo: $zipPath");
            }
            Log::info("Backup selectivo completado: $backupName");

            return [
                'success' => true,
                'backup_name' => $backupName,
                'backup_path' => 'backups/images/' . $backupName,
                'file_size' => $fileSize,
                'file_size_formatted' => $this->formatBytes($fileSize),
                'created_at' => $timestamp,
                'stats' => $stats
            ];
        } catch (Exception $e) {
            Log::error("Error en backup selectivo: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Hacer backup de una carpeta completa recursivamente
     */
    protected function backupFolder(ZipArchive $zip, string $basePath, string $folderPattern): int
    {
        $count = 0;

        // Manejar patrones con wildcard (ej: clientes/*/fotos_lugar)
        if (strpos($folderPattern, '*') !== false) {
            $count = $this->backupWildcardFolder($zip, $basePath, $folderPattern);
        } else {
            $folderPath = $basePath . DIRECTORY_SEPARATOR . $folderPattern;
            $count = $this->backupFolderRecursive($zip, $folderPath, $folderPattern);
        }

        Log::info("Backup de $folderPattern: $count archivos");
        return $count;
    }

    /**
     * Backup recursivo de archivos en una carpeta
     */
    protected function backupFolderRecursive(ZipArchive $zip, string $folderPath, string $zipPrefix): int
    {
        $count = 0;

        if (!is_dir($folderPath)) {
            return 0;
        }

        try {
            // Normalizar la ruta base para comparación
            $basePath = str_replace(DIRECTORY_SEPARATOR, '/', $folderPath);

            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($folderPath, \RecursiveDirectoryIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::SELF_FIRST
            );

            foreach ($files as $file) {
                if ($file->isFile()) {
                    $filePath = $file->getRealPath();
                    // Normalizar para comparación
                    $filePath = str_replace(DIRECTORY_SEPARATOR, '/', $filePath);

                    // Obtener la ruta relativa desde la carpeta
                    if (strpos($filePath, $basePath) === 0) {
                        $relativePath = substr($filePath, strlen($basePath) + 1);
                    } else {
                        $relativePath = str_replace($folderPath . DIRECTORY_SEPARATOR, '', $filePath);
                    }

                    $zipEntryPath = $zipPrefix . '/' . $relativePath;
                    // Limpiar slashes dobles
                    $zipEntryPath = str_replace('//', '/', $zipEntryPath);

                    $zip->addFile($filePath, $zipEntryPath);
                    $count++;
                }
            }
        } catch (Exception $e) {
            Log::warning("Error al hacer backup de $folderPath: " . $e->getMessage());
        }

        return $count;
    }

    /**
     * Backup de carpetas con patrón wildcard
     */
    protected function backupWildcardFolder(ZipArchive $zip, string $basePath, string $pattern): int
    {
        $count = 0;
        $parts = explode('/', $pattern);

        // Buscar directorio con wildcard
        $currentPath = $basePath;
        $zipPrefix = '';

        foreach ($parts as $part) {
            if ($part === '*') {
                // Buscar todas las carpetas en currentPath
                if (is_dir($currentPath)) {
                    $dirs = array_filter(scandir($currentPath), function ($item) use ($currentPath) {
                        return is_dir($currentPath . DIRECTORY_SEPARATOR . $item) && $item !== '.' && $item !== '..';
                    });

                    // Para cada carpeta encontrada
                    foreach ($dirs as $dir) {
                        $newPath = $currentPath . DIRECTORY_SEPARATOR . $dir;
                        $newPrefix = $zipPrefix ? $zipPrefix . '/' . $dir : $dir;

                        // Buscar el resto del patrón en esta carpeta
                        $remaining = implode('/', array_slice($parts, array_search('*', $parts) + 1));
                        if ($remaining) {
                            $count += $this->backupWildcardFolder($zip, $newPath, $remaining);
                        } else {
                            $count += $this->backupFolderRecursive($zip, $newPath, $newPrefix);
                        }
                    }
                }
                return $count;
            } else {
                $currentPath = $currentPath . DIRECTORY_SEPARATOR . $part;
                $zipPrefix = $zipPrefix ? $zipPrefix . '/' . $part : $part;
            }
        }

        return $count;
    }

    /**
     * Hacer backup de otras carpetas no categorizadas
     */
    /**
     * Hacer backup de TODAS las carpetas restantes (completamente exhaustivo)
     * Incluye cualquier carpeta nueva o desconocida que no haya sido respaldada explícitamente
     */
    protected function backupAllRemainingFolders(ZipArchive $zip, string $publicPath): int
    {
        $count = 0;
        // Carpetas que ya fueron respaldadas explícitamente
        $backedUpFolders = [
            'clientes',
            'proveedores',
            'productos',
            'empresas',
            'entregas',
            'visitas',
            'banners-publicitarios',
        ];

        if (is_dir($publicPath)) {
            $items = @scandir($publicPath);
            if ($items !== false) {
                foreach ($items as $item) {
                    // Ignorar . y ..
                    if ($item === '.' || $item === '..') {
                        continue;
                    }

                    $itemPath = $publicPath . DIRECTORY_SEPARATOR . $item;

                    // Si es directorio y NO está en la lista de respaldados explícitamente
                    if (is_dir($itemPath) && !in_array($item, $backedUpFolders)) {
                        Log::info("Respaldando carpeta adicional (exhaustivo): $item");
                        $count += $this->backupFolderRecursive($zip, $itemPath, $item);
                    }
                    // Si es archivo en la raíz, también incluirlo
                    elseif (is_file($itemPath)) {
                        Log::info("Respaldando archivo en raíz: $item");
                        $zip->addFile($itemPath, $item);
                        $count++;
                    }
                }
            }
        }

        Log::info("Total de archivos/carpetas adicionales respaldados (exhaustivo): $count");
        return $count;
    }

    /**
     * Restaurar un backup completo
     */
    public function restoreBackup(string $backupName, bool $skipExisting = true): array
    {
        $backupDir = $this->getBackupDir();
        $zipPath = $backupDir . DIRECTORY_SEPARATOR . $backupName;

        if (!file_exists($zipPath)) {
            throw new Exception("Archivo de backup no encontrado: $backupName");
        }

        Log::info("Iniciando restauración: $backupName");

        try {
            $zip = new ZipArchive();
            if ($zip->open($zipPath) !== true) {
                throw new Exception("No se pudo abrir archivo ZIP: $zipPath");
            }

            $stats = [
                'archivos_restaurados' => 0,
                'archivos_saltados' => 0,
                'errores' => []
            ];

            // Restaurar cada archivo
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $filename = $zip->getNameIndex($i);

                // Saltar directorios y archivos de metadatos
                if (substr($filename, -1) === '/' || $filename === 'BACKUP_INFO.txt') {
                    continue;
                }

                try {
                    $fileContents = $zip->getFromIndex($i);
                    $targetPath = $filename;

                    // ✅ SEGURIDAD: Validar path traversal
                    if (str_contains($targetPath, '..') || str_starts_with($targetPath, '/')) {
                        $error = "Path inválido detectado en backup: $filename";
                        Log::warning($error);
                        $stats['errores'][] = $error;
                        continue;
                    }

                    // Verificar si el archivo ya existe
                    if ($skipExisting && Storage::disk($this->publicDisk)->exists($targetPath)) {
                        Log::info("Archivo saltado (ya existe): $targetPath");
                        $stats['archivos_saltados']++;
                        continue;
                    }

                    // Crear directorio si no existe
                    $dir = dirname($targetPath);
                    if ($dir && $dir !== '.') {
                        Storage::disk($this->publicDisk)->makeDirectory($dir);
                    }

                    // Guardar archivo
                    Storage::disk($this->publicDisk)->put($targetPath, $fileContents);
                    Log::info("Archivo restaurado: $targetPath");
                    $stats['archivos_restaurados']++;

                } catch (Exception $e) {
                    $error = "Error restaurando $filename: " . $e->getMessage();
                    Log::error($error);
                    $stats['errores'][] = $error;
                }
            }

            $zip->close();
            Log::info("Restauración completada: $backupName");

            return [
                'success' => true,
                'backup_name' => $backupName,
                'stats' => $stats
            ];
        } catch (Exception $e) {
            Log::error("Error en restauración: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Listar todos los backups disponibles
     */
    public function listBackups(): array
    {
        $backupDir = $this->getBackupDir();
        $files = glob($backupDir . DIRECTORY_SEPARATOR . '*.zip');

        if ($files === false) {
            $files = [];
        }

        $backups = [];
        foreach ($files as $file) {
            if (is_file($file)) {
                $backups[] = [
                    'name' => basename($file),
                    'path' => $file,
                    'size' => filesize($file),
                    'size_formatted' => $this->formatBytes(filesize($file)),
                    'created_at' => filemtime($file),
                    'created_at_formatted' => (new DateTime('@' . filemtime($file)))->format('Y-m-d H:i:s')
                ];
            }
        }

        // Ordenar por fecha (más reciente primero)
        usort($backups, fn($a, $b) => $b['created_at'] <=> $a['created_at']);

        return $backups;
    }

    /**
     * Eliminar un backup
     */
    public function deleteBackup(string $backupName): bool
    {
        $backupDir = $this->getBackupDir();
        $backupPath = $backupDir . DIRECTORY_SEPARATOR . $backupName;

        if (file_exists($backupPath)) {
            return @unlink($backupPath);
        }

        return false;
    }

    /**
     * Obtener tamaños de carpetas en storage/app/public
     */
    public function getFolderSizes(): array
    {
        $publicPath = storage_path('app/public');
        $sizes = [];

        $knownFolders = ['clientes', 'proveedores', 'productos'];

        foreach ($knownFolders as $folder) {
            $folderPath = $publicPath . DIRECTORY_SEPARATOR . $folder;
            if (is_dir($folderPath)) {
                $sizes[$folder] = $this->calculateFolderSize($folderPath);
            }
        }

        // Carpetas personalizadas/otras
        if (is_dir($publicPath)) {
            $items = scandir($publicPath);
            foreach ($items as $item) {
                if ($item !== '.' && $item !== '..' && is_dir($publicPath . DIRECTORY_SEPARATOR . $item)) {
                    if (!in_array($item, $knownFolders)) {
                        $sizes[$item] = $this->calculateFolderSize($publicPath . DIRECTORY_SEPARATOR . $item);
                    }
                }
            }
        }

        return $sizes;
    }

    /**
     * Calcular tamaño total de una carpeta
     */
    protected function calculateFolderSize(string $path): int
    {
        $size = 0;

        try {
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
     * Crear backup de una carpeta específica
     */
    public function createFolderBackup(string $folderName): array
    {
        $publicPath = storage_path('app/public');
        $folderPath = $publicPath . DIRECTORY_SEPARATOR . $folderName;

        if (!is_dir($folderPath)) {
            throw new Exception("Carpeta no encontrada: $folderName");
        }

        $timestamp = now()->format('Y-m-d_H-i-s');
        $backupName = "backup_{$folderName}_{$timestamp}.zip";
        $backupDir = $this->getBackupDir();
        $zipPath = $backupDir . DIRECTORY_SEPARATOR . $backupName;

        Log::info("Iniciando backup de carpeta: $folderName");

        try {
            if (!is_dir($backupDir)) {
                @mkdir($backupDir, 0755, true);
            }

            $zip = new ZipArchive();
            $zipResult = $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

            if ($zipResult !== true) {
                $errors = [
                    ZipArchive::ER_EXISTS => 'El archivo ya existe',
                    ZipArchive::ER_INVAL => 'Argumento inválido',
                    ZipArchive::ER_MEMORY => 'Falta de memoria',
                    ZipArchive::ER_NOENT => 'No se encontró el archivo',
                    ZipArchive::ER_NOZIP => 'No es un archivo ZIP válido',
                    ZipArchive::ER_OPEN => 'No se puede abrir el archivo',
                    ZipArchive::ER_READ => 'Error de lectura',
                    ZipArchive::ER_SEEK => 'Error de búsqueda',
                ];
                $errorMsg = $errors[$zipResult] ?? "Error desconocido ($zipResult)";
                throw new Exception("No se pudo crear archivo ZIP: $errorMsg");
            }

            $count = $this->backupFolderRecursive($zip, $folderPath, $folderName);

            // Agregar metadatos
            $metadata = "Backup created: " . now()->format('Y-m-d H:i:s') . "\n";
            $metadata .= "Folder: $folderName\n";
            $metadata .= "Total files: $count\n";
            $zip->addFromString('BACKUP_INFO.txt', $metadata);

            $closeResult = $zip->close();
            Log::info("ZIP close() result: " . ($closeResult ? 'true' : 'false'));

            // Verificar que el archivo se creó
            for ($i = 0; $i < 5; $i++) {
                if (file_exists($zipPath)) {
                    break;
                }
                sleep(1);
                Log::warning("Esperando archivo ZIP... intento $i");
            }

            if (!file_exists($zipPath)) {
                throw new Exception("El archivo ZIP no se pudo crear después de esperar: $zipPath");
            }

            $fileSize = @filesize($zipPath);
            if ($fileSize === false) {
                throw new Exception("No se puede obtener el tamaño del archivo ZIP: $zipPath");
            }

            Log::info("Backup de carpeta completado: $backupName - Tamaño: " . $this->formatBytes($fileSize));

            return [
                'success' => true,
                'folder_name' => $folderName,
                'backup_name' => $backupName,
                'backup_path' => 'backups/images/' . $backupName,
                'file_size' => $fileSize,
                'file_size_formatted' => $this->formatBytes($fileSize),
                'created_at' => $timestamp,
                'file_count' => $count
            ];
        } catch (Exception $e) {
            Log::error("Error en backup de carpeta: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Restaurar backup de una carpeta específica
     */
    public function restoreFolderBackup(string $backupName, string $folderName, bool $skipExisting = true): array
    {
        $backupDir = $this->getBackupDir();
        $zipPath = $backupDir . DIRECTORY_SEPARATOR . $backupName;

        if (!file_exists($zipPath)) {
            throw new Exception("Archivo de backup no encontrado: $backupName");
        }

        Log::info("Iniciando restauración de carpeta $folderName desde: $backupName");

        try {
            $zip = new ZipArchive();
            if ($zip->open($zipPath) !== true) {
                throw new Exception("No se pudo abrir archivo ZIP: $zipPath");
            }

            $stats = [
                'archivos_restaurados' => 0,
                'archivos_saltados' => 0,
                'errores' => []
            ];

            // Restaurar cada archivo
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $filename = $zip->getNameIndex($i);

                // Saltar directorios y archivos de metadatos
                if (substr($filename, -1) === '/' || $filename === 'BACKUP_INFO.txt') {
                    continue;
                }

                // Solo restaurar archivos de la carpeta solicitada
                if (!str_starts_with($filename, $folderName . '/')) {
                    continue;
                }

                try {
                    $fileContents = $zip->getFromIndex($i);
                    $targetPath = $filename;

                    // ✅ SEGURIDAD: Validar path traversal
                    if (str_contains($targetPath, '..') || str_starts_with($targetPath, '/')) {
                        $error = "Path inválido detectado en backup: $filename";
                        Log::warning($error);
                        $stats['errores'][] = $error;
                        continue;
                    }

                    // Verificar si el archivo ya existe
                    if ($skipExisting && Storage::disk($this->publicDisk)->exists($targetPath)) {
                        Log::info("Archivo saltado (ya existe): $targetPath");
                        $stats['archivos_saltados']++;
                        continue;
                    }

                    // Crear directorio si no existe
                    $dir = dirname($targetPath);
                    if ($dir && $dir !== '.') {
                        Storage::disk($this->publicDisk)->makeDirectory($dir);
                    }

                    // Guardar archivo
                    Storage::disk($this->publicDisk)->put($targetPath, $fileContents);
                    Log::info("Archivo restaurado: $targetPath");
                    $stats['archivos_restaurados']++;

                } catch (Exception $e) {
                    $error = "Error restaurando $filename: " . $e->getMessage();
                    Log::error($error);
                    $stats['errores'][] = $error;
                }
            }

            $zip->close();
            Log::info("Restauración de carpeta completada: $backupName -> $folderName");

            return [
                'success' => true,
                'backup_name' => $backupName,
                'folder_name' => $folderName,
                'stats' => $stats
            ];
        } catch (Exception $e) {
            Log::error("Error en restauración de carpeta: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Formatear bytes a formato legible
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
