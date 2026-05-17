import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Label } from '@/presentation/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';
import { X, Plus, Loader2 } from 'lucide-react';

interface DesglosePago {
    tipo_pago_id: number;
    tipo_pago_nombre: string;
    monto: number;
    referencia?: string;
}

interface TipoPago {
    id: number;
    nombre: string;
}

interface CorregirPagoModalProps {
    isOpen: boolean;
    onClose: () => void;
    entregaId: number;
    ventaId: number;
    ventaNumero: string;
    ventaTotal: number;
    desgloseActual: DesglosePago[];
    tiposPago: TipoPago[];
}

export function CorregirPagoModal({
    isOpen,
    onClose,
    entregaId,
    ventaId,
    ventaNumero,
    ventaTotal,
    desgloseActual,
    tiposPago,
}: CorregirPagoModalProps) {
    const [desglose, setDesglose] = useState<DesglosePago[]>(desgloseActual);
    const [observacion, setObservacion] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalRecibido = desglose.reduce((sum, p) => sum + (p.monto || 0), 0);
    const montoPendiente = Math.max(0, ventaTotal - totalRecibido);

    // Determinar estado de pago
    const determinarEstadoPago = () => {
        const esCredito = desglose.some(p =>
            p.tipo_pago_nombre.toLowerCase().includes('crédito') ||
            p.tipo_pago_nombre.toLowerCase().includes('credito')
        );

        if (totalRecibido >= ventaTotal) {
            return 'PAGADO';
        } else if (esCredito && totalRecibido === 0) {
            return 'CREDITO';
        } else if (totalRecibido > 0) {
            return 'PARCIAL';
        }
        return 'NO_PAGADO';
    };

    const estadoPago = determinarEstadoPago();

    const getEstadoColor = () => {
        switch (estadoPago) {
            case 'PAGADO':
                return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
            case 'PARCIAL':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
            case 'CREDITO':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
            default:
                return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
        }
    };

    const agregarPago = () => {
        setDesglose([
            ...desglose,
            {
                tipo_pago_id: 0,
                tipo_pago_nombre: '',
                monto: 0,
                referencia: '',
            },
        ]);
    };

    const eliminarPago = (index: number) => {
        setDesglose(desglose.filter((_, i) => i !== index));
    };

    const actualizarPago = (index: number, field: keyof DesglosePago, value: any) => {
        const newDesglose = [...desglose];
        newDesglose[index] = {
            ...newDesglose[index],
            [field]: value,
        };
        setDesglose(newDesglose);
        setError(null);
    };

    const handleClose = () => {
        setDesglose(desgloseActual);
        setObservacion('');
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        // Validaciones
        if (desglose.length === 0) {
            setError('Debe agregar al menos un pago');
            toast.error('Debe agregar al menos un pago');
            return;
        }

        // Validar que cada pago tenga tipo y monto
        for (let i = 0; i < desglose.length; i++) {
            if (!desglose[i].tipo_pago_id || desglose[i].tipo_pago_id === 0) {
                setError(`El pago ${i + 1} debe tener un tipo de pago seleccionado`);
                toast.error(`El pago ${i + 1} debe tener un tipo de pago seleccionado`);
                return;
            }
            if (desglose[i].monto <= 0) {
                setError(`El pago ${i + 1} debe tener un monto mayor a 0`);
                toast.error(`El pago ${i + 1} debe tener un monto mayor a 0`);
                return;
            }
        }

        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch(`/api/entregas/${entregaId}/ventas/${ventaId}/corregir-pago`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    desglose_pagos: desglose,
                    observacion: observacion.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al corregir pagos');
            }

            toast.success('✅ Pagos corregidos exitosamente');

            // Limpiar estado
            setDesglose(desgloseActual);
            setObservacion('');
            setError(null);

            // Cerrar modal
            handleClose();

            // Recargar página
            router.reload();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error(`❌ ${message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        ✏️ Corregir Pagos - {ventaNumero}
                    </DialogTitle>
                    <DialogDescription>
                        Modifica los pagos registrados para esta venta
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Información de la venta */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div>
                            <p className="text-xs text-muted-foreground">Monto Total</p>
                            <p className="text-lg font-semibold">${ventaTotal.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Recibido</p>
                            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                ${totalRecibido.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Monto Pendiente</p>
                            <p className={`text-lg font-semibold ${montoPendiente > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                ${montoPendiente.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Estado de Pago</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getEstadoColor()}`}>
                                {estadoPago}
                            </span>
                        </div>
                    </div>

                    {/* Tabla de pagos */}
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Desglose de Pagos</Label>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-100 dark:bg-slate-800">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-medium">Tipo de Pago</th>
                                            <th className="px-3 py-2 text-left font-medium">Monto</th>
                                            <th className="px-3 py-2 text-left font-medium">Referencia</th>
                                            <th className="px-3 py-2 text-center font-medium w-10">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {desglose.map((pago, index) => (
                                            <tr key={index} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="px-3 py-2">
                                                    <Select
                                                        value={String(pago.tipo_pago_id)}
                                                        onValueChange={(value) => {
                                                            const tipo = tiposPago.find(t => String(t.id) === value);
                                                            if (tipo) {
                                                                actualizarPago(index, 'tipo_pago_id', tipo.id);
                                                                actualizarPago(index, 'tipo_pago_nombre', tipo.nombre);
                                                            }
                                                        }}
                                                        disabled={isSaving}
                                                    >
                                                        <SelectTrigger className="w-full h-8">
                                                            <SelectValue placeholder="Seleccionar tipo" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {tiposPago.map((tipo) => (
                                                                <SelectItem key={tipo.id} value={String(tipo.id)}>
                                                                    {tipo.nombre}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={pago.monto || ''}
                                                        onChange={(e) => actualizarPago(index, 'monto', parseFloat(e.target.value) || 0)}
                                                        className="w-full h-8"
                                                        disabled={isSaving}
                                                        step="0.01"
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <Input
                                                        type="text"
                                                        placeholder="Ref. (ej: cheque #123)"
                                                        value={pago.referencia || ''}
                                                        onChange={(e) => actualizarPago(index, 'referencia', e.target.value)}
                                                        className="w-full h-8"
                                                        disabled={isSaving}
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <button
                                                        onClick={() => eliminarPago(index)}
                                                        disabled={isSaving}
                                                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={agregarPago}
                            disabled={isSaving}
                            className="mt-2 gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Agregar Pago
                        </Button>
                    </div>

                    {/* Observación */}
                    <div>
                        <Label htmlFor="observacion" className="text-sm font-medium mb-2 block">
                            Observación (Opcional)
                        </Label>
                        <Textarea
                            id="observacion"
                            placeholder="Describe el motivo de la corrección de pagos..."
                            value={observacion}
                            onChange={(e) => {
                                setObservacion(e.target.value);
                                setError(null);
                            }}
                            className="min-h-[80px]"
                            disabled={isSaving}
                        />
                        {error && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                                ❌ {error}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSaving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving || desglose.length === 0}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            '✏️ Guardar Corrección'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
