import React, { useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import { Badge } from '@/presentation/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/presentation/components/ui/alert';
import SearchSelect, { SelectOption } from '@/presentation/components/ui/search-select';
import { ArrowLeft, Download, Upload, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';
import axios from 'axios';

interface ImportCSVProps {
  productos: Array<{ id: number; nombre: string; sku: string }>;
}

interface ImportResult {
  exitosos: number;
  errores: number;
  total: number;
  detalles: Array<{
    fila: number;
    producto?: string;
    rango?: string;
    tipo_precio?: string;
    error?: string;
    tipo: 'exito' | 'error';
  }>;
  productos_procesados: string[];
}

interface PreviewData {
  total_filas: number;
  filas_validas: number;
  filas_con_error: number;
  productos_encontrados: Array<{ id: number; nombre: string; sku: string }>;
  tipos_precio_encontrados: Array<{ id: number; nombre: string; codigo: string }>;
  detalles: Array<{
    fila: number;
    valido: boolean;
    error: string | null;
    datos?: {
      producto_nombre: string;
      producto_sku: string;
      tipo_precio_nombre: string;
      tipo_precio_codigo: string;
      rango_texto: string;
    };
  }>;
  productos_procesados: string[];
}

export default function ImportCSV({ productos }: ImportCSVProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [importedData, setImportedData] = useState<ImportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [selectedProductoId, setSelectedProductoId] = useState<number | null>(null);
  const [sobreescribir, setSobreescribir] = useState(false);
  const [correcciones, setCorrecciones] = useState<Record<number, number>>({});
  const [filasEliminadas, setFilasEliminadas] = useState<Set<number>>(new Set());
  const [importErrors, setImportErrors] = useState<Array<{ fila: number; error: string }> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCorregirProducto = (fila: number, productoId: number) => {
    setCorrecciones(prev => ({
      ...prev,
      [fila]: productoId
    }));
  };

  const obtenerProductoCorregido = (fila: number) => {
    return correcciones[fila];
  };

  const handleEliminarFila = (fila: number) => {
    setFilasEliminadas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fila)) {
        newSet.delete(fila);
      } else {
        newSet.add(fila);
      }
      return newSet;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.name.endsWith('.csv')) {
        NotificationService.error('Por favor selecciona un archivo CSV válido');
        return;
      }
      setSelectedFile(file);
      setImportedData(null);
      previsualizarArchivo(file);
    }
  };

  const previsualizarArchivo = async (file: File) => {
    setIsPreviewLoading(true);
    const formData = new FormData();
    formData.append('archivo', file);
    if (selectedProductoId) {
      formData.append('producto_id', String(selectedProductoId));
    }

    try {
      const response = await axios.post('/api/productos/rangos-precio/previsualizar-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPreviewData(response.data.data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al previsualizar el archivo';
      NotificationService.error(message);
      setPreviewData(null);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.name.endsWith('.csv')) {
        NotificationService.error('Por favor arrastra un archivo CSV válido');
        return;
      }
      setSelectedFile(file);
      setImportedData(null);
      previsualizarArchivo(file);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get('/api/productos/rangos-precio/plantilla-csv', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'plantilla_rangos_precios.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      NotificationService.success('Plantilla descargada correctamente');
    } catch (error) {
      NotificationService.error('Error al descargar la plantilla');
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      NotificationService.error('Por favor selecciona un archivo CSV');
      return;
    }

    // Validar que todas las filas no eliminadas tengan producto
    const filasConError = previewData?.detalles.filter(
      d => !filasEliminadas.has(d.fila) && !d.valido && !obtenerProductoCorregido(d.fila)
    ) || [];

    if (filasConError.length > 0) {
      NotificationService.error(`Faltan ${filasConError.length} producto(s) por seleccionar`);
      return;
    }

    setIsLoading(true);
    const loadingToast = NotificationService.loading('Importando rangos...');

    try {
      const formData = new FormData();
      formData.append('archivo', selectedFile);
      if (selectedProductoId) {
        formData.append('producto_id', String(selectedProductoId));
      }
      if (sobreescribir) {
        formData.append('sobreescribir', '1');
      }

      // Enviar correcciones de productos
      if (Object.keys(correcciones).length > 0) {
        formData.append('correcciones', JSON.stringify(correcciones));
      }

      // Enviar filas eliminadas
      if (filasEliminadas.size > 0) {
        formData.append('filas_eliminadas', JSON.stringify(Array.from(filasEliminadas)));
      }

      // ✅ DEBUG: Mostrar en consola qué se envía al backend
      console.log('========== IMPORTANDO CSV AL BACKEND ==========');
      console.log('Archivo:', selectedFile?.name);
      console.log('Tamaño:', selectedFile?.size);
      console.log('FormData contenido:');
      console.log('- producto_id:', selectedProductoId || 'No definido');
      console.log('- sobreescribir:', sobreescribir ? 'Sí' : 'No');
      console.log('- correcciones:', Object.keys(correcciones).length > 0 ? correcciones : 'Ninguna');
      console.log('- filas_eliminadas:', filasEliminadas.size > 0 ? Array.from(filasEliminadas) : 'Ninguna');
      console.log('============================================');

      const response = await axios.post('/api/productos/rangos-precio/importar-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      NotificationService.dismiss(loadingToast);
      setImportedData(response.data.data);
      setCorrecciones({}); // Limpiar correcciones después de importar

      if (response.data.success) {
        NotificationService.success(response.data.message);
      } else {
        NotificationService.warning(response.data.message);
      }
    } catch (error: any) {
      NotificationService.dismiss(loadingToast);

      // ✅ DEBUG: Mostrar en consola el error del servidor
      console.log('========== ERROR EN IMPORTACIÓN CSV ==========');
      console.log('Status:', error.response?.status);
      console.log('Errores de validación:', error.response?.data?.errors);
      console.log('Errores de filas:', error.response?.data?.data?.detalles);
      console.log('Mensaje:', error.response?.data?.message);
      console.log('Respuesta completa:', error.response?.data);
      console.log('=============================================');

      // Mostrar errores de validación del request si existen
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => {
            const msgs = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgs.join(', ')}`;
          })
          .join('\n');

        NotificationService.error(`Errores de validación:\n${errorMessages}`);
        console.error('Validation errors:', errors);
      } else if (error.response?.status === 422 && error.response?.data?.data?.detalles) {
        // Errores de procesamiento de filas - guardar en estado y mostrar en UI
        const detalles = error.response.data.data.detalles;
        setImportErrors(detalles);

        NotificationService.error(
          `Importación fallida: ${detalles.length} errores encontrados. Ver detalles abajo.`
        );
        console.error('Import row errors:', detalles);
      } else {
        const message = error.response?.data?.message || 'Error al importar los rangos';
        NotificationService.error(message);
        console.error('Import error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setImportedData(null);
    setSelectedProductoId(null);
    setSobreescribir(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const successCount = importedData?.exitosos || 0;
  const errorCount = importedData?.errores || 0;
  const totalCount = importedData?.total || 0;

  return (
    <>
      <Head title="Importar Rangos CSV" />
      <AppLayout
        breadcrumbs={[
          { title: 'Dashboard', href: '/' },
          { title: 'Configuración', href: '#' },
          { title: 'Rangos de Precios', href: '/precio-rango' },
          { title: 'Importar CSV', href: '#', active: true },
        ]}
      >
        <div className="space-y-6 p-6">
          {/* HEADER */}
          <div className="flex items-center gap-4">
            <Link href="/precio-rango">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight dark:text-white">Importar Rangos CSV</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Carga múltiples rangos de precios desde un archivo CSV
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* FORMULARIO DE IMPORTACIÓN */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="dark:text-white">Seleccionar Archivo CSV</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Arrastra un archivo o haz clic para seleccionar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Área de drag-and-drop */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    selectedFile
                      ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="space-y-2">
                    {selectedFile ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto" />
                        <p className="font-semibold dark:text-white">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="font-semibold dark:text-white">Arrastra tu archivo CSV aquí</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">o haz clic para seleccionar</p>
                      </>
                    )}
                  </div>
                </div>

                {/* VISTA PREVIA DEL ARCHIVO */}
                {isPreviewLoading && selectedFile && (
                  <div className="border-t dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                        <p className="text-gray-600 dark:text-gray-400">Analizando archivo...</p>
                      </div>
                    </div>
                  </div>
                )}

                {previewData && !isPreviewLoading && (
                  <div className="space-y-4 border-t dark:border-gray-700 pt-4">
                    <h3 className="font-semibold text-sm dark:text-white">Vista Previa del Archivo</h3>

                    {/* Resumen de validación */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700/40">
                        <p className="text-xs text-blue-600 dark:text-blue-400">Total Filas</p>
                        <p className="text-lg font-bold dark:text-white">{previewData.total_filas}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700/40">
                        <p className="text-xs text-green-600 dark:text-green-400">Válidas</p>
                        <p className="text-lg font-bold dark:text-white">{previewData.filas_validas}</p>
                      </div>
                      <div className={`p-3 rounded-lg border ${previewData.filas_con_error > 0
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40'
                        : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700/40'
                      }`}>
                        <p className={`text-xs ${previewData.filas_con_error > 0
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400'
                        }`}>Con Error</p>
                        <p className="text-lg font-bold dark:text-white">{previewData.filas_con_error}</p>
                      </div>
                    </div>

                    {/* Productos encontrados */}
                    {previewData.productos_encontrados.length > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700/40">
                        <p className="text-xs font-semibold mb-2 dark:text-blue-200">
                          Productos Encontrados ({previewData.productos_encontrados.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {previewData.productos_encontrados.map((prod) => (
                            <Badge key={prod.id} variant="outline" className="dark:border-blue-400 dark:text-blue-300">
                              {prod.nombre} <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({prod.sku})</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tipos de precio encontrados */}
                    {previewData.tipos_precio_encontrados.length > 0 && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-700/40">
                        <p className="text-xs font-semibold mb-2 dark:text-purple-200">
                          Tipos de Precio Encontrados ({previewData.tipos_precio_encontrados.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {previewData.tipos_precio_encontrados.map((tipo) => (
                            <Badge key={tipo.id} variant="outline" className="dark:border-purple-400 dark:text-purple-300">
                              {tipo.nombre} <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({tipo.codigo})</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tabla de validación detallada */}
                    {previewData.detalles.length > 0 && (
                      <div className="space-y-3">
                        <div className="overflow-x-auto">
                          <Table className="text-xs">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Fila</TableHead>
                                <TableHead>Producto (Búsqueda)</TableHead>
                                <TableHead>Producto (Corrección)</TableHead>
                                <TableHead>Rango</TableHead>
                                <TableHead>Tipo Precio</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acción</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {previewData.detalles.map((detalle, idx) => {
                                const productoCorregido = obtenerProductoCorregido(detalle.fila);
                                const productoSeleccionado = productoCorregido
                                  ? productos.find(p => p.id === productoCorregido)
                                  : null;
                                const filaEliminada = filasEliminadas.has(detalle.fila);

                                return (
                                  <TableRow
                                    key={idx}
                                    className={`${
                                      filaEliminada
                                        ? 'opacity-50 bg-gray-100 dark:bg-gray-900/30'
                                        : !detalle.valido && !productoCorregido
                                        ? 'bg-red-50 dark:bg-red-900/10'
                                        : ''
                                    }`}
                                  >
                                    <TableCell className="font-medium">{detalle.fila}</TableCell>
                                    <TableCell className="dark:text-gray-300 max-w-xs">
                                      <span className="text-xs">{detalle.error || detalle.datos?.producto_nombre || '-'}</span>
                                    </TableCell>
                                    <TableCell className="max-w-xs">
                                      {!detalle.valido && !filaEliminada ? (
                                        <SearchSelect
                                          label=""
                                          placeholder="Selecciona producto..."
                                          value={productoCorregido || ''}
                                          options={productos.map((p) => ({
                                            value: p.id,
                                            label: p.nombre,
                                            description: `SKU: ${p.sku}`,
                                          } as SelectOption))}
                                          onChange={(value) => handleCorregirProducto(detalle.fila, value ? parseInt(String(value)) : 0)}
                                          searchPlaceholder="Buscar..."
                                          emptyText="No hay productos"
                                          allowClear
                                        />
                                      ) : (
                                        <span className="text-xs text-green-600 dark:text-green-400">✓ {detalle.datos?.producto_nombre}</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="dark:text-gray-300 font-semibold">
                                      {detalle.datos?.rango_texto || '-'}
                                    </TableCell>
                                    <TableCell className="dark:text-gray-300">
                                      {detalle.datos?.tipo_precio_nombre || '-'}
                                    </TableCell>
                                    <TableCell>
                                      {detalle.valido || productoCorregido ? (
                                        <Badge className="bg-green-600">✓ Ok</Badge>
                                      ) : filaEliminada ? (
                                        <Badge variant="secondary">Descartada</Badge>
                                      ) : (
                                        <Badge className="bg-red-600">Error</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        size="sm"
                                        variant={filaEliminada ? 'outline' : 'destructive'}
                                        onClick={() => handleEliminarFila(detalle.fila)}
                                        className="text-xs"
                                      >
                                        {filaEliminada ? 'Restaurar' : 'Eliminar'}
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Alerta si hay errores sin corregir */}
                        {previewData.detalles.some(d => !d.valido && !obtenerProductoCorregido(d.fila)) && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700/40">
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                              ⚠️ Selecciona un producto para cada fila con error antes de importar
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Filtros opcionales */}
                <div className="space-y-4 border-t dark:border-gray-700 pt-4">
                  <h3 className="font-semibold text-sm dark:text-white">Opciones (Opcional)</h3>

                  <div>
                    <SearchSelect
                      label="Producto (filtro)"
                      placeholder="Dejar vacío para todos los productos..."
                      value={selectedProductoId || ''}
                      options={productos.map((p) => ({
                        value: p.id,
                        label: p.nombre,
                        description: `SKU: ${p.sku}`,
                      } as SelectOption))}
                      onChange={(value) => setSelectedProductoId(value ? parseInt(String(value)) : null)}
                      searchPlaceholder="Buscar producto..."
                      allowClear
                      emptyText="No se encontraron productos"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Si seleccionas un producto, solo se importarán rangos para ese producto
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="sobreescribir"
                      checked={sobreescribir}
                      onChange={(e) => setSobreescribir(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="sobreescribir" className="text-sm cursor-pointer dark:text-gray-300">
                      Sobreescribir rangos existentes
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Si está habilitado, eliminará todos los rangos existentes del producto antes de importar
                  </p>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    disabled={!selectedFile && !importedData}
                  >
                    Limpiar
                  </Button>
                  {(() => {
                    const filasCorrectas = previewData?.detalles.filter(
                      d => d.valido || obtenerProductoCorregido(d.fila)
                    ).length || 0;
                    const isDisabled = !previewData || filasCorrectas === 0 || isLoading || isPreviewLoading;

                    return (
                      <Button
                        onClick={handleImport}
                        disabled={isDisabled}
                        className="flex-1"
                      >
                        {isLoading ? 'Importando...' : `Importar (${filasCorrectas} válidas)`}
                      </Button>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* PANEL LATERAL */}
            <div className="space-y-4">
              {/* INFORMACIÓN */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">Información</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3 dark:text-gray-300">
                  <div>
                    <p className="font-semibold mb-1">Formato CSV esperado:</p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                      sku,cantidad_minima,cantidad_maxima,tipo_precio,fecha_inicio,fecha_fin
                    </code>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Ejemplo:</p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                      PEPSI-250,1,9,VENTA_NORMAL,,
                    </code>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Descargar plantilla:</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTemplate}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar plantilla
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* ALERTA DE INFORMACIÓN */}
              <Alert className="dark:border-blue-700/40 dark:bg-blue-900/20">
                <AlertCircle className="h-4 w-4 dark:text-blue-400" />
                <AlertTitle className="dark:text-blue-200">Recomendaciones</AlertTitle>
                <AlertDescription className="text-xs dark:text-blue-300/80">
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Descarga primero la plantilla para ver el formato</li>
                    <li>Los SKU deben existir en el sistema</li>
                    <li>Los rangos no deben solaparse</li>
                    <li>Máximo 1000 registros por importación</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* RESULTADOS DE IMPORTACIÓN */}
          {importedData && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="dark:text-white">Resultado de la Importación</CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Total procesado: {totalCount} registros
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {successCount} exitosos
                    </Badge>
                    {errorCount > 0 && (
                      <Badge className="bg-red-600">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {errorCount} errores
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fila</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Rango</TableHead>
                        <TableHead>Tipo de Precio</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Detalles</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importedData.detalles.map((detalle, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{detalle.fila}</TableCell>
                          <TableCell className="dark:text-gray-300">
                            {detalle.producto || '-'}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            {detalle.rango || '-'}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            {detalle.tipo_precio || '-'}
                          </TableCell>
                          <TableCell>
                            {detalle.tipo === 'exito' ? (
                              <Badge className="bg-green-600">Éxito</Badge>
                            ) : (
                              <Badge className="bg-red-600">Error</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm dark:text-gray-300">
                            {detalle.error ? (
                              <span className="text-red-600 dark:text-red-400">{detalle.error}</span>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">Rango importado</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {importedData.productos_procesados.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/40">
                    <p className="text-sm font-semibold mb-2 dark:text-blue-200">
                      Productos procesados ({importedData.productos_procesados.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {importedData.productos_procesados.map((producto, idx) => (
                        <Badge key={idx} variant="outline" className="dark:border-blue-400 dark:text-blue-300">
                          {producto}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ERRORES DE IMPORTACIÓN */}
          {importErrors && importErrors.length > 0 && (
            <Card className="border-red-200 dark:border-red-700/40">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="dark:text-red-300 text-red-600">
                      Errores de Importación ({importErrors.length})
                    </CardTitle>
                    <CardDescription className="dark:text-red-200/70">
                      Los siguientes registros no pudieron ser importados
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setImportErrors(null)}
                  >
                    ✕ Cerrar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {importErrors.map((error, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 rounded-lg"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                            Fila {error.fila + 1}
                          </p>
                          <p className="text-xs text-red-800 dark:text-red-400 mt-1">
                            {error.error}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {importErrors.length > 10 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/40">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      💡 <strong>Tip:</strong> Verifica que todos los productos tengan precios configurados para los tipos de precio que estás importando (VENTA, DESCUENTO, ESPECIAL, etc.)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </AppLayout>
    </>
  );
}
