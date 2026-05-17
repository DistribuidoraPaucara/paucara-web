/**
 * Page: Ventas de Comidas/Helados
 *
 * Interfaz especializada para venta de comidas sin stock
 * Características:
 * ✅ Selector de productos de comida
 * ✅ Gestión de adicionales por producto
 * ✅ Carrito con precio dinámico
 * ✅ Métodos de pago
 * ✅ Cliente opcional
 * ✅ Guardado de venta
 */

import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AppLayout from '@/layouts/app-layout';
import { ProductosComidaSelector } from '@/presentation/components/ProductosComidaSelector';
import { DetalleProductoComida } from '@/presentation/components/DetalleProductoComida';
import { useCarritoComidas } from '@/application/hooks/use-carrito-comidas';
import InputSearch from '@/presentation/components/ui/input-search';
import { useClienteSearch } from '@/infrastructure/hooks/use-api-search';
import { Button } from '@/presentation/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Trash2, ShoppingCart, Save, AlertCircle } from 'lucide-react';

interface Cliente {
    id: number;
    nombre: string;
    ci: string;
}

interface TipoPago {
    id: number;
    nombre: string;
    codigo: string;
}

interface Adicional {
    id: number;
    nombre: string;
    precio_adicional: number;
    activo: boolean;
}

interface ProductoComidaConAdicionales {
    producto: {
        id: number;
        nombre: string;
        precio_venta: number;
        adicionales?: Adicional[];
    };
    adicionalesSeleccionados: number[];
    cantidad: number;
}

interface VentasComidaspageProps {
    clientes: Cliente[];
    tiposPago: TipoPago[];
    auth: { user: { id: number; name: string } };
}

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export default function VentasComidas({ clientes, tiposPago, auth }: VentasComidaspageProps) {
    const carrito = useCarritoComidas();
    const [clienteValue, setClienteValue] = useState<string | number | null>(null);
    const [clienteDisplay, setClienteDisplay] = useState<string>('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [tipoPagoId, setTipoPagoId] = useState<string | null>(null);
    const [montoEfectivo, setMontoEfectivo] = useState<number | ''>(0);
    const [montoTransferencia, setMontoTransferencia] = useState<number | ''>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mostrarSelector, setMostrarSelector] = useState(true);

    // Hook para búsqueda de clientes en tiempo real
    const { search: searchClientes } = useClienteSearch();

    // ✨ Cargar Cliente General y Tipo de Pago (EFECTIVO) por defecto
    useEffect(() => {
        const cargarDefectos = async () => {
            try {
                // Buscar cliente general usando el hook de búsqueda
                const resultados = await searchClientes('CLIENTE GENERAL');

                if (resultados && resultados.length > 0) {
                    const clienteGeneral = resultados[0];
                    setClienteValue(clienteGeneral.value);
                    setClienteDisplay(clienteGeneral.label);
                    setClienteSeleccionado(clienteGeneral.rawData);
                    console.log('✅ Cliente General cargado por defecto:', clienteGeneral.label);
                } else {
                    // Si no encuentra "CLIENTE GENERAL", buscar cualquier cliente que contenga "GENERAL"
                    const resultadosGeneral = await searchClientes('GENERAL');
                    if (resultadosGeneral && resultadosGeneral.length > 0) {
                        const clienteGeneral = resultadosGeneral[0];
                        setClienteValue(clienteGeneral.value);
                        setClienteDisplay(clienteGeneral.label);
                        setClienteSeleccionado(clienteGeneral.rawData);
                        console.log('✅ Cliente General cargado:', clienteGeneral.label);
                    }
                }

                // 💰 Cargar tipo de pago por defecto: EFECTIVO
                const efectivo = tiposPago.find(tp =>
                    tp.nombre.toLowerCase().includes('efectivo') ||
                    tp.codigo.toUpperCase().includes('EFECTIVO')
                );

                if (efectivo) {
                    setTipoPagoId(efectivo.id.toString());
                    console.log('✅ Tipo de Pago EFECTIVO cargado por defecto:', efectivo.nombre);
                }
            } catch (error) {
                console.warn('⚠️ Error al cargar defectos:', error);
            }
        };

        cargarDefectos();
    }, []); // ✅ Array vacío: ejecutar solo una vez al montar

    // 💳 Actualizar tipo de pago automáticamente según los montos
    useEffect(() => {
        const efectivo = Number(montoEfectivo) || 0;
        const transferencia = Number(montoTransferencia) || 0;

        let nuevoTipoPago: string | null = null;

        if (efectivo > 0 && transferencia === 0) {
            // Solo efectivo
            const tipoPagoEfectivo = tiposPago.find(tp =>
                tp.nombre.toLowerCase().includes('efectivo') ||
                tp.codigo.toUpperCase().includes('EFECTIVO')
            );
            nuevoTipoPago = tipoPagoEfectivo?.id.toString() || null;
            console.log('💳 Tipo de pago actualizado a EFECTIVO');
        } else if (transferencia > 0 && efectivo === 0) {
            // Solo transferencia: buscar tipo de pago TRANSFERENCIA/QR
            const tipoPagoTransferencia = tiposPago.find(tp =>
                tp.codigo.toUpperCase().includes('TRANSFERENCIA') ||
                tp.codigo.toUpperCase().includes('QR') ||
                tp.nombre.toLowerCase().includes('transferencia') ||
                tp.nombre.toLowerCase().includes('qr')
            );
            nuevoTipoPago = tipoPagoTransferencia?.id.toString() || null;
            if (nuevoTipoPago) {
                console.log('💳 Tipo de pago actualizado a TRANSFERENCIA/QR');
            }
        } else if (efectivo > 0 && transferencia > 0) {
            // Ambos > 0: usar MIXTO
            const tipoPagoMixto = tiposPago.find(tp =>
                tp.codigo.toUpperCase() === 'MIXTO' ||
                tp.nombre.toLowerCase().includes('mixto')
            );
            nuevoTipoPago = tipoPagoMixto?.id.toString() || null;
            if (nuevoTipoPago) {
                console.log('💳 Tipo de pago actualizado a MIXTO');
            }
        }

        if (nuevoTipoPago && nuevoTipoPago !== tipoPagoId) {
            setTipoPagoId(nuevoTipoPago);
        }
    }, [montoEfectivo, montoTransferencia, tiposPago, tipoPagoId]);

    const handleAgregarProducto = (detalle: ProductoComidaConAdicionales) => {
        const adicionalesDetalles = detalle.producto.adicionales?.filter(a =>
            detalle.adicionalesSeleccionados.includes(a.id)
        ) || [];

        carrito.agregarProducto(detalle as any, adicionalesDetalles);
        toast.success(`${detalle.producto.nombre} agregado al carrito`);
    };

    const handleEliminar = (index: number) => {
        carrito.eliminarProducto(index);
        toast.success('Producto eliminado');
    };

    const handleGuardarVenta = async () => {
        // Validaciones
        if (carrito.items.length === 0) {
            toast.error('Agrega al menos un producto');
            return;
        }

        const efectivo = Number(montoEfectivo) || 0;
        const transferencia = Number(montoTransferencia) || 0;
        const totalPago = efectivo + transferencia;
        const totalVenta = carrito.calcularTotal();

        // Validar que al menos uno de los montos sea > 0
        if (totalPago === 0) {
            toast.error('Ingresa al menos un monto (Efectivo o Transferencia)');
            return;
        }

        // Permitir pago >= total (con cambio si es mayor)
        if (totalPago < totalVenta) {
            toast.error(`Pago insuficiente: se necesitan ${formatCurrency(totalVenta)}, ingresaste ${formatCurrency(totalPago)}`);
            return;
        }

        const vuelto = totalPago - totalVenta;
        if (vuelto > 0) {
            toast.success(`Cambio: ${formatCurrency(vuelto)}`);
        }

        setIsSubmitting(true);

        try {
            // Preparar datos
            const datosVenta = {
                cliente_id: clienteValue ? Number(clienteValue) : null,
                tipo_pago_id: parseInt(tipoPagoId),
                monto_efectivo: efectivo,
                monto_transferencia: transferencia,
                productos_comida: carrito.items.map(item => ({
                    producto_id: item.producto_id,
                    nombre: item.nombre_producto,
                    precio_base: item.precio_base,
                    adicionales_ids: item.adicionalesSeleccionados,
                    cantidad: item.cantidad,
                    subtotal: item.precio_total,
                })),
                total: carrito.calcularTotal(),
                es_venta_comida: true,
                observaciones: null,
            };

            // Enviar al servidor
            const response = await fetch('/api/ventas-comidas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(datosVenta),
            });

            const result = await response.json();

            if (result.success) {
                // Mostrar mensaje con información del vuelto
                const mensaje = result.vuelto && result.vuelto > 0
                    ? `✅ Venta registrada\n💵 Cambio: ${formatCurrency(result.vuelto)}`
                    : '✅ Venta registrada exitosamente';

                toast.success(mensaje);

                // Limpiar formulario
                carrito.limpiarCarrito();
                setClienteValue(null);
                setClienteDisplay('');
                setClienteSeleccionado(null);
                setTipoPagoId(null);
                setMontoEfectivo(0);
                setMontoTransferencia(0);
                setMostrarSelector(true);

                // Log en consola para debugging
                console.log('💚 Venta creada:', {
                    venta_id: result.ventaId,
                    numero: result.numero,
                    total: result.total,
                    pagado: result.pagado,
                    vuelto: result.vuelto,
                });

                // 🖨️ Abrir impresión en formato TICKET_80 automáticamente
                if (result.ventaId) {
                    setTimeout(() => {
                        window.open(`/ventas/${result.ventaId}/imprimir?formato=TICKET_80&accion=stream`, '_blank');
                        console.log('🖨️ Abriendo impresión TICKET_80 para venta:', result.ventaId);

                        // Recargar la página después de 2 segundos para reiniciar el flujo
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }, 500); // Pequeña espera para que el toast se muestre
                }
            } else {
                toast.error(result.message || 'Error al guardar la venta');
                console.error('❌ Error al guardar venta:', result);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al guardar la venta');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Venta de Comidas" />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Encabezado */}
                    <div className="mb-8">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    🍦 Venta de Comidas/Helados
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Vendedor: {auth.user.name} • {new Date().toLocaleDateString('es-BO')}
                                </p>
                            </div>
                            <Link
                                href="/ventas"
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                ← Volver
                            </Link>
                        </div>
                    </div>

                    {/* Layout Principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Panel Izquierdo: Selector de Productos */}
                        <div className="lg:col-span-2">
                            {mostrarSelector && (
                                <ProductosComidaSelector
                                    onAgregar={handleAgregarProducto}
                                    onActualizar={carrito.actualizarCantidadPorProductoId}
                                    onEliminar={carrito.eliminarProductoPorId}
                                    onActualizarPrecio={carrito.actualizarPrecioBasePorProductoId}
                                    productosEnCarrito={carrito.items.map(item => ({
                                        producto_id: item.producto_id,
                                        cantidad: item.cantidad,
                                    }))}
                                />
                            )}

                            {carrito.items.length > 0 && !mostrarSelector && (
                                <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="py-12 text-center">
                                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                                            Carrito actualizado
                                        </p>
                                        <button
                                            onClick={() => setMostrarSelector(true)}
                                            className="px-6 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                                        >
                                            + Agregar más productos
                                        </button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Panel Derecho: Detalles y Resumen */}
                        <div className="space-y-4">
                            {/* Card: Cliente y Pagos */}
                            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg text-gray-900 dark:text-white">Detalles</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Cliente */}
                                    <InputSearch
                                        id="cliente_search"
                                        label="Cliente"
                                        value={clienteValue}
                                        displayValue={clienteDisplay}
                                        onSearch={searchClientes}
                                        onChange={(value, option) => {
                                            setClienteValue(value);
                                            if (option) {
                                                setClienteDisplay(option.label);
                                                setClienteSeleccionado(option.rawData);
                                            } else {
                                                setClienteDisplay('');
                                                setClienteSeleccionado(null);
                                            }
                                        }}
                                        placeholder="CLIENTE GENERAL..."
                                        emptyText="No se encontraron clientes"
                                        allowScanner={false}
                                        showCreateButton={false}
                                        className="w-full"
                                    />
                                    {clienteSeleccionado && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 -mt-2">
                                            {clienteSeleccionado.telefono && <span>📱 {clienteSeleccionado.telefono}</span>}
                                            {clienteSeleccionado.nit && <span>{clienteSeleccionado.telefono ? ' • ' : ''}NIT: {clienteSeleccionado.nit}</span>}
                                        </p>
                                    )}

                                    {/* Pagos */}
                                    <div className="space-y-3">
                                        {/* Monto Efectivo */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Efectivo</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Bs.</span>
                                                <input
                                                    type="number"
                                                    value={montoEfectivo}
                                                    onChange={(e) => setMontoEfectivo(e.target.value ? Number(e.target.value) : '')}
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Monto Transferencia/QR */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Transferencia/QR</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Bs.</span>
                                                <input
                                                    type="number"
                                                    value={montoTransferencia}
                                                    onChange={(e) => setMontoTransferencia(e.target.value ? Number(e.target.value) : '')}
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tipo de Pago Leyenda */}
                                    {tipoPagoId && (
                                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                <strong>Tipo de pago:</strong> {tiposPago.find(t => t.id.toString() === tipoPagoId)?.nombre}
                                            </p>
                                        </div>
                                    )}

                                    {/* Estado del Pago */}
                                    <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-700 dark:text-gray-300">Total pagado:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency((Number(montoEfectivo) || 0) + (Number(montoTransferencia) || 0))}
                                            </span>
                                        </div>
                                        {carrito.items.length > 0 && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-700 dark:text-gray-300">Total venta:</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {formatCurrency(carrito.calcularTotal())}
                                                </span>
                                            </div>
                                        )}
                                        {carrito.items.length > 0 && ((Number(montoEfectivo) || 0) + (Number(montoTransferencia) || 0)) >= carrito.calcularTotal() && (
                                            <div className={`px-2 py-1.5 rounded text-xs font-semibold ${
                                                ((Number(montoEfectivo) || 0) + (Number(montoTransferencia) || 0)) === carrito.calcularTotal()
                                                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                    : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                            }`}>
                                                {((Number(montoEfectivo) || 0) + (Number(montoTransferencia) || 0)) === carrito.calcularTotal()
                                                    ? '✓ Pago exacto'
                                                    : `💵 Cambio: ${formatCurrency(((Number(montoEfectivo) || 0) + (Number(montoTransferencia) || 0)) - carrito.calcularTotal())}`
                                                }
                                            </div>
                                        )}
                                        {carrito.items.length > 0 && ((Number(montoEfectivo) || 0) + (Number(montoTransferencia) || 0)) < carrito.calcularTotal() && (
                                            <div className="px-2 py-1.5 rounded text-xs font-semibold bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                                ❌ Falta: {formatCurrency(carrito.calcularTotal() - ((Number(montoEfectivo) || 0) + (Number(montoTransferencia) || 0)))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Carrito Resumen */}
                            {carrito.items.length > 0 && (
                                <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-6">
                                    <CardHeader>
                                        <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                                            <ShoppingCart size={20} />
                                            Resumen
                                        </CardTitle>
                                        <CardDescription>
                                            {carrito.totalItems} producto(s)
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Items listado */}
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {carrito.items.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded"
                                                >
                                                    <div className="flex-1 text-sm">
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {item.nombre_producto}
                                                        </p>
                                                        {(item.adicionales_detalles || []).length > 0 && (
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                +{(item.adicionales_detalles || []).map(a => a.nombre).join(', ')}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Controles de cantidad */}
                                                    <div className="flex items-center gap-2 mx-2">
                                                        <button
                                                            onClick={() => carrito.decrementarCantidad(idx)}
                                                            disabled={item.cantidad <= 1}
                                                            className="px-2 py-1 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="font-semibold text-gray-900 dark:text-white w-6 text-center">
                                                            {item.cantidad}
                                                        </span>
                                                        <button
                                                            onClick={() => carrito.incrementarCantidad(idx)}
                                                            className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <span className="font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                                                        {formatCurrency(item.precio_total)}
                                                    </span>

                                                    {/* Botón eliminar */}
                                                    <button
                                                        onClick={() => {
                                                            carrito.eliminarProducto(idx);
                                                            toast.success('Producto eliminado del carrito');
                                                        }}
                                                        className="px-2 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded transition"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total */}
                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    Total:
                                                </span>
                                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                    {formatCurrency(carrito.calcularTotal())}
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        carrito.limpiarCarrito();
                                                        toast.success('Carrito vaciado');
                                                    }}
                                                    className="flex-1 px-3 py-2 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 size={16} />
                                                    Vaciar
                                                </button>
                                                <button
                                                    onClick={handleGuardarVenta}
                                                    disabled={isSubmitting || !tipoPagoId}
                                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold text-sm rounded transition flex items-center justify-center gap-2"
                                                    title={!tipoPagoId ? 'Selecciona un tipo de pago' : ''}
                                                >
                                                    <Save size={16} />
                                                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                                                </button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
