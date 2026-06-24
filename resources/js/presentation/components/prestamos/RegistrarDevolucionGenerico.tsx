import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import ToastContainer from '@/presentation/components/ui/toast-container';
import { useToast } from '@/presentation/hooks/useToast';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import type { PrestamoCliente } from '@/domain/entities/prestamos';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import ModalAlmacenesDetalle from '@/presentation/components/modales/ModalAlmacenesDetalle';

export type TipoDevolucion = 'cliente' | 'evento' | 'proveedor';
export type TipoDocumentoImpresion = 'devoluciones-cliente' | 'devoluciones-evento' | 'devoluciones-proveedor';

interface RegistrarDevolucionGenericoProps {
    prestamo: PrestamoCliente | null;
    tipoDevolucion: TipoDevolucion;
    prestamoId: number;
    rutaRetorno?: string;
    titulo?: string;
    registrarDevolucionFn: (prestamoId: number, payload: any) => Promise<any>;  // ✅ OBLIGATORIO
}

interface DevolucionData {
    fecha_devolucion: string;
    monto_cobrado_daño_total: number;
    observaciones: string;
    detalles: Array<{
        [key: string]: any;  // ✅ Permite propiedades dinámicas (prestamo_cliente_detalle_id, prestamo_evento_detalle_id, etc)
        cantidad_devuelta?: number;
        cantidad_dañada_total?: number;
        cantidad_devuelta_original?: number;
        devolucion_almacenes?: Array<{
            almacenes_prestables_id: number;
            cantidad_devuelta?: number;
            cantidad_dañada_total?: number;
        }>;
    }>;
}

// ✅ NUEVO: Interfaz para rastrear devoluciones por almacén
interface DevolucionAlmacen {
    almacenes_prestables_id: number;
    cantidad_devuelta: number;
    cantidad_dañada_total: number;
}

// ✅ NUEVO: Helper para obtener el nombre dinámico de la propiedad según tipo de devolución
function getDetalleIdKey(tipoDevolucion: TipoDevolucion): string {
    switch (tipoDevolucion) {
        case 'cliente':
            return 'prestamo_cliente_detalle_id';
        case 'evento':
            return 'prestamo_evento_detalle_id';
        case 'proveedor':
            return 'prestamo_proveedor_detalle_id';
        default:
            return 'prestamo_cliente_detalle_id';
    }
}

// ✅ NUEVO: Helper para obtener el nombre de relación de devoluciones según tipo
function getDevolucionRelationKey(tipoDevolucion: TipoDevolucion): string {
    switch (tipoDevolucion) {
        case 'cliente':
            return 'devolucion_detalles';  // snake_case
        case 'evento':
            return 'devolucion_detalles';  // snake_case
        case 'proveedor':
            return 'devolucionDetalles';   // camelCase en la API de proveedores
        default:
            return 'devolucion_detalles';
    }
}

// ✅ NUEVO: Helper para obtener nombre y label dinámicos según tipo de préstamo
function getContratanteInfo(prestamo: any, tipoDevolucion: TipoDevolucion): { nombre: string; label: string } {
    switch (tipoDevolucion) {
        case 'cliente':
            return {
                nombre: prestamo.cliente?.nombre || prestamo.cliente?.razon_social || '—',
                label: 'Cliente'
            };
        case 'evento':
            return {
                nombre: prestamo.nombre_evento || '—',
                label: 'Evento'
            };
        case 'proveedor':
            return {
                nombre: prestamo.proveedor?.nombre || prestamo.proveedor?.razon_social || '—',
                label: 'Proveedor'
            };
        default:
            return {
                nombre: prestamo.cliente?.nombre || '—',
                label: 'Cliente'
            };
    }
}

export function RegistrarDevolucionGenerico({
    prestamo: initialPrestamo,
    tipoDevolucion,
    prestamoId,
    rutaRetorno = '/prestamos/clientes',
    titulo = 'Registrar Devolución',
    registrarDevolucionFn,
}: RegistrarDevolucionGenericoProps) {
    const { toasts, removeToast, error: toastError, success: toastSuccess } = useToast();

    // ✅ NUEVO: Obtener nombres dinámicos de propiedades
    const detalleIdKey = getDetalleIdKey(tipoDevolucion);
    const devolucionRelationKey = getDevolucionRelationKey(tipoDevolucion);

    const [prestamo, setPrestamo] = useState<PrestamoCliente | null>(initialPrestamo);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [devolucionCreada, setDevolucionCreada] = useState<any>(null);
    const [modalImpresionOpen, setModalImpresionOpen] = useState(false);

    // ✅ NUEVO: Estados para modal de almacenes en devoluciones
    const [mostrarModalAlmacenes, setMostrarModalAlmacenes] = useState(false);
    const [mostrarModalDanados, setMostrarModalDanados] = useState(false);
    const [detalleEnEdicion, setDetalleEnEdicion] = useState<any>(null);
    const [indexDetalleEnEdicion, setIndexDetalleEnEdicion] = useState<number | null>(null);
    const [devolucionesAlmacenes, setDevolucionesAlmacenes] = useState<Map<number, DevolucionAlmacen[]>>(new Map());
    const [devolucionesDanados, setDevolucionesDanados] = useState<Map<number, Array<{almacenes_prestables_id: number, cantidad_dañada_total: number}>>>(new Map());

    const [devolucionData, setDevolucionData] = useState<DevolucionData>({
        fecha_devolucion: new Date().toISOString().split('T')[0],
        monto_cobrado_daño_total: 0,
        observaciones: '',
        detalles: [],
    });

    useEffect(() => {
        if (prestamo?.detalles) {
            // ✅ MODIFICADO: NO auto-llenar almacenes
            // El usuario debe seleccionar explícitamente los almacenes en el modal
            // Si no selecciona, enviaremos devolucion_almacenes: [] (vacío)

            setDevolucionData(prev => ({
                ...prev,
                detalles: prestamo.detalles.map((d: any) => ({
                    [detalleIdKey]: d.id,  // ✅ DINÁMICO según tipo de devolución
                    cantidad_devuelta: 0,
                    cantidad_dañada_total: 0,
                    cantidad_devuelta_original: 0,
                })),
            }));
        }
    }, [prestamo]);

    // ✅ NUEVO: Funciones para manejar almacenes de devolución
    const handleEditarAlmacenesDev = (detalleIndex: number, detallePrestamo: any) => {
        // ✅ NUEVO: Solo abrir modal si hay MÚLTIPLES almacenes
        const cantidadAlmacenes = detallePrestamo.almacenes?.length || 0;
        if (cantidadAlmacenes <= 1) {
            console.log('ℹ️ Solo hay 1 almacén, no es necesario abrir modal');
            return;
        }

        setIndexDetalleEnEdicion(detalleIndex);
        setDetalleEnEdicion(detallePrestamo);

        // Cargar almacenes existentes de devolución si existen
        const almacenesExistentes = devolucionesAlmacenes.get(detallePrestamo.id) || [];

        // ✅ NUEVO: Calcular cantidad PENDIENTE (no total)
        const cantidadYaDevuelta = detallePrestamo.devolucion_detalles?.reduce(
            (sum: number, dev: any) => sum + (dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0),
            0
        ) || 0;
        const cantidadPendiente = (detallePrestamo.cantidad_prestada || 0) - cantidadYaDevuelta;

        console.log('🔓 Modal de Devolución Abierto (MÚLTIPLES ALMACENES):', {
            detalleId: detallePrestamo.id,
            cantidad_almacenes: cantidadAlmacenes,
            cantidad_total: detallePrestamo.cantidad_prestada,
            cantidad_ya_devuelta: cantidadYaDevuelta,
            cantidad_pendiente: cantidadPendiente,
            almacenesExistentes,
            almacenesDisponibles: detallePrestamo.almacenes || [],
        });

        setMostrarModalAlmacenes(true);
    };

    // ✅ NUEVO: Handler para editar dañados por almacén
    const handleEditarDanados = (detalleIndex: number, detallePrestamo: any) => {
        const cantidadAlmacenes = detallePrestamo.almacenes?.length || 0;
        if (cantidadAlmacenes <= 1) {
            console.log('ℹ️ Solo hay 1 almacén para dañados');
            return;
        }

        setIndexDetalleEnEdicion(detalleIndex);
        setDetalleEnEdicion(detallePrestamo);
        setMostrarModalDanados(true);
    };

    const handleGuardarDanados = (dañadosPorAlmacen: Array<{almacenes_prestables_id: number, cantidad_dañada_total: number}>) => {
        if (indexDetalleEnEdicion !== null && detalleEnEdicion) {
            const detalleId = detalleEnEdicion.id;
            const nuevosMapa = new Map(devolucionesDanados);

            // ✅ Filtrar valores undefined del array disperso
            const dañadosLimpios = dañadosPorAlmacen.filter(d => d !== undefined && d !== null);

            // Guardar dañados para este detalle
            nuevosMapa.set(detalleId, dañadosLimpios);
            setDevolucionesDanados(nuevosMapa);

            // Actualizar cantidad en devolucionData
            const dañadaTotal = dañadosLimpios.reduce((sum, a) => sum + (a?.cantidad_dañada_total || 0), 0);

            // ✅ NUEVO: Ajustar almacenes de devolución restando los dañados
            const almacenesActuales = devolucionesAlmacenes.get(detalleId) || [];
            const almacenesAjustados = almacenesActuales.map(alm => {
                const dañoAlmacen = dañadosLimpios.find(d => d.almacenes_prestables_id === alm.almacenes_prestables_id);
                const cantidadDañada = dañoAlmacen?.cantidad_dañada_total || 0;
                const cantidadDevueltaAjustada = Math.max(0, alm.cantidad_devuelta - cantidadDañada);

                return {
                    ...alm,
                    cantidad_devuelta: cantidadDevueltaAjustada,
                };
            });

            // Actualizar almacenes ajustados
            const mapAlmacenesActualizado = new Map(devolucionesAlmacenes);
            mapAlmacenesActualizado.set(detalleId, almacenesAjustados);
            setDevolucionesAlmacenes(mapAlmacenesActualizado);

            // Actualizar devolucionData con cantidades ajustadas
            const cantidadDevueltaAjustadaTotal = almacenesAjustados.reduce((sum, a) => sum + a.cantidad_devuelta, 0);

            setDevolucionData(prev => ({
                ...prev,
                detalles: prev.detalles.map(d =>
                    d[detalleIdKey] === detalleId
                        ? {
                            ...d,
                            cantidad_devuelta: cantidadDevueltaAjustadaTotal,
                            cantidad_dañada_total: dañadaTotal,
                            devolucion_almacenes: almacenesAjustados,
                        }
                        : d
                ),
            }));

            console.log('✅ Dañados por almacén guardados (con ajuste automático):', {
                detalleId,
                dañados: dañadosLimpios,
                almacenesAjustados,
                cantidadDevueltaAjustada: cantidadDevueltaAjustadaTotal,
            });

            setMostrarModalDanados(false);
            setDetalleEnEdicion(null);
            setIndexDetalleEnEdicion(null);
        }
    };

    const handleGuardarAlmacenesDev = (almacenesSeleccionados: DevolucionAlmacen[]) => {
        if (indexDetalleEnEdicion !== null && detalleEnEdicion) {
            const detalleId = detalleEnEdicion.id;
            const nuevosMapa = new Map(devolucionesAlmacenes);

            // Guardar almacenes para este detalle
            nuevosMapa.set(detalleId, almacenesSeleccionados);
            setDevolucionesAlmacenes(nuevosMapa);

            // Actualizar cantidad en devolucionData
            const cantidadTotal = almacenesSeleccionados.reduce((sum, a) => sum + a.cantidad_devuelta, 0);
            const dañadaTotal = almacenesSeleccionados.reduce((sum, a) => sum + a.cantidad_dañada_total, 0);

            // ✅ NUEVO: Si es CANASTILLA, actualizar EMBASE relacionado automáticamente
            let detallesActualizados = devolucionData.detalles.map(d => d);

            // Actualizar la canastilla por ID, no por índice
            detallesActualizados = detallesActualizados.map(d =>
                d[detalleIdKey] === detalleId
                    ? {
                        ...d,
                        cantidad_devuelta: cantidadTotal,
                        cantidad_dañada_total: dañadaTotal,
                        devolucion_almacenes: almacenesSeleccionados,
                    }
                    : d
            );

            if (detalleEnEdicion.prestable?.tipo === 'CANASTILLA') {
                const capacidadCanastilla = detalleEnEdicion.prestable?.capacidad || 0;
                const embaseRelacionado = prestamo?.detalles?.find((d: any) =>
                    d.prestable?.prestable_relacionado_id === detalleEnEdicion.prestable_id
                );

                if (embaseRelacionado) {
                    const cantidadEmbasesDevuelta = cantidadTotal * capacidadCanastilla;
                    const dañaEmbasesTotal = dañadaTotal * capacidadCanastilla;

                    // Crear almacenes de devolución para embases (mismos almacenes que canastilla)
                    const almacenesEmbase: DevolucionAlmacen[] = almacenesSeleccionados.map(a => ({
                        almacenes_prestables_id: a.almacenes_prestables_id,
                        cantidad_devuelta: Math.round((a.cantidad_devuelta / (cantidadTotal || 1)) * cantidadEmbasesDevuelta) || 0,
                        cantidad_dañada_total: Math.round((a.cantidad_dañada_total / (dañadaTotal || 1)) * dañaEmbasesTotal) || 0,
                    }));

                    // Guardar almacenes para embase también
                    nuevosMapa.set(embaseRelacionado.id, almacenesEmbase);
                    setDevolucionesAlmacenes(nuevosMapa);

                    // Actualizar embase en devolucionData por ID
                    detallesActualizados = detallesActualizados.map(d =>
                        d[detalleIdKey] === embaseRelacionado.id
                            ? {
                                ...d,
                                cantidad_devuelta: cantidadEmbasesDevuelta,
                                cantidad_dañada_total: dañaEmbasesTotal,
                                devolucion_almacenes: almacenesEmbase,
                            }
                            : d
                    );

                    console.log('✅ Canastilla + Embases actualizados:', {
                        canastilla_id: detalleId,
                        canastilla: detalleEnEdicion.prestable?.nombre,
                        cantidad_canastilla: cantidadTotal,
                        embase_id: embaseRelacionado.id,
                        embases: embaseRelacionado.prestable?.nombre,
                        cantidad_embases: cantidadEmbasesDevuelta,
                        almacenes: almacenesSeleccionados,
                    });
                }
            }

            setDevolucionData(prev => ({
                ...prev,
                detalles: detallesActualizados,
            }));

            console.log('✅ Almacenes de devolución guardados:', {
                detalleId,
                almacenes: almacenesSeleccionados,
            });

            setMostrarModalAlmacenes(false);
            setDetalleEnEdicion(null);
            setIndexDetalleEnEdicion(null);
        }
    };

    const obtenerMontoDanioTotal = (detalle: any): number => {
        const precios = Array.isArray(detalle?.prestable?.precios) ? detalle.prestable.precios : [];
        const precioDanio = precios.find((p: any) => {
            const tipoPrecio = String(p?.tipo_precio || '').toUpperCase().replace(/\s+/g, '_');
            return tipoPrecio === 'DAÑO_TOTAL' || (tipoPrecio.includes('DAÑO') && tipoPrecio.includes('TOTAL'));
        });
        if (precioDanio?.valor != null) {
            return Number(precioDanio.valor) || 0;
        }

        const condiciones = detalle?.prestable?.condiciones;
        if (!condiciones) return 0;

        if (Array.isArray(condiciones)) {
            const condicionActiva = condiciones.find((c: any) => Boolean(c?.activo)) || condiciones?.[0];
            return Number(condicionActiva?.monto_daño_total || 0);
        }

        return Number(condiciones?.monto_daño_total || 0);
    };

    // Calcular monto total de daños cuando cambian los detalles
    useEffect(() => {
        if (!prestamo) return;

        const montoTotalDanios = devolucionData.detalles.reduce((sum, det) => {
            const detallePrestamo = prestamo.detalles?.find((d: any) => d.id === det[detalleIdKey]);
            const montoDanioUnitario = obtenerMontoDanioTotal(detallePrestamo);
            return sum + (Number(det.cantidad_dañada_total || 0) * montoDanioUnitario);
        }, 0);

        if (Number(devolucionData.monto_cobrado_daño_total) !== Number(montoTotalDanios)) {
            setDevolucionData(prev => ({
                ...prev,
                monto_cobrado_daño_total: Number(montoTotalDanios.toFixed(2)),
            }));
        }
    }, [devolucionData.detalles, prestamo]);

    // ✅ NUEVO: Helper para distribuir cantidad secuencialmente entre almacenes (FIFO)
    const distribuirSecuencialmente = (
        almacenesDelDetalle: any[],
        cantidadDevuelta: number,
        cantidadDanada: number
    ): DevolucionAlmacen[] => {
        if (!almacenesDelDetalle || almacenesDelDetalle.length === 0) {
            return [];
        }

        const devolucionAlmacenes: DevolucionAlmacen[] = [];
        let cantidadRestante = cantidadDevuelta;

        // Distribuir cantidad a devolver SECUENCIALMENTE entre almacenes (FIFO)
        for (const almacen of almacenesDelDetalle) {
            if (cantidadRestante <= 0) break;

            const cantidadPrestada = almacen.cantidad as number;
            const cantidadDeEsteAlmacen = Math.min(cantidadRestante, cantidadPrestada);

            devolucionAlmacenes.push({
                almacenes_prestables_id: almacen.almacenes_prestables_id,
                cantidad_devuelta: cantidadDeEsteAlmacen,
                cantidad_dañada_total: 0, // Se asignará al último almacén
            });

            cantidadRestante -= cantidadDeEsteAlmacen;
        }

        // ✅ Asignar dañadas al ÚLTIMO almacén que recibió devoluciones
        if (cantidadDanada > 0 && devolucionAlmacenes.length > 0) {
            devolucionAlmacenes[devolucionAlmacenes.length - 1].cantidad_dañada_total = cantidadDanada;
        }

        return devolucionAlmacenes;
    };

    const handleRegistrarDevolucion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prestamo || devolucionData.detalles.length === 0) return;

        setSubmitting(true);
        try {
            const payload = {
                fecha_devolucion: devolucionData.fecha_devolucion,
                monto_cobrado_daño_total: devolucionData.monto_cobrado_daño_total,
                observaciones: devolucionData.observaciones,
                almacenes_prestables_id: prestamo?.almacenes_prestables_id,
                detalles: devolucionData.detalles.map((d) => {
                    const detallePrestamo = prestamo.detalles?.find((det: any) => det.id === d[detalleIdKey]);
                    const montoDanioUnitario = obtenerMontoDanioTotal(detallePrestamo);
                    const cantidadDanada = Number(d.cantidad_dañada_total || 0);
                    const cantidadDevuelta = Number(d.cantidad_devuelta || 0);
                    const montoDano = cantidadDanada * montoDanioUnitario;

                    // Validación: cantidad_devuelta es lo en BUEN ESTADO (no incluye dañadas)
                    // Si usuario ingresa cantidad_devuelta sin separar, esto lo marca como error
                    const cantidadTotal = cantidadDevuelta + cantidadDanada;

                    console.log(`📋 Detalle ${d[detalleIdKey]}:`, {
                        cantidad_devuelta_buen_estado: cantidadDevuelta,
                        cantidad_dañada_total: cantidadDanada,
                        total: cantidadTotal,
                        detallePrestamo_almacenes: detallePrestamo?.almacenes,
                    });

                    // ✅ MODIFICADO: Si el usuario seleccionó almacenes manualmente, usar esos
                    let almacenesDev = devolucionesAlmacenes.get(d[detalleIdKey]);
                    const dañadosDev = devolucionesDanados.get(d[detalleIdKey]);

                    // Si el usuario NO seleccionó almacenes manualmente pero HAY múltiples almacenes en el detalle
                    // Hacer distribución secuencial automática (FIFO)
                    if (!almacenesDev && detallePrestamo?.almacenes && detallePrestamo.almacenes.length > 0) {
                        if (cantidadDevuelta > 0 || cantidadDanada > 0) {
                            almacenesDev = distribuirSecuencialmente(
                                detallePrestamo.almacenes,
                                cantidadDevuelta,
                                cantidadDanada
                            );

                            console.log(`✅ [FIFO Automático] Detalle ${d[detalleIdKey]}:`, {
                                almacenes_distribuidos: almacenesDev,
                                cantidad_devuelta: cantidadDevuelta,
                                cantidad_dañada: cantidadDanada,
                            });
                        }
                    }

                    // Si hay dañados por almacén, combinar con almacenes de devolución
                    if (dañadosDev && dañadosDev.length > 0 && almacenesDev) {
                        almacenesDev = almacenesDev.map(alm => {
                            const dañoAlmacen = dañadosDev.find(d => d.almacenes_prestables_id === alm.almacenes_prestables_id);
                            return {
                                ...alm,
                                cantidad_dañada_total: dañoAlmacen?.cantidad_dañada_total || 0,
                            };
                        });
                    } else if (dañadosDev && dañadosDev.length > 0) {
                        // ✅ Si solo hay dañados sin almacenes especificados
                        // Distribuir cantidad_devuelta entre los almacenes con dañados
                        almacenesDev = dañadosDev.map((dañoAlm) => ({
                            almacenes_prestables_id: dañoAlm.almacenes_prestables_id,
                            cantidad_devuelta: cantidadDevuelta > 0 ? Math.round(cantidadDevuelta / dañadosDev.length) : 0,
                            cantidad_dañada_total: dañoAlm.cantidad_dañada_total,
                        }));
                    }

                    return {
                        [detalleIdKey]: d[detalleIdKey],  // ✅ DINÁMICO
                        cantidad_devuelta: cantidadDevuelta,
                        cantidad_dañada_parcial: 0,
                        cantidad_dañada_total: cantidadDanada,
                        monto_cobrado_daño: montoDano,
                        devolucion_almacenes: almacenesDev || [],
                    };
                }),
            };

            console.log('%c📤 DEVOLUCIÓN - ENVIANDO AL BACKEND', 'color: #0066cc; font-weight: bold; font-size: 14px');
            console.log('%c=== CABECERA ===', 'color: #00aa00; font-weight: bold');
            console.log({
                fecha_devolucion: payload.fecha_devolucion,
                almacenes_prestables_id: payload.almacenes_prestables_id,
                monto_cobrado_daño_total: payload.monto_cobrado_daño_total,
                observaciones: payload.observaciones,
            });
            console.log('%c=== DETALLES ===', 'color: #00aa00; font-weight: bold');
            payload.detalles.forEach((det, idx) => {
                console.log(`%c  Detalle ${idx + 1}:`, 'color: #ff6600; font-weight: bold', {
                    [detalleIdKey]: det[detalleIdKey],  // ✅ DINÁMICO
                    cantidad_devuelta: det.cantidad_devuelta,
                    cantidad_dañada_total: det.cantidad_dañada_total,  // ✅ Mostrar nombre correcto
                    almacenes_devolución: det.devolucion_almacenes || [],
                });
            });
            console.log('%c📤 PAYLOAD COMPLETO', 'color: #aa00aa; font-weight: bold');
            console.log(payload);

            const respuesta = await registrarDevolucionFn(prestamo.id, payload);
            toastSuccess('✅ Devolución registrada exitosamente');

            // Guardar la devolución creada y abrir modal de impresión
            setDevolucionCreada(respuesta);
            setModalImpresionOpen(true);
        } catch (error: any) {
            // Si hay errores de validación, mostrarlos explícitamente
            const errores = error?.response?.data?.errores;
            if (errores && Array.isArray(errores) && errores.length > 0) {
                const mensajeDetallado = errores.map((e: string, idx: number) => `${idx + 1}. ${e}`).join('\n');
                toastError(`❌ Validación fallida:\n${mensajeDetallado}`);
            } else {
                const mensajeError = error?.message || error?.response?.data?.message || 'Error al registrar devolución';
                toastError(`❌ ${mensajeError}`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (!prestamo) {
        return (
            <AppLayout>
                <div className="p-6">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error || 'No se pudo cargar el préstamo'}</span>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const detalles = prestamo.detalles || [];
    const tipoDocumentoImpresion: TipoDocumentoImpresion =
        tipoDevolucion === 'cliente' ? 'devoluciones-cliente' :
        tipoDevolucion === 'evento' ? 'devoluciones-evento' :
        'devoluciones-proveedor';

    return (
        <AppLayout>
            <Head title={titulo} />

            <div className="space-y-6 p-6">
                {/* Encabezado */}
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {titulo}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {getContratanteInfo(prestamo, tipoDevolucion).nombre}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Información del Préstamo */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Card className="p-1">
                        <CardHeader>
                            <CardTitle className="text-xs">Número de Préstamo</CardTitle>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                #{prestamo.id}
                            </p>
                        </CardHeader>
                    </Card>
                    <Card className="p-1">
                        <CardHeader>
                            <CardTitle className="text-xs">{getContratanteInfo(prestamo, tipoDevolucion).label}</CardTitle>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {getContratanteInfo(prestamo, tipoDevolucion).nombre}
                            </p>
                        </CardHeader>
                    </Card>
                    <Card className="p-1">
                        <CardHeader>
                            <CardTitle className="text-xs">Garantía</CardTitle>
                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                Bs {Number(prestamo.monto_garantia || 0).toFixed(2)}
                            </p>
                        </CardHeader>
                    </Card>
                    <Card className="p-1">
                        <CardHeader>
                            <CardTitle className="text-xs">🏭 Almacén</CardTitle>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {prestamo.almacen?.nombre || 'Sin almacén'}
                            </p>
                        </CardHeader>
                    </Card>
                </div>

                {/* Formulario de Devoluciones */}
                <form onSubmit={handleRegistrarDevolucion} className="space-y-6">
                    {/* Campos de Devolución */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de Devolución</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Monto a Pagar */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        💰 Monto Total a Pagar por Daños
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={devolucionData.monto_cobrado_daño_total}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                                    />
                                </div>

                                {/* Fecha Devolución */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Fecha Devolución *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={devolucionData.fecha_devolucion}
                                        onChange={(e) =>
                                            setDevolucionData({
                                                ...devolucionData,
                                                fecha_devolucion: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Observaciones */}
                                <div>
                                    <label className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Observaciones
                                    </label>
                                    <textarea
                                        value={devolucionData.observaciones}
                                        onChange={(e) =>
                                            setDevolucionData({
                                                ...devolucionData,
                                                observaciones: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabla de Devoluciones */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles de Devolución</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                💡 <strong>Instrucciones:</strong> Ingresa cuántas unidades devuelves en BUEN ESTADO en "Devolviendo" y cuántas están DAÑADAS en "Dañado". El total no puede exceder lo que falta devolver.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
                                            <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">📦 Prestable</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">📏 Capacidad</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">📤 Prestado</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">✅ Ya Devuelto</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">⏳ Falta Devolver</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">✏️ Devolviendo (Buen Estado)</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">🚫 Dañado (Total)</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">💸 Daño unit.</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">💳 Total a Cobrar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detalles.map((detalle: any) => {
                                            const detalleAct = devolucionData.detalles.find(d => d[detalleIdKey] === detalle.id);

                                            const condiciones = detalle?.prestable?.condiciones;
                                            const montoDanioUnitario = obtenerMontoDanioTotal(detalle);

                                            const montoDanioFila = Number(detalleAct?.cantidad_dañada_total || 0) * montoDanioUnitario;

                                            return (
                                                <tr key={detalle.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-3 py-2 text-gray-900 dark:text-white font-medium">
                                                        {detalle.prestable?.nombre}
                                                    </td>
                                                    <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">
                                                        <p>{detalle.prestable?.capacidad || '1'}</p>
                                                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                                            {detalle.prestable?.tipo || '—'}
                                                        </span>
                                                    </td>
                                                    {/* ✅ NUEVO: Mostrar cantidad prestada + almacenes pequeños */}
                                                    <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">
                                                        {/* <p className="font-semibold mb-2">{detalle.cantidad_prestada}</p> */}
                                                        {detalle.almacenes && detalle.almacenes.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {detalle.almacenes.map((a: any, idx: number) => (
                                                                    <div key={idx} className="text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                                                        {a.almacen?.nombre || `Almacén #${a.almacenes_prestables_id}`}
                                                                        <span className="text-gray-600 dark:text-gray-400"> ({a.cantidad})</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        <span className="inline-block px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold">
                                                            {detalle[devolucionRelationKey]?.reduce((sum: number, dev: any) => sum + (dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0), 0) || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        <span className="inline-block px-2 py-1 rounded bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 font-semibold">
                                                            {Math.max(0, (detalle.cantidad_prestada || 0) - (detalle[devolucionRelationKey]?.reduce((sum: number, dev: any) => sum + (dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0), 0) || 0))}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={detalleAct?.cantidad_devuelta || ''}
                                                                placeholder="0"
                                                                onChange={(e) => {
                                                                    const cantidad = e.target.value === '' ? 0 : Number(e.target.value);
                                                                    const cantidadDaniadaActual = detalleAct?.cantidad_dañada_total || 0;
                                                                    const faltaDevolver = (detalle.cantidad_prestada || 0) - (detalle[devolucionRelationKey]?.reduce((sum: number, dev: any) => sum + (dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0), 0) || 0);

                                                                    // Si el total excede lo disponible, no permitir
                                                                    const totalAhora = cantidad + cantidadDaniadaActual;
                                                                    let cantidadValidada = cantidad;
                                                                    if (totalAhora > faltaDevolver) {
                                                                        cantidadValidada = Math.max(0, faltaDevolver - cantidadDaniadaActual);
                                                                    }

                                                                    console.log(`📝 [Devolviendo] Detalle ${detalle.id}:`, {
                                                                        cantidad_ingresada: cantidad,
                                                                        cantidad_validada: cantidadValidada,
                                                                        cantidad_dañada_actual: cantidadDaniadaActual,
                                                                        total_ahora: totalAhora,
                                                                        falta_devolver: faltaDevolver,
                                                                    });

                                                                    let detallesActualizados = devolucionData.detalles.map(d =>
                                                                        d[detalleIdKey] === detalle.id
                                                                            ? { ...d, cantidad_devuelta: cantidadValidada, cantidad_devuelta_original: cantidadValidada }
                                                                            : d
                                                                    );

                                                                    // Si es CANASTILLA, actualizar el embase relacionado automáticamente
                                                                    if (detalle.prestable?.tipo === 'CANASTILLA') {
                                                                        const capacidadCanastilla = detalle.prestable?.capacidad || 0;
                                                                        const detalleEmbase = prestamo?.detalles?.find((d: any) =>
                                                                            d.prestable?.prestable_relacionado_id === detalle.prestable_id
                                                                        );

                                                                        if (detalleEmbase) {
                                                                            const cantidadEmbases = cantidadValidada * capacidadCanastilla;
                                                                            detallesActualizados = detallesActualizados.map(d =>
                                                                                d[detalleIdKey] === detalleEmbase.id
                                                                                    ? { ...d, cantidad_devuelta: cantidadEmbases, cantidad_devuelta_original: cantidadEmbases }
                                                                                    : d
                                                                            );
                                                                        }
                                                                    }

                                                                    setDevolucionData({
                                                                        ...devolucionData,
                                                                        detalles: detallesActualizados,
                                                                    });
                                                                }}
                                                                className="w-full px-2 py-1 border border-blue-400 dark:border-blue-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center font-bold focus:ring-2 focus:ring-blue-500"
                                                            />
                                                            {detalle.almacenes && detalle.almacenes.length > 1 ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEditarAlmacenesDev(devolucionData.detalles.indexOf(detalleAct!), detalle)}
                                                                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 font-medium transition"
                                                                >
                                                                    🏭 Distribuir
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    </td>
                                                    {/* ✅ NUEVO: Input de dañados + botón para distribuir si hay múltiples almacenes */}
                                                    <td className="px-3 py-2 text-center">
                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                placeholder="0"
                                                                value={detalleAct?.cantidad_dañada_total || ''}
                                                                onChange={(e) => {
                                                                    const cantidadDanada = e.target.value === '' ? 0 : Number(e.target.value);
                                                                    const cantidadDevueltaOriginal = detalleAct?.cantidad_devuelta_original || 0;

                                                                    // Restar daño del ORIGINAL: si ingresaste 2400 total y 400 están dañados, quedan 2000 en buen estado
                                                                    const cantidadDevueltaAjustada = Math.max(0, cantidadDevueltaOriginal - cantidadDanada);

                                                                    console.log(`🚫 [Dañado] Detalle ${detalle.id}:`, {
                                                                        dañado_ingresado: cantidadDanada,
                                                                        devolviendo_original: cantidadDevueltaOriginal,
                                                                        devolviendo_ajustado: cantidadDevueltaAjustada,
                                                                        total: cantidadDevueltaAjustada + cantidadDanada,
                                                                    });

                                                                    let detallesActualizados = devolucionData.detalles.map(d =>
                                                                        d[detalleIdKey] === detalle.id
                                                                            ? { ...d, cantidad_dañada_total: cantidadDanada, cantidad_devuelta: cantidadDevueltaAjustada }
                                                                            : d
                                                                    );

                                                                    // Si es CANASTILLA, actualizar el embase relacionado automáticamente
                                                                    if (detalle.prestable?.tipo === 'CANASTILLA') {
                                                                        const capacidadCanastilla = detalle.prestable?.capacidad || 0;
                                                                        const detalleEmbase = prestamo?.detalles?.find((d: any) =>
                                                                            d.prestable?.prestable_relacionado_id === detalle.prestable_id
                                                                        );

                                                                        if (detalleEmbase) {
                                                                            const embasesDanados = cantidadDanada * capacidadCanastilla;
                                                                            const embasesDevueltos = cantidadDevueltaAjustada * capacidadCanastilla;
                                                                            detallesActualizados = detallesActualizados.map(d =>
                                                                                d[detalleIdKey] === detalleEmbase.id
                                                                                    ? { ...d, cantidad_dañada_total: embasesDanados, cantidad_devuelta: embasesDevueltos }
                                                                                    : d
                                                                            );
                                                                        }
                                                                    }

                                                                    setDevolucionData({
                                                                        ...devolucionData,
                                                                        detalles: detallesActualizados,
                                                                    });
                                                                }}
                                                                className="w-full px-2 py-1 border border-red-400 dark:border-red-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-red-500"
                                                            />
                                                            {detalle.almacenes && detalle.almacenes.length > 1 ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEditarDanados(devolucionData.detalles.indexOf(detalleAct!), detalle)}
                                                                    className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 font-medium transition"
                                                                >
                                                                    🚫 Distribuir
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 text-center text-blue-700 dark:text-blue-300 font-semibold">
                                                        Bs {montoDanioUnitario.toFixed(2)}
                                                    </td>
                                                    <td className="px-3 py-2 text-center font-bold">
                                                        <div className={montoDanioFila > (prestamo.monto_garantia || 0) ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}>
                                                            Bs {montoDanioFila.toFixed(2)}
                                                            {montoDanioFila > (prestamo.monto_garantia || 0) && (
                                                                <div className="text-xs text-red-600">
                                                                    +Bs {(montoDanioFila - (prestamo.monto_garantia || 0)).toFixed(2)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Resumen de Garantía vs Daño */}
                            {detalles.length > 0 && (
                                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-3">📊 Resumen Financiero</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-3 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">Garantía Original</p>
                                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-1">
                                                Bs {Number(prestamo?.monto_garantia || 0).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="p-3 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                            <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase">Total Daño a Cobrar</p>
                                            <p className="text-2xl font-bold text-red-900 dark:text-red-200 mt-1">
                                                Bs {Number(devolucionData.monto_cobrado_daño_total || 0).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className={`p-3 rounded border ${
                                            Number(devolucionData.monto_cobrado_daño_total || 0) > Number(prestamo?.monto_garantia || 0)
                                                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                                                : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                        }`}>
                                            <p className={`text-xs font-medium uppercase ${
                                                Number(devolucionData.monto_cobrado_daño_total || 0) > Number(prestamo?.monto_garantia || 0)
                                                    ? 'text-orange-600 dark:text-orange-400'
                                                    : 'text-green-600 dark:text-green-400'
                                            }`}>
                                                {Number(devolucionData.monto_cobrado_daño_total || 0) > Number(prestamo?.monto_garantia || 0) ? 'Exceso a Cobrar' : 'Garantía Suficiente'}
                                            </p>
                                            <p className={`text-2xl font-bold mt-1 ${
                                                Number(devolucionData.monto_cobrado_daño_total || 0) > Number(prestamo?.monto_garantia || 0)
                                                    ? 'text-orange-900 dark:text-orange-200'
                                                    : 'text-green-900 dark:text-green-200'
                                            }`}>
                                                Bs {Math.max(0, Number(devolucionData.monto_cobrado_daño_total || 0) - Number(prestamo?.monto_garantia || 0)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Botones */}
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                            disabled={submitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {submitting ? 'Registrando...' : 'Registrar Devolución'}
                        </Button>
                    </div>
                </form>

                <ToastContainer toasts={toasts} removeToast={removeToast} />

                {/* Modal de Impresión */}
                <OutputSelectionModal
                    isOpen={modalImpresionOpen}
                    onClose={() => {
                        setModalImpresionOpen(false);
                        setTimeout(() => {
                            window.location.href = rutaRetorno;
                        }, 500);
                    }}
                    documentoId={prestamo?.id || 0}
                    tipoDocumento={tipoDocumentoImpresion}
                    documentoInfo={{
                        numero: `Devolución #${devolucionCreada?.id}`,
                        fecha: devolucionCreada?.fecha_devolucion,
                        monto: devolucionCreada?.monto_cobrado_daño_total,
                    }}
                />

                {/* ✅ NUEVO: Modal para especificar almacenes de devolución */}
                {mostrarModalAlmacenes && detalleEnEdicion && (() => {
                    // ✅ Calcular cantidad PENDIENTE (para devoluciones parciales)
                    const cantidadYaDevuelta = detalleEnEdicion.devolucion_detalles?.reduce(
                        (sum: number, dev: any) => sum + (dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0),
                        0
                    ) || 0;
                    const cantidadPendiente = Math.max(0, (detalleEnEdicion.cantidad_prestada || 0) - cantidadYaDevuelta);

                    // ✅ NUEVO: Si es canastilla, obtener embase relacionado
                    const esCanastilla = detalleEnEdicion.prestable?.tipo === 'CANASTILLA';
                    let embaseRelacionado = null;
                    if (esCanastilla) {
                        embaseRelacionado = prestamo?.detalles?.find((d: any) =>
                            d.prestable?.prestable_relacionado_id === detalleEnEdicion.prestable_id
                        );
                    }

                    return (
                        <ModalAlmacenesDetalle
                            isOpen={mostrarModalAlmacenes}
                            onClose={() => {
                                setMostrarModalAlmacenes(false);
                                setDetalleEnEdicion(null);
                                setIndexDetalleEnEdicion(null);
                            }}
                            onSave={(almacenesSeleccionados) => {
                                // ✅ Convertir de AlmacenItem a DevolucionAlmacen
                                const devolucionAlmacenes: DevolucionAlmacen[] = almacenesSeleccionados.map(a => ({
                                    almacenes_prestables_id: a.almacenes_prestables_id,
                                    cantidad_devuelta: a.cantidad,
                                    cantidad_dañada_total: 0, // Por ahora, 0 dañados en cada almacén
                                }));
                                handleGuardarAlmacenesDev(devolucionAlmacenes);
                            }}
                            prestableNombre={detalleEnEdicion.prestable?.nombre || 'Prestable'}
                            cantidadTotal={cantidadPendiente}
                            almacenes={detalleEnEdicion.almacenes?.map((a: any) => ({
                                id: a.almacenes_prestables_id,
                                nombre: a.almacen?.nombre || `Almacén #${a.almacenes_prestables_id}`,
                            })) || []}
                            stockDisponible={detalleEnEdicion.almacenes?.map((a: any) => ({
                                almacenes_prestables_id: a.almacenes_prestables_id,
                                cantidad_disponible: a.cantidad || 0,
                            })) || []}
                            almacenesActuales={
                                devolucionesAlmacenes.get(detalleEnEdicion.id)?.map(a => ({
                                    almacenes_prestables_id: a.almacenes_prestables_id,
                                    cantidad: a.cantidad_devuelta,
                                })) || []
                            }
                            esCanastilla={esCanastilla}
                            capacidadCanastilla={detalleEnEdicion.prestable?.capacidad || 0}
                            embaseNombre={embaseRelacionado?.prestable?.nombre || ''}
                            embaseStockDisponible={embaseRelacionado?.almacenes?.map((a: any) => ({
                                almacenes_prestables_id: a.almacenes_prestables_id,
                                cantidad_disponible: a.cantidad || 0,
                            })) || []}
                        />
                    );
                })()}

                {/* ✅ NUEVO: Modal para especificar dañados por almacén */}
                {mostrarModalDanados && detalleEnEdicion && (() => {
                    const dañadosActuales = devolucionesDanados.get(detalleEnEdicion.id) || [];
                    const dañadosTotal = detalleEnEdicion.almacenes?.reduce((sum: number) => sum, 0) || 0;

                    return (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                                <div className="p-6 space-y-4">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        🚫 Distribuir Dañados - {detalleEnEdicion.prestable?.nombre}
                                    </h2>

                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Total de dañados: <strong>{detalleEnEdicion.almacenes?.reduce((sum: number) => sum, 0) || 0}</strong>
                                    </p>

                                    <div className="space-y-3">
                                        {detalleEnEdicion.almacenes?.map((almacen: any, idx: number) => {
                                            const dañoActual = dañadosActuales[idx]?.cantidad_dañada_total || 0;
                                            return (
                                                <div key={idx} className="border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {almacen.almacen?.nombre || `Almacén #${almacen.almacenes_prestables_id}`}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={almacen.cantidad}
                                                        value={dañoActual}
                                                        onChange={(e) => {
                                                            const nuevasCantidades = [...dañadosActuales];
                                                            nuevasCantidades[idx] = {
                                                                almacenes_prestables_id: almacen.almacenes_prestables_id,
                                                                cantidad_dañada_total: Number(e.target.value) || 0,
                                                            };
                                                            setDevolucionesDanados(new Map(devolucionesDanados).set(detalleEnEdicion.id, nuevasCantidades));
                                                        }}
                                                        className="w-full mt-1 px-2 py-1 border border-red-400 dark:border-red-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center font-bold focus:ring-2 focus:ring-red-500"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Disponibles: {almacen.cantidad}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex gap-2 justify-end pt-4 border-t border-gray-300 dark:border-gray-600">
                                        <button
                                            onClick={() => {
                                                setMostrarModalDanados(false);
                                                setDetalleEnEdicion(null);
                                                setIndexDetalleEnEdicion(null);
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={() => {
                                                const dañados = devolucionesDanados.get(detalleEnEdicion.id) || [];
                                                handleGuardarDanados(dañados);
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </AppLayout>
    );
}
