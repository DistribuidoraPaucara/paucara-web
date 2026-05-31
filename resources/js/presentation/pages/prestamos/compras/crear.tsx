import { Head } from '@inertiajs/react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { CheckCircle } from 'lucide-react';
import DynamicSearchSelect from '@/presentation/components/form-sections/DynamicSearchSelect';
import SearchAndItemsTable from '@/presentation/components/form-sections/SearchAndItemsTable';

interface DetalleLocal {
    id: string; // ID temporal único
    prestable_id: number;
    almacen_id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    prestable?: { id: number; nombre: string; codigo: string; tipo?: string };
    almacen?: { id: number; nombre: string };
    tipo?: string;
    precio_compra_referencial?: number;
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
    const [busquedaProveedor, setBusquedaProveedor] = useState('');
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);

    // Estados para seleccionar almacén de prestables
    const [almacenes, setAlmacenes] = useState<any[]>([]);
    const [buscandoAlmacenes, setBuscandoAlmacenes] = useState(false);
    const [busquedaAlmacen, setBusquedaAlmacen] = useState('');
    const [almacenSeleccionado, setAlmacenSeleccionado] = useState<any | null>(null);

    // Estados para seleccionar compra existente
    const [compras, setCompras] = useState<any[]>([]);
    const [compraSeleccionada, setCompraSeleccionada] = useState<any | null>(null);
    const [buscandoCompras, setBuscandoCompras] = useState(false);
    const [busquedaCompra, setBusquedaCompra] = useState('');

    // Modal de impresión
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [compraCreada, setCompraCreada] = useState<any>(null);

    // Buscador de prestables
    const [busqueda, setBusqueda] = useState('');
    const [sugerencias, setSugerencias] = useState<Prestable[]>([]);
    const [showSugerencias, setShowSugerencias] = useState(false);

    const busquedaRef = useRef<HTMLInputElement>(null);
    const sugerenciasRef = useRef<HTMLDivElement>(null);

    const cargarAlmacenes = useCallback(async () => {
        try {
            const response = await fetch('/api/almacenes-prestables/index-json?per_page=100');
            const data = await response.json();
            const almacenesData = data.success ? (Array.isArray(data.data) ? data.data : data.data || []) : [];
            setAlmacenes(almacenesData);
        } catch (error) {
            console.error('Error cargando almacenes:', error);
        }
    }, []);

    useEffect(() => {
        cargarPrestables();
        cargarProveedores();
        cargarAlmacenes();
    }, [cargarAlmacenes]);

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
            setProveedores([]);
            return;
        }

        try {
            setBuscandoProveedores(true);
            const response = await fetch(`/api/proveedores/index-json?q=${encodeURIComponent(query)}&per_page=20`);
            const data = await response.json();
            const proveedoresData = data.success ? (Array.isArray(data.data) ? data.data : data.data || []) : [];
            setProveedores(proveedoresData);
        } catch (error) {
            console.error('Error buscando proveedores:', error);
            setProveedores([]);
        } finally {
            setBuscandoProveedores(false);
        }
    }, []);

    const buscarAlmacenes = useCallback(async (query: string) => {
        if (query.trim().length === 0) {
            // Si no hay búsqueda, mantener almacenes pre-cargados
            await cargarAlmacenes();
            return;
        }

        try {
            setBuscandoAlmacenes(true);
            const response = await fetch(`/api/almacenes-prestables/index-json?q=${encodeURIComponent(query)}&per_page=20`);
            const data = await response.json();
            const almacenesData = data.success ? (Array.isArray(data.data) ? data.data : data.data || []) : [];
            setAlmacenes(almacenesData);
        } catch (error) {
            console.error('Error buscando almacenes:', error);
            setAlmacenes([]);
        } finally {
            setBuscandoAlmacenes(false);
        }
    }, [cargarAlmacenes]);

    const buscarCompras = useCallback(async (query: string) => {
        if (query.trim().length === 0) {
            setCompras([]);
            return;
        }

        try {
            setBuscandoCompras(true);
            // API endpoint que retorna compras en JSON con búsqueda y paginación
            const response = await fetch(`/api/compras/index-json?q=${encodeURIComponent(query)}&per_page=20`);
            const data = await response.json();
            const comprasData = data.success ? (Array.isArray(data.data) ? data.data : data.data || []) : [];
            setCompras(comprasData);
        } catch (error) {
            console.error('Error buscando compras:', error);
            setCompras([]);
        } finally {
            setBuscandoCompras(false);
        }
    }, []);

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

    const getRowClassName = (item: DetalleLocal): string => {
        const baseClass = 'transition ';
        if (item.tipo === 'CANASTILLA') {
            return baseClass + 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border-l-4 border-blue-500';
        } else if (item.tipo === 'EMBASES') {
            return baseClass + 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 border-l-4 border-amber-500';
        }
        return baseClass + 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800';
    };

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
            tipo: prestable.tipo,
            precio_compra_referencial: prestable.precio_compra_referencial,
            prestable: {
                id: prestable.id,
                nombre: prestable.nombre,
                codigo: prestable.codigo,
                tipo: prestable.tipo,
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
                    tipo: embase.tipo,
                    precio_compra_referencial: embase.precio_compra_referencial,
                    prestable: {
                        id: embase.id,
                        nombre: embase.nombre,
                        codigo: embase.codigo,
                        tipo: embase.tipo,
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

        if (!almacenSeleccionado) {
            alert('Debe seleccionar un almacén de prestables');
            return;
        }

        try {
            setLoading(true);

            // Preparar detalles para enviar (sin el ID temporal)
            const detallesParaEnviar = detalles.map((d) => ({
                prestable_id: d.prestable_id,
                almacen_id: d.almacen_id,
                almacenes_prestables_id: almacenSeleccionado.id,
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
                    almacenes_prestables_id: almacenSeleccionado?.id || null,
                    compra_id: compraSeleccionada?.id || null,
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
                setAlmacenSeleccionado(null);
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
        <AppLayout breadcrumbs={[{ title: 'Préstamos', href: '/prestamos' }, { title: 'Nueva Compra de Prestables' }]}>
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

                {/* Contenedor con 3 columnas responsivas */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Buscador de Compra Existente - Componente Genérico */}
                    <DynamicSearchSelect
                        label="📋 Asignar a Compra Existente (Opcional)"
                        placeholder="Buscar por ID o número de compra..."
                        selectedItem={compraSeleccionada}
                        items={compras}
                        isLoading={buscandoCompras}
                        searchValue={busquedaCompra}
                        onSearch={(query) => {
                            setBusquedaCompra(query);
                            buscarCompras(query);
                        }}
                        onSelect={(compra) => {
                            setCompraSeleccionada(compra);
                            setBusquedaCompra('');
                            setCompras([]);
                            // Auto-cargar proveedor si la compra tiene proveedor_id
                            if (compra.proveedor_id && compra.proveedor) {
                                setProveedorSeleccionado(compra.proveedor);
                            }
                        }}
                        onClear={() => {
                            setCompraSeleccionada(null);
                            setBusquedaCompra('');
                            setCompras([]);
                        }}
                        getItemId={(compra) => compra.id}
                        getDisplayValue={(compra) => `Compra #${compra.id}`}
                        renderItem={(compra) => (
                            <div>
                                <div className="font-medium text-slate-900 dark:text-slate-100">
                                    Compra #{compra.id}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                    {compra.numero_compra} - {compra.proveedor?.nombre || 'Sin proveedor'}
                                </div>
                            </div>
                        )}
                    />

                    {/* Selector de Proveedor - Componente Genérico */}
                    <DynamicSearchSelect
                        label="🏭 Proveedor (Opcional)"
                        placeholder="Buscar por nombre o NIT..."
                        selectedItem={proveedorSeleccionado}
                        items={proveedores}
                        isLoading={buscandoProveedores}
                        searchValue={busquedaProveedor}
                        onSearch={(query) => {
                            setBusquedaProveedor(query);
                            buscarProveedores(query);
                        }}
                        onSelect={(proveedor) => {
                            setProveedorSeleccionado(proveedor);
                            setBusquedaProveedor('');
                            setProveedores([]);
                        }}
                        onClear={() => {
                            setProveedorSeleccionado(null);
                            setBusquedaProveedor('');
                            setProveedores([]);
                        }}
                        getItemId={(proveedor) => proveedor.id}
                        getDisplayValue={(proveedor) => proveedor.nombre}
                        renderItem={(proveedor) => (
                            <div>
                                <div className="font-medium text-slate-900 dark:text-slate-100">
                                    {proveedor.nombre}
                                </div>
                                {proveedor.razon_social && (
                                    <div className="text-xs text-slate-600 dark:text-slate-400">
                                        {proveedor.razon_social}
                                    </div>
                                )}
                                {proveedor.nit && (
                                    <div className="text-xs text-slate-600 dark:text-slate-400">
                                        NIT: {proveedor.nit}
                                    </div>
                                )}
                            </div>
                        )}
                    />

                    {/* Selector de Almacén de Prestables - Componente Genérico */}
                    <DynamicSearchSelect
                        label="📦 Almacén de Prestables (Requerido)"
                        placeholder="Buscar almacén..."
                        selectedItem={almacenSeleccionado}
                        items={almacenes}
                        isLoading={buscandoAlmacenes}
                        searchValue={busquedaAlmacen}
                        onSearch={(query) => {
                            setBusquedaAlmacen(query);
                            buscarAlmacenes(query);
                        }}
                        onSelect={(almacen) => {
                            setAlmacenSeleccionado(almacen);
                            setBusquedaAlmacen('');
                            setAlmacenes([]);
                        }}
                        onClear={() => {
                            setAlmacenSeleccionado(null);
                            setBusquedaAlmacen('');
                            setAlmacenes([]);
                        }}
                        getItemId={(almacen) => almacen.id}
                        getDisplayValue={(almacen) => almacen.nombre}
                        renderItem={(almacen) => (
                            <div>
                                <div className="font-medium text-slate-900 dark:text-slate-100">
                                    {almacen.nombre}
                                </div>
                                {almacen.es_proveedor && (
                                    <div className="text-xs text-slate-600 dark:text-slate-400">
                                        (Proveedor)
                                    </div>
                                )}
                            </div>
                        )}
                    />
                </div>

                {/* Búsqueda y Tabla de Prestables - Componente Genérico */}
                <SearchAndItemsTable
                    label="🔍 Buscar Prestable para Agregar"
                    placeholder="Buscar por nombre o código..."
                    searchValue={busqueda}
                    onSearchChange={setBusqueda}
                    isSearching={false}
                    searchResults={sugerencias}
                    onSelectItem={seleccionarPrestable}
                    items={detalles}
                    columns={[
                        {
                            key: 'prestable',
                            label: 'Prestable',
                            render: (item) => (
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                        {item.prestable?.nombre}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        ID: {item.prestable?.id} | Código: {item.prestable?.codigo}
                                    </p>
                                </div>
                            ),
                        },
                        {
                            key: 'cantidad',
                            label: 'Cantidad',
                            render: (item) => (
                                <input
                                    type="number"
                                    min="1"
                                    value={item.cantidad}
                                    onChange={(e) =>
                                        actualizarDetalle(item.id, 'cantidad', e.target.value)
                                    }
                                    className="w-16 rounded border border-slate-300 bg-white px-2 py-1 text-center text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                                />
                            ),
                        },
                        {
                            key: 'precio_compra_referencial',
                            label: 'Precio Ref.',
                            align: 'right',
                            render: (item) => (
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {item.precio_compra_referencial ? parseFloat(item.precio_compra_referencial.toString()).toFixed(2) : '—'}
                                </span>
                            ),
                        },
                        {
                            key: 'precio_unitario',
                            label: 'Precio Unitario',
                            align: 'right',
                            render: (item) => (
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.precio_unitario}
                                    onChange={(e) =>
                                        actualizarDetalle(item.id, 'precio_unitario', e.target.value)
                                    }
                                    className="w-24 rounded border border-slate-300 bg-white px-2 py-1 text-right text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                                />
                            ),
                        },
                        {
                            key: 'subtotal',
                            label: 'Subtotal',
                            align: 'right',
                            render: (item) => (
                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                    {(parseFloat(item.subtotal ?? 0)).toFixed(2)}
                                </span>
                            ),
                        },
                    ]}
                    getRowClassName={getRowClassName}
                    onDeleteItem={eliminarDetalle}
                    getItemId={(item) => item.id}
                    renderSearchItem={(prestable) => (
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                                {prestable.nombre}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Código: {prestable.codigo}
                            </p>
                        </div>
                    )}
                    emptyMessage="Busca arriba para agregar prestables"
                    totalLabel="TOTAL"
                    totalValue={(parseFloat(calcularTotal() ?? 0)).toFixed(2)}
                />

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
