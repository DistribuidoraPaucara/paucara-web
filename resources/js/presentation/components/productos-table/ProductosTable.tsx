import React, { useState, useEffect, useCallback } from 'react';
import { ModalComprasDiferenciaCostoComponent } from '@/presentation/components/precios/modal-compras-diferencia-costo';
import { preciosService } from '@/application/services/precios.service';
import type { Producto } from '@/domain/entities/ventas';
import { DetalleProducto, ProductosTableProps } from './types';
import ProductSearchBar from './components/ProductSearchBar';
import ProductoTableRow from './components/ProductoTableRow';
import FarmaciaMedicamentoModal from './components/FarmaciaMedicamentoModal';

// ✅ HELPER FUNCTION: Normalizar fechas para inputs type="date"
const normalizeDateForInput = (date: string | null | undefined): string => {
    if (!date) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    return date.slice(0, 10);
};

export default function ProductosTable({
    productos,
    detalles,
    onAddProduct,
    onUpdateDetail,
    onRemoveDetail,
    almacen_id,
    cliente_id,
    isClienteGeneral = false,
    manuallySelectedTipoPrecio = {},
    isCalculatingPrices = false,
    readOnly = false,
    tipo = 'compra',
    onUpdateDetailUnidadConPrecio,
    onManualTipoPrecioChange,
    onComboItemsChange,
    default_tipo_precio_id,
    carritoCalculado,
    onDetallesActualizados,
    es_farmacia = false
}: ProductosTableProps) {
    // ✅ Estados para edición de campos
    const [editingField, setEditingField] = useState<{ index: number; field: string; value: string } | null>(null);

    // ✅ Estado para tipos de precio seleccionados
    const [selectedTipoPrecio, setSelectedTipoPrecio] = useState<Record<number, string | number>>({});

    // ✅ Estado para combos expandidos
    const [expandedCombos, setExpandedCombos] = useState<Record<number, boolean>>({});

    // ✅ Estado para items de combos
    const [comboItemsMap, setComboItemsMap] = useState<Record<number, Array<any>>>({});

    // ✅ Estado para modal de medicamentos (farmacia)
    const [farmaciaProdutoSeleccionado, setFarmaciaProdutoSeleccionado] = useState<Producto | null>(null);

    // ✅ Estado para modal de cascada de precios
    const [modalCascadaState, setModalCascadaState] = useState<{
        isOpen: boolean;
        productoId: number | null;
        precioActual: number | null;
        precioCostoNuevo: number | null;
        detalleIndex: number | null;
        productoData: any;
    }>({
        isOpen: false,
        productoId: null,
        precioActual: null,
        precioCostoNuevo: null,
        detalleIndex: null,
        productoData: null
    });

    // ✅ useEffect: Auto-expand combos recién agregados
    useEffect(() => {
        if (detalles.length === 0) return;

        const ultimoDetalle = detalles[detalles.length - 1];
        const ultimoIndice = detalles.length - 1;
        const comboId = ultimoDetalle?.producto?.id;

        if (ultimoDetalle?.producto && (ultimoDetalle.producto as any).es_combo && comboId) {
            const tieneComponentes = ((ultimoDetalle.producto as any).combo_items?.length || 0) > 0;

            if (tieneComponentes && !expandedCombos[ultimoIndice]) {
                setExpandedCombos(prev => ({
                    ...prev,
                    [ultimoIndice]: true
                }));

                const comboItems = ((ultimoDetalle.producto as any).combo_items || []).map((item: any) => ({
                    ...item,
                    incluido: item.es_obligatorio === true
                }));

                console.log('📦 [ProductosTable] Combo agregado:', {
                    combo_id: comboId,
                    combo_nombre: ultimoDetalle.producto?.nombre,
                    items_cantidad: comboItems.length,
                    items_detalles: comboItems.map((i: any) => ({
                        id: i.id,
                        producto_id: i.producto_id,
                        cantidad: i.cantidad,
                        es_obligatorio: i.es_obligatorio
                    }))
                });

                setComboItemsMap(prev => ({
                    ...prev,
                    [comboId]: comboItems
                }));
            }
        }

        // ✅ Inicializar select de tipo de precio
        if (tipo === 'venta' && !selectedTipoPrecio[ultimoIndice]) {
            if (ultimoDetalle.tipo_precio_id_recomendado) {
                setSelectedTipoPrecio(prev => ({
                    ...prev,
                    [ultimoIndice]: String(ultimoDetalle.tipo_precio_id_recomendado)
                }));
            } else {
                const precios = ultimoDetalle.producto?.precios || [];
                const preciosVenta = precios.filter(p => {
                    const nombre = (p.nombre || '').toLowerCase();
                    return !nombre.includes('costo') && !nombre.includes('cost');
                });

                const precioVenta = preciosVenta.find(p =>
                    (p.nombre || '').toLowerCase().includes('venta')
                ) || preciosVenta[0];

                if (precioVenta) {
                    setSelectedTipoPrecio(prev => ({
                        ...prev,
                        [ultimoIndice]: String(precioVenta.tipo_precio_id)
                    }));
                }
            }
        }
    }, [detalles.length, tipo]);

    // ✅ useEffect: Expandir combos pre-existentes del backend
    useEffect(() => {
        if (detalles.length === 0) return;

        const newExpandedCombos: Record<number, boolean> = { ...expandedCombos };
        const newComboItemsMap: Record<number, Array<any>> = { ...comboItemsMap };
        let hasChanges = false;

        detalles.forEach((detalle, index) => {
            const producto = detalle.producto as any;
            if (!producto) return;

            const esCombo = producto.es_combo === true;
            const comboItems = producto.combo_items || [];
            const tieneComponentes = comboItems.length > 0;
            const deberiaEstarExpandido = (detalle as any).expanded === true || tieneComponentes;

            if (esCombo && tieneComponentes) {
                const comboId = producto.id;

                if (!expandedCombos[index] && deberiaEstarExpandido) {
                    newExpandedCombos[index] = true;
                    hasChanges = true;

                    if (!comboItemsMap[comboId]) {
                        const comboItemsSeleccionados = (detalle as any).combo_items_seleccionados || [];
                        const inicializados = comboItemsSeleccionados.length > 0
                            ? comboItemsSeleccionados
                            : comboItems.map((item: any) => ({
                                ...item,
                                incluido: item.es_obligatorio === true
                            }));

                        newComboItemsMap[comboId] = inicializados;
                    }
                }
            }
        });

        if (hasChanges) {
            setExpandedCombos(newExpandedCombos);
            setComboItemsMap(newComboItemsMap);
        }
    }, [detalles.length]); // ✅ FIJO: Solo usar detalles.length para evitar re-renders infinitos

    // ✅ useEffect: Actualizar precios cuando cambian los rangos
    useEffect(() => {
        if (!carritoCalculado || detalles.length === 0) {
            return;
        }

        const detallesActualizados = detalles.map((detalle, index) => {
            const detalleRango = carritoCalculado?.detalles?.find(
                (dr: any) => dr.producto_id === detalle.producto_id
            );

            if (
                detalleRango &&
                detalleRango.tipo_precio_nombre !== null &&
                detalleRango.tipo_precio_nombre !== detalle.tipo_precio_nombre &&
                !manuallySelectedTipoPrecio[index]
            ) {
                const nuevoSubtotal = detalleRango.cantidad * (detalleRango.precio_unitario || detalle.precio_unitario);

                return {
                    ...detalle,
                    tipo_precio_id: detalleRango.tipo_precio_id,
                    tipo_precio_nombre: detalleRango.tipo_precio_nombre,
                    precio_unitario: detalleRango.precio_unitario ?? detalle.precio_unitario,
                    subtotal: nuevoSubtotal
                };
            }

            return detalle;
        });

        const huboCambios = detallesActualizados.some((det, idx) =>
            JSON.stringify(det) !== JSON.stringify(detalles[idx])
        );

        if (huboCambios && onDetallesActualizados) {
            onDetallesActualizados(detallesActualizados);
        }
    }, [carritoCalculado, detalles, manuallySelectedTipoPrecio, onDetallesActualizados]);

    // ✅ Handlers para modal de cascada
    const handleGuardarPreciosModal = useCallback(async (
        preciosCambiados: Array<{
            precio_id: number;
            precio_nuevo: number;
            porcentaje_ganancia: number;
            motivo: string;
        }>
    ) => {
        return await preciosService.actualizarLote(preciosCambiados);
    }, []);

    const handlePreciosActualizados = useCallback(() => {
        setModalCascadaState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const handleCerrarModalCascada = useCallback(() => {
        setModalCascadaState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const handleAbrirModalCascada = useCallback((index: number, detalle: DetalleProducto) => {
        setModalCascadaState({
            isOpen: true,
            productoId: typeof detalle.producto_id === 'string' ? parseInt(detalle.producto_id) : detalle.producto_id,
            precioActual: detalle.precio_costo || null,
            precioCostoNuevo: detalle.precio_unitario || null,
            detalleIndex: index,
            productoData: detalle.producto || { id: detalle.producto_id, nombre: 'Producto' }
        });
    }, []);

    // ✅ Helper functions
    const calcularPrecioPorUnidad = (precioBase: number, unidadDestinoId: number | string | undefined, conversiones?: Array<any>): number => {
        if (!unidadDestinoId || !conversiones || conversiones.length === 0) {
            return precioBase;
        }

        const conversion = conversiones.find(c => c.unidad_destino_id === unidadDestinoId);
        if (!conversion || conversion.factor_conversion === 0) {
            return precioBase;
        }

        return precioBase / conversion.factor_conversion;
    };

    const formatearPrecioVenta = (precio: number): string => {
        const parteDecimal = precio % 1;
        if (parteDecimal === 0) {
            return Math.floor(precio).toString();
        }
        return precio.toFixed(2);
    };

    // ✅ Handler para actualizar detalle (con lógica de combos)
    const handleUpdateDetail = (index: number, field: keyof DetalleProducto, value: number | string) => {
        if (field === 'cantidad' && detalles[index]?.producto && (detalles[index].producto as any).es_combo) {
            const cantidadAnterior = detalles[index].cantidad;
            const cantidadNueva = typeof value === 'number' ? value : parseInt(value as string, 10);

            if (!isNaN(cantidadNueva) && cantidadAnterior !== cantidadNueva) {
                const comboId = (detalles[index].producto as any)?.id;
                const itemsActualesDelMapa = comboId ? comboItemsMap[comboId] : null;
                const comboItems = ((detalles[index].producto as any).combo_items || []) as Array<any>;

                // ✅ REFACTORIZADO (2026-03-28): Solo guardar cantidades ORIGINALES, no multiplicadas
                // El backend será responsable de multiplicar por cantidad de combos
                const comboItemsActualizados = comboItems.map((item) => {
                    // Buscar este item en el mapa usando ID
                    const itemDelMapa = itemsActualesDelMapa?.find((im: any) => im.id === item.id);

                    // Obtener estado de incluido (si existe en el mapa, preservar; si no, usar default)
                    const incluido = itemDelMapa?.incluido !== undefined
                        ? itemDelMapa.incluido
                        : (item.es_obligatorio !== false);

                    // ✅ IMPORTANTE: Guardar SIEMPRE la cantidad ORIGINAL del combo, no la multiplicada
                    // La multiplicación ocurre en el backend cuando se expande el combo
                    return {
                        ...item,
                        cantidad: item.cantidad, // ✅ CANTIDAD ORIGINAL (ej: 10 o 1, no 30 o 3)
                        incluido: incluido
                    };
                });

                console.log('📦 [handleUpdateDetail] Combo items actualizados:', {
                    combo_id: comboId,
                    campo: field,
                    valor: value,
                    items_original: comboItems.map((i: any) => ({ id: i.id, cantidad: i.cantidad })),
                    items_actualizado: comboItemsActualizados.map((i: any) => ({ id: i.id, cantidad: i.cantidad }))
                });

                if (comboId) {
                    setComboItemsMap(prev => ({
                        ...prev,
                        [comboId]: comboItemsActualizados
                    }));
                    // ✅ IMPORTANTE: Notificar al padre (create.tsx) sobre los cambios en items del combo
                    onComboItemsChange?.(index, comboItemsActualizados);
                }

                onUpdateDetail(index, field, value);
                return;
            }
        }

        onUpdateDetail(index, field, value);
    };

    return (
        <div>
            {/* Buscador de productos */}
            <ProductSearchBar
                tipo={tipo}
                almacen_id={almacen_id}
                cliente_id={cliente_id}
                isClienteGeneral={isClienteGeneral}
                readOnly={readOnly}
                es_farmacia={es_farmacia}
                onProductSelected={onAddProduct}
                onMedicamentoInfo={setFarmaciaProdutoSeleccionado}
            />

            {/* Lista de productos agregados */}
            {detalles.length > 0 ? (
                <div className="overflow-x-auto relative">
                    {/* Indicador de carga */}
                    {isCalculatingPrices && (
                        <div className="absolute top-0 right-0 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-bl-lg border-l border-b border-blue-200 dark:border-blue-800 z-10">
                            <div className="w-3 h-3 border-2 border-blue-400 border-t-blue-700 dark:border-t-blue-300 rounded-full animate-spin"></div>
                            <span className="text-xs font-medium">Actualizando...</span>
                        </div>
                    )}

                    {/* Tabla de productos */}
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead className="bg-gray-50 dark:bg-zinc-800">
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Producto
                                </th>
                                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Cantidad
                                </th>
                                {tipo === 'compra' && (
                                    <>
                                        <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Precio Compra
                                        </th>
                                        <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Lote
                                        </th>
                                        <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Vencimiento
                                        </th>
                                    </>
                                )}
                                {tipo === 'venta' && (
                                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Precio Unitario
                                    </th>
                                )}
                                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Subtotal
                                </th>
                                <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    -
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
                            {detalles.map((detalle, index) => {
                                const productoInfo = detalle.producto || productos.find(p => p.id === detalle.producto_id);
                                const precioCosto = detalle.precio_costo || productoInfo?.precio_costo || 0;
                                const tieneDiferencia = tipo === 'compra' && precioCosto > 0 && Math.abs(detalle.precio_unitario - precioCosto) > 0.01;
                                const esAumento = precioCosto > 0 && detalle.precio_unitario > precioCosto;

                                return (
                                    <ProductoTableRow
                                        key={`${detalle.producto_id}-${index}`}
                                        detalle={detalle}
                                        index={index}
                                        tipo={tipo}
                                        readOnly={readOnly}
                                        editingField={editingField}
                                        setEditingField={setEditingField}
                                        manuallySelectedTipoPrecio={manuallySelectedTipoPrecio}
                                        selectedTipoPrecio={selectedTipoPrecio}
                                        setSelectedTipoPrecio={setSelectedTipoPrecio}
                                        expandedCombos={expandedCombos}
                                        setExpandedCombos={setExpandedCombos}
                                        tieneDiferencia={tieneDiferencia}
                                        esAumento={esAumento}
                                        es_farmacia={es_farmacia}
                                        default_tipo_precio_id={default_tipo_precio_id}
                                        comboItemsMap={comboItemsMap}
                                        setComboItemsMap={setComboItemsMap}
                                        onUpdateDetail={handleUpdateDetail}
                                        onRemoveDetail={onRemoveDetail}
                                        onManualTipoPrecioChange={onManualTipoPrecioChange}
                                        onAbrirModalCascada={handleAbrirModalCascada}
                                        onComboItemsChange={onComboItemsChange}
                                        onMedicamentoInfo={setFarmaciaProdutoSeleccionado}
                                        calcularPrecioPorUnidad={calcularPrecioPorUnidad}
                                        formatearPrecioVenta={formatearPrecioVenta}
                                        normalizeDateForInput={normalizeDateForInput}
                                        onUpdateDetailUnidadConPrecio={onUpdateDetailUnidadConPrecio}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-4">
                    <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="mt-1.5 text-xs font-medium text-gray-900 dark:text-white">
                        Sin productos
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        Busca y agrega productos
                    </p>
                </div>
            )}

            {/* Modal de cascada de precios */}
            <ModalComprasDiferenciaCostoComponent
                isOpen={modalCascadaState.isOpen}
                onClose={handleCerrarModalCascada}
                producto={modalCascadaState.productoData}
                precioActual={modalCascadaState.precioActual}
                precioCostoNuevo={modalCascadaState.precioCostoNuevo}
                onActualizarPrecios={handleGuardarPreciosModal}
                onSuccess={handlePreciosActualizados}
            />

            {/* Modal de información de medicamentos */}
            <FarmaciaMedicamentoModal
                producto={farmaciaProdutoSeleccionado}
                onClose={() => setFarmaciaProdutoSeleccionado(null)}
            />
        </div>
    );
}
