import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ReservasProformaTable from '@/presentation/components/reservas/ReservasProformaTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';

export default function ReservasIndex() {
    return (
        <AppLayout>
            <Head title="Gestión de Reservas de Proformas" />

            <div className="space-y-2 p-2">
                {/* Encabezado */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        📦 Gestión de Reservas
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Administra las reservas de stock para proformas pendientes
                    </p>
                </div>

                {/* Información útil */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-2">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">📋</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Duración de Reservas
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        3 días
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Automáticamente se liberan si no se convierten a venta
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-2">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">🔄</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Renovación
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        7 días
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Si vencen, puede renovar para 7 días más
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-2">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">✅</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Estados
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        3 estados
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        ACTIVA, LIBERADA, CONSUMIDA
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Tabla de Reservas */}
                <ReservasProformaTable />
            </div>
        </AppLayout>
    );
}
