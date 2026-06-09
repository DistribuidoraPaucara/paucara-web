import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { AlertCircle } from 'lucide-react';
import type { PrestamoCliente } from '@/domain/entities/prestamos';
import prestamoProveedorService from '@/infrastructure/services/prestamo-proveedor.service';
import { RegistrarDevolucionGenerico } from '@/presentation/components/prestamos/RegistrarDevolucionGenerico';

interface Props {
    prestamoId: number;
}

export default function RegistrarDevolucionProveedor({ prestamoId }: Props) {
    const [prestamo, setPrestamo] = useState<PrestamoCliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarPrestamo();
    }, [prestamoId]);

    const cargarPrestamo = async () => {
        setLoading(true);
        try {
            const data = await prestamoProveedorService.getById(prestamoId);

            console.log('%c📥 DATOS DEL BACKEND - PROVEEDOR', 'color: #0066cc; font-weight: bold; font-size: 14px');
            console.log('%c=== CABECERA ===', 'color: #00aa00; font-weight: bold');
            console.log({
                id: data.id,
                proveedor_id: data.proveedor_id,
                proveedor: data.proveedor,
                fecha_prestamo: data.fecha_prestamo,
                estado: data.estado,
            });

            console.log('%c=== DETALLES ===', 'color: #00aa00; font-weight: bold');
            console.log(`Total detalles: ${data.detalles?.length || 0}`);
            if (data.detalles && data.detalles.length > 0) {
                data.detalles.forEach((d: any, idx: number) => {
                    console.log(`%c📦 Detalle ${idx + 1}:`, 'color: #ff6600; font-weight: bold', {
                        id: d.id,
                        prestable_id: d.prestable_id,
                        prestable_nombre: d.prestable?.nombre,
                        cantidad_prestada: d.cantidad_prestada,
                        almacenes: d.almacenes?.map((a: any) => ({
                            almacen_id: a.almacenes_prestables_id,
                            almacen_nombre: a.almacen?.nombre,
                            cantidad: a.cantidad,
                        })),
                        devolucionDetalles: d.devolucionDetalles?.map((dev: any) => ({
                            id: dev.id,
                            cantidad_devuelta: dev.cantidad_devuelta,
                            cantidad_dañada_total: dev.cantidad_dañada_total,
                        })),
                    });
                });
            }

            console.log('%c📄 OBJETO COMPLETO:', 'color: #ff6600; font-weight: bold');
            console.log(data);

            setPrestamo(data);
        } catch (err: any) {
            const msg = err.message || 'Error cargando préstamo';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const registrarDevolucion = async (id: number, payload: any) => {
        return prestamoProveedorService.registrarDevolucion(id, {
            fecha_devolucion: payload.fecha_devolucion,
            monto_cobrado_daño_total: payload.monto_cobrado_daño_total,
            observaciones: payload.observaciones,
            detalles: payload.detalles.map((d: any) => ({
                prestamo_proveedor_detalle_id: d.prestamo_proveedor_detalle_id,  // ✅ CORREGIDO: usar correcto
                cantidad_devuelta: d.cantidad_devuelta,
                cantidad_dañada_total: d.cantidad_dañada_total,
                monto_cobrado_daño: d.monto_cobrado_daño,
            })),
        });
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
            tipoDevolucion="proveedor"
            prestamoId={prestamoId}
            rutaRetorno="/prestamos/proveedores"
            titulo="Registrar Devolución - Proveedor"
            registrarDevolucionFn={registrarDevolucion}
        />
    );
}
