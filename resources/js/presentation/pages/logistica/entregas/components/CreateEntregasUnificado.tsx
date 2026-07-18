import { useEntregaBatch } from '@/application/hooks/use-entrega-batch';
import { useVehiculoRecomendado } from '@/application/hooks/use-vehiculo-recomendado';
import type { ChoferEntrega, VehiculoCompleto, VentaConDetalles } from '@/domain/entities/entregas';
import type { Id } from '@/domain/entities/shared';
import { VehicleRecommendationCard } from '@/presentation/components/entrega/VehicleRecommendationCard';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Package, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BatchVentaSelector from './BatchVentaSelector';
import ConsolidacionAutomaticaModal from './ConsolidacionAutomaticaModal';

interface Entrega {
    id: number;
    numero_entrega: string;
    estado: string;
    fecha_programada: string;
    vehiculo_id?: number;
    chofer_id?: number;
    entregador_id?: number;
    peso_kg?: number;
    volumen_m3?: number;
}

interface CreateEntregasUnificadoProps {
    modo?: 'crear' | 'editar';
    entrega?: Entrega;
    ventas: VentaConDetalles[];
    ventasAsignadas?: VentaConDetalles[];
    vehiculos: VehiculoCompleto[];
    choferes: ChoferEntrega[];
    ventaPreseleccionada?: number;
    paginacion?: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        has_more: boolean;
    };
    onCancel?: () => void;
}

/**
 * Presentación: Componente Unificado de Creación de Entregas
 *
 * ARQUITECTURA LIMPIA - Responsabilidades por capa:
 *
 * ✅ PRESENTACIÓN (Este archivo):
 *   - UI layout y renderizado
 *   - Gestión de estado de selección
 *   - Delegación a hooks de application
 *   - Mostrar estados y errores
 *
 * ✅ APPLICATION (Hooks):
 *   - use-entregas-create.ts: Lógica para 1 venta
 *   - use-entrega-batch.ts: Lógica para 2+ ventas
 *   - Validación de negocio
 *   - Orquestación de servicios
 *   - Manejo de navegación
 *
 * ✅ INFRASTRUCTURE (Servicios):
 *   - entregas.service.ts: URLs y operaciones HTTP
 *   - logistica.service.ts: Operaciones complejas
 *   - Abstracción de HTTP
 *
 * ✅ DOMAIN (Tipos):
 *   - Tipos de Entrega, VentaConDetalles, etc.
 *   - Sin lógica, solo contratos
 *
 * Layout:
 * - Panel Izquierdo (4/12): BatchVentaSelector sticky
 * - Panel Derecho (8/12): renderDynamicFormPanel()
 *   - 0 ventas: Mensaje instructivo
 *   - 1+ ventas: BatchUI unificado con VehicleRecommendationCard
 *     - Para 1 venta: Muestra opciones adicionales (fecha, dirección)
 *     - Para 2+ ventas: Muestra recomendación inteligente
 * - Footer Sticky: Solo cuando hay ≥1 venta seleccionada
 */
export default function CreateEntregasUnificado({
    modo = 'crear',
    entrega,
    ventas,
    ventasAsignadas = [],
    vehiculos,
    choferes,
    ventaPreseleccionada,
    paginacion,
    onCancel,
}: CreateEntregasUnificadoProps) {
    const isEditMode = modo === 'editar';

    // 🔍 LOG: Ventas recibidas del backend
    console.log('📥 [CreateEntregasUnificado] Ventas recibidas del backend:', {
        total: ventas.length,
        ids: ventas.map((v) => v.id),
        ventaPreseleccionada,
        contiene_preseleccionada: ventaPreseleccionada ? ventas.some((v) => v.id === ventaPreseleccionada) : 'N/A',
        primera_venta: ventas[0],
    });
    // Estado de selección de ventas
    // Usar Id en lugar de number para ser compatible con VentaConDetalles.id
    const [selectedVentaIds, setSelectedVentaIds] = useState<Id[]>(ventaPreseleccionada ? [ventaPreseleccionada] : []);

    // Estado del modal de consolidación automática
    const [isConsolidacionModalOpen, setIsConsolidacionModalOpen] = useState(false);

    // ✅ NUEVO: Estado para OutputSelectionModal de entregas
    const [showOutputSelection, setShowOutputSelection] = useState(false);
    const [entregaParaImprimir, setEntregaParaImprimir] = useState<any>(null);

    // ✅ NUEVO: Estado para almacenar resultados de búsqueda desde BatchVentaSelector
    const [searchResults, setSearchResults] = useState<VentaConDetalles[]>([]);

    // ✅ NUEVO: Estado para acumular ventas seleccionadas (PERSISTE entre búsquedas)
    const [ventasAcumuladas, setVentasAcumuladas] = useState<VentaConDetalles[]>([]);

    // ✅ NUEVO: Estado para controlar si el carrito está expandido
    const [isCarritoExpanded, setIsCarritoExpanded] = useState(false);

    // Hooks para batch (2+ ventas)
    const {
        formData,
        isSubmitting,
        submitError,
        successMessage,
        updateFormData,
        handleSubmit: handleSubmitBatch,
    } = useEntregaBatch(modo, entrega?.id);

    // Memoized callbacks para vehicle recommendation
    // Estos callbacks deben ser estables para que el useEffect en VehicleRecommendationCard funcione correctamente
    const handleSelectVehiculo = useCallback(
        (vehiculoId: Id) => {
            console.log('📍 Actualizando vehiculo_id:', vehiculoId);
            updateFormData({ vehiculo_id: vehiculoId });
        },
        [updateFormData],
    );

    const handleSelectChofer = useCallback(
        (choferId: Id) => {
            console.log('👤 Actualizando chofer_id:', choferId);
            updateFormData({ chofer_id: choferId });
        },
        [updateFormData],
    );

    const handleSelectEntregador = useCallback(
        (entregadorId: Id) => {
            console.log('📦 Actualizando entregador_id:', entregadorId);
            updateFormData({ entregador_id: entregadorId });
        },
        [updateFormData],
    );

    // Hook para recomendación de vehículo (batch mode)
    // ⚠️ En edit mode, NO usar el hook porque el backend ya envía peso_kg + ventas asignadas
    // ✅ MEJORADO: Combinar ventas iniciales + resultados de búsqueda
    const allVentasForHook = useMemo(() => {
        const combined = [...ventas, ...searchResults];
        // Remover duplicados
        return Array.from(new Map(combined.map((v) => [v.id, v])).values());
    }, [ventas, searchResults]);

    const hookResult = isEditMode
        ? {
              recomendado: null,
              disponibles: [],
              pesoTotal: 0,
              isLoading: false,
              error: null,
              alerta: null,
          }
        : useVehiculoRecomendado(
              selectedVentaIds,
              allVentasForHook, // ✅ MEJORADO: Usar ventas + resultados de búsqueda
              true, // Auto-select recomendado
              handleSelectVehiculo,
          );

    const {
        recomendado,
        disponibles,
        pesoTotal: pesoRecomendacion,
        isLoading: loadingRecomendacion,
        error: errorRecomendacion,
        alerta: alertaRecomendacion,
    } = hookResult;

    // Auto-seleccionar vehículo cuando se carga la recomendación
    useEffect(() => {
        if (recomendado && !formData.vehiculo_id) {
            console.log('✅ Auto-seleccionando vehículo recomendado:', {
                vehiculo: {
                    id: recomendado.id,
                    placa: recomendado.placa,
                    marca: recomendado.marca,
                    modelo: recomendado.modelo,
                    capacidad_kg: recomendado.capacidad_kg,
                    porcentaje_uso: recomendado.porcentaje_uso,
                },
                peso_total: pesoRecomendacion,
            });
            handleSelectVehiculo(recomendado.id);
        }
    }, [recomendado?.id, formData.vehiculo_id, handleSelectVehiculo, pesoRecomendacion, searchResults]);

    // Auto-seleccionar chofer cuando se carga la recomendación y hay un choferAsignado
    useEffect(() => {
        if (recomendado?.choferAsignado && !formData.chofer_id) {
            console.log('✅ Auto-seleccionando chofer:', {
                id: recomendado.choferAsignado.id,
                nombre: recomendado.choferAsignado.nombre || recomendado.choferAsignado.name,
                telefono: recomendado.choferAsignado.telefono,
            });
            handleSelectChofer(recomendado.choferAsignado.id);
        }
    }, [recomendado?.choferAsignado?.id, formData.chofer_id, handleSelectChofer]);

    // Sincronizar selectedVentaIds con formData.venta_ids para que el submit funcione
    useEffect(() => {
        updateFormData({ venta_ids: selectedVentaIds });
    }, [selectedVentaIds]);

    // Detectar modo - DEBE IR ANTES del useEffect que lo usa
    const selectedCount = selectedVentaIds.length;
    const isBatchMode = selectedCount > 1;
    const isEmptyMode = selectedCount === 0;

    // ✅ NUEVO: Precarga de datos en modo edición
    useEffect(() => {
        if (isEditMode && entrega) {
            console.log('📝 [Modo Edición] Precargando datos de entrega:', {
                id: entrega.id,
                numero_entrega: entrega.numero_entrega,
                vehiculo_id: entrega.vehiculo_id,
                chofer_id: entrega.chofer_id,
                fecha_programada: entrega.fecha_programada,
            });

            // Convertir fecha al formato correcto para datetime-local input
            const fechaFormato = convertToDatetimeLocalFormat(entrega.fecha_programada);
            console.log('🕐 Fecha convertida:', {
                original: entrega.fecha_programada,
                convertida: fechaFormato,
            });

            // Cargar datos de la entrega existente
            updateFormData({
                vehiculo_id: entrega.vehiculo_id,
                chofer_id: entrega.chofer_id,
                entregador_id: entrega.entregador_id,
                peso_kg: entrega.peso_kg,
                volumen_m3: entrega.volumen_m3,
                fecha_programada: fechaFormato,
            });

            // Pre-seleccionar las ventas asignadas
            if (ventasAsignadas && ventasAsignadas.length > 0) {
                const ventasAsignadasIds = ventasAsignadas.map((v) => v.id);
                setSelectedVentaIds(ventasAsignadasIds);
                console.log('✅ Ventas asignadas precargadas:', ventasAsignadasIds);
                console.log('📊 Peso de entrega (backend):', entrega.peso_kg);
            }
        }
    }, [isEditMode, entrega?.id, ventasAsignadas]); // Incluir ventasAsignadas para re-ejecución si cambia

    // Pre-llenar datos para caso single (1 venta)
    useEffect(() => {
        if (selectedCount === 1 && !isEditMode) {
            const selectedVenta = ventas.find((v) => v.id === selectedVentaIds[0]);

            if (selectedVenta) {
                console.log('📋 [Pre-fill Single] Llenando datos para venta única:', {
                    venta_id: selectedVenta.id,
                    numero_venta: selectedVenta.numero_venta,
                });

                // Auto-completar fecha programada si no está ya definida
                if (!formData.fecha_programada && selectedVenta.fecha_entrega_comprometida) {
                    const fecha = new Date(selectedVenta.fecha_entrega_comprometida);
                    const isoString = fecha.toISOString().slice(0, 16);
                    updateFormData({ fecha_programada: isoString });
                    console.log('✅ Fecha programada auto-completada:', isoString);
                }

                // Auto-completar dirección si no está ya definida
                if (!formData.direccion_entrega && selectedVenta.direccionCliente?.direccion) {
                    updateFormData({ direccion_entrega: selectedVenta.direccionCliente.direccion });
                    console.log('✅ Dirección auto-completada:', selectedVenta.direccionCliente.direccion);
                }
            }
        }
    }, [selectedCount, selectedVentaIds, ventas, isEditMode]);

    // Totales seleccionados - Usar ventasAcumuladas como fuente de verdad
    const totals = useMemo(() => {
        // ✅ MEJORADO: Usar ventasAcumuladas (que persiste entre búsquedas)
        const pesoCalculado = ventasAcumuladas.reduce((sum, v) => {
            const peso = parseFloat(v.peso_total_estimado as any) || parseFloat(v.peso_estimado as any) || 0;
            return sum + peso;
        }, 0);

        const montoCalculado = ventasAcumuladas.reduce((sum, v) => sum + (parseFloat(v.subtotal as any) ?? 0), 0);

        console.log('📊 Totales Acumulados:', {
            ventasAcumuladas: ventasAcumuladas.length,
            ids: ventasAcumuladas.map((v) => v.id),
            pesoTotal: pesoCalculado.toFixed(1),
            montoTotal: montoCalculado.toLocaleString('es-BO', { minimumFractionDigits: 2 }),
            detalles: ventasAcumuladas.map((v) => ({
                id: v.id,
                numero: v.numero_venta,
                peso: parseFloat(v.peso_total_estimado as any) || parseFloat(v.peso_estimado as any) || 0,
                subtotal: v.subtotal,
            })),
        });

        return {
            count: ventasAcumuladas.length,
            pesoTotal: pesoCalculado,
            montoTotal: montoCalculado,
        };
    }, [ventasAcumuladas]);

    // Validaciones para batch - DEBE IR ANTES del useEffect que lo usa
    const selectedVehiculo = vehiculos.find((v) => v.id === formData.vehiculo_id);
    const capacidadInsuficiente = selectedVehiculo && totals.pesoTotal > (selectedVehiculo.capacidad_kg ?? 0);

    // Monitor del estado del formulario
    useEffect(() => {
        if (isBatchMode) {
            const buttonStatus = !formData.vehiculo_id || !formData.chofer_id ? '❌ DESHABILITADO' : '✅ HABILITADO';
            console.log('📋 Estado del Formulario:', {
                buttonStatus,
                formData: {
                    vehiculo_id: formData.vehiculo_id ?? 'undefined',
                    chofer_id: formData.chofer_id ?? 'undefined',
                },
                validaciones: {
                    capacidadInsuficiente,
                    pesoTotal: totals.pesoTotal,
                },
            });
        }
    }, [formData.vehiculo_id, formData.chofer_id, isBatchMode, capacidadInsuficiente, totals.pesoTotal]);

    // Handler para eliminar venta asignada
    const [ventasEliminando, setVentasEliminando] = useState<Set<Id>>(new Set());
    const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

    const handleEliminarVenta = async (ventaId: Id) => {
        if (!isEditMode || !entrega) return;

        const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta venta de la entrega?');
        if (!confirmed) return;

        setVentasEliminando((prev) => new Set([...prev, ventaId]));
        setErrorEliminar(null);

        try {
            const response = await fetch(`/logistica/entregas/${entrega.id}/ventas/${ventaId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorEliminar(data.message || 'Error al eliminar la venta');
                return;
            }

            // Remover de selectedVentaIds
            setSelectedVentaIds((prev) => prev.filter((id) => id !== ventaId));
            console.log('✅ Venta eliminada:', ventaId);

            // Recargar la página después de 500ms para asegurar que el backend procesó todo
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            setErrorEliminar(message);
            console.error('❌ Error al eliminar venta:', error);
        } finally {
            setVentasEliminando((prev) => {
                const next = new Set(prev);
                next.delete(ventaId);
                return next;
            });
        }
    };

    // Handlers
    const handleToggleVenta = (ventaId: Id) => {
        setSelectedVentaIds((prev) => {
            const isAdding = !prev.includes(ventaId);
            const updated = isAdding ? [...prev, ventaId] : prev.filter((id) => id !== ventaId);

            // ✅ NUEVO: Acumular/remover venta en ventasAcumuladas
            if (isAdding) {
                // Buscar la venta en todas las fuentes
                const allVentas = [...ventas, ...searchResults, ...ventasAcumuladas];
                const ventaUnica = Array.from(new Map(allVentas.map((v) => [v.id, v])).values());
                const ventaToAdd = ventaUnica.find((v) => v.id === ventaId);

                if (ventaToAdd && !ventasAcumuladas.some((v) => v.id === ventaId)) {
                    setVentasAcumuladas((prev) => [...prev, ventaToAdd]);
                    console.log('✅ Venta agregada al carrito:', { id: ventaId, numero: ventaToAdd.numero_venta });
                }
            } else {
                // Remover venta
                setVentasAcumuladas((prev) => prev.filter((v) => v.id !== ventaId));
                console.log('❌ Venta removida del carrito:', ventaId);
            }

            // Log de selección
            const allVentasForLog = [...ventas, ...searchResults, ...ventasAcumuladas];
            const ventasUnicasForLog = Array.from(new Map(allVentasForLog.map((v) => [v.id, v])).values());
            const selectedVentas = ventasUnicasForLog.filter((v) => updated.includes(v.id));

            const pesoTotal = selectedVentas.reduce(
                (sum, v) => sum + (parseFloat(v.peso_total_estimado as any) || parseFloat(v.peso_estimado as any) || 0),
                0,
            );
            const montoTotal = selectedVentas.reduce((sum, v) => sum + (parseFloat(v.subtotal as any) ?? 0), 0);

            console.log('📦 Ventas Seleccionadas Actualizadas:', {
                count: updated.length,
                ventaIds: updated,
                pesoTotal: pesoTotal.toFixed(1),
                montoTotal: montoTotal.toLocaleString('es-BO', { minimumFractionDigits: 2 }),
                ventas: selectedVentas.map((v) => ({
                    id: v.id,
                    numero_venta: v.numero_venta,
                    cliente: v.cliente?.nombre,
                    peso: parseFloat(v.peso_total_estimado as any) || parseFloat(v.peso_estimado as any) || 0,
                    subtotal: v.subtotal,
                })),
            });

            return updated;
        });
    };

    const handleSelectAll = () => {
        // ✅ NUEVO: Agregar todas las ventas al carrito
        const allVentasToAdd = [...ventas, ...searchResults];
        const ventasUnicas = Array.from(new Map(allVentasToAdd.map((v) => [v.id, v])).values());

        setSelectedVentaIds(ventasUnicas.map((v) => v.id));
        setVentasAcumuladas(ventasUnicas);

        console.log('✅ Todas las ventas agregadas al carrito:', {
            cantidad: ventasUnicas.length,
            ids: ventasUnicas.map((v) => v.id),
        });
    };

    const handleClearSelection = () => {
        setSelectedVentaIds([]);
        setVentasAcumuladas([]); // ✅ NUEVO: Limpiar carrito también

        console.log('❌ Carrito limpiado');
    };

    // Helper para obtener fecha actual en formato datetime-local (YYYY-MM-DDTHH:MM)
    const getTodayDateTimeLocal = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Helper para convertir fecha ISO (2026-02-11) a formato datetime-local (2026-02-11T00:00)
    const convertToDatetimeLocalFormat = (dateString?: string) => {
        if (!dateString) return getTodayDateTimeLocal();
        // Si ya tiene T (formato correcto), devolver tal cual
        if (dateString.includes('T')) return dateString;
        // Si es solo fecha (YYYY-MM-DD), agregar T00:00
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return `${dateString}T00:00`;
        }
        return getTodayDateTimeLocal();
    };

    // Renderizar panel dinámico según selección
    const renderDynamicFormPanel = () => {
        // Caso 0: Sin selección
        if (isEmptyMode) {
            return (
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="p-12 text-center">
                        <Package className="mx-auto mb-4 h-16 w-16 text-blue-400" />
                        <h3 className="mb-2 text-xl font-semibold text-blue-900 dark:text-blue-100">Selecciona ventas para comenzar</h3>
                        <p className="mb-6 text-sm text-blue-700 dark:text-blue-300">
                            Puedes seleccionar una o múltiples ventas desde el listado de la izquierda
                        </p>
                        <ul className="inline-block space-y-2 text-left text-sm text-blue-700 dark:text-blue-300">
                            <li className="flex items-center gap-2">
                                <span className="text-lg">✓</span>
                                <span>
                                    <strong>1 venta</strong> → Recomendación inteligente + opciones de programación
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-lg">✓</span>
                                <span>
                                    <strong>2+ ventas</strong> → Recomendación inteligente + consolidación
                                </span>
                            </li>
                        </ul>
                    </div>
                </Card>
            );
        }

        // Caso 1+: Una o múltiples ventas - Batch UI Unificado
        return (
            <>
                {/* BLOQUE 0: Carrito de Ventas Acumuladas (Colapsable) */}
                {ventasAcumuladas.length > 0 && (
                    <div className="rounded-md border-green-200 bg-gradient-to-r from-green-50 to-green-50/50 dark:border-green-800 dark:from-green-900/20 dark:to-green-900/10">
                        {/* Header clickeable */}
                        <button
                            onClick={() => setIsCarritoExpanded(!isCarritoExpanded)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-green-100/50 dark:hover:bg-green-900/30 rounded-t transition-colors"
                        >
                            <h3 className="text-base font-semibold text-green-900 dark:text-green-100">
                                🛒 Ventas Agregadas ({ventasAcumuladas.length})
                            </h3>
                            {isCarritoExpanded ? (
                                <ChevronUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-green-600 dark:text-green-400" />
                            )}
                        </button>

                        {/* Contenido colapsable */}
                        {isCarritoExpanded && (
                            <div className="px-4 pb-4 border-t border-green-200 dark:border-green-800">
                                <div className="flex flex-wrap gap-2 pt-4">
                                    {ventasAcumuladas.map((venta) => (
                                        <div
                                            key={venta.id}
                                            className="flex flex-wrap items-center justify-between rounded border border-green-200 bg-white p-2 dark:border-green-800 dark:bg-slate-800"
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">#{venta.id}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{venta.cliente?.nombre}</p>
                                            </div>
                                            <div className="ml-3 text-right">
                                                <p className="text-xs font-medium text-green-600 dark:text-green-400">
                                                    {(parseFloat(venta.peso_total_estimado as any) || parseFloat(venta.peso_estimado as any) || 0).toFixed(1)}{' '}
                                                    kg
                                                </p>
                                                <p className="text-xs font-medium text-green-600 dark:text-green-400">
                                                    Bs {(parseFloat(venta.subtotal as any) ?? 0).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Totales */}
                                {/* <div className="border-t border-green-200 dark:border-green-800 pt-3 mt-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs font-medium text-green-600 uppercase dark:text-green-400">Ventas</p>
                                            <p className="text-lg font-bold text-green-900 dark:text-green-100">{ventasAcumuladas.length}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-green-600 uppercase dark:text-green-400">Peso Total</p>
                                            <p className="text-lg font-bold text-green-900 dark:text-green-100">{totals.pesoTotal.toFixed(1)} kg</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-green-600 uppercase dark:text-green-400">Monto Total</p>
                                            <p className="text-lg font-bold text-green-900 dark:text-green-100">
                                                Bs {totals.montoTotal.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        )}
                    </div>
                )}

                {/* Mensajes de Estado (Error/Éxito) */}
                {submitError && (
                    <Card className="mb-4 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-800 dark:text-red-200">Error al crear entregas</h3>
                                <p className="mt-1 text-sm text-red-700 dark:text-red-300">{submitError}</p>

                                {submitError.includes('no está disponible') && (
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => {
                                                updateFormData({ vehiculo_id: null, chofer_id: null });
                                                console.log('🔄 Limpiando selección para solicitar nueva recomendación');
                                            }}
                                            className="rounded bg-red-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-700"
                                        >
                                            Solicitar nueva recomendación
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                )}

                {successMessage && (
                    <Card className="mb-4 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                            <div>
                                <h3 className="font-semibold text-green-800 dark:text-green-200">¡Éxito!</h3>
                                <p className="mt-1 text-sm text-green-700 dark:text-green-300">{successMessage}</p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* BLOQUE 2: Asignación de Recursos */}
                <div className="mb-2 space-y-4 border-b border-gray-200 pb-2 dark:border-slate-700">
                    {/* <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                        Asignación de Recursos
                    </h2> */}

                    {/* ✅ DEBUG: Mostrar estado de renderización */}
                    {isEditMode && (
                        <div className="rounded border border-blue-200 bg-blue-50 p-2 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                            DEBUG - Edit Mode: vehiculo_id={formData.vehiculo_id}, chofer_id={formData.chofer_id}
                        </div>
                    )}

                    {/* Recomendación Inteligente de Vehículo O Datos de Edición */}
                    {(() => {
                        // En edit mode: mostrar si hay ventas seleccionadas (el componente se precargará después)
                        // En create mode: mostrar si hay recomendación o estado del hook
                        const shouldRender = isEditMode
                            ? selectedCount > 0
                            : recomendado || alertaRecomendacion || errorRecomendacion || loadingRecomendacion;

                        console.log('🎯 [VehicleRecommendationCard] shouldRender:', shouldRender, {
                            isEditMode,
                            selectedCount,
                            vehiculo_id: formData.vehiculo_id,
                            recomendado: !!recomendado,
                            hook_values: {
                                alerta: !!alertaRecomendacion,
                                error: !!errorRecomendacion,
                                loading: loadingRecomendacion,
                            },
                        });
                        return shouldRender;
                    })() && (
                        <VehicleRecommendationCard
                            recomendado={recomendado}
                            disponibles={disponibles}
                            todosVehiculos={vehiculos}
                            pesoTotal={totals.pesoTotal}
                            montoTotal={totals.montoTotal}
                            isLoading={loadingRecomendacion}
                            error={errorRecomendacion}
                            alerta={alertaRecomendacion}
                            selectedVehiculoId={formData.vehiculo_id ?? undefined}
                            selectedChoferId={formData.chofer_id ?? null}
                            selectedEntregadorId={formData.entregador_id ?? null}
                            choferes={choferes}
                            entregadores={choferes}
                            onSelectVehiculo={handleSelectVehiculo}
                            onSelectChofer={handleSelectChofer}
                            onSelectEntregador={handleSelectEntregador}
                        />
                    )}

                    {/* ✅ NUEVO: Mostrar ventas asignadas en modo edición */}
                    {isEditMode && selectedCount > 0 && (
                        <Card className="border-l-4 border-blue-200 border-l-blue-500 bg-blue-50 p-4 dark:border-blue-800 dark:border-slate-700 dark:bg-blue-900/10 dark:bg-slate-900">
                            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                Ventas Asignadas a esta Entrega
                            </h3>

                            {/* Mostrar error si existe */}
                            {errorEliminar && (
                                <div className="mb-3 rounded border border-red-300 bg-red-100 p-2 text-xs text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300">
                                    ❌ {errorEliminar}
                                </div>
                            )}

                            <div className="space-y-2">
                                {ventasAsignadas && ventasAsignadas.length > 0 ? (
                                    ventasAsignadas.map((venta) => (
                                        <div
                                            key={venta.id}
                                            className="flex items-center justify-between rounded border border-gray-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800"
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">#{venta.numero_venta}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {venta.cliente?.nombre} • Bs{' '}
                                                    {(venta.subtotal ?? 0).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                                        {venta.peso_estimado ? `${(parseFloat(venta.peso_estimado as any) ?? 0).toFixed(1)} kg` : '-'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleEliminarVenta(venta.id)}
                                                    disabled={ventasEliminando.has(venta.id)}
                                                    className="flex-shrink-0 rounded p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                                                    title="Eliminar venta de esta entrega"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Sin ventas asignadas</p>
                                )}
                            </div>
                            <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                                {ventasAsignadas?.length === 1
                                    ? '1 venta asignada a esta entrega'
                                    : `${ventasAsignadas?.length ?? 0} ventas asignadas a esta entrega`}
                            </p>
                        </Card>
                    )}

                    {/* Fecha de Entrega Programada */}
                    {/* <Card className="dark:bg-slate-900 dark:border-slate-700 p-4 border-l-4 border-l-amber-500">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            Fecha de Entrega
                        </h3>
                        <input
                            type="datetime-local"
                            value={formData.fecha_programada || getTodayDateTimeLocal()}
                            onChange={(e) => updateFormData({ fecha_programada: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white transition-colors focus:ring-2 focus:ring-amber-500 text-sm"
                        />
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            {selectedCount === 1
                                ? '📦 Se aplicará a esta entrega'
                                : `📦 Se aplicará a las ${selectedCount} entregas consolidadas`
                            }
                        </p>
                    </Card> */}
                </div>

                {/* BLOQUE 3: Opciones & Validación */}
                <div className="space-y-3">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                        <CheckCircle2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        Validación & Opciones
                    </h2>

                    {/* Tipo de Reporte */}
                    <Card className="border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:border-slate-700 dark:bg-blue-900/20 dark:bg-slate-900">
                        <p className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            <span>
                                {selectedCount === 1
                                    ? `Se creará 1 reporte individual`
                                    : `Se creará 1 reporte consolidado para ${selectedCount} entregas`}
                            </span>
                        </p>
                    </Card>

                    {/* Advertencias */}
                    {capacidadInsuficiente && (
                        <Card className="border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                                <div>
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Capacidad insuficiente</p>
                                    <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                                        Peso: {totals.pesoTotal.toFixed(1)} kg / Capacidad:{' '}
                                        {(parseFloat(selectedVehiculo?.capacidad_kg as any) ?? 0).toFixed(1)} kg
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-white p-4 dark:bg-slate-950">
            {/* Barra de Progreso - Aparece cuando se está enviando */}
            {isSubmitting && (
                <div className="fixed top-0 right-0 left-0 z-50 h-1 overflow-hidden bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700">
                    <div
                        className="h-full animate-pulse bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400"
                        style={{
                            animation: 'progress 2s ease-in-out infinite',
                            width: '100%',
                        }}
                    />
                    <style>{`
                        @keyframes progress {
                            0% { transform: translateX(-100%); }
                            50% { transform: translateX(100%); }
                            100% { transform: translateX(-100%); }
                        }
                    `}</style>
                </div>
            )}

            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {isEditMode ? 'Editar Entrega' : `Crear Entregas (${selectedCount} Seleccionada${selectedCount !== 1 ? 's' : ''})`}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {isEditMode ? 'Modifica la entrega según sea necesario' : 'Selecciona una o más ventas para continuar'}
                        </p>
                    </div>

                    {/* Estado de Envío */}
                    {isSubmitting && (
                        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-800 dark:bg-blue-900/20">
                            <div className="h-3 w-3 animate-pulse rounded-full bg-blue-500" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Creando entregas...</span>
                        </div>
                    )}
                </div>

                {/* Layout Principal: Vertical Stack */}
                <div className="space-y-8">
                    {/* SECCIÓN 1: Selector de Ventas */}
                    <Card className="p-4 dark:border-slate-700 dark:bg-slate-900">
                        <BatchVentaSelector
                            ventas={ventas}
                            selectedIds={selectedVentaIds}
                            ventasAsignadas={ventasAsignadas?.map((v) => v.id) ?? []}
                            onToggleVenta={handleToggleVenta}
                            onSelectAll={handleSelectAll}
                            onClearSelection={handleClearSelection}
                            onSearchResultsChange={setSearchResults}
                        />
                    </Card>

                    {/* SECCIÓN 2: Configuración de Entregas */}
                    {selectedCount >= 1 && (
                        <div className="space-y-6">
                            {/* Panel de Configuración */}
                            <div className="space-y-6">{renderDynamicFormPanel()}</div>

                            {/* Botón Cancelar en sección */}
                            {/* <div className="pt-4">
                                <Button onClick={handleClearSelection} variant="outline" className="w-full">
                                    Cancelar Selección
                                </Button>
                            </div> */}
                        </div>
                    )}
                </div>

                {/* Botón Flotante (FAB) - Crear Entrega */}
                {selectedCount >= 1 && (
                    <div className="fixed right-6 bottom-6 z-50">
                        {/* Barra de progreso del botón flotante */}
                        {isSubmitting && (
                            <div className="absolute -top-2 right-0 left-0 h-1 overflow-hidden rounded-md bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 shadow-lg">
                                <div
                                    className="h-full animate-pulse bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300"
                                    style={{
                                        animation: 'progress-small 1.5s ease-in-out infinite',
                                        width: '100%',
                                    }}
                                />
                                <style>{`
                                    @keyframes progress-small {
                                        0%, 100% { width: 0%; }
                                        50% { width: 100%; }
                                    }
                                `}</style>
                            </div>
                        )}

                        {/* Botón principal flotante */}
                        <button
                            onClick={() => {
                                // ✅ NUEVO: Pasar callback para abrir modal en lugar de recargar
                                handleSubmitBatch((entrega) => {
                                    setEntregaParaImprimir(entrega);
                                    setShowOutputSelection(true);
                                });
                            }}
                            disabled={!formData.vehiculo_id || !formData.chofer_id || capacidadInsuficiente || isSubmitting}
                            title={
                                !formData.vehiculo_id || !formData.chofer_id
                                    ? 'Selecciona vehículo y chofer'
                                    : capacidadInsuficiente
                                      ? 'Revisa la capacidad del vehículo'
                                      : isEditMode
                                        ? 'Guardar cambios'
                                        : 'Crear entregas'
                            }
                            className={`flex transform items-center justify-center gap-2 rounded-md px-2 py-2 font-semibold text-white shadow-lg transition-all duration-300 ${isSubmitting ? 'scale-105 hover:scale-105' : 'hover:scale-110 active:scale-95'} ${
                                !formData.vehiculo_id || !formData.chofer_id || capacidadInsuficiente || isSubmitting
                                    ? 'cursor-not-allowed bg-gray-400 dark:bg-gray-600'
                                    : 'bg-green-600 hover:bg-green-700 hover:shadow-xl dark:bg-green-700 dark:hover:bg-green-600'
                            } `}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent border-r-transparent" />
                                    <span className="hidden text-sm font-medium sm:inline">{isEditMode ? 'Editando...' : 'Creando...'}</span>
                                    <span className="text-sm sm:hidden">...</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5" />
                                    <span className="hidden text-sm sm:inline">
                                        {isEditMode ? 'Editar Entrega' : `${selectedCount} ${selectedCount === 1 ? 'Entrega' : 'Entregas'}`}
                                    </span>
                                </>
                            )}
                        </button>

                        {/* Botón Cancelar en sección */}
                        <div className="pt-2">
                            <Button onClick={handleClearSelection} variant="outline" className="w-full">
                                Limpiar Todo
                            </Button>
                        </div>

                        {/* Indicador de estado */}
                        {(capacidadInsuficiente || !formData.vehiculo_id || !formData.chofer_id) && (
                            <div className="absolute -top-12 right-0 whitespace-nowrap">
                                <div className="rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
                                    {capacidadInsuficiente
                                        ? '⚠️ Revisar capacidad'
                                        : !formData.vehiculo_id && !formData.chofer_id
                                          ? '⏳ Vehículo + Chofer'
                                          : !formData.vehiculo_id
                                            ? '⏳ Vehículo'
                                            : '⏳ Chofer'}
                                </div>
                            </div>
                        )}

                        {/* Indicador de éxito */}
                        {formData.vehiculo_id && formData.chofer_id && !capacidadInsuficiente && (
                            <div className="absolute -top-12 right-0 whitespace-nowrap">
                                <div className="rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs text-green-700 shadow-sm dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    ✅ {isEditMode ? 'Listo para guardar' : 'Listo para crear'}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal de Consolidación Automática */}
                <ConsolidacionAutomaticaModal isOpen={isConsolidacionModalOpen} onClose={() => setIsConsolidacionModalOpen(false)} />

                {/* ✅ NUEVO: Modal OutputSelectionModal para imprimir entrega */}
                {entregaParaImprimir && (
                    <OutputSelectionModal
                        isOpen={showOutputSelection}
                        onClose={() => {
                            setShowOutputSelection(false);
                            setEntregaParaImprimir(null);
                            // Recargar página después de cerrar el modal
                            setTimeout(() => {
                                window.location.reload();
                            }, 500);
                        }}
                        documentoId={entregaParaImprimir.id}
                        tipoDocumento="entrega"
                        documentoInfo={{
                            numero: entregaParaImprimir.numero_entrega,
                            cliente: entregaParaImprimir.cliente_nombre || 'Entregas Consolidadas',
                            fecha: entregaParaImprimir.fecha_asignacion,
                        }}
                    />
                )}
            </div>
        </div>
    );
}
