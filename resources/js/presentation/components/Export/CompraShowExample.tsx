import React from 'react';
import { ExportButtons, PrintableContent } from '@/presentation/components/Export';
import { compraToExportData, getDefaultCompraExportOptions } from '@/lib/export-helpers';
import type { Compra } from '@/domain/entities/compras';

interface CompraShowProps {
    compra: Compra;
}

export default function CompraShow({ compra }: CompraShowProps) {
    // Preparar datos para exportación
    const exportData = compraToExportData(compra);
    const exportOptions = getDefaultCompraExportOptions(compra);

    return (
        <div className="space-y-6">
            {/* Contenido principal de la compra */}
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-4">
                    Compra #{compra.numero}
                </h1>

                {/* Información de la compra */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <h3 className="font-semibold">Proveedor</h3>
                        <p>{compra.proveedor?.nombre || 'N/A'}</p>
                        <p className="text-sm text-gray-600">NIT: {compra.proveedor?.nit || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Fecha</h3>
                        <p>{new Date(compra.fecha).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">
                            Estado: {compra.estado_documento?.nombre || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Botones de exportación */}
                <div className="flex justify-end mb-4">
                    <ExportButtons
                        data={exportData}
                        options={exportOptions}
                        showPDF={true}
                        showExcel={true}
                        showCSV={true}
                        showPrint={true}
                        onExportStart={() => console.log('Iniciando exportación...')}
                        onExportEnd={() => console.log('Exportación completada')}
                        onExportError={(error) => console.error('Error en exportación:', error)}
                    />
                </div>

                {/* Tabla de productos */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Producto</th>
                                <th className="px-4 py-2 text-right">Cantidad</th>
                                <th className="px-4 py-2 text-right">Precio Unit.</th>
                                <th className="px-4 py-2 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {compra.detalles?.map((detalle, index) => (
                                <tr key={detalle.id || index} className="border-t">
                                    <td className="px-4 py-2">{detalle.producto?.nombre || 'N/A'}</td>
                                    <td className="px-4 py-2 text-right">{detalle.cantidad}</td>
                                    <td className="px-4 py-2 text-right">
                                        {compra.moneda?.simbolo || '$'}{detalle.precio_unitario.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {compra.moneda?.simbolo || '$'}{detalle.subtotal.toFixed(2)}
                                    </td>
                                </tr>
                            )) || []}
                        </tbody>
                        <tfoot className="bg-gray-50">
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-right font-semibold">
                                    Subtotal:
                                </td>
                                <td className="px-4 py-2 text-right font-semibold">
                                    {compra.moneda?.simbolo || '$'}{compra.subtotal.toFixed(2)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-right font-semibold">
                                    Descuento:
                                </td>
                                <td className="px-4 py-2 text-right font-semibold">
                                    {compra.moneda?.simbolo || '$'}{compra.descuento.toFixed(2)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-right font-semibold">
                                    Impuesto:
                                </td>
                                <td className="px-4 py-2 text-right font-semibold">
                                    {compra.moneda?.simbolo || '$'}{compra.impuesto.toFixed(2)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-right font-semibold">
                                    Total:
                                </td>
                                <td className="px-4 py-2 text-right font-semibold">
                                    {compra.moneda?.simbolo || '$'}{compra.total.toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Contenido para impresión (oculto en pantalla) */}
            <div className="hidden print:block">
                <PrintableContent
                    compra={compra}
                    title={`Compra ${compra.numero}`}
                />
            </div>
        </div>
    );
}
