import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card } from '@/presentation/components/ui/card';
import {
    AlertCircle,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import EstadoCierreBadge from '@/presentation/components/cajas/EstadoCierreBadge';

interface Cierre {
    id: number;
    caja: string;
    usuario: string;
    fecha: string;
    monto_esperado: number;
    monto_real: number;
    diferencia: number;
    observaciones?: string;
    estado: {
        codigo: string;
        nombre: string;
        color: string;
    };
}

interface Props {
    stats?: {
        pendientes: number;
        consolidadas: number;
        rechazadas: number;
        requieren_atencion: number;
        con_diferencias: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Cajas',
        href: '/cajas',
    },
    {
        title: 'Cierres Pendientes',
        href: '/admin/cajas/pendientes',
    },
];

export default function Pendientes({ stats }: Props) {
    const [cierres, setCierres] = useState<Cierre[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCierre, setSelectedCierre] = useState<Cierre | null>(null);
    const [showConsolidateModal, setShowConsolidateModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [consolidateForm, setConsolidateForm] = useState({ observaciones: '' });
    const [rejectForm, setRejectForm] = useState({ motivo: '', requiere_reapertura: false });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [statsLocal, setStatsLocal] = useState(stats);

    useEffect(() => {
        fetchCierresPendientes();
        fetchStats();
    }, []);

    const fetchCierresPendientes = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/cierres/pendientes');
            const data = await response.json();
            if (data.success) {
                setCierres(data.data);
            }
        } catch (error) {
            console.error('Error fetching pending closures:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/cierres/estadisticas');
            const data = await response.json();
            if (data.success) {
                setStatsLocal(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleConsolidar = async () => {
        if (!selectedCierre) return;

        setSubmitLoading(true);
        try {
            const response = await fetch(`/api/admin/cierres/${selectedCierre.id}/consolidar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify(consolidateForm),
            });

            const data = await response.json();
            if (data.success) {
                fetchCierresPendientes();
                fetchStats();
                setShowConsolidateModal(false);
                setConsolidateForm({ observaciones: '' });
                setSelectedCierre(null);
                alert('✅ Cierre consolidado exitosamente');
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error consolidating closure:', error);
            alert('❌ Error al consolidar el cierre');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleRechazar = async () => {
        if (!selectedCierre) return;

        setSubmitLoading(true);
        try {
            const response = await fetch(`/api/admin/cierres/${selectedCierre.id}/rechazar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify(rejectForm),
            });

            const data = await response.json();
            if (data.success) {
                fetchCierresPendientes();
                fetchStats();
                setShowRejectModal(false);
                setRejectForm({ motivo: '', requiere_reapertura: false });
                setSelectedCierre(null);
                alert('✅ Cierre rechazado. El cajero fue notificado.');
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error rejecting closure:', error);
            alert('❌ Error al rechazar el cierre');
        } finally {
            setSubmitLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cierres Pendientes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Cierres de Caja Pendientes
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Revisa y verifica los cierres de caja pendientes de aprobación
                        </p>
                    </div>

                    {/* Estadísticas */}
                    {statsLocal && (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Pendientes
                                        </p>
                                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                            {statsLocal.pendientes}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Consolidadas
                                        </p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {statsLocal.consolidadas}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <XCircle className="text-red-600 dark:text-red-400" size={24} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Rechazadas
                                        </p>
                                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            {statsLocal.rechazadas}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="text-orange-600 dark:text-orange-400" size={24} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Requieren Atención
                                        </p>
                                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                            {statsLocal.requieren_atencion}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="text-purple-600 dark:text-purple-400" size={24} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Con Diferencias
                                        </p>
                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            {statsLocal.con_diferencias}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Tabla de Cierres */}
                    {loading ? (
                        <Card className="p-8 text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                ⏳ Cargando cierres pendientes...
                            </p>
                        </Card>
                    ) : cierres.length === 0 ? (
                        <Card className="p-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <div className="text-center">
                                <CheckCircle className="mx-auto text-green-600 dark:text-green-400 mb-3" size={40} />
                                <p className="text-green-800 dark:text-green-200 font-medium">
                                    ✅ No hay cierres pendientes de verificación
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                Caja
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                Usuario
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                Monto Esperado
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                Monto Real
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                Diferencia
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {cierres.map((cierre) => (
                                            <tr key={cierre.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {cierre.caja}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                    {cierre.usuario}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                    {formatDate(cierre.fecha)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(cierre.monto_esperado)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(cierre.monto_real)}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                                                    cierre.diferencia !== 0
                                                        ? cierre.diferencia > 0
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                        : 'text-gray-600 dark:text-gray-400'
                                                }`}>
                                                    {formatCurrency(cierre.diferencia)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCierre(cierre);
                                                            setShowConsolidateModal(true);
                                                        }}
                                                        className="inline-block px-3 py-1 bg-green-600 dark:bg-green-700 text-white rounded text-xs font-medium hover:bg-green-700 dark:hover:bg-green-600"
                                                    >
                                                        ✅ Consolidar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCierre(cierre);
                                                            setShowRejectModal(true);
                                                        }}
                                                        className="inline-block px-3 py-1 bg-red-600 dark:bg-red-700 text-white rounded text-xs font-medium hover:bg-red-700 dark:hover:bg-red-600"
                                                    >
                                                        ❌ Rechazar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}

                    {/* Modal Consolidar */}
                    {showConsolidateModal && selectedCierre && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <Card className="max-w-md w-full mx-4">
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                                        ✅ Consolidar Cierre
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        ¿Deseas consolidar el cierre de <strong>{selectedCierre.usuario}</strong> en{' '}
                                        <strong>{selectedCierre.caja}</strong>?
                                    </p>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Observaciones (opcional)
                                        </label>
                                        <textarea
                                            value={consolidateForm.observaciones}
                                            onChange={(e) => setConsolidateForm({ observaciones: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowConsolidateModal(false)}
                                            disabled={submitLoading}
                                            className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleConsolidar}
                                            disabled={submitLoading}
                                            className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50"
                                        >
                                            {submitLoading ? '⏳' : '✅'} Consolidar
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Modal Rechazar */}
                    {showRejectModal && selectedCierre && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <Card className="max-w-md w-full mx-4">
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                                        ❌ Rechazar Cierre
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Especifica el motivo del rechazo del cierre de{' '}
                                        <strong>{selectedCierre.usuario}</strong>.
                                    </p>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Motivo del Rechazo *
                                        </label>
                                        <textarea
                                            value={rejectForm.motivo}
                                            onChange={(e) => setRejectForm({ ...rejectForm, motivo: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            rows={3}
                                            placeholder="Ej: Discrepancia en monto, falta revisar efectivo..."
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={rejectForm.requiere_reapertura}
                                                onChange={(e) => setRejectForm({ ...rejectForm, requiere_reapertura: e.target.checked })}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                Requiere reapertura de caja
                                            </span>
                                        </label>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowRejectModal(false)}
                                            disabled={submitLoading}
                                            className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleRechazar}
                                            disabled={!rejectForm.motivo.trim() || submitLoading}
                                            className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50"
                                        >
                                            {submitLoading ? '⏳' : '❌'} Rechazar
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
