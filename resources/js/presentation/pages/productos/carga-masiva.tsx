import { Head } from '@inertiajs/react';
import { useProductosMasivos } from '@/application/hooks/use-productos-masivos';
import { productosCSVService } from '@/infrastructure/services/productosCSV.service';
import AppLayout from '@/layouts/app-layout';
import productosService from '@/infrastructure/services/productos.service';
import ModoImportacionProductos from './components/modo-importacion';
import VistaPreviewaProductos from './components/vista-previa';
import ConfirmacionProductos from './components/confirmacion';
import ProgresoProductos from './components/progreso';

interface CargaMasivaProductosProps {
  categorias?: Array<{ id: number; nombre: string }>;
  marcas?: Array<{ id: number; nombre: string }>;
  unidades?: Array<{ id: number; codigo: string; nombre: string }>;
  almacenes?: Array<{ id: number; nombre: string }>;
}

export default function CargaMasivaProductos({
  categorias = [],
  marcas = [],
  unidades = [],
  almacenes = [],
}: CargaMasivaProductosProps) {
  // Debug: mostrar datos recibidos en consola
  console.log('📦 Datos recibidos en carga-masiva:', {
    categorias,
    marcas,
    unidades,
    almacenes,
  });

  const {
    filas,
    paso,
    setPaso,
    progreso,
    erroresGlobales,
    resultadoProcesamiento,
    cargando,
    mensajeError,
    setMensajeError,
    filasValidas,
    porcentajeValidez,
    resumenValidacion,
    validarArchivo,
    resolverReferencias,
    procesarProductos,
    limpiar,
    volverAlPaso,
    editarFila,
    eliminarFila,
    cambiarAccionStock,
    cambiarAccionStockGlobal,
    detectarSKUsDuplicados,
    unificarSKUsDuplicados,
  } = useProductosMasivos();

  const pasos = [
    ['carga', 'Carga'],
    ['validacion', 'Validación'],
    ['confirmacion', 'Confirmación'],
    ['procesando', 'Procesamiento'],
    ['resultado', 'Resultado'],
  ];

  const handleArchivoSeleccionado = async (file: File) => {
    await validarArchivo(file);
  };

  // Resolver referencias cuando cambian las filas
  const filasResueltas = filas.length > 0
    ? resolverReferencias(filas, categorias, marcas, unidades, almacenes)
    : filas;

  const handleAnalizarErrores = () => {
    if (filasValidas.length > 0) {
      setPaso('confirmacion');
    }
  };

  const handleConfirmarValidacion = () => {
    setPaso('confirmacion');
  };

  const handleConfirmarProcessamiento = async () => {
    await procesarProductos();
  };

  const irAlHistorial = () => {
    window.location.href = '/productos/historial-cargas';
  };

  const irAlListadoProductos = () => {
    window.location.href = productosService.indexUrl();
  };

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: productosService.indexUrl() },
      { title: 'Productos', href: productosService.indexUrl() },
      { title: 'Carga Masiva', href: '#' }
    ]}>
      <Head title="Carga Masiva de Productos" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Indicador de pasos */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2">
              {pasos.map(([pasoId, label], idx) => (
                <div key={pasoId} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${paso === pasoId
                        ? 'bg-blue-600 dark:bg-blue-700 text-white'
                        : ['carga', 'validacion', 'confirmacion'].indexOf(pasoId) <
                          ['carga', 'validacion', 'confirmacion'].indexOf(paso)
                          ? 'bg-green-600 dark:bg-green-700 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    {label.charAt(0)}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                  {idx < pasos.length - 1 && <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-600 mx-2 ml-3" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Errores globales */}
          {erroresGlobales.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-red-900 dark:text-red-300 mb-2">Errores:</h3>
              <ul className="space-y-1 text-sm text-red-700 dark:text-red-400">
                {erroresGlobales.map((error, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span>•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mensaje de error */}
          {mensajeError && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4 mb-6 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">❌</span>
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 dark:text-red-200 mb-1">Error</h3>
                  <p className="text-red-700 dark:text-red-400 text-sm">{mensajeError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMensajeError(null)}
                  className="flex-shrink-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Paso 1: Carga */}
          {paso === 'carga' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6">
              <ModoImportacionProductos
                onArchivoSeleccionado={handleArchivoSeleccionado}
                onDescargarPlantilla={() => productosCSVService.descargarPlantilla()}
                cargando={cargando}
              />
            </div>
          )}

          {/* Paso 2: Validación */}
          {paso === 'validacion' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6">
              <VistaPreviewaProductos
                filas={filasResueltas}
                porcentajeValidez={porcentajeValidez}
                cargando={cargando}
                onAnalizarErrores={handleAnalizarErrores}
                onConfirmar={handleConfirmarValidacion}
                onCancelar={() => volverAlPaso('carga')}
                onEditarFila={editarFila}
                onEliminarFila={eliminarFila}
                onCambiarAccionStock={cambiarAccionStock}
                onDetectarSKUsDuplicados={detectarSKUsDuplicados}
                onUnificarSKUsDuplicados={unificarSKUsDuplicados}
                categorias={categorias}
                marcas={marcas}
                unidades={unidades}
                almacenes={almacenes}
              />
            </div>
          )}

          {/* Paso 3: Confirmación */}
          {paso === 'confirmacion' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6">
              <ConfirmacionProductos
                resumenValidacion={resumenValidacion}
                cargando={cargando}
                onConfirmar={handleConfirmarProcessamiento}
                onVolver={() => volverAlPaso('validacion')}
                onCambiarAccionStockGlobal={cambiarAccionStockGlobal}
              />
            </div>
          )}

          {/* Paso 4 & 5: Procesamiento y Resultado */}
          {(paso === 'procesando' || paso === 'resultado') && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/30 p-6">
              <ProgresoProductos
                progreso={progreso}
                resultado={resultadoProcesamiento}
                cargando={cargando}
                error={mensajeError}
                onNuevamente={limpiar}
                onIrHistorial={irAlHistorial}
                onIrProductos={irAlListadoProductos}
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
