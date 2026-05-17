import { Head } from '@inertiajs/react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Search, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import ProveedorSelector from '@/presentation/components/form-sections/ProveedorSelector';

interface DetalleLocal {
    id: string; // ID temporal único
    prestable_id: number;
    almacen_id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    prestable?: { id: number; nombre: string; codigo: string };
    almacen?: { id: number; nombre: string };
}

interface Prestable {
    id: number;
    nombre: string;
    codigo: string;
    tipo?: string;
    capacidad?: number;
    precio_compra_referencial?: number;
    precios?: Array<{
        tipo_precio?: string;
        valor?: number;
        activo?: boolean;
    }>;
    ultimoDetalleCompra?: {
        precio_unitario?: number;
    };
    embasesRelacionados?: Prestable[];
    stocks?: Array<{
        almacen_id?: number;
        almacenes_prestables_id?: number;
        almacen?: { id: number; nombre: string };
        almacen_prestable?: { id: number; nombre: string };
        almacenPrestable?: { id: number; nombre: string };
        cantidad_disponible: number;
    }>;
}

interface Proveedor {
    id: number;
    nombre: string;
    razon_social?: string;
    nit?: string;
    telefono?: string;
    email?: string;
}

interface Almacen {
    id: number;
    nombre: string;
}

export default function CrearCompraPrestable() {
    const ALMACEN_ID_PRESTABLES = 3; // Almacén fijo para prestables

    const [detalles, setDetalles] = useState<DetalleLocal[]>([]);
    const [loading, setLoading] = useState(false);
    const [prestables, setPrestables] = useState<Prestable[]>([]);
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [buscandoProveedores, setBuscandoProveedores] = useState(false);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);

    // Modal de impresión
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [compraCreada, setCompraCreada] = useState<any>(null);

    // Buscador de prestables
    const [busqueda, setBusqueda] = useState('');
    const [sugerencias, setSugerencias] = useState<Prestable[]>([]);
    const [showSugerencias, setShowSugerencias] = useState(false);

    const busquedaRef = useRef<HTMLInputElement>(null);
    const sugerenciasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        cargarPrestables();
        cargarProveedores();
    }, []);

    // Cerrar sugerencias al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                sugerenciasRef.current &&
                !sugerenciasRef.current.contains(e.target as Node) &&
                busquedaRef.current &&
                !busquedaRef.current.contains(e.target as Node)
            ) {
                setShowSugerencias(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filtrar prestables en tiempo real
    useEffect(() => {
        if (busqueda.trim().length < 1) {
            setSugerencias([]);
            setShowSugerencias(false);
            return;
        }
        const q = busqueda.toLowerCase();
        const filtrados = prestables.filter(
            (p) => p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q)
        );
        setSugerencias(filtrados.slice(0, 10));
        setShowSugerencias(true);
    }, [busqueda, prestables]);

    const cargarPrestables = async () => {
        try {
            const response = await fetch('/api/prestables?with=stocks');
            const data = await response.json();
            if (data.success) {
                setPrestables(data.data.data || data.data);
            }
        } catch (error) {
            console.error('Error cargando prestables:', error);
        }
    };

    const cargarProveedores = useCallback(async () => {
        try {
            const response = await fetch('/api/proveedores?limit=100');
            const data = await response.json();
            const proveedoresData = Array.isArray(data) ? data : (data.data?.data || data.data || []);
            setProveedores(proveedoresData);
        } catch (error) {
            console.error('Error cargando proveedores:', error);
        }
    }, []);

    const buscarProveedores = useCallback(async (query: string) => {
        if (query.trim().length === 0) {
            cargarProveedores();
            return;
        }

        try {
            setBuscandoProveedores(true);
            const response = await fetch(`/api/proveedores/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            const proveedoresData = Array.isArray(data) ? data : (data.data || []);
            setProveedores(proveedoresData);
        } catch (error) {
            console.error('Error buscando proveedores:', error);
            cargarProveedores();
        } finally {
            setBuscandoProveedores(false);
        }
    }, [cargarProveedores]);

    const getAlmacenesDePrestable = useCallback((prestable?: Prestable): Almacen[] => {
        const almacenesMap = new Map<number, Almacen>();

        (prestable?.stocks || []).forEach((stock) => {
            const almacenId = Number(stock.almacen_id || stock.almacenes_prestables_id || 0);
            if (almacenId <= 0) return;

            const nombre =
                stock.almacen?.nombre ||
                stock.almacen_prestable?.nombre ||
                stock.almacenPrestable?.nombre ||
                `Almacén ${almacenId}`;

            almacenesMap.set(almacenId, { id: almacenId, nombre });
        });

        if (almacenesMap.size === 0) {
            almacenesMap.set(ALMACEN_ID_PRESTABLES, {
                id: ALMACEN_ID_PRESTABLES,
                nombre: 'Almacén Prestables',
            });
        }

        return Array.from(almacenesMap.values());
    }, []);

    const getAlmacenesDetalle = useCallback(
        (prestableId: number): Almacen[] => {
            const prestable = prestables.find((p) => p.id === prestableId);
            return getAlmacenesDePrestable(prestable);
        },
        [prestables, getAlmacenesDePrestable]
    );

    const actualizarAlmacenDetalle = (detalleId: string, nuevoAlmacenId: number) => {
        setDetalles((prev) =>
            prev.map((d) => {
                if (d.id !== detalleId) return d;

                const almacenesDisponibles = getAlmacenesDetalle(d.prestable_id);
                const almacenSeleccionado =
                    almacenesDisponibles.find((a) => a.id === nuevoAlmacenId) ||
                    d.almacen ||
                    { id: nuevoAlmacenId, nombre: `Almacén ${nuevoAlmacenId}` };

                return {
                    ...d,
                    almacen_id: nuevoAlmacenId,
                    almacen: almacenSeleccionado,
                };
            })
        );
    };

    const seleccionarPrestable = (prestable: Prestable) => {
        console.log('✅ Prestable seleccionado:', prestable.nombre);
        console.log('📦 Stock disponible:', prestable.stocks);
        console.log('🔗 Embases relacionados:', prestable.embasesRelacionados);

        const nuevosDetalles: DetalleLocal[] = [];
        const almacenesPrestable = getAlmacenesDePrestable(prestable);
        const almacenDefault = almacenesPrestable[0];
        const precioCompraPrestable = getPrecioCompraPrestable(prestable);

        // Agregar el prestable seleccionado
        const nuevoDetalle: DetalleLocal = {
            id: Date.now().toString(),
            prestable_id: prestable.id,
            almacen_id: almacenDefault.id,
            cantidad: 1,
            precio_unitario: precioCompraPrestable,
            subtotal: precioCompraPrestable,
            prestable: {
                id: prestable.id,
                nombre: prestable.nombre,
                codigo: prestable.codigo,
            },
            almacen: {
                id: almacenDefault.id,
                nombre: almacenDefault.nombre,
            },
        };
        nuevosDetalles.push(nuevoDetalle);

        // Si tiene embases relacionados, agregarlos automáticamente
        if (prestable.embasesRelacionados && prestable.embasesRelacionados.length > 0) {
            prestable.embasesRelacionados.forEach((embase) => {
                const almacenesEmbase = getAlmacenesDePrestable(embase);
                const almacenEmbaseDefault = almacenesEmbase[0];
                const precioCompraEmbase = getPrecioCompraPrestable(embase);

                const detalleEmbase: DetalleLocal = {
                    id: (Date.now() + Math.random()).toString(),
                    prestable_id: embase.id,
                    almacen_id: almacenEmbaseDefault.id,
                    cantidad: 1, // 1 embase por canastilla
                    precio_unitario: precioCompraEmbase,
                    subtotal: precioCompraEmbase,
                    prestable: {
                        id: embase.id,
                        nombre: embase.nombre,
                        codigo: embase.codigo,
                    },
                    almacen: {
                        id: almacenEmbaseDefault.id,
                        nombre: almacenEmbaseDefault.nombre,
                    },
                };
                nuevosDetalles.push(detalleEmbase);
                console.log('✅ Embase agregado automáticamente:', embase.nombre);
            });
        }

        setDetalles((prev) => [...prev, ...nuevosDetalles]);
        setBusqueda('');
        setSugerencias([]);
        setShowSugerencias(false);
        busquedaRef.current?.focus();
    };

    const actualizarDetalle = (detalleId: string, campo: 'cantidad' | 'precio_unitario', valor: string) => {
        setDetalles(
            detalles.map((d) => {
                if (d.id !== detalleId) return d;

                const cantidad = campo === 'cantidad' ? parseInt(valor) || 0 : d.cantidad;
                const precio = campo === 'precio_unitario' ? parseFloat(valor) || 0 : d.precio_unitario;

                return {
                    ...d,
                    cantidad,
                    precio_unitario: precio,
                    subtotal: cantidad * precio,
                };
            })
        );
    };

    const getPrecioCompraPrestable = (prestable?: Prestable): number => {
        if (!prestable) return 0;

        const referencial = Number(prestable.precio_compra_referencial || 0);
        if (referencial > 0) return referencial;

        const precioCompra = (prestable.precios || []).find(
            (p) => p?.tipo_precio === 'COMPRA' && p?.activo !== false
        );

        if (Number(precioCompra?.valor || 0) > 0) {
            return Number(precioCompra?.valor || 0);
        }

        return Number(prestable.ultimoDetalleCompra?.precio_unitario || 0);
    };

    const eliminarDetalle = (detalleId: string) => {
        setDetalles(detalles.filter((d) => d.id !== detalleId));
    };

    const confirmarCompra = async () => {
        if (detalles.length === 0) {
            alert('Agregue al menos un detalle antes de confirmar');
            return;
        }

        try {
            setLoading(true);

            // Preparar detalles para enviar (sin el ID temporal)
            const detallesParaEnviar = detalles.map((d) => ({
                prestable_id: d.prestable_id,
                almacen_id: d.almacen_id,
                almacenes_prestables_id: d.almacen_id,
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario,
            }));

            const response = await fetch('/api/compras-prestables', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    proveedor_id: proveedorSeleccionado?.id || null,
                    detalles: detallesParaEnviar,
                }),
            });

            const result = await response.json();
            if (result.success) {
                // Guardar datos de compra y mostrar modal de impresión
                setCompraCreada(result.data);
                setShowOutputModal(true);
                // Limpiar detalles
                setDetalles([]);
                setProveedorSeleccionado(null);
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error confirmando compra:', error);
            alert('Error al confirmar la compra');
        } finally {
            setLoading(false);
        }
    };

    const calcularTotal = () => {
        return detalles.reduce((sum, d) => sum + (d.subtotal ?? 0), 0);
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Préstamos', href: '/prestamos' }, { label: 'Nueva Compra de Prestables' }]}>
            <Head title="Crear Compra de Prestables" />

            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Nueva Compra de Prestables
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Modo de creación directa: Agregar detalles y confirmar
                        </p>
                    </div>
                </div>

                {/* Contenedor con 2 columnas responsivas */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Selector de Proveedor */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                        <ProveedorSelector
                            value={proveedorSeleccionado?.id || null}
                            onSelect={(proveedor) => setProveedorSeleccionado(proveedor)}
                            proveedoresDisponibles={proveedores}
                            onSearchChange={buscarProveedores}
                            isSearching={buscandoProveedores}
                            label="🏭 Proveedor (Opcional)"
                        />
                    </div>

                    {/* Buscador de Prestables */}
                    <div className="relative">
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            🔍 Buscar Prestable para Agregar
                        </label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <input
                                ref={busquedaRef}
                                type="text"
                                placeholder="Buscar por nombre o código..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
                            />
                        </div>

                        {/* Sugerencias */}
                        {showSugerencias && sugerencias.length > 0 && (
                            <div
                                ref={sugerenciasRef}
                                className="absolute top-full z-50 mt-2 w-full rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
                            >
                                {sugerencias.map((prestable) => (
                                    <button
                                        key={prestable.id}
                                        onClick={() => seleccionarPrestable(prestable)}
                                        className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left transition hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                {prestable.nombre}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Código: {prestable.codigo}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                            +
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabla de detalles */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full">
                        <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Prestable
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Almacén
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Cantidad
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Precio Unitario
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Subtotal
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {detalles.length > 0 ? (
                                detalles.map((detalle) => (
                                    <tr
                                        key={detalle.id}
                                        className="bg-white transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                {detalle.prestable?.nombre}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {detalle.prestable?.codigo}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                            <select
                                                value={detalle.almacen_id}
                                                onChange={(e) =>
                                                    actualizarAlmacenDetalle(
                                                        detalle.id,
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                                            >
                                                {getAlmacenesDetalle(detalle.prestable_id).map((almacen) => (
                                                    <option key={`${detalle.id}-${almacen.id}`} value={almacen.id}>
                                                        {almacen.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                min="1"
                                                value={detalle.cantidad}
                                                onChange={(e) =>
                                                    actualizarDetalle(detalle.id, 'cantidad', e.target.value)
                                                }
                                                className="w-16 rounded border border-slate-300 bg-white px-2 py-1 text-center text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={detalle.precio_unitario}
                                                onChange={(e) =>
                                                    actualizarDetalle(detalle.id, 'precio_unitario', e.target.value)
                                                }
                                                className="w-24 rounded border border-slate-300 bg-white px-2 py-1 text-right text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                            {(parseFloat(detalle.subtotal ?? 0)).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => eliminarDetalle(detalle.id)}
                                                className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <AlertCircle size={24} />
                                            <p>Busca arriba para agregar prestables</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {detalles.length > 0 && (
                            <tfoot>
                                <tr className="border-t-2 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                                    <td colSpan={4} className="px-4 py-4 text-right" />
                                    <td className="px-4 py-4">
                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            TOTAL
                                        </p>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {(parseFloat(calcularTotal() ?? 0)).toFixed(2)}
                                        </p>
                                    </td>
                                    <td />
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>

                {/* Botón confirmar */}
                {detalles.length > 0 && (
                    <div className="flex justify-end">
                        <Button
                            onClick={confirmarCompra}
                            disabled={loading}
                            className="bg-green-600 px-8 hover:bg-green-700"
                        >
                            {loading ? (
                                <>Confirmando...</>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <CheckCircle size={18} />
                                    Confirmar Compra
                                </span>
                            )}
                        </Button>
                    </div>
                )}

                {/* Modal de selección de formato de impresión */}
                {compraCreada && (
                    <OutputSelectionModal
                        isOpen={showOutputModal}
                        onClose={() => {
                            setShowOutputModal(false);
                            // Redirigir al listado después de cerrar el modal
                            setTimeout(() => {
                                window.location.href = '/prestamos/compras';
                            }, 500);
                        }}
                        documentoId={compraCreada.id}
                        tipoDocumento="compras-prestables"
                        documentoInfo={{
                            numero: compraCreada.numero_compra,
                            proveedor: compraCreada.proveedor?.nombre || 'Sin proveedor',
                            cantidad_total: compraCreada.cantidad_total,
                            total: compraCreada.total,
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}
