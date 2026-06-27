import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { useToastNotifications } from '@/application/hooks/use-toast-notifications';

interface StockItem {
    id: number;
    prestable_id: number;
    prestable_nombre: string;
    prestable_codigo: string;
    prestable_tipo: string;
    prestable_capacidad?: number;
    almacen_nombre: string;
    almacen_tipo: string;
    cantidad_disponible: number;
    cantidad_cliente_deudor?: number;
    cantidad_cliente_devuelto?: number;
    cantidad_cliente_dañada?: number;
    cantidad_evento_deudor?: number;
    cantidad_evento_devuelto?: number;
    cantidad_evento_dañada?: number;
    cantidad_proveedor_acreedor?: number;
    cantidad_proveedor_devuelto?: number;
    cantidad_proveedor_dañada?: number;
}

interface PrestableDetails {
    id: number;
    nombre: string;
    capacidad: number;
    embases_relacionados?: any[];
}

interface EmbaseData {
    id: number;
    prestable_id: number;
    prestable_nombre: string;
    prestable_codigo: string;
    cantidad_disponible: number;
    cantidad_cliente_deudor?: number;
    cantidad_cliente_devuelto?: number;
    cantidad_cliente_dañada?: number;
    cantidad_evento_deudor?: number;
    cantidad_evento_devuelto?: number;
    cantidad_evento_dañada?: number;
    cantidad_proveedor_acreedor?: number;
    cantidad_proveedor_devuelto?: number;
    cantidad_proveedor_dañada?: number;
}

interface AjustePageProps {
    prestable_id: number;
    almacen_id: number;
    tipo: 'clientes' | 'eventos' | 'proveedores';
    item: StockItem;
    embaseRelacionado?: EmbaseData | null;
    motivosOptions: string[];
}

export default function AjustePage({
    prestable_id,
    almacen_id,
    tipo,
    item: initialItem,
    embaseRelacionado,
    motivosOptions,
}: AjustePageProps) {
    const { showNotification } = useToastNotifications();
    const [loading, setLoading] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [actualizarEmbase, setActualizarEmbase] = useState(true);
    const [embaseValoresCalculados, setEmbaseValoresCalculados] = useState<any>(null);

    // 📡 LOG: Mostrar datos que llegan del backend
    useEffect(() => {
        console.log('%c🔵 DATOS DEL BACKEND (ajuste.tsx)', 'color: #3498db; font-weight: bold; font-size: 14px;', {
            prestable_id,
            almacen_id,
            tipo,
            initialItem: {
                nombre: initialItem.prestable_nombre,
                codigo: initialItem.prestable_codigo,
                tipo: initialItem.prestable_tipo,
                capacidad: initialItem.prestable_capacidad,
                disponible: initialItem.cantidad_disponible,
            },
            embaseRelacionado: embaseRelacionado ? {
                id: embaseRelacionado.id,
                nombre: embaseRelacionado.prestable_nombre,
                codigo: embaseRelacionado.prestable_codigo,
                disponible: embaseRelacionado.cantidad_disponible,
            } : null,
            motivosOptions,
        });
    }, []);

    // Estados editable para embase
    const [embaseData, setEmbaseData] = useState(() => {
        if (!embaseRelacionado) return null;
        if (tipo === 'clientes') {
            return {
                cantidad_disponible: embaseRelacionado.cantidad_disponible || 0,
                cantidad_cliente_deudor: embaseRelacionado.cantidad_cliente_deudor || 0,
                cantidad_cliente_devuelto: embaseRelacionado.cantidad_cliente_devuelto || 0,
                cantidad_cliente_dañada: embaseRelacionado.cantidad_cliente_dañada || 0,
            };
        } else if (tipo === 'eventos') {
            return {
                cantidad_disponible: embaseRelacionado.cantidad_disponible || 0,
                cantidad_evento_deudor: embaseRelacionado.cantidad_evento_deudor || 0,
                cantidad_evento_devuelto: embaseRelacionado.cantidad_evento_devuelto || 0,
                cantidad_evento_dañada: embaseRelacionado.cantidad_evento_dañada || 0,
            };
        } else {
            return {
                cantidad_disponible: embaseRelacionado.cantidad_disponible || 0,
                cantidad_proveedor_acreedor: embaseRelacionado.cantidad_proveedor_acreedor || 0,
                cantidad_proveedor_devuelto: embaseRelacionado.cantidad_proveedor_devuelto || 0,
                cantidad_proveedor_dañada: embaseRelacionado.cantidad_proveedor_dañada || 0,
            };
        }
    });

    // 📡 LOG: Mostrar embase relacionado detallado
    useEffect(() => {
        if (embaseRelacionado) {
            console.log('%c🔗 EMBASE RELACIONADO DETALLADO', 'color: #f39c12; font-weight: bold; font-size: 14px;', {
                embaseRelacionado,
                estadoActual: embaseData,
            });
        }
    }, [embaseRelacionado, embaseData]);

    // Estados editable para clientes
    const [clientesData, setClientesData] = useState({
        cantidad_disponible: initialItem.cantidad_disponible,
        cantidad_cliente_deudor: initialItem.cantidad_cliente_deudor || 0,
        cantidad_cliente_devuelto: initialItem.cantidad_cliente_devuelto || 0,
        cantidad_cliente_dañada: initialItem.cantidad_cliente_dañada || 0,
    });

    // Estados editable para eventos
    const [eventosData, setEventosData] = useState({
        cantidad_disponible: initialItem.cantidad_disponible,
        cantidad_evento_deudor: initialItem.cantidad_evento_deudor || 0,
        cantidad_evento_devuelto: initialItem.cantidad_evento_devuelto || 0,
        cantidad_evento_dañada: initialItem.cantidad_evento_dañada || 0,
    });

    // Estados editable para proveedores
    const [proveedoresData, setProveedoresData] = useState({
        cantidad_disponible: initialItem.cantidad_disponible,
        cantidad_proveedor_acreedor: initialItem.cantidad_proveedor_acreedor || 0,
        cantidad_proveedor_devuelto: initialItem.cantidad_proveedor_devuelto || 0,
        cantidad_proveedor_dañada: initialItem.cantidad_proveedor_dañada || 0,
    });

    const currentData = tipo === 'clientes' ? clientesData : tipo === 'eventos' ? eventosData : proveedoresData;
    const setCurrentData = tipo === 'clientes' ? setClientesData : tipo === 'eventos' ? setEventosData : setProveedoresData;

    // 📡 LOG: Verificar si hay embase relacionado al cargar
    useEffect(() => {
        if (initialItem.prestable_tipo === 'CANASTILLA') {
            if (embaseRelacionado) {
                console.log('%c✅ CANASTILLA DETECTADA CON EMBASE RELACIONADO', 'color: #27ae60; font-weight: bold; font-size: 14px;', {
                    canastilla: initialItem.prestable_nombre,
                    embase: embaseRelacionado.prestable_nombre,
                    capacidad: initialItem.prestable_capacidad,
                });
            } else {
                console.log('%c⚠️ CANASTILLA SIN EMBASE RELACIONADO', 'color: #e74c3c; font-weight: bold; font-size: 14px;', {
                    canastilla: initialItem.prestable_nombre,
                });
            }
        } else {
            console.log('%c📦 EMBASE DETECTADO (sin relacionado)', 'color: #3498db; font-weight: bold; font-size: 14px;', {
                embase: initialItem.prestable_nombre,
            });
        }
    }, [initialItem, embaseRelacionado]);

    // Calcular valores del embase cuando está activado
    useEffect(() => {
        if (actualizarEmbase && embaseRelacionado && initialItem.prestable_capacidad) {
            const capacidad = initialItem.prestable_capacidad;
            const calculados: any = {};
            const difDisponible = currentData.cantidad_disponible - initialItem.cantidad_disponible;

            calculados.cantidad_disponible = Math.max(0, (embaseRelacionado.cantidad_disponible || 0) + (difDisponible * capacidad));

            if (tipo === 'clientes') {
                const difClienteDeudor = clientesData.cantidad_cliente_deudor - (initialItem.cantidad_cliente_deudor || 0);
                const difClienteDevuelto = clientesData.cantidad_cliente_devuelto - (initialItem.cantidad_cliente_devuelto || 0);
                const difClienteDañada = clientesData.cantidad_cliente_dañada - (initialItem.cantidad_cliente_dañada || 0);

                calculados.cantidad_cliente_deudor = Math.max(0, (embaseRelacionado.cantidad_cliente_deudor || 0) + (difClienteDeudor * capacidad));
                calculados.cantidad_cliente_devuelto = Math.max(0, (embaseRelacionado.cantidad_cliente_devuelto || 0) + (difClienteDevuelto * capacidad));
                calculados.cantidad_cliente_dañada = Math.max(0, (embaseRelacionado.cantidad_cliente_dañada || 0) + (difClienteDañada * capacidad));
            } else if (tipo === 'eventos') {
                const difEventoDeudor = eventosData.cantidad_evento_deudor - (initialItem.cantidad_evento_deudor || 0);
                const difEventoDevuelto = eventosData.cantidad_evento_devuelto - (initialItem.cantidad_evento_devuelto || 0);
                const difEventoDañada = eventosData.cantidad_evento_dañada - (initialItem.cantidad_evento_dañada || 0);

                calculados.cantidad_evento_deudor = Math.max(0, (embaseRelacionado.cantidad_evento_deudor || 0) + (difEventoDeudor * capacidad));
                calculados.cantidad_evento_devuelto = Math.max(0, (embaseRelacionado.cantidad_evento_devuelto || 0) + (difEventoDevuelto * capacidad));
                calculados.cantidad_evento_dañada = Math.max(0, (embaseRelacionado.cantidad_evento_dañada || 0) + (difEventoDañada * capacidad));
            } else {
                const difProveedorAcreedor = proveedoresData.cantidad_proveedor_acreedor - (initialItem.cantidad_proveedor_acreedor || 0);
                const difProveedorDevuelto = proveedoresData.cantidad_proveedor_devuelto - (initialItem.cantidad_proveedor_devuelto || 0);
                const difProveedorDañada = proveedoresData.cantidad_proveedor_dañada - (initialItem.cantidad_proveedor_dañada || 0);

                calculados.cantidad_proveedor_acreedor = Math.max(0, (embaseRelacionado.cantidad_proveedor_acreedor || 0) + (difProveedorAcreedor * capacidad));
                calculados.cantidad_proveedor_devuelto = Math.max(0, (embaseRelacionado.cantidad_proveedor_devuelto || 0) + (difProveedorDevuelto * capacidad));
                calculados.cantidad_proveedor_dañada = Math.max(0, (embaseRelacionado.cantidad_proveedor_dañada || 0) + (difProveedorDañada * capacidad));
            }

            console.log('🔄 Cálculo Automático (Opción A):', {
                actualizarEmbase,
                capacidad,
                tipo,
                currentData,
                calculados,
            });

            setEmbaseValoresCalculados(calculados);
            setEmbaseData(calculados);
        } else {
            console.log('⚙️ Modo Manual (Opción B) - El usuario edita manualmente');
            setEmbaseValoresCalculados(null);
        }
    }, [actualizarEmbase, clientesData, eventosData, proveedoresData, embaseRelacionado, initialItem, tipo]);

    // Calcular totales
    const getTotals = () => {
        if (tipo === 'clientes') {
            return {
                total: clientesData.cantidad_disponible +
                    clientesData.cantidad_cliente_deudor +
                    clientesData.cantidad_cliente_devuelto +
                    clientesData.cantidad_cliente_dañada,
            };
        } else if (tipo === 'eventos') {
            return {
                total: eventosData.cantidad_disponible +
                    eventosData.cantidad_evento_deudor +
                    eventosData.cantidad_evento_devuelto +
                    eventosData.cantidad_evento_dañada,
            };
        } else {
            return {
                total: proveedoresData.cantidad_disponible +
                    proveedoresData.cantidad_proveedor_acreedor +
                    proveedoresData.cantidad_proveedor_devuelto +
                    proveedoresData.cantidad_proveedor_dañada,
            };
        }
    };

    const totals = getTotals();

    const handleInputChange = (field: string, value: number) => {
        console.log(`📝 Campo canastilla "${field}" cambiado a:`, value, '| actualizarEmbase:', actualizarEmbase);
        setCurrentData((prev: any) => ({
            ...prev,
            [field]: Math.max(0, value),
        }));
    };

    const handleEmbaseInputChange = (field: string, value: number) => {
        setEmbaseData((prev: any) => ({
            ...prev,
            [field]: Math.max(0, value),
        }));
    };

    const handleSave = async () => {
        setLoading(true);

        try {
            // Guardar cambios de canastilla
            const actualizarEmbaseBoolean = !!(actualizarEmbase && embaseRelacionado);

            const body: any = {
                almacen_id,
                cantidad_disponible: currentData.cantidad_disponible,
                motivo,
                comentarios,
                actualizar_embase: actualizarEmbaseBoolean,
                embase_prestable_id: actualizarEmbaseBoolean && embaseRelacionado ? embaseRelacionado.prestable_id : null,
            };

            if (tipo === 'clientes') {
                body.cantidad_cliente_deudor = clientesData.cantidad_cliente_deudor;
                body.cantidad_cliente_devuelto = clientesData.cantidad_cliente_devuelto;
                body.cantidad_cliente_dañada = clientesData.cantidad_cliente_dañada;

                // Enviar valores editados del embase
                if (actualizarEmbaseBoolean && embaseData) {
                    body.embase_cantidad_disponible = embaseData.cantidad_disponible;
                    body.embase_cantidad_cliente_deudor = embaseData.cantidad_cliente_deudor;
                    body.embase_cantidad_cliente_devuelto = embaseData.cantidad_cliente_devuelto;
                    body.embase_cantidad_cliente_dañada = embaseData.cantidad_cliente_dañada;
                }
            } else if (tipo === 'eventos') {
                body.cantidad_evento_deudor = eventosData.cantidad_evento_deudor;
                body.cantidad_evento_devuelto = eventosData.cantidad_evento_devuelto;
                body.cantidad_evento_dañada = eventosData.cantidad_evento_dañada;

                // Enviar valores editados del embase
                if (actualizarEmbaseBoolean && embaseData) {
                    body.embase_cantidad_disponible = embaseData.cantidad_disponible;
                    body.embase_cantidad_evento_deudor = embaseData.cantidad_evento_deudor;
                    body.embase_cantidad_evento_devuelto = embaseData.cantidad_evento_devuelto;
                    body.embase_cantidad_evento_dañada = embaseData.cantidad_evento_dañada;
                }
            } else {
                body.cantidad_proveedor_acreedor = proveedoresData.cantidad_proveedor_acreedor;
                body.cantidad_proveedor_devuelto = proveedoresData.cantidad_proveedor_devuelto;
                body.cantidad_proveedor_dañada = proveedoresData.cantidad_proveedor_dañada;

                // Enviar valores editados del embase
                if (actualizarEmbaseBoolean && embaseData) {
                    body.embase_cantidad_disponible = embaseData.cantidad_disponible;
                    body.embase_cantidad_proveedor_acreedor = embaseData.cantidad_proveedor_acreedor;
                    body.embase_cantidad_proveedor_devuelto = embaseData.cantidad_proveedor_devuelto;
                    body.embase_cantidad_proveedor_dañada = embaseData.cantidad_proveedor_dañada;
                }
            }

            // 📨 Log de envío
            console.log('📤 ENVIANDO AL BACKEND:', {
                body,
                actualizarEmbase,
                embaseRelacionado: embaseRelacionado ? { id: embaseRelacionado.id, nombre: embaseRelacionado.prestable_nombre } : null,
                capacidad: initialItem.prestable_capacidad,
                embaseValoresCalculados: embaseValoresCalculados,
            });

            const response = await fetch(
                `/api/prestables/${prestable_id}/stock/ajustar`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify(body),
                }
            );

            const result = await response.json();

            // 📨 Log de respuesta
            console.log('📥 RESPUESTA DEL BACKEND:', result);

            if (result.success) {
                const mensaje = actualizarEmbase && embaseRelacionado
                    ? 'Stock de canastilla y embase ajustado exitosamente'
                    : 'Stock ajustado exitosamente';
                showNotification({
                    title: '✅ Éxito',
                    message: mensaje,
                    type: 'success',
                });
                setTimeout(() => {
                    router.visit(`/prestamos/stock/${tipo}`);
                }, 1500);
            } else {
                console.error('❌ Error en respuesta:', result);
                showNotification({
                    title: '❌ Error',
                    message: result.message || 'Error al ajustar el stock',
                    type: 'error',
                });
            }
        } catch (error: any) {
            console.error('❌ Error ajustando stock:', error);
            showNotification({
                title: '❌ Error',
                message: error.message || 'Error al ajustar el stock',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Préstamos',
            href: '/prestamos',
        },
        {
            title: tipo === 'clientes' ? 'Stock Clientes' : tipo === 'eventos' ? 'Stock Eventos' : 'Stock Proveedores',
            href: `/prestamos/stock/${tipo}`,
        },
        {
            title: 'Ajustar Stock',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ajustar Stock - ${initialItem.prestable_nombre}`} />

            <div className="p-4 sm:p-6">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Ajustar Stock - {initialItem.prestable_nombre}
                    </h1>

                    {/* Prestable Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Código
                            </label>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {initialItem.prestable_codigo}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tipo Prestable
                            </label>
                            <p className={`text-sm font-semibold ${initialItem.prestable_tipo === 'EMBASE' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                {initialItem.prestable_tipo}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Almacén
                            </label>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {initialItem.almacen_nombre}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tipo Almacén
                            </label>
                            <p className={`text-sm font-semibold ${initialItem.almacen_tipo === 'Proveedor' ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                {initialItem.almacen_tipo}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Total
                            </label>
                            <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                {totals.total}
                            </p>
                        </div>
                    </div>

                    {/* Motivo y Comentarios - Grid responsive: 1 columna en móvil, 2 columnas en md+ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                🏷️ Motivo (Opcional)
                            </label>
                            <select
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="">-- Seleccionar motivo --</option>
                                {motivosOptions.map((opcion) => (
                                    <option key={opcion} value={opcion}>
                                        {opcion}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                💬 Comentarios (Opcional)
                            </label>
                            <textarea
                                value={comentarios}
                                onChange={(e) => setComentarios(e.target.value)}
                                placeholder="Detalles adicionales..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 resize-none"
                            />
                        </div>
                    </div>

                    {/* Info Alert si es CANASTILLA */}
                    {/* {initialItem.prestable_tipo === 'CANASTILLA' && embaseRelacionado && (
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-900 dark:text-blue-300">
                                <strong>💡 Nota:</strong> Puedes editar los valores de <strong>Canastillas</strong> en la tabla izquierda y, si activas "Actualizar Embase", los valores del <strong>Embase Relacionado</strong> se calcularán automáticamente basado en la capacidad.
                            </p>
                        </div>
                    )} */}

                    {/* Grid Responsivo: Tabla y Embase Relacionado */}
                    <div className={`${initialItem.prestable_tipo === 'CANASTILLA' && embaseRelacionado ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : ''} mb-8`}>
                        {/* Tabla Editable */}
                        <div>
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {initialItem.prestable_tipo === 'CANASTILLA' ? '📦 Ajuste de Canastillas' : '📦 Ajuste de Embases'}
                                </h2>
                                <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    <strong>ℹ️ Cómo funciona:</strong> Escribe el nuevo valor en "Ahora". La columna "Cambio" mostrará si es un <span className="text-green-600 dark:text-green-400 font-semibold">incremento (+)</span> o <span className="text-red-600 dark:text-red-400 font-semibold">decremento (-)</span>. Estos cambios se aplicarán al total.
                                </p>
                            </div>
                            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                <table className="w-full">
                                    <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Campo
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Antes
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Ahora
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Cambio
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {/* Disponible */}
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                📦 Disponible
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {initialItem.cantidad_disponible}
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={currentData.cantidad_disponible}
                                                    onChange={(e) => handleInputChange('cantidad_disponible', parseInt(e.target.value) || 0)}
                                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm font-semibold">
                                                <span className={currentData.cantidad_disponible > initialItem.cantidad_disponible ? 'text-green-600 dark:text-green-400' : currentData.cantidad_disponible < initialItem.cantidad_disponible ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                                                    {currentData.cantidad_disponible - initialItem.cantidad_disponible >= 0 ? '+' : ''}{currentData.cantidad_disponible - initialItem.cantidad_disponible}
                                                </span>
                                            </td>
                                        </tr>

                                        {/* Cliente rows */}
                                        {tipo === 'clientes' && (
                                            <>
                                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                        🔵 Prestado
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                        {initialItem.cantidad_cliente_deudor || 0}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={clientesData.cantidad_cliente_deudor}
                                                            onChange={(e) => handleInputChange('cantidad_cliente_deudor', parseInt(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        <span className={clientesData.cantidad_cliente_deudor > (initialItem.cantidad_cliente_deudor || 0) ? 'text-green-600 dark:text-green-400' : clientesData.cantidad_cliente_deudor < (initialItem.cantidad_cliente_deudor || 0) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                                                            {clientesData.cantidad_cliente_deudor - (initialItem.cantidad_cliente_deudor || 0) >= 0 ? '+' : ''}{clientesData.cantidad_cliente_deudor - (initialItem.cantidad_cliente_deudor || 0)}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {/* <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                        ✅ Devuelto
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                        {initialItem.cantidad_cliente_devuelto || 0}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={clientesData.cantidad_cliente_devuelto}
                                                            onChange={(e) => handleInputChange('cantidad_cliente_devuelto', parseInt(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        <span className={clientesData.cantidad_cliente_devuelto > (initialItem.cantidad_cliente_devuelto || 0) ? 'text-green-600 dark:text-green-400' : clientesData.cantidad_cliente_devuelto < (initialItem.cantidad_cliente_devuelto || 0) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                                                            {clientesData.cantidad_cliente_devuelto - (initialItem.cantidad_cliente_devuelto || 0) >= 0 ? '+' : ''}{clientesData.cantidad_cliente_devuelto - (initialItem.cantidad_cliente_devuelto || 0)}
                                                        </span>
                                                    </td>
                                                </tr> */}
                                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                        🔴 Dañada
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                        {initialItem.cantidad_cliente_dañada || 0}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={clientesData.cantidad_cliente_dañada}
                                                            onChange={(e) => handleInputChange('cantidad_cliente_dañada', parseInt(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        <span className={clientesData.cantidad_cliente_dañada > (initialItem.cantidad_cliente_dañada || 0) ? 'text-green-600 dark:text-green-400' : clientesData.cantidad_cliente_dañada < (initialItem.cantidad_cliente_dañada || 0) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                                                            {clientesData.cantidad_cliente_dañada - (initialItem.cantidad_cliente_dañada || 0) >= 0 ? '+' : ''}{clientesData.cantidad_cliente_dañada - (initialItem.cantidad_cliente_dañada || 0)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </>
                                        )}

                                        {/* Evento rows */}
                                        {tipo === 'eventos' && (
                                            <>
                                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                        🟣 Prestado
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                        {initialItem.cantidad_evento_deudor || 0}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={eventosData.cantidad_evento_deudor}
                                                            onChange={(e) => handleInputChange('cantidad_evento_deudor', parseInt(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        <span className={eventosData.cantidad_evento_deudor > (initialItem.cantidad_evento_deudor || 0) ? 'text-green-600 dark:text-green-400' : eventosData.cantidad_evento_deudor < (initialItem.cantidad_evento_deudor || 0) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                                                            {eventosData.cantidad_evento_deudor - (initialItem.cantidad_evento_deudor || 0) >= 0 ? '+' : ''}{eventosData.cantidad_evento_deudor - (initialItem.cantidad_evento_deudor || 0)}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {/* <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                        ✅ Devuelto
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                        {initialItem.cantidad_evento_devuelto || 0}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={eventosData.cantidad_evento_devuelto}
                                                            onChange={(e) => handleInputChange('cantidad_evento_devuelto', parseInt(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        <span className={eventosData.cantidad_evento_devuelto > (initialItem.cantidad_evento_devuelto || 0) ? 'text-green-600 dark:text-green-400' : eventosData.cantidad_evento_devuelto < (initialItem.cantidad_evento_devuelto || 0) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                                                            {eventosData.cantidad_evento_devuelto - (initialItem.cantidad_evento_devuelto || 0) >= 0 ? '+' : ''}{eventosData.cantidad_evento_devuelto - (initialItem.cantidad_evento_devuelto || 0)}
                                                        </span>
                                                    </td>
                                                </tr> */}
                                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                        🔴 Dañada
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                        {initialItem.cantidad_evento_dañada || 0}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={eventosData.cantidad_evento_dañada}
                                                            onChange={(e) => handleInputChange('cantidad_evento_dañada', parseInt(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        <span className={eventosData.cantidad_evento_dañada > (initialItem.cantidad_evento_dañada || 0) ? 'text-green-600 dark:text-green-400' : eventosData.cantidad_evento_dañada < (initialItem.cantidad_evento_dañada || 0) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                                                            {eventosData.cantidad_evento_dañada - (initialItem.cantidad_evento_dañada || 0) >= 0 ? '+' : ''}{eventosData.cantidad_evento_dañada - (initialItem.cantidad_evento_dañada || 0)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </>
                                        )}

                                        {/* Proveedor rows */}
                                        {tipo === 'proveedores' && (
                                            <>
                                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                        🟠 Proveedor Por Devolver
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                        {initialItem.cantidad_proveedor_acreedor || 0}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={proveedoresData.cantidad_proveedor_acreedor}
                                                            onChange={(e) => handleInputChange('cantidad_proveedor_acreedor', parseInt(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        <span className={proveedoresData.cantidad_proveedor_acreedor > (initialItem.cantidad_proveedor_acreedor || 0) ? 'text-green-600 dark:text-green-400' : proveedoresData.cantidad_proveedor_acreedor < (initialItem.cantidad_proveedor_acreedor || 0) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                                                            {proveedoresData.cantidad_proveedor_acreedor - (initialItem.cantidad_proveedor_acreedor || 0) >= 0 ? '+' : ''}{proveedoresData.cantidad_proveedor_acreedor - (initialItem.cantidad_proveedor_acreedor || 0)}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {/* <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                        ✅ Devuelto
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                        {initialItem.cantidad_proveedor_devuelto || 0}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={proveedoresData.cantidad_proveedor_devuelto}
                                                            onChange={(e) => handleInputChange('cantidad_proveedor_devuelto', parseInt(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        <span className={proveedoresData.cantidad_proveedor_devuelto > (initialItem.cantidad_proveedor_devuelto || 0) ? 'text-green-600 dark:text-green-400' : proveedoresData.cantidad_proveedor_devuelto < (initialItem.cantidad_proveedor_devuelto || 0) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                                                            {proveedoresData.cantidad_proveedor_devuelto - (initialItem.cantidad_proveedor_devuelto || 0) >= 0 ? '+' : ''}{proveedoresData.cantidad_proveedor_devuelto - (initialItem.cantidad_proveedor_devuelto || 0)}
                                                        </span>
                                                    </td>
                                                </tr> */}
                                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                        🔴 Dañada
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                        {initialItem.cantidad_proveedor_dañada || 0}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={proveedoresData.cantidad_proveedor_dañada}
                                                            onChange={(e) => handleInputChange('cantidad_proveedor_dañada', parseInt(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        <span className={proveedoresData.cantidad_proveedor_dañada > (initialItem.cantidad_proveedor_dañada || 0) ? 'text-green-600 dark:text-green-400' : proveedoresData.cantidad_proveedor_dañada < (initialItem.cantidad_proveedor_dañada || 0) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                                                            {proveedoresData.cantidad_proveedor_dañada - (initialItem.cantidad_proveedor_dañada || 0) >= 0 ? '+' : ''}{proveedoresData.cantidad_proveedor_dañada - (initialItem.cantidad_proveedor_dañada || 0)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </>
                                        )}

                                        {/* Total row */}
                                        <tr className="bg-gray-100 dark:bg-gray-800 font-bold">
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                📊 TOTAL
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                {initialItem.cantidad_disponible + (initialItem.cantidad_cliente_deudor || 0) + (initialItem.cantidad_cliente_devuelto || 0) + (initialItem.cantidad_evento_deudor || 0) + (initialItem.cantidad_evento_devuelto || 0) + (initialItem.cantidad_proveedor_acreedor || 0) + (initialItem.cantidad_proveedor_devuelto || 0)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                {totals.total}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={totals.total > (initialItem.cantidad_disponible + (initialItem.cantidad_cliente_deudor || 0) + (initialItem.cantidad_cliente_devuelto || 0) + (initialItem.cantidad_evento_deudor || 0) + (initialItem.cantidad_evento_devuelto || 0) + (initialItem.cantidad_proveedor_acreedor || 0) + (initialItem.cantidad_proveedor_devuelto || 0)) ? 'text-green-600 dark:text-green-400 font-bold' : totals.total < (initialItem.cantidad_disponible + (initialItem.cantidad_cliente_deudor || 0) + (initialItem.cantidad_cliente_devuelto || 0) + (initialItem.cantidad_evento_deudor || 0) + (initialItem.cantidad_evento_devuelto || 0) + (initialItem.cantidad_proveedor_acreedor || 0) + (initialItem.cantidad_proveedor_devuelto || 0)) ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-600 dark:text-gray-400'}>
                                                    {totals.total - (initialItem.cantidad_disponible + (initialItem.cantidad_cliente_deudor || 0) + (initialItem.cantidad_cliente_devuelto || 0) + (initialItem.cantidad_evento_deudor || 0) + (initialItem.cantidad_evento_devuelto || 0) + (initialItem.cantidad_proveedor_acreedor || 0) + (initialItem.cantidad_proveedor_devuelto || 0)) >= 0 ? '+' : ''}{totals.total - (initialItem.cantidad_disponible + (initialItem.cantidad_cliente_deudor || 0) + (initialItem.cantidad_cliente_devuelto || 0) + (initialItem.cantidad_evento_deudor || 0) + (initialItem.cantidad_evento_devuelto || 0) + (initialItem.cantidad_proveedor_acreedor || 0) + (initialItem.cantidad_proveedor_devuelto || 0))}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Embase Relacionado */}
                        {embaseRelacionado && initialItem.prestable_tipo === 'CANASTILLA' && (
                            <div className="border border-amber-200 dark:border-amber-800 rounded-lg overflow-hidden">
                                {/* Header con checkbox */}
                                <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                                        🔗 {embaseRelacionado.prestable_nombre}
                                    </h3>
                                    <div className="flex items-center gap-4 mb-2">
                                        <input
                                            type="checkbox"
                                            id="actualizarEmbase"
                                            checked={actualizarEmbase}
                                            onChange={(e) => setActualizarEmbase(e.target.checked)}
                                            className="w-5 h-5 text-amber-600 rounded cursor-pointer"
                                        />
                                        <label htmlFor="actualizarEmbase" className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer">
                                            ✅ Actualizar automáticamente basado en capacidad
                                        </label>
                                    </div>
                                    {actualizarEmbase && initialItem.prestable_capacidad && (
                                        <div className="ml-9 p-2 bg-amber-100 dark:bg-amber-900/40 rounded text-xs text-amber-800 dark:text-amber-200">
                                            <p><strong>Opción A (Automática):</strong> Los cambios en canastillas se multiplican por ×{initialItem.prestable_capacidad}</p>
                                        </div>
                                    )}
                                    {!actualizarEmbase && (
                                        <div className="ml-9 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-700 dark:text-gray-300">
                                            <p><strong>Opción B (Manual):</strong> Edita los valores del embase manualmente en la tabla</p>
                                        </div>
                                    )}
                                </div>

                                {/* Tabla Editable del Embase */}
                                <div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Campo</th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Antes</th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Ahora</th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Cambio</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-amber-200 dark:divide-amber-800">
                                                {/* Disponible */}
                                                <tr className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">📦 Disponible</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                        {embaseRelacionado?.cantidad_disponible || 0}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={embaseData?.cantidad_disponible || 0}
                                                            onChange={(e) => handleEmbaseInputChange('cantidad_disponible', parseInt(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        <span className={embaseData?.cantidad_disponible! > (embaseRelacionado?.cantidad_disponible || 0) ? 'text-green-600 dark:text-green-400' : embaseData?.cantidad_disponible! < (embaseRelacionado?.cantidad_disponible || 0) ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                                                            {(embaseData?.cantidad_disponible || 0) - (embaseRelacionado?.cantidad_disponible || 0) >= 0 ? '+' : ''}{(embaseData?.cantidad_disponible || 0) - (embaseRelacionado?.cantidad_disponible || 0)}
                                                        </span>
                                                    </td>
                                                </tr>

                                                {tipo === 'clientes' && (
                                                    <>
                                                        <tr className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">🔵 Prestado</td>
                                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{embaseRelacionado?.cantidad_cliente_deudor || 0}</td>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={embaseData?.cantidad_cliente_deudor || 0}
                                                                    onChange={(e) => handleEmbaseInputChange('cantidad_cliente_deudor', parseInt(e.target.value) || 0)}
                                                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`text-xs font-semibold ${(embaseData?.cantidad_cliente_deudor || 0) - (embaseRelacionado?.cantidad_cliente_deudor || 0) > 0 ? 'text-green-600 dark:text-green-400' : (embaseData?.cantidad_cliente_deudor || 0) - (embaseRelacionado?.cantidad_cliente_deudor || 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {(embaseData?.cantidad_cliente_deudor || 0) - (embaseRelacionado?.cantidad_cliente_deudor || 0) >= 0 ? '+' : ''}{(embaseData?.cantidad_cliente_deudor || 0) - (embaseRelacionado?.cantidad_cliente_deudor || 0)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        {/* <tr className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">✅ Cliente Devuelto</td>
                                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{embaseRelacionado?.cantidad_cliente_devuelto || 0}</td>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={embaseData?.cantidad_cliente_devuelto || 0}
                                                                    onChange={(e) => handleEmbaseInputChange('cantidad_cliente_devuelto', parseInt(e.target.value) || 0)}
                                                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`text-xs font-semibold ${(embaseData?.cantidad_cliente_devuelto || 0) - (embaseRelacionado?.cantidad_cliente_devuelto || 0) > 0 ? 'text-green-600 dark:text-green-400' : (embaseData?.cantidad_cliente_devuelto || 0) - (embaseRelacionado?.cantidad_cliente_devuelto || 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {(embaseData?.cantidad_cliente_devuelto || 0) - (embaseRelacionado?.cantidad_cliente_devuelto || 0) >= 0 ? '+' : ''}{(embaseData?.cantidad_cliente_devuelto || 0) - (embaseRelacionado?.cantidad_cliente_devuelto || 0)}
                                                                </span>
                                                            </td>
                                                        </tr> */}
                                                        <tr className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">🔴 Dañada</td>
                                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{embaseRelacionado?.cantidad_cliente_dañada || 0}</td>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={embaseData?.cantidad_cliente_dañada || 0}
                                                                    onChange={(e) => handleEmbaseInputChange('cantidad_cliente_dañada', parseInt(e.target.value) || 0)}
                                                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`text-xs font-semibold ${(embaseData?.cantidad_cliente_dañada || 0) - (embaseRelacionado?.cantidad_cliente_dañada || 0) > 0 ? 'text-green-600 dark:text-green-400' : (embaseData?.cantidad_cliente_dañada || 0) - (embaseRelacionado?.cantidad_cliente_dañada || 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {(embaseData?.cantidad_cliente_dañada || 0) - (embaseRelacionado?.cantidad_cliente_dañada || 0) >= 0 ? '+' : ''}{(embaseData?.cantidad_cliente_dañada || 0) - (embaseRelacionado?.cantidad_cliente_dañada || 0)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </>
                                                )}

                                                {tipo === 'eventos' && (
                                                    <>
                                                        <tr className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">🟣 Prestado</td>
                                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{embaseRelacionado?.cantidad_evento_deudor || 0}</td>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={embaseData?.cantidad_evento_deudor || 0}
                                                                    onChange={(e) => handleEmbaseInputChange('cantidad_evento_deudor', parseInt(e.target.value) || 0)}
                                                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`text-xs font-semibold ${(embaseData?.cantidad_evento_deudor || 0) - (embaseRelacionado?.cantidad_evento_deudor || 0) > 0 ? 'text-green-600 dark:text-green-400' : (embaseData?.cantidad_evento_deudor || 0) - (embaseRelacionado?.cantidad_evento_deudor || 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {(embaseData?.cantidad_evento_deudor || 0) - (embaseRelacionado?.cantidad_evento_deudor || 0) >= 0 ? '+' : ''}{(embaseData?.cantidad_evento_deudor || 0) - (embaseRelacionado?.cantidad_evento_deudor || 0)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        {/* <tr className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">✅ Evento Devuelto</td>
                                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{embaseRelacionado?.cantidad_evento_devuelto || 0}</td>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={embaseData?.cantidad_evento_devuelto || 0}
                                                                    onChange={(e) => handleEmbaseInputChange('cantidad_evento_devuelto', parseInt(e.target.value) || 0)}
                                                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`text-xs font-semibold ${(embaseData?.cantidad_evento_devuelto || 0) - (embaseRelacionado?.cantidad_evento_devuelto || 0) > 0 ? 'text-green-600 dark:text-green-400' : (embaseData?.cantidad_evento_devuelto || 0) - (embaseRelacionado?.cantidad_evento_devuelto || 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {(embaseData?.cantidad_evento_devuelto || 0) - (embaseRelacionado?.cantidad_evento_devuelto || 0) >= 0 ? '+' : ''}{(embaseData?.cantidad_evento_devuelto || 0) - (embaseRelacionado?.cantidad_evento_devuelto || 0)}
                                                                </span>
                                                            </td>
                                                        </tr> */}
                                                        <tr className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">🔴 Dañada</td>
                                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{embaseRelacionado?.cantidad_evento_dañada || 0}</td>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={embaseData?.cantidad_evento_dañada || 0}
                                                                    onChange={(e) => handleEmbaseInputChange('cantidad_evento_dañada', parseInt(e.target.value) || 0)}
                                                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`text-xs font-semibold ${(embaseData?.cantidad_evento_dañada || 0) - (embaseRelacionado?.cantidad_evento_dañada || 0) > 0 ? 'text-green-600 dark:text-green-400' : (embaseData?.cantidad_evento_dañada || 0) - (embaseRelacionado?.cantidad_evento_dañada || 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {(embaseData?.cantidad_evento_dañada || 0) - (embaseRelacionado?.cantidad_evento_dañada || 0) >= 0 ? '+' : ''}{(embaseData?.cantidad_evento_dañada || 0) - (embaseRelacionado?.cantidad_evento_dañada || 0)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </>
                                                )}

                                                {tipo === 'proveedores' && (
                                                    <>
                                                        <tr className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">🟠 Proveedor Por Devolver</td>
                                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{embaseRelacionado?.cantidad_proveedor_acreedor || 0}</td>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={embaseData?.cantidad_proveedor_acreedor || 0}
                                                                    onChange={(e) => handleEmbaseInputChange('cantidad_proveedor_acreedor', parseInt(e.target.value) || 0)}
                                                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`text-xs font-semibold ${(embaseData?.cantidad_proveedor_acreedor || 0) - (embaseRelacionado?.cantidad_proveedor_acreedor || 0) > 0 ? 'text-green-600 dark:text-green-400' : (embaseData?.cantidad_proveedor_acreedor || 0) - (embaseRelacionado?.cantidad_proveedor_acreedor || 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {(embaseData?.cantidad_proveedor_acreedor || 0) - (embaseRelacionado?.cantidad_proveedor_acreedor || 0) >= 0 ? '+' : ''}{(embaseData?.cantidad_proveedor_acreedor || 0) - (embaseRelacionado?.cantidad_proveedor_acreedor || 0)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        {/* <tr className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">✅ Devuelto</td>
                                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{embaseRelacionado?.cantidad_proveedor_devuelto || 0}</td>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={embaseData?.cantidad_proveedor_devuelto || 0}
                                                                    onChange={(e) => handleEmbaseInputChange('cantidad_proveedor_devuelto', parseInt(e.target.value) || 0)}
                                                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`text-xs font-semibold ${(embaseData?.cantidad_proveedor_devuelto || 0) - (embaseRelacionado?.cantidad_proveedor_devuelto || 0) > 0 ? 'text-green-600 dark:text-green-400' : (embaseData?.cantidad_proveedor_devuelto || 0) - (embaseRelacionado?.cantidad_proveedor_devuelto || 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {(embaseData?.cantidad_proveedor_devuelto || 0) - (embaseRelacionado?.cantidad_proveedor_devuelto || 0) >= 0 ? '+' : ''}{(embaseData?.cantidad_proveedor_devuelto || 0) - (embaseRelacionado?.cantidad_proveedor_devuelto || 0)}
                                                                </span>
                                                            </td>
                                                        </tr> */}
                                                        <tr className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">🔴 Dañada</td>
                                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{embaseRelacionado?.cantidad_proveedor_dañada || 0}</td>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={embaseData?.cantidad_proveedor_dañada || 0}
                                                                    onChange={(e) => handleEmbaseInputChange('cantidad_proveedor_dañada', parseInt(e.target.value) || 0)}
                                                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`text-xs font-semibold ${(embaseData?.cantidad_proveedor_dañada || 0) - (embaseRelacionado?.cantidad_proveedor_dañada || 0) > 0 ? 'text-green-600 dark:text-green-400' : (embaseData?.cantidad_proveedor_dañada || 0) - (embaseRelacionado?.cantidad_proveedor_dañada || 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {(embaseData?.cantidad_proveedor_dañada || 0) - (embaseRelacionado?.cantidad_proveedor_dañada || 0) >= 0 ? '+' : ''}{(embaseData?.cantidad_proveedor_dañada || 0) - (embaseRelacionado?.cantidad_proveedor_dañada || 0)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>



                    {/* Botones */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit(`/prestamos/stock/${tipo}`)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            {loading ? 'Guardando...' : '✅ Guardar Ajuste'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
