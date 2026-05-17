import React, { useState, useEffect } from 'react';
import EstadoCierreBadge from '../../../components/cajas/EstadoCierreBadge';

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

interface CierresPendientesProps {
    initialCierres?: Cierre[];
}

export function CierresPendientes({ initialCierres = [] }: CierresPendientesProps) {
    const [cierres, setCierres] = useState<Cierre[]>(initialCierres);
    const [loading, setLoading] = useState(false);
    const [selectedCierre, setSelectedCierre] = useState<Cierre | null>(null);
    const [showConsolidateModal, setShowConsolidateModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [consolidateForm, setConsolidateForm] = useState({ observaciones: '' });
    const [rejectForm, setRejectForm] = useState({ motivo: '', requiere_reapertura: false });

    useEffect(() => {
        fetchCierresPendientes();
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

    const handleConsolidar = async () => {
        if (!selectedCierre) return;

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
                // Actualizar lista
                fetchCierresPendientes();
                setShowConsolidateModal(false);
                setConsolidateForm({ observaciones: '' });
                setSelectedCierre(null);
                alert('Cierre consolidado exitosamente');
            }
        } catch (error) {
            console.error('Error consolidating closure:', error);
            alert('Error al consolidar el cierre');
        }
    };

    const handleRechazar = async () => {
        if (!selectedCierre) return;

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
                // Actualizar lista
                fetchCierresPendientes();
                setShowRejectModal(false);
                setRejectForm({ motivo: '', requiere_reapertura: false });
                setSelectedCierre(null);
                alert('Cierre rechazado. El cajero fue notificado.');
            }
        } catch (error) {
            console.error('Error rejecting closure:', error);
            alert('Error al rechazar el cierre');
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Cierres de Caja Pendientes</h1>
                <p className="text-gray-600 mt-2">Revisa y verifica los cierres de caja pendientes de aprobación</p>
            </div>

            {loading && <div className="text-center py-8">Cargando cierres pendientes...</div>}

            {!loading && cierres.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <p className="text-green-800 font-medium">✅ No hay cierres pendientes de verificación</p>
                </div>
            )}

            {!loading && cierres.length > 0 && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Caja</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Monto Esperado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Monto Real</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Diferencia</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cierres.map((cierre) => (
                                <tr key={cierre.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{cierre.caja}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{cierre.usuario}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(cierre.fecha)}</td>
                                    <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(cierre.monto_esperado)}</td>
                                    <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(cierre.monto_real)}</td>
                                    <td className={`px-6 py-4 text-sm text-right font-medium ${cierre.diferencia !== 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                        {formatCurrency(cierre.diferencia)}
                                        {cierre.diferencia !== 0 && <span className="text-xs block">(diferencia)</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedCierre(cierre);
                                                setShowConsolidateModal(true);
                                            }}
                                            className="inline-block px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600"
                                        >
                                            Consolidar
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedCierre(cierre);
                                                setShowRejectModal(true);
                                            }}
                                            className="inline-block px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600"
                                        >
                                            Rechazar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Consolidar */}
            {showConsolidateModal && selectedCierre && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Consolidar Cierre</h2>
                        <p className="text-gray-600 mb-4">
                            ¿Deseas consolidar el cierre de <strong>{selectedCierre.usuario}</strong> en <strong>{selectedCierre.caja}</strong>?
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones (opcional)</label>
                            <textarea
                                value={consolidateForm.observaciones}
                                onChange={(e) => setConsolidateForm({ observaciones: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowConsolidateModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConsolidar}
                                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Consolidar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Rechazar */}
            {showRejectModal && selectedCierre && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Rechazar Cierre</h2>
                        <p className="text-gray-600 mb-4">
                            Especifica el motivo del rechazo del cierre de <strong>{selectedCierre.usuario}</strong>.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Motivo del Rechazo *</label>
                            <textarea
                                value={rejectForm.motivo}
                                onChange={(e) => setRejectForm({ ...rejectForm, motivo: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                                <span className="text-sm text-gray-700">Requiere reapertura de caja</span>
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleRechazar}
                                disabled={!rejectForm.motivo.trim()}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
                            >
                                Rechazar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CierresPendientes;
