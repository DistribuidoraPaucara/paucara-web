import { useState, useMemo, useCallback, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import { Badge } from '@/presentation/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/presentation/components/ui/tooltip';
import { Trash2, ArrowLeft, Search, X, ExternalLink } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import * as routes from '@/routes/combos';

interface Producto {
  id: number;
  nombre: string;
  sku: string;
  stock_disponible?: number;
  precio_venta: number;
  precios: Array<{
    id: number;
    tipo_precio_id: number;
    nombre: string;
    precio: number;
    tipoPrecio: {
      id: number;
      nombre: string;
      codigo: string;
    };
  }>;
  tipo_precio_id_recomendado?: number;
}

interface ComboItem {
  producto_id: number;
  producto_nombre?: string;
  producto_sku?: string;
  cantidad: number;
  precio_unitario: number;
  tipo_precio_id?: number;
  tipo_precio_nombre?: string;
  es_obligatorio?: boolean;
  grupo_opcional?: string | null;
  stock_disponible?: number;
  stock_total?: number;
  precios?: Array<{
    id: number;
    tipo_precio_id: number;
    nombre: string;
    precio: number;
    tipoPrecio: {
      id: number;
      nombre: string;
      codigo: string;
    };
  }>;
}

interface GrupoOpcional {
  nombre_grupo: string;
  cantidad_a_llevar: number;
  precio_grupo: number;
  productos: number[];
  productos_detalle?: Array<{
    producto_id: number;
    producto_nombre: string;
    producto_sku: string;
  }>;
}

interface TipoPrecio {
  id: number;
  nombre: string;
  codigo: string;
}

interface Combo {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_venta: number;
  activo: boolean;
  items: ComboItem[];
}

interface FormProps {
  combo?: Combo;
  tipos_precio: TipoPrecio[];
  almacen_principal_id: number;
}

const formatBs = (valor: number): string =>
  `Bs ${valor.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ComboForm({ combo, tipos_precio, almacen_principal_id }: FormProps) {
  const isEditing = !!combo;
  const [items, setItems] = useState<ComboItem[]>(
    combo?.items?.map(item => ({
      ...item,
      cantidad: parseFloat(item.cantidad.toString()),
      precio_unitario: parseFloat(item.precio_unitario.toString()),
    })) || []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Producto[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [cantidadALlevar, setCantidadALlevar] = useState(2);
  const [precioGrupo, setPrecioGrupo] = useState(0);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [stockData, setStockData] = useState<Record<number, { stock_disponible: number; stock_total: number }>>({});

  // Función para normalizar items y asegurar que todos los números sean tipo number
  const normalizeItems = useCallback((itemsToNormalize: ComboItem[]) => {
    return itemsToNormalize.map(item => ({
      ...item,
      cantidad: parseFloat(item.cantidad.toString()),
      precio_unitario: parseFloat(item.precio_unitario.toString()),
    }));
  }, []);

  // Fetch stock data for all products in the combo
  const fetchStockForItems = useCallback(async (comboItems: ComboItem[], signal?: AbortSignal) => {
    if (comboItems.length === 0) return;

    try {
      const productIds = comboItems.map(item => item.producto_id);
      const response = await fetch('/api/productos/stock/multiples', {
        method: 'POST',
        credentials: 'same-origin',
        signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ producto_ids: productIds, almacen_id: almacen_principal_id }),
      });

      if (response.ok) {
        // La API responde { success, total, stocks: [...] }
        const { stocks } = await response.json();
        const stockMap: Record<number, { stock_disponible: number; stock_total: number }> = {};

        if (Array.isArray(stocks)) {
          stocks.forEach((result: any) => {
            stockMap[result.producto_id] = {
              stock_disponible: result.stock_disponible || 0,
              stock_total: result.stock_total || 0,
            };
          });
        }

        setStockData(stockMap);
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error fetching stock data:', error);
      }
    }
  }, [almacen_principal_id]);

  const { data, setData, post, put, processing, errors } = useForm({
    sku: combo?.sku || '',
    nombre: combo?.nombre || '',
    descripcion: combo?.descripcion || '',
    precio_venta: combo?.precio_venta || 0,
    items: normalizeItems(items),
    grupo_opcional: null,
  });

  const productosOpcionales = items.filter(item => !item.es_obligatorio);

  // Cargar datos del grupo opcional cuando se abre un combo existente (edición)
  useEffect(() => {
    if (isEditing && combo?.grupo_opcional) {
      setCantidadALlevar(combo.grupo_opcional.cantidad_a_llevar || 2);
      setPrecioGrupo(combo.grupo_opcional.precio_grupo || 0);
    }
  }, [isEditing, combo?.grupo_opcional]);

  // El stock se consulta al abrir y cuando cambia la lista de productos, no al editar cantidades o precios
  const productosConsultados = [...new Set(items.map(item => Number(item.producto_id)))].sort((a, b) => a - b).join(',');

  useEffect(() => {
    const peticion = new AbortController();
    fetchStockForItems(items, peticion.signal);
    // Si la lista vuelve a cambiar, se cancela esta consulta para que no pise a la siguiente
    return () => peticion.abort();
  }, [productosConsultados]);

  // Actualizar grupo_opcional cuando cambien los items, SKU o configuración del grupo
  useEffect(() => {
    const grupoOpcionalData = productosOpcionales.length > 0 ? {
      nombre_grupo: data.sku,
      cantidad_a_llevar: cantidadALlevar,
      precio_grupo: precioGrupo,
      productos: productosOpcionales.map(p => p.producto_id),
    } : null;

    setData('grupo_opcional', grupoOpcionalData);
  }, [productosOpcionales.length, data.sku, cantidadALlevar, precioGrupo, items]);

  // Buscar productos
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoadingSearch(true);
    try {
      const response = await fetch(`/api/productos/buscar?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      const results = data.data || [];
      setSearchResults(results);
      setShowResults(true);

      // Si hay exactamente 1 resultado, agregarlo directo a la tabla
      if (results.length === 1) {
        handleSelectProducto(results[0]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, [items]);

  const handleSelectProducto = (producto: Producto) => {
    // Verificar que el producto no esté ya en el combo
    if (items.some(item => item.producto_id === producto.id)) {
      alert('Este producto ya está en el combo');
      return;
    }

    // Agregar directamente a la tabla
    const newComboItem: ComboItem = {
      producto_id: producto.id,
      producto_nombre: producto.nombre,
      producto_sku: producto.sku,
      cantidad: 1,
      precio_unitario: producto.precio_venta || 0,
      tipo_precio_id: producto.tipo_precio_id_recomendado,
      tipo_precio_nombre: producto.precios?.find(
        p => p.tipo_precio_id === producto.tipo_precio_id_recomendado
      )?.tipoPrecio?.nombre,
      es_obligatorio: true,
      grupo_opcional: null,
      precios: producto.precios,
    };

    const updatedItems = [...items, newComboItem];
    setItems(updatedItems);
    setData('items', normalizeItems(updatedItems));

    // Limpiar la búsqueda
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleRemoveItem = (productoId: number) => {
    const updatedItems = items.filter(item => item.producto_id !== productoId);
    setItems(updatedItems);
    setData('items', normalizeItems(updatedItems));
  };

  const handleUpdateTipoPrecio = (productoId: number, tipoPrecioId: number | undefined) => {
    const updatedItems = items.map(item => {
      if (item.producto_id === productoId) {
        // Buscar el precio para este tipo de precio en el array precios del producto
        const precioParaTipo = item.precios?.find(p => p.tipo_precio_id === tipoPrecioId)?.precio;
        const tipoPrecio = tipos_precio.find(tp => tp.id === tipoPrecioId);
        return {
          ...item,
          tipo_precio_id: tipoPrecioId,
          tipo_precio_nombre: tipoPrecio?.nombre,
          precio_unitario: precioParaTipo !== undefined ? parseFloat(precioParaTipo.toString()) : parseFloat(item.precio_unitario.toString()),
        };
      }
      return item;
    });
    setItems(updatedItems);
    setData('items', normalizeItems(updatedItems));
  };

  const handleUpdateCantidad = (productoId: number, nuevaCantidad: number) => {
    const updatedItems = items.map(item => {
      if (item.producto_id === productoId) {
        return {
          ...item,
          cantidad: nuevaCantidad,
        };
      }
      return item;
    });
    setItems(updatedItems);
    setData('items', normalizeItems(updatedItems));
  };

  const handleUpdatePrecioUnitario = (productoId: number, nuevoPrecio: number) => {
    const updatedItems = items.map(item => {
      if (item.producto_id === productoId) {
        return {
          ...item,
          precio_unitario: nuevoPrecio,
        };
      }
      return item;
    });
    setItems(updatedItems);
    setData('items', normalizeItems(updatedItems));
  };

  const handleUpdateEsObligatorio = (productoId: number, esObligatorio: boolean) => {
    const updatedItems = items.map(item => {
      if (item.producto_id === productoId) {
        return {
          ...item,
          es_obligatorio: esObligatorio,
          grupo_opcional: null,
        };
      }
      return item;
    });
    setItems(updatedItems);
    setData('items', normalizeItems(updatedItems));
  };

  const totalCosto = useMemo(() => {
    // Sumar SOLO costo de productos obligatorios
    const costoObligatorios = items.reduce((sum, item) => {
      const esObligatorio = item.es_obligatorio !== false;
      const cantidad = parseFloat(item.cantidad.toString());
      const precio = parseFloat(item.precio_unitario.toString());

      if (esObligatorio && cantidad > 0) {
        return sum + precio * cantidad;
      }
      return sum;
    }, 0);

    // Sumar costo del grupo opcional: cantidad_a_llevar × precio_grupo
    const costoGrupo = productosOpcionales.length > 0
      ? cantidadALlevar * precioGrupo
      : 0;

    return costoObligatorios + costoGrupo;
  }, [items, productosOpcionales.length, cantidadALlevar, precioGrupo]);

  // Cuántos combos alcanza a cubrir un componente (null si todavía no se conoce su stock o no tiene cantidad)
  const combosQueAlcanza = (item: ComboItem): number | null => {
    const stock = stockData[item.producto_id]?.stock_disponible ?? item.stock_disponible;
    const cantidad = parseFloat(item.cantidad.toString());
    return stock === undefined || !(cantidad > 0) ? null : Math.floor(stock / cantidad);
  };

  // Máximo de combos según los obligatorios: los opcionales no limitan (igual que ComboStockService)
  const alcancesObligatorios = items
    .filter(item => item.es_obligatorio !== false)
    .map(combosQueAlcanza)
    .filter((alcance): alcance is number => alcance !== null);
  const capacidadCombo = alcancesObligatorios.length > 0 ? Math.min(...alcancesObligatorios) : null;

  // Auto-actualizar precio_venta con el totalCosto cuando items o grupo cambian
  // Solo si precio_venta es 0 o es igual al anterior totalCosto
  // Parten de los valores cargados: abrir un combo no debe cambiar su precio
  const [previousTotalCosto, setPreviousTotalCosto] = useState(totalCosto);
  const [previousItemsLength, setPreviousItemsLength] = useState(items.length);
  const [previousProductosOpcionalesLength, setPreviousProductosOpcionalesLength] = useState(productosOpcionales.length);

  useEffect(() => {
    const currentPrecioVenta = parseFloat(data.precio_venta.toString());

    // Detectar si se eliminó un producto (items.length disminuyó)
    const itemsWereRemoved = items.length < previousItemsLength;
    // Detectar si cambió la cantidad de opcionales (obligatorio → opcional o viceversa)
    const opcionalStatusChanged = productosOpcionales.length !== previousProductosOpcionalesLength;

    if (items.length > 0 || productosOpcionales.length > 0) {
      // Actualizar si:
      // 1. Es la primera vez (precio_venta === 0)
      // 2. El precio actual es igual al costo anterior (cambio manual no detectado)
      // 3. Se eliminó un producto (itemsWereRemoved)
      // 4. Cambió de obligatorio a opcional o viceversa (opcionalStatusChanged)
      if (currentPrecioVenta === 0 || Math.abs(currentPrecioVenta - previousTotalCosto) < 0.01 || itemsWereRemoved || opcionalStatusChanged) {
        setData('precio_venta', totalCosto);
      }
    }

    setPreviousTotalCosto(totalCosto);
    setPreviousItemsLength(items.length);
    setPreviousProductosOpcionalesLength(productosOpcionales.length);
  }, [totalCosto, items.length, productosOpcionales.length]);

  // Mostrar toasts para errores
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        if (typeof message === 'string') {
          toast.error(message, {
            position: 'top-right',
            autoClose: 4000,
          });
        }
      });
    }
  }, [errors]);

  const margen = useMemo(() => {
    if (!data.precio_venta || totalCosto === 0) return 0;
    return ((parseFloat(data.precio_venta.toString()) - totalCosto) / totalCosto) * 100;
  }, [data.precio_venta, totalCosto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Debes agregar al menos un producto al combo', {
        position: 'top-right',
        autoClose: 4000,
      });
      return;
    }

    const formData = {
      ...data,
      items,
    };

    if (isEditing) {
      put(routes.update(combo.id).url, {
        data: formData,
        onSuccess: () => {
          toast.success('Combo actualizado exitosamente', {
            position: 'top-right',
            autoClose: 3000,
          });
        },
      });
    } else {
      post(routes.store().url, {
        data: formData,
        onSuccess: () => {
          toast.success('Combo creado exitosamente', {
            position: 'top-right',
            autoClose: 3000,
          });
        },
      });
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '#' },
        { title: 'Combos', href: routes.index().url },
        { title: isEditing ? 'Editar' : 'Crear', href: '#' },
      ]}
    >
      <div className="space-y-6 p-2">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Barra fija: top-12 para quedar bajo el encabezado de la app */}
          <div className="sticky top-12 z-30 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <div className="min-w-0 max-w-sm">
                <h1 className="truncate font-semibold text-gray-900 dark:text-gray-100" title={data.nombre}>
                  {data.nombre || (isEditing ? 'Combo sin nombre' : 'Nuevo combo')}
                </h1>
                {isEditing && combo?.id ? (
                  <a
                    href={`/productos/${combo.id}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Editar producto en otra pestaña"
                    className="inline-flex items-center gap-0.5 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    ID {combo.id}
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sin guardar</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Costo</p>
                  <p className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatBs(totalCosto)}</p>
                </div>
                <div>
                  <Label htmlFor="precio_venta" className="text-xs font-normal text-gray-500 dark:text-gray-400">
                    Venta *
                  </Label>
                  <Input
                    id="precio_venta"
                    type="number"
                    step="0.01"
                    value={data.precio_venta}
                    onChange={(e) => setData('precio_venta', e.target.value ? parseFloat(e.target.value) : 0)}
                    placeholder="0.00"
                    className={`h-8 w-28 text-right font-semibold ${errors.precio_venta ? 'border-red-500 dark:border-red-600 dark:bg-red-950/20' : 'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'}`}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Margen</p>
                  <p
                    className={`font-semibold tabular-nums ${
                      margen > 0 ? 'text-green-600 dark:text-green-400' : margen < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {totalCosto > 0 ? `${margen.toLocaleString('es-BO', { maximumFractionDigits: 1 })} %` : '—'}
                  </p>
                </div>
                <div title="Según el stock del almacén principal">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Se pueden armar</p>
                  <p className={`font-semibold tabular-nums ${capacidadCombo === 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {capacidadCombo ?? '—'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild type="button" variant="outline" size="sm">
                  <Link href={routes.index().url}>Cancelar</Link>
                </Button>
                <Button type="submit" size="sm" disabled={processing}>
                  {processing ? 'Guardando...' : isEditing ? 'Actualizar Combo' : 'Crear Combo'}
                </Button>
              </div>
            </div>
            {errors.precio_venta && <p className="mt-1 text-right text-sm text-red-500 dark:text-red-400">{errors.precio_venta}</p>}
          </div>

          {/* Sección: Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU del Combo *</Label>
                  <Input
                    id="sku"
                    value={data.sku}
                    onChange={(e) => setData('sku', e.target.value)}
                    placeholder="Ej: COMBO-001"
                    className={errors.sku ? 'border-red-500 dark:border-red-600 dark:bg-red-950/20' : 'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100'}
                  />
                  {errors.sku && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.sku}</p>}
                </div>

                <div>
                  <Label htmlFor="nombre">Nombre del Combo *</Label>
                  <Input
                    id="nombre"
                    value={data.nombre}
                    onChange={(e) => setData('nombre', e.target.value)}
                    placeholder="Ej: Pack Premium"
                    className={errors.nombre ? 'border-red-500 dark:border-red-600 dark:bg-red-950/20' : 'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100'}
                  />
                  {errors.nombre && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.nombre}</p>}
                </div>

              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={data.descripcion}
                  onChange={(e) => setData('descripcion', e.target.value)}
                  placeholder="Descripción del combo..."
                  rows={3}
                  className={errors.descripcion ? 'border-red-500 dark:border-red-600 dark:bg-red-950/20' : 'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100'}
                />
                {errors.descripcion && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.descripcion}</p>
                )}
              </div>

              
            </CardContent>
          </Card>

          {/* Sección: Buscar y agregar productos */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Productos al Combo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Búsqueda de producto */}
              <div>
                <Label htmlFor="buscar_producto">Buscar Producto (SKU, ID o Nombre) *</Label>
                <div className="relative">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
                      <Input
                        id="buscar_producto"
                        type="text"
                        placeholder="Escribe SKU, ID o nombre del producto..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch(searchQuery);
                          }
                        }}
                        onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                        className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setShowResults(false);
                            setSearchResults([]);
                          }}
                          className="absolute right-3 top-3"
                        >
                          <X size={18} className="text-gray-400 dark:text-gray-500" />
                        </button>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleSearch(searchQuery)}
                      disabled={loadingSearch || searchQuery.trim().length < 2}
                      className="gap-2"
                    >
                      <Search size={18} />
                      Buscar
                    </Button>
                  </div>

                  {/* Resultados de búsqueda */}
                  {showResults && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                      {loadingSearch ? (
                        <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">Buscando...</div>
                      ) : searchResults.length > 0 ? (
                        <div>
                          {searchResults.map((producto) => (
                            <button
                              key={producto.id}
                              type="button"
                              onClick={() => handleSelectProducto(producto)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-b-0 flex justify-between items-center dark:text-gray-100"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <div className="font-medium text-sm">{producto.nombre}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">SKU: {producto.sku} | ID: {producto.id}</div>
                                </div>
                                {producto.stock_disponible !== undefined && (
                                  <span className={`text-xs font-semibold whitespace-nowrap ${producto.stock_disponible > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {producto.stock_disponible} disp.
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery.trim().length >= 2 ? (
                        <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">No se encontraron productos</div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Configuración del Grupo Opcional */}
          {productosOpcionales.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Grupo Opcional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-4">
                    📦 Grupo: <strong>{data.sku || '[SKU del combo]'}</strong>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cantidad_a_llevar">Cantidad a llevar *</Label>
                      <Input
                        id="cantidad_a_llevar"
                        type="number"
                        min="1"
                        value={cantidadALlevar}
                        onChange={(e) => setCantidadALlevar(parseInt(e.target.value) || 1)}
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Mínimo: 1 producto
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="precio_grupo">Precio por item *</Label>
                      <Input
                        id="precio_grupo"
                        type="number"
                        step="0.01"
                        min="0"
                        value={precioGrupo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPrecioGrupo(val === '' ? 0 : parseFloat(val) || 0);
                        }}
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Precio fijo para todos los productos del grupo
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Productos en el grupo:</p>
                    <div className="flex flex-wrap gap-2">
                      {productosOpcionales.map((item) => (
                        <Badge key={item.producto_id} variant="secondary">
                          {item.producto_nombre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          

          {/* Sección: Tabla de productos */}
          {items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Productos del Combo ({items.length})</CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">El stock corresponde al almacén principal</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-center">Stock Disp.</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead className="text-center">Precio Unit.</TableHead>
                        <TableHead className="text-center">Subtotal</TableHead>
                        <TableHead>Tipo de Precio</TableHead>
                        <TableHead className="text-center">Obligatorio</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => {
                        const esObligatorio = item.es_obligatorio !== false;
                        const cantidad = parseFloat(item.cantidad.toString());
                        const sumaACosto = esObligatorio && cantidad > 0; // Solo obligatorios suman al costo
                        const alcance = combosQueAlcanza(item);
                        const limita = esObligatorio && alcance !== null && alcance === capacidadCombo;
                        const stockDisponible = stockData[item.producto_id]?.stock_disponible ?? item.stock_disponible;
                        return (
                          <TableRow
                            key={item.producto_id}
                            className={limita ? 'bg-amber-50 dark:bg-amber-900/20' : !esObligatorio ? 'bg-blue-50 dark:bg-blue-900/10' : ''}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="font-medium text-sm dark:text-gray-100">{item.producto_nombre}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.producto_sku}</div>
                                </div>
                                {!esObligatorio && (
                                  <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
                                    Opcional
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span tabIndex={0} className="cursor-help text-sm">
                                    <span className={`font-medium ${stockDisponible === 0 ? 'text-red-600 dark:text-red-400' : 'dark:text-gray-100'}`}>
                                      {stockDisponible ?? '-'}
                                    </span>
                                    {alcance !== null && (
                                      <span className={limita ? 'font-semibold text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}>
                                        {' '}→ {alcance} {alcance === 1 ? 'combo' : 'combos'}
                                      </span>
                                    )}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-left">
                                  <p>Disponible: {stockDisponible ?? '-'}</p>
                                  <p>Total: {stockData[item.producto_id]?.stock_total ?? item.stock_total ?? '-'}</p>
                                  {alcance !== null && <p>Alcanza para {alcance} {alcance === 1 ? 'combo' : 'combos'}</p>}
                                  {limita && <p className="font-semibold">Limita el combo</p>}
                                  {!esObligatorio && <p>Opcional: no limita el combo</p>}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.cantidad}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '') {
                                    handleUpdateCantidad(item.producto_id, 0);
                                  } else {
                                    handleUpdateCantidad(item.producto_id, parseFloat(val) || 0);
                                  }
                                }}
                                className="w-20 px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                              />
                            </TableCell>
                            <TableCell className='text-center'>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.precio_unitario}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '') {
                                    handleUpdatePrecioUnitario(item.producto_id, 0);
                                  } else {
                                    handleUpdatePrecioUnitario(item.producto_id, parseFloat(val) || 0);
                                  }
                                }}
                                className="w-24 px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                              />
                            </TableCell>
                            <TableCell className={`text-center font-medium ${sumaACosto ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500 line-through'}`}>
                              Bs {(parseFloat(item.precio_unitario.toString()) * cantidad).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <select
                                value={item.tipo_precio_id || ''}
                                onChange={(e) =>
                                  handleUpdateTipoPrecio(
                                    item.producto_id,
                                    e.target.value ? parseInt(e.target.value) : undefined
                                  )
                                }
                                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-gray-100"
                              >
                                <option value="">Sin especificar</option>
                                {tipos_precio.map((tipo) => (
                                  <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                  </option>
                                ))}
                              </select>
                            </TableCell>
                            <TableCell className="text-center">
                              <select
                                value={item.es_obligatorio ? 'obligatorio' : 'opcional'}
                                onChange={(e) =>
                                  handleUpdateEsObligatorio(
                                    item.producto_id,
                                    e.target.value === 'obligatorio'
                                  )
                                }
                                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-gray-100"
                              >
                                <option value="obligatorio">Obligatorio</option>
                                <option value="opcional">Opcional</option>
                              </select>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.producto_id)}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 size={18} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}

                    </TableBody>
                  </Table>
                </div>
                {productosOpcionales.length > 0 && (
                  <p className="mt-3 text-right text-sm text-gray-600 dark:text-gray-400">
                    Obligatorios {formatBs(totalCosto - cantidadALlevar * precioGrupo)} + Grupo opcional ({cantidadALlevar} × {formatBs(precioGrupo)}){' '}
                    = <strong className="text-gray-900 dark:text-gray-100">{formatBs(totalCosto)}</strong>
                  </p>
                )}
              </CardContent>
            </Card>
          )}

        </form>
      </div>
    </AppLayout>
  );
}
