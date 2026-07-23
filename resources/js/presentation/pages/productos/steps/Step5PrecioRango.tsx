import { PrecioRango, PrecioRangoFormData } from '@/domain/entities/precio-rango';
import NotificationService from '@/infrastructure/services/notification.service';
import { Button } from '@/presentation/components/ui/button';
import { CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import SearchSelect, { SelectOption } from '@/presentation/components/ui/search-select';
import axios from 'axios';
import { AlertCircle, Edit2, Plus, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Step5PrecioRangoProps {
    productoId: number;
    tiposPrecio: Array<{ id: number; nombre: string; codigo: string }>;
    isEditing: boolean;
}

const initialFormData: PrecioRangoFormData = {
    producto_id: 0,
    tipo_precio_id: 0,
    cantidad_minima: 1,
    cantidad_maxima: null,
    fecha_vigencia_inicio: null,
    fecha_vigencia_fin: null,
    activo: true,
    orden: 0,
};

export default function Step5PrecioRango({ productoId, tiposPrecio, isEditing }: Step5PrecioRangoProps) {
    const [rangos, setRangos] = useState<PrecioRango[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof PrecioRangoFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ MOVIDO AL INICIO: data debe estar declarado antes de usarlo en useEffects
    const [data, setData] = useState<PrecioRangoFormData>({
        ...initialFormData,
        producto_id: productoId,
    });

    // Referencia para hacer scroll al formulario
    const formCardRef = useRef<HTMLDivElement>(null);

    // Referencias para los inputs de cantidad (mejora para scanner)
    const cantidadMinRef = useRef<HTMLInputElement>(null);
    const cantidadMaxRef = useRef<HTMLInputElement>(null);

    // 🔍 DEBUG: Verificar que tiposPrecio llegue correctamente
    useEffect(() => {
        console.log('📊 Step5PrecioRango - tiposPrecio recibido:', tiposPrecio);
        console.log('📊 Step5PrecioRango - productoId:', productoId);
        console.log('📊 Step5PrecioRango - isEditing:', isEditing);
    }, [tiposPrecio, productoId, isEditing]);

    // 🔍 DEBUG: Ver los rangos cargados
    useEffect(() => {
        console.log('📈 Step5PrecioRango - rangos actuales:', rangos);
    }, [rangos]);

    // 🔍 DEBUG: Ver cambios en data.tipo_precio_id
    useEffect(() => {
        console.log('💾 data.tipo_precio_id actualizado:', data.tipo_precio_id);
    }, [data.tipo_precio_id]);

    // 📍 Hacer scroll al formulario cuando se abre
    useEffect(() => {
        if (showForm && formCardRef.current) {
            setTimeout(() => {
                formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }, [showForm]);

    // Cargar rangos existentes
    useEffect(() => {
        if (isEditing && productoId) {
            fetchRangos();
        }
    }, [isEditing, productoId]);

    const fetchRangos = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/productos/${productoId}/rangos-precio`);
            console.log('✅ Rangos cargados del API:', response.data.data);
            setRangos(response.data.data || []);
        } catch (error: any) {
            console.error('❌ Error cargando rangos:', error);
            // No mostrar error si es 404 (no hay rangos)
            if (error.response?.status !== 404) {
                NotificationService.error('Error al cargar los rangos de precio');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateField = useCallback(<K extends keyof PrecioRangoFormData>(key: K, value: PrecioRangoFormData[K]) => {
        setData((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    // ✅ MOVIDO FUERA DE RENDERIZACIÓN CONDICIONAL
    const handleTipoPrecioChange = useCallback(
        (value: any) => {
            const tipoPrecioId = parseInt(String(value));
            console.log('🔄 Tipo precio seleccionado:', tipoPrecioId);
            updateField('tipo_precio_id', tipoPrecioId);
        },
        [updateField],
    );

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!data.tipo_precio_id || data.tipo_precio_id === 0) {
            newErrors.tipo_precio_id = 'El tipo de precio es requerido';
        }

        if (!data.cantidad_minima || data.cantidad_minima <= 0) {
            newErrors.cantidad_minima = 'La cantidad mínima debe ser mayor a 0';
        }

        if (data.cantidad_maxima && data.cantidad_maxima < data.cantidad_minima) {
            newErrors.cantidad_maxima = 'La cantidad máxima debe ser >= a la mínima';
        }

        if (data.fecha_vigencia_fin && data.fecha_vigencia_inicio) {
            if (new Date(data.fecha_vigencia_fin) < new Date(data.fecha_vigencia_inicio)) {
                newErrors.fecha_vigencia_fin = 'La fecha fin debe ser posterior a inicio';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            NotificationService.error('Por favor, corrige los errores en el formulario');
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = {
                ...data,
                cantidad_maxima: data.cantidad_maxima ? parseInt(String(data.cantidad_maxima)) : null,
            };

            if (editingId) {
                // Actualizar
                await axios.put(`/api/productos/${productoId}/rangos-precio/${editingId}`, submitData);
                NotificationService.success('Rango actualizado correctamente');
            } else {
                // Crear
                await axios.post(`/api/productos/${productoId}/rangos-precio`, submitData);
                NotificationService.success('Rango creado correctamente');
            }

            // Recargar rangos
            await fetchRangos();
            resetForm();
        } catch (error: any) {
            const message = error.response?.data?.message || (editingId ? 'Error al actualizar' : 'Error al crear') + ' el rango';
            NotificationService.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (rango: PrecioRango) => {
        // Extraer tipo_precio_id del objeto tipo_precio que viene del backend
        const tipoPrecioId = Number((rango.tipo_precio as any)?.id || rango.tipo_precio_id || 0);

        setEditingId(rango.id);
        setData({
            producto_id: rango.producto_id,
            tipo_precio_id: tipoPrecioId,
            cantidad_minima: rango.cantidad_minima,
            cantidad_maxima: rango.cantidad_maxima,
            fecha_vigencia_inicio: rango.fecha_vigencia_inicio,
            fecha_vigencia_fin: rango.fecha_vigencia_fin,
            activo: rango.activo ?? true,
            orden: rango.orden ?? 0,
        });

        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este rango?')) return;

        try {
            await axios.delete(`/api/productos/${productoId}/rangos-precio/${id}`);
            NotificationService.success('Rango eliminado correctamente');
            await fetchRangos();
        } catch (error: any) {
            NotificationService.error('Error al eliminar el rango');
        }
    };

    const resetForm = () => {
        setData({
            ...initialFormData,
            producto_id: productoId,
        });
        setEditingId(null);
        setShowForm(false);
        setErrors({});
    };

    // 🔧 Helper para obtener el tipo de precio (viene del backend en rango.tipo_precio)
    const getTipoPrecio = (rango: any) => {
        return rango.tipo_precio || tiposPrecio.find((t) => t.id === rango.tipo_precio_id);
    };

    if (!isEditing) {
        return (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-950/20">
                <p className="text-sm text-blue-800 dark:text-blue-200">💡 Los rangos de precio estarán disponibles después de crear el producto.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 lg:flex-row">
            {/* TABLA DE RANGOS */}
            <div
                className={`rounded-lg border border-blue-200 bg-blue-50 p-4 transition-all duration-200 dark:border-blue-700 dark:bg-blue-950/20 ${
                    showForm ? 'w-full lg:w-1/2' : 'w-full'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-lg font-semibold">Rangos de Precio</div>
                        {/* <div className="text-sm text-muted-foreground">Configura rangos de cantidad para diferentes tipos de precio</div> */}
                    </div>
                    <Button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        size="sm"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Rango
                    </Button>
                </div>
                <div className="mt-4">
                    {loading ? (
                        <div className="py-8 text-center">Cargando rangos...</div>
                    ) : rangos.length === 0 ? (
                        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                            <p>No hay rangos configurados aún</p>
                            <p className="mt-2 text-sm">Agrega tu primer rango de precio</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-2 py-2 text-center font-semibold">Tipo Precio</th>
                                        <th className="px-2 py-2 text-center font-semibold">Rango</th>
                                        <th className="px-2 py-2 text-center font-semibold">Vigencia</th>
                                        <th className="px-2 py-2 text-center font-semibold">Estado</th>
                                        <th className="px-2 py-2 text-center font-semibold">-</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rangos.map((rango) => (
                                        <tr
                                            key={rango.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                                        >
                                            <td className="px-2 py-2 text-left text-xs">
                                                <div>
                                                    <p className="font-medium text-foreground">{getTipoPrecio(rango)?.nombre || 'N/A'}</p>
                                                    <p className="text-xs text-gray-500">{getTipoPrecio(rango)?.codigo || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 text-center text-xs">
                                                <span className="inline-block rounded bg-blue-100 px-2 py-1 font-semibold text-blue-900 dark:bg-blue-900/40 dark:text-blue-200">
                                                    {rango.cantidad_maxima
                                                        ? `${rango.cantidad_minima}-${rango.cantidad_maxima}`
                                                        : `${rango.cantidad_minima}+`}
                                                </span>
                                            </td>
                                            <td className="px-2 py-2 text-center text-xs">
                                                {rango.fecha_vigencia_inicio || rango.fecha_vigencia_fin ? (
                                                    <span>
                                                        {rango.fecha_vigencia_inicio && new Date(rango.fecha_vigencia_inicio).toLocaleDateString()}
                                                        {rango.fecha_vigencia_inicio && rango.fecha_vigencia_fin && ' → '}
                                                        {rango.fecha_vigencia_fin && new Date(rango.fecha_vigencia_fin).toLocaleDateString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-green-600 dark:text-green-400">Permanente</span>
                                                )}
                                            </td>
                                            <td className="px-2 py-2 text-center text-xs">
                                                <span
                                                    className={`text-xs font-semibold ${rango.activo ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                                                >
                                                    {rango.activo ? '✓ Activo' : '✗ Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-2 py-2 text-center text-xs">
                                                <div className="flex justify-center gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(rango)} className="h-8 w-8 p-0">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(rango.id)}
                                                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* FORMULARIO */}
            {showForm && (
                <div
                    ref={formCardRef}
                    className="w-full rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-950/20 lg:w-1/2"
                >
                    <div>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">{editingId ? '✏️ Editar Rango de Precio' : '➕ Crear Nuevo Rango'}</CardTitle>
                                {editingId && data.tipo_precio_id > 0 && (
                                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                        Rango #<strong>{editingId}</strong> - Tipo:{' '}
                                        <strong>{tiposPrecio.find((t) => t.id === data.tipo_precio_id)?.nombre || 'N/A'}</strong>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* ESTADO DE EDICIÓN */}
                            {editingId && data.tipo_precio_id > 0 && (
                                <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-700 dark:bg-green-950/20">
                                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                            Editando rango para{' '}
                                            <strong>{tiposPrecio.find((t) => t.id === data.tipo_precio_id)?.nombre || 'N/A'}</strong>
                                        </p>
                                        <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                                            Cantidad: <strong>{data.cantidad_minima}</strong>
                                            {data.cantidad_maxima ? `- ${data.cantidad_maxima}` : '+'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* TIPO DE PRECIO */}
                            <div className="space-y-2">
                                {!tiposPrecio || tiposPrecio.length === 0 ? (
                                    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-700 dark:bg-red-950/20">
                                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                                        <div>
                                            <p className="text-sm font-medium text-red-800 dark:text-red-200">No hay tipos de precio disponibles</p>
                                            <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                                                Asegúrate de que existan tipos de precio activos en el sistema.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <SearchSelect
                                        id="tipo-precio"
                                        label="Tipo de Precio *"
                                        placeholder="Selecciona un tipo de precio..."
                                        value={data.tipo_precio_id > 0 ? data.tipo_precio_id : ''}
                                        options={tiposPrecio.map(
                                            (t) =>
                                                ({
                                                    value: t.id,
                                                    label: t.nombre || 'Sin nombre',
                                                    description: `Código: ${t.codigo || 'N/A'}`,
                                                }) as SelectOption,
                                        )}
                                        onChange={handleTipoPrecioChange}
                                        searchPlaceholder="Buscar por nombre o código..."
                                        emptyText="No se encontraron tipos de precio"
                                        error={errors.tipo_precio_id}
                                    />
                                )}
                                {!editingId && data.tipo_precio_id > 0 && (
                                    <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                                        ✓ Tipo de precio seleccionado:{' '}
                                        <strong>{tiposPrecio.find((t) => t.id === data.tipo_precio_id)?.nombre || 'N/A'}</strong>
                                    </p>
                                )}
                            </div>

                            {/* RANGO DE CANTIDAD */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cantidad-min">Cantidad Mínima *</Label>
                                    <Input
                                        ref={cantidadMinRef}
                                        id="cantidad-min"
                                        type="number"
                                        min="1"
                                        value={data.cantidad_minima}
                                        onChange={(e) => {
                                            const valor = parseInt(e.target.value);
                                            if (!isNaN(valor)) {
                                                updateField('cantidad_minima', valor);
                                            }
                                        }}
                                        onFocus={(e) => {
                                            // Seleccionar todo el contenido al hacer focus para mejor UX con scanner
                                            e.target.select();
                                        }}
                                        autoComplete="off"
                                        className={`${errors.cantidad_minima ? 'border-red-500' : ''} transition-colors`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.cantidad_minima && <p className="text-sm text-red-600 dark:text-red-400">{errors.cantidad_minima}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cantidad-max">Cantidad Máxima (opcional)</Label>
                                    <Input
                                        ref={cantidadMaxRef}
                                        id="cantidad-max"
                                        type="number"
                                        placeholder="Dejar vacío para sin límite"
                                        value={data.cantidad_maxima || ''}
                                        onChange={(e) => {
                                            if (e.target.value === '') {
                                                updateField('cantidad_maxima', null);
                                            } else {
                                                const valor = parseInt(e.target.value);
                                                if (!isNaN(valor)) {
                                                    updateField('cantidad_maxima', valor);
                                                }
                                            }
                                        }}
                                        onFocus={(e) => {
                                            // Seleccionar todo el contenido al hacer focus para mejor UX con scanner
                                            e.target.select();
                                        }}
                                        autoComplete="off"
                                        className={`${errors.cantidad_maxima ? 'border-red-500' : ''} transition-colors`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.cantidad_maxima && <p className="text-sm text-red-600 dark:text-red-400">{errors.cantidad_maxima}</p>}
                                </div>
                            </div>

                            {/* VIGENCIA */}
                            {/* <div className="space-y-3 border-t dark:border-gray-700 pt-4">
                <h3 className="font-semibold text-sm dark:text-white">Vigencia (opcional)</h3>
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fecha-inicio">Fecha Inicio</Label>
                    <Input
                      id="fecha-inicio"
                      type="date"
                      value={data.fecha_vigencia_inicio || ''}
                      onChange={(e) =>
                        updateField('fecha_vigencia_inicio', e.target.value || null)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha-fin">Fecha Fin</Label>
                    <Input
                      id="fecha-fin"
                      type="date"
                      value={data.fecha_vigencia_fin || ''}
                      onChange={(e) =>
                        updateField('fecha_vigencia_fin', e.target.value || null)
                      }
                      className={errors.fecha_vigencia_fin ? 'border-red-500' : ''}
                    />
                    {errors.fecha_vigencia_fin && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.fecha_vigencia_fin}</p>
                    )}
                  </div>
                </div>
              </div> */}

                            {/* CONFIGURACIÓN */}
                            {/* <div className="space-y-3 border-t dark:border-gray-700 pt-4">
                <h3 className="font-semibold text-sm dark:text-white">Configuración</h3>

                <div className="space-y-2">
                  <Label htmlFor="orden">Orden de Aplicación</Label>
                  <Input
                    id="orden"
                    type="number"
                    min="0"
                    value={data.orden}
                    onChange={(e) => updateField('orden', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Menor número = mayor prioridad</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="activo"
                    checked={data.activo}
                    onCheckedChange={(checked) => updateField('activo', checked === true)}
                  />
                  <Label htmlFor="activo" className="cursor-pointer dark:text-gray-300">
                    Rango activo
                  </Label>
                </div>
              </div> */}

                            {/* BOTONES */}
                            <div className="flex gap-3 border-t pt-4 dark:border-gray-700">
                                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="flex-1">
                                    {isSubmitting ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
