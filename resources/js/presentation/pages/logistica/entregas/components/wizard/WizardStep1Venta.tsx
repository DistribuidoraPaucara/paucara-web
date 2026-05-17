import { useState, useMemo } from 'react';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Card } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Search, Package, DollarSign } from 'lucide-react';
import type { VentaConDetalles } from '@/domain/entities/entregas';
import type { WizardFormData } from '../EntregaFormWizard';

interface WizardStep1VentaProps {
    ventas: VentaConDetalles[];
    formData: WizardFormData;
    onUpdate: (data: Partial<WizardFormData>) => void;
}

export default function WizardStep1Venta({
    ventas,
    formData,
    onUpdate,
}: WizardStep1VentaProps) {
    const [busqueda, setBusqueda] = useState('');

    const ventasFiltradas = useMemo(() => {
        if (!busqueda.trim()) return ventas;

        const query = busqueda.toLowerCase();
        return ventas.filter(
            (v) =>
                v.numero_venta.toLowerCase().includes(query) ||
                v.cliente.nombre.toLowerCase().includes(query)
        );
    }, [ventas, busqueda]);

    const selectedVenta = ventas.find((v) => v.id === formData.venta_id);

    // Calcular peso automáticamente del desglose
    const calculatePeso = (venta: VentaConDetalles): number => {
        if (!venta.detalles || venta.detalles.length === 0) return 0;
        // Asumir 2kg por unidad (ajustable según realidad)
        return venta.detalles.reduce((total, det) => total + det.cantidad * 2, 0);
    };

    const handleSelectVenta = (venta: VentaConDetalles) => {
        const pesoCalculado = calculatePeso(venta);
        const direccionCliente = venta.cliente.nombre; // En realidad obtendría de cliente.direccion

        onUpdate({
            venta_id: venta.id,
            peso_kg: pesoCalculado,
            direccion_entrega: direccionCliente,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="busqueda" className="dark:text-gray-300">
                    Buscar Venta
                </Label>
                <div className="relative mt-2">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                        id="busqueda"
                        placeholder="Número de venta o nombre de cliente..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="pl-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                </div>
            </div>

            {/* Lista de ventas */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {ventasFiltradas.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            No hay ventas que coincidan con tu búsqueda
                        </p>
                    </div>
                ) : (
                    ventasFiltradas.map((venta) => (
                        <Card
                            key={venta.id}
                            onClick={() => handleSelectVenta(venta)}
                            className={`cursor-pointer transition-all ${formData.venta_id === venta.id
                                    ? 'ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                    : 'hover:shadow-md dark:hover:bg-slate-800'
                                } dark:bg-slate-900 dark:border-slate-700`}
                        >
                            <div className="p-4 space-y-3">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {venta.numero_venta}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {venta.cliente.nombre}
                                        </p>
                                    </div>
                                    {formData.venta_id === venta.id && (
                                        <Badge className="bg-blue-500 dark:bg-blue-600">
                                            Seleccionada
                                        </Badge>
                                    )}
                                </div>

                                {/* Detalles */}
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                    {/* Total */}
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Total</p>
                                            <p className="font-semibold dark:text-white">
                                                Bs {venta.subtotal.toLocaleString('es-BO', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Artículos */}
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Artículos</p>
                                            <p className="font-semibold dark:text-white">
                                                {venta.detalles?.length || 0}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Peso estimado */}
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Peso est.</p>
                                            <p className="font-semibold dark:text-white">
                                                {calculatePeso(venta)} kg
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Desglose de artículos */}
                                {venta.detalles && venta.detalles.length > 0 && (
                                    <div className="pt-3 border-t dark:border-slate-700">
                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                            Artículos:
                                        </p>
                                        <div className="space-y-1">
                                            {venta.detalles.map((det, idx) => (
                                                <div
                                                    key={idx}
                                                    className="text-xs text-gray-600 dark:text-gray-400 flex justify-between"
                                                >
                                                    <span>
                                                        {det.producto.nombre} ({det.cantidad}x)
                                                    </span>
                                                    <span className="font-semibold dark:text-gray-300">
                                                        Bs {det.precio_unitario.toLocaleString('es-BO', {
                                                            minimumFractionDigits: 2,
                                                        })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Resumen de selección */}
            {selectedVenta && (
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <div className="p-4 space-y-2">
                        <p className="font-semibold text-green-900 dark:text-green-200">
                            ✓ Venta seleccionada correctamente
                        </p>
                        <div className="text-sm text-green-800 dark:text-green-300 space-y-1">
                            <p>
                                <strong>Dirección de entrega:</strong> {formData.direccion_entrega}
                            </p>
                            <p>
                                <strong>Peso estimado:</strong> {formData.peso_kg} kg
                            </p>
                            <p>
                                <strong>Artículos:</strong> {selectedVenta.detalles?.length || 0}
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
