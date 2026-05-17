/**
 * Página: Gestión de Precios
 * Permite revisar y actualizar precios de venta según cambios en compras
 * Arquitectura: DDD (Domain-Driven Design)
 */

import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { TablaPreciosComponent } from '@/presentation/components/precios/tabla-precios';
import { ModalActualizarPrecioComponent } from '@/presentation/components/precios/modal-actualizar-precio';
import { ModalComprasDiferenciaCostoComponent } from '@/presentation/components/precios/modal-compras-diferencia-costo';
import { PaginacionPreciosComponent } from '@/presentation/components/precios/paginacion-precios';
import { usePrecios } from '@/application/hooks/use-precios';
import type { FiltrosPrecio, PrecioProductoDTO, TipoPrecioEntity } from '@/domain/entities/precios';

interface PreciosIndexProps {
    tipos_precio: TipoPrecioEntity[];
}

export default function PreciosIndex({ tipos_precio }: PreciosIndexProps) {
    console.log('Renderizando PreciosIndex', tipos_precio);
    // Hook personalizado para gestión de precios
    const [estado, acciones] = usePrecios();

    // Estados locales para filtros y UI
    const [filtros, setFiltros] = useState<FiltrosPrecio>({});
    const [showModal, setShowModal] = useState(false);
    const [precioSeleccionado, setPrecioSeleccionado] = useState<PrecioProductoDTO | null>(null);
    const [soloConCambioCosto, setSoloConCambioCosto] = useState(false);
    const [showModalCompras, setShowModalCompras] = useState(false);

    // Cargar precios al montar el componente
    useEffect(() => {
        acciones.obtenerPrecios(filtros);
    }, []);

    // Manejar búsqueda
    const handleBuscar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        acciones.obtenerPrecios(filtros, 1); // Volver a la página 1 al buscar
    };

    // Manejar limpiar filtros
    const handleLimpiarFiltros = () => {
        setFiltros({});
        acciones.obtenerPrecios({}, 1);
    };

    // Manejar cambio de página
    const handleChangePage = (page: number) => {
        acciones.obtenerPrecios(filtros, page);
    };

    // Manejar editar precio
    const handleEditarPrecio = (precio: PrecioProductoDTO) => {
        setPrecioSeleccionado(precio);
        setShowModal(true);
    };

    // Manejar ver historial
    const handleVerHistorial = async (precioId: number) => {
        await acciones.obtenerHistorial(precioId);
    };

    // Manejar guardar precio
    const handleGuardarPrecio = async (precioNuevo: number, motivo: string) => {
        if (!precioSeleccionado) return;
        await acciones.actualizarPrecio(precioSeleccionado.id, precioNuevo, motivo);
    };

    // Manejar búsqueda de compras con diferencia de costo
    const handleBuscarCompras = async (productoId: number) => {
        await acciones.obtenerComprasConDiferenciaCosto(productoId);
        setShowModalCompras(true);
    };

    // Manejar cierre del modal de compras
    const handleCerrarModalCompras = () => {
        setShowModalCompras(false);
        acciones.limpiarComprasSeleccionadas();
    };

    // ✅ NUEVO: Manejar actualización de precios desde el modal
    const handleActualizarPreciosModal = async (precios: Array<{ precio_id: number; precio_nuevo: number; porcentaje_ganancia?: number; motivo: string }>) => {
        try {
            console.log('💾 Página Precios - handleActualizarPreciosModal iniciado con:', precios.length, 'precios');
            await acciones.actualizarLote(precios);
            console.log('💾 Página Precios - Actualización completada, recargar lista');
            // Recargar precios después de actualizar
            await acciones.obtenerPrecios(filtros);
        } catch (error) {
            console.error('❌ Error actualizando precios:', error);
            throw error;
        }
    };

    // Filtrar productos según filtros activos
    const productosFiltered = estado.precios?.data
        ? estado.precios.data.filter(p => {
            let cumpleCambio = true;
            let cumpleDiferencia = true;

            if (soloConCambioCosto) {
                cumpleCambio = p.costo_cambio_reciente || p.precios.some(pr => pr.requiere_revision);
            }

            if (estado.soloConDiferenciaCosto) {
                cumpleDiferencia = p.tiene_diferencia_costo_en_compra;
            }

            return cumpleCambio && cumpleDiferencia;
        })
        : [];

    // Log cuando cambia el filtro de diferencia de costo
    useEffect(() => {
        if (estado.soloConDiferenciaCosto) {
            console.log('🔍 Filtro de diferencia de costo ACTIVADO');
            console.log('📊 Productos con diferencia:', productosFiltered.length);
        } else {
            console.log('🔍 Filtro de diferencia de costo DESACTIVADO');
            console.log('📊 Total de productos:', estado.precios?.data?.length || 0);
        }
    }, [estado.soloConDiferenciaCosto, productosFiltered]);

    return (
        <AppLayout>
            <Head title="Gestionar Precios" />

            <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
                {/* Header */}
                <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Gestionar Precios</h1>
                                <p className="text-gray-600 dark:text-slate-400 mt-2">
                                    Revisa y actualiza precios de venta según cambios en costo de compras aprobadas
                                </p>
                            </div>
                            <Link
                                href="/compras"
                                className="px-3 py-2 bg-gray-600 dark:bg-slate-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-slate-600 text-sm font-medium transition-colors"
                            >
                                ← Volver
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Resumen de Estado */}
                    {estado.precios?.data && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {/* Total de productos */}
                            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-slate-900/50 p-6 border border-gray-200 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total de Productos</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-slate-50 mt-2">
                                            {estado.precios.data.length}
                                        </p>
                                    </div>
                                    <div className="text-4xl">📦</div>
                                </div>
                            </div>

                            {/* Productos con diferencia de costo */}
                            <div className="bg-red-50 dark:bg-red-950/20 rounded-lg shadow-sm dark:shadow-slate-900/50 p-6 border border-red-200 dark:border-red-900/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-800 dark:text-red-300">Diferencia de Costo</p>
                                        <p className="text-3xl font-bold text-red-900 dark:text-red-200 mt-2">
                                            {estado.precios.data.filter(p => p.tiene_diferencia_costo_en_compra).length}
                                        </p>
                                    </div>
                                    <div className="text-4xl">⛔</div>
                                </div>
                            </div>

                            {/* Productos con cambios pendientes */}
                            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg shadow-sm dark:shadow-slate-900/50 p-6 border border-amber-200 dark:border-amber-900/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Cambios Pendientes</p>
                                        <p className="text-3xl font-bold text-amber-900 dark:text-amber-200 mt-2">
                                            {estado.precios.data.filter(p => p.costo_cambio_reciente || p.precios.some(pr => pr.requiere_revision)).length}
                                        </p>
                                    </div>
                                    <div className="text-4xl">⚠</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Formulario de Filtros */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-slate-900/50 p-6 mb-8 border border-gray-200 dark:border-slate-700">
                        <form onSubmit={handleBuscar} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Búsqueda */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                        Buscar producto
                                    </label>
                                    <input
                                        type="text"
                                        value={filtros.q || ''}
                                        onChange={(e) =>
                                            setFiltros(prev => ({ ...prev, q: e.target.value }))
                                        }
                                        placeholder="Nombre o SKU..."
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-50 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400"
                                    />
                                </div>

                                {/* Filtro por tipo de precio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                        Tipo de Precio
                                    </label>
                                    <select
                                        value={filtros.tipo_precio_id || ''}
                                        onChange={(e) =>
                                            setFiltros(prev => ({
                                                ...prev,
                                                tipo_precio_id: e.target.value ? parseInt(e.target.value) : undefined,
                                            }))
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400"
                                    >
                                        <option value="">Todos los tipos</option>
                                        {tipos_precio.map((tipo) => (
                                            <option key={tipo.id} value={tipo.id}>
                                                {tipo.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex items-end gap-2">
                                    <button
                                        type="submit"
                                        disabled={estado.loading}
                                        className="w-full px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium disabled:opacity-50 transition-colors"
                                    >
                                        Buscar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleLimpiarFiltros}
                                        disabled={estado.loading}
                                        className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 font-medium disabled:opacity-50 transition-colors"
                                    >
                                        Limpiar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Mensajes de error */}
                    {estado.error && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg text-red-800 dark:text-red-200">
                            {estado.error}
                        </div>
                    )}

                    {/* Alertas de precios con problemas */}
                    <div className="space-y-3 mb-4">
                        {/* Alerta de diferencia de costo en compra - NUEVA LÓGICA */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-800 dark:text-blue-200 font-semibold">
                                        🔍 {estado.precios?.data?.filter(p => p.tiene_diferencia_costo_en_compra).length || 0} producto(s) con diferencia de costo en compra
                                    </span>
                                </div>
                                <button
                                    onClick={() => acciones.toggleSoloConDiferenciaCosto()}
                                    disabled={estado.precios?.data?.some(p => p.tiene_diferencia_costo_en_compra) === false}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        estado.soloConDiferenciaCosto
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 hover:bg-blue-300 dark:hover:bg-blue-800'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {estado.soloConDiferenciaCosto ? '✓ Filtrando' : 'Filtrar resultados'}
                                </button>
                            </div>
                        </div>

                        {/* Alerta de cambios recientes de costo */}
                        {estado.precios?.data && estado.precios.data.some(p => p.costo_cambio_reciente || p.precios.some(pr => pr.requiere_revision)) && (
                            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-800 dark:text-amber-200 font-semibold">
                                            ⚠ {estado.precios.data.filter(p => p.costo_cambio_reciente || p.precios.some(pr => pr.requiere_revision)).length} producto(s) con cambios de costo pendientes de revisar
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSoloConCambioCosto(!soloConCambioCosto)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            soloConCambioCosto
                                                ? 'bg-amber-600 text-white hover:bg-amber-700'
                                                : 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 hover:bg-amber-300 dark:hover:bg-amber-800'
                                        }`}
                                    >
                                        {soloConCambioCosto ? 'Mostrando solo cambios' : 'Ver solo cambios'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabla de Precios */}
                    {estado.precios && (
                        <>
                            <TablaPreciosComponent
                                productos={productosFiltered}
                                onEditarPrecio={handleEditarPrecio}
                                onVerHistorial={handleVerHistorial}
                                onBuscarCompras={handleBuscarCompras}
                                loading={estado.loading}
                            />

                            {/* Paginación */}
                            <PaginacionPreciosComponent
                                currentPage={estado.currentPage}
                                lastPage={estado.lastPage}
                                total={estado.total}
                                perPage={estado.perPage}
                                loading={estado.loading}
                                onPageChange={handleChangePage}
                            />
                        </>
                    )}
                </div>

                {/* Modal de Edición */}
                <ModalActualizarPrecioComponent
                    precio={precioSeleccionado}
                    isOpen={showModal}
                    loading={estado.loading}
                    onClose={() => {
                        setShowModal(false);
                        setPrecioSeleccionado(null);
                    }}
                    onGuardar={handleGuardarPrecio}
                />

                {/* Modal de Compras con Diferencia de Costo */}
                <ModalComprasDiferenciaCostoComponent
                    isOpen={showModalCompras}
                    onClose={handleCerrarModalCompras}
                    producto={estado.productoComprasSeleccionado}
                    precioActual={estado.precios?.data
                        .find(p => p.id === estado.productoComprasSeleccionado?.id)
                        ?.precios.find(pr => pr.tipo.codigo === 'COSTO')?.precio_actual || null}
                    precioCostoNuevo={estado.precioCostoNuevo} // ✅ NUEVO: Pasar nuevo precio de costo
                    compras={estado.comprasConDiferencia}
                    loading={estado.loadingCompras}
                    onActualizarPrecios={handleActualizarPreciosModal} // ✅ NUEVO: Callback para actualizar precios
                />
            </div>
        </AppLayout>
    );
}
