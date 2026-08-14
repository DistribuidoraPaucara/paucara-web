import type { Prestable } from '@/domain/entities/prestamos';
import prestamoProveedorService from '@/infrastructure/services/prestamo-proveedor.service';
import AppLayout from '@/layouts/app-layout';
import DynamicSearchSelect from '@/presentation/components/form-sections/DynamicSearchSelect';
import PrestablesSelectionTable from '@/presentation/components/form-sections/PrestablesSelectionTable';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import ToastContainer from '@/presentation/components/ui/toast-container';
import { useToast } from '@/presentation/hooks/useToast';
import { usePrestables } from '@/stores/usePrestables';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Props {
    proveedores: Array<{ id: number; nombre: string; razon_social?: string }>;
    compras: Array<{ id: number; numero: string; proveedor_id: number; proveedor?: { id: number; nombre: string; razon_social?: string } }>;
    almacenes_prestables: Array<{ id: number; nombre: string; es_proveedor?: boolean }>; // ✅ NUEVO: Todos los almacenes
    almacenes_proveedor: Array<{ id: number; nombre: string; es_proveedor?: boolean }>;
    almacen_seleccionado_id?: number; // ✅ NUEVO: ID del almacén pre-seleccionado
    choferes?: Array<{ id: number; nombre: string }>;
    vehiculos?: Array<{ id: number; placa: string; marca?: string; modelo?: string }>;
}

interface PrestamoItem {
    prestable_id: number;
    cantidad: number;
    prestable?: Prestable;
    isAutomaticEmbase?: boolean; // ✅ NUEVO: marca si fue cargado automáticamente con una canastilla
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Préstamos', href: '/prestamos/proveedores' },
    { title: 'Crear Préstamo a Proveedor', href: '/prestamos/proveedores/crear' },
];

export default function CrearPrestamoProveedor({ proveedores, compras, almacenes_prestables, almacenes_proveedor, almacen_seleccionado_id, choferes, vehiculos }: Props) {
    const { prestables, loading: loadingPrestables, fetchPrestables } = usePrestables();
    const { toasts, removeToast, error: toastError, warning: toastWarning, success: toastSuccess } = useToast();

    // Estado principal del préstamo
    const [formData, setFormData] = useState({
        proveedor_id: undefined as number | undefined,
        almacenes_prestables_id: undefined as number | undefined,
        chofer_id: undefined as number | undefined,
        vehiculo_asignado: '' as string,
        compra_id: undefined as number | undefined,
        tipo_prestamo: 'canastillas_embases' as 'canastillas' | 'embases' | 'canastillas_embases',
        es_compra: false,
        fecha_prestamo: new Date().toISOString().split('T')[0],
        fecha_esperada_devolucion: getDateAdd7Days(),
        monto_garantia: 0,
    });

    // Lista de prestables agregados
    const [prestablesAgregados, setPrestablesAgregados] = useState<PrestamoItem[]>([]);

    // Estados para búsquedas dinámicas
    const [comprasSearch, setComprasSearch] = useState('');
    const [comprasResults, setComprasResults] = useState<any[]>([]);
    const [comprasLoading, setComprasLoading] = useState(false);
    const [compraSeleccionada, setCompraSeleccionada] = useState<any>(null);

    const [proveedoresSearch, setProveedoresSearch] = useState('');
    const [proveedoresFiltered, setProveedoresFiltered] = useState(proveedores);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<any>(null);

    const [vehiculosSearch, setVehiculosSearch] = useState('');
    const [vehiculosFiltered, setVehiculosFiltered] = useState(vehiculos || []);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<any>(null);

    const [choferesSearch, setChoferesSearch] = useState('');
    const [choferesFiltered, setChoferesFiltered] = useState(choferes || []);
    const [choferSeleccionado, setChoferSeleccionado] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mostrarModalImpresion, setMostrarModalImpresion] = useState(false);
    const [ultimoPrestamoId, setUltimoPrestamoId] = useState<number | null>(null);

    // 📡 Log de datos que llegan del backend (props)
    useEffect(() => {
        console.log('%c📡 DATOS DEL BACKEND - Props', 'color: #0066cc; font-weight: bold; font-size: 14px');
        console.log('%c👥 Proveedores:', 'color: #ff6b6b; font-weight: bold');
        console.table(proveedores);
        console.log('%c🏢 Almacenes (Todos):', 'color: #4ecdc4; font-weight: bold');
        console.table(almacenes_prestables);
        console.log('%c✅ Almacén Pre-seleccionado:', 'color: #00b894; font-weight: bold');
        console.log('ID:', almacen_seleccionado_id);
        console.log('%c🚗 Choferes:', 'color: #ffa502; font-weight: bold');
        console.table(choferes);
        console.log('%c🚙 Vehículos:', 'color: #a29bfe; font-weight: bold');
        console.table(vehiculos);
    }, []);

    useEffect(() => {
        fetchPrestables();
    }, []);

    // 📦 Log de prestables cargados desde la store
    useEffect(() => {
        if (prestables && prestables.length > 0) {
            console.log('%c📦 PRESTABLES CARGADOS', 'color: #27ae60; font-weight: bold; font-size: 14px');
            console.log(`Total: ${prestables.length} prestables`);
            console.table(prestables.slice(0, 5)); // Mostrar los primeros 5
            if (prestables.length > 5) {
                console.log(`... y ${prestables.length - 5} más`);
            }
        }
    }, [prestables]);

    // ✅ NUEVO: Seleccionar automáticamente el almacén 'Distribuidora'
    useEffect(() => {
        if (almacenes_prestables && almacenes_prestables.length > 0) {
            // Buscar "Distribuidora" por nombre exacto
            const distribuidora = almacenes_prestables.find((a: any) => a.nombre === 'Distribuidora');

            if (distribuidora) {
                setFormData((prev) => ({
                    ...prev,
                    almacenes_prestables_id: distribuidora.id,
                }));
                console.log('%c✅ Almacén "Distribuidora" preseleccionado automáticamente', 'color: #00b894; font-weight: bold', {
                    almacen_id: distribuidora.id,
                    almacen_nombre: distribuidora.nombre,
                });
            } else if (almacen_seleccionado_id) {
                // Fallback si viene almacen_seleccionado_id
                setFormData((prev) => ({
                    ...prev,
                    almacenes_prestables_id: almacen_seleccionado_id,
                }));
                const almacen = almacenes_prestables.find((a: any) => a.id === almacen_seleccionado_id);
                console.log('%c✅ Almacén pre-seleccionado', 'color: #00b894; font-weight: bold', {
                    almacen_id: almacen_seleccionado_id,
                    almacen_nombre: almacen?.nombre,
                });
            } else {
                // Último fallback: Buscar primer almacén con es_proveedor=true
                const almacenProveedor = almacenes_prestables.find((a: any) => a.es_proveedor === true);
                if (almacenProveedor) {
                    setFormData((prev) => ({
                        ...prev,
                        almacenes_prestables_id: almacenProveedor.id,
                    }));
                    console.log('%c✅ Almacén de proveedor seleccionado por defecto', 'color: #00b894; font-weight: bold', {
                        almacen_id: almacenProveedor.id,
                        almacen_nombre: almacenProveedor.nombre,
                    });
                }
            }
        }
    }, [almacenes_prestables, almacen_seleccionado_id]);

    // ✅ NUEVO: Leer query params y cargar compra automáticamente
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const compraId = params.get('compra_id');
        const proveedorId = params.get('proveedor_id');
        const prestablesParam = params.get('prestables');

        if (compraId) {
            (async () => {
                try {
                    console.log('✅ Detectado compra_id en URL, cargando detalles desde compra...');

                    // Fetch de la compra completa
                    const response = await fetch(`/api/compras/${compraId}`, {
                        headers: { Accept: 'application/json' },
                    });
                    const data = await response.json();
                    const compraData = data.data || data;

                    // Crear objeto compra compatible con handleSelectCompra
                    const compra = {
                        id: compraData.id,
                        numero: compraData.numero,
                    };

                    // Usar la función existente handleSelectCompra para cargar todo correctamente
                    await handleSelectCompra(compra);

                    toastSuccess('✅ Compra cargada desde URL automáticamente');
                } catch (error) {
                    console.error('⚠️ Error al cargar compra desde URL:', error);
                }
            })();
        } else if (proveedorId) {
            // Si viene solo proveedor_id pero no compra_id, pre-seleccionar el proveedor
            const proveedor = proveedores.find((p) => p.id === Number(proveedorId));
            if (proveedor) {
                setFormData((prev) => ({
                    ...prev,
                    proveedor_id: proveedor.id,
                }));
                setProveedorSeleccionado(proveedor);
                console.log('✅ Proveedor pre-seleccionado desde URL:', proveedor.nombre);
            }
        }

        // Si vienen prestables en params (respaldo), cargarlos también
        if (prestablesParam) {
            try {
                const prestablesData = JSON.parse(prestablesParam);
                console.log('✅ Prestables pre-cargados desde URL:', prestablesData);

                // Mapear prestables del parámetro a PrestamoItem[]
                const prestablesItems = prestablesData.map((p: any) => ({
                    prestable_id: p.prestable_id,
                    cantidad: p.cantidad,
                }));

                setPrestablesAgregados(prestablesItems);
            } catch (error) {
                console.error('⚠️ Error al parsear prestables desde URL:', error);
            }
        }
    }, []); // Solo ejecutar una vez al montar

    function getDateAdd7Days() {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    }

    const handleFechaPrestamo = (fecha: string) => {
        const date = new Date(fecha);
        date.setDate(date.getDate() + 7);
        const nuevaFecha = date.toISOString().split('T')[0];

        setFormData({
            ...formData,
            fecha_prestamo: fecha,
            fecha_esperada_devolucion: nuevaFecha,
        });
    };

    // Búsqueda de compras
    const handleSearchCompras = async (query: string) => {
        setComprasSearch(query);
        if (query.trim().length === 0) {
            setComprasResults([]);
            return;
        }

        setComprasLoading(true);
        try {
            const response = await fetch(`/api/compras/con-prestables/search?q=${encodeURIComponent(query)}`, {
                headers: { Accept: 'application/json' },
            });
            const data = await response.json();
            const compras = data.data || [];
            setComprasResults(compras);

            console.log('%c🔍 BÚSQUEDA DE COMPRAS', 'color: #e74c3c; font-weight: bold; font-size: 12px');
            console.log(`Query: ${query} | Resultados: ${compras.length}`);
            console.table(compras);
        } catch (error) {
            console.error('Error buscando compras:', error);
            setComprasResults([]);
        } finally {
            setComprasLoading(false);
        }
    };

    const handleSelectCompra = async (compra: any) => {
        console.log('%c📋 COMPRA SELECCIONADA', 'color: #9b59b6; font-weight: bold; font-size: 12px');
        console.table(compra);

        setCompraSeleccionada(compra);
        setComprasSearch('');
        setComprasResults([]);

        try {
            const response = await fetch(`/api/compras/${compra.id}/detalles`, {
                headers: { Accept: 'application/json' },
            });
            const data = await response.json();
            const compraData = data.data || data;
            const proveedorId = compraData.proveedor_id;

            console.log('%c📦 DETALLES DE COMPRA RECIBIDOS', 'color: #16a085; font-weight: bold; font-size: 12px');
            console.table(compraData);

            setFormData({
                ...formData,
                compra_id: compra.id,
                proveedor_id: proveedorId,
            });
            setProveedorSeleccionado(proveedores.find((p) => p.id === proveedorId));

            // ✅ NUEVO: Cargar prestables automáticamente desde los detalles de la compra
            const nuevosPrestables: PrestamoItem[] = [];
            const detalles = compraData.detalles || [];

            console.log('%c📦 Cargando prestables desde compra', 'color: #0066cc; font-weight: bold', {
                compra_id: compra.id,
                detalles_count: detalles.length,
            });

            detalles.forEach((detalle: any) => {
                const producto = detalle.producto || {};
                const cantidad = detalle.cantidad || 0;

                console.log('%c🔍 Procesando producto', 'color: #ff9800', {
                    producto_id: producto.id,
                    producto_nombre: producto.nombre,
                    cantidad,
                    prestables: producto.prestables?.length || 0,
                });

                if (!producto.prestables || producto.prestables.length === 0) {
                    return; // Saltar si el producto no tiene prestables
                }

                // 1️⃣ Buscar CANASTILLA en el array de prestables del producto
                const prestableCanastilla = producto.prestables.find((p: any) => {
                    return p.tipo === 'CANASTILLA';
                });

                if (prestableCanastilla) {
                    const canastillaId = Number(prestableCanastilla.id || prestableCanastilla.prestable_id);
                    const capacidadCanastilla = prestableCanastilla.capacidad || 0;

                    console.log('%c✅ CANASTILLA encontrada', 'color: #00b894', {
                        canastilla_id: canastillaId,
                        canastilla_nombre: prestableCanastilla.nombre,
                        cantidad_canastillas: cantidad,
                        capacidad: capacidadCanastilla,
                    });

                    // Agregar CANASTILLA
                    nuevosPrestables.push({
                        prestable_id: canastillaId,
                        cantidad: cantidad,
                        prestable: prestableCanastilla,
                    });

                    // ✅ Buscar EMBASES relacionados
                    const embasesEnProducto = producto.prestables.filter((p: any) => p.tipo === 'EMBASES');

                    embasesEnProducto.forEach((embase: any) => {
                        const embaseId = Number(embase.id || embase.prestable_id);
                        const cantidadEmbases = cantidad * capacidadCanastilla;

                        console.log('%c✅ EMBASE encontrado', 'color: #9c27b0', {
                            embase_id: embaseId,
                            embase_nombre: embase.nombre,
                            cantidad_embases_calculada: cantidadEmbases,
                        });

                        nuevosPrestables.push({
                            prestable_id: embaseId,
                            cantidad: cantidadEmbases,
                            prestable: embase,
                            isAutomaticEmbase: true,
                        });
                    });
                }
            });

            console.log('%c📋 Prestables cargados automáticamente', 'color: #4caf50; font-weight: bold', {
                cantidad_prestables: nuevosPrestables.length,
                prestables: nuevosPrestables.map((p) => ({ id: p.prestable_id, nombre: p.prestable?.nombre })),
            });

            // Reemplazar con los prestables cargados automáticamente
            setPrestablesAgregados(nuevosPrestables);

            if (nuevosPrestables.length > 0) {
                toastWarning('⚠️ Se cargaron ' + nuevosPrestables.length + ' prestables automáticamente. Especifica los almacenes.');
            }
        } catch (error) {
            console.error('Error cargando compra:', error);
            toastError('Error al cargar los detalles de la compra');
        }
    };

    const handleSearchProveedores = (query: string) => {
        setProveedoresSearch(query);
        if (!query.trim()) {
            setProveedoresFiltered(proveedores);
            return;
        }
        const filtered = proveedores.filter(
            (p) => p.nombre.toLowerCase().includes(query.toLowerCase()) || p.razon_social?.toLowerCase().includes(query.toLowerCase()),
        );
        setProveedoresFiltered(filtered);
    };

    const handleSelectProveedor = (proveedor: any) => {
        setProveedorSeleccionado(proveedor);
        setProveedoresSearch('');
        setFormData({ ...formData, proveedor_id: proveedor.id });
    };

    const handleSearchVehiculos = (query: string) => {
        setVehiculosSearch(query);
        if (!query.trim()) {
            setVehiculosFiltered(vehiculos || []);
            return;
        }
        const filtered = (vehiculos || []).filter(
            (v) =>
                v.placa.toLowerCase().includes(query.toLowerCase()) ||
                v.marca?.toLowerCase().includes(query.toLowerCase()) ||
                v.modelo?.toLowerCase().includes(query.toLowerCase()),
        );
        setVehiculosFiltered(filtered);
    };

    const handleSelectVehiculo = (vehiculo: any) => {
        setVehiculoSeleccionado(vehiculo);
        setVehiculosSearch('');
        setFormData({ ...formData, vehiculo_asignado: vehiculo.placa });
    };

    // Búsqueda de choferes
    const handleSearchChoferes = (query: string) => {
        setChoferesSearch(query);
        if (!query.trim()) {
            setChoferesFiltered(choferes || []);
            return;
        }
        const filtered = (choferes || []).filter((c) => c.nombre.toLowerCase().includes(query.toLowerCase()));
        setChoferesFiltered(filtered);
    };

    const handleSelectChofer = (chofer: any) => {
        setChoferSeleccionado(chofer);
        setChoferesSearch('');
        setFormData({ ...formData, chofer_id: chofer.id });
    };

    const handleEliminarPrestable = (prestable_id: number) => {
        // Si es una canastilla, eliminar también sus embases relacionados
        const prestable = prestables.find((p) => Number(p.id) === prestable_id);
        if (prestable?.tipo === 'CANASTILLA') {
            const embasesRelacionados = prestables.filter((p) => p.tipo === 'EMBASES' && (p as any).prestable_relacionado_id === prestable_id);
            const idsAEliminar = [prestable_id, ...embasesRelacionados.map((e) => e.id)];
            setPrestablesAgregados(prestablesAgregados.filter((p) => !idsAEliminar.includes(p.prestable_id)));
        } else {
            setPrestablesAgregados(prestablesAgregados.filter((p) => p.prestable_id !== prestable_id));
        }
    };

    const getStockDisponibleTotal = (prestable: Prestable) => {
        return (prestable.stocks || []).reduce((sum, stock) => sum + Number(stock.cantidad_disponible || 0), 0);
    };

    const handleCambiarCantidad = (itemIndex: number, nueva_cantidad: number) => {
        const itemActualizado = prestablesAgregados[itemIndex];
        if (!itemActualizado) return;

        const prestable = prestables.find((p) => Number(p.id) === itemActualizado.prestable_id);

        setPrestablesAgregados(
            prestablesAgregados.map((item, idx) => {
                // Actualizar solo el item específico por índice
                if (idx === itemIndex) {
                    return { ...item, cantidad: nueva_cantidad };
                }

                // Si el item actualizado es canastilla, actualizar SOLO embases automáticos relacionados
                if (
                    prestable?.tipo === 'CANASTILLA' &&
                    item.isAutomaticEmbase === true && // ✅ SOLO embases automáticos
                    (item.prestable as any)?.prestable_relacionado_id === prestable?.id
                ) {
                    const cantidadEmbasesAutomatica = nueva_cantidad * (prestable.capacidad || 0);
                    return { ...item, cantidad: cantidadEmbasesAutomatica };
                }

                return item;
            }),
        );
    };

    const handleAgregarCanastilla = (prestable: Prestable) => {
        // ✅ MODIFICADO: NO cargar con almacén de cabecera
        // Los prestables se cargan VACÍOS en almacenes
        // El almacén de cabecera es solo referencia si el usuario no abre el modal

        const nuevosItems: PrestamoItem[] = [
            {
                prestable_id: Number(prestable.id),
                cantidad: 1,
                prestable,
            },
        ];

        if (prestable.tipo === 'CANASTILLA') {
            const embasesRelacionados = prestables.filter(
                (p) => p.tipo === 'EMBASES' && (p as any).prestable_relacionado_id === Number(prestable.id) && getStockDisponibleTotal(p) > 0,
            );

            embasesRelacionados.forEach((embase) => {
                const cantidadEmbasesAutomatica = 1 * (prestable.capacidad || 0);

                nuevosItems.push({
                    prestable_id: Number(embase.id),
                    cantidad: cantidadEmbasesAutomatica,
                    prestable: embase,
                    isAutomaticEmbase: true, // Marca que fue cargado automáticamente con la canastilla
                });
            });
        }

        const actualizado = [...prestablesAgregados, ...nuevosItems];
        console.log('🔵 handleAgregarCanastilla - Prestable:', prestable.nombre, prestable.tipo);
        console.log(
            '   Items nuevos:',
            nuevosItems.map((i) => ({
                id: i.prestable_id,
                nombre: i.prestable?.nombre,
                tipo: i.prestable?.tipo,
                isAutomaticEmbase: i.isAutomaticEmbase,
            })),
        );
        toastWarning('⚠️ Especifica los almacenes para este prestable en el modal');
        setPrestablesAgregados(actualizado);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.compra_id) {
            setError('Selecciona una compra (requerida para los préstamos a proveedor)');
            return;
        }

        if (!formData.proveedor_id) {
            setError('Selecciona un proveedor (se cargará automáticamente)');
            return;
        }

        if (!formData.almacenes_prestables_id) {
            setError('Selecciona el almacén destino donde se recepcionará el préstamo');
            return;
        }

        if (prestablesAgregados.length === 0) {
            setError('Agrega al menos un prestable');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                proveedor_id: formData.proveedor_id,
                almacenes_prestables_id: formData.almacenes_prestables_id,
                chofer_id: formData.chofer_id || null,
                vehiculo_asignado: formData.vehiculo_asignado || null,
                es_compra: formData.es_compra,
                compra_id: formData.compra_id,
                fecha_prestamo: formData.fecha_prestamo,
                fecha_esperada_devolucion: formData.fecha_esperada_devolucion,
                monto_garantia: formData.monto_garantia,
                observaciones: '',
                detalles: prestablesAgregados.map((item) => ({
                    prestable_id: item.prestable_id,
                    cantidad: item.cantidad,
                })),
            };

            const response = await prestamoProveedorService.crear(payload);

            if (response?.id) {
                toastSuccess('✅ Préstamo a proveedor creado exitosamente');
                setUltimoPrestamoId(Number(response.id));
                setMostrarModalImpresion(true);
            } else {
                window.location.href = '/prestamos/proveedores';
            }
        } catch (err: any) {
            let mensajeError = 'Ocurrió un error al crear el préstamo';

            if (err.response?.data?.message) {
                mensajeError = err.response.data.message;
            } else if (err.response?.data?.error) {
                mensajeError = err.response.data.error;
            } else if (err.response?.data?.errors) {
                const errores = Object.values(err.response.data.errors).flat();
                mensajeError = errores.join(' | ');
            } else if (err.message) {
                mensajeError = err.message;
            }

            setError(mensajeError);
            toastError(mensajeError);
        } finally {
            setLoading(false);
        }
    };

    const totalGarantia = prestablesAgregados.reduce((sum, item) => {
        const garantia = item.prestable?.condiciones?.[0]?.monto_garantia || 0;
        return sum + Number(garantia) * item.cantidad;
    }, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Préstamo a Proveedor" />
            <ToastContainer toasts={toasts} onClose={removeToast} />
            <div className="min-h-screen bg-white p-2 dark:bg-gray-950">
                {/* <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">🏭 Nuevo Préstamo a Proveedor</h1> */}

                <form onSubmit={handleSubmit} className="space-y-2">
                    {error && (
                        <div className="rounded-lg border border-red-300 bg-red-100 p-4 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Sección 1: Información del Préstamo */}
                    <Card className="border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
                            {/* Columna 3: Almacén Destino */}
                            <div>
                                <label className="block text-xs font-small text-gray-700 dark:text-gray-300">🏭 Almacén Destino *</label>
                                <select
                                    required
                                    value={formData.almacenes_prestables_id || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            almacenes_prestables_id: e.target.value ? Number(e.target.value) : undefined,
                                        })
                                    }
                                    className="w-full text-xs rounded-lg border border-gray-300 bg-white px-2 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="">Selecciona almacén...</option>
                                    {almacenes_prestables &&
                                        almacenes_prestables.map((almacen) => (
                                            <option key={almacen.id} value={almacen.id}>
                                                {almacen.nombre}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            {/* Columna 1: Compra (REQUERIDA) */}
                            <DynamicSearchSelect
                                label="📦 Compra *"
                                placeholder="Buscar compra..."
                                selectedItem={compraSeleccionada}
                                items={comprasResults}
                                isLoading={comprasLoading}
                                searchValue={comprasSearch}
                                onSearch={handleSearchCompras}
                                onSelect={handleSelectCompra}
                                onClear={() => {
                                    setCompraSeleccionada(null);
                                    setComprasSearch('');
                                    setFormData({ ...formData, compra_id: undefined, proveedor_id: undefined });
                                }}
                                renderItem={(compra) => (
                                    <div>
                                        <p className="font-small">Folio #{compra.id}</p>
                                        <p className="text-xs text-gray-500">{compra.proveedor?.nombre}</p>
                                    </div>
                                )}
                                getItemId={(compra) => compra.id}
                                getDisplayValue={(compra) => `Folio #${compra.id}`}
                            />

                            {/* Columna 2: Proveedor (AUTO-CARGADO) */}
                            <DynamicSearchSelect
                                label="🏭 Proveedor *"
                                placeholder="Se cargará automáticamente..."
                                selectedItem={proveedorSeleccionado}
                                items={proveedoresFiltered}
                                isLoading={false}
                                searchValue={proveedoresSearch}
                                onSearch={handleSearchProveedores}
                                onSelect={handleSelectProveedor}
                                onClear={() => {
                                    setProveedorSeleccionado(null);
                                    setProveedoresSearch('');
                                }}
                                renderItem={(proveedor) => (
                                    <div>
                                        <p className="font-small">{proveedor.nombre}</p>
                                        <p className="text-xs text-gray-500">{proveedor.razon_social}</p>
                                    </div>
                                )}
                                getItemId={(proveedor) => proveedor.id}
                                getDisplayValue={(proveedor) => proveedor.nombre}
                            />
                            {/* Chofer (Opcional) */}
                            <DynamicSearchSelect
                                label="🚗 Chofer (Opcional)"
                                placeholder="Buscar chofer..."
                                selectedItem={choferSeleccionado}
                                items={choferesFiltered}
                                isLoading={false}
                                searchValue={choferesSearch}
                                onSearch={handleSearchChoferes}
                                onSelect={handleSelectChofer}
                                onClear={() => {
                                    setChoferSeleccionado(null);
                                    setChoferesSearch('');
                                    setFormData({ ...formData, chofer_id: undefined });
                                }}
                                renderItem={(chofer) => (
                                    <div>
                                        <p className="font-medium">{chofer.nombre}</p>
                                    </div>
                                )}
                                getItemId={(chofer) => chofer.id}
                                getDisplayValue={(chofer) => chofer.nombre}
                            />

                            {/* Vehículo Asignado (Opcional) */}
                            <DynamicSearchSelect
                                label="🚙 Vehículo Asignado (Opcional)"
                                placeholder="Buscar vehículo..."
                                selectedItem={vehiculoSeleccionado}
                                items={vehiculosFiltered}
                                isLoading={false}
                                searchValue={vehiculosSearch}
                                onSearch={handleSearchVehiculos}
                                onSelect={handleSelectVehiculo}
                                onClear={() => {
                                    setVehiculoSeleccionado(null);
                                    setVehiculosSearch('');
                                    setFormData({ ...formData, vehiculo_asignado: '' });
                                }}
                                renderItem={(vehiculo) => (
                                    <div>
                                        <p className="font-medium">{vehiculo.placa}</p>
                                        <p className="text-xs text-gray-500">
                                            {vehiculo.marca} {vehiculo.modelo}
                                        </p>
                                    </div>
                                )}
                                getItemId={(vehiculo) => vehiculo.id}
                                getDisplayValue={(vehiculo) => `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`}
                            />
                        </div>

                        {/* Fila: Fechas */}
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            {/* Fila: Garantía */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Garantía Total (Opcional)</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={formData.monto_garantia}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                            setFormData({
                                                ...formData,
                                                monto_garantia: val === '' ? 0 : parseFloat(val),
                                            });
                                        }
                                    }}
                                    onFocus={(e) => e.target.select()}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Fecha de Préstamo *</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.fecha_prestamo}
                                    onChange={(e) => handleFechaPrestamo(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Fecha Esperada de Devolución (7 días) *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.fecha_esperada_devolucion}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            fecha_esperada_devolucion: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Sección 2: Seleccionar Prestables */}
                    <Card className="border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
                        {/* <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            📦 Seleccionar Prestables
                        </h2> */}

                        {/* Usar componente PrestablesSelectionTable */}
                        <PrestablesSelectionTable
                            label="📦 Detalles"
                            placeholder="Buscar prestable..."
                            prestables={prestables.filter((p) => p.activo)}
                            items={prestablesAgregados}
                            onSelectItem={handleAgregarCanastilla}
                            onDeleteItem={handleEliminarPrestable}
                            onUpdateCantidad={handleCambiarCantidad}
                            onToggleAlmacen={() => {}}
                            hideAlmacenesSelection={true}
                            almacen_prestable_id={formData.almacenes_prestables_id}
                            esPrestamoProveedor={true}
                            getStockDisponibleTotal={(prestable) =>
                                (prestable.stocks || []).reduce((sum, stock) => sum + Number(stock.cantidad_disponible || 0), 0)
                            }
                            getAlmacenesConStock={(prestable) => {
                                const almacenes = (prestable.stocks || [])
                                    .filter((stock: any) => Number(stock.cantidad_disponible || 0) > 0)
                                    .map((stock: any) => ({
                                        id: Number(stock.almacenes_prestables_id || stock.almacen_id),
                                        nombre: stock?.almacen_prestable?.nombre || `Almacén ${stock.almacenes_prestables_id}`,
                                        stock: Number(stock.cantidad_disponible || 0),
                                        es_proveedor: stock?.almacen_prestable?.es_proveedor ?? true,
                                    }))
                                    .filter((item: any) => Number(item.id) > 0);
                                return almacenes;
                            }}
                            getStockDisponibleEnAlmacenes={(prestable, almacenesIds) => {
                                const ids = new Set((almacenesIds || []).map(Number));
                                return (prestable.stocks || []).reduce((sum, stock: any) => {
                                    const almacenId = Number(stock.almacenes_prestables_id || stock.almacen_id);
                                    if (!ids.has(almacenId)) return sum;
                                    return sum + Number(stock.cantidad_disponible || 0);
                                }, 0);
                            }}
                        />
                    </Card>

                    {/* Botones de Acción */}
                    <Card className="border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex justify-end gap-2">
                            <a href="/prestamos/proveedores">
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </a>
                            <Button
                                type="submit"
                                disabled={loading || prestablesAgregados.length === 0}
                                className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Registrando...' : '✅ Registrar Préstamo'}
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>

            {/* Modal de Impresión */}
            <OutputSelectionModal
                isOpen={mostrarModalImpresion && ultimoPrestamoId !== null}
                onClose={() => {
                    setMostrarModalImpresion(false);
                    setUltimoPrestamoId(null);
                    setTimeout(() => {
                        window.location.href = '/prestamos/proveedores';
                    }, 300);
                }}
                documentoId={ultimoPrestamoId || 0}
                tipoDocumento="prestamo-proveedor"
            />
        </AppLayout>
    );
}
