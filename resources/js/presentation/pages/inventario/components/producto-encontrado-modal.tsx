import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { CheckCircle2, Barcode, Package, Package2 } from 'lucide-react';

interface ProductoEncontradoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmar: () => void;
    producto: {
        id: number;
        nombre: string;
        sku?: string | null;
        codigoDetectado: string;
        codigosBarra?: Array<{ codigo: string }>;
        categoria?: { nombre: string };
        marca?: { nombre: string };
    };
}

export default function ProductoEncontradoModal({
    isOpen,
    onClose,
    onConfirmar,
    producto,
}: ProductoEncontradoModalProps) {
    const botonConfirmarRef = useRef<HTMLButtonElement>(null);

    // Auto-focus en el botón primario cuando se abre el modal
    useEffect(() => {
        if (isOpen && botonConfirmarRef.current) {
            setTimeout(() => {
                botonConfirmarRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <DialogTitle>Producto Encontrado</DialogTitle>
                    </div>
                    <DialogDescription>
                        Confirma para agregarlo al listado de inventario
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Nombre del producto - destacado */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                            <Package2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                    Producto
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100 break-words">
                                    {producto.nombre}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SKU */}
                    {producto.sku && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-fit">
                                📊 SKU:
                            </span>
                            <span className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                                {producto.sku}
                            </span>
                        </div>
                    )}

                    {/* Código detectado - resaltado */}
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Barcode className="h-4 w-4" />
                            Código detectado
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 border-2 border-blue-300 dark:border-blue-700">
                            <p className="text-lg font-mono font-bold text-blue-900 dark:text-blue-100 break-all">
                                {producto.codigoDetectado}
                            </p>
                        </div>
                    </div>

                    {/* Otros códigos de barras */}
                    {Array.isArray(producto.codigosBarra) && producto.codigosBarra.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                🔖 Otros códigos
                            </p>
                            <div className="space-y-1 pl-3">
                                {producto.codigosBarra.map((cb, idx) => (
                                    <p
                                        key={idx}
                                        className="text-sm text-gray-600 dark:text-gray-400 font-mono break-all"
                                    >
                                        • {cb.codigo}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Categoría y Marca */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        {producto.categoria && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                    Categoría
                                </p>
                                <p className="text-sm text-amber-900 dark:text-amber-100 font-medium truncate">
                                    {producto.categoria.nombre}
                                </p>
                            </div>
                        )}

                        {producto.marca && (
                            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                                <p className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                                    Marca
                                </p>
                                <p className="text-sm text-purple-900 dark:text-purple-100 font-medium truncate">
                                    {producto.marca.nombre}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        Cancelar
                    </Button>
                    <Button
                        ref={botonConfirmarRef}
                        type="button"
                        onClick={onConfirmar}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white gap-2"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Agregar al Listado
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
