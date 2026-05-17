import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import SearchSelect from '@/presentation/components/ui/search-select';
import AsyncSearchSelect from '@/presentation/components/ui/async-search-select';
import { toast } from 'react-toastify';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/presentation/components/ui/table';
import prestamoProveedorService from '@/infrastructure/services/prestamo-proveedor.service';
import { usePrestables } from '@/stores/usePrestables';
import type { Prestable } from '@/domain/entities/prestamos';
import type { SelectOption } from '@/presentation/components/ui/search-select';
import { Trash2, Loader2 } from 'lucide-react';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';

interface Props {
    proveedores: Array<{ id: number; nombre: string; razon_social?: string }>;
    compras: Array<{ id: number; numero: string; proveedor_id: number; proveedor?: { id: number; nombre: string; razon_social?: string } }>;
}

interface PrestamoItem {
    prestable_id: number;
    cantidad: number;
    prestable?: Prestable;
}

export default function CrearPrestamoProveedor({ proveedores, compras }: Props) {
    const { prestables, loading: loadingPrestables, fetchPrestables } = usePrestables();

    // Opciones para SearchSelect
    const proveedoresOptions: SelectOption[] = proveedores.map((p) => ({
        value: p.id,
        label: p.nombre,
        description: p.razon_social,
    }));

    const prestablesOptions: SelectOption[] = prestables.map((p) => ({
        value: p.id,
        label: p.nombre,
        description: p.codigo,
    }));

    // Estado principal de la compra
    const [formData, setFormData] = useState({
        proveedor_id: undefined as number | undefined,
        es_compra: true,
        compra_id: undefined as number | undefined,
        fecha_prestamo: new Date().toISOString().split('T')[0],
        fecha_esperada_devolucion: undefined,
        monto_garantia: 0,
    });

    // Lista de prestables agregados
    const [prestablesAgregados, setPrestablesAgregados] = useState<PrestamoItem[]>([]);

    // Filtros para prestables
    const [mostrarCanastillas, setMostrarCanastillas] = useState(true);
    const [mostrarEmbasesIndependientes, setMostrarEmbasesIndependientes] = useState(false);
    const [mostrarSoloEmbases, setMostrarSoloEmbases] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingCompra, setLoadingCompra] = useState(false);
    const [error, setError] = useState('');
    const [mostrarModalImpresion, setMostrarModalImpresion] = useState(false);
    const [ultimoPrestamoId, setUltimoPrestamoId] = useState<number | null>(null);

    useEffect(() => {
        fetchPrestables();
    }, []);


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

    const handleCompraSeleccionada = async (compraId: number | undefined) => {
        console.log('📦 handleCompraSeleccionada llamado con:', compraId, 'tipo:', typeof compraId);

        if (!compraId) {
            console.log('ℹ️ Sin compra seleccionada, limpiando...');
            setFormData(prev => ({ ...prev, compra_id: undefined, proveedor_id: undefined }));
            setLoadingCompra(false);
            return;
        }

        const numericId = Number(compraId);
        setLoadingCompra(true);

        try {
            console.log('🔄 Obteniendo datos de la compra ID:', numericId);
            const response = await fetch(`/api/compras/${numericId}/detalles`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.error('❌ Error HTTP obteniendo compra:', response.status);
                const text = await response.text();
                console.error('❌ Response body:', text.substring(0, 200));
                // Al menos guardar el ID de la compra aunque no obtengamos los datos
                setFormData(prev => ({ ...prev, compra_id: numericId }));
                setLoadingCompra(false);
                return;
            }

            const apiData = await response.json();
            const compraData = apiData.data || apiData;

            console.log('✅ Datos de la compra obtenidos:', {
                compra_id: numericId,
                proveedor_id: compraData.proveedor_id,
                proveedor_nombre: compraData.proveedor?.nombre,
            });

            // Actualizar el estado de forma correcta
            setFormData(prev => ({
                ...prev,
                compra_id: numericId,
                proveedor_id: compraData.proveedor_id || prev.proveedor_id,
            }));
        } catch (error) {
            console.error('❌ Error obteniendo compra:', error);
            // Guardar al menos el ID aunque falle la carga de datos
            setFormData(prev => ({ ...prev, compra_id: numericId }));
        } finally {
            setLoadingCompra(false);
        }
    };

    const handleEliminarPrestable = (prestable_id: number) => {
        // Si es una canastilla, eliminar también sus embases relacionados
        const prestable = prestables.find(p => Number(p.id) === prestable_id);
        if (prestable?.tipo === 'CANASTILLA') {
            const embasesRelacionados = prestables.filter(
                p => p.tipo === 'EMBASES' && (p as any).prestable_relacionado_id === prestable_id
            );
            const idsAEliminar = [prestable_id, ...embasesRelacionados.map(e => e.id)];
            setPrestablesAgregados(
                prestablesAgregados.filter((p) => !idsAEliminar.includes(p.prestable_id))
            );
        } else {
            setPrestablesAgregados(
                prestablesAgregados.filter((p) => p.prestable_id !== prestable_id)
            );
        }
    };

    const handleCambiarCantidad = (prestable_id: number, nueva_cantidad: number) => {
        const prestable = prestables.find(p => Number(p.id) === prestable_id);

        setPrestablesAgregados(prestablesAgregados.map(item => {
            if (item.prestable_id === prestable_id) {
                return { ...item, cantidad: nueva_cantidad };
            }

            // Si es una canastilla y cambió su cantidad, actualizar embases relacionados
            if (prestable?.tipo === 'CANASTILLA' && (item.prestable as any)?.prestable_relacionado_id === prestable_id) {
                const cantidadEmbasesAutomatica = nueva_cantidad * (prestable.capacidad || 0);
                return { ...item, cantidad: cantidadEmbasesAutomatica };
            }

            return item;
        }));
    };

    const handleAgregarCanastilla = (prestable: Prestable) => {
        const nuevosItems: PrestamoItem[] = [
            {
                prestable_id: Number(prestable.id),
                cantidad: 1,
                prestable,
            },
        ];

        // Si es canastilla, agregar automáticamente sus embases relacionados
        if (prestable.tipo === 'CANASTILLA') {
            const embasesRelacionados = prestables.filter(
                p => p.tipo === 'EMBASES' && (p as any).prestable_relacionado_id === Number(prestable.id)
            );

            embasesRelacionados.forEach(embase => {
                // Preseleccionar cantidad de embases = cantidad canastillas × capacidad
                const cantidadEmbasesAutomatica = 1 * (prestable.capacidad || 0);
                nuevosItems.push({
                    prestable_id: Number(embase.id),
                    cantidad: cantidadEmbasesAutomatica,
                    prestable: embase,
                });
            });
        }

        setPrestablesAgregados([...prestablesAgregados, ...nuevosItems]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.proveedor_id) {
            setError('Selecciona un proveedor');
            return;
        }

        if (formData.es_compra && !formData.compra_id) {
            setError('Selecciona una compra');
            return;
        }

        if (prestablesAgregados.length === 0) {
            setError('Agrega al menos un prestable');
            return;
        }

        setLoading(true);

        try {
            // Enviar todos los prestables en un único llamado con formato de detalles
            const payload = {
                proveedor_id: formData.proveedor_id,
                es_compra: formData.es_compra,
                compra_id: formData.compra_id,
                fecha_prestamo: formData.fecha_prestamo,
                fecha_esperada_devolucion: formData.fecha_esperada_devolucion,
                monto_garantia: formData.monto_garantia,
                observaciones: '',
                detalles: prestablesAgregados.map(item => ({
                    prestable_id: item.prestable_id,
                    cantidad: item.cantidad,
                })),
            };

            console.log('📤 Enviando préstamo a proveedor con detalles:', payload);
            const response = await prestamoProveedorService.crear(payload);

            console.log('✅ Respuesta del servidor:', response);
            if (response?.id) {
                toast.success('✅ Compra de prestables registrada exitosamente', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
                setUltimoPrestamoId(response.id);
                setMostrarModalImpresion(true);
                setLoading(false);
            } else {
                // Fallback si no hay ID
                console.warn('No se pudo obtener ID del préstamo, redirigiendo...');
                window.location.href = '/prestamos/proveedores';
            }
        } catch (err: any) {
            let mensajeError = 'Ocurrió un error al crear el préstamo';

            // Capturar errores de validación del backend
            if (err.response?.data?.message) {
                mensajeError = err.response.data.message;
            } else if (err.response?.data?.error) {
                mensajeError = err.response.data.error;
            } else if (err.response?.data?.errors) {
                // Si hay múltiples errores de validación
                const errores = Object.values(err.response.data.errors).flat();
                mensajeError = errores.join(' | ');
            } else if (err.message) {
                mensajeError = err.message;
            }

            setError(mensajeError);
            toast.error(mensajeError, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            setLoading(false);
        }
    };

    const totalGarantia = prestablesAgregados.reduce((sum, item) => {
        const garantia = item.prestable?.condiciones?.[0]?.monto_garantia || 0;
        return sum + Number(garantia) * item.cantidad;
    }, 0);

    return (
        <AppLayout>
            <Head title="Comprar Prestables a Proveedor" />
            <div className="p-8 bg-white dark:bg-gray-950 min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                    🛒 Nueva Compra de Prestables
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">
                            {error}
                        </div>
                    )}

                    {/* Info Banner - Información sobre la Compra */}
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                            ℹ️ Cómo funciona la Compra de Prestables
                        </h3>
                        <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                            <p>
                                <strong>Diferencia clave:</strong> Tú ERES el dueño de las canastillas/embases
                            </p>
                            <p>
                                ✅ <strong>Compramos items al proveedor</strong> → <span className="font-semibold text-green-600">SON NUESTROS • STOCK DISPONIBLE AUMENTA</span>
                            </p>
                            <p>
                                📍 Puedes prestarlos a tus clientes y disponer de ellos libremente
                            </p>
                        </div>
                    </div>

                    {/* Sección 1: Información de la Compra */}
                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                            📋 Información de la Compra
                        </h2>

                        {/* Fila: Compra y Proveedor - 2 Columnas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Columna 1: Compra */}
                            <div>
                                <AsyncSearchSelect
                                    label="📦 Compra (Opcional)"
                                    placeholder="Buscar compra por número o folio..."
                                    value={formData.compra_id || ''}
                                    searchEndpoint="/api/compras/search"
                                    onChange={(id) => {
                                        console.log('🔍 [AsyncSelect] Compra seleccionada:', id, 'tipo:', typeof id, 'formData.compra_id antes:', formData.compra_id);
                                        handleCompraSeleccionada(id ? Number(id) : undefined);
                                    }}
                                    minSearchLength={1}
                                    allowClear
                                />
                                {loadingCompra && (
                                    <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" />
                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                            Cargando...
                                        </p>
                                    </div>
                                )}
                                {formData.compra_id && (
                                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            ✅ Compra: <span className="font-medium">ID #{formData.compra_id}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Columna 2: Proveedor */}
                            <div>
                                <SearchSelect
                                    label="Proveedor *"
                                    placeholder="Buscar proveedor..."
                                    value={formData.proveedor_id || ''}
                                    options={proveedoresOptions}
                                    onChange={(id) =>
                                        setFormData({ ...formData, proveedor_id: id ? Number(id) : undefined })
                                    }
                                    required
                                />
                                {formData.proveedor_id && (
                                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                                        <p className="text-xs text-green-700 dark:text-green-300">
                                            ✅ Proveedor: <span className="font-medium">{proveedores.find(p => p.id === formData.proveedor_id)?.nombre}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fila: Garantía */}
                        <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Garantía Total (Opcional)
                                </label>
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
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Escribe la garantía manualmente (Sugerencia: {totalGarantia.toFixed(2)})
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Fecha de Préstamo *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.fecha_prestamo}
                                    onChange={(e) => handleFechaPrestamo(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
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
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Sección 2: Prestables Unificado - Selección + Resumen */}
                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                            📦 Seleccionar Prestables
                        </h2>

                        {/* Filtro por Tipo */}
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                🔍 Filtrar por tipo:
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={mostrarCanastillas && !mostrarSoloEmbases}
                                        onChange={(e) => {
                                            setMostrarCanastillas(e.target.checked);
                                            setMostrarSoloEmbases(false);
                                        }}
                                        disabled={mostrarSoloEmbases}
                                        className="w-4 h-4 cursor-pointer disabled:opacity-50"
                                    />
                                    <span className={`text-sm ${mostrarSoloEmbases ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                        📦 Canastillas
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={mostrarEmbasesIndependientes && !mostrarSoloEmbases}
                                        onChange={(e) => {
                                            setMostrarEmbasesIndependientes(e.target.checked);
                                            setMostrarSoloEmbases(false);
                                        }}
                                        disabled={mostrarSoloEmbases}
                                        className="w-4 h-4 cursor-pointer disabled:opacity-50"
                                    />
                                    <span className={`text-sm ${mostrarSoloEmbases ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                        🔖 Embases independientes
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer border-l pl-4 border-gray-300 dark:border-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={mostrarSoloEmbases}
                                        onChange={(e) => {
                                            setMostrarSoloEmbases(e.target.checked);
                                            if (e.target.checked) {
                                                setMostrarCanastillas(false);
                                                setMostrarEmbasesIndependientes(true);
                                                // Remover canastillas del carrito
                                                setPrestablesAgregados(
                                                    prestablesAgregados.filter(item => {
                                                        const prestable = prestables.find(p => Number(p.id) === item.prestable_id);
                                                        return prestable?.tipo === 'EMBASES';
                                                    })
                                                );
                                            }
                                        }}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        🔖 Solo embases
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Mensaje si no hay filtros seleccionados */}
                        {!mostrarCanastillas && !mostrarEmbasesIndependientes && (
                            <div className="p-6 text-center bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
                                <p className="text-amber-800 dark:text-amber-300">
                                    ⚠️ Selecciona al menos un tipo de filtro arriba para ver prestables disponibles
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Columna Izquierda: Tabla de Prestables Disponibles */}
                            <div>
                                <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Disponibles</h3>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50 dark:bg-gray-800">
                                                <TableHead className="w-12 text-gray-900 dark:text-white"></TableHead>
                                                <TableHead className="text-gray-900 dark:text-white">Prestable</TableHead>
                                                <TableHead className="text-center text-gray-900 dark:text-white text-xs">
                                                    Stock
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {prestables
                                                .filter((prestable) => {
                                                    if (!prestable.activo) return false;
                                                    const stockTotal = prestable.stocks?.reduce(
                                                        (sum, stock) => sum + (stock.cantidad_disponible || 0),
                                                        0
                                                    ) || 0;
                                                    if (stockTotal <= 0) return false;

                                                    // Si está activado "mostrarSoloEmbases", mostrar TODOS los embases
                                                    if (mostrarSoloEmbases) {
                                                        return prestable.tipo === 'EMBASES';
                                                    }

                                                    if (prestable.tipo === 'CANASTILLA' && mostrarCanastillas) {
                                                        return true;
                                                    }
                                                    if (prestable.tipo === 'EMBASES' && !(prestable as any).prestable_relacionado_id && mostrarEmbasesIndependientes) {
                                                        return true;
                                                    }
                                                    return false;
                                                })
                                                .map((prestable) => {
                                                    const estaSeleccionado = prestablesAgregados.some(
                                                        (p) => p.prestable_id === Number(prestable.id)
                                                    );
                                                    const stockTotalCanastillas = prestable.stocks?.reduce(
                                                        (sum, stock) => sum + (stock.cantidad_disponible || 0),
                                                        0
                                                    ) || 0;

                                                    // Calcular cantidad solicitada
                                                    const cantidadSolicitada = prestablesAgregados.find(
                                                        p => p.prestable_id === Number(prestable.id)
                                                    )?.cantidad || 0;

                                                    // Para PROVEEDOR: stock AUMENTA (se suma)
                                                    // Para CLIENTE: stock DISMINUYE (se resta)
                                                    const stockFinal = formData.es_compra || !formData.es_compra
                                                        ? stockTotalCanastillas + cantidadSolicitada
                                                        : stockTotalCanastillas - cantidadSolicitada;
                                                    const tieneStock = true; // Siempre hay stock disponible para proveedor

                                                    return (
                                                        <TableRow
                                                            key={prestable.id}
                                                            className={`border-gray-200 dark:border-gray-700 transition ${estaSeleccionado
                                                                    ? 'bg-blue-50 dark:bg-blue-900/20'
                                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                                }`}
                                                        >
                                                            <TableCell className="text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={estaSeleccionado}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            handleAgregarCanastilla(prestable);
                                                                        } else {
                                                                            handleEliminarPrestable(Number(prestable.id));
                                                                        }
                                                                    }}
                                                                    className="w-4 h-4 cursor-pointer"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="text-gray-900 dark:text-white">
                                                                <p className="text-sm font-medium">{prestable.nombre}</p>
                                                                <p className="text-xs text-gray-500">{prestable.codigo}</p>
                                                            </TableCell>
                                                            <TableCell className="text-right text-sm">
                                                                <div className="space-y-1">
                                                                    <div className="text-gray-900 dark:text-white font-medium">
                                                                        Stock actual: {stockTotalCanastillas.toLocaleString('es-BO')}
                                                                    </div>
                                                                    {cantidadSolicitada > 0 && (
                                                                        <>
                                                                            <div className="text-xs text-green-600 dark:text-green-400">
                                                                                Recibiendo: +{cantidadSolicitada.toLocaleString('es-BO')}
                                                                            </div>
                                                                            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                                                Total: {stockFinal.toLocaleString('es-BO')}
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>

                                    {prestables.filter((p) => {
                                        if (!p.activo) return false;
                                        const stockTotal = p.stocks?.reduce((sum, stock) => sum + (stock.cantidad_disponible || 0), 0) || 0;
                                        if (stockTotal <= 0) return false;
                                        if (mostrarSoloEmbases) return p.tipo === 'EMBASES';
                                        if (p.tipo === 'CANASTILLA' && mostrarCanastillas) return true;
                                        if (p.tipo === 'EMBASES' && !(p as any).prestable_relacionado_id && mostrarEmbasesIndependientes) return true;
                                        return false;
                                    }).length === 0 && (mostrarCanastillas || mostrarEmbasesIndependientes || mostrarSoloEmbases) && (
                                            <div className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                                <p>No hay prestables disponibles</p>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Columna Derecha: Resumen/Carrito */}
                            <div>
                                <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <p className="text-xs font-semibold text-green-900 dark:text-green-100">
                                        ✅ RECIBIENDO del proveedor:
                                    </p>
                                    <p className="text-xs text-green-800 dark:text-green-200 mt-1">
                                        Los items seleccionados <strong>AUMENTAN</strong> nuestro stock
                                    </p>
                                </div>
                                <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Carrito ({prestablesAgregados.length})</h3>
                                {prestablesAgregados.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/30">
                                        Selecciona prestables a la izquierda
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {!mostrarSoloEmbases && prestables
                                            .filter(p => p.tipo === 'CANASTILLA')
                                            .map(canastilla => {
                                                const canastillaItem = prestablesAgregados.find(p => p.prestable_id === Number(canastilla.id));
                                                const embasesRelacionados = prestables.filter(
                                                    p => p.tipo === 'EMBASES' && (p as any).prestable_relacionado_id === Number(canastilla.id)
                                                );

                                                if (!canastillaItem) return null;

                                                const cantidadEmbasesCalc = canastillaItem.cantidad * (canastilla.capacidad || 0);

                                                return (
                                                    <div key={canastilla.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                        {/* Canastilla Header */}
                                                        <div className="flex justify-between items-start gap-2 mb-2">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                                                    📦 {canastilla.nombre}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <input
                                                                        type="text"
                                                                        inputMode="numeric"
                                                                        value={canastillaItem.cantidad}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value;
                                                                            if (val === '' || /^\d+$/.test(val)) {
                                                                                handleCambiarCantidad(Number(canastilla.id), val === '' ? 0 : parseInt(val));
                                                                            }
                                                                        }}
                                                                        onFocus={(e) => e.target.select()}
                                                                        className="w-28 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-md font-medium"
                                                                    />
                                                                    <span className="text-sm text-gray-600 dark:text-gray-400">unid.</span>
                                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                        = {cantidadEmbasesCalc.toLocaleString('es-BO')} 🔖
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEliminarPrestable(Number(canastilla.id))}
                                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>

                                                        {/* Embases Relacionados */}
                                                        {embasesRelacionados.map(embase => {
                                                            const embaseItem = prestablesAgregados.find(p => p.prestable_id === Number(embase.id));
                                                            if (!embaseItem) return null;

                                                            return (
                                                                <div key={embase.id} className="ml-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs">
                                                                    <div className="flex justify-between items-center gap-1">
                                                                        <span className="text-gray-700 dark:text-gray-300">🔖 {embase.nombre}</span>
                                                                        <div className="flex items-center gap-1">
                                                                            <input
                                                                                type="text"
                                                                                inputMode="numeric"
                                                                                value={embaseItem.cantidad}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    if (val === '' || /^\d+$/.test(val)) {
                                                                                        handleCambiarCantidad(Number(embase.id), val === '' ? 0 : parseInt(val));
                                                                                    }
                                                                                }}
                                                                                onFocus={(e) => e.target.select()}
                                                                                className="w-28 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-md font-medium"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleEliminarPrestable(Number(embase.id))}
                                                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                                            >
                                                                                <Trash2 size={12} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}

                                        {/* Embases Independientes / Modo Solo Embases */}
                                        {prestablesAgregados
                                            .filter(item => {
                                                const prestable = prestables.find(p => Number(p.id) === item.prestable_id);
                                                if (prestable?.tipo !== 'EMBASES') return false;
                                                // En modo "Solo embases", mostrar todos los embases
                                                if (mostrarSoloEmbases) return true;
                                                // En modo normal, mostrar solo embases sin relación
                                                return !(prestable as any).prestable_relacionado_id;
                                            })
                                            .map(item => {
                                                const prestable = prestables.find(p => Number(p.id) === item.prestable_id);
                                                if (!prestable) return null;

                                                return (
                                                    <div key={prestable.id} className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                                        <div className="flex justify-between items-center gap-2">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                                                    🔖 {prestable.nombre}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <input
                                                                        type="text"
                                                                        inputMode="numeric"
                                                                        value={item.cantidad}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value;
                                                                            if (val === '' || /^\d+$/.test(val)) {
                                                                                handleCambiarCantidad(Number(prestable.id), val === '' ? 0 : parseInt(val));
                                                                            }
                                                                        }}
                                                                        onFocus={(e) => e.target.select()}
                                                                        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium"
                                                                    />
                                                                    <span className="text-sm text-gray-600 dark:text-gray-400">unid.</span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEliminarPrestable(Number(prestable.id))}
                                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Botones de Acción */}
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={loading || prestablesAgregados.length === 0}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Registrando...' : '✅ Registrar Compra'}
                        </Button>
                        <a href="/prestamos/proveedores">
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </a>
                    </div>
                </form>
            </div>

            {/* Modal de Impresión */}
            <OutputSelectionModal
                isOpen={mostrarModalImpresion && ultimoPrestamoId !== null}
                onClose={() => {
                    setMostrarModalImpresion(false);
                    setUltimoPrestamoId(null);
                    // Redirigir después de cerrar el modal
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
