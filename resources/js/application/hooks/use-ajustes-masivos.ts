import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import type {
    FilaAjusteCSV,
    FilaAjusteValidada,
    ResultadoValidacion,
    DuplicadoDetectado,
    DatosAjusteMasivo,
    AjusteParaProcesar,
    EstrategiaResolucionDuplicados,
} from '@/domain/entities/ajustes-masivos';
import ajustesCSVService from '@/infrastructure/services/ajustesCSV.service';
import ajustesService from '@/infrastructure/services/ajustes.service';

interface UseAjustesMasivosOptions {
    autoValidate?: boolean;
}

interface UseAjustesMasivosReturn {
    archivoSeleccionado: File | null;
    setArchivoSeleccionado: (file: File | null) => void;
    filasValidas: FilaAjusteValidada[];
    setFilasValidas: (filas: FilaAjusteValidada[]) => void;
    resultadoValidacion: ResultadoValidacion | null;
    duplicadosDetectados: DuplicadoDetectado[];
    cargando: boolean;
    progreso: number;
    setPaso: (paso: 'carga' | 'validacion' | 'confirmacion') => void;
    paso: 'carga' | 'validacion' | 'confirmacion';
    detectarDuplicados: (filas: FilaAjusteValidada[]) => DuplicadoDetectado[];
    agruparDuplicados: () => void;
    resolverDuplicados: (estrategia: EstrategiaResolucionDuplicados) => void;
    validarArchivo: (
        file: File,
        productos: any[],
        tiposOperacion: any[],
        tiposAjuste: any[],
        tiposMerma: any[],
        almacenes: any[]
    ) => Promise<ResultadoValidacion>;
    procesarAjustes: (observacion?: string) => Promise<any>;
    limpiar: () => void;
}

/**
 * Application Layer Hook
 *
 * Encapsula toda la lógica de ajustes masivos:
 * - Validación de archivos CSV/XLSX/ODS
 * - Detección de duplicados
 * - Procesamiento de ajustes
 * - Manejo de errores
 *
 * @example
 * const { filasValidas, procesarAjustes } = useAjustesMasivos();
 */
export function useAjustesMasivos(options: UseAjustesMasivosOptions = {}): UseAjustesMasivosReturn {
    const { autoValidate = true } = options;

    // Estado de archivo y validación
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
    const [filasValidas, setFilasValidas] = useState<FilaAjusteValidada[]>([]);
    const [resultadoValidacion, setResultadoValidacion] = useState<ResultadoValidacion | null>(null);
    const [duplicadosDetectados, setDuplicadosDetectados] = useState<DuplicadoDetectado[]>([]);

    // Estado de UI
    const [cargando, setCargando] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [paso, setPaso] = useState<'carga' | 'validacion' | 'confirmacion'>('carga');

    /**
     * Detectar duplicados en las filas validadas
     * Los duplicados son filas con mismo producto, almacén y tipo de operación
     */
    const detectarDuplicados = useCallback((filas: FilaAjusteValidada[]): DuplicadoDetectado[] => {
        const mapa = new Map<string, DuplicadoDetectado>();

        filas.forEach(fila => {
            const clave = `${fila.producto_id}_${fila.almacen_id}_${fila.tipo_operacion_id}`;

            if (mapa.has(clave)) {
                const duplicado = mapa.get(clave)!;
                duplicado.cantidadTotal += parseInt(String(fila.cantidad), 10);
                duplicado.filas.push(fila);
            } else {
                mapa.set(clave, {
                    clave,
                    producto: fila.producto,
                    tipo_operacion: fila.tipo_operacion,
                    almacen: fila.almacen,
                    cantidad: parseInt(String(fila.cantidad), 10),
                    cantidadTotal: parseInt(String(fila.cantidad), 10),
                    filas: [fila],
                });
            }
        });

        // Retornar solo los que tienen múltiples filas
        return Array.from(mapa.values()).filter(d => d.filas.length > 1);
    }, []);

    /**
     * Agrupar duplicados sumando cantidades en una sola fila
     */
    const agruparDuplicados = useCallback(() => {
        const duplicados = detectarDuplicados(filasValidas);

        if (duplicados.length === 0) {
            toast.info('No hay duplicados para agrupar');
            return;
        }

        // Crear set de claves de duplicados
        const clavesAgrupadas = new Set(duplicados.map(d => d.clave));

        // Filtar filas originales y agregar una fila agrupada por cada duplicado
        const filasFiltradasSinDuplicados = filasValidas.filter(
            fila => {
                const clave = `${fila.producto_id}_${fila.almacen_id}_${fila.tipo_operacion_id}`;
                return !clavesAgrupadas.has(clave);
            }
        );

        // Agregar filas agrupadas
        const filasAgrupadas = duplicados.map((dup, idx) => ({
            ...dup.filas[0],
            cantidad: dup.cantidadTotal,
            observacion: `${dup.filas[0].observacion} [AGRUPADO: ${dup.filas.length} filas]`,
            fila: filasFiltradasSinDuplicados.length + idx + 1,
        }));

        const nuevoListado = [...filasFiltradasSinDuplicados, ...filasAgrupadas];
        setFilasValidas(nuevoListado);

        toast.success(`${duplicados.length} grupo(s) de duplicados agrupados`);
    }, [filasValidas, detectarDuplicados]);

    /**
     * Resolver duplicados según estrategia elegida
     */
    const resolverDuplicados = useCallback(
        (estrategia: EstrategiaResolucionDuplicados) => {
            switch (estrategia) {
                case 'agrupar':
                    agruparDuplicados();
                    break;
                case 'mantener':
                    toast.info('Manteniendo todas las filas sin agrupar');
                    setDuplicadosDetectados([]);
                    break;
                case 'cancelar':
                    setFilasValidas([]);
                    setPaso('carga');
                    toast.warning('Procesamiento cancelado');
                    break;
            }
        },
        [agruparDuplicados]
    );

    /**
     * Validar archivo cargado
     */
    const validarArchivo = useCallback(
        async (
            file: File,
            productos: any[],
            tiposOperacion: any[],
            tiposAjuste: any[],
            tiposMerma: any[],
            almacenes: any[]
        ): Promise<ResultadoValidacion> => {
            setCargando(true);
            setProgreso(0);

            try {
                // Paso 1: Parsear archivo
                setProgreso(25);
                const filas = await ajustesCSVService.parsearArchivo(file);

                // Paso 2: Validar filas
                setProgreso(50);
                const resultado = await ajustesCSVService.validarFilas(
                    filas,
                    productos,
                    tiposOperacion,
                    tiposAjuste,
                    tiposMerma,
                    almacenes
                );

                // Paso 3: Detectar duplicados
                setProgreso(75);
                const duplicados = detectarDuplicados(resultado.filasValidas);
                setDuplicadosDetectados(duplicados);

                // Paso 4: Completar
                setProgreso(100);
                setResultadoValidacion(resultado);
                setFilasValidas(resultado.filasValidas);
                setArchivoSeleccionado(file);

                // Mostrar resumen
                if (resultado.filasConError > 0) {
                    toast.warning(
                        `${resultado.filasConError} fila(s) con errores. ${resultado.filasValidas.length} válidas.`
                    );
                } else {
                    toast.success(`Archivo validado: ${resultado.filasValidas.length} filas válidas`);
                }

                return resultado;
            } catch (error) {
                const mensaje = error instanceof Error ? error.message : 'Error validando archivo';
                toast.error(mensaje);
                console.error('Error validating file:', error);
                throw error;
            } finally {
                setCargando(false);
                setTimeout(() => setProgreso(0), 1000);
            }
        },
        [detectarDuplicados]
    );

    /**
     * Procesar ajustes masivos
     */
    const procesarAjustes = useCallback(
        async (observacion?: string) => {
            if (filasValidas.length === 0) {
                toast.error('No hay filas para procesar');
                return;
            }

            setCargando(true);

            try {
                // Mapear filas validadas a ajustes para procesar
                const ajustes: AjusteParaProcesar[] = filasValidas.map(fila => ({
                    stock_producto_id: fila.producto_id!,
                    tipo_operacion_id: fila.tipo_operacion_id!,
                    tipo_motivo_id: fila.tipo_motivo_id,
                    almacen_id: fila.almacen_id!,
                    cantidad: parseInt(String(fila.cantidad), 10),
                    observacion: fila.observacion,
                    proveedor_id: fila.proveedor_id,
                    cliente_id: fila.cliente_id,
                }));

                // Preparar datos para enviar al servidor
                const datos: DatosAjusteMasivo = {
                    nombre_archivo: archivoSeleccionado?.name || 'ajustes-masivos',
                    datos_csv: filasValidas.map(f => ({
                        producto: f.producto,
                        cantidad: f.cantidad,
                        tipo_operacion: f.tipo_operacion,
                        tipo_motivo: f.tipo_motivo,
                        almacen: f.almacen,
                        observacion: f.observacion,
                    })),
                    ajustes,
                    observacion_general: observacion,
                };

                // Procesar en el servidor
                const resultado = await ajustesService.procesarAjustesMasivos(datos);

                toast.success(`${resultado.procesados} ajustes procesados correctamente`);

                // Limpiar
                limpiar();

                return resultado;
            } catch (error) {
                const mensaje = error instanceof Error ? error.message : 'Error procesando ajustes';
                toast.error(mensaje);
                console.error('Error processing adjustments:', error);
                throw error;
            } finally {
                setCargando(false);
            }
        },
        [filasValidas, archivoSeleccionado]
    );

    /**
     * Limpiar estado
     */
    const limpiar = useCallback(() => {
        setArchivoSeleccionado(null);
        setFilasValidas([]);
        setResultadoValidacion(null);
        setDuplicadosDetectados([]);
        setPaso('carga');
        setProgreso(0);
    }, []);

    return {
        archivoSeleccionado,
        setArchivoSeleccionado,
        filasValidas,
        setFilasValidas,
        resultadoValidacion,
        duplicadosDetectados,
        cargando,
        progreso,
        setPaso,
        paso,
        detectarDuplicados,
        agruparDuplicados,
        resolverDuplicados,
        validarArchivo,
        procesarAjustes,
        limpiar,
    };
}
