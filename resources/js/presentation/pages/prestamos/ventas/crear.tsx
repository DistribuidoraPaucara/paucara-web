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
    prestable?: { id: number; nombre: string; codigo: string; tipo?: string; capacidad?: number };
    almacen?: { id: number; nombre: string };
    tipo?: string;
    precio_venta_referencial?: number;
    prestable_padre_id?: number; // Para embases: ID de la canastilla padre
    capacidad?: number; // Capacidad de la canastilla
    precio_unitario_original?: number; // Precio original del embase (antes de ajustar por capacidad)
}

interface Prestable {
    id: number;
    nombre: string;
    codigo: string;
    tipo?: string;
    capacidad?: number;
    precio_venta_referencial?: number;
    precios?: Array<{
        tipo_precio?: string;
        valor?: number;
        activo?: boolean;
    }>;
    ultimoDetalleVenta?: {
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

interface Cliente {
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

export default function CrearVentaPrestable() {
    const ALMACEN_ID_PRESTABLES = 3; // Almacén fijo para prestables

    const [detalles, setDetalles] = useState<DetalleLocal[]>([]);
    const [loading, setLoading] = useState(false);
    const [prestables, setPrestables] = useState<Prestable[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [buscandoClientes, setBuscandoClientes] = useState(false);
    const [busquedaCliente, setBusquedaCliente] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

    // Estados para seleccionar almacén de prestables
    const [almacenes, setAlmacenes] = useState<any[]>([]);
    const [buscandoAlmacenes, setBuscandoAlmacenes] = useState(false);
    const [busquedaAlmacen, setBusquedaAlmacen] = useState('');
    const [almacenSeleccionado, setAlmacenSeleccionado] = useState<any | null>(null);

    // Modal de impresión
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [ventaCreada, setVentaCreada] = useState<any>(null);

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
        cargarClientes();
        cargarAlmacenes();
    }, [cargarAlmacenes]);

    // Auto-seleccionar almacén con es_proveedor=false
    useEffect(() => {
        if (almacenes.length > 0 && !almacenSeleccionado) {
            const almacenCliente = almacenes.find((a) => !a.es_proveedor);
            if (almacenCliente) {
                setAlmacenSeleccionado(almacenCliente);
            }
        }
    }, [almacenes]);

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

    const cargarClientes = useCallback(async () => {
        try {
            const response = await fetch('/api/clientes?limit=100');
            const data = await response.json();
            const clientesData = Array.isArray(data) ? data : (data.data?.data || data.data || []);
            setClientes(clientesData);
        } catch (error) {
            console.error('Error cargando clientes:', error);
        }
    }, []);

    const buscarClientes = useCallback(async (query: string) => {
        if (query.trim().length === 0) {
            await cargarClientes();
            return;
        }

        try {
            setBuscandoClientes(true);
            const response = await fetch(`/api/clientes/index-json?q=${encodeURIComponent(query)}&per_page=20`);
            const data = await response.json();
            const clientesData = data.success ? (Array.isArray(data.data) ? data.data : data.data || []) : [];
            setClientes(clientesData);
        } catch (error) {
            console.error('Error buscando clientes:', error);
            setClientes([]);
        } finally {
            setBuscandoClientes(false);
        }
    }, [cargarClientes]);

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
            // Embases relacionados (incluidos en canastilla)
            if (item.prestable_padre_id) {
                return baseClass + 'bg-blue-100/50 hover:bg-blue-150/50 dark:bg-blue-900/30 dark:hover:bg-blue-900/40 border-l-4 border-blue-400';
            }
            // Embases sueltos
            return baseClass + 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 border-l-4 border-amber-500';
        }
        return baseClass + 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800';
    };

    const getRowIndicator = (item: DetalleLocal) => {
        if (item.prestable_padre_id) {
            // Es un embase relacionado (incluido en la canastilla)
            return (
                <span className="inline-flex items-center justify-center rounded-full bg-blue-200 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" title="Incluido en canastilla">
                    ✓
                </span>
            );
        } else if (item.tipo === 'EMBASES') {
            // Es un embase suelto (no relacionado)
            return (
                <span className="inline-flex items-center justify-center rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" title="Embase suelto">
                    ◆
                </span>
            );
        }
        // Canastilla
        return null;
    };

    const seleccionarPrestable = (prestable: Prestable) => {
        if (!almacenSeleccionado) {
            alert('Debe seleccionar un almacén primero');
            return;
        }

        console.log('✅ Prestable seleccionado:', prestable.nombre);
        console.log('📦 Stock disponible:', prestable.stocks);
        console.log('🔗 Embases relacionados:', prestable.embasesRelacionados);

        const nuevosDetalles: DetalleLocal[] = [];
        const precioVentaPrestable = getPrecioVentaPrestable(prestable);

        // Agregar el prestable seleccionado
        const nuevoDetalle: DetalleLocal = {
            id: Date.now().toString(),
            prestable_id: prestable.id,
            almacen_id: almacenSeleccionado.id,
            cantidad: 1,
            precio_unitario: precioVentaPrestable,
            subtotal: precioVentaPrestable,
            tipo: prestable.tipo,
            capacidad: prestable.capacidad,
            precio_venta_referencial: prestable.precio_venta_referencial,
            prestable: {
                id: prestable.id,
                nombre: prestable.nombre,
                codigo: prestable.codigo,
                tipo: prestable.tipo,
                capacidad: prestable.capacidad,
            },
            almacen: {
                id: almacenSeleccionado.id,
                nombre: almacenSeleccionado.nombre,
            },
        };
        nuevosDetalles.push(nuevoDetalle);

        // Si tiene embases relacionados, agregarlos automáticamente
        if (prestable.embasesRelacionados && prestable.embasesRelacionados.length > 0) {
            prestable.embasesRelacionados.forEach((embase) => {
                // Cantidad inicial de embases = cantidad canastilla * capacidad
                const cantidadEmbase = (prestable.capacidad || 1) * 1;
                // Precio unitario del embase = precio canastilla / capacidad de la canastilla
                const precioUnitarioEmbase = precioVentaPrestable / (prestable.capacidad || 1);

                const detalleEmbase: DetalleLocal = {
                    id: (Date.now() + Math.random()).toString(),
                    prestable_id: embase.id,
                    almacen_id: almacenSeleccionado.id,
                    cantidad: cantidadEmbase,
                    precio_unitario: precioUnitarioEmbase,
                    subtotal: cantidadEmbase * precioUnitarioEmbase,
                    tipo: embase.tipo,
                    capacidad: embase.capacidad,
                    precio_venta_referencial: embase.precio_venta_referencial,
                    precio_unitario_original: precioVentaPrestable, // Guardar precio de canastilla como referencia
                    prestable_padre_id: prestable.id, // Guardar la relación con la canastilla
                    prestable: {
                        id: embase.id,
                        nombre: embase.nombre,
                        codigo: embase.codigo,
                        tipo: embase.tipo,
                        capacidad: embase.capacidad,
                    },
                    almacen: {
                        id: almacenSeleccionado.id,
                        nombre: almacenSeleccionado.nombre,
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
        setDetalles((prevDetalles) => {
            const detalleActualizado = prevDetalles.find((d) => d.id === detalleId);
            if (!detalleActualizado) return prevDetalles;

            const cantidad = campo === 'cantidad' ? parseInt(valor) || 0 : detalleActualizado.cantidad;
            const precio = campo === 'precio_unitario' ? parseFloat(valor) || 0 : detalleActualizado.precio_unitario;

            const nuevoDetalles = prevDetalles.map((d) => {
                if (d.id !== detalleId) return d;

                return {
                    ...d,
                    cantidad,
                    precio_unitario: precio,
                    subtotal: cantidad * precio,
                };
            });

            // Si es una canastilla, actualizar embases relacionados
            if (detalleActualizado.tipo === 'CANASTILLA' && detalleActualizado.capacidad) {
                const nuevoDetallesConEmbases = nuevoDetalles.map((d) => {
                    // Si es un embase de esta canastilla, actualizar automáticamente
                    if (
                        d.prestable_padre_id === detalleActualizado.prestable_id &&
                        d.tipo === 'EMBASES'
                    ) {
                        // Actualizar cantidad si se cambió la cantidad de canastilla
                        const nuevaCantidadEmbase = campo === 'cantidad'
                            ? cantidad * detalleActualizado.capacidad
                            : d.cantidad;

                        // Actualizar precio unitario del embase si se cambió el precio de canastilla
                        // Fórmula: precio_embase_unitario = precio_canastilla / capacidad_canastilla
                        const nuevoPrecioUnitarioEmbase = campo === 'precio_unitario'
                            ? precio / detalleActualizado.capacidad
                            : (d.precio_unitario_original || d.precio_unitario) / (detalleActualizado.capacidad || 1);

                        return {
                            ...d,
                            cantidad: nuevaCantidadEmbase,
                            precio_unitario: nuevoPrecioUnitarioEmbase,
                            subtotal: nuevaCantidadEmbase * nuevoPrecioUnitarioEmbase,
                        };
                    }
                    return d;
                });
                return nuevoDetallesConEmbases;
            }

            return nuevoDetalles;
        });
    };

    const getPrecioVentaPrestable = (prestable?: Prestable): number => {
        if (!prestable) return 0;

        const referencial = Number(prestable.precio_venta_referencial || 0);
        if (referencial > 0) return referencial;

        const precioVenta = (prestable.precios || []).find(
            (p) => p?.tipo_precio === 'VENTA' && p?.activo !== false
        );

        if (Number(precioVenta?.valor || 0) > 0) {
            return Number(precioVenta?.valor || 0);
        }

        return Number(prestable.ultimoDetalleVenta?.precio_unitario || 0);
    };

    const eliminarDetalle = (detalleId: string) => {
        setDetalles(detalles.filter((d) => d.id !== detalleId));
    };

    const confirmarVenta = async () => {
        if (detalles.length === 0) {
            alert('Agregue al menos un detalle antes de confirmar');
            return;
        }

        if (!clienteSeleccionado) {
            alert('Debe seleccionar un cliente');
            return;
        }

        if (!almacenSeleccionado) {
            alert('Debe seleccionar un almacén de prestables');
            return;
        }

        try {
            setLoading(true);

            // Preparar detalles para enviar (incluyendo embases relacionados)
            // Los embases relacionados son referenciales en precio (no suman total)
            // pero su cantidad SÍ afecta el stock
            const detallesParaEnviar = detalles
                .map((d) => ({
                    prestable_id: d.prestable_id,
                    almacen_id: d.almacen_id,
                    almacenes_prestables_id: almacenSeleccionado.id,
                    cantidad: d.cantidad,
                    precio_unitario: d.precio_unitario,
                    prestable_padre_id: d.prestable_padre_id || null, // Identificar embases relacionados
                }));

            const response = await fetch('/api/prestamos-vendidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    cliente_id: clienteSeleccionado?.id || null,
                    almacenes_prestables_id: almacenSeleccionado?.id || null,
                    detalles: detallesParaEnviar,
                }),
            });

            const result = await response.json();
            if (result.success) {
                // Guardar datos de venta y mostrar modal de impresión
                setVentaCreada(result.data);
                setShowOutputModal(true);
                // Limpiar detalles
                setDetalles([]);
                setClienteSeleccionado(null);
                setAlmacenSeleccionado(null);
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error confirmando venta:', error);
            alert('Error al confirmar la venta');
        } finally {
            setLoading(false);
        }
    };

    const calcularTotal = () => {
        // Solo sumar canastillas y embases sueltos (sin prestable_padre_id)
        return detalles
            .filter((d) => !d.prestable_padre_id) // Excluir embases relacionados
            .reduce((sum, d) => sum + (d.subtotal ?? 0), 0);
    };

    const calcularTotalEmbasesRelacionados = () => {
        // Sumar solo embases que están relacionados a canastillas
        return detalles
            .filter((d) => d.prestable_padre_id) // Solo embases relacionados
            .reduce((sum, d) => sum + (d.subtotal ?? 0), 0);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Préstamos', href: '/prestamos/prestables' }, { title: 'Nueva Venta de Canastillas / Embases', href: '/prestamos/ventas/crear' }]}>
            <Head title="Crear Venta de Canastillas / Embases" />

            <div className="flex h-full flex-1 flex-col gap-4 p-2">
                {/* Header */}
                {/* <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Nueva Venta de Canastillas / Embases
                        </h1>
                    </div>
                </div> */}

                {/* Contenedor con 2 columnas responsivas */}
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                                <div className="flex items-center gap-2 text-xs">
                                    <span className={`inline-block rounded px-2 py-0.5 font-semibold ${
                                        almacen.es_proveedor
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                    }`}>
                                        {almacen.es_proveedor ? '👤 Proveedor' : '🏢 Cliente'}
                                    </span>
                                </div>
                            </div>
                        )}
                    />
                    {/* Selector de Cliente - Componente Genérico */}
                    <DynamicSearchSelect
                        label="👤 Cliente (Requerido)"
                        placeholder="Buscar por nombre o NIT..."
                        selectedItem={clienteSeleccionado}
                        items={clientes}
                        isLoading={buscandoClientes}
                        searchValue={busquedaCliente}
                        onSearch={(query) => {
                            setBusquedaCliente(query);
                            buscarClientes(query);
                        }}
                        onSelect={(cliente) => {
                            setClienteSeleccionado(cliente);
                            setBusquedaCliente('');
                            setClientes([]);
                        }}
                        onClear={() => {
                            setClienteSeleccionado(null);
                            setBusquedaCliente('');
                            setClientes([]);
                        }}
                        getItemId={(cliente) => cliente.id}
                        getDisplayValue={(cliente) => cliente.nombre}
                        renderItem={(cliente) => (
                            <div>
                                <div className="font-medium text-slate-900 dark:text-slate-100">
                                    {cliente.nombre}
                                </div>
                                {cliente.razon_social && (
                                    <div className="text-xs text-slate-600 dark:text-slate-400">
                                        {cliente.razon_social}
                                    </div>
                                )}
                                {cliente.nit && (
                                    <div className="text-xs text-slate-600 dark:text-slate-400">
                                        NIT: {cliente.nit}
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
                            key: 'tipo',
                            label: 'Tipo Prestable',
                            render: (item) => {
                                if (item.tipo === 'CANASTILLA') {
                                    return (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                            📦 Canastilla
                                        </span>
                                    );
                                } else if (item.tipo === 'EMBASES') {
                                    return (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                            🏪 Embase
                                        </span>
                                    );
                                }
                                return <span className="text-xs text-slate-500">—</span>;
                            }
                        },
                        // codigo prestable
                        {
                            key: 'codigo',
                            label: 'Código',
                            render: (item) => (
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {item.prestable?.codigo}
                                </span>
                            ),
                        },
                        // capacidad (solo para canastilla)
                        {
                            key: 'capacidad',
                            label: 'Capacidad',
                            align: 'center',
                            render: (item) => {
                                if (item.tipo === 'CANASTILLA' && item.capacidad) {
                                    return (
                                        <span className="inline-flex items-center text-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                            {item.capacidad}
                                        </span>
                                    );
                                }
                                return <span className="text-xs text-slate-500 text-center">1</span>;
                            }
                        },
                        {
                            key: 'prestable',
                            label: 'Prestable',
                            render: (item) => (
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                        {item.prestable?.nombre}
                                    </p>
                                    {/* <p className="text-xs text-slate-500 dark:text-slate-400">
                                        ID: {item.prestable?.id} | Código: {item.prestable?.codigo}
                                        {item.tipo === 'CANASTILLA' && item.capacidad && (
                                            <span className="ml-2 inline-block rounded bg-blue-100 px-2 py-0.5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                Cap: {item.capacidad}
                                            </span>
                                        )}
                                    </p> */}
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
                                    className="w-24 rounded border border-slate-300 bg-white px-2 py-1 text-left text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                                />
                            ),
                        },
                        {
                            key: 'precio_unitario',
                            label: 'Precio Unitario',
                            align: 'left',
                            render: (item) => (
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.precio_unitario}
                                    onChange={(e) =>
                                        actualizarDetalle(item.id, 'precio_unitario', e.target.value)
                                    }
                                    className="w-32 rounded border border-slate-300 bg-white px-2 py-1 text-left text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                                />
                            ),
                        },
                        {
                            key: 'subtotal',
                            label: 'Subtotal',
                            align: 'center',
                            render: (item) => (
                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                    {(parseFloat(item.subtotal ?? 0)).toFixed(2)}
                                </span>
                            ),
                        },
                    ]}
                    getRowClassName={getRowClassName}
                    getRowIndicator={getRowIndicator}
                    onDeleteItem={eliminarDetalle}
                    getItemId={(item) => item.id}
                    renderSearchItem={(prestable) => (
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                    {prestable.nombre}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Código: {prestable.codigo}
                                </p>
                            </div>
                            {prestable.tipo && (
                                <>
                                    {prestable.tipo === 'CANASTILLA' ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 whitespace-nowrap">
                                            📦 Canastilla
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 whitespace-nowrap">
                                            🏪 Embase
                                        </span>
                                    )}
                                </>
                            )}
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
                            onClick={confirmarVenta}
                            disabled={loading}
                            className="bg-green-600 px-8 hover:bg-green-700 text-white"
                        >
                            {loading ? (
                                <>Confirmando...</>
                            ) : (
                                <span className="flex items-center gap-2 text-white">
                                    <CheckCircle size={18} />
                                    Confirmar Venta
                                </span>
                            )}
                        </Button>
                    </div>
                )}

                {/* Modal de selección de formato de impresión */}
                {ventaCreada && (
                    <OutputSelectionModal
                        isOpen={showOutputModal}
                        onClose={() => {
                            setShowOutputModal(false);
                            // Redirigir al listado después de cerrar el modal
                            setTimeout(() => {
                                window.location.href = '/prestamos/ventas';
                            }, 500);
                        }}
                        documentoId={ventaCreada.id}
                        tipoDocumento="prestamos-vendidos"
                        documentoInfo={{
                            numero: ventaCreada.numero_venta || ventaCreada.id,
                            cliente: ventaCreada.cliente?.nombre || 'Sin cliente',
                            cantidad_total: ventaCreada.cantidad_total,
                            total: ventaCreada.total,
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}
