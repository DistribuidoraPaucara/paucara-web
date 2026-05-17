// components/Export/PrintableContent.tsx
import React, { forwardRef } from 'react';
import { formatCurrency } from '@/lib/utils';
import type { Compra } from '@/domain/entities/compras';

interface PrintableContentProps {
    compra: Compra;
    title?: string;
}

export const PrintableContent = forwardRef<HTMLDivElement, PrintableContentProps>(
    ({ compra, title = 'Compra' }, ref) => {
        console.log('PrintableContent renderizado con compra:', compra?.numero);

        return (
            <div
                ref={ref}
                id="printable-content"
                className="print-content p-8 bg-white text-black"
            >
                {/* Header */}
                <div className="text-center mb-8 pb-4 border-b-2 border-gray-300">
                    <h1 className="text-3xl font-bold mb-2">Distribuidora Paucará</h1>
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <p className="text-sm text-gray-600 mt-2">
                        Fecha de emisión: {new Date().toLocaleDateString('es-ES')}
                    </p>
                </div>

                {/* Información General */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">
                        Información General
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">Número de Compra:</p>
                            <p className="text-lg font-mono">{compra.numero}</p>
                        </div>
                        <div>
                            <p className="font-medium">Fecha:</p>
                            <p>{new Date(compra.fecha).toLocaleDateString('es-ES')}</p>
                        </div>
                        <div>
                            <p className="font-medium">Estado:</p>
                            <p className={`font-medium ${compra.estado_documento?.nombre.toLowerCase() === 'completada'
                                ? 'text-green-600'
                                : compra.estado_documento?.nombre.toLowerCase() === 'pendiente'
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                }`}>
                                {compra.estado_documento?.nombre || 'Sin estado'}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium">Moneda:</p>
                            <p>{compra.moneda ? `${compra.moneda.simbolo} ${compra.moneda.nombre}` : 'No especificada'}</p>
                        </div>
                    </div>
                </div>

                {/* Información del Proveedor */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">
                        Proveedor
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">Nombre:</p>
                            <p>{compra.proveedor?.nombre || 'No especificado'}</p>
                        </div>
                        {compra.proveedor?.razon_social && (
                            <div>
                                <p className="font-medium">Razón Social:</p>
                                <p>{compra.proveedor.razon_social}</p>
                            </div>
                        )}
                        {compra.proveedor?.nit && (
                            <div>
                                <p className="font-medium">NIT:</p>
                                <p className="font-mono">{compra.proveedor.nit}</p>
                            </div>
                        )}
                        {compra.proveedor?.telefono && (
                            <div>
                                <p className="font-medium">Teléfono:</p>
                                <p>{compra.proveedor.telefono}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detalles de Productos */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">
                        Detalles de Productos
                    </h3>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">Producto</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Cantidad</th>
                                <th className="border border-gray-300 px-4 py-2 text-right">Precio Unit.</th>
                                <th className="border border-gray-300 px-4 py-2 text-right">Subtotal</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Lote</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Vencimiento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(compra.detalles || []).map((detalle, index) => (
                                <tr key={detalle.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div>
                                            <p className="font-medium">{detalle.producto.nombre}</p>
                                            {detalle.producto.codigo && (
                                                <p className="text-sm text-gray-600 font-mono">
                                                    Código: {detalle.producto.codigo}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center font-mono">
                                        {detalle.cantidad.toLocaleString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-right font-mono">
                                        {formatCurrency(Number(detalle.precio_unitario), compra.moneda?.simbolo || '$')}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-right font-mono font-semibold">
                                        {formatCurrency(Number(detalle.subtotal), compra.moneda?.simbolo || '$')}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {detalle.lote || '-'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {detalle.fecha_vencimiento
                                            ? new Date(detalle.fecha_vencimiento).toLocaleDateString('es-ES')
                                            : '-'
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Resumen Financiero */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">
                        Resumen Financiero
                    </h3>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-mono">{formatCurrency(Number(compra.subtotal), compra.moneda?.simbolo || '$')}</span>
                            </div>
                            {compra.descuento > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Descuento:</span>
                                    <span className="font-mono">-{formatCurrency(Number(compra.descuento), compra.moneda?.simbolo || '$')}</span>
                                </div>
                            )}
                            {compra.impuesto > 0 && (
                                <div className="flex justify-between">
                                    <span>Impuestos:</span>
                                    <span className="font-mono">{formatCurrency(Number(compra.impuesto), compra.moneda?.simbolo || '$')}</span>
                                </div>
                            )}
                        </div>
                        <div className="border-t-2 border-gray-300 pt-2">
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total:</span>
                                <span className="font-mono">{formatCurrency(Number(compra.total), compra.moneda?.simbolo || '$')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información de Auditoría */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">
                        Información de Auditoría
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-medium">Registrado por:</p>
                            <p>{compra.usuario?.name || 'Usuario no especificado'}</p>
                        </div>
                        <div>
                            <p className="font-medium">Creada:</p>
                            <p>{compra.created_at ? new Date(compra.created_at).toLocaleString('es-ES') : 'Fecha no disponible'}</p>
                        </div>
                        <div>
                            <p className="font-medium">Última modificación:</p>
                            <p>{compra.updated_at ? new Date(compra.updated_at).toLocaleString('es-ES') : 'Fecha no disponible'}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-600 mt-8 pt-4 border-t border-gray-300">
                    <p>Documento generado por el sistema de Distribuidora Paucará</p>
                    <p>Fecha de generación: {new Date().toLocaleString('es-ES')}</p>
                </div>
            </div>
        );
    }
);

PrintableContent.displayName = 'PrintableContent';
