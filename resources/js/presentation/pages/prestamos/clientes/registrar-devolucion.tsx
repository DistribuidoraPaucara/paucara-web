import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { AlertCircle } from 'lucide-react';
import type { PrestamoCliente } from '@/domain/entities/prestamos';
import prestamoClienteService from '@/infrastructure/services/prestamo-cliente.service';
import { RegistrarDevolucionGenerico } from '@/presentation/components/prestamos/RegistrarDevolucionGenerico';

interface Props {
    prestamoId: number;
}

export default function RegistrarDevolucionCliente({ prestamoId }: Props) {
    const [prestamo, setPrestamo] = useState<PrestamoCliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarPrestamo();
    }, [prestamoId]);

    const cargarPrestamo = async () => {
        setLoading(true);
        try {
            const data = await prestamoClienteService.getById(prestamoId);
            setPrestamo(data);
        } catch (err: any) {
            const msg = err.message || 'Error cargando préstamo';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">Cargando información...</p>
                </div>
            </AppLayout>
        );
    }

    if (!prestamo && error) {
        return (
            <AppLayout>
                <div className="p-6">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <RegistrarDevolucionGenerico
            prestamo={prestamo}
            tipoDevolucion="cliente"
            prestamoId={prestamoId}
            rutaRetorno="/prestamos/clientes"
            titulo="Registrares Devolución - Cliente"
            breadcrumbs={[{ title: 'Préstamos', href: '/prestamos' }, { title: 'Movimientos de Stock', href: '/prestamos/ajustes/movimientos' }]}
        />
    );
}
