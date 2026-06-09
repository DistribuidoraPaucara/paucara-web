import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { AlertCircle } from 'lucide-react';
import type { PrestamoEvento } from '@/domain/entities/prestamos';
import { prestamoEventoService } from '@/infrastructure/services/prestamo-evento.service';
import { RegistrarDevolucionGenerico } from '@/presentation/components/prestamos/RegistrarDevolucionGenerico';

interface Props {
    prestamoId: number;
}

export default function DevolucionesEventos({ prestamoId }: Props) {
    const [prestamo, setPrestamo] = useState<PrestamoEvento | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarPrestamo();
    }, [prestamoId]);

    const cargarPrestamo = async () => {
        setLoading(true);
        try {
            console.log('%c📥 [devoluciones] Cargando préstamo evento ID:', 'color: #0066cc; font-weight: bold', prestamoId);
            const data = await prestamoEventoService.obtener(prestamoId);

            console.log('%c✅ [devoluciones] DATOS DEL BACKEND:', 'color: #00aa00; font-weight: bold; font-size: 14px');
            console.log('%c=== PRÉSTAMO CABECERA ===', 'color: #ff6600; font-weight: bold');
            console.log({
                id: data.id,
                nombre_evento: data.nombre_evento,
                encargado_evento: data.encargado_evento,
                almacenes_prestables_id: data.almacenes_prestables_id,
                almacen: data.almacen,
                fecha_prestamo: data.fecha_prestamo,
                estado: data.estado,
            });

            console.log('%c=== DETALLES ===', 'color: #ff6600; font-weight: bold');
            console.log(`Total detalles: ${data.detalles?.length || 0}`);
            if (data.detalles && data.detalles.length > 0) {
                data.detalles.forEach((d: any, idx: number) => {
                    console.log(`%c📦 Detalle ${idx + 1}:`, 'color: #9966cc', {
                        id: d.id,
                        prestable_id: d.prestable_id,
                        prestable_nombre: d.prestable?.nombre,
                        cantidad: d.cantidad,
                        almacenes: d.almacenes?.map((a: any) => ({
                            almacen_id: a.id,
                            almacen_nombre: a.nombre,
                            cantidad: a.pivot?.cantidad || a.cantidad,
                            es_proveedor: a.es_proveedor,
                        })),
                    });
                });
            }

            console.log('%c📄 OBJETO COMPLETO:', 'color: #ff6600; font-weight: bold');
            console.log(data);

            setPrestamo(data as any);
        } catch (err: any) {
            const msg = err.message || 'Error cargando préstamo';
            console.error('%c❌ [devoluciones] Error:', 'color: #ff0000; font-weight: bold', msg);
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
            tipoDevolucion="evento"
            prestamoId={prestamoId}
            rutaRetorno="/prestamos/eventos"
            titulo="Registrar Devolución - Evento"
            registrarDevolucionFn={async (id, payload) => {
                return await prestamoEventoService.registrarDevolucion(id, payload);
            }}
        />
    );
}
