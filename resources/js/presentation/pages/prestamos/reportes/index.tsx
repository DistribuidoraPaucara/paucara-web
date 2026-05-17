import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/presentation/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/presentation/components/ui/table';
import reportesPrestamosService from '@/infrastructure/services/reportes-prestamos.service';
import type { Prestable } from '@/domain/entities/prestamos';

export default function ReportesIndex() {
    const [activeTab, setActiveTab] = useState<'stock-bajo' | 'devoluciones' | 'deudas'>(
        'stock-bajo'
    );

    // Stock Bajo
    const [stockBajo, setStockBajo] = useState<Prestable[]>([]);
    const [loadingStockBajo, setLoadingStockBajo] = useState(true);

    // Devoluciones Pendientes
    const [devolucionesPendientes, setDevolucionesPendientes] = useState<any[]>([]);
    const [loadingDevoluciones, setLoadingDevoluciones] = useState(true);

    // Deudas Proveedores
    const [deudas, setDeudas] = useState<any[]>([]);
    const [loadingDeudas, setLoadingDeudas] = useState(true);

    useEffect(() => {
        if (activeTab === 'stock-bajo') {
            fetchStockBajo();
        } else if (activeTab === 'devoluciones') {
            fetchDevolucionesPendientes();
        } else if (activeTab === 'deudas') {
            fetchDeudas();
        }
    }, [activeTab]);

    const fetchStockBajo = async () => {
        try {
            const data = await reportesPrestamosService.getStockBajo();
            setStockBajo(data);
        } finally {
            setLoadingStockBajo(false);
        }
    };

    const fetchDevolucionesPendientes = async () => {
        try {
            const data = await reportesPrestamosService.getDevolucionesPendientes();
            setDevolucionesPendientes(data);
        } finally {
            setLoadingDevoluciones(false);
        }
    };

    const fetchDeudas = async () => {
        try {
            const data = await reportesPrestamosService.getDeudas();
            setDeudas(data);
        } finally {
            setLoadingDeudas(false);
        }
    };

    const getUrgencyBadge = (diasVencidos: number) => {
        if (diasVencidos > 30) {
            return <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">Crítico ({diasVencidos}d)</span>;
        } else if (diasVencidos > 14) {
            return <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">Urgente ({diasVencidos}d)</span>;
        } else if (diasVencidos > 0) {
            return <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">Vencido ({diasVencidos}d)</span>;
        }
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Vigente</span>;
    };

    return (
        <AppLayout>
            <Head title="Reportes de Préstamos" />
            <div className="p-8 bg-white dark:bg-gray-950 min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">📊 Reportes de Préstamos</h1>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('stock-bajo')}
                        className={`px-6 py-3 font-medium border-b-2 transition ${
                            activeTab === 'stock-bajo'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        📦 Stock Bajo
                    </button>
                    <button
                        onClick={() => setActiveTab('devoluciones')}
                        className={`px-6 py-3 font-medium border-b-2 transition ${
                            activeTab === 'devoluciones'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        ⏰ Devoluciones Pendientes
                    </button>
                    <button
                        onClick={() => setActiveTab('deudas')}
                        className={`px-6 py-3 font-medium border-b-2 transition ${
                            activeTab === 'deudas'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        💰 Deudas Proveedores
                    </button>
                </div>

                {/* Stock Bajo */}
                {activeTab === 'stock-bajo' && (
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                        {loadingStockBajo ? (
                            <div className="p-8 text-center text-gray-600 dark:text-gray-400">Cargando...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                        <TableRow className="border-gray-200 dark:border-gray-700">
                                            <TableHead className="text-gray-900 dark:text-gray-100">Prestable</TableHead>
                                            <TableHead className="text-gray-900 dark:text-gray-100">Código</TableHead>
                                            <TableHead className="text-gray-900 dark:text-gray-100">Tipo</TableHead>
                                            <TableHead className="text-gray-900 dark:text-gray-100">Disponible</TableHead>
                                            <TableHead className="text-gray-900 dark:text-gray-100">En Préstamo</TableHead>
                                            <TableHead className="text-gray-900 dark:text-gray-100">Vendido</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stockBajo.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                    No hay prestables con stock bajo
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            stockBajo.map((p) => (
                                                <TableRow key={p.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{p.nombre}</TableCell>
                                                    <TableCell className="text-gray-900 dark:text-gray-100">{p.codigo}</TableCell>
                                                    <TableCell className="text-gray-900 dark:text-gray-100">{p.tipo}</TableCell>
                                                    <TableCell className="text-yellow-600 dark:text-yellow-400 font-semibold">
                                                        {p.stocks?.[0]?.cantidad_disponible || 0}
                                                    </TableCell>
                                                    <TableCell className="text-gray-900 dark:text-gray-100">
                                                        {p.stocks?.[0]?.cantidad_en_prestamo_cliente || 0}
                                                    </TableCell>
                                                    <TableCell className="text-gray-900 dark:text-gray-100">
                                                        {p.stocks?.[0]?.cantidad_vendida || 0}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </Card>
                )}

                {/* Devoluciones Pendientes */}
                {activeTab === 'devoluciones' && (
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                        {loadingDevoluciones ? (
                            <div className="p-8 text-center text-gray-600 dark:text-gray-400">Cargando...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                        <TableRow className="border-gray-200 dark:border-gray-700">
                                            <TableHead className="text-gray-900 dark:text-gray-100">Cliente</TableHead>
                                            <TableHead className="text-gray-900 dark:text-gray-100">Prestable</TableHead>
                                            <TableHead className="text-gray-900 dark:text-gray-100">Cantidad</TableHead>
                                            <TableHead className="text-gray-900 dark:text-gray-100">Fecha Préstamo</TableHead>
                                            <TableHead className="text-gray-900 dark:text-gray-100">Plazo</TableHead>
                                            <TableHead className="text-gray-900 dark:text-gray-100">Vencimiento</TableHead>
                                            <TableHead className="text-gray-900 dark:text-gray-100">Garantía</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {devolucionesPendientes.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                    Todas las devoluciones están al día
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            devolucionesPendientes.map((p) => (
                                                <TableRow key={p.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                                        {p.cliente?.razon_social}
                                                    </TableCell>
                                                    <TableCell className="text-gray-900 dark:text-gray-100">{p.prestable?.nombre}</TableCell>
                                                    <TableCell className="text-center text-gray-900 dark:text-gray-100">
                                                        {p.cantidad_pendiente}
                                                    </TableCell>
                                                    <TableCell className="text-gray-900 dark:text-gray-100">
                                                        {new Date(p.fecha_prestamo).toLocaleDateString('es-ES')}
                                                    </TableCell>
                                                    <TableCell className="text-gray-900 dark:text-gray-100">
                                                        {p.fecha_esperada_devolucion
                                                            ? new Date(p.fecha_esperada_devolucion).toLocaleDateString(
                                                                'es-ES'
                                                            )
                                                            : 'S/P'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getUrgencyBadge(p.dias_vencidos)}
                                                    </TableCell>
                                                    <TableCell className="text-gray-900 dark:text-gray-100">{p.monto_garantia}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </Card>
                )}

                {/* Deudas Proveedores */}
                {activeTab === 'deudas' && (
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                        {loadingDeudas ? (
                            <div className="p-8 text-center text-gray-600 dark:text-gray-400">Cargando...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                        <TableRow className="border-gray-200 dark:border-gray-700">
                                            <TableHead className="text-gray-900 dark:text-gray-100">Proveedor</TableHead>
                                            <TableHead className="text-right text-gray-900 dark:text-gray-100">Préstamos Activos</TableHead>
                                            <TableHead className="text-right text-gray-900 dark:text-gray-100">Deuda Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {deudas.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                    Sin deudas con proveedores
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            deudas.map((d, idx) => (
                                                <TableRow key={idx} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                                        {d.proveedor?.nombre}
                                                    </TableCell>
                                                    <TableCell className="text-right text-gray-900 dark:text-gray-100">
                                                        {d.prestamos_activos}
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold text-red-600 dark:text-red-400">
                                                        Bs {d.total_deuda.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
