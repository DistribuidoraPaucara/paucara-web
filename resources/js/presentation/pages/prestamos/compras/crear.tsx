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
    precio_compra_referencial?: number;
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

    // Auto-seleccionar almacén con es_proveedor=true
    useEffect(() => {
        if (almacenes.length > 0 && !almacenSeleccionado) {
            const almacenProveedor = almacenes.find((a) => a.es_proveedor);
            if (almacenProveedor) {
                setAlmacenSeleccionado(almacenProveedor);
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
            console.log('🔍 Buscando compras con query:', query);
            // ✅ MEJORADO: Usar endpoint específico para compras con prestables
            const response = await fetch(`/api/compras/con-prestables/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            console.log('📦 Respuesta de búsqueda:', data);
            // El endpoint devuelve { data: [...] } sin atributo success
            const comprasData = Array.isArray(data.data) ? data.data : (data.data || []);
            console.log('✅ Compras encontradas:', comprasData.length);
            setCompras(comprasData);
        } catch (error) {
            console.error('❌ Error buscando compras:', error);
            setCompras([]);
        } finally {
            setBuscandoCompras(false);
        }
    }, []);

    // ✅ Cargar detalles de compra existente (adaptado de handleSelectVenta)
    const handleSelectCompra = async (compra: any) => {
        console.log('🔗 SELECCIONANDO COMPRA:', { id: compra.id, numero: compra.numero });
        setCompraSeleccionada(compra);
        setBusquedaCompra('');
        setCompras([]);

        try {
            // ✅ MEJORADO: Usar el mismo endpoint de búsqueda con ID para obtener datos completos con prestables
            console.log(`📡 Fetching: /api/compras/con-prestables/search?q=${compra.id}`);
            const response = await fetch(`/api/compras/con-prestables/search?q=${compra.id}`, {
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                console.error('❌ Error HTTP:', response.status, response.statusText);
            }

            const data = await response.json();
            console.log('📋 Respuesta completa:', data);

            // ✅ Manejar ambos casos: array (búsqueda general) y objeto (búsqueda por ID)
            let compraData;
            if (Array.isArray(data.data)) {
                // Si es array (búsqueda general), tomar el primer elemento
                compraData = data.data[0];
                console.log('📋 Modo: Búsqueda general (array) - tomando primer elemento');
            } else {
                // Si es objeto (búsqueda por ID)
                compraData = data.data;
                console.log('📋 Modo: Búsqueda por ID (objeto)');
            }

            console.log('📋 Datos de compra extraídos:', compraData);

            console.log('📋 DETALLE DE COMPRA SELECCIONADA:', {
                respuesta_completa: data,
                compra_data: compraData,
                detalles: compraData?.detalles,
                detalles_count: compraData?.detalles?.length,
            });

            // ✅ Cargar prestables desde detalles de la compra
            const nuevosPrestables: DetalleLocal[] = [];
            if (compraData.detalles && Array.isArray(compraData.detalles)) {
                console.log('📦 PROCESANDO DETALLES DE COMPRA', {
                    total_detalles: compraData.detalles.length,
                });

                compraData.detalles.forEach((detalle: any, index: number) => {
                    const cantidad = detalle.cantidad || 0;
                    const almacenId = detalle.almacenes_prestables_id || almacenSeleccionado?.id;
                    // ✅ CORREGIDO: Los prestables están en detalle.producto.prestables, no en detalle.prestables
                    const prestables = detalle.producto?.prestables || [];

                    console.log(`📋 DETALLE ${index + 1}/${compraData.detalles.length}`, {
                        cantidad,
                        almacen_id: almacenId,
                        prestables_count: prestables.length,
                        prestables: prestables.map((p: any) => ({
                            id: p.id,
                            nombre: p.nombre,
                            tipo: p.tipo,
                        })),
                    });

                    // ✅ Validar que haya prestables y cantidad > 0
                    if (prestables.length > 0 && cantidad > 0 && almacenId) {
                        // ✅ SOLO procesar CANASTILLAS - los EMBASES se agregarán como relacionados
                        const canastillas = prestables.filter((p: any) => p.tipo === 'CANASTILLA');
                        const embases = prestables.filter((p: any) => p.tipo === 'EMBASES');

                        canastillas.forEach((prestable: any) => {
                            // ✅ Usar precio_compra de la relación prestables_precios
                            const precioCompra = prestable.precios?.[0]?.precio_compra || prestable.precio_compra_referencial || 0;

                            console.log(`📦 Procesando prestable: ${prestable.nombre} (tipo: ${prestable.tipo})`);
                            console.log(`💰 Precio desde precios (relación):`, prestable.precios?.[0]?.precio_compra, `| Precio referencial:`, prestable.precio_compra_referencial, `| Precio final: ${precioCompra}`);

                            // Agregar CANASTILLA
                            nuevosPrestables.push({
                                id: `${Date.now()}-${Math.random()}`,
                                prestable_id: prestable.id,
                                almacen_id: almacenId,
                                cantidad: cantidad,
                                precio_unitario: precioCompra,
                                subtotal: cantidad * precioCompra,
                                tipo: prestable.tipo,
                                capacidad: prestable.capacidad,
                                prestable: {
                                    id: prestable.id,
                                    nombre: prestable.nombre,
                                    codigo: prestable.codigo,
                                    tipo: prestable.tipo,
                                    capacidad: prestable.capacidad,
                                },
                                almacen: {
                                    id: almacenId,
                                    nombre: `Almacén ${almacenId}`,
                                },
                            });

                            console.log(`✅ Prestable agregado: ${prestable.nombre} (${cantidad})`);

                            // ✅ Agregar EMBASES como relacionados a la CANASTILLA
                            if (embases.length > 0) {
                                embases.forEach((embase: any) => {
                                    const cantidadEmbase = cantidad * (prestable.capacidad || 1);
                                    // ✅ Usar precio_compra del embase desde su propia relación prestables_precios
                                    const precioEmbase = embase.precios?.[0]?.precio_compra || embase.precio_compra_referencial || 0;

                                    nuevosPrestables.push({
                                        id: `${Date.now()}-${Math.random()}`,
                                        prestable_id: embase.id,
                                        almacen_id: almacenId,
                                        cantidad: cantidadEmbase,
                                        precio_unitario: precioEmbase,
                                        subtotal: cantidadEmbase * precioEmbase,
                                        tipo: embase.tipo,
                                        capacidad: embase.capacidad,
                                        precio_unitario_original: precioCompra,
                                        prestable_padre_id: prestable.id,
                                        prestable: {
                                            id: embase.id,
                                            nombre: embase.nombre,
                                            codigo: embase.codigo,
                                            tipo: embase.tipo,
                                            capacidad: embase.capacidad,
                                        },
                                        almacen: {
                                            id: almacenId,
                                            nombre: `Almacén ${almacenId}`,
                                        },
                                    });

                                    console.log(`✅ Embase agregado: ${embase.nombre} (${cantidadEmbase})`);
                                });
                            }
                        });
                    }
                });
            }

            // ✅ Agregar prestables cargados a la tabla
            if (nuevosPrestables.length > 0) {
                setDetalles((prev) => [...prev, ...nuevosPrestables]);
                console.log(`✅ Cargados ${nuevosPrestables.length} prestables desde la compra`);
            }

            // ✅ Auto-cargar proveedor si existe
            if (compraData.proveedor_id && compraData.proveedor) {
                setProveedorSeleccionado(compraData.proveedor);
                console.log('✅ Proveedor cargado automáticamente:', compraData.proveedor.nombre);
            }
        } catch (error) {
            console.error('Error obteniendo compra:', error);
            alert('Error al cargar datos de la compra');
        }
    };

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
        if (!almacenSeleccionado) {
            alert('Debe seleccionar un almacén primero');
            return;
        }

        console.log('✅ Prestable seleccionado:', prestable.nombre);
        console.log('📦 Stock disponible:', prestable.stocks);
        console.log('🔗 Embases relacionados:', prestable.embasesRelacionados);

        const nuevosDetalles: DetalleLocal[] = [];
        const precioCompraPrestable = getPrecioCompraPrestable(prestable);

        // Agregar el prestable seleccionado
        const nuevoDetalle: DetalleLocal = {
            id: Date.now().toString(),
            prestable_id: prestable.id,
            almacen_id: almacenSeleccionado.id,
            cantidad: 1,
            precio_unitario: precioCompraPrestable,
            subtotal: precioCompraPrestable,
            tipo: prestable.tipo,
            capacidad: prestable.capacidad,
            precio_compra_referencial: prestable.precio_compra_referencial,
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
                const precioUnitarioEmbase = precioCompraPrestable / (prestable.capacidad || 1);

                const detalleEmbase: DetalleLocal = {
                    id: (Date.now() + Math.random()).toString(),
                    prestable_id: embase.id,
                    almacen_id: almacenSeleccionado.id,
                    cantidad: cantidadEmbase,
                    precio_unitario: precioUnitarioEmbase,
                    subtotal: cantidadEmbase * precioUnitarioEmbase,
                    tipo: embase.tipo,
                    capacidad: embase.capacidad,
                    precio_compra_referencial: embase.precio_compra_referencial,
                    precio_unitario_original: precioCompraPrestable, // Guardar precio de canastilla como referencia
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
        <AppLayout breadcrumbs={[{ title: 'Préstamos', href: '/prestamos/prestables' }, { title: 'Nueva Compra de Prestables' }]}>
            <Head title="Crear Compra de Prestables" />

            <div className="flex h-full flex-1 flex-col gap-4 p-2">
                {/* Header */}
                {/* <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Nueva Compra de Prestables
                        </h1>
                    </div>
                </div> */}

                {/* Contenedor con 3 columnas responsivas */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                            handleSelectCompra(compra);
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
                        // codigo del prestable
                        {
                            key: 'codigo',
                            label: 'Código',
                            render: (item) => (
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {item.prestable?.codigo}
                                </span>
                            ),
                        },
                        // capacidad del prestable (solo si es canastilla)
                        {
                            key: 'capacidad',
                            label: 'Capacidad',
                            align: 'center',
                            render: (item) => (
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {item.capacidad ?? '1'}
                                </span>
                            ),
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
                            align: 'left',
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
                            onClick={confirmarCompra}
                            disabled={loading}
                            className="bg-green-600 px-8 hover:bg-green-700 text-white"
                        >
                            {loading ? (
                                <>Confirmando...</>
                            ) : (
                                <span className="flex items-center gap-2 text-white">
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
