import type { Entrega, VentaEntrega } from '@/domain/entities/entregas';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { ConfirmacionesModal } from '@/presentation/components/ventas/ConfirmacionesModal';
import RegistrarConfirmacionModal from '@/presentation/components/ventas/RegistrarConfirmacionModal';
import { Link } from '@inertiajs/react';
import { CheckCircle, ChevronDown, Eye, Navigation, Plus, ShoppingCart } from 'lucide-react';
import React, { useState } from 'react';
import { ReasignarVentaModal } from './ReasignarVentaModal';

interface DesglosePago {
    tipo_pago_id: number;
    tipo_pago_nombre: string;
    monto: number;
    referencia?: string;
}

interface VentasEntregaSectionProps {
    entrega?: Entrega;
    ventas: VentaEntrega[];
    totalVentas?: number;
    onCorregirPago?: (ventaId: number, ventaNumero: string, ventaTotal: number, desglose: DesglosePago[]) => void;
    onConfirmarEntrega?: (venta: VentaEntrega) => void;
}

const getEstadoColor = (estado: string) => {
    const estadoMap: Record<string, string> = {
        EN_PREPARACION: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
        EN_TRANSITO: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
        ENTREGADA: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        PROBLEMAS: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
        CANCELADA: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
        PROGRAMADO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    };
    return estadoMap[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
};

const getTipoPagoColor = (codigo?: string) => {
    const tipoPagoMap: Record<string, string> = {
        EFECTIVO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        TRANSFERENCIA: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
        CHEQUE: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
        CREDITO: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
        QR: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200',
    };
    return tipoPagoMap[codigo || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
};

const getEstadoDocumentoColor = (codigo?: string) => {
    const estadoDocumentoMap: Record<string, { clase: string; emoji: string; nombre: string }> = {
        BORRADOR: {
            clase: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200',
            emoji: '📝',
            nombre: 'Borrador',
        },
        PENDIENTE: {
            clase: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
            emoji: '⏳',
            nombre: 'Pendiente',
        },
        APROBADO: {
            clase: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
            emoji: '✅',
            nombre: 'Aprobado',
        },
        FACTURADO: {
            clase: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
            emoji: '📄',
            nombre: 'Facturado',
        },
        ANULADO: {
            clase: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
            emoji: '❌',
            nombre: 'Anulado',
        },
        CANCELADO: {
            clase: 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-100',
            emoji: '🚫',
            nombre: 'Cancelado',
        },
    };

    const estado = estadoDocumentoMap[codigo || ''] || {
        clase: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
        emoji: '❓',
        nombre: 'Desconocido',
    };

    return { ...estado };
};

export default function VentasEntregaSection({ entrega, ventas, onCorregirPago, onConfirmarEntrega }: VentasEntregaSectionProps) {
    // console.log('🚀 ~ file: VentasEntregaSection.tsx:1 ~ VentasEntregaSection ~ entrega:', entrega);
    // console.log('🚀 ~ file: VentasEntregaSection.tsx:1 ~ VentasEntregaSection ~ ventas:', ventas);
    const [expandedVentaId, setExpandedVentaId] = useState<number | null>(null);
    const [reasignarModalOpen, setReasignarModalOpen] = useState(false);
    const [ventaAReasignar, setVentaAReasignar] = useState<VentaEntrega | undefined>(undefined);
    // ✅ NUEVO: Estados para modales de confirmación
    const [showConfirmacionesModal, setShowConfirmacionesModal] = useState(false);
    const [ventaSeleccionadaModal, setVentaSeleccionadaModal] = useState<VentaEntrega | null>(null);
    const [showRegistrarConfirmacionModal, setShowRegistrarConfirmacionModal] = useState(false);

    // ✅ Helper para obtener la ÚLTIMA confirmación de una venta
    const obtenerConfirmacionVenta = (ventaId: number) => {
        if (!entrega?.confirmacionesVentas) return null;
        return entrega.confirmacionesVentas.find((c: any) => c.venta_id === ventaId);
    };

    // ✅ NUEVO: Helper para obtener TODAS las confirmaciones de una venta
    const obtenerTodasConfirmacionesVenta = (ventaId: number) => {
        if (!entrega?.confirmacionesVentas) return [];
        return entrega.confirmacionesVentas.filter((c: any) => c.venta_id === ventaId);
    };

    if (!ventas || ventas.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400">
                    <ShoppingCart className="h-5 w-5" />
                    <p className="text-gray-600 dark:text-slate-300">No hay ventas asociadas a esta entrega</p>
                </div>
            </div>
        );
    }

    const montoTotal = ventas.reduce((sum, v) => sum + (typeof v.subtotal === 'string' ? parseFloat(v.subtotal) : v.subtotal || 0), 0);

    // Usar el peso de la entrega si está disponible, sino calcular desde las ventas
    let pesoTotal = 0;
    if (entrega?.peso_kg) {
        pesoTotal = typeof entrega.peso_kg === 'string' ? parseFloat(entrega.peso_kg) : entrega.peso_kg;
    } else {
        pesoTotal = ventas.reduce((sum, v) => sum + (v.peso_estimado || 0), 0);
    }
    pesoTotal = Number(pesoTotal) || 0;

    return (
        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            {/* Header */}
            <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Ventas asignadas
                </h2>

                {/* Resumen de métricas */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-50/50 p-2 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/70">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Ventas</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{ventas.length}</p>
                    </div>
                    <div className="rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-green-50/50 p-2 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/70">
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">Monto Total</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">Bs. {montoTotal.toFixed(2)}</p>
                    </div>
                    <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-50/50 p-2 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/70">
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Peso Total</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{pesoTotal.toFixed(2)} kg</p>
                    </div>
                </div>
            </div>

            {/* Tabla de ventas */}
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Header de tabla */}
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-900/80">
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Folio</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Cliente</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Monto</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Estado Venta</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Logistica</th>
                                {/* <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Entrega</th> */}
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Confirmacion</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Peso</th>
                                <th className="w-12 px-2 py-2 text-center text-sm font-semibold text-gray-900 dark:text-white">-</th>
                            </tr>
                        </thead>

                        {/* Body de tabla */}
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {ventas.map((venta, index) => {
                                const isExpanded = expandedVentaId === Number(venta.id);
                                const ventaTotal = (typeof venta.subtotal === 'string' ? parseFloat(venta.subtotal) : venta.subtotal) || 0;
                                const pesoVenta = venta.peso_total_estimado || 0;

                                return (
                                    <React.Fragment key={`venta-${venta.id}`}>
                                        {/* Fila principal de la venta */}
                                        <tr className="transition hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                            <td className="px-2 py-4">
                                                <Link
                                                    href={`/ventas/${venta.id}`}
                                                    className="rounded bg-gray-200 px-2 py-1 font-mono text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                                >
                                                    {venta.id ? `#${venta.id}` : 'Venta Desconocida'}
                                                </Link>
                                            </td>
                                            <td className="px-2 py-4">
                                                <p className="text-xs text-gray-900 dark:text-white">{venta.cliente?.nombre || 'N/A'}</p>
                                            </td>

                                            <td className="px-2 py-4 text-left">
                                                <p>
                                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                                        Bs. {ventaTotal.toFixed(2)}
                                                    </span>
                                                </p>
                                                <Badge className={getTipoPagoColor(venta.tipo_pago?.codigo)}>
                                                    💳 {venta.tipo_pago?.nombre || 'N/A'}
                                                </Badge>
                                            </td>
                                            <td className="px-2 py-4 text-left">
                                                {(() => {
                                                    const estado = getEstadoDocumentoColor(venta.estado_documento?.codigo);
                                                    return (
                                                        <Badge className={estado.clase}>
                                                            {estado.emoji} {estado.nombre}
                                                        </Badge>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-2 py-4 text-left">
                                                {(() => {
                                                    const estado = venta.estado_logistica;
                                                    if (!estado) {
                                                        return <Badge className={getEstadoColor('PROGRAMADO')}>📦 PROGRAMADO</Badge>;
                                                    }

                                                    // ✅ NUEVO: Usar color e icono del backend
                                                    const bgColor = estado.color || '#e5e7eb';
                                                    const textColor = estado.color
                                                        ? `hsl(0, 0%, 100%)`
                                                        : '#1f2937';

                                                    return (
                                                        <div
                                                            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs"
                                                            style={{
                                                                backgroundColor: bgColor + '20', // 20% opacity
                                                                color: bgColor,
                                                                border: `1.5px solid ${bgColor}`,
                                                            }}
                                                            title={estado.nombre}
                                                        >
                                                            <span className="text-base leading-none">{estado.icono || '📦'}</span>
                                                            <span className="font-semibold">{estado.nombre || estado.codigo}</span>
                                                        </div>
                                                    );
                                                })()}
                                            </td>
                                            {/* <td className="px-2 py-4 text-left">
                                                {(() => {
                                                    const confirmacion = obtenerConfirmacionVenta(Number(venta.id));
                                                    if (!confirmacion) {
                                                        return <span className="text-sm text-gray-500 dark:text-gray-400">Sin confirmar</span>;
                                                    }
                                                    const isTipoEntregaCompleta = confirmacion.tipo_entrega === 'COMPLETA';
                                                    return (
                                                        <div>
                                                            <Badge
                                                                className={
                                                                    isTipoEntregaCompleta
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                                                }
                                                            >
                                                                {confirmacion.tipo_entrega === 'COMPLETA' ? '✅ ' : '⚠️ '}
                                                                {confirmacion.tipo_entrega || 'N/A'}
                                                            </Badge>
                                                        </div>
                                                    );
                                                })()}
                                            </td> */}
                                            <td className="px-2 py-4 text-left">
                                                {(() => {
                                                    const confirmacion = obtenerConfirmacionVenta(Number(venta.id));
                                                    if (!confirmacion) {
                                                        return <span className="text-sm text-gray-500 dark:text-gray-400">Sin confirmar</span>;
                                                    }
                                                    const isTipoEntregaCompleta = confirmacion.tipo_confirmacion === 'COMPLETA';
                                                    return (
                                                        <div>
                                                            <Badge
                                                                className={
                                                                    isTipoEntregaCompleta
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                                                }
                                                            >
                                                                {confirmacion.tipo_confirmacion === 'COMPLETA' ? '✅ ' : '⚠️ '}
                                                                {confirmacion.tipo_confirmacion || 'N/A'}
                                                            </Badge>
                                                        </div>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-2 py-4 text-left text-xs text-gray-900 dark:text-white">{pesoVenta} kg</td>

                                            <td className="px-1 py-2 text-center">
                                                {venta.detalles && venta.detalles.length > 0 && (
                                                    <button
                                                        onClick={() => setExpandedVentaId(isExpanded ? null : Number(venta.id))}
                                                        className="rounded p-1 transition hover:bg-gray-200 dark:hover:bg-slate-800"
                                                        title={isExpanded ? 'Ocultar' : 'Ver detalles'}
                                                    >
                                                        <ChevronDown
                                                            className={`h-5 w-5 text-gray-600 transition-transform dark:text-slate-400 ${
                                                                isExpanded ? 'rotate-180' : ''
                                                            }`}
                                                        />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>

                                        {/* Fila expandible - Detalles de la venta */}
                                        {isExpanded && (
                                            <tr className="bg-gray-50 dark:bg-slate-900/50">
                                                <td colSpan={9} className="px-2 py-4">
                                                    <div className="space-y-4">
                                                        {/* ✅ REFACTORIZADO: Información de Confirmación de Entrega */}
                                                        {(() => {
                                                            const confirmacion = obtenerConfirmacionVenta(Number(venta.id));
                                                            if (!confirmacion) {
                                                                return (
                                                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                                                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                                                            📋 No hay confirmación de entrega registrada aún
                                                                        </p>
                                                                    </div>
                                                                );
                                                            }

                                                            return (
                                                                <div
                                                                    className={`space-y-4 rounded-lg border p-4 ${
                                                                        confirmacion.tipo_entrega === 'COMPLETA'
                                                                            ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10'
                                                                            : 'border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/10'
                                                                    }`}
                                                                >
                                                                    {/* Encabezado de Confirmación */}
                                                                    <div
                                                                        className={`flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between ${
                                                                            confirmacion.tipo_entrega === 'COMPLETA'
                                                                                ? 'border-green-200 dark:border-green-800'
                                                                                : 'border-orange-200 dark:border-orange-800'
                                                                        }`}
                                                                    >
                                                                        <div className="flex flex-col gap-1">
                                                                            <h4
                                                                                className={`flex items-center gap-2 text-sm font-semibold ${
                                                                                    confirmacion.tipo_entrega === 'COMPLETA'
                                                                                        ? 'text-green-900 dark:text-green-100'
                                                                                        : 'text-orange-900 dark:text-orange-100'
                                                                                }`}
                                                                            >
                                                                                <CheckCircle
                                                                                    className={`h-5 w-5 ${
                                                                                        confirmacion.tipo_entrega === 'COMPLETA'
                                                                                            ? 'text-green-600 dark:text-green-400'
                                                                                            : 'text-orange-600 dark:text-orange-400'
                                                                                    }`}
                                                                                />
                                                                                {confirmacion.tipo_entrega === 'COMPLETA' ? '✅' : '⚠️'} Confirmación
                                                                                de Entrega
                                                                            </h4>
                                                                            {confirmacion.confirmado_en && (
                                                                                <span
                                                                                    className={`text-xs ${
                                                                                        confirmacion.tipo_entrega === 'COMPLETA'
                                                                                            ? 'text-green-700 dark:text-green-300'
                                                                                            : 'text-orange-700 dark:text-orange-300'
                                                                                    }`}
                                                                                >
                                                                                    {new Date(confirmacion.confirmado_en).toLocaleDateString(
                                                                                        'es-ES',
                                                                                        {
                                                                                            day: '2-digit',
                                                                                            month: 'short',
                                                                                            year: 'numeric',
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit',
                                                                                        },
                                                                                    )}
                                                                                </span>
                                                                            )}
                                                                            {/* CONFIRMADO POR */}
                                                                            {confirmacion.confirmado_por && (
                                                                                <span
                                                                                    className={`text-xs ${
                                                                                        confirmacion.tipo_entrega === 'COMPLETA'
                                                                                            ? 'text-green-700 dark:text-green-300'
                                                                                            : 'text-orange-700 dark:text-orange-300'
                                                                                    }`}
                                                                                >
                                                                                    Confirmado por: {confirmacion.confirmado_por.name}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {/* ✅ NUEVO: Botones para modales */}
                                                                        <div className="flex gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="gap-1 text-xs"
                                                                                onClick={() => {
                                                                                    setVentaSeleccionadaModal(venta);
                                                                                    setShowConfirmacionesModal(true);
                                                                                }}
                                                                            >
                                                                                <Eye className="h-3 w-3" />
                                                                                Ver Historial
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="gap-1 text-xs"
                                                                                onClick={() => {
                                                                                    setVentaSeleccionadaModal(venta);
                                                                                    setShowRegistrarConfirmacionModal(true);
                                                                                }}
                                                                            >
                                                                                <Plus className="h-3 w-3" />
                                                                                Nueva Confirmación
                                                                            </Button>
                                                                            {/* ✅ NUEVO: Botón para reasignar a otra entrega */}
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => {
                                                                                    setVentaAReasignar(venta);
                                                                                    setReasignarModalOpen(true);
                                                                                }}
                                                                                className="gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
                                                                            >
                                                                                <Navigation className="h-4 w-4" />
                                                                                🚚 Reasignar
                                                                            </Button>
                                                                        </div>
                                                                    </div>

                                                                    {/* Grid: Tipo Confirmación y Monto Recibido */}
                                                                    <div
                                                                        className={`grid gap-2 ${confirmacion.tipo_confirmacion === 'COMPLETA' || confirmacion.tipo_confirmacion === 'DEVOLUCION_PARCIAL' ? 'grid-cols-2 sm:grid-cols-2' : 'grid-cols-1'}`}
                                                                    >
                                                                        <div>
                                                                            <p className="text-xs font-semibold uppercase">Tipo Confirmación</p>
                                                                            <Badge
                                                                                className={
                                                                                    confirmacion.tipo_confirmacion === 'COMPLETA'
                                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                                                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200'
                                                                                }
                                                                            >
                                                                                {confirmacion.tipo_confirmacion === 'COMPLETA'
                                                                                    ? '✅ Completa'
                                                                                    : confirmacion.tipo_confirmacion === 'DEVOLUCION_PARCIAL'
                                                                                      ? '🔄 Devolución Parcial'
                                                                                      : confirmacion.tipo_confirmacion === 'RECHAZADO'
                                                                                        ? '❌ Rechazado'
                                                                                        : confirmacion.tipo_confirmacion === 'CLIENTE_CERRADO'
                                                                                          ? '🏪 Cliente Cerrado'
                                                                                          : '❓ ' + confirmacion.tipo_confirmacion}
                                                                            </Badge>
                                                                        </div>
                                                                        {/* ✅ Mostrar dinero recibido solo si es COMPLETA o DEVOLUCION_PARCIAL y NO es CREDITO */}
                                                                        {(confirmacion.tipo_confirmacion === 'COMPLETA' ||
                                                                            confirmacion.tipo_confirmacion === 'DEVOLUCION_PARCIAL' ) &&
                                                                            confirmacion.venta?.tipo_pago?.codigo !== 'CREDITO' && (
                                                                            <div>
                                                                                <p className="text-xs font-semibold text-green-700 uppercase dark:text-green-300">
                                                                                    Dinero Recibido
                                                                                </p>
                                                                                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                                                    Bs. {Number(confirmacion.total_dinero_recibido || 0).toFixed(2)}
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Resumen de Pagos por Tipo */}
                                                                    {confirmacion.desglose_pagos &&
                                                                        Array.isArray(confirmacion.desglose_pagos) &&
                                                                        confirmacion.desglose_pagos.length > 0 && (
                                                                            <div className="rounded border border-green-200 bg-white p-3 dark:border-green-800 dark:bg-slate-800/50">
                                                                                <p className="mb-2 text-xs font-semibold text-gray-700 uppercase dark:text-gray-300">
                                                                                    💳 Resumen de Pagos
                                                                                </p>
                                                                                <div className="grid grid-cols-2 gap-3">
                                                                                    {confirmacion.desglose_pagos.map((pago: any, idx: number) => (
                                                                                        <div
                                                                                            key={idx}
                                                                                            className="rounded bg-gray-100 p-2 dark:bg-slate-700/50"
                                                                                        >
                                                                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                                                {pago.tipo_pago_nombre}
                                                                                                {pago.referencia && (
                                                                                                    <span className="ml-1 block text-xs text-gray-500 dark:text-gray-500">
                                                                                                        ({pago.referencia})
                                                                                                    </span>
                                                                                                )}
                                                                                            </p>
                                                                                            <p className="mt-1 font-semibold text-green-600 dark:text-green-400">
                                                                                                Bs. {Number(pago.monto).toFixed(2)}
                                                                                            </p>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                    {/* Monto Pendiente - No mostrar si es CREDITO (promesa de pago) */}
                                                                    {Number(confirmacion.monto_pendiente || 0) > 0 &&
                                                                        confirmacion.venta?.tipo_pago?.codigo !== 'CREDITO' && (
                                                                        <div className="rounded border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20">
                                                                            <p className="text-xs font-semibold text-orange-700 uppercase dark:text-orange-300">
                                                                                ⚠️ Monto Pendiente
                                                                            </p>
                                                                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                                                                Bs. {Number(confirmacion.monto_pendiente).toFixed(2)}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {/* Observaciones Logística */}
                                                                    {confirmacion.observaciones_logistica && (
                                                                        <div className="rounded border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
                                                                            <p className="mb-2 text-xs font-semibold text-gray-700 uppercase dark:text-gray-300">
                                                                                📝 Observaciones
                                                                            </p>
                                                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                                {confirmacion.observaciones_logistica}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {/* Productos Devueltos (solo si tipo_confirmacion = DEVOLUCION_PARCIAL) */}
                                                                    {confirmacion.tipo_confirmacion === 'DEVOLUCION_PARCIAL' &&
                                                                        confirmacion.productos_devueltos &&
                                                                        Array.isArray(confirmacion.productos_devueltos) &&
                                                                        confirmacion.productos_devueltos.length > 0 && (
                                                                            <div className="rounded border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20">
                                                                                <p className="mb-2 text-xs font-semibold text-orange-700 uppercase dark:text-orange-300">
                                                                                    🔄 Productos Devueltos ({confirmacion.productos_devueltos.length})
                                                                                </p>
                                                                                <div className="space-y-2">
                                                                                    {confirmacion.productos_devueltos.map(
                                                                                        (prod: any, idx: number) => (
                                                                                            <div key={idx} className="text-sm">
                                                                                                <div className="flex items-center justify-between font-medium">
                                                                                                    <span className="text-orange-900 dark:text-orange-100">
                                                                                                        {prod.producto_nombre}
                                                                                                    </span>
                                                                                                    <span className="text-orange-600 dark:text-orange-400">
                                                                                                        -{prod.cantidad}
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div className="mt-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                                                                                    <span>
                                                                                                        Bs. {Number(prod.precio_unitario).toFixed(2)}{' '}
                                                                                                        c/u
                                                                                                    </span>
                                                                                                    <span>
                                                                                                        Subtotal: Bs.{' '}
                                                                                                        {Number(prod.subtotal).toFixed(2)}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        ),
                                                                                    )}
                                                                                    {confirmacion.monto_devuelto && (
                                                                                        <div className="border-t border-orange-200 pt-2 dark:border-orange-800">
                                                                                            <div className="flex items-center justify-between font-semibold text-orange-700 dark:text-orange-300">
                                                                                                <span>Total Devuelto:</span>
                                                                                                <span>
                                                                                                    Bs.{' '}
                                                                                                    {Number(confirmacion.monto_devuelto).toFixed(2)}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                    {/* Fotos de Entrega */}
                                                                    {confirmacion.fotos &&
                                                                        Array.isArray(confirmacion.fotos) &&
                                                                        confirmacion.fotos.length > 0 && (
                                                                            <div className="rounded border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
                                                                                <p className="mb-3 text-xs font-semibold text-gray-700 uppercase dark:text-gray-300">
                                                                                    📷 Fotos de Entrega ({confirmacion.fotos.length})
                                                                                </p>
                                                                                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                                                                                    {confirmacion.fotos.map((foto: string, idx: number) => (
                                                                                        <a
                                                                                            key={idx}
                                                                                            href={foto}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"
                                                                                        >
                                                                                            <img
                                                                                                src={foto}
                                                                                                alt={`Foto ${idx + 1}`}
                                                                                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                                                                                onError={(e) => {
                                                                                                    const img = e.target as HTMLImageElement;
                                                                                                    img.src =
                                                                                                        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 w=%22200%22 h=%22200%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2212%22%3ENo disponible%3C/text%3E%3C/svg%3E';
                                                                                                }}
                                                                                            />
                                                                                        </a>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            );
                                                        })()}

                                                        {/* Tabla de productos */}
                                                        {/* {venta.detalles && venta.detalles.length > 0 && (
                                                            <div className="space-y-2">
                                                                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                                                    <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                    Productos Vendidos ({venta.detalles.length})
                                                                </h4>
                                                                <div className="overflow-x-auto rounded border border-gray-200 dark:border-slate-800">
                                                                    <table className="w-full text-sm">
                                                                        <thead>
                                                                            <tr className="bg-gray-100 dark:bg-slate-900">
                                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Producto
                                                                                </th>
                                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Cantidad
                                                                                </th>
                                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Precio
                                                                                </th>
                                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Subtotal
                                                                                </th>
                                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Peso
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                                                                            {venta.detalles.map((detalle) => {
                                                                                const precio =
                                                                                    typeof detalle.precio_unitario === 'string'
                                                                                        ? parseFloat(detalle.precio_unitario)
                                                                                        : detalle.precio_unitario;
                                                                                const subtotal =
                                                                                    typeof detalle.subtotal === 'string'
                                                                                        ? parseFloat(detalle.subtotal)
                                                                                        : detalle.subtotal;
                                                                                const pesoItem = (detalle.producto?.peso || 0) * detalle.cantidad;

                                                                                return (
                                                                                    <tr
                                                                                        key={detalle.id}
                                                                                        className="hover:bg-gray-100 dark:hover:bg-slate-800/80"
                                                                                    >
                                                                                        <td className="px-4 py-2">
                                                                                            <div>
                                                                                                <p className="font-medium text-gray-900 dark:text-white">
                                                                                                    {detalle.producto?.nombre ||
                                                                                                        'Producto sin nombre'}
                                                                                                </p>
                                                                                                {detalle.producto?.codigo && (
                                                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                                                        {detalle.producto.codigo}
                                                                                                    </p>
                                                                                                )}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                                                                                            {Number(detalle.cantidad).toFixed(2)}
                                                                                        </td>
                                                                                        <td className="px-4 py-2 text-left text-gray-900 dark:text-white">
                                                                                            Bs. {precio.toFixed(2)}
                                                                                        </td>
                                                                                        <td className="px-4 py-2 text-left font-semibold text-blue-600 dark:text-blue-400">
                                                                                            Bs. {subtotal.toFixed(2)}
                                                                                        </td>
                                                                                        <td className="px-4 py-2 text-left font-medium text-purple-600 dark:text-purple-400">
                                                                                            {pesoItem.toFixed(2)} kg
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        )} */}

                                                        {/* ✅ Botones de acción */}
                                                        <div className="mt-4 flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-slate-800">
                                                            {/* Botón para confirmar/editar entrega (siempre disponible) */}
                                                            {/* {onConfirmarEntrega && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="default"
                                                                    onClick={() => onConfirmarEntrega(venta)}
                                                                    className={`gap-2 ${
                                                                        venta.estado_logistica?.codigo === 'ENTREGADO'
                                                                            ? 'bg-blue-600 hover:bg-blue-700'
                                                                            : 'bg-green-600 hover:bg-green-700'
                                                                    }`}
                                                                >
                                                                    <Truck className="h-4 w-4" />
                                                                    {venta.estado_logistica?.codigo === 'ENTREGADO'
                                                                        ? '✏️ Editar Entrega'
                                                                        : '✅ Confirmar Entrega'}
                                                                </Button>
                                                            )} */}

                                                            {/* Botón para corregir pagos (solo si está entregada) */}
                                                            {/* {venta.estado_logistica?.codigo === 'ENTREGADO' && onCorregirPago && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        const ventaTotal =
                                                                            typeof venta.total === 'string'
                                                                                ? parseFloat(venta.total)
                                                                                : venta.total || 0;
                                                                        const desglose: DesglosePago[] =
                                                                            venta.desglose_pagos && Array.isArray(venta.desglose_pagos)
                                                                                ? venta.desglose_pagos
                                                                                : [];
                                                                        onCorregirPago(Number(venta.id), venta.numero || '', ventaTotal, desglose);
                                                                    }}
                                                                    className="gap-2"
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                    ✏️ Corregir Pagos
                                                                </Button>
                                                            )} */}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ✅ Modal para reasignar venta */}
            <ReasignarVentaModal
                isOpen={reasignarModalOpen}
                venta={ventaAReasignar}
                entregaActual={entrega}
                onClose={() => {
                    setReasignarModalOpen(false);
                    setVentaAReasignar(undefined);
                }}
                onSuccess={() => {
                    // Recargar la página para ver los cambios actualizados
                    window.location.reload();
                }}
            />

            {/* ✅ NUEVO: Modal para ver confirmaciones de entrega */}
            {ventaSeleccionadaModal && (
                <ConfirmacionesModal
                    open={showConfirmacionesModal}
                    onOpenChange={setShowConfirmacionesModal}
                    confirmaciones={obtenerTodasConfirmacionesVenta(Number(ventaSeleccionadaModal.id))}
                    venta={ventaSeleccionadaModal}
                    onConfirmacionDeleted={() => {
                        setShowConfirmacionesModal(false);
                        window.location.reload();
                    }}
                />
            )}

            {/* ✅ NUEVO: Modal para registrar nueva confirmación de entrega */}
            {ventaSeleccionadaModal && (
                <RegistrarConfirmacionModal
                    isOpen={showRegistrarConfirmacionModal}
                    ventaId={Number(ventaSeleccionadaModal.id)}
                    ventaNumero={ventaSeleccionadaModal.numero || ''}
                    entregaId={entrega?.id}
                    politicaPago={ventaSeleccionadaModal.politica_pago || ''}
                    detalles={ventaSeleccionadaModal.detalles || []}
                    onClose={() => setShowRegistrarConfirmacionModal(false)}
                    onSuccess={() => {
                        setShowRegistrarConfirmacionModal(false);
                        // Recargar la página para mostrar la nueva confirmación
                        setTimeout(() => window.location.reload(), 500);
                    }}
                />
            )}
        </div>
    );
}
