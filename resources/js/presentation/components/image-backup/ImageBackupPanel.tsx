import React, { useState, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { AlertCircle, Download, Trash2, RefreshCw, CheckCircle, Upload, Folder } from 'lucide-react';
import { toast } from 'react-toastify';

interface Backup {
    name: string;
    size_formatted: string;
    created_at_formatted: string;
}

interface BackupStats {
    clientes_fotos: number;
    proveedores_fotos: number;
    productos_imagenes: number;
    fotos_lugar_cliente: number;
    archivos_copiados?: number;
    errores: string[];
}

interface FolderSize {
    bytes: number;
    formatted: string;
}

interface DiskSpaceInfo {
    disk_free: number;
    disk_free_formatted: string;
    disk_total: number;
    disk_total_formatted: string;
    disk_used_percent: number;
    available_for_backups: number;
    available_for_backups_formatted: string;
}

interface UploadProgress {
    uploadId: string;
    fileName: string;
    progress: number;
    uploadedChunks: number;
    totalChunks: number;
    speed: number;
}

export function ImageBackupPanel() {
    const [backups, setBackups] = useState<Backup[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateOptions, setShowCreateOptions] = useState(false);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);
    const [folderSizes, setFolderSizes] = useState<Record<string, FolderSize>>({});
    const [showFolderBackup, setShowFolderBackup] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [diskSpace, setDiskSpace] = useState<DiskSpaceInfo | null>(null);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
    const [useChunkedUpload, setUseChunkedUpload] = useState(true);

    const tables = [
        { id: 'clientes', label: 'Clientes (fotos de perfil, CI)' },
        { id: 'proveedores', label: 'Proveedores (fotos de perfil, CI)' },
        { id: 'productos', label: 'Productos (imágenes)' },
        { id: 'fotos_lugar', label: 'Fotos de lugar del cliente' },
    ];

    // Cargar lista de backups, tamaños de carpetas y espacio en disco
    useEffect(() => {
        loadBackups();
        loadFolderSizes();
        loadDiskSpace();

        // Recargar espacio en disco cada 30 segundos
        const interval = setInterval(loadDiskSpace, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadBackups = async () => {
        try {
            const response = await fetch('/api/image-backup/list');
            const data = await response.json();

            if (data.success) {
                setBackups(data.data);
            } else {
                toast.error(data.message || 'Error al cargar backups');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor');
        }
    };

    const loadFolderSizes = async () => {
        try {
            const response = await fetch('/api/image-backup/folder/sizes');
            const data = await response.json();

            if (data.success) {
                setFolderSizes(data.data);
            }
        } catch (error) {
            console.error('Error al cargar tamaños de carpetas:', error);
        }
    };

    const loadDiskSpace = async () => {
        try {
            const response = await fetch('/api/image-backup/disk-space');
            const data = await response.json();

            if (data.success) {
                setDiskSpace(data.data);
            }
        } catch (error) {
            console.error('Error al cargar espacio en disco:', error);
        }
    };

    const handleCreateBackup = async (isSelective: boolean) => {
        try {
            setLoading(true);

            const payload: Record<string, any> = {};
            if (isSelective && selectedTables.length > 0) {
                payload.tables = selectedTables;
            }

            const response = await fetch('/api/image-backup/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`Backup "${data.data.backup_name}" creado exitosamente`);
                loadBackups();
                setShowCreateOptions(false);
                setSelectedTables([]);
            } else {
                toast.error(data.message || 'Error al crear backup');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreBackup = async (backupName: string) => {
        if (!confirm('⚠️ ¿Estás seguro de que deseas restaurar este backup? Se sobrescribirán las imágenes existentes.')) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('/api/image-backup/restore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    backup_name: backupName,
                    skip_existing: false,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`${data.data.stats.archivos_restaurados} archivos restaurados`);
                loadBackups();
            } else {
                toast.error(data.message || 'Error al restaurar backup');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadBackup = async (backupName: string) => {
        try {
            const response = await fetch(`/api/image-backup/${backupName}/download`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = backupName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('Backup descargado');
        } catch (error) {
            toast.error('Error al descargar backup');
        }
    };

    const handleDeleteBackup = async (backupName: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este backup?')) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`/api/image-backup/${backupName}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Backup eliminado');
                loadBackups();
            } else {
                toast.error(data.message || 'Error al eliminar backup');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const toggleTable = (tableId: string) => {
        setSelectedTables((prev) =>
            prev.includes(tableId)
                ? prev.filter((t) => t !== tableId)
                : [...prev, tableId]
        );
    };

    const handleCreateFolderBackup = async () => {
        if (!selectedFolder) {
            toast.error('Selecciona una carpeta');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('/api/image-backup/folder/backup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    folder_name: selectedFolder,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`Backup de "${selectedFolder}" creado exitosamente`);
                loadBackups();
                setShowFolderBackup(false);
                setSelectedFolder('');
            } else {
                toast.error(data.message || 'Error al crear backup de carpeta');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadFolderBackup = async () => {
        if (!selectedFolder) {
            toast.error('Selecciona una carpeta');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('/api/image-backup/folder/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    folder_name: selectedFolder,
                }),
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_${selectedFolder}_${new Date().toISOString().split('T')[0]}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success(`Backup de "${selectedFolder}" descargado`);
            setShowFolderBackup(false);
            setSelectedFolder('');
        } catch (error) {
            toast.error('Error al descargar backup de carpeta');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.name.endsWith('.zip')) {
                toast.error('Solo se permite subir archivos ZIP');
                return;
            }
            setUploadedFile(file);
            toast.success(`Archivo "${file.name}" seleccionado`);
        }
    };

    const uploadFileChunked = async (file: File, uploadId: string): Promise<string | null> => {
        const CHUNK_SIZE = 50 * 1024 * 1024; // 50MB per chunk
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let uploadedBackupName = '';

        try {
            // Paso 1: Iniciar upload
            const startResponse = await fetch('/api/image-backup/chunked/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    upload_id: uploadId,
                    file_name: file.name,
                    total_chunks: totalChunks,
                    total_size: file.size
                }),
            });

            const startData = await startResponse.json();
            if (!startData.success) {
                throw new Error(startData.message || 'No se pudo iniciar el upload');
            }

            toast.info(`Subiendo ${totalChunks} partes...`);

            // Paso 2: Subir cada chunk
            for (let i = 0; i < totalChunks; i++) {
                const start = i * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.slice(start, end);

                const formData = new FormData();
                formData.append('chunk', chunk);
                formData.append('upload_id', uploadId);
                formData.append('chunk_index', i.toString());
                formData.append('total_chunks', totalChunks.toString());
                formData.append('file_name', file.name);

                const chunkResponse = await fetch('/api/image-backup/chunked/upload', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: formData,
                });

                const chunkData = await chunkResponse.json();
                if (!chunkData.success) {
                    throw new Error(`Error en chunk ${i + 1}: ${chunkData.message}`);
                }

                setUploadProgress({
                    uploadId,
                    fileName: file.name,
                    progress: chunkData.data.progress_percent,
                    uploadedChunks: chunkData.data.received,
                    totalChunks,
                    speed: 0
                });

                toast.info(`Subiendo: ${chunkData.data.progress_percent}% (${chunkData.data.received}/${totalChunks})`);
            }

            // Paso 3: Finalizar upload
            const finishResponse = await fetch('/api/image-backup/chunked/finish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    upload_id: uploadId,
                    file_name: file.name
                }),
            });

            const finishData = await finishResponse.json();
            if (!finishData.success) {
                throw new Error(finishData.message || 'Error al finalizar upload');
            }

            uploadedBackupName = finishData.data.backup_name;
            toast.success(`✓ Archivo ensamblado: ${uploadedBackupName}`);

            return uploadedBackupName;
        } catch (error) {
            toast.error(`Error en subida: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            // Limpiar upload en caso de error
            try {
                await fetch('/api/image-backup/chunked/cancel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ upload_id: uploadId }),
                });
            } catch (e) {
                console.error('Error limpiando upload:', e);
            }
            return null;
        }
    };

    const handleRestoreFolderBackup = async () => {
        if (!uploadedFile) {
            toast.error('Selecciona un archivo ZIP');
            return;
        }

        if (!selectedFolder) {
            toast.error('Selecciona una carpeta para restaurar');
            return;
        }

        if (!diskSpace || diskSpace.available_for_backups < uploadedFile.size) {
            toast.error(`Espacio insuficiente. Se requieren ${(uploadedFile.size / 1024 / 1024).toFixed(2)}MB`);
            return;
        }

        if (!confirm(`⚠️ ¿Deseas restaurar "${uploadedFile.name}" en la carpeta "${selectedFolder}"? Se sobrescribirán las imágenes existentes.`)) {
            return;
        }

        try {
            setLoading(true);
            const uploadId = `upload_${Date.now()}`;
            let backupName = '';

            if (useChunkedUpload && uploadedFile.size > 50 * 1024 * 1024) {
                // Usar subida por partes para archivos mayores a 50MB
                backupName = await uploadFileChunked(uploadedFile, uploadId);
            } else {
                // Usar subida directa para archivos pequeños
                const formData = new FormData();
                formData.append('file', uploadedFile);

                toast.info('Subiendo archivo...');

                const uploadResponse = await fetch('/api/image-backup/upload', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: formData,
                });

                const uploadData = await uploadResponse.json();
                if (!uploadData.success) {
                    toast.error(uploadData.message || 'Error al subir archivo');
                    return;
                }

                backupName = uploadData.data.backup_name;
                toast.success(`✓ Archivo subido: ${backupName}`);
            }

            if (!backupName) {
                return;
            }

            // Paso final: Restaurar el archivo en la carpeta
            const restoreResponse = await fetch('/api/image-backup/folder/restore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    backup_name: backupName,
                    folder_name: selectedFolder,
                    skip_existing: false,
                }),
            });

            const restoreData = await restoreResponse.json();

            if (restoreData.success) {
                toast.success(`✅ ${restoreData.data.stats.archivos_restaurados} archivos restaurados en "${selectedFolder}"`);
                loadBackups();
                loadDiskSpace();
                setUploadedFile(null);
                setSelectedFolder('');
                setUploadProgress(null);
            } else {
                toast.error(restoreData.message || 'Error al restaurar carpeta');
            }
        } catch (error) {
            toast.error('Error al procesar el backup. Intenta nuevamente.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Sección de Estado del Disco */}
            {diskSpace && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-red-900 dark:text-red-100">💾 Estado del Espacio en Disco</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300">Espacio disponible para backups:</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{diskSpace.available_for_backups_formatted}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300">Uso del disco:</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{diskSpace.disk_used_percent.toFixed(1)}%</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300">Espacio total:</p>
                            <p className="text-lg text-gray-900 dark:text-gray-100">{diskSpace.disk_total_formatted}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300">Tamaño de backups:</p>
                            <p className="text-lg text-gray-900 dark:text-gray-100">{diskSpace.backups_size_formatted}</p>
                        </div>
                    </div>
                    {diskSpace.disk_used_percent > 90 && (
                        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
                            <p className="text-sm text-red-900 dark:text-red-100">⚠️ Espacio en disco crítico. Considera eliminar backups antiguos.</p>
                        </div>
                    )}
                    {diskSpace.available_for_backups < 100 * 1024 * 1024 && (
                        <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900 border border-orange-300 dark:border-orange-700 rounded-lg">
                            <p className="text-sm text-orange-900 dark:text-orange-100">⚠️ Menos de 100MB disponibles para nuevos backups.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Sección de Crear Backup */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100">📦 Crear Backup</h3>

                {!showCreateOptions ? (
                    <div className="flex gap-3">
                        <Button
                            onClick={() => {
                                handleCreateBackup(false);
                            }}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                            Backup Completo
                        </Button>
                        <Button
                            onClick={() => setShowCreateOptions(true)}
                            disabled={loading}
                            variant="outline"
                        >
                            Backup Selectivo
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {tables.map((table) => (
                                <label
                                    key={table.id}
                                    className="flex items-center gap-2 cursor-pointer p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded text-gray-900 dark:text-gray-100"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedTables.includes(table.id)}
                                        onChange={() => toggleTable(table.id)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">{table.label}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={() => handleCreateBackup(true)}
                                disabled={loading || selectedTables.length === 0}
                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                Crear Backup Selectivo
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowCreateOptions(false);
                                    setSelectedTables([]);
                                }}
                                variant="outline"
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de Backup por Carpeta */}
            <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100">📁 Backup por Carpeta</h3>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
                    Descarga o restaura backups de carpetas específicas sin problemas de memoria o timeout.
                </p>

                {/* Tamaños de carpetas */}
                {Object.keys(folderSizes).length > 0 && (
                    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-800">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">📊 Tamaño de carpetas actuales:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {Object.entries(folderSizes).map(([folder, size]) => (
                                <div key={folder} className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg border border-purple-100 dark:border-purple-800">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{folder}</p>
                                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{size.formatted}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!showFolderBackup ? (
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setShowFolderBackup(true)}
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                        >
                            <Folder className="w-4 h-4 mr-2" />
                            Descargar/Restaurar por Carpeta
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                Selecciona una carpeta:
                            </label>
                            <select
                                value={selectedFolder}
                                onChange={(e) => setSelectedFolder(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">-- Selecciona una carpeta --</option>
                                <option value="clientes">Clientes</option>
                                <option value="productos">Productos</option>
                                <option value="proveedores">Proveedores</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleCreateFolderBackup}
                                disabled={loading || !selectedFolder}
                                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                            >
                                Crear Backup
                            </Button>
                            <Button
                                onClick={handleDownloadFolderBackup}
                                disabled={loading || !selectedFolder}
                                variant="outline"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Descargar
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowFolderBackup(false);
                                    setSelectedFolder('');
                                }}
                                variant="outline"
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de Subir y Restaurar Backup */}
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100">⬆️ Subir y Restaurar Backup</h3>
                <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                    Sube un archivo ZIP de backup que descargaste anteriormente para restaurar imágenes.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                            1. Selecciona un archivo ZIP:
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept=".zip"
                                onChange={handleFileUpload}
                                disabled={loading}
                                className="block w-full text-sm text-gray-500 dark:text-gray-400
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-green-600 file:text-white
                                    dark:file:bg-green-700
                                    hover:file:bg-green-700 dark:hover:file:bg-green-600
                                    cursor-pointer"
                            />
                            {uploadedFile && (
                                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                    ✓ {uploadedFile.name}
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                            2. Selecciona la carpeta destino:
                        </label>
                        <select
                            value={selectedFolder}
                            onChange={(e) => setSelectedFolder(e.target.value)}
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">-- Selecciona una carpeta --</option>
                            <option value="clientes">Clientes</option>
                            <option value="productos">Productos</option>
                            <option value="proveedores">Proveedores</option>
                        </select>
                    </div>

                    <Button
                        onClick={handleRestoreFolderBackup}
                        disabled={loading || !uploadedFile || !selectedFolder}
                        className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Restaurar Carpeta
                    </Button>

                    {/* Indicador de progreso */}
                    {uploadProgress && (
                        <div className="mt-4 space-y-2 p-4 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-900 dark:text-gray-100 font-medium">{uploadProgress.fileName}</span>
                                <span className="text-green-600 dark:text-green-400 font-medium">{uploadProgress.progress.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress.progress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {uploadProgress.uploadedChunks}/{uploadProgress.totalChunks} partes subidas
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sección de Backups Disponibles */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">📋 Backups Disponibles</h3>
                    <Button
                        onClick={loadBackups}
                        disabled={loading}
                        size="sm"
                        variant="outline"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Actualizar
                    </Button>
                </div>

                {backups.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                        <p>No hay backups disponibles</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {backups.map((backup) => (
                            <div
                                key={backup.name}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-gray-100 break-all">{backup.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {backup.size_formatted} • {backup.created_at_formatted}
                                    </p>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <Button
                                        onClick={() => handleRestoreBackup(backup.name)}
                                        disabled={loading}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                        title="Restaurar este backup"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={() => handleDownloadBackup(backup.name)}
                                        disabled={loading}
                                        size="sm"
                                        variant="outline"
                                        title="Descargar este backup"
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteBackup(backup.name)}
                                        disabled={loading}
                                        size="sm"
                                        variant="destructive"
                                        title="Eliminar este backup"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Información útil */}
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-amber-900 dark:text-amber-100">
                    <strong>💡 Consejo:</strong> Crea un backup antes de hacer cambios importantes en tu servidor.
                    Los backups se almacenan en el servidor y puedes descargarlos para guardar en tu computadora.
                </p>
            </div>
        </div>
    );
}
