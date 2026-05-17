import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import SearchSelect from '@/presentation/components/ui/search-select'; // ✅ NUEVO
import { Eye, CreditCard, AlertTriangle, Plus, ChevronDown, ChevronUp, Trash2, Printer, Calendar, AlertCircle, CheckCircle2, Clock, XCircle, CheckCheck, MoreVertical } from 'lucide-react';
import RegistrarPagoModal from '@/presentation/components/clientes/RegistrarPagoModal';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { toast } from 'react-toastify';

// Helper functions
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('es-BO');
};

interface Cliente {
    id: number;
    nombre: string;
    codigo_cliente: string;
}

interface Venta {
    id: number;
    numero: string;
    cliente?: Cliente;
}

interface Pago {
    id: number;
    monto: number;
    fecha_pago: string;
    tipo_pago?: { nombre: string };
    observaciones?: string;
    estado?: string; // ✅ NUEVO: Estado del pago
}

interface CuentaPorCobrar {
    id: number;
    venta_id: number;
    cliente_id: number;
    monto_original: number;
    saldo_pendiente: number;
    fecha_vencimiento: string;
    dias_vencido: number;
    estado: string;
    observaciones?: string;
    venta?: Venta;
    cliente?: Cliente; // ✅ NUEVO: Cliente directo para créditos manuales
    pagos?: Pago[];
}

interface FiltrosCuentasPorCobrar {
    estado?: string;
    cliente_id?: number | string;
    q?: string;
    fecha_vencimiento_desde?: string;
    fecha_vencimiento_hasta?: string;
    solo_vencidas?: boolean;
    per_page?: string | number;
    page?: number;
}

interface TipoPago {
    id: number;
    nombre: string;
    codigo: string;
}

interface CuentasPorCobrarIndexResponse {
    cuentas_por_cobrar: {
        data: CuentaPorCobrar[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filtros: FiltrosCuentasPorCobrar;
    estadisticas: {
        monto_total_pendiente: number;
        cuentas_vencidas: number;
        monto_total_vencido: number;
        total_mes: number;
        promedio_dias_pago: number;
    };
    datosParaFiltros: {
        clientes: Cliente[];
    };
    tipos_pago: TipoPago[];
}

interface Props extends InertiaPageProps {
    cuentasPorCobrar: CuentasPorCobrarIndexResponse;
}

const CuentasPorCobrarIndex: React.FC<Props> = ({ cuentasPorCobrar }) => {
    console.log('CuentasPorCobrarIndex props:', cuentasPorCobrar);
    // Inicializar hooks con valores por defecto seguros
    const filtrosDefault: FiltrosCuentasPorCobrar = {};
    const [filtros, setFiltros] = useState<FiltrosCuentasPorCobrar>(cuentasPorCobrar?.filtros || filtrosDefault);
    const [searchInput, setSearchInput] = useState<string>(cuentasPorCobrar?.filtros?.q || '');
    const [modalDetalle, setModalDetalle] = useState<{ isOpen: boolean; cuenta?: CuentaPorCobrar }>({ isOpen: false });

    // Estados para el modal de pago
    const [mostrarModalPago, setMostrarModalPago] = useState(false);
    const [cuentaSeleccionadaPago, setCuentaSeleccionadaPago] = useState<CuentaPorCobrar | null>(null);
    const [cuentasDelCliente, setCuentasDelCliente] = useState<any[]>([]);

    // Estados para expandir/contraer filas de pagos
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRowExpanded = (cuentaId: number) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(cuentaId)) {
            newExpandedRows.delete(cuentaId);
        } else {
            newExpandedRows.add(cuentaId);
        }
        setExpandedRows(newExpandedRows);
    };

    // ✅ NUEVO: Estado para controlar el menú popup
    const [menuAbiertoId, setMenuAbiertoId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // ✅ NUEVO: Cerrar menú al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuAbiertoId(null);
            }
        };

        if (menuAbiertoId !== null) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [menuAbiertoId]);

    // Estados para anular pagos
    const [pagoAAnular, setPagoAAnular] = useState<{ id: number; monto: number; cuenta_id: number } | null>(null);
    const [motivoAnulacion, setMotivoAnulacion] = useState('');
    const [anulandoPago, setAnulandoPago] = useState(false);

    // ✅ NUEVO: Estados para anular cuentas por cobrar
    const [cuentaAAnular, setCuentaAAnular] = useState<CuentaPorCobrar | null>(null);
    const [motivoCuentaAnulacion, setMotivoCuentaAnulacion] = useState('');
    const [anulandoCuenta, setAnulandoCuenta] = useState(false);

    // Estados para modal de impresión
    const [modalImpresionOpen, setModalImpresionOpen] = useState(false);
    const [cuentaAImprimir, setCuentaAImprimir] = useState<CuentaPorCobrar | null>(null);

    // Estados para modal de impresión de pago individual
    const [modalImpresionPagoOpen, setModalImpresionPagoOpen] = useState(false);
    const [pagoAImprimir, setPagoAImprimir] = useState<Pago | null>(null);

    // Estados para modal de editar fecha de vencimiento
    const [modalEditarFechaOpen, setModalEditarFechaOpen] = useState(false);
    const [cuentaEditarFecha, setCuentaEditarFecha] = useState<CuentaPorCobrar | null>(null);
    const [nuevaFechaVencimiento, setNuevaFechaVencimiento] = useState('');
    const [editandoFecha, setEditandoFecha] = useState(false);

    // ✅ Array de estados disponibles para filtrado (VENCIDO se calcula por fechas, no es un estado real)
    const estadosDisponibles = [
        { valor: 'PENDIENTE', etiqueta: 'Pendiente' },
        { valor: 'PAGADO', etiqueta: 'Pagado' },
        { valor: 'PARCIAL', etiqueta: 'Parcial' },
        { valor: 'ANULADO', etiqueta: 'Anulado' },
    ];

    // Validación defensiva para evitar errores si cuentasPorCobrar es undefined
    if (!cuentasPorCobrar || !cuentasPorCobrar.filtros) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cargando...</h2>
                        <p className="text-gray-600 dark:text-gray-400">Por favor espere mientras se cargan los datos.</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const handleFiltroChange = (field: keyof FiltrosCuentasPorCobrar, value: string | boolean) => {
        const nuevosFiltros = { ...filtros, [field]: value };
        setFiltros(nuevosFiltros);

        // Aplicar filtros inmediatamente
        router.get('/ventas/cuentas-por-cobrar', nuevosFiltros as Record<string, string | boolean | undefined>, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleBusqueda = () => {
        handleFiltroChange('q', searchInput);
    };

    const handleBusquedaEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleBusqueda();
        }
    };

    const limpiarFiltros = () => {
        const filtrosVacios: FiltrosCuentasPorCobrar = {};
        setFiltros(filtrosVacios);
        router.get('/ventas/cuentas-por-cobrar');
    };

    const handleAbrirModalPago = (cuenta: CuentaPorCobrar) => {
        // Cargar cuentas del cliente ANTES de abrir el modal
        cargarCuentasDelCliente(cuenta.cliente_id);

        // Esperar un tick para asegurar que cuentasDelCliente se actualice antes de abrir
        setTimeout(() => {
            setCuentaSeleccionadaPago(cuenta);
            setMostrarModalPago(true);
            console.log('✅ Modal abierto con cuenta preseleccionada:', {
                cuenta_id: cuenta.id,
                cliente_id: cuenta.cliente_id,
                saldo: cuenta.saldo_pendiente
            });
        }, 50);
    };

    const cargarCuentasDelCliente = async (clienteId?: number) => {
        if (!clienteId) return;
        try {
            // Filtrar cuentas pendientes del cliente actual de los datos que ya tenemos
            // Incluir todas las cuentas del cliente, no solo las pendientes
            const cuentasPendientes = cuentasPorCobrar.cuentas_por_cobrar.data.filter(
                (c) => c.cliente_id === clienteId
            );
            const cuentasFormateadas = cuentasPendientes.map((c) => ({
                id: c.id,
                venta_id: c.venta_id,
                numero_venta: c.venta?.numero || `#${c.venta_id}`,
                referencia_documento: (c as any).referencia_documento || '',
                fecha_venta: c.venta?.numero || '',
                monto_original: c.monto_original,
                saldo_pendiente: c.saldo_pendiente,
                fecha_vencimiento: c.fecha_vencimiento,
                dias_vencido: c.dias_vencido,
                estado: c.estado,
            }));
            setCuentasDelCliente(cuentasFormateadas);
            console.log('✅ Cuentas cargadas para cliente:', { clienteId, cantidad: cuentasFormateadas.length, cuentas: cuentasFormateadas });
        } catch (error) {
            console.error('Error cargando cuentas del cliente:', error);
        }
    };

    const handlePagoRegistrado = () => {
        // Recargar la página para actualizar los datos
        router.get('/ventas/cuentas-por-cobrar');
    };

    const handleAnularPago = async () => {
        if (!pagoAAnular) return;

        try {
            setAnulandoPago(true);
            const response = await fetch(`/ventas/cuentas-por-cobrar/${pagoAAnular.cuenta_id}/anular-pago/${pagoAAnular.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    motivo: motivoAnulacion,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`✅ Pago de ${formatCurrency(pagoAAnular.monto)} anulado exitosamente`);
                setPagoAAnular(null);
                setMotivoAnulacion('');
                router.get('/ventas/cuentas-por-cobrar');
            } else {
                toast.error(data.message || 'Error al anular el pago');
            }
        } catch (error) {
            console.error('Error anulando pago:', error);
            toast.error('Error al anular el pago');
        } finally {
            setAnulandoPago(false);
        }
    };

    // ✅ NUEVO: Anular cuenta por cobrar completa
    const handleAnularCuenta = async () => {
        if (!cuentaAAnular) return;

        try {
            setAnulandoCuenta(true);
            const response = await fetch(`/ventas/cuentas-por-cobrar/${cuentaAAnular.id}/anular`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    motivo: motivoCuentaAnulacion,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`✅ Cuenta por cobrar #${cuentaAAnular.id} anulada exitosamente (Monto: ${formatCurrency(cuentaAAnular.saldo_pendiente)})`);
                setCuentaAAnular(null);
                setMotivoCuentaAnulacion('');
                router.get('/ventas/cuentas-por-cobrar');
            } else {
                toast.error(data.message || 'Error al anular la cuenta');
            }
        } catch (error) {
            console.error('Error anulando cuenta:', error);
            toast.error('Error al anular la cuenta');
        } finally {
            setAnulandoCuenta(false);
        }
    };

    // ✅ NUEVO: Guardar nueva fecha de vencimiento
    const handleGuardarFechaVencimiento = async () => {
        if (!cuentaEditarFecha || !nuevaFechaVencimiento) return;

        try {
            setEditandoFecha(true);
            const response = await fetch(`/ventas/cuentas-por-cobrar/${cuentaEditarFecha.id}/actualizar-fecha-vencimiento`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    fecha_vencimiento: nuevaFechaVencimiento,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`✅ Fecha de vencimiento actualizada a ${new Date(nuevaFechaVencimiento).toLocaleDateString('es-BO')}`);
                setModalEditarFechaOpen(false);
                setCuentaEditarFecha(null);
                setNuevaFechaVencimiento('');
                router.get('/ventas/cuentas-por-cobrar');
            } else {
                toast.error(data.message || 'Error al actualizar la fecha');
            }
        } catch (error) {
            console.error('Error actualizando fecha:', error);
            toast.error('Error al actualizar la fecha de vencimiento');
        } finally {
            setEditandoFecha(false);
        }
    };

    // ✅ MEJORADO: Función para obtener color y icono del estado de la cuenta
    const getEstadoBadgeInfo = (estado: string) => {
        // Normalizar a mayúscula para comparación
        const estadoNormalizado = (estado || '').toUpperCase().trim();

        const estadoMap = {
            'PENDIENTE': {
                variant: 'default' as const,
                bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                textColor: 'text-blue-800 dark:text-blue-200',
                borderColor: 'border-blue-300 dark:border-blue-700',
                icon: Clock,
                label: 'Pendiente'
            },
            'PAGADO': {
                variant: 'default' as const,
                bgColor: 'bg-green-100 dark:bg-green-900/30',
                textColor: 'text-green-800 dark:text-green-200',
                borderColor: 'border-green-300 dark:border-green-700',
                icon: CheckCircle2,
                label: 'Pagado'
            },
            'PARCIAL': {
                variant: 'default' as const,
                bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                textColor: 'text-amber-800 dark:text-amber-200',
                borderColor: 'border-amber-300 dark:border-amber-700',
                icon: Clock,
                label: 'Parcial'
            },
            'ANULADO': {
                variant: 'destructive' as const,
                bgColor: 'bg-red-100 dark:bg-red-900/30',
                textColor: 'text-red-800 dark:text-red-200',
                borderColor: 'border-red-300 dark:border-red-700',
                icon: XCircle,
                label: 'Anulado'
            }
        };
        return estadoMap[estadoNormalizado as keyof typeof estadoMap] || estadoMap['PENDIENTE'];
    };

    // ✅ Componente para renderizar Badge con icono mejorado
    const EstadoBadgeComponent = ({ estado }: { estado: string }) => {
        const info = getEstadoBadgeInfo(estado);
        const IconComponent = info.icon;
        // Mostrar el estado en mayúscula
        const estadoDisplay = (estado || '').toUpperCase();

        return (
            <span className={`inline-flex items-center gap-2 px-2 py-1 mb-1 font-medium text-sm ${info.bgColor} ${info.textColor} ${info.borderColor}`}>
                <IconComponent className="w-4 h-4" />
                <span>{estadoDisplay}</span>
            </span>
        );
    };

    // ✅ MEJORADO: Función para obtener color y icono de urgencia según días vencido
    const getUrgenciaInfo = (diasVencido: number) => {
        if (diasVencido > 30) {
            return {
                variant: 'destructive' as const,
                bgColor: 'bg-red-100 dark:bg-red-900/30',
                textColor: 'text-red-800 dark:text-red-200',
                borderColor: 'border-red-300 dark:border-red-700',
                icon: AlertTriangle,
                label: `${diasVencido} días vencido`
            };
        }
        if (diasVencido > 15) {
            return {
                variant: 'default' as const,
                bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                textColor: 'text-amber-800 dark:text-amber-200',
                borderColor: 'border-amber-300 dark:border-amber-700',
                icon: AlertCircle,
                label: `${diasVencido} días`
            };
        }
        if (diasVencido > 0) {
            return {
                variant: 'default' as const,
                bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
                textColor: 'text-yellow-800 dark:text-yellow-200',
                borderColor: 'border-yellow-300 dark:border-yellow-700',
                icon: Clock,
                label: `${diasVencido} días`
            };
        }
        return {
            variant: 'default' as const,
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            textColor: 'text-green-800 dark:text-green-200',
            borderColor: 'border-green-300 dark:border-green-700',
            icon: CheckCircle2,
            label: 'Al día'
        };
    };

    // ✅ Componente para renderizar Badge de urgencia
    const UrgenciaBadgeComponent = ({ diasVencido }: { diasVencido: number }) => {
        const info = getUrgenciaInfo(diasVencido);
        const IconComponent = info.icon;

        return (
            <span className={`inline-flex items-center gap-2 px-2 py-1 text-sm font-medium ${info.bgColor} ${info.textColor} ${info.borderColor}`}>
                <IconComponent className="w-4 h-4" />
                <span>{info.label}</span>
            </span>
        );
    };

    const getUrgenciaBadge = (diasVencido: number) => {
        if (diasVencido > 30) return 'destructive';
        if (diasVencido > 15) return 'secondary';
        if (diasVencido > 0) return 'default';
        return 'outline';
    };

    // ✅ MEJORADO: Función para mostrar el estado del pago con iconos
    const getEstadoPagoBadgeInfo = (estado?: string) => {
        if (!estado) return null;

        const estadoMap = {
            'CONFIRMADO': {
                bgColor: 'bg-green-100 dark:bg-green-900/30',
                textColor: 'text-green-800 dark:text-green-200',
                borderColor: 'border-green-300 dark:border-green-700',
                icon: CheckCheck,
                label: 'Confirmado'
            },
            'PENDIENTE': {
                bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                textColor: 'text-blue-800 dark:text-blue-200',
                borderColor: 'border-blue-300 dark:border-blue-700',
                icon: Clock,
                label: 'Pendiente'
            },
            'ANULADO': {
                bgColor: 'bg-red-100 dark:bg-red-900/30',
                textColor: 'text-red-800 dark:text-red-200',
                borderColor: 'border-red-300 dark:border-red-700',
                icon: XCircle,
                label: 'Anulado'
            },
            'RECHAZADO': {
                bgColor: 'bg-red-100 dark:bg-red-900/30',
                textColor: 'text-red-800 dark:text-red-200',
                borderColor: 'border-red-300 dark:border-red-700',
                icon: XCircle,
                label: 'Rechazado'
            },
            'PROCESANDO': {
                bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                textColor: 'text-amber-800 dark:text-amber-200',
                borderColor: 'border-amber-300 dark:border-amber-700',
                icon: Clock,
                label: 'Procesando'
            }
        };
        return estadoMap[estado as keyof typeof estadoMap] || null;
    };

    // ✅ Componente para renderizar Badge de pago con icono
    const EstadoPagoBadgeComponent = ({ estado }: { estado?: string }) => {
        if (!estado) return null;
        const info = getEstadoPagoBadgeInfo(estado);
        if (!info) return <Badge variant="outline">{estado}</Badge>;

        const IconComponent = info.icon;

        return (
            <span className={`inline-flex items-center gap-2 px-1 py-1 rounded-full border ${info.bgColor} ${info.textColor} ${info.borderColor}`}>
                <IconComponent className="w-4 h-4" />
                <span>{estado}</span>
            </span>
        );
    };

    // ✅ NUEVO: Función para obtener color de fila según días vencido
    const getRowColorClass = (diasVencido: number, estado: string) => {
        // Normalizar estado a mayúscula
        const estadoNormalizado = (estado || '').toUpperCase().trim();

        // Si está pagado, color verde
        if (estadoNormalizado === 'PAGADO') {
            return 'bg-green-50 dark:bg-green-950/10 border-l-4 border-l-green-500 hover:bg-green-100 dark:hover:bg-green-950/20';
        }

        // Si está anulado, color gris
        if (estadoNormalizado === 'ANULADO') {
            return 'bg-gray-50 dark:bg-gray-950/20 border-l-4 border-l-gray-400 hover:bg-gray-100 dark:hover:bg-gray-950/30';
        }

        // Si está vencido por más de 30 días - CRÍTICO
        if (diasVencido > 30) {
            return 'bg-red-50 dark:bg-red-950/20 border-l-4 border-l-red-600 hover:bg-red-100 dark:hover:bg-red-950/30 shadow-md';
        }

        // Si está vencido por 15-30 días - ALTO
        if (diasVencido > 15) {
            return 'bg-orange-50 dark:bg-orange-950/20 border-l-4 border-l-orange-500 hover:bg-orange-100 dark:hover:bg-orange-950/30';
        }

        // Si está vencido por 1-15 días - MEDIO
        if (diasVencido > 0) {
            return 'bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-l-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-950/30';
        }

        // Si está al día - NORMAL
        return 'bg-blue-50 dark:bg-blue-950/10 border-l-4 border-l-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/20';
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Ventas', href: '/ventas' },
            { title: 'Cuentas por Cobrar', href: '/ventas/cuentas-por-cobrar' }
        ]}>
            <Head title="Cuentas por Cobrar" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cuentas por Cobrar</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gestión de deudas de clientes</p>
                    </div>
                    <Button
                        onClick={() => router.visit('/admin/creditos/crear')}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Crear Crédito Manual
                    </Button>
                </div>

                {/* Estadísticas Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-1">
                            <div className="flex items-center">
                                <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pendiente</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(cuentasPorCobrar.estadisticas.monto_total_pendiente)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-1">
                            <div className="flex items-center">
                                <div className="p-1 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vencidas</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatCurrency(cuentasPorCobrar.estadisticas.monto_total_vencido)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-1">
                            <div className="flex items-center">
                                <div className="p-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cuentas Vencidas</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {cuentasPorCobrar.estadisticas.cuentas_vencidas}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-1">
                            <div className="flex items-center">
                                <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Promedio Días</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {cuentasPorCobrar.estadisticas.promedio_dias_pago}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card>
                    <CardContent className="p-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* ✅ ACTUALIZADO: SearchSelect para cliente */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cliente</label>
                                <SearchSelect
                                    id="cliente"
                                    label="Cliente"
                                    placeholder="Seleccione un cliente"
                                    value={filtros.cliente_id || ''}
                                    options={cuentasPorCobrar.datosParaFiltros.clientes.map((cliente) => ({
                                        value: cliente.id,
                                        label: cliente.nombre,
                                        description: cliente.codigo_cliente
                                    }))}
                                    onChange={(value) => handleFiltroChange('cliente_id', value)}
                                    allowClear={true}
                                    emptyText="No se encontraron clientes"
                                    searchPlaceholder="Buscar clientes..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Buscar</label>
                                <Input
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyPress={handleBusquedaEnter}
                                    placeholder="ID cuenta, ID venta, referencia, número, cliente, usuario..."
                                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Presiona <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">Enter</kbd> para buscar rápidamente
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Estado</label>
                                <div className="flex flex-wrap gap-2">
                                    {/* Opción: Todos */}
                                    <button
                                        onClick={() => handleFiltroChange('estado', '')}
                                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${!filtros.estado
                                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white ring-2 ring-gray-400'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        Todos
                                    </button>

                                    {/* Opciones de estados */}
                                    {estadosDisponibles.map((estado) => {
                                        const info = getEstadoBadgeInfo(estado.valor);
                                        return (
                                            <button
                                                key={estado.valor}
                                                onClick={() => handleFiltroChange('estado', estado.valor)}
                                                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all border-2 ${filtros.estado === estado.valor
                                                    ? `${info.bgColor} ${info.textColor} ${info.borderColor} ring-2 ring-offset-1 dark:ring-offset-0`
                                                    : `${info.bgColor} ${info.textColor} ${info.borderColor} hover:opacity-80`
                                                    }`}
                                            >
                                                {estado.etiqueta}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Rango de Fechas de Vencimiento */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Rango de Fecha de Vencimiento
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/30">
                                {/* Fecha Desde */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                        Desde
                                    </label>
                                    <Input
                                        type="date"
                                        value={filtros.fecha_vencimiento_desde || ''}
                                        onChange={(e) => handleFiltroChange('fecha_vencimiento_desde', e.target.value)}
                                        placeholder="Selecciona fecha inicial"
                                        className="bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white border-blue-300 dark:border-blue-900 focus:ring-blue-500"
                                    />
                                    {filtros.fecha_vencimiento_desde && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            A partir de {new Date(filtros.fecha_vencimiento_desde).toLocaleDateString('es-BO')}
                                        </p>
                                    )}
                                </div>

                                {/* Fecha Hasta */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                        Hasta
                                    </label>
                                    <Input
                                        type="date"
                                        value={filtros.fecha_vencimiento_hasta || ''}
                                        onChange={(e) => handleFiltroChange('fecha_vencimiento_hasta', e.target.value)}
                                        placeholder="Selecciona fecha final"
                                        className="bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white border-green-300 dark:border-green-900 focus:ring-green-500"
                                    />
                                    {filtros.fecha_vencimiento_hasta && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Hasta {new Date(filtros.fecha_vencimiento_hasta).toLocaleDateString('es-BO')}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Filtro: Solo Vencidas - Card Interactivo */}
                            <div
                                onClick={() => handleFiltroChange('solo_vencidas', !filtros.solo_vencidas)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${filtros.solo_vencidas
                                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 hover:border-red-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${filtros.solo_vencidas
                                            ? 'bg-red-500 border-red-500'
                                            : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                    >
                                        {filtros.solo_vencidas && (
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                            🚨 Mostrar solo vencidas
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Filtra cuentas con fecha vencimiento anterior a hoy
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Indicador de rango activo */}
                            {filtros.fecha_vencimiento_desde && filtros.fecha_vencimiento_hasta && (
                                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm text-green-700 dark:text-green-300">
                                        Filtrando: {new Date(filtros.fecha_vencimiento_desde).toLocaleDateString('es-BO')} → {new Date(filtros.fecha_vencimiento_hasta).toLocaleDateString('es-BO')}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between gap-3 mt-6">
                            <Button
                                onClick={limpiarFiltros}
                                variant="outline"
                            >
                                🔄 Limpiar Filtros
                            </Button>
                            <Button
                                onClick={handleBusqueda}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                            >
                                🔍 Buscar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de Cuentas por Cobrar */}
                <Card>
                    <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                                <tr>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Venta
                                    </th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Monto Original
                                    </th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Creación
                                    </th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Vencimiento
                                    </th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Días Retraso
                                    </th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {cuentasPorCobrar.cuentas_por_cobrar.data.map((cuenta) => (
                                    <React.Fragment key={cuenta.id}>
                                        <tr className={`${getRowColorClass(cuenta.dias_vencido, cuenta.estado)} transition-colors duration-200`}>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    <p>Folio CxC:  #{cuenta.id}</p>
                                                    {cuenta.venta && (
                                                        <p>Folio Venta: {cuenta.venta?.id}</p>
                                                    )}
                                                    <p>{cuenta?.referencia_documento}</p>
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {/* ✅ CORREGIDO: Mostrar cliente directo o cliente de venta */}
                                                    {cuenta.cliente?.nombre || cuenta.venta?.cliente?.nombre || 'Sin cliente'}
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Mnt. Org.: {formatCurrency(cuenta.monto_original)}
                                                </p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Saldo: {formatCurrency(cuenta.saldo_pendiente)}
                                                </p>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {formatDate(cuenta.created_at)}
                                                </p>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {formatDate(cuenta.fecha_vencimiento)}
                                                </p>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-xs">
                                                    <UrgenciaBadgeComponent diasVencido={cuenta.dias_vencido} />
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-xs">
                                                    <EstadoBadgeComponent estado={cuenta.estado} />
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-1">
                                                    {cuenta.estado !== 'PAGADO' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleAbrirModalPago(cuenta)}
                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                        >
                                                            Cobrar 💵
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setCuentaAImprimir(cuenta);
                                                            setModalImpresionOpen(true);
                                                        }}
                                                        title="Imprimir"
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </Button>
                                                    {cuenta.pagos && cuenta.pagos.length > 0 && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => toggleRowExpanded(cuenta.id)}
                                                            title={expandedRows.has(cuenta.id) ? 'Ocultar pagos' : 'Mostrar pagos'}
                                                        >
                                                            {expandedRows.has(cuenta.id) ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                    )}

                                                    {/* ✅ NUEVO: Menú popup con opciones adicionales */}
                                                    <div className="relative" ref={menuAbiertoId === cuenta.id ? menuRef : null}>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setMenuAbiertoId(menuAbiertoId === cuenta.id ? null : cuenta.id)}
                                                            title="Más opciones"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>

                                                        {/* Menú Popup */}
                                                        {menuAbiertoId === cuenta.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                                                                <div className="py-1">
                                                                    {/* Opción: Ver Detalles */}
                                                                    <button
                                                                        onClick={() => {
                                                                            setModalDetalle({ isOpen: true, cuenta });
                                                                            setMenuAbiertoId(null);
                                                                        }}
                                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                        Ver Detalles
                                                                    </button>

                                                                    {/* Opción: Cambiar Fecha */}
                                                                    <button
                                                                        onClick={() => {
                                                                            setCuentaEditarFecha(cuenta);
                                                                            setNuevaFechaVencimiento(cuenta.fecha_vencimiento);
                                                                            setModalEditarFechaOpen(true);
                                                                            setMenuAbiertoId(null);
                                                                        }}
                                                                        className="w-full text-left px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center gap-2"
                                                                    >
                                                                        <Calendar className="w-4 h-4" />
                                                                        Cambiar Fecha Vencimiento
                                                                    </button>

                                                                    {/* Opción: Anular - Condicional */}
                                                                    {cuenta.estado !== 'ANULADO' && (
                                                                        <button
                                                                            onClick={() => {
                                                                                setCuentaAAnular(cuenta);
                                                                                setMenuAbiertoId(null);
                                                                            }}
                                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700"
                                                                        >
                                                                            <XCircle className="w-4 h-4" />
                                                                            Anular Cuenta
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedRows.has(cuenta.id) && cuenta.pagos && cuenta.pagos.length > 0 && (
                                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                                                <td colSpan={10} className="px-6 py-4">
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Historial de Cobros</h4>
                                                        <div className="space-y-2">
                                                            {cuenta.pagos.map((pago) => (
                                                                <div
                                                                    key={pago.id}
                                                                    className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                                                                >
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <p>Folio: {pago.id} | </p>
                                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                                {formatCurrency(pago.monto)}
                                                                            </p>
                                                                            {/* ✅ MEJORADO: Mostrar estado del pago con icono */}
                                                                            <EstadoPagoBadgeComponent estado={pago.estado} />
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            {formatDate(pago.fecha_pago)} - {pago.tipo_pago?.nombre || 'Sin tipo'}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        {pago.observaciones && (
                                                                            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                                                {pago.observaciones}
                                                                            </p>
                                                                        )}
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() => {
                                                                                setPagoAImprimir(pago);
                                                                                setModalImpresionPagoOpen(true);
                                                                            }}
                                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                            title="Imprimir pago"
                                                                        >
                                                                            <Printer className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() => setPagoAAnular({ id: pago.id, monto: pago.monto, cuenta_id: cuenta.id })}
                                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                            title=""
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {cuentasPorCobrar.cuentas_por_cobrar.data.length === 0 && (
                        <div className="text-center py-12">
                            <CreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay cuentas por cobrar</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No se encontraron cuentas con los filtros aplicados.</p>
                        </div>
                    )}

                    {/* ✅ NUEVO: Componente de Paginación */}
                    {cuentasPorCobrar.cuentas_por_cobrar.data.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
                            {/* Info de Paginación */}
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Mostrando{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {(cuentasPorCobrar.cuentas_por_cobrar.current_page - 1) *
                                        cuentasPorCobrar.cuentas_por_cobrar.per_page +
                                        1}
                                </span>
                                {' '}a{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {Math.min(
                                        cuentasPorCobrar.cuentas_por_cobrar.current_page *
                                        cuentasPorCobrar.cuentas_por_cobrar.per_page,
                                        cuentasPorCobrar.cuentas_por_cobrar.total
                                    )}
                                </span>
                                {' '}de{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {cuentasPorCobrar.cuentas_por_cobrar.total}
                                </span>
                                {' '}cuentas
                            </div>

                            {/* Selector de Registros por Página */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600 dark:text-gray-400">Por página:</label>
                                <select
                                    value={filtros.per_page || cuentasPorCobrar.cuentas_por_cobrar.per_page}
                                    onChange={(e) => handleFiltroChange('per_page', e.target.value)}
                                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white text-sm"
                                >
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="250">250</option>
                                </select>
                            </div>

                            {/* Botones de Paginación */}
                            <div className="flex items-center gap-1">
                                {/* Primera Página */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={cuentasPorCobrar.cuentas_por_cobrar.current_page === 1}
                                    onClick={() => router.get('/ventas/cuentas-por-cobrar',
                                        { ...filtros, page: 1 },
                                        { preserveScroll: true })}
                                >
                                    {'<<'}
                                </Button>

                                {/* Anterior */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={cuentasPorCobrar.cuentas_por_cobrar.current_page === 1}
                                    onClick={() => router.get('/ventas/cuentas-por-cobrar',
                                        { ...filtros, page: cuentasPorCobrar.cuentas_por_cobrar.current_page - 1 },
                                        { preserveScroll: true })}
                                >
                                    {'<'}
                                </Button>

                                {/* Números de Página */}
                                <div className="flex items-center gap-1">
                                    {Array.from(
                                        {
                                            length: Math.min(
                                                5,
                                                cuentasPorCobrar.cuentas_por_cobrar.last_page
                                            ),
                                        },
                                        (_, i) => {
                                            const currentPage =
                                                cuentasPorCobrar.cuentas_por_cobrar.current_page;
                                            const lastPage =
                                                cuentasPorCobrar.cuentas_por_cobrar.last_page;
                                            let pageNum;

                                            if (lastPage <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= lastPage - 2) {
                                                pageNum = lastPage - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return pageNum;
                                        }
                                    ).map((pageNum) => (
                                        <Button
                                            key={pageNum}
                                            variant={
                                                pageNum ===
                                                    cuentasPorCobrar.cuentas_por_cobrar
                                                        .current_page
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    '/ventas/cuentas-por-cobrar',
                                                    { ...filtros, page: pageNum },
                                                    { preserveScroll: true }
                                                )
                                            }
                                        >
                                            {pageNum}
                                        </Button>
                                    ))}
                                </div>

                                {/* Siguiente */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        cuentasPorCobrar.cuentas_por_cobrar.current_page ===
                                        cuentasPorCobrar.cuentas_por_cobrar.last_page
                                    }
                                    onClick={() => router.get('/ventas/cuentas-por-cobrar',
                                        { ...filtros, page: cuentasPorCobrar.cuentas_por_cobrar.current_page + 1 },
                                        { preserveScroll: true })}
                                >
                                    {'>'}
                                </Button>

                                {/* Última Página */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        cuentasPorCobrar.cuentas_por_cobrar.current_page ===
                                        cuentasPorCobrar.cuentas_por_cobrar.last_page
                                    }
                                    onClick={() => router.get('/ventas/cuentas-por-cobrar',
                                        { ...filtros, page: cuentasPorCobrar.cuentas_por_cobrar.last_page },
                                        { preserveScroll: true })}
                                >
                                    {'>>'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Modal de Detalle */}
                <Dialog
                    open={modalDetalle.isOpen}
                    onOpenChange={() => setModalDetalle({ isOpen: false })}
                >
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Detalle de Cuenta por Cobrar</DialogTitle>
                        </DialogHeader>
                        {modalDetalle.cuenta && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Venta</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {modalDetalle.cuenta.venta?.numero || `#${modalDetalle.cuenta.venta_id}`}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cliente</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {/* ✅ CORREGIDO: Mostrar cliente directo o cliente de venta */}
                                            {modalDetalle.cuenta.cliente?.nombre || modalDetalle.cuenta.venta?.cliente?.nombre || 'Sin cliente'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto Original</label>
                                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(modalDetalle.cuenta.monto_original)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Saldo Pendiente</label>
                                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(modalDetalle.cuenta.saldo_pendiente)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Vencimiento</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {formatDate(modalDetalle.cuenta.fecha_vencimiento)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                                        <EstadoBadgeComponent estado={modalDetalle.cuenta.estado} />
                                    </div>
                                </div>

                                {modalDetalle.cuenta.observaciones && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {modalDetalle.cuenta.observaciones}
                                        </p>
                                    </div>
                                )}

                                {modalDetalle.cuenta.pagos && modalDetalle.cuenta.pagos.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Historial de Cobros</label>
                                        <div className="space-y-2">
                                            {modalDetalle.cuenta.pagos.map((pago) => (
                                                <div key={pago.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {formatCurrency(pago.monto)}
                                                            </p>
                                                            {/* ✅ MEJORADO: Mostrar estado del pago con icono */}
                                                            <EstadoPagoBadgeComponent estado={pago.estado} />
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {formatDate(pago.fecha_pago)} - {pago.tipo_pago?.nombre}
                                                        </p>
                                                    </div>
                                                    {pago.observaciones && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                            {pago.observaciones}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setModalDetalle({ isOpen: false })}
                                    >
                                        Cerrar
                                    </Button>
                                    {modalDetalle.cuenta.estado !== 'PAGADO' && (
                                        <Button
                                            onClick={() => {
                                                setModalDetalle({ isOpen: false });
                                                handleAbrirModalPago(modalDetalle.cuenta!);
                                            }}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Registrar Cobro
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Modal para Registrar Pago */}
                <RegistrarPagoModal
                    show={mostrarModalPago}
                    onHide={() => {
                        setMostrarModalPago(false);
                        setCuentaSeleccionadaPago(null);
                    }}
                    clienteId={cuentaSeleccionadaPago?.cliente_id || 0}
                    cuentasPendientes={cuentasDelCliente}
                    onPagoRegistrado={handlePagoRegistrado}
                    cuentaIdPreseleccionada={cuentaSeleccionadaPago?.id}
                    tipo="ventas"
                    tipos_pago={cuentasPorCobrar?.tipos_pago || []}
                />

                {/* Modal de confirmación para anular pago */}
                {pagoAAnular && (
                    <Dialog open={!!pagoAAnular} onOpenChange={() => {
                        setPagoAAnular(null);
                        setMotivoAnulacion('');
                    }}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-red-600">
                                    ⚠️ Anular Pago
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Alert variant="destructive" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription className="text-red-800 dark:text-red-200">
                                        ¿Está seguro de que desea anular este pago de <strong>{formatCurrency(pagoAAnular.monto)}</strong>?
                                        <p className="text-xs mt-2">
                                            Esta acción no puede deshacerse. Se revertirán todos los movimientos asociados.
                                        </p>
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                                        Motivo de anulación (opcional)
                                    </label>
                                    <textarea
                                        value={motivoAnulacion}
                                        onChange={(e) => setMotivoAnulacion(e.target.value)}
                                        placeholder="Ej: Pago registrado erróneamente, cliente no confirma..."
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
                                        rows={3}
                                        disabled={anulandoPago}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setPagoAAnular(null);
                                        setMotivoAnulacion('');
                                    }}
                                    disabled={anulandoPago}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleAnularPago}
                                    disabled={anulandoPago}
                                    className="flex-1"
                                >
                                    {anulandoPago ? '⏳ Anulando...' : '❌ Anular Pago'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}

                {/* ✅ NUEVO: Modal de confirmación para anular cuenta por cobrar */}
                {cuentaAAnular && (
                    <Dialog open={!!cuentaAAnular} onOpenChange={() => {
                        setCuentaAAnular(null);
                        setMotivoCuentaAnulacion('');
                    }}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-red-600">
                                    ⚠️ Anular Cuenta por Cobrar
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Alert variant="destructive" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription className="text-red-800 dark:text-red-200">
                                        ¿Está seguro de que desea anular esta cuenta por cobrar?
                                        <div className="mt-2 space-y-1 text-sm">
                                            <p><strong>Folio:</strong> #{cuentaAAnular.id}</p>
                                            <p><strong>Cliente:</strong> {cuentaAAnular.cliente?.nombre}</p>
                                            <p><strong>Monto a anular:</strong> {formatCurrency(cuentaAAnular.saldo_pendiente)}</p>
                                            <p className="text-xs mt-2">
                                                Esta acción no puede deshacerse. Se revertirán todos los movimientos asociados.
                                            </p>
                                        </div>
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                                        Motivo de anulación (obligatorio)
                                    </label>
                                    <textarea
                                        value={motivoCuentaAnulacion}
                                        onChange={(e) => setMotivoCuentaAnulacion(e.target.value)}
                                        placeholder="Ej: Crédito no cobrable, acuerdo con cliente, producto dañado..."
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
                                        rows={3}
                                        disabled={anulandoCuenta}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setCuentaAAnular(null);
                                        setMotivoCuentaAnulacion('');
                                    }}
                                    disabled={anulandoCuenta}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleAnularCuenta}
                                    disabled={anulandoCuenta || !motivoCuentaAnulacion.trim()}
                                    className="flex-1"
                                >
                                    {anulandoCuenta ? '⏳ Anulando...' : '❌ Anular Cuenta'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Modal de Impresión - Cuenta por Cobrar */}
                {cuentaAImprimir && (
                    <OutputSelectionModal
                        isOpen={modalImpresionOpen}
                        onClose={() => {
                            setModalImpresionOpen(false);
                            setCuentaAImprimir(null);
                        }}
                        documentoId={cuentaAImprimir.id}
                        tipoDocumento="cuenta-por-cobrar"
                        documentoInfo={{
                            numero: `Cuenta #${cuentaAImprimir.id}`,
                            fecha: formatDate(cuentaAImprimir.fecha_vencimiento),
                            monto: cuentaAImprimir.saldo_pendiente,
                        }}
                    />
                )}

                {/* Modal de Impresión - Pago Individual */}
                {pagoAImprimir && (
                    <OutputSelectionModal
                        isOpen={modalImpresionPagoOpen}
                        onClose={() => {
                            setModalImpresionPagoOpen(false);
                            setPagoAImprimir(null);
                        }}
                        documentoId={pagoAImprimir.id}
                        tipoDocumento="pago"
                        documentoInfo={{
                            numero: `Pago #${pagoAImprimir.id}`,
                            fecha: formatDate(pagoAImprimir.fecha_pago),
                            monto: pagoAImprimir.monto,
                        }}
                    />
                )}

                {/* Modal para Editar Fecha de Vencimiento */}
                <Dialog open={modalEditarFechaOpen} onOpenChange={setModalEditarFechaOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                                📅 Editar Fecha de Vencimiento
                            </DialogTitle>
                        </DialogHeader>

                        {cuentaEditarFecha && (
                            <div className="space-y-6 py-4">
                                {/* Info de la cuenta */}
                                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/30">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Cuenta por Cobrar</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        #{cuentaEditarFecha.id}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                        Cliente: <span className="font-semibold">{cuentaEditarFecha.cliente?.nombre || cuentaEditarFecha.venta?.cliente?.nombre || 'Sin cliente'}</span>
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Saldo: <span className="font-semibold text-amber-600">{formatCurrency(cuentaEditarFecha.saldo_pendiente)}</span>
                                    </p>
                                </div>

                                {/* Fecha actual */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-400">
                                        Fecha Vencimiento Actual
                                    </label>
                                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {new Date(cuentaEditarFecha.fecha_vencimiento).toLocaleDateString('es-BO')}
                                        </p>
                                    </div>
                                </div>

                                {/* Nueva fecha */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Nueva Fecha de Vencimiento
                                    </label>
                                    <Input
                                        type="date"
                                        value={nuevaFechaVencimiento}
                                        onChange={(e) => setNuevaFechaVencimiento(e.target.value)}
                                        className="bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {nuevaFechaVencimiento && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Nueva fecha: {new Date(nuevaFechaVencimiento).toLocaleDateString('es-BO')}
                                        </p>
                                    )}
                                </div>

                                {/* Alerta */}
                                <div className="flex gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700 dark:text-amber-300">
                                        Al cambiar la fecha, se recalcularán automáticamente los días vencidos.
                                    </p>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setModalEditarFechaOpen(false);
                                    setCuentaEditarFecha(null);
                                    setNuevaFechaVencimiento('');
                                }}
                                disabled={editandoFecha}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleGuardarFechaVencimiento}
                                disabled={!nuevaFechaVencimiento || editandoFecha}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {editandoFecha ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default CuentasPorCobrarIndex;
