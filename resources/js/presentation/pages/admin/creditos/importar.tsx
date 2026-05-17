import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
    Upload,
    AlertCircle,
    CheckCircle,
    AlertTriangle,
    Download,
    XCircle,
    FileText,
} from 'lucide-react';

interface ValidacionResultado {
    total_filas: number;
    validas: any[];
    errores: any[];
    advertencias: any[];
    puede_importar: boolean;
}

interface ImportacionResultado {
    exito: boolean;
    importados: any[];
    rechazados: any[];
    total_importados: number;
    total_rechazados: number;
    mensaje: string;
}

export default function ImportarCreditosPage() {
    const [archivo, setArchivo] = useState<File | null>(null);
    const [validacion, setValidacion] = useState<ValidacionResultado | null>(null);
    const [importacion, setImportacion] = useState<ImportacionResultado | null>(null);
    const [cargandoValidacion, setCargandoValidacion] = useState(false);
    const [cargandoImportacion, setCargandoImportacion] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Créditos', href: '/admin/creditos' },
        { title: 'Importar Históricos', href: '/admin/creditos/importar' },
    ];

    /**
     * Manejar cambio de archivo
     */
    const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setArchivo(file);
            setError(null);
            setValidacion(null);
            setImportacion(null);
        }
    };

    /**
     * Validar archivo CSV
     */
    const validarArchivo = async () => {
        if (!archivo) {
            setError('Por favor selecciona un archivo');
            return;
        }

        setCargandoValidacion(true);
        setError(null);

        const formData = new FormData();
        formData.append('archivo', archivo);

        try {
            console.log('📋 Validando archivo CSV...', archivo.name);

            const response = await fetch('/api/creditos/importar/validar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${(window as any).authToken || ''}`,
                },
                body: formData,
            });

            const result = await response.json();
            console.log('📊 Resultado de validación:', result);

            if (result.success) {
                setValidacion(result.data);
                setImportacion(null);
            } else {
                setError(result.error || 'Error al validar el archivo');
            }
        } catch (err) {
            console.error('❌ Error en validación:', err);
            setError('Error al conectar con el servidor');
        } finally {
            setCargandoValidacion(false);
        }
    };

    /**
     * Importar créditos
     */
    const importarCreditos = async () => {
        if (!archivo) {
            setError('Por favor selecciona un archivo');
            return;
        }

        setCargandoImportacion(true);
        setError(null);

        const formData = new FormData();
        formData.append('archivo', archivo);

        try {
            console.log('📥 Importando créditos...', archivo.name);

            const response = await fetch('/api/creditos/importar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${(window as any).authToken || ''}`,
                },
                body: formData,
            });

            const result = await response.json();
            console.log('✅ Resultado de importación:', result);

            if (result.success) {
                setImportacion(result.data);
                setValidacion(null);
            } else {
                setError(result.error || 'Error al importar créditos');
            }
        } catch (err) {
            console.error('❌ Error en importación:', err);
            setError('Error al conectar con el servidor');
        } finally {
            setCargandoImportacion(false);
        }
    };

    /**
     * Descargar plantilla CSV
     */
    const descargarPlantilla = () => {
        const contenido = `cliente_id,monto,fecha_venta,numero_documento,observaciones
5,1500.00,2025-01-15,FAC-001-2024,Deuda migrada del sistema anterior
8,2300.50,2025-02-10,FAC-002-2024,Cliente con crédito pendiente
12,890.25,2025-01-20,FAC-003-2024,Regularización de deuda`;

        const blob = new Blob([contenido], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantilla_creditos_historicos.csv';
        a.click();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Importar Créditos Históricos" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Importar Créditos Históricos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Carga un archivo CSV con los créditos antiguos de clientes
                    </p>
                </div>

                {/* Error Global */}
                {error && (
                    <div className="flex gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-red-800 dark:text-red-200">Error</h3>
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    </div>
                )}

                {/* Sección Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel de Carga */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                1. Selecciona Archivo CSV
                            </h2>

                            {/* Input de archivo */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="archivo-csv">Archivo CSV</Label>
                                    <div className="mt-2 flex items-center gap-3">
                                        <Input
                                            id="archivo-csv"
                                            type="file"
                                            accept=".csv"
                                            onChange={handleArchivoChange}
                                            disabled={cargandoValidacion || cargandoImportacion}
                                            className="cursor-pointer"
                                        />
                                        {archivo && (
                                            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                                <CheckCircle className="h-4 w-4" />
                                                {archivo.name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        Máximo 5MB. Solo archivos CSV
                                    </p>
                                </div>

                                {/* Botón descargar plantilla */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={descargarPlantilla}
                                    className="w-full gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Descargar Plantilla
                                </Button>
                            </div>
                        </div>

                        {/* Sección Validación */}
                        {!importacion && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    2. Validar Datos
                                </h2>

                                <Button
                                    onClick={validarArchivo}
                                    disabled={!archivo || cargandoValidacion}
                                    className="w-full gap-2"
                                >
                                    {cargandoValidacion ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                            Validando...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-4 w-4" />
                                            Validar Archivo
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Resultados Validación */}
                        {validacion && (
                            <div className="space-y-4">
                                {/* Resumen */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        Resumen de Validación
                                    </h3>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {validacion.total_filas}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Filas</p>
                                        </div>

                                        <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {validacion.validas.length}
                                            </p>
                                            <p className="text-sm text-green-700 dark:text-green-300">Válidas</p>
                                        </div>

                                        <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                                {validacion.errores.length}
                                            </p>
                                            <p className="text-sm text-red-700 dark:text-red-300">Errores</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Filas Válidas */}
                                {validacion.validas.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                                        <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5" />
                                            Filas Válidas ({validacion.validas.length})
                                        </h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                                        <th className="text-left py-2 px-3 font-medium">Fila</th>
                                                        <th className="text-left py-2 px-3 font-medium">Cliente</th>
                                                        <th className="text-left py-2 px-3 font-medium">Monto</th>
                                                        <th className="text-left py-2 px-3 font-medium">Doc</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {validacion.validas.slice(0, 5).map((fila, idx) => (
                                                        <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                                                            <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{fila.fila}</td>
                                                            <td className="py-2 px-3">{fila.cliente_id}</td>
                                                            <td className="py-2 px-3 font-medium">{parseFloat(fila.monto).toFixed(2)}</td>
                                                            <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{fila.numero_documento}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {validacion.validas.length > 5 && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                                    +{validacion.validas.length - 5} más
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Errores */}
                                {validacion.errores.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800 p-6">
                                        <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5" />
                                            Filas con Errores ({validacion.errores.length})
                                        </h4>
                                        <div className="space-y-3">
                                            {validacion.errores.slice(0, 5).map((error, idx) => (
                                                <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                                                    <p className="font-medium text-red-800 dark:text-red-200">Fila {error.fila}</p>
                                                    <ul className="text-sm text-red-700 dark:text-red-300 mt-1 ml-4 list-disc">
                                                        {error.errores.map((err: string, i: number) => (
                                                            <li key={i}>{err}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                            {validacion.errores.length > 5 && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    +{validacion.errores.length - 5} errores más
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Advertencias */}
                                {validacion.advertencias.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-800 p-6">
                                        <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-3 flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5" />
                                            Advertencias ({validacion.advertencias.length})
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            {validacion.advertencias.slice(0, 5).map((adv, idx) => (
                                                <p key={idx} className="text-yellow-700 dark:text-yellow-300">
                                                    <strong>Fila {adv.fila}:</strong> {adv.advertencias[0]}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Botón Importar */}
                                {validacion.puede_importar && (
                                    <Button
                                        onClick={importarCreditos}
                                        disabled={cargandoImportacion}
                                        className="w-full gap-2 bg-green-600 hover:bg-green-700"
                                    >
                                        {cargandoImportacion ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                                Importando...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />
                                                Importar {validacion.validas.length} Créditos
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Panel Lateral - Instrucciones */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6 h-fit">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Instrucciones
                        </h3>

                        <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                            <div>
                                <p className="font-medium">📋 Formato CSV:</p>
                                <p className="text-xs mt-1">cliente_id, monto, fecha_venta (YYYY-MM-DD), numero_documento, observaciones</p>
                            </div>

                            <div>
                                <p className="font-medium">✅ Validaciones:</p>
                                <ul className="text-xs mt-1 ml-2 list-disc space-y-1">
                                    <li>Cliente debe existir</li>
                                    <li>Monto mayor a 0</li>
                                    <li>Fecha no futura</li>
                                    <li>Documento único</li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-medium">📊 Proceso:</p>
                                <ol className="text-xs mt-1 ml-2 space-y-1 list-decimal">
                                    <li>Selecciona CSV</li>
                                    <li>Valida datos</li>
                                    <li>Revisa errores</li>
                                    <li>Importa créditos</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resultados Importación */}
                {importacion && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className={`flex items-start gap-4 p-4 rounded-lg ${importacion.exito ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                            {importacion.exito ? (
                                <>
                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-green-900 dark:text-green-100">
                                            Importación Exitosa
                                        </h3>
                                        <p className="text-green-800 dark:text-green-200 text-sm mt-1">
                                            {importacion.mensaje}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-red-900 dark:text-red-100">
                                            Error en Importación
                                        </h3>
                                        <p className="text-red-800 dark:text-red-200 text-sm mt-1">
                                            {importacion.mensaje}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Detalles de Importación */}
                        {importacion.exito && importacion.importados.length > 0 && (
                            <div className="mt-6 overflow-x-auto">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    Créditos Importados ({importacion.total_importados})
                                </h4>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left py-2 px-3 font-medium">Fila</th>
                                            <th className="text-left py-2 px-3 font-medium">Cliente</th>
                                            <th className="text-left py-2 px-3 font-medium">Monto</th>
                                            <th className="text-left py-2 px-3 font-medium">ID CxC</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {importacion.importados.map((item, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                                                <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{item.fila}</td>
                                                <td className="py-2 px-3">{item.cliente_id}</td>
                                                <td className="py-2 px-3 font-medium">Bs {item.monto.toFixed(2)}</td>
                                                <td className="py-2 px-3 text-blue-600 dark:text-blue-400">#{item.cxc_id}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Botones de Acción */}
                        <div className="mt-6 flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setArchivo(null);
                                    setValidacion(null);
                                    setImportacion(null);
                                    setError(null);
                                }}
                            >
                                Importar Otro Archivo
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.visit('/admin/creditos')}
                            >
                                Ir a Créditos
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
