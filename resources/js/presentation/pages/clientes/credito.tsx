import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { ArrowLeft, AlertTriangle, ChevronRight, ChevronDown, DollarSign } from 'lucide-react';
import RegistrarPagoModal from '@/presentation/components/clientes/RegistrarPagoModal';
import { FormatoSelector, ImprimirCuentaButton, ImprimirPagoButton } from '@/presentation/components/impresion';

// Import services
import { creditoService } from '@/infrastructure/services/credito.service';
import NotificationService from '@/infrastructure/services/notification.service';

// Import domain helpers
import { getCreditoColorByEstado, getCreditoEstadoLabel, type CreditoEstado } from '@/domain/entities/credito';

// Import types
import type { CuentaPorCobrarDetalle, PagoDetalle, AuditoriaCredito, CambioAuditoria, CuentaPorCobrarExpandible } from '@/types/credito.types';

interface CreditoDetallesData {
    cliente: {
        id: number;
        nombre: string;
        codigo: string;
        nit: string;
        email: string;
        telefono: string;
        activo: boolean;
    };
    credito: {
        limite_credito: number;
        saldo_utilizado: number;
        saldo_disponible: number;
        porcentaje_utilizacion: number;
        estado: CreditoEstado;
    };
    cuentas_pendientes: {
        total: number;
        monto_total: number;
        cuentas_vencidas: number;
        dias_maximo_vencido: number;
        detalles: CuentaPorCobrarDetalle[];
    };
    todas_las_cuentas: CuentaPorCobrarExpandible[];
    historial_pagos: PagoDetalle[];
    auditoria: AuditoriaCredito[];
}

export default function CreditoPage() {
    const { clienteId, tipos_pago = [] } = usePage<{ clienteId: number; tipos_pago?: Array<{ id: number; nombre: string; codigo: string }> }>().props;
    const [credito, setCredito] = useState<CreditoDetallesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCuentaId, setSelectedCuentaId] = useState<number | undefined>(undefined);
    const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pendientes' | 'pagados'>('pendientes');
    const [expandedCuentaId, setExpandedCuentaId] = useState<number | null>(null);

    // ✅ Nuevos filtros FASE 1
    const [filtroVencimiento, setFiltroVencimiento] = useState<'todos' | 'vencidas' | 'proximas' | 'aldia'>('todos');
    const [fechaVencimientoDesde, setFechaVencimientoDesde] = useState<string>('');
    const [fechaVencimientoHasta, setFechaVencimientoHasta] = useState<string>('');
    const [ordenarPor, setOrdenarPor] = useState<'vencimiento' | 'monto' | 'dias_vencido'>('vencimiento');
    const [buscarActivado, setBuscarActivado] = useState(true);
    const [filtrosVisibles, setFiltrosVisibles] = useState(false);
    const [pagoAAnular, setPagoAAnular] = useState<{ id: number; monto: number } | null>(null);
    const [motivoAnulacion, setMotivoAnulacion] = useState('');
    const [anulando, setAnulando] = useState(false);

    useEffect(() => {
        cargarDetallesCredito();
    }, [clienteId]);

    const cargarDetallesCredito = async () => {
        try {
            setLoading(true);
            setError('');

            // Use creditoService instead of axios
            const response = await creditoService.obtenerDetallesCliente(clienteId);

            if (response && response.data) {
                setCredito(response.data);
            } else {
                throw new Error('Estructura de respuesta inválida');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar los detalles de crédito';
            setError(message);
            NotificationService.error(message);
            console.error('Error cargando detalles de crédito:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnularPago = async () => {
        if (!pagoAAnular) return;

        try {
            setAnulando(true);
            const response = await fetch(`/api/clientes/pagos/${pagoAAnular.id}/anular`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    motivo: motivoAnulacion,
                }),
            });

            const data = await response.json();

            if (data.success) {
                NotificationService.success(`Pago de Bs ${formatCurrency(pagoAAnular.monto)} anulado exitosamente`);
                setPagoAAnular(null);
                setMotivoAnulacion('');
                await cargarDetallesCredito();
            } else {
                NotificationService.error(data.message || 'Error al anular el pago');
            }
        } catch (error) {
            console.error('Error anulando pago:', error);
            NotificationService.error('Error al anular el pago');
        } finally {
            setAnulando(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    // ✅ Filtrar y ordenar cuentas con FASE 1 completa
    const cuentasFiltradas = React.useMemo(() => {
        if (!credito?.todas_las_cuentas) return [];

        // Si la búsqueda no está activada, mostrar cuentas pendientes por defecto
        if (!buscarActivado) {
            return credito.todas_las_cuentas.filter(c => c.saldo_pendiente > 0);
        }

        let cuentas = credito.todas_las_cuentas;
        const hoy = new Date();

        // 1️⃣ Filtro por estado (pendientes/pagados/todos)
        switch (filtroEstado) {
            case 'pendientes':
                cuentas = cuentas.filter(c => c.saldo_pendiente > 0);
                break;
            case 'pagados':
                cuentas = cuentas.filter(c => c.saldo_pendiente === 0);
                break;
            default:
                break;
        }

        // 2️⃣ Filtro por estado de vencimiento
        switch (filtroVencimiento) {
            case 'vencidas':
                cuentas = cuentas.filter(c => c.dias_vencido > 0);
                break;
            case 'proximas':
                // Próximas a vencer: entre hoy y 3 días
                cuentas = cuentas.filter(c => {
                    const fechaVenc = new Date(c.fecha_vencimiento);
                    const diasHastaVencimiento = Math.ceil((fechaVenc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
                    return diasHastaVencimiento >= 0 && diasHastaVencimiento <= 3 && c.dias_vencido <= 0;
                });
                break;
            case 'aldia':
                cuentas = cuentas.filter(c => c.dias_vencido <= 0);
                break;
            default:
                break;
        }

        // 3️⃣ Filtro por rango de fechas de vencimiento
        if (fechaVencimientoDesde || fechaVencimientoHasta) {
            cuentas = cuentas.filter(c => {
                const fechaVenc = new Date(c.fecha_vencimiento).toISOString().split('T')[0];
                const desde = fechaVencimientoDesde ? fechaVencimientoDesde : '1900-01-01';
                const hasta = fechaVencimientoHasta ? fechaVencimientoHasta : '2100-12-31';
                return fechaVenc >= desde && fechaVenc <= hasta;
            });
        }

        // 4️⃣ Ordenamiento
        const cuentasOrdenadas = [...cuentas];
        switch (ordenarPor) {
            case 'vencimiento':
                cuentasOrdenadas.sort((a, b) =>
                    new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime()
                );
                break;
            case 'monto':
                cuentasOrdenadas.sort((a, b) => b.saldo_pendiente - a.saldo_pendiente);
                break;
            case 'dias_vencido':
                cuentasOrdenadas.sort((a, b) => b.dias_vencido - a.dias_vencido);
                break;
            default:
                break;
        }

        return cuentasOrdenadas;
    }, [credito?.todas_las_cuentas, filtroEstado, filtroVencimiento, fechaVencimientoDesde, fechaVencimientoHasta, ordenarPor, buscarActivado]);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex h-96 items-center justify-center">
                    <div className="text-center">
                        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                        <p className="text-gray-600 dark:text-gray-400">Cargando detalles de crédito...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!credito) {
        return (
            <AppLayout>
                <div className="space-y-4">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error || 'Error al cargar los datos de crédito'}</AlertDescription>
                    </Alert>
                </div>
            </AppLayout>
        );
    }

    const { cliente, credito: creditoData, cuentas_pendientes, auditoria } = credito;

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.history.back()}
                                className="mr-2"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Button>
                        </div>
                        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                            {cliente.nombre}
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Código: {cliente.codigo} | NIT: {cliente.nit}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <FormatoSelector
                            documentoId={Number(clienteId)}
                            tipoDocumento="credito"
                            className="bg-green-600 text-white hover:bg-green-700"
                        />
                        <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white hover:bg-blue-700">
                            Registrar Pago
                        </Button>
                    </div>
                </div>

                {/* Alertas de estado crítico */}
                {cuentas_pendientes.cuentas_vencidas > 0 && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            ⚠️ Este cliente tiene {cuentas_pendientes.cuentas_vencidas} cuenta(s) vencida(s) por{' '}
                            {cuentas_pendientes.dias_maximo_vencido} días
                        </AlertDescription>
                    </Alert>
                )}

                {creditoData.porcentaje_utilizacion > 100 && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            ⚠️ Este cliente ha excedido su límite de crédito en {(creditoData.porcentaje_utilizacion - 100).toFixed(0)}%
                        </AlertDescription>
                    </Alert>
                )}

                {/* Estado de Crédito */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Estado del Crédito</CardTitle>
                                <Badge className={getCreditoColorByEstado(creditoData.estado)}>
                                    {getCreditoEstadoLabel(creditoData.estado)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Límite de Crédito</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(creditoData.limite_credito)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Saldo Disponible</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(creditoData.saldo_disponible)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Utilización: {creditoData.porcentaje_utilizacion.toFixed(1)}%
                                    </p>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className={`h-full transition-all ${creditoData.porcentaje_utilizacion > 100
                                            ? 'bg-red-600'
                                            : creditoData.porcentaje_utilizacion > 80
                                                ? 'bg-yellow-500'
                                                : 'bg-green-600'
                                            }`}
                                        style={{
                                            width: `${Math.min(creditoData.porcentaje_utilizacion, 100)}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resumen de Deuda */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumen de Deuda</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Saldo Utilizado</p>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(creditoData.saldo_utilizado)}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Cuentas Pendientes</p>
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {cuentas_pendientes.total}
                                    </Badge>
                                </div>

                                {cuentas_pendientes.cuentas_vencidas > 0 && (
                                    <>
                                        <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-red-600 dark:text-red-400">Cuentas Vencidas</p>
                                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                    {cuentas_pendientes.cuentas_vencidas}
                                                </Badge>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between">
                                                <p className="text-sm text-red-600 dark:text-red-400">Días Máximo Vencido</p>
                                                <p className="font-bold text-red-600 dark:text-red-400">
                                                    {cuentas_pendientes.dias_maximo_vencido} días
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabla Unificada de Cuentas Por Cobrar con Pagos Expandibles */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Cuentas Por Cobrar</CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFiltrosVisibles(!filtrosVisibles)}
                                className="text-xs"
                            >
                                {filtrosVisibles ? '🔼 Ocultar Filtros' : '🔽 Mostrar Filtros'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Filtros */}
                        <div className="mb-6 flex flex-wrap gap-2">
                            <Button
                                variant={filtroEstado === 'todos' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFiltroEstado('todos')}
                            >
                                Todos ({credito?.todas_las_cuentas.length || 0})
                            </Button>
                            <Button
                                variant={filtroEstado === 'pendientes' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFiltroEstado('pendientes')}
                            >
                                Pendientes ({credito?.cuentas_pendientes.total || 0})
                            </Button>
                            <Button
                                variant={filtroEstado === 'pagados' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFiltroEstado('pagados')}
                            >
                                Pagados ({(credito?.todas_las_cuentas.length || 0) - (credito?.cuentas_pendientes.total || 0)})
                            </Button>
                        </div>

                        {/* ✅ FASE 1: Filtros Avanzados */}
                        {filtrosVisibles && (
                            <div className="w-full space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                                {/* Filtro por Vencimiento */}
                                <div className="w-full">
                                    <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Estado de Vencimiento
                                    </p>
                                    <div className="flex w-full flex-wrap gap-2">
                                        <Button
                                            variant={filtroVencimiento === 'todos' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setFiltroVencimiento('todos')}
                                        >
                                            Todo
                                        </Button>
                                        <Button
                                            variant={filtroVencimiento === 'vencidas' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setFiltroVencimiento('vencidas')}
                                            className={filtroVencimiento === 'vencidas' ? 'bg-red-600 hover:bg-red-700' : ''}
                                        >
                                            ⚠️ Vencidas
                                        </Button>
                                        <Button
                                            variant={filtroVencimiento === 'proximas' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setFiltroVencimiento('proximas')}
                                            className={filtroVencimiento === 'proximas' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                                        >
                                            ⏳ Próximas a Vencer
                                        </Button>
                                        <Button
                                            variant={filtroVencimiento === 'aldia' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setFiltroVencimiento('aldia')}
                                            className={filtroVencimiento === 'aldia' ? 'bg-green-600 hover:bg-green-700' : ''}
                                        >
                                            ✅ Al Día
                                        </Button>
                                    </div>
                                </div>

                                {/* Rango de Fechas de Vencimiento */}
                                <div className="w-full">
                                    <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Rango de Vencimiento
                                    </p>
                                    <div className="flex w-full flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600 dark:text-gray-400">Desde:</label>
                                            <input
                                                type="date"
                                                value={fechaVencimientoDesde}
                                                onChange={(e) => setFechaVencimientoDesde(e.target.value)}
                                                className="rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600 dark:text-gray-400">Hasta:</label>
                                            <input
                                                type="date"
                                                value={fechaVencimientoHasta}
                                                onChange={(e) => setFechaVencimientoHasta(e.target.value)}
                                                className="rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            />
                                        </div>
                                        {(fechaVencimientoDesde || fechaVencimientoHasta) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setFechaVencimientoDesde('');
                                                    setFechaVencimientoHasta('');
                                                }}
                                                className="text-xs"
                                            >
                                                Limpiar fechas
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Ordenamiento */}
                                <div className="w-full">
                                    <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Ordenar por
                                    </p>
                                    <select
                                        value={ordenarPor}
                                        onChange={(e) => setOrdenarPor(e.target.value as 'vencimiento' | 'monto' | 'dias_vencido')}
                                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="vencimiento">📅 Por Vencimiento (próximas primero)</option>
                                        <option value="monto">💰 Por Monto (mayor primero)</option>
                                        <option value="dias_vencido">⚠️ Por Días Vencido (más vencidas primero)</option>
                                    </select>
                                </div>

                                {/* Botón de Búsqueda */}
                                <div className="flex w-full gap-2">
                                    <Button
                                        onClick={() => setBuscarActivado(true)}
                                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        🔍 Buscar
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setFiltroEstado('pendientes');
                                            setFiltroVencimiento('todos');
                                            setFechaVencimientoDesde('');
                                            setFechaVencimientoHasta('');
                                            setOrdenarPor('vencimiento');
                                            setBuscarActivado(false);
                                        }}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        ↺ Limpiar
                                    </Button>
                                </div>

                                {/* Resumen de Resultados */}
                                <div className="w-full border-t border-gray-200 pt-3 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <strong>{cuentasFiltradas.length}</strong> cuenta(s) encontrada(s)
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Tabla */}
                        {cuentasFiltradas.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                                        <tr>
                                            <th className="w-10"></th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                                                Venta
                                            </th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                                                Fecha
                                            </th>
                                            <th className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">
                                                Monto Original
                                            </th>
                                            <th className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">
                                                Pagado
                                            </th>
                                            <th className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">
                                                Saldo Pendiente
                                            </th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                                                Vencimiento
                                            </th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                                                Estado
                                            </th>
                                            <th className="px-4 py-2 text-center font-semibold text-gray-900 dark:text-white">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {cuentasFiltradas.map((cuenta) => {
                                            const montoPagado = cuenta.monto_original - cuenta.saldo_pendiente;
                                            const isExpanded = expandedCuentaId === cuenta.id;

                                            return (
                                                <React.Fragment key={cuenta.id}>
                                                    {/* Fila principal */}
                                                    <tr className={cuenta.dias_vencido > 0 ? 'bg-red-50 dark:bg-red-950' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}>
                                                        {/* Botón expandir */}
                                                        <td className="w-10 px-3 py-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                                            onClick={() => setExpandedCuentaId(isExpanded ? null : cuenta.id)}
                                                            title={cuenta.pagos.length > 0 ? "Ver pagos de esta cuenta" : "No hay pagos registrados"}
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronDown className="w-4 h-4 text-indigo-600" />
                                                            ) : (
                                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-gray-900 dark:text-white">#{cuenta.numero_venta} | #{cuenta.venta_id}</td>
                                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                                            {new Date(cuenta.fecha_venta).toLocaleDateString('es-BO')}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                                                            {formatCurrency(cuenta.monto_original)}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">
                                                            {formatCurrency(montoPagado)}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                                                            {formatCurrency(cuenta.saldo_pendiente)}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                                            {new Date(cuenta.fecha_vencimiento).toLocaleDateString('es-BO')}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {cuenta.dias_vencido > 0 ? (
                                                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                                    {cuenta.dias_vencido} días vencido
                                                                </Badge>
                                                            ) : cuenta.saldo_pendiente === 0 ? (
                                                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                                    Pagado
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                    Al día
                                                                </Badge>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-center space-x-2 flex justify-center">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => {
                                                                    setSelectedCuentaId(cuenta.id);
                                                                    setShowModal(true);
                                                                }}
                                                                title={`Registrar pago para ${cuenta.numero_venta}`}
                                                            >
                                                                <DollarSign className="h-4 w-4 text-green-600" />
                                                            </Button>
                                                            <ImprimirCuentaButton
                                                                clienteId={Number(clienteId)}
                                                                cuentaId={cuenta.id}
                                                                numeroVenta={cuenta.numero_venta}
                                                            />
                                                        </td>
                                                    </tr>

                                                    {/* Fila expandida con pagos */}
                                                    {isExpanded && (
                                                        <tr className="bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-l-indigo-600">
                                                            <td colSpan={9} className="px-6 py-4">
                                                                {cuenta.pagos.length > 0 ? (
                                                                    <div className="space-y-3">
                                                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                            💰 Pagos registrados ({cuenta.pagos.length})
                                                                        </h4>

                                                                        <table className="min-w-full text-sm">
                                                                            <thead className="bg-gray-100 dark:bg-gray-800">
                                                                                <tr>
                                                                                    <th className="px-3 py-2 text-left text-gray-900 dark:text-white">Fecha</th>
                                                                                    <th className="px-3 py-2 text-right text-gray-900 dark:text-white">Monto</th>
                                                                                    <th className="px-3 py-2 text-left text-gray-900 dark:text-white">Tipo Pago</th>
                                                                                    <th className="px-3 py-2 text-left text-gray-900 dark:text-white">Recibo</th>
                                                                                    <th className="px-3 py-2 text-left text-gray-900 dark:text-white">N° Pago</th>
                                                                                    <th className="px-3 py-2 text-left text-gray-900 dark:text-white">Estado</th>
                                                                                    <th className="px-3 py-2 text-left text-gray-900 dark:text-white">Registrado Por</th>
                                                                                    <th className="px-3 py-2 text-left text-gray-900 dark:text-white">Observaciones</th>
                                                                                    <th className="px-3 py-2 text-center text-gray-900 dark:text-white">Acciones</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                                                {cuenta.pagos.map((pago) => (
                                                                                    <tr key={pago.id} className="text-gray-700 dark:text-gray-300">
                                                                                        <td className="px-3 py-2">{new Date(pago.fecha_pago).toLocaleDateString('es-BO')}</td>
                                                                                        <td className="px-3 py-2 text-right font-bold text-green-600 dark:text-green-400">{formatCurrency(pago.monto)}</td>
                                                                                        <td className="px-3 py-2">
                                                                                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{pago.tipo_pago || 'N/A'}</Badge>
                                                                                        </td>
                                                                                        <td className="px-3 py-2 font-mono text-xs">{pago.numero_recibo || '-'}</td>
                                                                                        <td className="px-3 py-2 font-mono text-xs text-purple-600 dark:text-purple-400">{pago.numero_pago || '-'}</td>
                                                                                        <td className="px-3 py-2">
                                                                                            <Badge className={pago.estado === 'REGISTRADO'
                                                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                                            }>
                                                                                                {pago.estado === 'REGISTRADO' ? '✅ Registrado' : '❌ Anulado'}
                                                                                            </Badge>
                                                                                        </td>
                                                                                        <td className="px-3 py-2">{pago.usuario || 'Sistema'}</td>
                                                                                        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400">{pago.observaciones || '-'}</td>
                                                                                        <td className="px-3 py-2 text-center flex gap-2 justify-center">
                                                                                            <ImprimirPagoButton
                                                                                                clienteId={Number(clienteId)}
                                                                                                pagoId={pago.id}
                                                                                                montoFormato={formatCurrency(pago.monto)}
                                                                                            />
                                                                                            <Button
                                                                                                variant="destructive"
                                                                                                size="sm"
                                                                                                onClick={() => setPagoAAnular({ id: pago.id, monto: pago.monto })}
                                                                                                title="Anular este pago"
                                                                                            >
                                                                                                ❌ Anular
                                                                                            </Button>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                ) : (
                                                                    <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                                                                        <p className="text-sm">📋 No hay pagos registrados para esta cuenta</p>
                                                                        <p className="text-xs mt-2">Usa el botón "Registrar Pago" en la parte superior para registrar un pago</p>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-600 dark:text-gray-400">
                                No hay cuentas {filtroEstado === 'pendientes' ? 'pendientes' : filtroEstado === 'pagados' ? 'pagadas' : ''}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Auditoría de Crédito */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Auditoría de Crédito</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {auditoria.length > 0 ? (
                            <div className="space-y-4">
                                {auditoria.map((audit) => (
                                    <div
                                        key={audit.id}
                                        className="border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-950"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {audit.responsable}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(audit.fecha).toLocaleDateString('es-BO', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {audit.accion}
                                            </Badge>
                                        </div>
                                        {audit.cambios && (
                                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                                {Object.entries(audit.cambios)
                                                    .map(([key, value]: [string, CambioAuditoria]) => `${key}: ${value.anterior} → ${value.actual}`)
                                                    .join(', ')}
                                            </p>
                                        )}
                                        {audit.motivo && (
                                            <p className="mt-1 text-sm italic text-gray-600 dark:text-gray-400">
                                                Motivo: {audit.motivo}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-600 dark:text-gray-400">
                                No hay cambios de crédito registrados
                            </div>
                        )}
                    </CardContent>
                </Card> */}
            </div>

            {/* Modal para registrar pago */}
            {(() => {
                const cuentasFiltradas = Array.isArray(credito?.todas_las_cuentas)
                    ? credito.todas_las_cuentas.filter((c) => (c.saldo_pendiente ?? 0) > 0)
                    : [];

                // 🔍 Debug: Log de cuentas a pasar al modal
                if (showModal) {
                    console.log('credito.tsx - Cuentas filtradas para modal:', {
                        totalCuentas: credito?.todas_las_cuentas?.length ?? 0,
                        cuentasConSaldo: cuentasFiltradas.length,
                        cuentas: cuentasFiltradas,
                    });
                }

                return (
                    <RegistrarPagoModal
                        show={showModal}
                        onHide={() => {
                            setShowModal(false);
                            setSelectedCuentaId(undefined);
                        }}
                        clienteId={Number(clienteId)}
                        cuentasPendientes={cuentasFiltradas}
                        cuentaIdPreseleccionada={selectedCuentaId}
                        onPagoRegistrado={() => {
                            setShowModal(false);
                            setSelectedCuentaId(undefined);
                            cargarDetallesCredito();
                        }}
                        tipos_pago={tipos_pago}
                    />
                );
            })()}

            {/* Modal de confirmación para anular pago */}
            {pagoAAnular && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                ⚠️ Anular Pago
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                                <p className="text-sm text-red-800 dark:text-red-300">
                                    ¿Está seguro de que desea anular este pago de <strong>{formatCurrency(pagoAAnular.monto)}</strong>?
                                </p>
                                <p className="text-xs text-red-700 dark:text-red-400 mt-2">
                                    Esta acción no puede deshacerse. Se revertirán todos los movimientos asociados.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-white">
                                    Motivo de anulación (opcional)
                                </label>
                                <textarea
                                    value={motivoAnulacion}
                                    onChange={(e) => setMotivoAnulacion(e.target.value)}
                                    placeholder="Ej: Pago registrado erróneamente, cliente no confirma..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
                                    rows={3}
                                    disabled={anulando}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setPagoAAnular(null);
                                        setMotivoAnulacion('');
                                    }}
                                    disabled={anulando}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleAnularPago}
                                    disabled={anulando}
                                    className="flex-1"
                                >
                                    {anulando ? '⏳ Anulando...' : '❌ Anular Pago'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </AppLayout>
    );
}
