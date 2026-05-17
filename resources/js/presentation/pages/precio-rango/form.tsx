import React, { useState, useEffect } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/presentation/components/ui/alert';
import SearchSelect, { SelectOption } from '@/presentation/components/ui/search-select';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { PrecioRango, PrecioRangoFormData } from '@/domain/entities/precio-rango';
import precioRangoService from '@/infrastructure/services/precio-rango.service';
import { NotificationService } from '@/infrastructure/services/notification.service';
import axios from 'axios';

interface PrecioRangoFormPageProps {
  rango?: PrecioRango;
  productos: Array<{ id: number; nombre: string; sku: string }>;
  tiposPrecio: Array<{ id: number; nombre: string; codigo: string }>;
  productoId?: number;
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

export default function PrecioRangoForm({
  rango,
  productos,
  tiposPrecio,
  productoId,
}: PrecioRangoFormPageProps) {
  const page = usePage();
  const isEditing = !!rango;
  const [errors, setErrors] = useState<Partial<Record<keyof PrecioRangoFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState<PrecioRangoFormData>({
    producto_id: rango?.producto_id || productoId || 0,
    tipo_precio_id: rango?.tipo_precio_id || 0,
    cantidad_minima: rango?.cantidad_minima || 1,
    cantidad_maxima: rango?.cantidad_maxima || null,
    fecha_vigencia_inicio: rango?.fecha_vigencia_inicio || null,
    fecha_vigencia_fin: rango?.fecha_vigencia_fin || null,
    activo: rango?.activo !== false,
    orden: rango?.orden || 0,
  });

  // Helper para actualizar campos individuales del formulario
  const updateField = <K extends keyof PrecioRangoFormData>(key: K, value: PrecioRangoFormData[K]) => {
    setData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!data.producto_id || data.producto_id === 0) {
      newErrors.producto_id = 'El producto es requerido';
    }

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
    const loadingToast = NotificationService.loading(
      isEditing ? 'Actualizando rango...' : 'Creando rango...'
    );

    const submitData = {
      ...data,
      cantidad_maxima: data.cantidad_maxima ? parseInt(String(data.cantidad_maxima)) : null,
    };

    try {
      const url = isEditing && rango
        ? precioRangoService.updateParaProductoUrl(data.producto_id, rango.id)
        : precioRangoService.storeParaProductoUrl(data.producto_id);

      const method = isEditing ? 'put' : 'post';

      // ✅ DEBUG: Mostrar en consola qué se envía al backend
      console.log('========== ENVIANDO AL BACKEND ==========');
      console.log('URL:', url);
      console.log('Método:', method.toUpperCase());
      console.log('Datos enviados:', submitData);
      console.log('tipo_precio_id (tipo):', typeof submitData.tipo_precio_id, '- valor:', submitData.tipo_precio_id);
      console.log('========================================');

      const response = await axios[method](url, submitData);

      NotificationService.dismiss(loadingToast);
      NotificationService.success(response.data.message ||
        (isEditing ? 'Rango actualizado correctamente' : 'Rango creado correctamente')
      );

      // Redirigir a la lista de rangos
      router.get(`/precio-rango?producto_id=${data.producto_id}`);
    } catch (error: any) {
      NotificationService.dismiss(loadingToast);

      // ✅ DEBUG: Mostrar en consola el error del servidor
      console.log('========== ERROR DEL SERVIDOR ==========');
      console.log('Status:', error.response?.status);
      console.log('Errores de validación:', error.response?.data?.errors);
      console.log('Mensaje:', error.response?.data?.message);
      console.log('Respuesta completa:', error.response?.data);
      console.log('========================================');

      // Mostrar errores de validación del servidor si existen
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        NotificationService.error('Por favor, corrige los errores en el formulario');
      } else {
        const message = error.response?.data?.message || 'Error al ' + (isEditing ? 'actualizar' : 'crear') + ' el rango';
        NotificationService.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const productoSeleccionado = productos.find((p) => p.id === data.producto_id);
  const tipoPrecioSeleccionado = tiposPrecio.find((t) => t.id === data.tipo_precio_id);

  const rango_texto =
    data.cantidad_maxima && data.cantidad_maxima > 0
      ? `${data.cantidad_minima}-${data.cantidad_maxima}`
      : `${data.cantidad_minima}+`;

  return (
    <>
      <Head title={isEditing ? 'Editar Rango de Precio' : 'Crear Rango de Precio'} />
      <AppLayout
        breadcrumbs={[
          { title: 'Dashboard', href: '/' },
          { title: 'Configuración', href: '#' },
          { title: 'Rangos de Precios', href: '/precio-rango' },
          {
            title: isEditing ? 'Editar' : 'Crear',
            href: '#',
            active: true,
          },
        ]}
      >
        <div className="space-y-6 p-6">
          {/* HEADER CON BOTÓN ATRÁS */}
          <div className="flex items-center gap-4">
            <Link href="/precio-rango">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight dark:text-white">
                {isEditing ? 'Editar Rango de Precio' : 'Crear Nuevo Rango de Precio'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {isEditing ? 'Modifica los parámetros del rango' : 'Configura un nuevo rango de precio'}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* FORMULARIO PRINCIPAL */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Detalles del Rango</CardTitle>
                <CardDescription>Completa la información del rango de precio</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* PRODUCTO */}
                  <div className="space-y-2">
                    <SearchSelect
                      id="producto"
                      label="Producto *"
                      placeholder="Selecciona un producto..."
                      value={data.producto_id || ''}
                      options={productos.map((p) => ({
                        value: p.id,
                        label: p.nombre,
                        description: `SKU: ${p.sku}`,
                        disabled: isEditing,
                      } as SelectOption))}
                      onChange={(value) => updateField('producto_id', parseInt(String(value)))}
                      disabled={isEditing}
                      searchPlaceholder="Buscar producto por nombre o SKU..."
                      emptyText="No se encontraron productos"
                      error={errors.producto_id}
                    />
                  </div>

                  {/* TIPO DE PRECIO */}
                  <div className="space-y-2">
                    <SearchSelect
                      id="tipo-precio"
                      label="Tipo de Precio *"
                      placeholder="Selecciona un tipo de precio..."
                      value={data.tipo_precio_id || ''}
                      options={tiposPrecio.map((t) => ({
                        value: t.id,
                        label: t.nombre,
                        description: `Código: ${t.codigo}`,
                      } as SelectOption))}
                      onChange={(value) => updateField('tipo_precio_id', parseInt(String(value)))}
                      searchPlaceholder="Buscar por nombre o código..."
                      emptyText="No se encontraron tipos de precio"
                      error={errors.tipo_precio_id}
                    />
                  </div>

                  {/* RANGO DE CANTIDAD */}
                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cantidad-min">Cantidad Mínima *</Label>
                      <Input
                        id="cantidad-min"
                        type="number"
                        min="1"
                        value={data.cantidad_minima}
                        onChange={(e) => updateField('cantidad_minima', parseInt(e.target.value))}
                        className={errors.cantidad_minima ? 'border-red-500' : ''}
                      />
                      {errors.cantidad_minima && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.cantidad_minima}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cantidad-max">Cantidad Máxima (opcional)</Label>
                      <Input
                        id="cantidad-max"
                        type="number"
                        placeholder="Dejar vacío para sin límite"
                        value={data.cantidad_maxima || ''}
                        onChange={(e) =>
                          updateField('cantidad_maxima', e.target.value ? parseInt(e.target.value) : null)
                        }
                        className={errors.cantidad_maxima ? 'border-red-500' : ''}
                      />
                      {errors.cantidad_maxima && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.cantidad_maxima}</p>
                      )}
                    </div>
                  </div>

                  {/* VIGENCIA */}
                  <div className="space-y-3 border-t dark:border-gray-700 pt-4">
                    <h3 className="font-semibold text-sm dark:text-white">Vigencia (opcional)</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Dejar vacío para vigencia permanente</p>

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
                  </div>

                  {/* CONFIGURACIÓN ADICIONAL */}
                  <div className="space-y-3 border-t dark:border-gray-700 pt-4">
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
                  </div>

                  {/* BOTONES */}
                  <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
                    <Link href="/precio-rango" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Cancelar
                      </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* PANEL LATERAL - VISTA PREVIA */}
            <div className="space-y-4">
              {/* VISTA PREVIA */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">Vista Previa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Rango</p>
                      <div className="mt-1 bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 px-3 py-2 rounded text-center font-bold text-lg">
                        {rango_texto}
                      </div>
                    </div>

                    {productoSeleccionado && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Producto</p>
                        <p className="text-sm font-semibold mt-1 dark:text-gray-200">{productoSeleccionado.nombre}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{productoSeleccionado.sku}</p>
                      </div>
                    )}

                    {tipoPrecioSeleccionado && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tipo de Precio</p>
                        <p className="text-sm font-semibold mt-1 dark:text-gray-200">{tipoPrecioSeleccionado.nombre}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{tipoPrecioSeleccionado.codigo}</p>
                      </div>
                    )}

                    {data.fecha_vigencia_inicio || data.fecha_vigencia_fin ? (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Vigencia</p>
                        <p className="text-sm mt-1 dark:text-gray-300">
                          {data.fecha_vigencia_inicio && (
                            <span>{new Date(data.fecha_vigencia_inicio).toLocaleDateString()}</span>
                          )}
                          {data.fecha_vigencia_inicio && data.fecha_vigencia_fin && <span> - </span>}
                          {data.fecha_vigencia_fin && (
                            <span>{new Date(data.fecha_vigencia_fin).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Vigencia</p>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">Siempre activo</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Estado</p>
                      <p className={`text-sm font-semibold mt-1 ${data.activo ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {data.activo ? 'Activo' : 'Inactivo'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* INFORMACIÓN */}
              <Alert className="dark:border-blue-700/40 dark:bg-blue-900/20">
                <AlertCircle className="h-4 w-4 dark:text-blue-400" />
                <AlertTitle className="dark:text-blue-200">Información</AlertTitle>
                <AlertDescription className="text-xs dark:text-blue-300/80">
                  Los cambios se aplicarán inmediatamente. El sistema validará que no haya
                  solapamientos de rangos.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
