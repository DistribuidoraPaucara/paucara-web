import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/presentation/components/ui/card';
import reportesPrestamosService from '@/infrastructure/services/reportes-prestamos.service';
import type { ReporteResumen } from '@/domain/entities/prestamos';

export default function PrestamosIndex() {
    const [resumen, setResumen] = useState<ReporteResumen | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResumen = async () => {
            try {
                const data = await reportesPrestamosService.getResumen();
                setResumen(data);
            } finally {
                setLoading(false);
            }
        };
        fetchResumen();
    }, []);

    return (
        <AppLayout>
            <Head title="Préstamos de Canastillas" />
            <div className="p-8 bg-white dark:bg-gray-950 min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                    🧺 Gestión de Préstamos de Canastillas
                </h1>

                {loading ? (
                    <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                        Cargando...
                    </div>
                ) : resumen ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Total de Canastillas */}
                        <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Total Canastillas
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {resumen.total_canastillas}
                            </div>
                        </Card>

                        {/* Disponibles */}
                        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
                            <div className="text-sm text-green-700 dark:text-green-400 mb-2">
                                Disponibles
                            </div>
                            <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                                {resumen.disponible}
                            </div>
                        </Card>

                        {/* En Préstamo a Clientes */}
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                            <div className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                                En Préstamo (Clientes)
                            </div>
                            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                {resumen.en_prestamo_clientes}
                            </div>
                        </Card>

                        {/* Deuda Proveedores */}
                        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800">
                            <div className="text-sm text-red-700 dark:text-red-400 mb-2">
                                Deuda Proveedores
                            </div>
                            <div className="text-3xl font-bold text-red-700 dark:text-red-300">
                                {resumen.deuda_proveedores}
                            </div>
                        </Card>
                    </div>
                ) : null}

                {/* Navigation Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-900 transition cursor-pointer hover:scale-105 dark:hover:scale-105">
                        <a href="/prestamos/prestables" className="block">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                📦 Gestionar Prestables
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Administra canastillas, embases y otros prestables
                            </p>
                        </a>
                    </Card>

                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-900 transition cursor-pointer hover:scale-105 dark:hover:scale-105">
                        <a href="/prestamos/stock" className="block">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                📊 Gestión de Stock
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Administra inventario por almacén y disponibilidad
                            </p>
                        </a>
                    </Card>

                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-900 transition cursor-pointer hover:scale-105 dark:hover:scale-105">
                        <a href="/prestamos/clientes" className="block">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                👥 Préstamos Clientes
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Gestiona préstamos y devoluciones de clientes
                            </p>
                        </a>
                    </Card>

                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-900 transition cursor-pointer hover:scale-105 dark:hover:scale-105">
                        <a href="/prestamos/proveedores" className="block">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                🏭 Préstamos Proveedores
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Registra préstamos y deudas con proveedores
                            </p>
                        </a>
                    </Card>

                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-gray-900 transition cursor-pointer hover:scale-105 dark:hover:scale-105">
                        <a href="/prestamos/reportes" className="block">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                📊 Reportes
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Stock bajo, devoluciones pendientes, deudas
                            </p>
                        </a>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
