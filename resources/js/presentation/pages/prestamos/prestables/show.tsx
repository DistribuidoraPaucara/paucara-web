import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Edit2 } from 'lucide-react';
import type { Prestable } from '@/domain/entities/prestamos';

interface ShowProps {
    prestable: Prestable;
}

export default function Show({ prestable }: ShowProps) {

    const getTipoLabel = (tipo: string) => {
        return tipo === 'CANASTILLA' ? '📦 Canastilla' : '🔖 Embases';
    };

    const getPrecioLabel = (tipo: string) => {
        switch (tipo) {
            case 'COMPRA':
                return '📦 Precio Compra';
            case 'PRESTAMO':
                return '💰 Precio Préstamo';
            case 'VENTA':
                return '🛒 Precio Venta';
            case 'DAÑO_TOTAL':
                return '💥 Precio por Daño Total';
            default:
                return tipo;
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Préstamos', href: '/prestamos' },
        { title: 'Prestables', href: '/prestamos/prestables' },
        { title: prestable.nombre, href: '#' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={prestable.nombre} />

            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {getTipoLabel(prestable.tipo)}: {prestable.nombre}
                    </h1>
                    <Button
                        onClick={() => router.visit(`/prestamos/prestables/${prestable.id}/edit`)}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Edit2 size={18} />
                        Editar
                    </Button>
                </div>

                <div className="space-y-6">
                    {/* Información Básica */}
                    <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                            📋 Información Básica
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">#{prestable.id}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{prestable.nombre}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{prestable.codigo}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{getTipoLabel(prestable.tipo)}</p>
                            </div>
                            {prestable.capacidad && prestable.tipo === 'CANASTILLA' && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacidad</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{prestable.capacidad} embases</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Producto Vinculado */}
                    {prestable.producto && (
                        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                📦 Producto Vinculado
                            </h2>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{prestable.producto.nombre}</p>
                                {prestable.producto.sku && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">SKU: {prestable.producto.sku}</p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Productos Relacionados */}
                    {(prestable as any).productos && (prestable as any).productos.length > 0 && (
                        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                🔗 Productos Relacionados (Variantes)
                            </h2>
                            <div className="space-y-2">
                                {(prestable as any).productos.map((prod: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{prod.nombre}</p>
                                            {prod.sku && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400">SKU: {prod.sku}</p>
                                            )}
                                        </div>
                                        {prod.pivot?.es_principal && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200">
                                                ⭐ Principal
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Canastilla Relacionada */}
                    {(prestable as any).prestable_padre && prestable.tipo === 'EMBASES' && (
                        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                🔗 Canastilla Relacionada
                            </h2>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{(prestable as any).prestable_padre.nombre}</p>
                                {(prestable as any).prestable_padre.codigo && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Código: {(prestable as any).prestable_padre.codigo}</p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Precios */}
                    {prestable.precios && prestable.precios.length > 0 && (
                        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                💰 Precios
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {prestable.precios.map((precio, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {getPrecioLabel(precio.tipo_precio)}
                                        </p>
                                        <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                                            Bs {parseFloat(precio.valor.toString()).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Condiciones */}
                    {prestable.condiciones && prestable.condiciones.length > 0 && (
                        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                📋 Condiciones
                            </h2>
                            <div className="space-y-2">
                                {prestable.condiciones.map((condicion: any, idx: number) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="grid grid-cols-2 gap-4">
                                            {condicion.monto_garantia !== undefined && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Garantía</p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {condicion.monto_garantia} días
                                                    </p>
                                                </div>
                                            )}
                                            {condicion.monto_daño_total !== undefined && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Daño Total</p>
                                                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                        ${parseFloat(condicion.monto_daño_total.toString()).toFixed(2)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Estado */}
                    <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                            📊 Estado
                        </h2>
                        <div className="flex items-center gap-3">
                            {prestable.activo ? (
                                <>
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40">
                                        ✅
                                    </span>
                                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">Activo</span>
                                </>
                            ) : (
                                <>
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40">
                                        ❌
                                    </span>
                                    <span className="text-sm font-semibold text-red-700 dark:text-red-300">Inactivo</span>
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
