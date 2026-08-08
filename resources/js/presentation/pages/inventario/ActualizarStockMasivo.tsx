/**
 * Page: Actualizar Stock Masivo
 *
 * Permitir actualización masiva de stock mediante CSV:
 * ✅ Descargar plantilla CSV (id|sku|nombre|cantidad_total|lote_fifo)
 * ✅ Cargar CSV y procesar con trazabilidad de lote
 * ✅ Crear movimientos en movimientos_inventario con lote registrado
 * ✅ Crear lote=null si no existe stock previo
 */

import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import { Badge } from '@/presentation/components/ui/badge';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { Download, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChangesPreview {
  producto_id: number;
  sku: string;
  nombre: string;
  stock_anterior: number;
  stock_nuevo: number;
  diferencia: number;
}

export default function ActualizarStockMasivo() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [previewData, setPreviewData] = useState<ChangesPreview[]>([]);
  const [resultado, setResultado] = useState<any>(null);
  const [errores, setErrores] = useState<string[]>([]);

  // ✅ Descargar plantilla CSV
  const descargarPlantilla = async () => {
    setCargando(true);
    try {
      const response = await fetch('/inventario/actualizar-stock-masivo/descargar-plantilla');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plantilla-stock-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Plantilla descargada');
    } catch (error) {
      console.error('Error descargando plantilla:', error);
      toast.error('Error al descargar plantilla');
    } finally {
      setCargando(false);
    }
  };

  // ✅ Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast.error('Por favor selecciona un archivo CSV');
        return;
      }
      setArchivo(file);
      setErrores([]);
      setResultado(null);
    }
  };

  // ✅ Procesar CSV
  const procesarCSV = async () => {
    if (!archivo) {
      toast.error('Por favor selecciona un archivo');
      return;
    }

    setProcesando(true);
    const formData = new FormData();
    formData.append('csv', archivo);

    try {
      const response = await fetch('/inventario/actualizar-stock-masivo/procesar-csv', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar CSV');
      }

      setResultado(data);
      if (data.errores?.length > 0) {
        setErrores(data.errores);
      }

      toast.success(`✅ ${data.registros_actualizados} productos actualizados`);
    } catch (error) {
      console.error('Error procesando CSV:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar CSV');
    } finally {
      setProcesando(false);
    }
  };

  // ✅ Reiniciar
  const reiniciar = () => {
    setArchivo(null);
    setPreviewData([]);
    setResultado(null);
    setErrores([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Inventario', href: '/inventario' },
        { title: 'Actualizar Stock Masivo', href: '#' },
      ]}
    >
      <Head title="Actualizar Stock Masivo" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📊 Actualizar Stock Masivo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Descarga la plantilla, complétala con los nuevos valores de stock y cárgala para actualizar masivamente
          </p>
        </div>

        {/* Pasos */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-4">📋 Cómo funciona:</h2>
          <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start gap-3">
              <span className="font-bold">1.</span>
              <span><strong>Descarga</strong> la plantilla CSV: id | sku | nombre | cantidad_total | lote_fifo</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold">2.</span>
              <span><strong>Edita:</strong> Cambiar "cantidad_total" con el nuevo valor. El "lote_fifo" es el lote más antiguo; déjalo igual o especifica otro</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold">3.</span>
              <span><strong>Carga</strong> el archivo editado aquí</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold">4.</span>
              <span><strong>Resultado:</strong> Se actualiza el stock del lote y se crea movimiento con trazabilidad. Si no hay stock previo, crea lote=null</span>
            </li>
          </ol>
        </Card>

        {/* Sección Principal */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Panel Izquierdo: Descargar y Cargar */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📥 Descargar Plantilla</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Plantilla con 5 columnas: ID, SKU, Nombre, Cantidad Total (suma de lotes) y Lote FIFO (más antiguo)
            </p>
            <Button
              onClick={descargarPlantilla}
              disabled={cargando}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-6"
            >
              {cargando ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Descargando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Plantilla CSV
                </>
              )}
            </Button>

            <hr className="my-6" />

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📤 Cargar Archivo</h3>

            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {archivo ? archivo.name : 'Haz clic para seleccionar archivo CSV'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Solo archivos .csv | Máximo 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {archivo && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✅ {archivo.name} ({(archivo.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}

              <Button
                onClick={procesarCSV}
                disabled={!archivo || procesando}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {procesando ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Procesar CSV
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Panel Derecho: Resultados */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📊 Resultado</h3>

            {!resultado ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Carga un archivo para ver los resultados</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Actualizados</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {resultado.registros_actualizados}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Movimientos</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {resultado.movimientos_creados}
                    </p>
                  </div>
                </div>

                {resultado.errores?.length > 0 && (
                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                      {resultado.errores.length} filas con errores:
                      <ul className="mt-2 space-y-1 text-xs">
                        {resultado.errores.slice(0, 3).map((error: string, i: number) => (
                          <li key={i}>• {error}</li>
                        ))}
                        {resultado.errores.length > 3 && (
                          <li>• ... y {resultado.errores.length - 3} más</li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={reiniciar}
                  variant="outline"
                  className="w-full"
                >
                  Cargar otro archivo
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Información adicional */}
        <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <strong>⚠️ Importante:</strong> Los cambios se guardan inmediatamente. Se crearán movimientos en el inventario con tipo "Ajuste masivo de stock (carga CSV)".
          </AlertDescription>
        </Alert>
      </div>
    </AppLayout>
  );
}
