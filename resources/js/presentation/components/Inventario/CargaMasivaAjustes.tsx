import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ajustesCSVService from '@/infrastructure/services/ajustesCSV.service';

// Domain types
import type { FilaAjusteValidada } from '@/domain/entities/ajustes-masivos';
import type { TipoAjusteInventario } from '@/domain/entities/tipos-ajuste-inventario';
import type { TipoMerma } from '@/domain/entities/tipo-merma';
import type { Almacen } from '@/domain/entities/almacenes';
import type { Producto, Proveedor, Cliente } from '@/domain/entities/recursos-inventario';

// Application hooks
import { useAjustesMasivos } from '@/application/hooks/use-ajustes-masivos';
import { useTiposOperacion } from '@/application/hooks/use-tipos-operacion';

// Sub-componentes
import TablaAjustesPreview from '@/presentation/components/Inventario/TablaAjustesPreview';
import ResumenAjustes from '@/presentation/components/Inventario/ResumenAjustes';
import InstruccionesOperaciones from '@/presentation/components/Inventario/InstruccionesOperaciones';

interface CargaMasivaAjustesProps {
    productos: Producto[];
    tiposAjuste: TipoAjusteInventario[];
    tiposMerma: TipoMerma[];
    almacenes: Almacen[];
    proveedores?: Proveedor[];
    clientes?: Cliente[];
}

/**
 * Componente de Carga Masiva de Ajustes
 *
 * Responsabilidades:
 * - Renderizar UI de carga de archivos
 * - Mostrar tabla de vista previa
 * - Gestionar flujo de pasos (carga → edición → confirmación → procesamiento)
 * - Delegar lógica a hooks de Application
 *
 * Arquitectura:
 * Component → useAjustesMasivos (Application) → ajustes.service (Infrastructure)
 */
export default function CargaMasivaAjustes({
    productos,
    tiposAjuste,
    tiposMerma,
    almacenes,
    proveedores = [],
    clientes = [],
}: CargaMasivaAjustesProps) {
    // ✅ Encapsulación de lógica en Application hooks
    const {
        archivoSeleccionado,
        setArchivoSeleccionado,
        filasValidas,
        resultadoValidacion,
        duplicadosDetectados,
        cargando,
        progreso,
        paso,
        setPaso,
        validarArchivo,
        procesarAjustes,
        agruparDuplicados,
        detectarDuplicados,
        limpiar,
    } = useAjustesMasivos();

    // ✅ Carga de tipos de operación
    const { tipos: tiposOperacion, cargando: cargandoTipos } = useTiposOperacion({ autoLoad: true });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mostrarModalDuplicados, setMostrarModalDuplicados] = useState(false);
    const [mostrarModalError, setMostrarModalError] = useState(false);
    const [errorModal, setErrorModal] = useState({ titulo: '', mensaje: '' });

    /**
     * Manejar selección de archivo
     */
    const handleSeleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase();
        const formatosSoportados = ['csv', 'xlsx', 'xls', 'ods'];

        if (!formatosSoportados.includes(extension || '')) {
            toast.error(`Formato no soportado. Usa: ${formatosSoportados.join(', ').toUpperCase()}`);
            return;
        }

        // ✅ Guardar archivo en el hook state
        setArchivoSeleccionado(file);
    };

    /**
     * Descargar plantilla CSV de ejemplo
     */
    const handleDescargarPlantilla = () => {
        try {
            const contenido = ajustesCSVService.generarPlantillaCSV(
                tiposOperacion,
                tiposAjuste,
                tiposMerma,
                almacenes
            );
            ajustesCSVService.descargarCSV(contenido, 'plantilla-ajustes-inventario.csv');
            toast.success('Plantilla descargada correctamente');
        } catch (error) {
            const mensaje = error instanceof Error ? error.message : 'Error descargando plantilla';
            toast.error(mensaje);
        }
    };

    /**
     * Validar archivo y cargar datos
     */
    const handleCargarYValidar = async () => {
        if (!archivoSeleccionado) {
            toast.error('Selecciona un archivo (CSV, XLSX, ODS)');
            return;
        }

        try {
            const resultado = await validarArchivo(
                archivoSeleccionado,
                productos,
                tiposOperacion,
                tiposAjuste,
                tiposMerma,
                almacenes
            );

            // ✅ Verificar si hay duplicados
            const duplicados = detectarDuplicados(resultado.filasValidas);
            if (duplicados.length > 0) {
                setMostrarModalDuplicados(true);
                return;
            }

            // ✅ Si no hay duplicados, ir a confirmación
            setPaso('confirmacion');
        } catch (error) {
            console.error('Error validating file:', error);
        }
    };

    /**
     * Procesar ajustes masivos
     */
    const handleProcesarAjustes = async () => {
        try {
            const resultado = await procesarAjustes();

            if (resultado) {
                toast.success(`${resultado.procesados} ajustes procesados correctamente`);
                // Resetear después de 2 segundos
                setTimeout(() => {
                    limpiar();
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }, 2000);
            }
        } catch (error) {
            const mensaje = error instanceof Error ? error.message : 'Error procesando ajustes';
            setErrorModal({ titulo: 'Error al procesar', mensaje });
            setMostrarModalError(true);
        }
    };

    /**
     * Regresar a carga
     */
    const handleRegresar = () => {
        limpiar();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            {/* INDICADOR DE PROGRESO */}
            {paso !== 'carga' && (
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Paso {paso === 'confirmacion' ? 2 : 3} de 3
                        </span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {paso === 'confirmacion' && 'Confirmar cambios'}
                            {paso === 'procesando' && `Procesando... ${Math.round(progreso)}%`}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${paso === 'confirmacion' ? 50 : paso === 'procesando' ? progreso : 33}%`,
                            }}
                        />
                    </div>
                </div>
            )}

            {/* PASO 1: CARGA */}
            {paso === 'carga' && (
                <div className="space-y-6">
                    {/* Instrucciones */}
                    {tiposOperacion.length > 0 && (
                        <InstruccionesOperaciones
                            tiposOperacion={tiposOperacion}
                            tiposAjuste={tiposAjuste}
                            tiposMerma={tiposMerma}
                        />
                    )}

                    {/* Info de carga */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                            💡 Carga masiva de ajustes de inventario
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
                            Importa múltiples ajustes de inventario desde un archivo CSV, XLSX u ODS para procesarlos en lote.
                        </p>

                        <button
                            onClick={handleDescargarPlantilla}
                            disabled={cargando || cargandoTipos}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            Descargar plantilla
                        </button>
                    </div>

                    {/* Selector de archivo */}
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-8l-4-4m0 0l-4 4m4-4v12m0 0l-4 4m4-4l4 4"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls,.ods"
                            onChange={handleSeleccionarArchivo}
                            className="hidden"
                            disabled={cargando}
                        />

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={cargando}
                            className="inline-flex items-center mt-4 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Seleccionar archivo (CSV, XLSX, ODS)
                        </button>

                        {archivoSeleccionado && (
                            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                <p className="font-medium">{archivoSeleccionado.name}</p>
                                <p className="text-xs mt-1">{(archivoSeleccionado.size / 1024).toFixed(2)} KB</p>
                            </div>
                        )}
                    </div>

                    {/* Botón validar */}
                    {archivoSeleccionado && (
                        <button
                            onClick={handleCargarYValidar}
                            disabled={cargando}
                            className="w-full inline-flex justify-center items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cargando ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Validando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Cargar y validar
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* PASO 2: CONFIRMACIÓN Y PROCESAMIENTO */}
            {(paso === 'confirmacion' || paso === 'procesando') && (
                <div className="space-y-6">
                    {/* Resumen */}
                    {resultadoValidacion && (
                        <ResumenAjustes
                            resultado={resultadoValidacion}
                            filas={filasValidas}
                            duplicados={duplicadosDetectados}
                        />
                    )}

                    {/* Tabla preview */}
                    {filasValidas.length > 0 && (
                        <TablaAjustesPreview
                            filas={filasValidas}
                            onFilasActualizadas={() => {}}
                        />
                    )}

                    {/* Botones de acción */}
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleRegresar}
                            disabled={cargando}
                            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            Regresar
                        </button>

                        <button
                            onClick={handleProcesarAjustes}
                            disabled={cargando || filasValidas.length === 0}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {cargando ? 'Procesando...' : 'Procesar ajustes'}
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL DUPLICADOS */}
            {mostrarModalDuplicados && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md">
                        <h2 className="text-lg font-bold mb-4">Duplicados detectados</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Se encontraron {duplicadosDetectados.length} grupo(s) de duplicados. ¿Deseas agruparlos?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setMostrarModalDuplicados(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    agruparDuplicados();
                                    setMostrarModalDuplicados(false);
                                    setPaso('confirmacion');
                                }}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                            >
                                Agrupar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ERROR */}
            {mostrarModalError && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md">
                        <h2 className="text-lg font-bold mb-2 text-red-600">{errorModal.titulo}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{errorModal.mensaje}</p>
                        <button
                            onClick={() => setMostrarModalError(false)}
                            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
