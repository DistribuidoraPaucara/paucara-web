import { route } from '@/infrastructure/routing/routes';
import { NotificationService } from '@/infrastructure/services/notification.service';
import AppLayout from '@/layouts/app-layout';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/presentation/components/ui/tooltip';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Plus, Search, Trash2, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface PageProps extends InertiaPageProps {
    compra: {
        id: number;
        numero: string;
        fecha: string;
        proveedor_nombre: string;
        almacen_nombre: string;
        almacen_id: number;
        estado_nombre: string;
    };
    moneda: {
        id: number;
        nombre: string;
        simbolo: string;
    };
    detalles: Array<{
        id: number;
        producto_id: number;
        producto_nombre: string;
        producto_sku: string;
        cantidad_original: number;
        cantidad_actual: number;
        lote_actual: string | null;
        fecha_vencimiento_actual: string | null;
        precio_unitario: number;
        subtotal: number;
        stock_total: number;
        stock_disponible: number;
        stock_reservado: number;
        stock_registrados: Array<{
            id: number;
            cantidad: number;
            cantidad_disponible: number;
            cantidad_reservada: number;
            lote: string | null;
            fecha_vencimiento: string | null;
        }>;
        movimientos: Array<{
            id: number;
            fecha: string;
            tipo: string;
            cantidad: number;
            cantidad_anterior: number;
            cantidad_posterior: number;
            lote: string;
            descripcion: string;
            referencia: string;
        }>;
    }>;
}

interface StockAnteriorActualizar {
    stock_id: number;
    cantidad?: number;
    nuevo_lote: string;
    nueva_fecha_vencimiento: string;
}

interface StockNuevo {
    cantidad: number;
    lote: string;
    fecha_vencimiento: string;
}

interface Transferencia {
    origen_stock_id: number;
    destino_stock_id: number;
    cantidad: number;
}

interface DetalleDistribuido {
    detalle_id: number;
    stock_anterior_actualizar: StockAnteriorActualizar[];
    stock_nuevo: StockNuevo[];
    transferencias?: Transferencia[];
}

// Inputs compactos para las celdas de la tabla
const claseInput =
    'rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white';

/**
 * Cantidad no negativa:
 * - bloquea "-", "+" y "e" (notación científica) al escribir, y lleva a 0 lo negativo que llegue al pegar
 * - la rueda del mouse no cambia el valor: el campo pierde el foco y la página sigue con su scroll
 */
function CantidadInput({
    value,
    onValor,
    min = 0,
    max,
    ...props
}: { value: number; onValor: (valor: number) => void; min?: number; max?: number } & Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'type' | 'max' | 'min'
>) {
    return (
        <input
            {...props}
            type="number"
            inputMode="decimal"
            step="0.01"
            min={min}
            max={max}
            value={value}
            onKeyDown={(e) => {
                if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
            }}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) => {
                const v = Math.max(0, parseFloat(e.target.value) || 0);
                onValor(max !== undefined ? Math.min(max, v) : v);
            }}
            // El mínimo se aplica al salir del campo, para no estorbar mientras se escribe
            onBlur={() => {
                if (value < min) onValor(min);
            }}
            className={`${claseInput} w-24 text-right`}
        />
    );
}

export default function AsignarLotes() {
    const { props } = usePage<PageProps>();
    const { compra, detalles, moneda } = props;

    // Función para detectar si un lote está vencido
    const isLoteVencido = (fechaVencimiento: string | null): boolean => {
        if (!fechaVencimiento) return false;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fecha = new Date(fechaVencimiento);
        fecha.setHours(0, 0, 0, 0);
        return fecha < hoy;
    };

    // ✅ DEBUG: Mostrar datos que llegan del backend
    console.log('=== DATOS DEL BACKEND ===');
    console.log('Compra:', compra);
    console.log('Moneda:', moneda);
    console.log('Detalles con movimientos:', detalles);
    detalles.forEach((detalle) => {
        console.log(`\n📦 Producto: ${detalle.producto_nombre}`);
        console.log('  Stock registrados:', detalle.stock_registrados);
        console.log('  Movimientos:', detalle.movimientos);
    });

    // Guardar valores originales para detectar cambios
    const valoresOriginales = useCallback(
        () =>
            detalles.reduce(
                (acc, detalle) => {
                    acc[detalle.id] = (detalle.stock_registrados || []).reduce(
                        (inner, stock) => {
                            inner[stock.id] = {
                                cantidad: stock.cantidad,
                                nuevo_lote: stock.lote || '',
                                nueva_fecha: stock.fecha_vencimiento ? stock.fecha_vencimiento.split('T')[0] : '',
                            };
                            return inner;
                        },
                        {} as Record<number, { cantidad: number; nuevo_lote: string; nueva_fecha: string }>,
                    );
                    return acc;
                },
                {} as Record<number, Record<number, { cantidad: number; nuevo_lote: string; nueva_fecha: string }>>,
            ),
        [detalles],
    );

    // Estado para stock anterior (actualizar)
    const [stockAnteriorActualizar, setStockAnteriorActualizar] =
        useState<Record<number, Record<number, { cantidad: number; nuevo_lote: string; nueva_fecha: string }>>>(valoresOriginales());

    // Crear referencia de valores originales para comparación
    const valoresOriginalesRef = useCallback(() => valoresOriginales(), [valoresOriginales]);

    // Estado para stock nuevo (crear): empieza sin filas; se agregan con "Agregar lote nuevo" o "Mover a… Lote nuevo"
    const [stockNuevo, setStockNuevo] = useState<Record<number, StockNuevo[]>>(
        detalles.reduce(
            (acc, detalle) => {
                acc[detalle.id] = [];
                return acc;
            },
            {} as Record<number, StockNuevo[]>,
        ),
    );

    // Estado para controlar el historial desplegable por detalle
    const [movimientosExpandidos, setMovimientosExpandidos] = useState<Record<number, boolean>>(
        detalles.reduce(
            (acc, detalle) => {
                acc[detalle.id] = false;
                return acc;
            },
            {} as Record<number, boolean>,
        ),
    );

    // Estado para mostrar modal de confirmación
    const [mostrarResumen, setMostrarResumen] = useState(false);
    const [resumenCambios, setResumenCambios] = useState<any>(null);

    // Estado para transferencias entre lotes
    const [transferencias, setTransferencias] = useState<Record<number, Transferencia[]>>(
        detalles.reduce(
            (acc, detalle) => {
                acc[detalle.id] = [];
                return acc;
            },
            {} as Record<number, Transferencia[]>,
        ),
    );

    const { post, processing } = useForm();

    // Buscador: solo filtra lo que se ve. El estado y el envío siguen usando TODOS los detalles,
    // así que lo editado en un producto oculto por el filtro se conserva y se guarda.
    const [busqueda, setBusqueda] = useState('');
    const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const detallesVisibles = useMemo(() => {
        const termino = normalizar(busqueda.trim());
        if (!termino) return detalles;
        return detalles.filter((d) =>
            [d.producto_nombre, d.producto_sku, String(d.producto_id), ...d.stock_registrados.map((s) => s.lote ?? '')].some((campo) =>
                normalizar(campo ?? '').includes(termino),
            ),
        );
    }, [busqueda, detalles]);

    // Agregar un nuevo stock a crear
    const agregarStockNuevo = useCallback((detalleId: number) => {
        setStockNuevo((prev) => {
            const nuevas = [...(prev[detalleId] || [])];
            nuevas.push({
                cantidad: 0,
                lote: '',
                fecha_vencimiento: '',
            });
            return { ...prev, [detalleId]: nuevas };
        });
    }, []);

    // Eliminar un stock nuevo
    const eliminarStockNuevo = useCallback((detalleId: number, index: number) => {
        setStockNuevo((prev) => {
            const nuevas = [...(prev[detalleId] || [])];
            nuevas.splice(index, 1);
            return { ...prev, [detalleId]: nuevas };
        });
    }, []);

    // Actualizar stock nuevo
    const actualizarStockNuevo = useCallback((detalleId: number, index: number, field: keyof StockNuevo, value: string | number) => {
        setStockNuevo((prev) => {
            const nuevas = [...(prev[detalleId] || [])];
            nuevas[index] = { ...nuevas[index], [field]: value };
            return { ...prev, [detalleId]: nuevas };
        });
    }, []);

    // Actualizar stock anterior
    const actualizarStockAnterior = useCallback((detalleId: number, stockId: number, field: 'nuevo_lote' | 'nueva_fecha', value: string) => {
        setStockAnteriorActualizar((prev) => {
            const updated = { ...prev };
            if (!updated[detalleId]) updated[detalleId] = {};
            updated[detalleId][stockId] = {
                ...updated[detalleId][stockId],
                [field]: value,
            };
            return updated;
        });
    }, []);

    // Eliminar una transferencia
    const eliminarTransferencia = useCallback((detalleId: number, index: number) => {
        setTransferencias((prev) => {
            const nuevas = [...(prev[detalleId] || [])];
            nuevas.splice(index, 1);
            return { ...prev, [detalleId]: nuevas };
        });
    }, []);

    // Actualizar transferencia
    const actualizarTransferencia = useCallback((detalleId: number, index: number, field: keyof Transferencia, value: number) => {
        setTransferencias((prev) => {
            const nuevas = [...(prev[detalleId] || [])];
            nuevas[index] = { ...nuevas[index], [field]: value };
            return { ...prev, [detalleId]: nuevas };
        });
    }, []);

    // Validar que haya al menos un lote/fecha asignado
    const validarAsignaciones = (): boolean => {
        let tieneAlgunCambio = false;

        for (const detalle of detalles) {
            const anteriores = stockAnteriorActualizar[detalle.id] || {};
            const nuevos = stockNuevo[detalle.id] || [];

            // Verificar si este detalle tiene cambios
            const tieneAlgoParaActualizar = Object.values(anteriores).some((stock) => stock.nuevo_lote || stock.nueva_fecha);
            const tieneAlgoParaCrear = nuevos.some((stock) => stock.cantidad > 0 || stock.lote || stock.fecha_vencimiento);

            if (tieneAlgoParaActualizar || tieneAlgoParaCrear) {
                tieneAlgunCambio = true;

                // Validar que los nuevos stocks tengan al menos lote o fecha (incluso si cantidad=0)
                for (const nuevoStock of nuevos) {
                    if (
                        (nuevoStock.cantidad > 0 || nuevoStock.lote || nuevoStock.fecha_vencimiento) &&
                        !nuevoStock.lote &&
                        !nuevoStock.fecha_vencimiento
                    ) {
                        NotificationService.error(`Todo nuevo stock debe tener al menos lote o fecha de vencimiento`);
                        return false;
                    }
                }
            }
        }

        // Verificar que al menos haya UN cambio
        if (!tieneAlgunCambio) {
            NotificationService.error('Debe hacer al menos un cambio a algún lote');
            return false;
        }

        return true;
    };

    // Mostrar resumen de cambios
    const mostrarResumenCambios = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validarAsignaciones()) {
            return;
        }

        // Construir resumen
        const originales = valoresOriginalesRef();
        const resumen = detalles
            .map((detalle) => {
                const anteriores = stockAnteriorActualizar[detalle.id] || {};
                const nuevos = stockNuevo[detalle.id] || [];
                const trans = transferencias[detalle.id] || [];
                const originalesDetalle = originales[detalle.id] || {};

                const actualizacionesConCambios = Object.entries(anteriores)
                    .filter(([stockId, data]) => {
                        const original = originalesDetalle[parseInt(stockId)];
                        // Solo mostrar si cambió respecto al original
                        if (!original) return false;
                        return data.nuevo_lote !== original.nuevo_lote || data.nueva_fecha !== original.nueva_fecha;
                    })
                    .map(([stockId, data]) => ({
                        stockId: parseInt(stockId),
                        cantidad: data.cantidad,
                        lote: data.nuevo_lote,
                        fecha: data.nueva_fecha,
                    }));

                const creaciones = nuevos.filter((s) => s.cantidad > 0 || s.lote || s.fecha_vencimiento);
                const transferenciasValidas = trans.filter((t) => t.cantidad > 0 && t.destino_stock_id > 0);

                if (actualizacionesConCambios.length === 0 && creaciones.length === 0 && transferenciasValidas.length === 0) return null;

                return {
                    detalleId: detalle.id,
                    productoNombre: detalle.producto_nombre,
                    actualizaciones: actualizacionesConCambios,
                    creaciones: creaciones.map((s, idx) => ({
                        index: idx,
                        cantidad: s.cantidad,
                        lote: s.lote,
                        fecha: s.fecha_vencimiento,
                    })),
                    transferencias: transferenciasValidas.map((t) => {
                        const origenStock = detalle.stock_registrados.find((s) => s.id === t.origen_stock_id);
                        const destinoStock = detalle.stock_registrados.find((s) => s.id === t.destino_stock_id);
                        return {
                            origen_stock_id: t.origen_stock_id,
                            origen_lote: origenStock?.lote || 'Sin lote',
                            destino_stock_id: t.destino_stock_id,
                            destino_lote: destinoStock?.lote || 'Sin lote',
                            cantidad: t.cantidad,
                        };
                    }),
                };
            })
            .filter(Boolean);

        setResumenCambios(resumen);
        setMostrarResumen(true);
    };

    // Enviar datos después de confirmación
    const confirmarEnvio = () => {
        const detallesPayload: DetalleDistribuido[] = detalles
            .map((detalle) => {
                const anteriores = stockAnteriorActualizar[detalle.id] || {};
                const nuevos = stockNuevo[detalle.id] || [];
                const trans = transferencias[detalle.id] || [];
                const stocksNuevosFiltrados = nuevos.filter((s) => s.cantidad > 0 || s.lote || s.fecha_vencimiento);
                const transferenciasValidas = trans.filter((t) => t.cantidad > 0 && t.destino_stock_id > 0);

                // Cambios en lotes existentes: lote/fecha asignados y, si cambió, la nueva cantidad.
                // La cantidad se compara con la ORIGINAL para enviar la reducción del lote correcto.
                const originalesDetalle = valoresOriginalesRef()[detalle.id] || {};
                const stocksActualizarFiltrados: StockAnteriorActualizar[] = [];
                let reduccionExplicita = 0;

                for (const [stockIdStr, data] of Object.entries(anteriores)) {
                    const stockId = parseInt(stockIdStr);
                    const original = originalesDetalle[stockId];
                    const cambioCantidad = !!original && Math.abs(data.cantidad - original.cantidad) > 0.0001;
                    if (!data.nuevo_lote && !data.nueva_fecha && !cambioCantidad) continue;

                    if (cambioCantidad && data.cantidad < original.cantidad) {
                        reduccionExplicita += original.cantidad - data.cantidad;
                    }
                    stocksActualizarFiltrados.push({
                        stock_id: stockId,
                        nuevo_lote: data.nuevo_lote,
                        nueva_fecha_vencimiento: data.nueva_fecha,
                        ...(cambioCantidad ? { cantidad: data.cantidad } : {}),
                    });
                }

                // Unidades de lotes nuevos que no salieron de una reducción explícita ("Mover a…" o editar Cantidad):
                // se toman del lote sin lote/sin fecha, una sola vez y partiendo de su cantidad original
                const totalNuevasUnidades = stocksNuevosFiltrados.reduce((sum, s) => sum + s.cantidad, 0);
                const pendiente = totalNuevasUnidades - reduccionExplicita;
                if (pendiente > 0.0001) {
                    const stockSinLoteEntry = Object.entries(anteriores).find(([, data]) => !data.nuevo_lote && !data.nueva_fecha);
                    if (stockSinLoteEntry) {
                        const stockSinLoteId = parseInt(stockSinLoteEntry[0]);
                        const original = originalesDetalle[stockSinLoteId];
                        const enLista = stocksActualizarFiltrados.find((s) => s.stock_id === stockSinLoteId);
                        const base = enLista?.cantidad ?? original?.cantidad ?? 0;
                        const nuevaCantidad = Math.max(0, base - pendiente);
                        if (enLista) {
                            enLista.cantidad = nuevaCantidad;
                        } else {
                            stocksActualizarFiltrados.push({
                                stock_id: stockSinLoteId,
                                cantidad: nuevaCantidad,
                                nuevo_lote: '',
                                nueva_fecha_vencimiento: '',
                            });
                        }
                    }
                }

                // Solo incluir detalles que tengan cambios
                if (stocksActualizarFiltrados.length === 0 && stocksNuevosFiltrados.length === 0 && transferenciasValidas.length === 0) {
                    return null;
                }

                const payload: DetalleDistribuido = {
                    detalle_id: detalle.id,
                    stock_anterior_actualizar: stocksActualizarFiltrados,
                    stock_nuevo: stocksNuevosFiltrados,
                };

                // Agregar transferencias si las hay
                if (transferenciasValidas.length > 0) {
                    payload.transferencias = transferenciasValidas;
                }

                return payload;
            })
            .filter((detalle): detalle is DetalleDistribuido => detalle !== null);

        const payloadToSend = { detalles: detallesPayload };

        console.log('%c📤 PAYLOAD QUE SE ENVÍA AL BACKEND', 'font-size: 16px; font-weight: bold; color: #2563eb;');
        console.log('%cCompra ID: ' + compra.id, 'font-size: 12px;');
        console.log('%cTotal detalles: ' + detallesPayload.length, 'font-size: 12px;');
        console.log('');

        detallesPayload.forEach((detalle, idx) => {
            const productoInfo = detalles.find((d) => d.id === detalle.detalle_id);
            console.log(
                `%c[DETALLE ${idx + 1}] Producto: ${productoInfo?.producto_nombre} (ID: ${productoInfo?.producto_id}, SKU: ${productoInfo?.producto_sku})`,
                'font-size: 12px; font-weight: bold; color: #7c3aed;',
            );

            if (detalle.stock_anterior_actualizar.length > 0) {
                console.log('%c  ✏️ STOCKS ANTERIORES A ACTUALIZAR:', 'color: #0891b2; font-weight: bold;');
                detalle.stock_anterior_actualizar.forEach((stock) => {
                    console.log(
                        `    - Stock ID: ${stock.stock_id} → Nuevo Lote: "${stock.nuevo_lote || 'sin cambio'}" | Nueva Fecha: "${stock.nueva_fecha_vencimiento || 'sin cambio'}"`,
                    );
                });
            }

            if (detalle.stock_nuevo.length > 0) {
                console.log('%c  ✨ STOCKS NUEVOS A CREAR:', 'color: #059669; font-weight: bold;');
                detalle.stock_nuevo.forEach((stock, sIdx) => {
                    console.log(
                        `    - Stock Nuevo ${sIdx + 1}: Cantidad=${stock.cantidad} | Lote="${stock.lote || 'sin lote'}" | Fecha="${stock.fecha_vencimiento || 'sin fecha'}"`,
                    );
                });
            }
            console.log('');
        });

        console.log('%cJSON COMPLETO:', 'font-size: 12px; font-weight: bold; color: #dc2626;');
        console.log(JSON.stringify(payloadToSend, null, 2));

        setMostrarResumen(false);

        const url = route('compras.guardar-lotes', compra.id);
        console.log('⏳ Iniciando fetch a:', url);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            },
            body: JSON.stringify(payloadToSend),
        })
            .then(async (response) => {
                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    // 422: errores de negocio (errores[]) o de validación de Laravel (errors{campo: [msg]})
                    const motivos: string[] =
                        data.errores ?? (data.errors ? [...new Set(Object.values(data.errors as Record<string, string[]>).flat())] : []);
                    const mensaje = motivos.length > 0 ? motivos.join(' · ') : data.message || `Error ${response.status}`;
                    NotificationService.error(`No se guardaron los lotes: ${mensaje}`);
                    return;
                }

                NotificationService.success('Lotes asignados exitosamente');
                router.visit(route('compras.show', compra.id));
            })
            .catch((error) => {
                console.error('❌ ERROR EN LA SOLICITUD:', error);
                NotificationService.error('Error de conexión al asignar lotes: ' + error.message);
            });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Compras', href: '/compras' },
                { title: compra.numero, href: `/compras/${compra.id}` },
                { title: 'Asignar Lotes', href: '#' },
            ]}
        >
            <Head title="Asignar Lotes y Fechas de Vencimiento" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Asignar Lotes y Fechas de Vencimiento</h1>
                    <div className="flex gap-3">
                        <Link
                            href={`/compras/${compra.id}`}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancelar
                        </Link>
                        <button
                            onClick={(e) => mostrarResumenCambios(e as any)}
                            disabled={processing}
                            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
                        >
                            {processing ? 'Guardando...' : 'Guardar Asignaciones'}
                        </button>
                    </div>
                </div>

                {/* Información de la Compra */}
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Compra</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                #{compra.numero} | ID: #{compra.id}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Fecha</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{new Date(compra.fecha).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Proveedor</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{compra.proveedor_nombre}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Almacén</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{compra.almacen_nombre}</p>
                        </div>
                    </div>
                </div>

                {/* Alert de Información */}
                {/* <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Asignación de Lotes</AlertTitle>
          <AlertDescription>
            Asigna los lotes y fechas de vencimiento a los productos de esta compra. Puedes distribuir una cantidad
            en múltiples lotes si es necesario. La suma de cantidades debe ser igual a la cantidad original.
          </AlertDescription>
        </Alert> */}

                {/* Modal de Resumen */}
                {mostrarResumen && (
                    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800">
                            <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📋 Resumen de Cambios</h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Revisa los cambios antes de confirmar</p>
                            </div>

                            <div className="space-y-6 p-6">
                                {resumenCambios?.map((item: any) => (
                                    <div key={item.detalleId} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                                            📦 {item.productoNombre} | {item.productoCodigo}
                                        </h3>

                                        {/* Actualizaciones */}
                                        {item.actualizaciones.length > 0 && (
                                            <div className="mb-4">
                                                <p className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">
                                                    ✏️ Stock Anterior - Actualizar ({item.actualizaciones.length})
                                                </p>
                                                <div className="space-y-2 rounded bg-green-50 p-3 dark:bg-green-900/20">
                                                    {item.actualizaciones.map((act: any, idx: number) => (
                                                        <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                                            <span className="font-mono">Stock #{act.stockId}</span>
                                                            {act.cantidad !== undefined && <span> → Cantidad: {act.cantidad}</span>}
                                                            {act.lote && <span> → Lote: {act.lote}</span>}
                                                            {act.fecha && <span> → Fecha: {act.fecha}</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Creaciones */}
                                        {item.creaciones.length > 0 && (
                                            <div className="mb-4">
                                                <p className="mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                                                    ✨ Stock Nuevo - Crear ({item.creaciones.length})
                                                </p>
                                                <div className="space-y-2 rounded bg-blue-50 p-3 dark:bg-blue-900/20">
                                                    {item.creaciones.map((nuevo: any, idx: number) => (
                                                        <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                                            <span className="font-semibold">Nuevo Stock #{idx + 1}</span>
                                                            <span> → Cantidad: {nuevo.cantidad}</span>
                                                            {nuevo.lote && <span> → Lote: {nuevo.lote}</span>}
                                                            {nuevo.fecha && <span> → Fecha: {nuevo.fecha}</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Transferencias */}
                                        {item.transferencias && item.transferencias.length > 0 && (
                                            <div>
                                                <p className="mb-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
                                                    🔄 Transferencias entre Lotes ({item.transferencias.length})
                                                </p>
                                                <div className="space-y-2 rounded bg-purple-50 p-3 dark:bg-purple-900/20">
                                                    {item.transferencias.map((trans: any, idx: number) => (
                                                        <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                                            <span className="font-semibold">Transferencia #{idx + 1}</span>
                                                            <span> → De: {trans.origen_lote}</span>
                                                            <span> → A: {trans.destino_lote}</span>
                                                            <span> → Cantidad: {trans.cantidad}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setMostrarResumen(false)}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Volver
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmarEnvio}
                                    disabled={processing}
                                    className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
                                >
                                    {processing ? 'Guardando...' : 'Confirmar y Guardar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Buscador de productos */}
                <div className="sticky top-12 z-10 -mx-6 bg-gray-100/90 px-6 py-2 backdrop-blur dark:bg-gray-900/90">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative w-full max-w-md">
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="search"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                onKeyDown={(e) => e.key === 'Escape' && setBusqueda('')}
                                placeholder="Buscar producto por nombre, SKU, ID o lote…"
                                aria-label="Buscar producto"
                                className="w-full rounded-md border border-gray-300 bg-white py-2 pr-9 pl-9 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                            {busqueda && (
                                <button
                                    type="button"
                                    onClick={() => setBusqueda('')}
                                    title="Limpiar búsqueda (Esc)"
                                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
                            {busqueda.trim() ? `${detallesVisibles.length} de ${detalles.length} productos` : `${detalles.length} productos`}
                        </span>
                    </div>
                </div>

                {/* Form: una tabla por producto (lotes actuales, transferencias y lotes nuevos comparten columnas) */}
                <form onSubmit={mostrarResumenCambios} className="space-y-6">
                    {detallesVisibles.length === 0 && (
                        <div className="rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
                            <p className="text-sm text-gray-600 dark:text-gray-300">Ningún producto coincide con «{busqueda.trim()}».</p>
                            <button
                                type="button"
                                onClick={() => setBusqueda('')}
                                className="mt-3 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                            >
                                Limpiar búsqueda
                            </button>
                        </div>
                    )}
                    {detallesVisibles.map((detalle) => {
                        const nuevos = stockNuevo[detalle.id] || [];
                        const transDetalle = transferencias[detalle.id] || [];
                        const historialAbierto = movimientosExpandidos[detalle.id] || false;
                        const cantidadDe = (stock: { id: number; cantidad: number }) =>
                            stockAnteriorActualizar[detalle.id]?.[stock.id]?.cantidad ?? stock.cantidad;

                        // Parte de la cantidad que se puede mover: lo reservado se queda en el lote (sus proformas apuntan a él)
                        const movibleDe = (stock: PageProps['detalles'][number]['stock_registrados'][number]) =>
                            Math.max(0, Math.min(cantidadDe(stock) - stock.cantidad_reservada, stock.cantidad_disponible));

                        // "Mover a…": pasar la parte disponible a un lote nuevo o transferirla a otro lote existente
                        const moverCantidad = (stock: PageProps['detalles'][number]['stock_registrados'][number], destino: string) => {
                            const cantidadATransferir = movibleDe(stock);
                            if (!destino || cantidadATransferir <= 0) return;

                            if (destino === 'nuevo') {
                                setStockNuevo((prev) => {
                                    const lista = [...(prev[detalle.id] || [])];
                                    const fila = {
                                        cantidad: cantidadATransferir,
                                        lote: stock.lote || '',
                                        fecha_vencimiento: stock.fecha_vencimiento ? stock.fecha_vencimiento.split('T')[0] : '',
                                    };
                                    // Reutilizar una fila recién agregada y todavía vacía; si no, agregar otra
                                    const vacia = lista.findIndex((f) => f.cantidad === 0 && !f.lote && !f.fecha_vencimiento);
                                    if (vacia >= 0) lista[vacia] = fila;
                                    else lista.push(fila);
                                    return { ...prev, [detalle.id]: lista };
                                });
                                setStockAnteriorActualizar((prev) => {
                                    const updated = { ...prev };
                                    if (!updated[detalle.id]) updated[detalle.id] = {};
                                    // En el lote origen queda lo que no se movió (como mínimo, lo reservado)
                                    updated[detalle.id][stock.id] = {
                                        ...updated[detalle.id][stock.id],
                                        cantidad: cantidadDe(stock) - cantidadATransferir,
                                    };
                                    return updated;
                                });
                            } else {
                                setTransferencias((prev) => ({
                                    ...prev,
                                    [detalle.id]: [
                                        ...(prev[detalle.id] || []),
                                        { origen_stock_id: stock.id, destino_stock_id: Number(destino), cantidad: cantidadATransferir },
                                    ],
                                }));
                            }
                        };

                        return (
                            <section key={detalle.id} className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                                {/* Encabezado del producto con los totales en una sola línea */}
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                                    <div>
                                        <h3 className="text-base font-semibold text-cyan-700 dark:text-cyan-300">{detalle.producto_nombre}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            SKU {detalle.producto_sku} ·{' '}
                                            <a
                                                href={`/productos/${detalle.producto_id}/edit`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Editar producto en otra pestaña"
                                                className="inline-flex items-center gap-0.5 font-medium text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                ID {detalle.producto_id}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </p>
                                    </div>
                                    <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
                                        {[
                                            { label: 'Comprado', valor: detalle.cantidad_original, clase: 'text-gray-900 dark:text-white' },
                                            { label: 'Stock total', valor: detalle.stock_total, clase: 'text-blue-700 dark:text-blue-300' },
                                            { label: 'Disponible', valor: detalle.stock_disponible, clase: 'text-green-700 dark:text-green-300' },
                                            { label: 'Reservado', valor: detalle.stock_reservado, clase: 'text-orange-700 dark:text-orange-300' },
                                        ].map(({ label, valor, clase }) => (
                                            <div key={label} className="flex items-baseline gap-1">
                                                <dt className="text-gray-500 dark:text-gray-400">{label}:</dt>
                                                <dd className={`font-mono font-semibold tabular-nums ${clase}`}>{Number(valor).toFixed(2)}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-3 py-2 text-left font-medium">
                                                    Lote
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-left font-medium">
                                                    Vencimiento
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-right font-medium">
                                                    Total
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-right font-medium">
                                                    Disponible
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-right font-medium">
                                                    Reservado
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-right font-medium">
                                                    Cantidad
                                                </th>
                                                <th scope="col" className="px-3 py-2 text-left font-medium">
                                                    Acción
                                                </th>
                                            </tr>
                                        </thead>

                                        {/* Lotes actuales */}
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            <tr className="bg-gray-50/60 dark:bg-gray-900/30">
                                                <th
                                                    colSpan={7}
                                                    scope="rowgroup"
                                                    className="px-3 py-1.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300"
                                                >
                                                    Lotes actuales ({detalle.stock_registrados.length})
                                                </th>
                                            </tr>
                                            {detalle.stock_registrados.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="px-3 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                                        No hay lotes activos de este producto en el almacén.
                                                    </td>
                                                </tr>
                                            )}
                                            {detalle.stock_registrados.map((stock) => {
                                                const vencido = isLoteVencido(stock.fecha_vencimiento);
                                                const otros = detalle.stock_registrados.filter((s) => s.id !== stock.id);
                                                return (
                                                    <tr
                                                        key={stock.id}
                                                        className={
                                                            vencido ? 'bg-red-50/70 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                                                        }
                                                    >
                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    title={`Registro de stock #${stock.id}`}
                                                                    className="w-12 shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-center font-mono text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                                                >
                                                                    #{stock.id}
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    aria-label={`Lote del registro #${stock.id}`}
                                                                    value={
                                                                        stockAnteriorActualizar[detalle.id]?.[stock.id]?.nuevo_lote ||
                                                                        stock.lote ||
                                                                        ''
                                                                    }
                                                                    onChange={(e) =>
                                                                        actualizarStockAnterior(detalle.id, stock.id, 'nuevo_lote', e.target.value)
                                                                    }
                                                                    placeholder="Sin lote"
                                                                    className={`${claseInput} w-36 font-mono`}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="date"
                                                                    aria-label={`Vencimiento del registro #${stock.id}`}
                                                                    value={
                                                                        stockAnteriorActualizar[detalle.id]?.[stock.id]?.nueva_fecha ||
                                                                        (stock.fecha_vencimiento ? stock.fecha_vencimiento.split('T')[0] : '')
                                                                    }
                                                                    onChange={(e) =>
                                                                        actualizarStockAnterior(detalle.id, stock.id, 'nueva_fecha', e.target.value)
                                                                    }
                                                                    className={`${claseInput} w-40`}
                                                                />
                                                                {vencido && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <a
                                                                                href={`/compras/lotes-vencimientos?producto_id=${detalle.producto_id}&estado_vencimiento=VENCIDO&vista=tabla`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                aria-label={`Lote vencido. Abrir Lotes y vencimientos de ${detalle.producto_nombre} para darlo de baja`}
                                                                                className="inline-flex items-center gap-1 rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700 transition hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60"
                                                                            >
                                                                                <AlertTriangle className="h-3 w-3" />
                                                                                Vencido
                                                                                <ExternalLink className="h-3 w-3 opacity-70" />
                                                                            </a>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="top" className="max-w-xs text-left">
                                                                            <p className="font-semibold">Lote vencido</p>
                                                                            <p>
                                                                                Para darlo de baja, ve a{' '}
                                                                                <strong>Compras → Lotes y vencimientos</strong>. Haz clic para abrirlo
                                                                                en otra pestaña, ya filtrado por este producto.
                                                                            </p>
                                                                            {stock.cantidad_reservada > 0 && (
                                                                                <p className="mt-1">
                                                                                    Tiene {stock.cantidad_reservada} unidad(es) reservada(s) en
                                                                                    proformas: revisa esas proformas antes de darlo de baja.
                                                                                </p>
                                                                            )}
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 text-right font-mono text-gray-900 tabular-nums dark:text-white">
                                                            {stock.cantidad}
                                                        </td>
                                                        <td className="px-3 py-2 text-right font-mono text-green-700 tabular-nums dark:text-green-300">
                                                            {stock.cantidad_disponible}
                                                        </td>
                                                        <td className="px-3 py-2 text-right font-mono text-orange-700 tabular-nums dark:text-orange-300">
                                                            {stock.cantidad_reservada}
                                                        </td>
                                                        <td className="px-3 py-2 text-right">
                                                            <CantidadInput
                                                                aria-label={`Cantidad del registro #${stock.id}`}
                                                                title={
                                                                    stock.cantidad_reservada > 0
                                                                        ? `Mínimo ${stock.cantidad_reservada}: reservadas en proformas`
                                                                        : undefined
                                                                }
                                                                min={stock.cantidad_reservada}
                                                                max={stock.cantidad}
                                                                value={cantidadDe(stock)}
                                                                onValor={(cantidad) =>
                                                                    setStockAnteriorActualizar((prev) => {
                                                                        const updated = { ...prev };
                                                                        if (!updated[detalle.id]) updated[detalle.id] = {};
                                                                        updated[detalle.id][stock.id] = {
                                                                            ...updated[detalle.id][stock.id],
                                                                            cantidad,
                                                                        };
                                                                        return updated;
                                                                    })
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <select
                                                                value=""
                                                                aria-label={`Mover la cantidad del registro #${stock.id}`}
                                                                title="Mover la cantidad indicada a un lote nuevo o a otro lote"
                                                                disabled={movibleDe(stock) <= 0}
                                                                onChange={(e) => moverCantidad(stock, e.target.value)}
                                                                className={`${claseInput} w-40 disabled:opacity-50`}
                                                            >
                                                                <option value="">⇄ Mover a…</option>
                                                                <option value="nuevo">✨ Lote nuevo</option>
                                                                {otros.map((o) => (
                                                                    <option key={o.id} value={o.id}>
                                                                        #{o.id} · {o.lote || 'Sin lote'} ({o.cantidad} u.)
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>

                                        {/* Transferencias entre lotes */}
                                        {transDetalle.length > 0 && (
                                            <tbody className="divide-y divide-purple-100 dark:divide-purple-900/40">
                                                <tr className="bg-purple-50 dark:bg-purple-900/20">
                                                    <th
                                                        colSpan={7}
                                                        scope="rowgroup"
                                                        className="px-3 py-1.5 text-left text-xs font-semibold text-purple-800 dark:text-purple-200"
                                                    >
                                                        Transferencias entre lotes ({transDetalle.length})
                                                    </th>
                                                </tr>
                                                {transDetalle.map((trans, index) => {
                                                    const origen = detalle.stock_registrados.find((s) => s.id === trans.origen_stock_id);
                                                    return (
                                                        <tr key={index} className="bg-purple-50/40 dark:bg-purple-900/10">
                                                            <td colSpan={5} className="px-3 py-2">
                                                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                                                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                                                                        <span className="text-xs text-gray-500">#{origen?.id}</span>{' '}
                                                                        {origen?.lote || 'Sin lote'}{' '}
                                                                        <span className="text-xs text-gray-500">
                                                                            ({origen?.cantidad_disponible} disp.)
                                                                        </span>
                                                                    </span>
                                                                    <span className="text-purple-600 dark:text-purple-300">→</span>
                                                                    <select
                                                                        value={trans.destino_stock_id}
                                                                        aria-label="Lote destino"
                                                                        onChange={(e) =>
                                                                            actualizarTransferencia(
                                                                                detalle.id,
                                                                                index,
                                                                                'destino_stock_id',
                                                                                parseInt(e.target.value),
                                                                            )
                                                                        }
                                                                        className={`${claseInput} w-48`}
                                                                    >
                                                                        <option value={0}>-- Selecciona destino --</option>
                                                                        {detalle.stock_registrados
                                                                            .filter((s) => s.id !== trans.origen_stock_id)
                                                                            .map((s) => (
                                                                                <option key={s.id} value={s.id}>
                                                                                    #{s.id} · {s.lote || 'Sin lote'} ({s.cantidad} u.)
                                                                                </option>
                                                                            ))}
                                                                    </select>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2 text-right">
                                                                <CantidadInput
                                                                    max={origen?.cantidad_disponible || 0}
                                                                    title={`Máximo ${origen?.cantidad_disponible ?? 0} disponibles${origen && origen.cantidad_reservada > 0 ? ` (${origen.cantidad_reservada} reservadas no se mueven)` : ''}`}
                                                                    aria-label="Cantidad a transferir"
                                                                    value={trans.cantidad}
                                                                    onValor={(cantidad) =>
                                                                        actualizarTransferencia(detalle.id, index, 'cantidad', cantidad)
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => eliminarTransferencia(detalle.id, index)}
                                                                    title="Quitar transferencia"
                                                                    className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        )}

                                        {/* Lotes nuevos: solo se muestran si se agregó alguno */}
                                        {nuevos.length > 0 && (
                                            <tbody className="divide-y divide-blue-100 dark:divide-blue-900/40">
                                                <tr className="bg-blue-50 dark:bg-blue-900/20">
                                                    <th
                                                        colSpan={7}
                                                        scope="rowgroup"
                                                        className="px-3 py-1.5 text-left text-xs font-semibold text-blue-800 dark:text-blue-200"
                                                    >
                                                        Lotes nuevos ({nuevos.length})
                                                    </th>
                                                </tr>
                                                {nuevos.map((nuevoStock, index) => (
                                                    <tr key={index} className="bg-blue-50/30 dark:bg-blue-900/5">
                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    title="Lote que se creará al guardar"
                                                                    className="w-12 shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-center text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                                                >
                                                                    Nuevo
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    aria-label={`Lote nuevo ${index + 1}`}
                                                                    value={nuevoStock.lote}
                                                                    onChange={(e) => actualizarStockNuevo(detalle.id, index, 'lote', e.target.value)}
                                                                    placeholder="Ej: LOTE-001"
                                                                    className={`${claseInput} w-36 font-mono`}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <input
                                                                type="date"
                                                                aria-label={`Vencimiento del lote nuevo ${index + 1}`}
                                                                value={nuevoStock.fecha_vencimiento}
                                                                onChange={(e) =>
                                                                    actualizarStockNuevo(detalle.id, index, 'fecha_vencimiento', e.target.value)
                                                                }
                                                                className={`${claseInput} w-40`}
                                                            />
                                                        </td>
                                                        <td colSpan={3} className="px-3 py-2 text-right text-xs text-gray-400">
                                                            —
                                                        </td>
                                                        <td className="px-3 py-2 text-right">
                                                            <CantidadInput
                                                                aria-label={`Cantidad del lote nuevo ${index + 1}`}
                                                                value={nuevoStock.cantidad}
                                                                onValor={(cantidad) => actualizarStockNuevo(detalle.id, index, 'cantidad', cantidad)}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => eliminarStockNuevo(detalle.id, index)}
                                                                title="Quitar lote nuevo"
                                                                className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        )}

                                        <tbody>
                                            <tr className="border-t border-gray-100 dark:border-gray-700">
                                                <td colSpan={7} className="px-3 py-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => agregarStockNuevo(detalle.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                        Agregar lote nuevo
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Historial de movimientos (desplegable) */}
                                {detalle.movimientos && detalle.movimientos.length > 0 && (
                                    <div className="border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => setMovimientosExpandidos((prev) => ({ ...prev, [detalle.id]: !prev[detalle.id] }))}
                                            aria-expanded={historialAbierto}
                                            className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/40"
                                        >
                                            <span>Historial de movimientos ({detalle.movimientos.length})</span>
                                            {historialAbierto ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </button>
                                        {historialAbierto && (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full text-xs">
                                                    <thead className="bg-gray-50 tracking-wide text-gray-500 uppercase dark:bg-gray-700 dark:text-gray-400">
                                                        <tr>
                                                            <th scope="col" className="px-3 py-1.5 text-left font-medium">
                                                                Fecha
                                                            </th>
                                                            <th scope="col" className="px-3 py-1.5 text-left font-medium">
                                                                Tipo
                                                            </th>
                                                            <th scope="col" className="px-3 py-1.5 text-left font-medium">
                                                                Lote
                                                            </th>
                                                            <th scope="col" className="px-3 py-1.5 text-right font-medium">
                                                                Anterior
                                                            </th>
                                                            <th scope="col" className="px-3 py-1.5 text-right font-medium">
                                                                Cantidad
                                                            </th>
                                                            <th scope="col" className="px-3 py-1.5 text-right font-medium">
                                                                Posterior
                                                            </th>
                                                            <th scope="col" className="px-3 py-1.5 text-left font-medium">
                                                                Referencia
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                        {detalle.movimientos.map((mov) => (
                                                            <tr key={mov.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                                                                <td className="px-3 py-1.5 whitespace-nowrap text-gray-700 dark:text-gray-300">
                                                                    {new Date(mov.fecha).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-3 py-1.5">
                                                                    <span
                                                                        className={`rounded px-1.5 py-0.5 font-medium ${
                                                                            mov.tipo.includes('ENTRADA')
                                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                                                                : mov.tipo.includes('SALIDA')
                                                                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                                                                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                                        }`}
                                                                    >
                                                                        {mov.tipo}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-1.5 font-mono text-gray-700 dark:text-gray-300">{mov.lote}</td>
                                                                <td className="px-3 py-1.5 text-right font-mono text-gray-500 tabular-nums">
                                                                    {mov.cantidad_anterior.toFixed(2)}
                                                                </td>
                                                                <td
                                                                    className={`px-3 py-1.5 text-right font-mono font-semibold tabular-nums ${mov.cantidad < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}
                                                                >
                                                                    {mov.cantidad > 0 ? '+' : ''}
                                                                    {mov.cantidad.toFixed(2)}
                                                                </td>
                                                                <td className="px-3 py-1.5 text-right font-mono text-gray-900 tabular-nums dark:text-white">
                                                                    {mov.cantidad_posterior.toFixed(2)}
                                                                </td>
                                                                <td className="px-3 py-1.5 font-mono text-gray-500">{mov.referencia}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>
                        );
                    })}

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3">
                        <Link
                            href={`/compras/${compra.id}`}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
                        >
                            {processing ? 'Guardando...' : 'Guardar Asignaciones'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
