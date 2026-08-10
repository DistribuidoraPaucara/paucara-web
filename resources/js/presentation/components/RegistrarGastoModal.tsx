import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import toast from 'react-hot-toast';
import { CATEGORIAS_GASTO, CATEGORIAS_PAGO_SUELDO, CATEGORIAS_ANTICIPO } from '@/constants/categorias-gasto';

interface TipoOperacion {
    id: number;
    codigo: string;
    nombre: string;
}

interface TipoPago {
    id: number;
    codigo: string;
    nombre: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
    tiposOperacion?: TipoOperacion[];
    tiposOperacionClasificados?: Record<string, TipoOperacion[]>;
    tiposPago?: TipoPago[];
    onSuccessWithMovement?: (movimiento: any) => void; // ✅ NUEVO: Callback cuando se registra exitosamente
}

export default function RegistrarMovimientoModal({
    show,
    onClose,
    tiposOperacion = [],
    tiposOperacionClasificados = { ENTRADA: [], SALIDA: [], AJUSTE: [] },
    tiposPago = [],
    onSuccessWithMovement // ✅ NUEVO: Callback para pasar el movimiento registrado
}: Props) {
    // ✅ DEBUG: Log cuando el modal se abre
    useEffect(() => {
        if (show) {
            console.log('📋 [RegistrarMovimientoModal] Modal abierto con props:', {
                tiposOperacion: tiposOperacion,
                tiposOperacionClasificados: tiposOperacionClasificados,
                total_tipos: tiposOperacion.length,
                total_tipos_entrada: tiposOperacionClasificados.ENTRADA?.length || 0,
                total_tipos_salida: tiposOperacionClasificados.SALIDA?.length || 0,
                total_tipos_ajuste: tiposOperacionClasificados.AJUSTE?.length || 0,
            });
        }
    }, [show, tiposOperacion, tiposOperacionClasificados]);

    const { data, setData, post, processing, errors, reset } = useForm({
        tipo_operacion_id: '',
        monto_efectivo: '',
        monto_transferencia: '',
        numero_documento: '',
        categoria: '',
        observaciones: '',
        comprobante: null as File | null,
    });

    const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoOperacion | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    useEffect(() => {
        if (data.tipo_operacion_id && tiposOperacion) {
            const tipo = tiposOperacion.find(t => t.id.toString() === data.tipo_operacion_id);
            setTipoSeleccionado(tipo || null);
            console.log('🔍 [RegistrarMovimientoModal] Tipo seleccionado:', {
                tipo_id: data.tipo_operacion_id,
                tipo_nombre: tipo?.nombre,
                tipo_codigo: tipo?.codigo,
                total_tipos_disponibles: tiposOperacion.length,
            });
        }
    }, [data.tipo_operacion_id, tiposOperacion]);

    // Calcular monto total
    const montoEfectivo = parseFloat(data.monto_efectivo) || 0;
    const montoTransferencia = parseFloat(data.monto_transferencia) || 0;
    const montoTotal = montoEfectivo + montoTransferencia;

    // Filtrar tipos de operación válidos (excluir APERTURA y CIERRE que tienen sus propios modales)
    const tiposOperacionValidos = tiposOperacion.filter(tipo =>
        !['APERTURA', 'CIERRE'].includes(tipo.codigo)
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('📤 [RegistrarMovimientoModal] Enviando movimiento:', {
            tipo_operacion_id: data.tipo_operacion_id,
            tipo_operacion_nombre: tipoSeleccionado?.nombre,
            tipo_operacion_codigo: tipoSeleccionado?.codigo,
            monto_efectivo: data.monto_efectivo,
            monto_transferencia: data.monto_transferencia,
            categoria: data.categoria,
            numero_documento: data.numero_documento,
            observaciones: data.observaciones,
            tiene_comprobante: !!data.comprobante,
            comprobante_nombre: data.comprobante?.name,
        });

        // ✅ NUEVO: Usar endpoint JSON en lugar de Inertia
        fetch('/cajas/movimientos-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            },
            body: JSON.stringify({
                tipo_operacion_id: data.tipo_operacion_id,
                monto_efectivo: data.monto_efectivo ? parseFloat(data.monto_efectivo) : 0,
                monto_transferencia: data.monto_transferencia ? parseFloat(data.monto_transferencia) : 0,
                numero_documento: data.numero_documento,
                categoria: data.categoria,
                observaciones: data.observaciones,
            }),
        })
        .then(async (response) => {
            let result;
            const contentType = response.headers.get('content-type');

            // Intentar parsear como JSON
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                // Si no es JSON, es probablemente un error HTML
                const text = await response.text();
                console.error('❌ [RegistrarMovimientoModal] Respuesta no-JSON del backend:', text.substring(0, 200));
                throw new Error(`Error del servidor (${response.status}): Respuesta inválida`);
            }

            if (!response.ok) {
                const errorMessage = result.message || result.errors || 'Error al registrar movimiento';
                console.error('❌ [RegistrarMovimientoModal] Error en respuesta:', {
                    status: response.status,
                    message: errorMessage,
                    errors: result.errors,
                    fullResponse: result,
                });
                throw new Error(errorMessage);
            }

            console.log('✅ [RegistrarMovimientoModal] Movimiento(s) registrado(s) exitosamente en backend:', {
                movimientosIds: result.movimientos_ids,
                movimientosCount: result.movimientos_count,
                tipoOperacion: result.tipo_operacion,
            });

            const mensaje = result.movimientos_count > 1
                ? `${result.movimientos_count} movimientos registrados exitosamente`
                : 'Movimiento registrado exitosamente';
            toast.success(mensaje);

            // ✅ VALIDAR que al menos un ID fue retornado correctamente
            if (!result.movimientos_ids || result.movimientos_ids.length === 0) {
                throw new Error('No se obtuvo ID de movimiento del backend');
            }

            console.log('✅ [RegistrarMovimientoModal] IDs de movimientos obtenidos:', result.movimientos_ids);

            // ✅ NUEVO: Crear objeto movimiento con los datos retornados
            const montoTotal = (parseFloat(data.monto_efectivo) || 0) + (parseFloat(data.monto_transferencia) || 0);
            const movimientoData = {
                ids: result.movimientos_ids,
                tipo_operacion: result.tipo_operacion || tipoSeleccionado,
                monto_total: montoTotal,
                movimientos_count: result.movimientos_count,
                observaciones: data.observaciones,
            };

            // ✅ NUEVO: Llamar callback con el movimiento
            if (onSuccessWithMovement) {
                console.log('📤 [RegistrarMovimientoModal] Pasando movimiento al callback:', movimientoData);
                onSuccessWithMovement(movimientoData);
            }

            reset();
            onClose();
        })
        .catch((error) => {
            console.error('❌ [RegistrarMovimientoModal] Error en respuesta del backend:', error);
            toast.error(error.message || 'Error al registrar movimiento');
        });
    };

    const getColorButton = () => {
        if (!tipoSeleccionado) return 'bg-gray-600 dark:bg-gray-700';
        switch (tipoSeleccionado.codigo) {
            case 'GASTOS':
            case 'COMPRA':
                return 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800';
            case 'PAGO_SUELDO':
            case 'ANTICIPO':
                return 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800';
            case 'AJUSTE':
                return 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800';
            default:
                return 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800';
        }
    };

    const getEmoji = () => {
        if (!tipoSeleccionado) return '💱';
        switch (tipoSeleccionado.codigo) {
            case 'GASTOS':
                return '💸';
            case 'COMPRA':
                return '🛒';
            case 'PAGO_SUELDO':
                return '💰';
            case 'ANTICIPO':
                return '🤑';
            case 'AJUSTE':
                return '🔧';
            default:
                return '💱';
        }
    };

    const esGasto = tipoSeleccionado?.codigo === 'GASTOS';
    const esPagoSueldo = tipoSeleccionado?.codigo === 'PAGO_SUELDO';
    const esAnticipo = tipoSeleccionado?.codigo === 'ANTICIPO';
    const esEgreso = ['GASTOS', 'COMPRA', 'PAGO_SUELDO', 'ANTICIPO'].includes(tipoSeleccionado?.codigo || '');

    // ✅ DEBUG: Log para verificar estado de tipoSeleccionado
    useEffect(() => {
        console.log('🎯 [RegistrarMovimientoModal] Estado actual:', {
            tipoSeleccionado: tipoSeleccionado,
            tipoSeleccionado_codigo: tipoSeleccionado?.codigo,
            esGasto: esGasto,
            esPagoSueldo: esPagoSueldo,
            esAnticipo: esAnticipo,
            esEgreso: esEgreso,
            data_tipo_operacion_id: data.tipo_operacion_id,
            data_categoria: data.categoria,
            monto_efectivo: data.monto_efectivo,
            monto_transferencia: data.monto_transferencia,
            monto_total: montoTotal,
            mostrar_categoria: (esGasto || esPagoSueldo || esAnticipo),
        });
    }, [tipoSeleccionado, esGasto, esPagoSueldo, esAnticipo, data.tipo_operacion_id, montoTotal]);

    const handleArchivoSeleccionado = (e: React.ChangeEvent<HTMLInputElement>) => {
        const archivo = e.target.files?.[0];
        if (archivo) {
            // Validar tamaño (máximo 10MB)
            if (archivo.size > 10 * 1024 * 1024) {
                toast.error('El archivo no debe superar 10MB');
                return;
            }

            // Validar tipo de archivo
            const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
            if (!tiposPermitidos.includes(archivo.type)) {
                toast.error('Solo se permiten JPG, PNG, WebP o PDF');
                return;
            }

            setData('comprobante', archivo);

            // Crear preview para imágenes
            if (archivo.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewURL(reader.result as string);
                };
                reader.readAsDataURL(archivo);
            } else {
                setPreviewURL(null);
            }
        }
    };

    const limpiarArchivo = () => {
        setData('comprobante', null);
        setPreviewURL(null);
    };

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        {getEmoji()} Registrar Movimiento de Caja
                    </DialogTitle>
                    <DialogDescription>
                        {tipoSeleccionado ? `Registra un ${tipoSeleccionado.nombre.toLowerCase()} en la caja abierta.` : 'Selecciona el tipo de movimiento a registrar.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="space-y-4 px-6 overflow-y-auto flex-1">
                        <div className="space-y-2">
                            <Label htmlFor="tipo_operacion_id" className="text-gray-900 dark:text-gray-100">Tipo de Movimiento *</Label>
                            <Select
                                value={data.tipo_operacion_id}
                                onValueChange={(value) => setData('tipo_operacion_id', value)}
                            >
                                <SelectTrigger className="dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600">
                                    <SelectValue placeholder="Selecciona el tipo de movimiento" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* ENTRADA - Ingresos de dinero */}
                                    {tiposOperacionClasificados.ENTRADA && tiposOperacionClasificados.ENTRADA.length > 0 && (
                                        <>
                                            <div className="px-2 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20">
                                                📥 ENTRADA - Ingresos
                                            </div>
                                            {tiposOperacionClasificados.ENTRADA.map((tipo) => (
                                                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                                    {tipo.nombre}
                                                </SelectItem>
                                            ))}
                                        </>
                                    )}

                                    {/* SALIDA - Egresos de dinero */}
                                    {tiposOperacionClasificados.SALIDA && tiposOperacionClasificados.SALIDA.length > 0 && (
                                        <>
                                            <div className="px-2 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
                                                📤 SALIDA - Egresos
                                            </div>
                                            {tiposOperacionClasificados.SALIDA.map((tipo) => (
                                                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                                    {tipo.nombre}
                                                </SelectItem>
                                            ))}
                                        </>
                                    )}

                                    {/* AJUSTE - Operaciones especiales */}
                                    {tiposOperacionClasificados.AJUSTE && tiposOperacionClasificados.AJUSTE.length > 0 && (
                                        <>
                                            <div className="px-2 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20">
                                                🔧 AJUSTE - Especiales
                                            </div>
                                            {tiposOperacionClasificados.AJUSTE.map((tipo) => (
                                                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                                    {tipo.nombre}
                                                </SelectItem>
                                            ))}
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.tipo_operacion_id && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.tipo_operacion_id}</p>
                            )}
                        </div>

                        {/* Campo de categoría según tipo de movimiento */}
                        {(esGasto || esPagoSueldo || esAnticipo) && (
                            <div className="space-y-2">
                                <Label htmlFor="categoria" className="text-gray-900 dark:text-gray-100">
                                    {esGasto ? 'Categoría de Gastos' : esPagoSueldo ? 'Tipo de Pago de Sueldo' : 'Tipo de Anticipo'} *
                                </Label>
                                <Select
                                    value={data.categoria}
                                    onValueChange={(value) => setData('categoria', value)}
                                >
                                    <SelectTrigger className="dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600">
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(
                                            esGasto ? CATEGORIAS_GASTO :
                                            esPagoSueldo ? CATEGORIAS_PAGO_SUELDO :
                                            CATEGORIAS_ANTICIPO
                                        ).map(([codigo, nombre]) => (
                                            <SelectItem key={codigo} value={codigo}>
                                                {nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoria && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.categoria}</p>
                                )}
                            </div>
                        )}

                        {/* Monto Efectivo y Transferencia */}
                        <div className="space-y-3">
                            <Label className="text-gray-900 dark:text-gray-100 font-semibold">Montos por Tipo de Pago</Label>

                            {/* Monto Efectivo */}
                            <div className="space-y-2">
                                <Label htmlFor="monto_efectivo" className="text-gray-900 dark:text-gray-100">
                                    💵 Efectivo (Bs)
                                </Label>
                                <div className="relative">
                                    {esEgreso && (
                                        <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 font-semibold">-</span>
                                    )}
                                    <Input
                                        id="monto_efectivo"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.monto_efectivo}
                                        onChange={(e) => setData('monto_efectivo', e.target.value)}
                                        placeholder="0.00"
                                        className={`text-right dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 ${esEgreso ? 'pl-8' : ''}`}
                                    />
                                </div>
                            </div>

                            {/* Monto Transferencia/QR */}
                            <div className="space-y-2">
                                <Label htmlFor="monto_transferencia" className="text-gray-900 dark:text-gray-100">
                                    🔄 Transferencia/QR (Bs)
                                </Label>
                                <div className="relative">
                                    {esEgreso && (
                                        <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 font-semibold">-</span>
                                    )}
                                    <Input
                                        id="monto_transferencia"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.monto_transferencia}
                                        onChange={(e) => setData('monto_transferencia', e.target.value)}
                                        placeholder="0.00"
                                        className={`text-right dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 ${esEgreso ? 'pl-8' : ''}`}
                                    />
                                </div>
                            </div>

                            {/* Total */}
                            {montoTotal > 0 && (
                                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                                        💰 Total: Bs {montoTotal.toFixed(2)}
                                    </p>
                                </div>
                            )}

                            {esEgreso && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Se registrará como egreso (montos negativos)
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numero_documento" className="text-gray-900 dark:text-gray-100">Número de Comprobante / Referencia</Label>
                            <Input
                                id="numero_documento"
                                type="text"
                                value={data.numero_documento}
                                onChange={(e) => setData('numero_documento', e.target.value)}
                                placeholder="Ej: FAC-001, REC-123, CMP-456"
                                className="dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                            />
                            {errors.numero_documento && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.numero_documento}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="observaciones" className="text-gray-900 dark:text-gray-100">Detalles / Notas</Label>
                            <Textarea
                                id="observaciones"
                                value={data.observaciones}
                                onChange={(e) => setData('observaciones', e.target.value)}
                                placeholder="Descripción, proveedor, notas, detalles, etc."
                                rows={3}
                                className="dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                            />
                            {errors.observaciones && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.observaciones}</p>
                            )}
                        </div>

                        {/* Comprobante - Referencial */}
                        <div className="space-y-2">
                            <Label htmlFor="comprobante" className="flex items-center text-gray-900 dark:text-gray-100">
                                📎 Comprobante (Opcional)
                            </Label>

                            {data.comprobante ? (
                                <div className="border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl">
                                                {data.comprobante.type.startsWith('image/') ? '🖼️' : '📄'}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {data.comprobante.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {(data.comprobante.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={limpiarArchivo}
                                            className="ml-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm"
                                        >
                                            ❌ Quitar
                                        </button>
                                    </div>

                                    {previewURL && (
                                        <img
                                            src={previewURL}
                                            alt="Preview comprobante"
                                            className="w-full h-32 object-cover rounded border border-green-300 dark:border-green-700"
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-indigo-500 dark:hover:border-indigo-400 transition">
                                    <label htmlFor="comprobante" className="cursor-pointer">
                                        <div className="text-center">
                                            <p className="text-3xl mb-2">📸</p>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Haz clic para seleccionar o arrastra un archivo
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                JPG, PNG, WebP o PDF (máx. 10MB)
                                            </p>
                                        </div>
                                    </label>
                                    <input
                                        id="comprobante"
                                        type="file"
                                        onChange={handleArchivoSeleccionado}
                                        accept="image/jpeg,image/png,image/webp,application/pdf"
                                        className="hidden"
                                    />
                                </div>
                            )}
                            {errors.comprobante && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.comprobante}</p>
                            )}
                            <br />
                        </div>
                    </div>

                    {/* Botones fijos al final */}
                    <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end space-x-2 bg-white dark:bg-gray-800 flex-shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.tipo_operacion_id || montoTotal <= 0 || ((esGasto || esPagoSueldo || esAnticipo) && !data.categoria)}
                            className={getColorButton()}
                        >
                            {processing ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registrando...
                                </span>
                            ) : (
                                `${getEmoji()} Registrar Movimiento`
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
