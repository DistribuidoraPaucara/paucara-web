import { Head, Link, useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Label } from '@/presentation/components/ui/label';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import NotificationService from '@/infrastructure/services/notification.service';
import { TipoPrecio, TipoPrecioFormData } from '@/domain/entities/tipos-precio';

// Helper para generar rutas
const route = (name: string, params?: Record<string, unknown> | string | number) => {
  const routes: Record<string, string> = {
    'dashboard': '/dashboard',
    'tipos-precio.index': '/tipos-precio',
    'tipos-precio.store': '/tipos-precio',
    'tipos-precio.update': '/tipos-precio',
    'tipos-precio.destroy': '/tipos-precio',
  };

  const baseRoute = routes[name] || '/';

  if (params && name === 'tipos-precio.update') {
    return `${baseRoute}/${params}`;
  }
  if (params && name === 'tipos-precio.destroy') {
    return `${baseRoute}/${params}`;
  }

  return baseRoute;
};

interface ColorOption {
  value: string;
  label: string;
  class: string;
}

interface PageProps {
  tipo_precio?: TipoPrecio;
  colores_disponibles: ColorOption[];
  puede_eliminar?: boolean;
}

const iconosDisponibles = [
  '📦', '💰', '🏢', '🎉', '🧾', '⭐', '🔥', '💎', '🎯', '📈',
  '💵', '🏷️', '🛍️', '🎁', '⚡', '🌟', '🔖', '💳', '🎊', '🏆'
];

export default function TipoPrecioForm({ tipo_precio, colores_disponibles, puede_eliminar }: PageProps) {
  const isEditing = !!tipo_precio?.id;

  const { data, setData, post, put, processing, errors, recentlySuccessful } = useForm<TipoPrecioFormData>({
    id: tipo_precio?.id || undefined,
    es_sistema: tipo_precio?.es_sistema || false,
    porcentaje_ganancia: tipo_precio?.porcentaje_ganancia || 0,
    precios_count: tipo_precio?.precios_count || 0,
    codigo: tipo_precio?.codigo || '',
    nombre: tipo_precio?.nombre || '',
    descripcion: tipo_precio?.descripcion || '',
    color: tipo_precio?.color || 'gray',
    es_ganancia: tipo_precio?.es_ganancia ?? true,
    es_precio_base: tipo_precio?.es_precio_base ?? false,
    orden: tipo_precio?.orden || 0,
    activo: tipo_precio?.activo ?? true,
    configuracion: {
      icono: tipo_precio?.configuracion?.icono || '💰',
      tooltip: tipo_precio?.configuracion?.tooltip || '',
      porcentaje_ganancia: (typeof tipo_precio?.configuracion?.porcentaje_ganancia === 'number')
        ? tipo_precio.configuracion.porcentaje_ganancia
        : (typeof tipo_precio?.porcentaje_ganancia === 'number'
          ? tipo_precio.porcentaje_ganancia
          : undefined),
    }
  });

  useEffect(() => {
    if (recentlySuccessful) {
      NotificationService.success(
        isEditing ? 'Tipo de precio actualizado correctamente' : 'Tipo de precio creado correctamente'
      );
    }
  }, [recentlySuccessful, isEditing]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    let savingToast: string | undefined;
    const options = {
      onStart: () => {
        savingToast = NotificationService.loading(isEditing ? 'Actualizando tipo de precio...' : 'Guardando tipo de precio...');
      },
      onSuccess: () => {
        router.visit(route('tipos-precio.index'));
      },
      onError: () => {
        // Errores específicos ya se muestran mediante useForm/errors en la UI si aplica
      },
      onFinish: () => {
        if (savingToast) {
          NotificationService.dismiss(savingToast);
        }
      },
    } as const;

    if (isEditing && tipo_precio) {
      put(route('tipos-precio.update', tipo_precio.id), options);
    } else {
      post(route('tipos-precio.store'), options);
    }
  };

  const getColorPreview = (color: string) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      indigo: 'bg-indigo-500',
      pink: 'bg-pink-500',
      yellow: 'bg-yellow-500',
      gray: 'bg-gray-500',
      teal: 'bg-teal-500',
    };
    return colorClasses[color as keyof typeof colorClasses] || 'bg-gray-500';
  };

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: route('dashboard') },
      { title: 'Tipos de Precio', href: route('tipos-precio.index') },
      { title: isEditing ? 'Editar' : 'Nuevo', href: '#' }
    ]}>
      <Head title={isEditing ? 'Editar Tipo de Precio' : 'Nuevo Tipo de Precio'} />

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorPreview(data.color)}`}>
                <span className="text-white text-lg">{data.configuracion.icono}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Editar' : 'Nuevo'} Tipo de Precio
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isEditing ? 'Modifica la información del tipo de precio' : 'Crea un nuevo tipo de precio personalizado'}
                </p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="codigo">Código *</Label>
                    <Input
                      id="codigo"
                      value={data.codigo}
                      onChange={e => setData('codigo', e.target.value.toUpperCase())}
                      placeholder="EJEMPLO: ESPECIAL"
                      disabled={tipo_precio?.es_sistema}
                      className={errors.codigo ? 'border-red-500' : ''}
                      maxLength={20}
                    />
                    {errors.codigo && (
                      <p className="text-red-500 text-sm mt-1">{errors.codigo}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Código único para identificar este tipo (solo letras y números)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={data.nombre}
                      onChange={e => setData('nombre', e.target.value)}
                      placeholder="Ej: Precio Especial"
                      className={errors.nombre ? 'border-red-500' : ''}
                      maxLength={100}
                    />
                    {errors.nombre && (
                      <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={data.descripcion}
                      onChange={e => setData('descripcion', e.target.value)}
                      placeholder="Describe para qué se usa este tipo de precio..."
                      className={errors.descripcion ? 'border-red-500' : ''}
                      maxLength={255}
                      rows={3}
                    />
                    {errors.descripcion && (
                      <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="orden">Orden de visualización *</Label>
                    <Input
                      id="orden"
                      type="number"
                      value={data.orden}
                      onChange={e => setData('orden', parseInt(e.target.value) || 0)}
                      min="0"
                      className={errors.orden ? 'border-red-500' : ''}
                    />
                    {errors.orden && (
                      <p className="text-red-500 text-sm mt-1">{errors.orden}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Número menor = aparece primero en las listas
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Select
                      value={data.color}
                      onValueChange={(value) => setData('color', value)}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${getColorPreview(data.color)}`}></div>
                            {colores_disponibles.find(c => c.value === data.color)?.label}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {colores_disponibles.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="icono">Icono</Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {iconosDisponibles.map(icono => (
                        <button
                          key={icono}
                          type="button"
                          onClick={() => setData('configuracion', { ...data.configuracion, icono })}
                          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-colors ${data.configuracion.icono === icono
                              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                            }`}
                        >
                          {icono}
                        </button>
                      ))}
                    </div>
                    <Input
                      className="mt-2"
                      value={data.configuracion.icono}
                      onChange={e => setData('configuracion', { ...data.configuracion, icono: e.target.value })}
                      placeholder="O escribe un emoji personalizado"
                      maxLength={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tooltip">Tooltip</Label>
                    <Input
                      id="tooltip"
                      value={data.configuracion.tooltip}
                      onChange={e => setData('configuracion', { ...data.configuracion, tooltip: e.target.value })}
                      placeholder="Texto de ayuda al pasar el mouse"
                      maxLength={100}
                    />
                  </div>

                  {data.es_ganancia && (
                    <div>
                      <Label htmlFor="porcentaje_ganancia">Porcentaje de ganancia (%)</Label>
                      <Input
                        id="porcentaje_ganancia"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.porcentaje_ganancia || ''}
                        onChange={e => setData('porcentaje_ganancia', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                        placeholder="Ej: 25"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Si se especifica, se usará este porcentaje para calcular el precio cuando se cree un producto.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium mb-4">Configuración</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="es_ganancia"
                      checked={data.es_ganancia}
                      onCheckedChange={(checked) => setData('es_ganancia', !!checked)}
                      disabled={tipo_precio?.es_sistema}
                    />
                    <div>
                      <Label htmlFor="es_ganancia" className="font-medium">
                        Es precio de ganancia
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Si está marcado, se considerará para cálculos de ganancia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="es_precio_base"
                      checked={data.es_precio_base}
                      onCheckedChange={(checked) => setData('es_precio_base', !!checked)}
                      disabled={tipo_precio?.es_sistema}
                    />
                    <div>
                      <Label htmlFor="es_precio_base" className="font-medium">
                        Es precio base (costo)
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Solo puede haber un tipo marcado como precio base
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="activo"
                      checked={data.activo}
                      onCheckedChange={(checked) => setData('activo', !!checked)}
                    />
                    <div>
                      <Label htmlFor="activo" className="font-medium">
                        Activo
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Solo los tipos activos aparecen en los formularios
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {tipo_precio?.es_sistema && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-amber-500 dark:text-amber-400 mt-0.5">⚠️</div>
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-200">Tipo de Sistema</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        Este es un tipo de precio del sistema. Algunas opciones están bloqueadas
                        para mantener la integridad del sistema.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link href={route('tipos-precio.index')}>
                Cancelar
              </Link>
            </Button>

            <div className="flex gap-2">
              {isEditing && puede_eliminar && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm('¿Estás seguro de eliminar este tipo de precio?')) {
                      router.delete(route('tipos-precio.destroy', tipo_precio!.id));
                    }
                  }}
                >
                  Eliminar
                </Button>
              )}

              <Button
                onClick={submit}
                disabled={processing}
                className="min-w-[120px]"
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Guardando...
                  </div>
                ) : (
                  isEditing ? 'Actualizar' : 'Crear'
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
