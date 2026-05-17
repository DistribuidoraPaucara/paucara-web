import React from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import toast from 'react-hot-toast';

interface Caja {
    id: number;
    nombre: string;
    ubicacion: string;
    monto_inicial_dia: number;
    activa: boolean;
}

interface Props {
    show: boolean;
    onClose: () => void;
    cajas: Caja[];
    cajaUsuarioId?: number;
}

export default function AperturaCajaModal({ show, onClose, cajas, cajaUsuarioId }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        caja_id: cajaUsuarioId?.toString() || '',
        monto_apertura: '',
        observaciones: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/cajas/abrir', {
            onSuccess: () => {
                toast.success('Caja abierta exitosamente');
                reset();
                onClose();
            },
            onError: (errors) => {
                Object.values(errors).forEach(error => {
                    toast.error(error as string);
                });
            }
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        💰 Abrir Caja del Día
                    </DialogTitle>
                    <DialogDescription>
                        Selecciona una caja e ingresa el monto inicial para comenzar el día.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="caja_id">Caja *</Label>
                        <Select
                            value={data.caja_id}
                            onValueChange={(value) => setData('caja_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una caja" />
                            </SelectTrigger>
                            <SelectContent>
                                {cajas.map((caja) => (
                                    <SelectItem key={caja.id} value={caja.id.toString()}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{caja.nombre}</span>
                                            <span className="text-xs text-blue-600">
                                                Sugerido: {formatCurrency(caja.monto_inicial_dia)}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.caja_id && (
                            <p className="text-sm text-red-600">{errors.caja_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="monto_apertura">Monto Inicial (Bs) *</Label>
                        <Input
                            id="monto_apertura"
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.monto_apertura}
                            onChange={(e) => setData('monto_apertura', e.target.value)}
                            placeholder="0.00"
                            className="text-right"
                        />
                        {errors.monto_apertura && (
                            <p className="text-sm text-red-600">{errors.monto_apertura}</p>
                        )}
                        <p className="text-xs text-gray-500">
                            Ingresa el dinero físico que tienes al abrir la caja
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea
                            id="observaciones"
                            value={data.observaciones}
                            onChange={(e) => setData('observaciones', e.target.value)}
                            placeholder="Notas adicionales sobre la apertura..."
                            rows={3}
                        />
                        {errors.observaciones && (
                            <p className="text-sm text-red-600">{errors.observaciones}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.caja_id || !data.monto_apertura}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {processing ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Abriendo...
                                </span>
                            ) : (
                                '🔓 Abrir Caja'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
