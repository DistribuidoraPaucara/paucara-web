import type { Almacen } from '@/domain/entities/almacenes';
import type { Producto } from '@/domain/entities/productos';
import type { Pagination } from '@/domain/entities/shared';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/presentation/components/ui/alert-dialog';
import { Input } from '@/presentation/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Filter,
    Grid3x3,
    List,
    Package,
    Package2,
    Search,
    XCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import ToastContainer from '@/presentation/components/ui/toast-container';

// Interfaces específicas para lotes
interface Imagen {
    id: number;
    url: string;
    ruta?: string;
    titulo?: string;
    es_principal?: boolean;
}

interface ProductoExtendido extends Producto {
    id: number;
    nombre: string;
    codigo: string;
    sku: string | null;
    imagenes?: Imagen[];
}

interface LoteDetalle {
    id: number;
    producto: ProductoExtendido;
    almacen: Almacen;
    lote: string;
    fecha_vencimiento: string | null;
    cantidad: number;
    cantidad_disponible: number;
    cantidad_reservada: number;
    precio_costo: number | null;
    valor_total: number;
    dias_para_vencer: number | null;
    estado_vencimiento: 'VIGENTE' | 'PROXIMO_VENCER' | 'VENCIDO' | 'CRITICO' | 'SIN_VENCIMIENTO';
    esta_vencido: boolean;
    deleted_at?: string | null;
}

interface EstadisticasLotes {
    total_lotes: number;
    lotes_vigentes: number;
    lotes_proximos_vencer: number;
    lotes_vencidos: number;
    lotes_criticos: number;
    valor_total_inventario: number;
    valor_proximos_vencer: number;
    valor_vencidos: number;
}

interface Props {
    lotes: Pagination<LoteDetalle>;
    estadisticas: EstadisticasLotes;
    productos: Producto[];
    almacenes: Almacen[];
    filtros: {
        producto_id?: string;
        almacen_id?: string;
        estado_vencimiento?: string;
        q?: string;
        fecha_vencimiento_desde?: string;
        fecha_vencimiento_hasta?: string;
    };
}

const GestionLotesVencimientos: React.FC<Props> = ({ lotes, estadisticas, productos, almacenes, filtros }) => {
    // ✅ NUEVO (2026-07-22): Logging en consola para ver datos del backend
    React.useEffect(() => {
        console.group('📦 [Gestión Lotes] Datos del Backend');
        console.log('📊 Estadísticas:', estadisticas);
        console.log('📋 Total de lotes:', lotes.total);
        console.table(
            lotes.data.map((l) => ({
                id: l.id,
                producto: l.producto.nombre,
                almacen: l.almacen.nombre,
                lote: l.lote,
                fecha_vencimiento: l.fecha_vencimiento,
                dias_para_vencer: l.dias_para_vencer,
                estado: l.estado_vencimiento,
                cantidad: l.cantidad,
                disponible: l.cantidad_disponible,
                valor: l.valor_total,
            })),
        );
        console.log('🔧 Productos disponibles:', productos.length);
        console.log('🎯 Almacenes disponibles:', almacenes.length);
        console.log('🎯 Filtros actuales:', filtros);
        console.groupEnd();
    }, [lotes, estadisticas, productos, almacenes, filtros]);

    const [filtroLocal, setFiltroLocal] = useState(filtros);
    const [loteSeleccionado, setLoteSeleccionado] = useState<LoteDetalle | null>(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);
    const [vistaActual, setVistaActual] = useState<'tabla' | 'calendario'>('calendario');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [estaDandoDeBaja, setEstaDandoDeBaja] = useState(false);
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }>>([]);
    const [loteParaBaja, setLoteParaBaja] = useState<LoteDetalle | null>(null);
    // ✅ Función para parsear fecha en zona horaria local (sin UTC)
    const parsearFechaLocal = (dateString: string): Date => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const [mesActual, setMesActual] = useState<Date>(() => {
        // Si hay filtro de fecha_desde, usar ese mes
        if (filtros.fecha_vencimiento_desde) {
            return parsearFechaLocal(filtros.fecha_vencimiento_desde);
        }
        return new Date();
    });
    const [lotesSeleccionadosPorDia, setLotesSeleccionadosPorDia] = useState<LoteDetalle[]>([]);

    // ✅ SINCRONIZAR mesActual y filtroLocal con filtros de fecha del backend
    React.useEffect(() => {
        setFiltroLocal(filtros);
        if (filtros.fecha_vencimiento_desde) {
            setMesActual(parsearFechaLocal(filtros.fecha_vencimiento_desde));
            setLotesSeleccionadosPorDia([]);
        }
    }, [filtros.fecha_vencimiento_desde, filtros.fecha_vencimiento_hasta]);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string): string => {
        // Usar parsearFechaLocal para evitar problemas de timezone
        const fecha = parsearFechaLocal(dateString);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const closeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const getEstadoVencimientoColor = (estado: string) => {
        switch (estado) {
            case 'VIGENTE':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'PROXIMO_VENCER':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'CRITICO':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            case 'VENCIDO':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getEstadoVencimientoIcon = (estado: string) => {
        switch (estado) {
            case 'VIGENTE':
                return <CheckCircle className="h-4 w-4" />;
            case 'PROXIMO_VENCER':
                return <Clock className="h-4 w-4" />;
            case 'CRITICO':
                return <AlertTriangle className="h-4 w-4" />;
            case 'VENCIDO':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Package2 className="h-4 w-4" />;
        }
    };

    // Dar de baja un lote
    const handleDarDeBaja = async () => {
        if (!loteSeleccionado) return;

        setEstaDandoDeBaja(true);
        try {
            const response = await fetch(`/compras/lotes-vencimientos/${loteSeleccionado.id}/dar-de-baja`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });

            if (response.ok) {
                // Actualizar el lote seleccionado con deleted_at
                const now = new Date().toISOString();
                setLoteSeleccionado(prev =>
                    prev ? { ...prev, deleted_at: now } : null
                );

                // Actualizar la lista de lotes
                lotes.data = lotes.data.map(l =>
                    l.id === loteSeleccionado.id
                        ? { ...l, deleted_at: now }
                        : l
                );

                showToast(`✅ Lote ${loteSeleccionado.lote} dado de baja correctamente`, 'success');
                setMostrarDetalle(false);
            } else {
                const data = await response.json();
                showToast(data.message || 'Error al dar de baja el lote', 'error');
            }
        } catch (error) {
            console.error('Error al dar de baja el lote:', error);
            showToast('Error al dar de baja el lote', 'error');
        } finally {
            setEstaDandoDeBaja(false);
        }
    };

    // Funciones para el calendario
    const obtenerLotesDelMes = () => {
        const lotesMap = new Map<number, LoteDetalle[]>();

        lotes.data.forEach((lote) => {
            if (lote.fecha_vencimiento) {
                const fecha = parsearFechaLocal(lote.fecha_vencimiento);
                const mes = fecha.getMonth();
                const año = fecha.getFullYear();
                const mesActualNum = mesActual.getMonth();
                const añoActual = mesActual.getFullYear();

                if (mes === mesActualNum && año === añoActual) {
                    const dia = fecha.getDate();
                    if (!lotesMap.has(dia)) {
                        lotesMap.set(dia, []);
                    }
                    lotesMap.get(dia)!.push(lote);
                }
            }
        });

        return lotesMap;
    };

    const diasDelMes = useMemo(() => {
        const año = mesActual.getFullYear();
        const mes = mesActual.getMonth();
        const primerDia = new Date(año, mes, 1);
        const ultimoDia = new Date(año, mes + 1, 0);
        const diasEnMes = ultimoDia.getDate();
        const diaInicio = primerDia.getDay();

        return { diasEnMes, diaInicio };
    }, [mesActual]);

    const lotesDelMes = useMemo(() => obtenerLotesDelMes(), [lotes.data, mesActual]);

    const handleDiaClick = (dia: number) => {
        const lotesDelDia = lotesDelMes.get(dia) || [];
        setLotesSeleccionadosPorDia(lotesDelDia);
    };

    const obtenerRangoMes = (fecha: Date) => {
        const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

        return {
            desde: primerDia.toISOString().split('T')[0],
            hasta: ultimoDia.toISOString().split('T')[0],
        };
    };

    const filtrarPorMes = (nuevaMes: Date) => {
        const { desde, hasta } = obtenerRangoMes(nuevaMes);
        const params: Record<string, string> = {};

        // Mantener otros filtros
        Object.entries(filtroLocal).forEach(([key, value]) => {
            if (key !== 'fecha_vencimiento_desde' && key !== 'fecha_vencimiento_hasta' && value && value !== '') {
                params[key] = value;
            }
        });

        params.fecha_vencimiento_desde = desde;
        params.fecha_vencimiento_hasta = hasta;

        // ✅ Usar router.get() de Inertia en lugar de window.location.href
        // Esto hace un fetch sin recargar la página completa
        router.get('/compras/lotes-vencimientos', params, {
            preserveScroll: true,
            replace: false,
        });
    };

    const mesAnterior = () => {
        const nuevoMes = new Date(mesActual.getFullYear(), mesActual.getMonth() - 1);
        setMesActual(nuevoMes);
        filtrarPorMes(nuevoMes);
    };

    const mesSiguiente = () => {
        const nuevoMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1);
        setMesActual(nuevoMes);
        filtrarPorMes(nuevoMes);
    };

    const nombreMes = mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    const aplicarFiltros = () => {
        const params = new URLSearchParams();

        Object.entries(filtroLocal).forEach(([key, value]) => {
            if (value && value !== '') {
                params.set(key, value);
            }
        });

        window.location.href = `/compras/lotes-vencimientos?${params.toString()}`;
    };

    const limpiarFiltros = () => {
        setFiltroLocal({});
        window.location.href = '/compras/lotes-vencimientos';
    };

    const verDetalleLote = (lote: LoteDetalle) => {
        setLoteSeleccionado(lote);
        setMostrarDetalle(true);
    };

    return (
        <AppLayout>
            <Head title="Gestión de Lotes y Vencimientos" />

            <div className="space-y-2 p-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Lotes y Vencimientos</h1>
                        <p className="text-gray-600 dark:text-gray-400">Control de productos perecederos y fechas de vencimiento</p>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center mr-2">
                                <Package className="h-4 w-4 text-blue-600" />
                                <CardTitle className="text-sm font-medium">Total de Lotes</CardTitle>
                            </div>
                            <div className="text-2xl font-bold">{estadisticas.total_lotes}</div>
                        </div>
                    </div>

                    <div>
                        <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center justify-center">
                                <div className="flex items-center justify-center mr-2">
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                    <CardTitle className="text-sm font-medium">Próximos a Vencer</CardTitle>
                                </div>
                                <div className="text-2xl font-bold text-yellow-600 mr-2">{estadisticas.lotes_proximos_vencer}</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center justify-center">
                                <div className="flex items-center justify-center mr-2">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
                                </div>
                                <div className="text-2xl font-bold text-red-600">{estadisticas.lotes_vencidos}</div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center mr-2">
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                <CardTitle className="text-sm font-medium">Estado Crítico</CardTitle>
                            </div>
                            <div className="text-2xl font-bold text-orange-600">{estadisticas.lotes_criticos}</div>
                        </div>
                    </div>
                </div>

                {/* Filtros - Colapsable */}
                <div
                    className="cursor-pointer rounded-lg border border-gray-200 transition-all hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                >
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center text-lg">
                                <Filter className="mr-2 h-5 w-5" />
                                Filtros de Búsqueda
                            </CardTitle>
                            <span className={`transition-transform duration-300 ${mostrarFiltros ? 'rotate-180' : ''}`}>▼</span>
                        </div>
                    </div>
                </div>

                {/* Contenido de Filtros */}
                {mostrarFiltros && (
                    <Card>
                        <CardContent>
                            <CardDescription className="mb-4">Utiliza los filtros para encontrar lotes específicos</CardDescription>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Buscar</label>
                                    <Input
                                        placeholder="Número de lote, producto..."
                                        value={filtroLocal.q || ''}
                                        onChange={(e) => setFiltroLocal((prev) => ({ ...prev, q: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Producto</label>
                                    <Select
                                        value={filtroLocal.producto_id || 'all'}
                                        onValueChange={(value) => setFiltroLocal((prev) => ({ ...prev, producto_id: value === 'all' ? '' : value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos los productos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los productos</SelectItem>
                                            {productos.map((producto) => (
                                                <SelectItem key={producto.id} value={producto.id.toString()}>
                                                    {producto.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Almacén</label>
                                    <Select
                                        value={filtroLocal.almacen_id || 'all'}
                                        onValueChange={(value) => setFiltroLocal((prev) => ({ ...prev, almacen_id: value === 'all' ? '' : value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos los almacenes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los almacenes</SelectItem>
                                            {almacenes.map((almacen) => (
                                                <SelectItem key={almacen.id} value={almacen.id.toString()}>
                                                    {almacen.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Estado de Vencimiento</label>
                                    <Select
                                        value={filtroLocal.estado_vencimiento || 'all'}
                                        onValueChange={(value) =>
                                            setFiltroLocal((prev) => ({ ...prev, estado_vencimiento: value === 'all' ? '' : value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos los estados" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los estados</SelectItem>
                                            <SelectItem value="VIGENTE">Vigente</SelectItem>
                                            <SelectItem value="PROXIMO_VENCER">Próximo a Vencer</SelectItem>
                                            <SelectItem value="CRITICO">Crítico</SelectItem>
                                            <SelectItem value="VENCIDO">Vencido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end space-x-3">
                                <Button variant="outline" onClick={limpiarFiltros}>
                                    Limpiar
                                </Button>
                                <Button onClick={aplicarFiltros}>
                                    <Search className="mr-2 h-4 w-4" />
                                    Aplicar Filtros
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Toggle de Vista */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Vista de Lotes</h2>
                    <div className="flex gap-2">
                        <Button
                            variant={vistaActual === 'calendario' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setVistaActual('calendario')}
                            className="flex items-center gap-2"
                        >
                            <Grid3x3 className="h-4 w-4" />
                            Calendario
                        </Button>
                        <Button
                            variant={vistaActual === 'tabla' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setVistaActual('tabla')}
                            className="flex items-center gap-2"
                        >
                            <List className="h-4 w-4" />
                            Tabla
                        </Button>
                    </div>
                </div>

                {/* VISTA CALENDARIO */}
                {vistaActual === 'calendario' && (
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="capitalize">{nombreMes}</CardTitle>
                                    <CardDescription>Visualiza qué lotes se vencen en cada día del mes</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={mesAnterior}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const hoy = new Date();
                                            filtrarPorMes(hoy);
                                        }}
                                    >
                                        Hoy
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={mesSiguiente}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Encabezado de días de la semana */}
                            <div className="mb-2 grid grid-cols-7 gap-2">
                                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'].map((dia) => (
                                    <div key={dia} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        {dia}
                                    </div>
                                ))}
                            </div>

                            {/* Calendario */}
                            <div className="grid grid-cols-7 gap-2">
                                {/* Espacios vacíos antes del primer día */}
                                {Array.from({ length: diasDelMes.diaInicio }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square"></div>
                                ))}

                                {/* Días del mes */}
                                {Array.from({ length: diasDelMes.diasEnMes }).map((_, i) => {
                                    const dia = i + 1;
                                    const lotesDelDia = lotesDelMes.get(dia) || [];
                                    const tieneDadosDeBaja = lotesDelDia.some((l) => l.deleted_at);
                                    const tieneVencidos = lotesDelDia.some((l) => l.estado_vencimiento === 'VENCIDO' && !l.deleted_at);
                                    const tieneCriticos = lotesDelDia.some((l) => l.estado_vencimiento === 'CRITICO' && !l.deleted_at);
                                    const tieneProximos = lotesDelDia.some((l) => l.estado_vencimiento === 'PROXIMO_VENCER' && !l.deleted_at);
                                    const tieneActivos = lotesDelDia.some((l) => !l.deleted_at);

                                    let colorFondo = 'bg-gray-50 dark:bg-gray-800';
                                    if (tieneVencidos) {
                                        colorFondo = 'bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700';
                                    } else if (tieneCriticos) {
                                        colorFondo = 'bg-orange-50 dark:bg-orange-900/30 border-2 border-orange-300 dark:border-orange-700';
                                    } else if (tieneProximos) {
                                        colorFondo = 'bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-300 dark:border-yellow-700';
                                    } else if (tieneActivos) {
                                        colorFondo = 'bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700';
                                    } else if (tieneDadosDeBaja) {
                                        colorFondo = 'bg-gray-300 dark:bg-gray-700 border-2 border-gray-500 dark:border-gray-600 opacity-50';
                                    }

                                    return (
                                        <div
                                            key={dia}
                                            onClick={() => handleDiaClick(dia)}
                                            className={`min-h-24 cursor-pointer rounded-lg p-1.5 transition-all hover:scale-105 hover:shadow-lg ${colorFondo}`}
                                            title={lotesDelDia.length > 0 ? `${lotesDelDia.length} lote(s)` : 'Sin lotes'}
                                        >
                                            <div className="flex h-full flex-col gap-1">
                                                {/* Número del día */}
                                                <span className="text-xs leading-none font-bold text-gray-900 dark:text-white">{dia}</span>

                                                {/* Lotes del día */}
                                                {lotesDelDia.length > 0 && (
                                                    <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                                                        {lotesDelDia.slice(0, 1).map((lote) => (
                                                            <div
                                                                key={lote.id}
                                                                className="flex gap-1 rounded bg-white p-1 text-[10px] leading-tight dark:bg-gray-700"
                                                                title={`${lote.producto.nombre}\nSKU: ${lote.producto.sku || 'N/A'}\nLote: ${lote.lote}`}
                                                            >
                                                                {/* Mini imagen */}
                                                                <div className="flex-shrink-0">
                                                                    {lote.producto.imagenes && lote.producto.imagenes.length > 0 ? (
                                                                        <img
                                                                            src={lote.producto.imagenes[0].url}
                                                                            alt={lote.producto.nombre}
                                                                            className="h-6 w-6 rounded object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-300 text-[8px] dark:bg-gray-600">
                                                                            📦
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Info del producto */}
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="truncate font-semibold text-gray-900 dark:text-white">
                                                                        {lote.producto.nombre.substring(0, 12)}
                                                                    </div>
                                                                    <div className="truncate text-[9px] text-gray-600 dark:text-gray-400">
                                                                        SKU: {lote.producto.sku || 'N/A'}
                                                                    </div>
                                                                    <div className="truncate font-mono text-[9px] text-gray-600 dark:text-gray-400">
                                                                        L:{lote.lote}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {lotesDelDia.length > 1 && (
                                                            <div className="py-0.5 text-center text-[9px] font-semibold text-gray-600 dark:text-gray-400">
                                                                +{lotesDelDia.length - 1} más
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Detalle de lotes del día seleccionado */}
                            {lotesSeleccionadosPorDia.length > 0 && (
                                <div className="mt-6 border-t pt-6 dark:border-gray-700">
                                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                                        Lotes que se vencen en este día ({lotesSeleccionadosPorDia.length})
                                    </h3>
                                    <div className="space-y-4">
                                        {lotesSeleccionadosPorDia.map((lote) => (
                                            <div
                                                key={lote.id}
                                                className="flex gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                                            >
                                                {/* Imagen del Producto */}
                                                <div className="flex-shrink-0">
                                                    {lote.producto.imagenes && lote.producto.imagenes.length > 0 ? (
                                                        <img
                                                            src={lote.producto.imagenes[0].url || lote.producto.imagenes[0].ruta}
                                                            alt={lote.producto.nombre}
                                                            className="h-20 w-20 rounded-lg border border-gray-300 object-cover dark:border-gray-600"
                                                        />
                                                    ) : (
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700">
                                                            <Package className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Información del Producto */}
                                                <div className="flex-1">
                                                    <div className="mb-3 grid grid-cols-2 gap-4">
                                                        <div>
                                                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">ID</div>
                                                            <a
                                                                href={`/productos/${lote.producto.id}/edit`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="font-mono font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                            >
                                                                #{lote.producto.id}
                                                            </a>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">SKU</div>
                                                            <div className="font-mono font-semibold text-gray-900 dark:text-white">
                                                                {lote.producto.sku || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mb-2">
                                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {lote.producto.nombre}
                                                        </div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                                            Lote: <span className="font-mono">{lote.lote || 'Sin lote'}</span> • Almacén:{' '}
                                                            {lote.almacen.nombre}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Datos Derechos */}
                                                <div className="flex flex-col items-end justify-between gap-2">
                                                    <Badge className={getEstadoVencimientoColor(lote.estado_vencimiento)}>
                                                        {lote.estado_vencimiento.replace('_', ' ')}
                                                    </Badge>
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Cantidad</div>
                                                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{lote.cantidad}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Valor Total</div>
                                                        <div className="font-mono font-semibold text-gray-900 dark:text-white">
                                                            {formatCurrency(lote.valor_total)}
                                                        </div>
                                                    </div>
                                                    {/* Botones de acción */}
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {!lote.deleted_at ? (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setLoteSeleccionado(lote);
                                                                        setMostrarDetalle(true);
                                                                    }}
                                                                >
                                                                    📋 Ver detalle
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => setLoteParaBaja(lote)}
                                                                >
                                                                    🗑️ Baja
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <div className="rounded bg-gray-300 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-center w-full">
                                                                ✓ Dado de baja
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* VISTA TABLA */}
                {vistaActual === 'tabla' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Lista de Lotes</CardTitle>
                            <CardDescription>
                                {lotes.total} lote{lotes.total !== 1 ? 's' : ''} encontrado{lotes.total !== 1 ? 's' : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {lotes.data.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No se encontraron lotes</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        No hay lotes que coincidan con los filtros aplicados.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                    Producto
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                    Lote
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                    Almacén
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                    Cantidad
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                    Fecha Vencimiento
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                    Valor
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                            {lotes.data.map((lote) => (
                                                <tr key={lote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {lote.producto.nombre}
                                                                </div>
                                                                <div className="text-sm text-gray-500">{lote.producto.codigo}</div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700">
                                                            {lote.lote || 'Sin lote'}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{lote.almacen.nombre}</div>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                                                        {lote.cantidad}
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {lote.fecha_vencimiento ? formatDate(lote.fecha_vencimiento) : 'Sin fecha'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {lote.dias_para_vencer === null
                                                                    ? 'Sin vencimiento'
                                                                    : lote.dias_para_vencer >= 0
                                                                      ? `${lote.dias_para_vencer} días`
                                                                      : `Vencido hace ${Math.abs(lote.dias_para_vencer)} días`}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge
                                                            className={`${getEstadoVencimientoColor(lote.estado_vencimiento)} flex w-fit items-center`}
                                                        >
                                                            {getEstadoVencimientoIcon(lote.estado_vencimiento)}
                                                            <span className="ml-1">{lote.estado_vencimiento.replace('_', ' ')}</span>
                                                        </Badge>
                                                    </td>

                                                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900 dark:text-white">
                                                        <div className="font-mono">{formatCurrency(lote.valor_total)}</div>
                                                    </td>

                                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => verDetalleLote(lote)}
                                                            className="text-blue-600 hover:text-blue-700"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Modal de Detalle */}
                <Dialog open={mostrarDetalle} onOpenChange={setMostrarDetalle}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center">
                                <Package className="mr-2 h-5 w-5" />
                                Detalle del Lote
                            </DialogTitle>
                            <DialogDescription>Información completa del lote seleccionado</DialogDescription>
                        </DialogHeader>

                        {loteSeleccionado && (
                            <div className="space-y-6">
                                {/* Información del Producto */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900 dark:text-white">Producto</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{loteSeleccionado.producto.nombre}</span>
                                            </div>
                                            {/* <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Código:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{loteSeleccionado.producto.codigo || 'N/A'}</span>
                                            </div> */}
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Lote:</span>
                                                <span className="rounded bg-gray-100 px-2 py-1 font-medium dark:bg-gray-700 dark:text-white">
                                                    {loteSeleccionado.lote || 'Sin lote'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900 dark:text-white">Almacén</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{loteSeleccionado.almacen.nombre}</span>
                                            </div>
                                            {/* <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Ubicación:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{loteSeleccionado.almacen.ubicacion || 'N/A'}</span>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>

                                {/* Información del Vencimiento */}
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                    <h4 className="mb-3 font-medium text-gray-900 dark:text-white">Estado de Vencimiento</h4>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div>
                                            <span className="mb-1 block text-sm text-gray-600">Estado:</span>
                                            <Badge className={getEstadoVencimientoColor(loteSeleccionado.estado_vencimiento)}>
                                                {getEstadoVencimientoIcon(loteSeleccionado.estado_vencimiento)}
                                                <span className="ml-1">{loteSeleccionado.estado_vencimiento.replace('_', ' ')}</span>
                                            </Badge>
                                        </div>
                                        <div>
                                            <span className="mb-1 block text-sm text-gray-600">Fecha Vencimiento:</span>
                                            <span className="font-medium">
                                                {loteSeleccionado.fecha_vencimiento ? formatDate(loteSeleccionado.fecha_vencimiento) : 'Sin fecha'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="mb-1 block text-sm text-gray-600">Días para vencer:</span>
                                            <span
                                                className={`font-medium ${
                                                    loteSeleccionado.dias_para_vencer === null
                                                        ? 'text-gray-600'
                                                        : loteSeleccionado.dias_para_vencer < 0
                                                          ? 'text-red-600'
                                                          : loteSeleccionado.dias_para_vencer <= 7
                                                            ? 'text-orange-600'
                                                            : loteSeleccionado.dias_para_vencer <= 30
                                                              ? 'text-yellow-600'
                                                              : 'text-green-600'
                                                }`}
                                            >
                                                {loteSeleccionado.dias_para_vencer === null
                                                    ? 'Sin vencimiento'
                                                    : loteSeleccionado.dias_para_vencer >= 0
                                                      ? `${loteSeleccionado.dias_para_vencer} días`
                                                      : `Vencido hace ${Math.abs(loteSeleccionado.dias_para_vencer)} días`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Información Financiera */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div>
                                        <span className="mb-1 block text-sm text-gray-600">Cantidad:</span>
                                        <span className="text-lg font-medium">{loteSeleccionado.cantidad}</span>
                                    </div>
                                    <div>
                                        <span className="mb-1 block text-sm text-gray-600">Precio Costo:</span>
                                        <span className="text-lg font-medium">
                                            {loteSeleccionado.precio_costo ? formatCurrency(loteSeleccionado.precio_costo) : 'N/A'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="mb-1 block text-sm text-gray-600">Valor Total:</span>
                                        <span className="text-lg font-medium">{formatCurrency(loteSeleccionado.valor_total)}</span>
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                    {loteSeleccionado.deleted_at ? (
                                        <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                                            <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                                                ✅ Este lote ha sido dado de baja
                                            </p>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={handleDarDeBaja}
                                            disabled={estaDandoDeBaja}
                                            variant="destructive"
                                            className="w-full"
                                        >
                                            {estaDandoDeBaja ? 'Dando de baja...' : '🗑️ Dar de baja este lote'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Diálogo de confirmación para dar de baja */}
                <AlertDialog open={!!loteParaBaja} onOpenChange={(open) => {
                    if (!open) setLoteParaBaja(null);
                }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>⚠️ Confirmar baja del lote</AlertDialogTitle>
                            <AlertDialogDescription>
                                ¿Estás seguro de que deseas dar de baja el lote <strong>{loteParaBaja?.lote}</strong> del producto <strong>{loteParaBaja?.producto.nombre}</strong>?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm text-gray-700 dark:text-gray-300">
                            <p><strong>Producto:</strong> {loteParaBaja?.producto.nombre}</p>
                            <p><strong>Lote:</strong> {loteParaBaja?.lote}</p>
                            <p><strong>Cantidad:</strong> {loteParaBaja?.cantidad}</p>
                            <p><strong>Estado:</strong> {loteParaBaja?.estado_vencimiento}</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async () => {
                                    if (!loteParaBaja) return;

                                    setEstaDandoDeBaja(true);
                                    try {
                                        const response = await fetch(`/compras/lotes-vencimientos/${loteParaBaja.id}/dar-de-baja`, {
                                            method: 'DELETE',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                                            },
                                        });

                                        if (response.ok) {
                                            const now = new Date().toISOString();
                                            lotes.data = lotes.data.map(l =>
                                                l.id === loteParaBaja.id
                                                    ? { ...l, deleted_at: now }
                                                    : l
                                            );
                                            showToast(`✅ Lote ${loteParaBaja.lote} dado de baja correctamente`, 'success');
                                            setLoteParaBaja(null);
                                        } else {
                                            const data = await response.json();
                                            showToast(data.message || 'Error al dar de baja el lote', 'error');
                                        }
                                    } catch (error) {
                                        console.error('Error al dar de baja el lote:', error);
                                        showToast('Error al dar de baja el lote', 'error');
                                    } finally {
                                        setEstaDandoDeBaja(false);
                                    }
                                }}
                                disabled={estaDandoDeBaja}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {estaDandoDeBaja ? 'Dando de baja...' : 'Confirmar baja'}
                            </AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Toast Container */}
                <ToastContainer toasts={toasts} onClose={closeToast} />
            </div>
        </AppLayout>
    );
};

export default GestionLotesVencimientos;
