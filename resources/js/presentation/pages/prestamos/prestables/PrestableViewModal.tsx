import React from 'react';
import { Button } from '@/presentation/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/presentation/components/ui/dialog';
import { Edit2 } from 'lucide-react';

interface PrestableViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: () => void;
    prestable: any | null;
}

export default function PrestableViewModal({
    open,
    onOpenChange,
    onEdit,
    prestable,
}: PrestableViewModalProps) {
    if (!prestable) return null;

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                style={{ width: '90vw', maxWidth: '90vw' }}
                className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 p-0"
            >
                <DialogHeader className="px-6 pt-6 sticky top-0 bg-white dark:bg-gray-900 z-10 border-b border-gray-200 dark:border-gray-700">
                    <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        Detalles de {getTipoLabel(prestable.tipo)}
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 py-6 space-y-6">
                    {/* Información Básica */}
                    <section className="space-y-3">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                            📋 Información Básica
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                            {prestable.id && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        ID
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        #{prestable.id}
                                    </p>
                                </div>
                            )}
                            {prestable.nombre && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Nombre
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {prestable.nombre}
                                    </p>
                                </div>
                            )}
                            {prestable.codigo && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Código
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {prestable.codigo}
                                    </p>
                                </div>
                            )}
                            {prestable.tipo && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tipo
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {getTipoLabel(prestable.tipo)}
                                    </p>
                                </div>
                            )}
                            {prestable.capacidad && prestable.tipo === 'CANASTILLA' && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Capacidad
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {prestable.capacidad} embases
                                    </p>
                                </div>
                            )}
                            {prestable.descripcion && (
                                <div className="col-span-2 md:col-span-3">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Descripción
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {prestable.descripcion}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Producto Vinculado */}
                    {prestable.producto && (
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                📦 Producto Vinculado
                            </h3>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {prestable.producto.nombre}
                                </p>
                                {prestable.producto.sku && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        SKU: {prestable.producto.sku}
                                    </p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Productos Relacionados */}
                    {prestable.productos && prestable.productos.length > 0 && (
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                🔗 Productos Relacionados (Variantes)
                            </h3>
                            <div className="space-y-2">
                                {prestable.productos.map((prod: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {prod.nombre}
                                            </p>
                                            {prod.sku && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    SKU: {prod.sku}
                                                </p>
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
                    {prestable.prestablePadre && prestable.tipo === 'EMBASES' && (
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                🔗 Canastilla Relacionada
                            </h3>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {prestable.prestablePadre.nombre}
                                </p>
                                {prestable.prestablePadre.codigo && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Código: {prestable.prestablePadre.codigo}
                                    </p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Precios */}
                    {prestable.precios && prestable.precios.length > 0 && (
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                💰 Precios
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {prestable.precios.map((precio: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                                    >
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {getPrecioLabel(precio.tipo_precio)}
                                        </p>
                                        <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                                            ${parseFloat(precio.valor).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Condiciones */}
                    {prestable.condiciones && prestable.condiciones.length > 0 && (
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                📋 Condiciones
                            </h3>
                            <div className="space-y-3">
                                {prestable.condiciones.map((condicion: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            {condicion.garantia !== undefined && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Garantía
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {condicion.garantia} días
                                                    </p>
                                                </div>
                                            )}
                                            {condicion.daño_total !== undefined && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Daño Total
                                                    </p>
                                                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                        ${parseFloat(condicion.daño_total).toFixed(2)}
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
                    <section className="space-y-3">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                            📊 Estado
                        </h3>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            {prestable.activo ? (
                                <>
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40">
                                        ✅
                                    </span>
                                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                                        Activo
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40">
                                        ❌
                                    </span>
                                    <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                                        Inactivo
                                    </span>
                                </>
                            )}
                        </div>
                    </section>
                </div>

                <DialogFooter className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 sticky bottom-0">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cerrar
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={onEdit} className="gap-2">
                        <Edit2 size={16} />
                        Editar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
