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

// ✅ HELPER FUNCTION: Validar si un precio corresponde a algún tipo de precio registrado
const validarTipoPrecio = (producto: any, precioUnitario: number): { tipo_precio_id: number | null; tipo_precio_nombre: string | null } => {
    if (!producto || !precioUnitario) {
        return { tipo_precio_id: null, tipo_precio_nombre: null };
    }

    // Si el producto tiene precios disponibles, buscar coincidencia exacta
    const precios = producto.precios || producto.precios_venta || [];
    if (Array.isArray(precios)) {
        const precioCoincidet = precios.find((p: any) =>
            Math.abs(p.precio - precioUnitario) < 0.01 // Permitir pequeña tolerancia por decimales
        );

        if (precioCoincidet) {
            return {
                tipo_precio_id: precioCoincidet.tipo_precio_id,
                tipo_precio_nombre: precioCoincidet.nombre || precioCoincidet.tipo_precio_nombre
            };
        }
    }

    // Si no hay coincidencia, retornar null (representa "OTROS")
    return { tipo_precio_id: null, tipo_precio_nombre: null };
};

export default function ProductosTable({
    productos,
    detalles,
    onAddProduct,
    onUpdateDetail,
    onUpdateDetailMultiple,
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
    es_farmacia = false,
    permitirProductosSinStock = false, // ✅ NUEVO (2026-05-26): Permitir productos sin stock
    proformaConvertida = false // ✅ NUEVO (2026-05-29): Ocultar disponibilidad si está convertida
}: ProductosTableProps) {
    // ✅ DEBUG (2026-05-26): Verificar que permitirProductosSinStock llegue correctamente
    // console.log('📦 [ProductosTable] permitirProductosSinStock recibido:', permitirProductosSinStock);

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

                /* console.log('📦 [ProductosTable] Combo agregado:', {
                    combo_id: comboId,
                    combo_nombre: ultimoDetalle.producto?.nombre,
                    items_cantidad: comboItems.length,
                    items_detalles: comboItems.map((i: any) => ({
                        id: i.id,
                        producto_id: i.producto_id,
                        cantidad: i.cantidad,
                        es_obligatorio: i.es_obligatorio
                    }))
                }); */

                setComboItemsMap(prev => ({
                    ...prev,
                    [comboId]: comboItems
                }));
            }
        }

        // ✅ Inicializar select de tipo de precio (PRIORIDAD del backend)
        // ✅ REFACTORIZADO (2026-07-03): Usar producto_id como clave en lugar de index
        // ✅ MODIFICADO (2026-08-28): Forzar inicialización SIEMPRE en lugar de solo si no está establecido
        if (tipo === 'venta') {
            // 1️⃣ PRIORIDAD: Si el detalle YA viene con tipo_precio_id del backend, usarlo
            if (ultimoDetalle.tipo_precio_id && selectedTipoPrecio[ultimoDetalle.producto_id] !== String(ultimoDetalle.tipo_precio_id)) {
                console.log(`✅ [ProductosTable] Inicializando selectedTipoPrecio con backend: ${ultimoDetalle.tipo_precio_id}`);
                setSelectedTipoPrecio(prev => ({
                    ...prev,
                    [ultimoDetalle.producto_id]: String(ultimoDetalle.tipo_precio_id)
                }));
            }
            // 2️⃣ Si no, usar el recomendado (CRÍTICO para CLIENTE GENERAL)
            else if (ultimoDetalle.tipo_precio_id_recomendado && selectedTipoPrecio[ultimoDetalle.producto_id] !== String(ultimoDetalle.tipo_precio_id_recomendado)) {
                console.log(`ℹ️ [ProductosTable] Inicializando selectedTipoPrecio con recomendado: ${ultimoDetalle.tipo_precio_id_recomendado}`);
                setSelectedTipoPrecio(prev => ({
                    ...prev,
                    [ultimoDetalle.producto_id]: String(ultimoDetalle.tipo_precio_id_recomendado)
                }));
            }
            // 3️⃣ Si no hay nada, buscar un precio de venta
            else if (!selectedTipoPrecio[ultimoDetalle.producto_id]) {
                const precios = ultimoDetalle.producto?.precios || [];
                const preciosVenta = precios.filter(p => {
                    const nombre = (p.nombre || '').toLowerCase();
                    return !nombre.includes('costo') && !nombre.includes('cost');
                });

                const precioVenta = preciosVenta.find(p =>
                    (p.nombre || '').toLowerCase().includes('venta')
                ) || preciosVenta[0];

                if (precioVenta) {
                    console.log(`ℹ️ [ProductosTable] Inicializando selectedTipoPrecio con preciosVenta: ${precioVenta.tipo_precio_id}`);
                    setSelectedTipoPrecio(prev => ({
                        ...prev,
                        [ultimoDetalle.producto_id]: String(precioVenta.tipo_precio_id)
                    }));
                }
            }
        }
    }, [detalles.length, tipo]);

    // ✅ NUEVO (2026-08-28): Sincronizar selectedTipoPrecio cuando tipo_precio_id cambia en detalles
    useEffect(() => {
        if (tipo !== 'venta' || detalles.length === 0) return;

        let hasChanges = false;
        const updatedSelectedTipoPrecio = { ...selectedTipoPrecio };

        detalles.forEach((detalle) => {
            const productoId = detalle.producto_id;

            // Si el detalle tiene tipo_precio_id y es diferente al selectedTipoPrecio, actualizar
            if (detalle.tipo_precio_id) {
                const currentSelected = selectedTipoPrecio[productoId];
                const newValue = String(detalle.tipo_precio_id);

                if (currentSelected !== newValue) {
                    updatedSelectedTipoPrecio[productoId] = newValue;
                    hasChanges = true;
                    console.log(`🔄 [ProductosTable] Sincronizando tipo_precio para producto ${productoId}: ${currentSelected} → ${newValue}`);
                }
            }
        });

        if (hasChanges) {
            setSelectedTipoPrecio(updatedSelectedTipoPrecio);
        }
    }, [detalles.map(d => `${d.producto_id}:${d.tipo_precio_id}`).join(','), tipo]);

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
                        const inicializados = comboItems.map((item: any) => {
                            // ✅ Buscar si está en combo_items_seleccionados
                            const estaSeleccionado = comboItemsSeleccionados.some((s: any) => s.id === item.id);
                            // ✅ IMPORTANTE: Los obligatorios SIEMPRE están incluidos
                            const debeEstarIncluido = item.es_obligatorio === true || estaSeleccionado;

                            return {
                                ...item,
                                _isChecked: debeEstarIncluido,
                                incluido: debeEstarIncluido
                            };
                        });

                        // console.log(`📦 [ProductosTable] Inicializando combo ${comboId}: ${inicializados.filter((i: any) => i._isChecked).length} items checked (obligatorios + seleccionados)`, inicializados);
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

            // ✅ CRÍTICO: No actualizar si:
            // 1. El usuario seleccionó "OTROS" (tipo_precio_id === null)
            // 2. El usuario cambió el tipo_precio_id manualmente
            // 3. El rango sugiere cambiar el precio pero el usuario ya seleccionó manual
            // ✅ REFACTORIZADO (2026-07-03): Usar producto_id en lugar de index
            const tieneOtrosSeleccionado = detalle.tipo_precio_id === null;

            if (
                detalleRango &&
                detalleRango.tipo_precio_nombre !== null &&
                detalleRango.tipo_precio_nombre !== detalle.tipo_precio_nombre &&
                !manuallySelectedTipoPrecio[detalle.producto_id] &&
                !tieneOtrosSeleccionado  // ✅ NUEVO: No tocar si tiene "OTROS" seleccionado
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
        // ✅ NUEVO: Si se actualiza precio_unitario, validar si corresponde a un tipo de precio
        // ✅ IMPORTANTE (2026-06-15): En modo COMPRA, permitir edición libre del precio sin validaciones de tipos de precios
        if (field === 'precio_unitario' && tipo === 'venta') {
            const precioUnitario = typeof value === 'string' ? parseFloat(value) : value;
            const detalle = detalles[index];
            const producto = detalle?.producto;

            // Validar si el precio corresponde a un tipo de precio registrado
            const { tipo_precio_id, tipo_precio_nombre } = validarTipoPrecio(producto, precioUnitario);

            // Si no hay coincidencia de tipo de precio, limpiar estos campos (marcará como "OTROS")
            if (tipo_precio_id === null) {

                // ✅ CRÍTICO (2026-07-03): Actualizar el detalle con el nuevo precio y limpiar tipo_precio
                // Hacer esto en UNA SOLA actualización de estado para evitar "stale closure"
                if (onUpdateDetailMultiple) {
                    // Usar la nueva función para consolidar múltiples actualizaciones
                    onUpdateDetailMultiple(index, {
                        precio_unitario: value,
                        tipo_precio_id: null,
                        tipo_precio_nombre: null
                    });
                } else {
                    // Fallback: si no está disponible, hacer las llamadas individuales
                    onUpdateDetail(index, field, value);
                    onUpdateDetail(index, 'tipo_precio_id', null);
                    onUpdateDetail(index, 'tipo_precio_nombre', null);
                }
                return;
            } else {
                /* console.log('✅ [handleUpdateDetail] Precio coincide con tipo de precio registrado', {
                    detalle_index: index,
                    producto: producto?.nombre,
                    precio_nuevo: precioUnitario,
                    tipo_precio_id: tipo_precio_id,
                    tipo_precio_nombre: tipo_precio_nombre
                }); */
            }
        }

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
                permitirProductosSinStock={permitirProductosSinStock}
                onProductSelected={onAddProduct}
                onMedicamentoInfo={setFarmaciaProdutoSeleccionado}
            />

            {/* Lista de productos agregados */}
            {detalles.length > 0 ? (
                <div className="w-full overflow-x-auto relative">
                    {/* Indicador de carga */}
                    {isCalculatingPrices && (
                        <div className="absolute top-0 right-0 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-bl-lg border-l border-b border-blue-200 dark:border-blue-800 z-10">
                            <div className="w-3 h-3 border-2 border-blue-400 border-t-blue-700 dark:border-t-blue-300 rounded-full animate-spin"></div>
                            <span className="text-xs font-medium">Actualizando...</span>
                        </div>
                    )}

                    {/* Tabla de productos */}
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead className="bg-gradient-to-b from-gray-100 to-gray-50 dark:from-zinc-700 dark:to-zinc-800 border-b-2 border-gray-300 dark:border-zinc-600">
                            <tr>
                                <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                    Producto
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                    SKU
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                    Disp.
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                    Cantidad
                                </th>
                                {tipo === 'compra' && (
                                    <>
                                        <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                            Precio Compra
                                        </th>
                                        <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                            Lote
                                        </th>
                                        <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                            Vencimiento
                                        </th>
                                    </>
                                )}
                                {tipo === 'venta' && (
                                    <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                        Precio Unitario
                                    </th>
                                )}
                                <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                    Subtotal
                                </th>
                                 <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                    Categoría
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                    Unidad
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                    Marca
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">
                                    -
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700 font-small text-xs">
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
                                        proformaConvertida={proformaConvertida}
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
