import React from 'react';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface BorradorItem {
    id?: number;
    producto_id: number;
    almacen_id: number;
    cantidad?: number;
    lote?: string;
    fecha_vencimiento?: string;
    precio_costo?: number;
}

interface Borrador {
    id: number;
    estado: 'borrador' | 'completado';
    items: BorradorItem[];
}

interface Props {
    borrador: Borrador;
}

export default function EstadoBorrador({ borrador }: Props) {
    // Analizar estado del borrador
    const totalItems = borrador.items.length;
    const itemsConCantidad = borrador.items.filter(item => item.cantidad && item.cantidad > 0).length;
    const itemsSinCantidad = totalItems - itemsConCantidad;
    const porcentajeComplecion = totalItems > 0 ? (itemsConCantidad / totalItems) * 100 : 0;

    // Agrupar por producto para ver cuántos están completamente registrados
    const productosUnicos = new Set(borrador.items.map(item => item.producto_id)).size;

    return (
        <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                {/* Grid responsivo */}
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-6">
                    {/* Productos */}
                    <div className="text-center">
                        <div className="text-xl sm:text-3xl font-bold text-blue-600">{productosUnicos}</div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Productos</p>
                    </div>

                    {/* Items completados */}
                    <div className="text-center">
                        <div className="text-xl sm:text-3xl font-bold text-green-600">{itemsConCantidad}</div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Completados</p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div
                                className="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                style={{ width: `${porcentajeComplecion}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Items pendientes */}
                    <div className="text-center">
                        <div className="text-xl sm:text-3xl font-bold text-orange-600">{itemsSinCantidad}</div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Pendientes</p>
                    </div>
                </div>

                {/* Estado del borrador - responsivo */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        {borrador.estado === 'completado' ? (
                            <>
                                <CheckCircle2 className="h-5 w-5 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-xs sm:text-sm text-green-700">Completado</p>
                                    <p className="text-xs sm:text-sm text-gray-600">Inventario inicial registrado</p>
                                </div>
                            </>
                        ) : itemsSinCantidad > 0 ? (
                            <>
                                <AlertCircle className="h-5 w-5 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-xs sm:text-sm text-orange-700">En progreso</p>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        {itemsSinCantidad} item(s) sin cantidad
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-5 w-5 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-xs sm:text-sm text-green-700">Listo</p>
                                    <p className="text-xs sm:text-sm text-gray-600">Todos los items completados</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
