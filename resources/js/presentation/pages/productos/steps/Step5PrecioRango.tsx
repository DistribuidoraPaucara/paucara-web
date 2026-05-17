import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import SearchSelect, { SelectOption } from '@/presentation/components/ui/search-select';
import { AlertCircle, Plus, Trash2, Edit2 } from 'lucide-react';
import { PrecioRango, PrecioRangoFormData } from '@/domain/entities/precio-rango';
import NotificationService from '@/infrastructure/services/notification.service';
import axios from 'axios';

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

export default function Step5PrecioRango({
  productoId,
  tiposPrecio,
  isEditing,
}: Step5PrecioRangoProps) {
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
    setData(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // ✅ MOVIDO FUERA DE RENDERIZACIÓN CONDICIONAL
  const handleTipoPrecioChange = useCallback((value: any) => {
    const tipoPrecioId = parseInt(String(value));
    console.log('🔄 Tipo precio seleccionado:', tipoPrecioId);
    updateField('tipo_precio_id', tipoPrecioId);
  }, [updateField]);

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
    const tipoPrecioId = Number(
      (rango.tipo_precio as any)?.id || rango.tipo_precio_id || 0
    );

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
      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 Los rangos de precio estarán disponibles después de crear el producto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* TABLA DE RANGOS */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rangos de Precio</CardTitle>
              <CardDescription>Configura rangos de cantidad para diferentes tipos de precio</CardDescription>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Rango
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando rangos...</div>
          ) : rangos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No hay rangos configurados aún</p>
              <p className="text-sm mt-2">Agrega tu primer rango de precio</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left py-2 px-3 font-semibold">Tipo Precio</th>
                    <th className="text-center py-2 px-3 font-semibold">Rango</th>
                    <th className="text-left py-2 px-3 font-semibold">Vigencia</th>
                    <th className="text-center py-2 px-3 font-semibold">Estado</th>
                    <th className="text-center py-2 px-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rangos.map((rango) => (
                    <tr key={rango.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-medium text-foreground">{getTipoPrecio(rango)?.nombre || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{getTipoPrecio(rango)?.codigo || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 px-2 py-1 rounded font-semibold">
                          {rango.cantidad_maxima ? `${rango.cantidad_minima}-${rango.cantidad_maxima}` : `${rango.cantidad_minima}+`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs">
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
                      <td className="py-3 px-3 text-center">
                        <span className={`text-xs font-semibold ${rango.activo ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {rango.activo ? '✓ Activo' : '✗ Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(rango)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(rango.id)}
                            className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FORMULARIO */}
      {showForm && (
        <Card ref={formCardRef} className="border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  {editingId ? '✏️ Editar Rango de Precio' : '➕ Crear Nuevo Rango'}
                </CardTitle>
                {editingId && data.tipo_precio_id > 0 && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Rango #<strong>{editingId}</strong> - Tipo: <strong>{tiposPrecio.find(t => t.id === data.tipo_precio_id)?.nombre || 'N/A'}</strong>
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ESTADO DE EDICIÓN */}
              {editingId && data.tipo_precio_id > 0 && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Editando rango para <strong>{tiposPrecio.find(t => t.id === data.tipo_precio_id)?.nombre || 'N/A'}</strong>
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Cantidad: <strong>{data.cantidad_minima}</strong>{data.cantidad_maxima ? `- ${data.cantidad_maxima}` : '+'}
                    </p>
                  </div>
                </div>
              )}

              {/* TIPO DE PRECIO */}
              <div className="space-y-2">
                {!tiposPrecio || tiposPrecio.length === 0 ? (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-700 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">No hay tipos de precio disponibles</p>
                      <p className="text-xs text-red-700 dark:text-red-300 mt-1">
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
                    options={tiposPrecio.map((t) => ({
                      value: t.id,
                      label: t.nombre || 'Sin nombre',
                      description: `Código: ${t.codigo || 'N/A'}`,
                    } as SelectOption))}
                    onChange={handleTipoPrecioChange}
                    searchPlaceholder="Buscar por nombre o código..."
                    emptyText="No se encontraron tipos de precio"
                    error={errors.tipo_precio_id}
                  />
                )}
                {!editingId && data.tipo_precio_id > 0 && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✓ Tipo de precio seleccionado: <strong>{tiposPrecio.find(t => t.id === data.tipo_precio_id)?.nombre || 'N/A'}</strong>
                  </p>
                )}
              </div>

              {/* RANGO DE CANTIDAD */}
              <div className="grid gap-4 grid-cols-2">
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
                  {errors.cantidad_minima && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.cantidad_minima}</p>
                  )}
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
                  {errors.cantidad_maxima && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.cantidad_maxima}</p>
                  )}
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
              <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
