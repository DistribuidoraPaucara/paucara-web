import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { AlertCircle, CreditCard, Save, ArrowLeft } from 'lucide-react';
import type { CuentaPorPagar } from '@/domain/entities/compras';
import type { TipoPago } from '@/domain/entities/tipos-pago';

// Helper functions
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('es-BO');
};

interface Props extends InertiaPageProps {
    cuentasPorPagar: CuentaPorPagar[];
    tiposPago: TipoPago[];
    cuentaSeleccionada?: CuentaPorPagar;
}

const PagosCreate: React.FC<Props> = ({
    cuentasPorPagar = [],
    tiposPago = [],
    cuentaSeleccionada
}) => {
    // Filtrar tipos de pago para excluir CREDITO (incoherente para pagos de compras)
    const tiposPagoFiltrados = tiposPago.filter(
        tipo => !tipo.codigo || !tipo.codigo.toUpperCase().includes('CREDITO')
    );

    // Si no hay cuenta seleccionada, usar la primera disponible
    const cuentaDefault = cuentaSeleccionada ||
        (Array.isArray(cuentasPorPagar) && cuentasPorPagar.length > 0 ? cuentasPorPagar[0] : null);

    const [cuentaSeleccionadaLocal, setCuentaSeleccionadaLocal] = useState<CuentaPorPagar | null>(cuentaDefault || null);
    const [montoMaximo, setMontoMaximo] = useState<number>(cuentaDefault?.saldo_pendiente || 0);

    const { data, setData, post, processing, errors, reset } = useForm({
        cuenta_por_pagar_id: cuentaDefault?.id?.toString() || '',
        monto: '',
        fecha_pago: new Date().toISOString().split('T')[0],
        tipo_pago_id: '',
        numero_recibo: '',
        numero_cheque: '',
        numero_transferencia: '',
        observaciones: '',
    });

    useEffect(() => {
        if (cuentaDefault) {
            setCuentaSeleccionadaLocal(cuentaDefault);
            setMontoMaximo(cuentaDefault.saldo_pendiente);
            setData('cuenta_por_pagar_id', cuentaDefault.id.toString());
        }
    }, [cuentaDefault, setData]);

    const handleCuentaChange = (cuentaId: string) => {
        const cuenta = cuentasPorPagar.find(c => c.id.toString() === cuentaId);
        setCuentaSeleccionadaLocal(cuenta || null);
        setMontoMaximo(cuenta?.saldo_pendiente || 0);
        setData('cuenta_por_pagar_id', cuentaId);
        setData('monto', '0'); // Reset monto cuando cambia la cuenta
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/compras/pagos', {
            onSuccess: () => {
                reset();
                router.get('/compras/pagos');
            }
        });
    };

    const esMontoValido = () => {
        const monto = parseFloat(data.monto.toString());
        return monto > 0 && monto <= montoMaximo;
    };

    const getTipoReferenciaField = () => {
        const tipoSeleccionado = tiposPagoFiltrados.find(t => t.id.toString() === data.tipo_pago_id);
        if (!tipoSeleccionado) return null;

        const codigo = tipoSeleccionado.codigo?.toLowerCase();

        if (codigo?.includes('efectivo')) {
            return (
                <div className="space-y-2">
                    <label className="text-sm font-medium">N° Recibo</label>
                    <Input
                        value={data.numero_recibo || ''}
                        onChange={(e) => setData('numero_recibo', e.target.value)}
                        placeholder="Número de recibo"
                    />
                    {errors.numero_recibo && (
                        <p className="text-sm text-red-600">{errors.numero_recibo}</p>
                    )}
                </div>
            );
        }

        if (codigo?.includes('cheque')) {
            return (
                <div className="space-y-2">
                    <label className="text-sm font-medium">N° Cheque</label>
                    <Input
                        value={data.numero_cheque || ''}
                        onChange={(e) => setData('numero_cheque', e.target.value)}
                        placeholder="Número de cheque"
                    />
                    {errors.numero_cheque && (
                        <p className="text-sm text-red-600">{errors.numero_cheque}</p>
                    )}
                </div>
            );
        }

        if (codigo?.includes('transferencia') || codigo?.includes('banco')) {
            return (
                <div className="space-y-2">
                    <label className="text-sm font-medium">N° Transferencia</label>
                    <Input
                        value={data.numero_transferencia || ''}
                        onChange={(e) => setData('numero_transferencia', e.target.value)}
                        placeholder="Número de transferencia"
                    />
                    {errors.numero_transferencia && (
                        <p className="text-sm text-red-600">{errors.numero_transferencia}</p>
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Compras', href: '/compras' },
            { title: 'Pagos', href: '/compras/pagos' },
            { title: 'Registrar Pago', href: '/compras/pagos/create' }
        ]}>
            <Head title="Registrar Pago" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Registrar Pago</h1>
                        <p className="text-gray-600 dark:text-gray-400">Registrar un nuevo pago a proveedor</p>
                    </div>
                    <Button
                        onClick={() => router.get('/compras/pagos')}
                        variant="outline"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Formulario Principal */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Selección de Cuenta por Pagar */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Cuenta por Pagar
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Seleccionar Cuenta *</label>
                                        <select
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md"
                                            value={data.cuenta_por_pagar_id}
                                            onChange={(e) => handleCuentaChange(e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccione una cuenta por pagar</option>
                                            {Array.isArray(cuentasPorPagar) && cuentasPorPagar.length > 0 ? (
                                                cuentasPorPagar.filter(c => c.estado !== 'PAGADO').map((cuenta) => (
                                                    <option key={cuenta.id} value={cuenta.id}>
                                                        {cuenta.compra?.proveedor?.nombre} - {cuenta.compra?.numero}
                                                        (Saldo: {formatCurrency(cuenta.saldo_pendiente)})
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No hay cuentas por pagar disponibles</option>
                                            )}
                                        </select>
                                        {errors.cuenta_por_pagar_id && (
                                            <p className="text-sm text-red-600">{errors.cuenta_por_pagar_id}</p>
                                        )}
                                    </div>

                                    {cuentaSeleccionadaLocal && (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                                Información de la Cuenta
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-blue-700 dark:text-blue-300">Proveedor:</span>
                                                    <p className="font-medium">{cuentaSeleccionadaLocal.compra?.proveedor?.nombre}</p>
                                                </div>
                                                <div>
                                                    <span className="text-blue-700 dark:text-blue-300">Compra:</span>
                                                    <p className="font-medium">{cuentaSeleccionadaLocal.compra?.numero}</p>
                                                </div>
                                                <div>
                                                    <span className="text-blue-700 dark:text-blue-300">Monto Original:</span>
                                                    <p className="font-medium">{formatCurrency(cuentaSeleccionadaLocal.monto_original)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-blue-700 dark:text-blue-300">Saldo Pendiente:</span>
                                                    <p className="font-medium text-red-600">{formatCurrency(cuentaSeleccionadaLocal.saldo_pendiente)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-blue-700 dark:text-blue-300">Vencimiento:</span>
                                                    <p className="font-medium">{formatDate(cuentaSeleccionadaLocal.fecha_vencimiento)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-blue-700 dark:text-blue-300">Estado:</span>
                                                    <Badge variant={cuentaSeleccionadaLocal.estado === 'VENCIDO' ? 'destructive' : 'default'}>
                                                        {cuentaSeleccionadaLocal.estado}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Datos del Pago */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Datos del Pago</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Monto *</label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                max={montoMaximo}
                                                value={data.monto}
                                                onChange={(e) => setData('monto', e.target.value)}
                                                placeholder="0.00"
                                                required
                                                className={!esMontoValido() && data.monto ? 'border-red-500' : ''}
                                            />
                                            {!esMontoValido() && data.monto && (
                                                <p className="text-sm text-red-600 dark:text-red-400">
                                                    El monto debe ser mayor a 0 y no puede exceder {formatCurrency(montoMaximo)}
                                                </p>
                                            )}
                                            {errors.monto && (
                                                <p className="text-sm text-red-600 dark:text-red-400">{errors.monto}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Pago *</label>
                                            <Input
                                                type="date"
                                                value={data.fecha_pago}
                                                onChange={(e) => setData('fecha_pago', e.target.value)}
                                                required
                                            />
                                            {errors.fecha_pago && (
                                                <p className="text-sm text-red-600 dark:text-red-400">{errors.fecha_pago}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Pago *</label>
                                            <select
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md"
                                                value={data.tipo_pago_id}
                                                onChange={(e) => setData('tipo_pago_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Seleccione el tipo de pago</option>
                                                {tiposPagoFiltrados.map((tipo) => (
                                                    <option key={tipo.id} value={tipo.id}>
                                                        {tipo.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.tipo_pago_id && (
                                                <p className="text-sm text-red-600 dark:text-red-400">{errors.tipo_pago_id}</p>
                                            )}
                                        </div>

                                        {getTipoReferenciaField()}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</label>
                                        <textarea
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md"
                                            rows={3}
                                            value={data.observaciones}
                                            onChange={(e) => setData('observaciones', e.target.value)}
                                            placeholder="Observaciones adicionales del pago..."
                                        />
                                        {errors.observaciones && (
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.observaciones}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Panel de Resumen */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Resumen del Pago</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {cuentaSeleccionadaLocal && (
                                        <>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Saldo Actual:</span>
                                                    <span className="font-medium text-red-600 dark:text-red-400">
                                                        {formatCurrency(cuentaSeleccionadaLocal.saldo_pendiente)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Monto a Pagar:</span>
                                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                                        {data.monto ? formatCurrency(parseFloat(data.monto.toString())) : formatCurrency(0)}
                                                    </span>
                                                </div>
                                                <hr className="dark:border-gray-600" />
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Saldo Restante:</span>
                                                    <span className="font-bold text-green-600 dark:text-green-400">
                                                        {data.monto
                                                            ? formatCurrency(cuentaSeleccionadaLocal.saldo_pendiente - parseFloat(data.monto.toString()))
                                                            : formatCurrency(cuentaSeleccionadaLocal.saldo_pendiente)
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            {data.monto && parseFloat(data.monto.toString()) >= cuentaSeleccionadaLocal.saldo_pendiente && (
                                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                    <div className="flex items-center">
                                                        <AlertCircle className="w-4 h-4 text-green-600 mr-2" />
                                                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                                            Esta cuenta quedará PAGADA
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="space-y-2 pt-4 border-t dark:border-gray-600">
                                        <Button
                                            type="submit"
                                            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                                            disabled={processing || !esMontoValido() || !data.cuenta_por_pagar_id || !data.tipo_pago_id}
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {processing ? 'Registrando...' : 'Registrar Pago'}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => router.get('/compras/pagos')}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Ayuda */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        Ayuda
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                        <p>• Seleccione la cuenta por pagar correspondiente</p>
                                        <p>• El monto no puede exceder el saldo pendiente</p>
                                        <p>• Complete los datos de referencia según el tipo de pago</p>
                                        <p>• Las observaciones son opcionales pero recomendadas</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default PagosCreate;
