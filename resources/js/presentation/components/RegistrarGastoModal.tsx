import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import toast from 'react-hot-toast';

const CATEGORIAS_GASTO = {
    'TRANSPORTE': 'Transporte',
    'LIMPIEZA': 'Limpieza',
    'MANTENIMIENTO': 'Mantenimiento',
    'SERVICIOS': 'Servicios',
    'ALIMENTACION_DESAYUNO': '🍳 Desayuno',
    'ALIMENTACION_ALMUERZO': '🍽️ Almuerzo',
    'ALIMENTACION_CENA': '🥘 Cena',
    'ALIMENTACION_REFRIGERIO': '☕ Refrigerio',
    'ALIMENTACION_OTROS': '🍴 Otros Alimentos',
    'VARIOS': 'Varios',
};

const CATEGORIAS_PAGO_SUELDO = {
    'SUELDO': 'Sueldo',
    'BONO': 'Bono',
    'COMISIÓN': 'Comisión',
    'LIQUIDACIÓN': 'Liquidación',
};

const CATEGORIAS_ANTICIPO = {
    'ADELANTO': 'Adelanto de Sueldo',
    'PRÉSTAMO': 'Préstamo a Empleado',
    'OTROS': 'Otros Anticipos',
};

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
                tiposPago: tiposPago,
                total_tipos: tiposOperacion.length,
                total_tipos_entrada: tiposOperacionClasificados.ENTRADA?.length || 0,
                total_tipos_salida: tiposOperacionClasificados.SALIDA?.length || 0,
                total_tipos_ajuste: tiposOperacionClasificados.AJUSTE?.length || 0,
                total_pagos: tiposPago.length,
            });

            // ✅ NUEVO: Seleccionar "Efectivo" por defecto si está disponible
            if (tiposPago && tiposPago.length > 0) {
                const efectivo = tiposPago.find(tipo =>
                    tipo.codigo?.toUpperCase() === 'EFECTIVO' ||
                    tipo.nombre?.toUpperCase() === 'EFECTIVO'
                );
                if (efectivo) {
                    console.log('✅ [RegistrarMovimientoModal] Tipo de pago "Efectivo" seleccionado por defecto:', efectivo);
                    setData('tipo_pago_id', efectivo.id.toString());
                }
            }
        }
    }, [show, tiposOperacion, tiposOperacionClasificados, tiposPago]);

    const { data, setData, post, processing, errors, reset } = useForm({
        tipo_operacion_id: '',
        tipo_pago_id: '',
        monto: '',
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
            tipo_pago_id: data.tipo_pago_id,
            monto: data.monto,
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
                tipo_pago_id: data.tipo_pago_id,
                monto: data.monto,
                numero_documento: data.numero_documento,
                categoria: data.categoria,
                observaciones: data.observaciones,
            }),
        })
        .then(async (response) => {
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al registrar movimiento');
            }

            console.log('✅ [RegistrarMovimientoModal] Movimiento registrado exitosamente en backend:', {
                movimientoId: result.movimiento_id,
                tipoOperacion: result.tipo_operacion,
            });

            toast.success('Movimiento registrado exitosamente');

            // ✅ VALIDAR que el ID fue retornado correctamente
            if (!result.movimiento_id) {
                throw new Error('No se obtuvo movimiento_id del backend');
            }

            console.log('✅ [RegistrarMovimientoModal] ID del movimiento obtenido:', result.movimiento_id);

            // ✅ NUEVO: Crear objeto movimiento con los datos retornados
            const movimientoData = {
                id: result.movimiento_id,
                tipo_operacion: result.tipo_operacion || tipoSeleccionado,
                monto: data.monto,
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
            mostrar_categoria: (esGasto || esPagoSueldo || esAnticipo),
        });
    }, [tipoSeleccionado, esGasto, esPagoSueldo, esAnticipo, data.tipo_operacion_id]);

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

                        <div className="space-y-2">
                            <Label htmlFor="monto" className="text-gray-900 dark:text-gray-100">Monto (Bs) *</Label>
                            <div className="relative">
                                {esEgreso && (
                                    <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 font-semibold">-</span>
                                )}
                                <Input
                                    id="monto"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.monto}
                                    onChange={(e) => setData('monto', e.target.value)}
                                    placeholder="0.00"
                                    className={`text-right dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 ${esEgreso ? 'pl-8' : ''}`}
                                />
                            </div>
                            {errors.monto && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.monto}</p>
                            )}
                            {esEgreso && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Se registrará como egreso (monto negativo)
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tipo_pago_id" className="text-gray-900 dark:text-gray-100">Tipo de Pago</Label>
                            <Select
                                value={data.tipo_pago_id}
                                onValueChange={(value) => setData('tipo_pago_id', value)}
                            >
                                <SelectTrigger className="dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600">
                                    <SelectValue placeholder="Selecciona el tipo de pago (opcional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tiposPago.map((tipo) => (
                                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                            {tipo.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.tipo_pago_id && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.tipo_pago_id}</p>
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
                            disabled={processing || !data.tipo_operacion_id || !data.monto || ((esGasto || esPagoSueldo || esAnticipo) && !data.categoria)}
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
