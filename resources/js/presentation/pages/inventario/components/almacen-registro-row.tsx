import React, { useState, useMemo } from 'react';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select';
import { AlertCircle, Check, Save, Zap } from 'lucide-react';
import {
    AlmacenRegistroRowProps
} from '@/domain/entities/inventario-inicial';

// const DEBOUNCE_MS = 500;

// Función para convertir ISO 8601 a formato YYYY-MM-DD para input date
const convertirFechaAlFormato = (fecha?: string | null): string => {
    if (!fecha) return '';
    try {
        // Si la fecha es ISO (2027-05-31T04:00:00.000000Z), extraer solo la fecha
        if (fecha.includes('T')) {
            return fecha.split('T')[0];
        }
        // Si ya está en formato YYYY-MM-DD, devolver como está
        return fecha;
    } catch {
        return '';
    }
};

export default function AlmacenRegistroRow({
    producto,
    almacen,
    item,
    onGuardarItem,
    mostrarNombreAlmacen = true,
}: AlmacenRegistroRowProps) {
    const [cantidad, setCantidad] = useState<string>(item?.cantidad?.toString() || '');
    const [lote, setLote] = useState<string>(item?.lote || '');
    const [fechaVencimiento, setFechaVencimiento] = useState<string>(
        convertirFechaAlFormato(item?.fecha_vencimiento)
    );

    // Estado para unidad seleccionada (si es producto fraccionado)
    const [unidadSeleccionadaId, setUnidadSeleccionadaId] = useState<number | null>(
        producto?.unidad_medida_id ? Number(producto.unidad_medida_id) : null
    );

    const [estado, setEstado] = useState<'idle' | 'guardando' | 'error' | 'pendiente'>('idle');
    const [errorMsg, setErrorMsg] = useState<string>('');

    const handleCantidadChange = (value: string) => {
        // Validación: si hay cantidad, debe ser número positivo
        if (value && isNaN(Number(value))) {
            setEstado('error');
            setErrorMsg('Cantidad debe ser un número');
            return;
        }

        if (value && Number(value) < 0) {
            setEstado('error');
            setErrorMsg('Cantidad no puede ser negativa');
            return;
        }

        setCantidad(value);
        setEstado('pendiente');
        setErrorMsg('');
    };

    const handleLoteChange = (value: string) => {
        setLote(value);
        setEstado('pendiente');
        setErrorMsg('');
    };

    const handleFechaChange = (value: string) => {
        setFechaVencimiento(value);
        setEstado('pendiente');
        setErrorMsg('');
    };

    // Obtener unidades disponibles para conversión
    const unidadesDisponibles = useMemo(() => {
        if (!producto?.es_fraccionado || !Array.isArray(producto?.conversiones)) {
            return [];
        }

        // Unidad base del producto
        const unidades = producto.unidad_medida
            ? [{ id: producto.unidad_medida_id, nombre: producto.unidad_medida.nombre, codigo: producto.unidad_medida.codigo }]
            : [];

        // Agregar unidades de destino desde conversiones activas
        const unidadesDestino = producto.conversiones
            .filter((c: any) => c.activo && c.unidad_destino)
            .map((c: any) => ({
                id: c.unidad_destino.id,
                nombre: c.unidad_destino.nombre,
                codigo: c.unidad_destino.codigo,
            }));

        // Eliminar duplicados
        const unidadesUnicas = [
            ...unidades,
            ...unidadesDestino.filter(
                (ud: any) => !unidades.some((u: any) => u.id === ud.id)
            ),
        ];

        return unidadesUnicas;
    }, [producto]);

    // Convertir cantidad entre unidades
    const convertirCantidad = (cantidadActual: number, desdeUnidadId: number | null, hastaUnidadId: number | null): number => {
        if (!cantidadActual || desdeUnidadId === hastaUnidadId || !desdeUnidadId || !hastaUnidadId) {
            return cantidadActual;
        }

        if (!producto?.es_fraccionado || !Array.isArray(producto?.conversiones)) {
            return cantidadActual;
        }

        // Buscar la conversión activa
        const conversion = producto.conversiones.find(
            (c: any) =>
                c.activo &&
                c.unidad_base_id === desdeUnidadId &&
                c.unidad_destino_id === hastaUnidadId
        );

        if (conversion) {
            return cantidadActual * conversion.factor_conversion;
        }

        // Intentar conversión inversa
        const conversionInversa = producto.conversiones.find(
            (c: any) =>
                c.activo &&
                c.unidad_base_id === hastaUnidadId &&
                c.unidad_destino_id === desdeUnidadId
        );

        if (conversionInversa) {
            return cantidadActual / conversionInversa.factor_conversion;
        }

        return cantidadActual;
    };

    // Manejar cambio de unidad
    const handleUnidadChange = (nuevoUnidadId: string) => {
        const nuevoId = Number(nuevoUnidadId);
        if (cantidad && unidadSeleccionadaId && nuevoId !== unidadSeleccionadaId) {
            const cantidadConvertida = convertirCantidad(
                Number(cantidad),
                unidadSeleccionadaId,
                nuevoId
            );
            setCantidad(cantidadConvertida.toString());
        }
        setUnidadSeleccionadaId(nuevoId);
        setEstado('pendiente');
        setErrorMsg('');
    };

    const guardarItem = async () => {
        try {
            setEstado('guardando');
            setErrorMsg('');

            // Si es producto fraccionado y se cambió la unidad, convertir a unidad base
            let cantidadAGuardar = cantidad ? Number(cantidad) : undefined;
            if (
                producto?.es_fraccionado &&
                unidadSeleccionadaId &&
                producto?.unidad_medida_id &&
                unidadSeleccionadaId !== producto.unidad_medida_id
            ) {
                cantidadAGuardar = convertirCantidad(
                    Number(cantidad),
                    unidadSeleccionadaId,
                    Number(producto.unidad_medida_id)
                );
            }

            await onGuardarItem(
                producto.id,
                almacen.id,
                cantidadAGuardar,
                lote || undefined,
                fechaVencimiento || undefined
            );

            setEstado('idle');
        } catch (error) {
            setEstado('error');
            setErrorMsg(
                error instanceof Error ? error.message : 'Error guardando item'
            );
        }
    };

    const hayDatos = cantidad || lote || fechaVencimiento;

    return (
        <div className="px-3 sm:px-4 py-3">
            {/* Nombre del almacén - visible solo en la primera fila */}
            {mostrarNombreAlmacen && (
                <div className="mb-3 sm:hidden">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            🏢 {almacen.nombre}
                        </p>
                        {item?.es_actualizacion && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                Stock actual
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Grid responsivo: 2 columnas en móvil, 6 en desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-3 items-start">
                {/* Nombre del almacén - desktop solo */}
                <div className="hidden sm:block col-span-1">
                    {mostrarNombreAlmacen ? (
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                🏢 {almacen.nombre}
                            </p>
                            {item?.es_actualizacion && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded whitespace-nowrap">
                                    Stock actual
                                </span>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Cantidad con selector de unidades */}
                <div className="col-span-1">
                    {producto?.es_fraccionado && unidadesDisponibles.length > 1 ? (
                        <div className="flex gap-1">
                            <Input
                                type="number"
                                placeholder="Cantidad"
                                value={cantidad}
                                onChange={(e) => handleCantidadChange(e.target.value)}
                                className="text-xs sm:text-sm h-8 sm:h-9 flex-1"
                                disabled={estado === 'guardando'}
                                min="0"
                                step="0.01"
                            />
                            <Select value={unidadSeleccionadaId?.toString() || ''} onValueChange={handleUnidadChange}>
                                <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-9 w-20 sm:w-24">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {unidadesDisponibles.map((u) => (
                                        <SelectItem key={u.id} value={u.id.toString()}>
                                            {u.codigo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="flex gap-1 items-center">
                            <Input
                                type="number"
                                placeholder="Cantidad"
                                value={cantidad}
                                onChange={(e) => handleCantidadChange(e.target.value)}
                                className="text-xs sm:text-sm h-8 sm:h-9 flex-1"
                                disabled={estado === 'guardando'}
                                min="0"
                                step="0.01"
                            />
                            {producto?.unidad_medida && (
                                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium min-w-fit whitespace-nowrap">
                                    {producto.unidad_medida.codigo}
                                </span>
                            )}
                        </div>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400">Cant.</label>
                        {producto?.es_fraccionado && (
                            <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                                <Zap className="h-2.5 w-2.5" />
                                Fraccionado
                            </span>
                        )}
                    </div>
                </div>

                {/* Lote */}
                <div className="col-span-1">
                    <Input
                        type="text"
                        placeholder="Lote"
                        value={lote}
                        onChange={(e) => handleLoteChange(e.target.value)}
                        className="text-xs sm:text-sm h-8 sm:h-9"
                        disabled={estado === 'guardando'}
                    />
                    <label className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Lote</label>
                </div>

                {/* Fecha vencimiento */}
                <div className="col-span-1">
                    <Input
                        type="date"
                        value={fechaVencimiento}
                        onChange={(e) => handleFechaChange(e.target.value)}
                        className="text-xs sm:text-sm h-8 sm:h-9"
                        disabled={estado === 'guardando'}
                    />
                    <label className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Venc.</label>
                </div>

                {/* Estado de cambios y Botón Guardar */}
                <div className="col-span-1 flex justify-end items-center gap-1">
                    {estado === 'guardando' ? (
                        <div className="h-5 w-5 sm:h-6 sm:w-6 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    ) : estado === 'error' ? (
                        <div title={errorMsg} className="h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 dark:text-red-400" />
                        </div>
                    ) : estado === 'pendiente' ? (
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                            <div className="h-2 w-2 bg-yellow-500 dark:bg-yellow-400 rounded-full flex-shrink-0" />
                            <span className="text-yellow-600 dark:text-yellow-400 font-medium hidden sm:inline">Pendiente</span>
                        </div>
                    ) : hayDatos ? (
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                    ) : null}
                </div>

                {/* Botón Guardar */}
                <div className="col-span-1 sm:col-span-1 flex justify-end">
                    <Button
                        size="sm"
                        onClick={guardarItem}
                        disabled={!hayDatos || estado === 'guardando' || estado === 'error'}
                        className="gap-1 text-xs sm:text-sm h-8 sm:h-9 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                        title="Guardar este almacén"
                    >
                        <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Guardar</span>
                    </Button>
                </div>
            </div>

            {/* Error message */}
            {estado === 'error' && errorMsg && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-2">{errorMsg}</p>
            )}
        </div>
    );
}
