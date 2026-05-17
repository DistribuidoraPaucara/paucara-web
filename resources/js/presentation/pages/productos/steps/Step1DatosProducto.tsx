import { Label } from '@/presentation/components/ui/label';
import { Input } from '@/presentation/components/ui/input';
import SearchSelect from '@/presentation/components/ui/search-select';
import InputSearch from '@/presentation/components/ui/input-search';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import NotificationService from '@/infrastructure/services/notification.service';
import React, { useState } from 'react';

interface Option { value: number | string; label: string; description?: string }

export interface Step1Props {
  data: {
    nombre: string;
    sku?: string | null;
    descripcion?: string | null;
    peso?: number | null;
    unidad_medida_id?: number | string;
    categoria_id?: number | string;
    marca_id?: number | string;
    proveedor_id?: number | string;
    proveedor?: { id: number; nombre: string; razon_social?: string } | null;
    activo?: boolean;
    stock_minimo?: number | null;
    stock_maximo?: number | null;
    limite_venta?: number | null; // ✨ NUEVO - Límite de cantidad por venta
    es_fraccionado?: boolean; // ✨ NUEVO
    es_producto_comida?: boolean; // ✨ NUEVO - Producto de comida/helado sin stock
    permite_venta_sin_stock?: boolean; // ✅ NUEVO (2026-05-08) - Para servicios/inyectables en farmacias
    principio_activo?: string | null; // ✨ NUEVO - Ingrediente activo para medicamentos
    uso_de_medicacion?: string | null; // ✨ NUEVO - Indicaciones de uso para medicamentos
    visible_app?: boolean; // ✨ NUEVO - Visible en app
  };
  errors: Record<string, string>;
  categoriasOptions: Option[];
  marcasOptions: Option[];
  unidadesOptions: Option[];
  setData: (key: string, value: unknown) => void; // follows useForm API used in parent
  getInputClassName: (fieldName: keyof Record<string, string>) => string;
  permite_productos_fraccionados?: boolean; // ✨ NUEVO: Control de empresa
  es_farmacia?: boolean; // ✨ NUEVO - Indica si la empresa es farmacia
  visible_app?: boolean; // ✨ NUEVO
}

function Step1DatosProducto({
  data,
  errors,
  categoriasOptions,
  marcasOptions,
  unidadesOptions,
  setData,
  getInputClassName,
  permite_productos_fraccionados, // ✨ NUEVO
  es_farmacia, // ✨ NUEVO - Indica si la empresa es farmacia
  visible_app // ✨ NUEVO
}: Step1Props) {
  // Estados para controlar la búsqueda de proveedores
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');
  const [searchResultsFound, setSearchResultsFound] = useState<boolean>(false);

  // Estados para búsqueda de productos
  const [lastProductSearchQuery, setLastProductSearchQuery] = useState<string>('');
  const [productSearchResultsFound, setProductSearchResultsFound] = useState<boolean>(false);
  const [productosCacheMap, setProductosCacheMap] = useState<{ [key: number]: any }>({});

  // ✨ Función de búsqueda para productos - Busca en la API
  const searchProductos = async (query: string) => {
    // console.log('🔍 Buscando productos con query:', query);
    setLastProductSearchQuery(query);

    if (!query || query.length < 2) {
      console.log('❌ Query muy corto, retornando vacío');
      setProductSearchResultsFound(false);
      return [];
    }

    try {
      const response = await fetch(`/api/productos/buscar?q=${encodeURIComponent(query)}&limite=10`);

      if (!response.ok) {
        console.error('❌ Error en búsqueda de productos:', response.status);
        setProductSearchResultsFound(false);
        return [];
      }

      const result = await response.json();
      // console.log('✅ Productos encontrados:', result.data?.length || 0);
      // console.log('📝 Resultados:', result.data);

      if (result.success && result.data) {
        const hasResults = result.data.length > 0;
        setProductSearchResultsFound(hasResults);

        // ✨ Cachear los productos para acceso rápido
        const newCache: { [key: number]: any } = {};
        result.data.forEach((producto: any) => {
          newCache[producto.id] = producto;
        });
        setProductosCacheMap(prev => ({ ...prev, ...newCache }));

        return result.data.map((producto: any) => ({
          value: producto.id,
          label: producto.nombre,
          description: `SKU: ${producto.sku || 'N/A'} | Categoría: ${producto.categoria?.nombre || 'N/A'}`
        }));
      }

      setProductSearchResultsFound(false);
      return [];
    } catch (error) {
      console.error('❌ Error en búsqueda de productos:', error);
      setProductSearchResultsFound(false);
      return [];
    }
  };

  // ✨ Función para cargar datos cuando se selecciona un producto existente
  const handleProductoSelection = (selectedValue: string | number | null) => {
    // ✅ El nombre ya se guardó en el onChange, así que solo procesamos si es un producto existente
    if (!selectedValue) {
      // Si está vacío, no hacer nada (el onChange ya manejó el setData)
      return;
    }

    // Si es un número, es un ID de producto existente - cargarlo
    const productoId = Number(selectedValue);
    if (!isNaN(productoId) && productosCacheMap[productoId]) {
      const productoData = productosCacheMap[productoId];
      // console.log('✨ Cargando producto existente:', productoData);

      // ✅ IMPORTANTE: Cargar TODOS los datos del producto existente
      setData('nombre', productoData.nombre);
      setData('sku', productoData.sku || '');
      setData('descripcion', productoData.descripcion || '');
      setData('peso', productoData.peso || null);
      setData('unidad_medida_id', productoData.unidad_medida_id ? Number(productoData.unidad_medida_id) : '');
      setData('categoria_id', productoData.categoria_id ? Number(productoData.categoria_id) : '');
      setData('marca_id', productoData.marca_id ? Number(productoData.marca_id) : '');
      setData('proveedor_id', productoData.proveedor_id ? Number(productoData.proveedor_id) : '');
      setData('stock_minimo', productoData.stock_minimo || 0);
      setData('stock_maximo', productoData.stock_maximo || 50);
      setData('limite_venta', productoData.limite_venta || null); // ✨ NUEVO
      setData('principio_activo', productoData.principio_activo || null); // ✨ NUEVO
      setData('uso_de_medicacion', productoData.uso_de_medicacion || null); // ✨ NUEVO
      setData('permite_venta_sin_stock', productoData.permite_venta_sin_stock || false); // ✅ NUEVO (2026-05-08)
      setData('activo', productoData.activo ?? true);

      NotificationService.success(`Producto "${productoData.nombre}" cargado correctamente`);
    }
    // ✅ Si no es un ID numérico válido, no hacer nada (ya se guardó el nombre en el onChange)
  };

  // 🔍 Función de búsqueda para proveedores - Busca en la API
  const searchProveedores = async (query: string) => {
    // console.log('🔍 Buscando proveedores con query:', query);
    setLastSearchQuery(query);

    if (!query || query.length < 2) {
      console.log('❌ Query muy corto, retornando vacío');
      setSearchResultsFound(false);
      return [];
    }

    try {
      const response = await fetch(`/api/proveedores/buscar?q=${encodeURIComponent(query)}&limite=10`);

      if (!response.ok) {
        console.error('❌ Error en búsqueda de proveedores:', response.status);
        setSearchResultsFound(false);
        return [];
      }

      const result = await response.json();
      // console.log('✅ Proveedores encontrados:', result.data?.length || 0);
      // console.log('📝 Resultados:', result.data);

      if (result.success && result.data) {
        const hasResults = result.data.length > 0;
        setSearchResultsFound(hasResults);

        return result.data.map((proveedor: any) => ({
          value: proveedor.id,
          label: proveedor.nombre,
          description: proveedor.razon_social || `NIT: ${proveedor.nit || 'N/A'}`,
          codigos_barras: undefined,
          precio_base: undefined,
          stock_total: undefined
        }));
      }

      setSearchResultsFound(false);
      return [];
    } catch (error) {
      console.error('❌ Error en búsqueda de proveedores:', error);
      setSearchResultsFound(false);
      return [];
    }
  };
  return (
    <div>
      {/* <div className="bg-secondary border border-border rounded p-3">
        <div className="text-sm font-semibold text-foreground">Paso 1: Datos del producto</div>
        <div className="text-xs text-muted-foreground">Complete la información general del producto</div>
      </div> */}
      {/* 📱 1 fila con 3 columnas responsivas: Nombre, SKU, Proveedor */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <InputSearch
            id="nombre"
            label="Nombre del Producto *"
            value={data.nombre ?? ''}
            onChange={(value) => {
              // 🔑 IMPORTANTE: Guardar INMEDIATAMENTE el nombre mientras escribes
              setData('nombre', String(value || ''));
              // Luego procesar la selección (búsqueda, carga de producto existente, etc)
              handleProductoSelection(value);
            }}
            onSearch={searchProductos}
            placeholder="Busca un producto existente o escribe uno nuevo"
            emptyText="No se encontró el producto. Puedes crear uno nuevo"
            error={errors.nombre}
            showCreateIconButton={false}
            displayValue={data.nombre}
          />
          <div className="text-xs text-muted-foreground mt-1">
            💡 Busca productos existentes por nombre para cargarlos automáticamente
          </div>
          {lastProductSearchQuery && lastProductSearchQuery.length >= 2 && !productSearchResultsFound && (
            <div className="text-amber-700 dark:text-amber-200 font-semibold text-xs mt-1">
              ⚠️ No encontramos "{lastProductSearchQuery}". Puedes crear uno nuevo con este nombre.
            </div>
          )}
        </div>
        <div className="space-y-1">
          <div className="relative">
            <label htmlFor="sku" className={`absolute left-3 transition-all duration-200 pointer-events-none ${data.sku
              ? 'top-[-6px] text-xs font-medium text-blue-600 dark:text-blue-400'
              : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
              }`}>
              SKU / Código (opcional)
            </label>
            <Input
              id="sku"
              value={data.sku ?? ''}
              onChange={e => setData('sku', e.target.value)}
              placeholder=""
              className={`pt-2 ${getInputClassName('sku')}`}
            />
          </div>
          {errors.sku && <div className="text-red-500 text-sm mt-1">⚠️ {errors.sku}</div>}
          <div className="text-xs text-muted-foreground mt-1">
            💡 Si no lo ingresas, se generará automáticamente (ej.: PRO0001)
          </div>
        </div>
        <div className="space-y-1">
          <InputSearch
            id="proveedor"
            label="Proveedor (opcional)"
            value={data.proveedor_id ?? ''}
            onChange={(value) => setData('proveedor_id', value ? Number(value) : '')}
            onSearch={searchProveedores}
            placeholder="busca o crea tu proveedor"
            emptyText="No se encontró ningún proveedor. Puedes crear uno nuevo clickeando el botón +"
            error={errors.proveedor_id}
            showCreateIconButton={true}
            createIconButtonTitle="Crear nuevo proveedor con el nombre buscado"
            onCreateClick={(searchQuery) => {
              if (!searchQuery || searchQuery.length < 2) {
                NotificationService.warning('Por favor escribe al menos 2 caracteres para el proveedor');
                return;
              }
              console.log('🚀 onCreateClick ejecutado con query:', searchQuery);
              // Crear nuevo proveedor automáticamente con solo el nombre
              const createProveedor = async (nombre: string) => {
                console.log('🔧 Creando proveedor:', nombre);
                try {
                  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                  console.log('🔑 CSRF Token encontrado:', !!csrfToken);
                  const response = await fetch('/api/proveedores', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
                    },
                    body: JSON.stringify({ nombre }),
                  });

                  console.log('📡 Respuesta del servidor:', response.status);

                  if (response.ok) {
                    const result = await response.json();
                    console.log('✅ Respuesta completa:', result);
                    if (result.success) {
                      setData('proveedor_id', result.data.id);
                      console.log('💾 Proveedor ID actualizado:', result.data.id);
                      // Mostrar notificación de éxito
                      NotificationService.success(result.message || 'Proveedor creado exitosamente');
                    } else {
                      console.error('❌ Error del servidor:', result.message);

                      // Manejar errores de validación específicos
                      if (result.errors?.nombre) {
                        NotificationService.error('Ya existe un proveedor con ese nombre. Por favor, elige un nombre diferente.');
                      } else {
                        NotificationService.error(result.message || 'Error al crear el proveedor');
                      }
                    }
                  } else {
                    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                    console.error('❌ Error HTTP:', response.status, errorData.message);

                    // Manejar errores de validación específicos
                    if (response.status === 422 && errorData.errors?.nombre) {
                      NotificationService.error('Ya existe un proveedor con ese nombre. Por favor, elige un nombre diferente.');
                    } else {
                      NotificationService.error(errorData.message || 'Error al crear el proveedor');
                    }
                  }
                } catch (error) {
                  console.error('❌ Error de red:', error);
                  NotificationService.error('Error de conexión al crear el proveedor');
                }
              };

              createProveedor(searchQuery);
            }}
            displayValue={
              data.proveedor
                ? `${data.proveedor.nombre}${data.proveedor.razon_social ? ` - ${data.proveedor.razon_social}` : ''}`
                : undefined
            }
          />
          <div className="text-xs mt-1 px-1">
            {lastSearchQuery && lastSearchQuery.length >= 2 && !searchResultsFound ? (
              <div className="text-amber-700 dark:text-amber-200 font-semibold">
                ⚠️ No encontramos "{lastSearchQuery}" en la base de datos. Puedes crearlo haciendo clic en el botón ➕.
              </div>
            ) : (
              <div className="text-muted-foreground">
                💡 Si no encuentras el proveedor, puedes crearlo haciendo clic en el botón ➕. El sistema evitará crear proveedores con nombres duplicados.
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="space-y-1">
          <SearchSelect
            id="categoria"
            label="Categoría"
            placeholder="Seleccione una categoría"
            value={data.categoria_id ?? ''}
            options={categoriasOptions}
            onChange={(value) => setData('categoria_id', value ? Number(value) : '')}
            error={errors.categoria_id}
            allowClear={true}
            emptyText="No se encontraron categorías"
            searchPlaceholder="Buscar categorías..."
          />
        </div>
        <div className="space-y-1">
          <SearchSelect
            id="marca"
            label="Marca"
            placeholder="Seleccione una marca"
            value={data.marca_id ?? ''}
            options={marcasOptions}
            onChange={(value) => setData('marca_id', value ? Number(value) : '')}
            error={errors.marca_id}
            allowClear={true}
            emptyText="No se encontraron marcas"
            searchPlaceholder="Buscar marcas..."
          />
        </div>
        <div className="space-y-1">
          <SearchSelect
            id="unidad_medida_id"
            label="Unidad de medida"
            placeholder="Seleccione una unidad"
            value={data.unidad_medida_id ?? ''}
            options={unidadesOptions}
            onChange={(value) => setData('unidad_medida_id', value ? Number(value) : '')}
            error={errors.unidad_medida_id}
            allowClear={true}
            emptyText="No se encontraron unidades"
            searchPlaceholder="Buscar unidades..."
            renderOption={(option, isSelected) => (
              <div className={`flex justify-between items-center py-2 px-3 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500' : ''}`}>
                <span className="font-medium text-sm">{option.label}</span>
                {option.description && (
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                    {option.description}
                  </span>
                )}
              </div>
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div className="space-y-1">
          <div className="relative">
            <label htmlFor="peso" className={`absolute left-3 transition-all duration-200 pointer-events-none ${data.peso
              ? 'top-[-6px] text-xs font-medium text-blue-600 dark:text-blue-400'
              : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
              }`}>
              Peso (Kg) (opcional para entregas)
            </label>
            <Input
              id="peso"
              type="number"
              step="0.001"
              value={data.peso ?? ''}
              onChange={e => setData('peso', e.target.value ? Number(e.target.value) : null)}
              placeholder=""
              className={`pt-2 ${getInputClassName('peso')}`}
            />
          </div>
          {errors.peso && <div className="text-red-500 text-sm mt-1">⚠️ {errors.peso}</div>}
        </div>
        {/* 🆕 Campo activo oculto - el valor por defecto (true) se establece en form.tsx */}
        <div className="hidden">
          <Checkbox id="activo" checked={!!data.activo} onCheckedChange={(v) => setData('activo', !!v)} />
          <Label htmlFor="activo">Activo</Label>
        </div>
        <div className="space-y-1">
          <div className="relative">
            <label htmlFor="descripcion" className={`absolute left-3 transition-all duration-200 pointer-events-none ${data.descripcion
              ? 'top-[-6px] text-xs font-medium text-blue-600 dark:text-blue-400'
              : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
              }`}>
              Descripción
            </label>
            <Input
              id="descripcion"
              value={data.descripcion ?? ''}
              onChange={e => setData('descripcion', e.target.value)}
              placeholder=""
              className={`pt-2 ${getInputClassName('descripcion')}`}
            />
          </div>
          {errors.descripcion && <div className="text-red-500 text-sm mt-1">⚠️ {errors.descripcion}</div>}
        </div>
      </div>
      <div className="space-y-3 mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Alertas de Stock Globales:</strong> Estos valores son para TODAS las ubicaciones (almacenes) sumadas.
            El stock real de cada almacén se gestiona desde <strong>Movimientos de Inventario</strong>.
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor="stock_minimo" className="flex items-center gap-2">
              Stock Mínimo
              <span className="text-xs font-normal text-muted-foreground">(Alerta global)</span>
            </Label>
            <Input
              id="stock_minimo"
              type="number"
              min="0"
              step="1"
              value={data.stock_minimo ?? ''}
              onChange={e => setData('stock_minimo', e.target.value ? Number(e.target.value) : null)}
              className={getInputClassName('stock_minimo')}
              placeholder="Ej: 10"
            />
            {errors.stock_minimo && <div className="text-red-500 text-sm mt-1">⚠️ {errors.stock_minimo}</div>}
            <div className="text-xs text-muted-foreground">
              💡 Recibirás una alerta cuando el stock total sea menor a este valor
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="stock_maximo" className="flex items-center gap-2">
              Stock Máximo
              <span className="text-xs font-normal text-muted-foreground">(Alerta global)</span>
            </Label>
            <Input
              id="stock_maximo"
              type="number"
              min="0"
              step="1"
              value={data.stock_maximo ?? ''}
              onChange={e => setData('stock_maximo', e.target.value ? Number(e.target.value) : null)}
              className={getInputClassName('stock_maximo')}
              placeholder="Ej: 100"
            />
            {errors.stock_maximo && <div className="text-red-500 text-sm mt-1">⚠️ {errors.stock_maximo}</div>}
            <div className="text-xs text-muted-foreground">
              💡 Recibirás una alerta cuando el stock total supere este valor
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="limite_venta" className="flex items-center gap-2">
              Límite de Venta
              <span className="text-xs font-normal text-muted-foreground">(Máximo por venta)</span>
            </Label>
            <Input
              id="limite_venta"
              type="number"
              min="1"
              step="1"
              value={data.limite_venta ?? ''}
              onChange={e => {
                const valor = e.target.value.trim();
                setData('limite_venta', valor === '' ? null : parseInt(valor, 10));
              }}
              className={getInputClassName('limite_venta')}
              placeholder="Ej: 50 (dejar vacío para sin límite)"
            />
            {errors.limite_venta && <div className="text-red-500 text-sm mt-1">⚠️ {errors.limite_venta}</div>}
            <div className="text-xs text-muted-foreground">
              💡 Cantidad máxima permitida para adicionar al carrito. Dejar vacío = sin límite
            </div>
          </div>
        </div>
      </div>

      {/* ✨ NUEVA SECCIÓN: Productos Fraccionados */}
      {permite_productos_fraccionados && (
        <div className="space-y-3 mt-6 p-5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-2 border-amber-200 dark:border-amber-700 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <Checkbox
                id="es_fraccionado"
                checked={!!data.es_fraccionado}
                onCheckedChange={(v) => setData('es_fraccionado', !!v)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="es_fraccionado" className="font-semibold cursor-pointer flex items-center gap-2 text-base">
                <span>⚡</span> Permitir Conversiones de Unidades
              </Label>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-2 leading-relaxed">
                Activa esta opción si el producto puede venderse en diferentes unidades de medida.
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1 font-medium">
                📦 Ejemplo: Compra en CAJAS (almacenamiento) pero vende en TABLETAS (al público)
              </p>
            </div>
          </div>
          {data.es_fraccionado && (
            <div className="ml-6 mt-3 p-3 bg-white dark:bg-slate-900 rounded-md border-l-4 border-amber-400 dark:border-amber-600 shadow-sm">
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
                💡 <strong>Siguiente Paso:</strong> Configura las conversiones en la pestaña <strong>"Conversiones"</strong>
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Ejemplo de configuración: 1 CAJA = 30 TABLETAS
              </p>
            </div>
          )}
          {!data.es_fraccionado && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 italic ml-6">
              Verás opciones de configuración una vez que marques esta casilla
            </p>
          )}
        </div>
      )}

      {/* 🍦 NUEVA SECCIÓN: Producto de Comida/Helado */}
      {/* <div className="space-y-3 mt-6 p-5 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/30 dark:to-pink-950/30 border-2 border-orange-200 dark:border-orange-700 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <Checkbox
              id="es_producto_comida"
              checked={!!data.es_producto_comida}
              onCheckedChange={(v) => setData('es_producto_comida', !!v)}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="es_producto_comida" className="font-semibold cursor-pointer flex items-center gap-2 text-base">
              <span>🍦</span> Producto de Comida/Helado
            </Label>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-2 leading-relaxed">
              Marca este producto si es una comida o helado que se vende sin control de stock.
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1 font-medium">
              🍨 Ejemplo: Helados, postres, bebidas personalizadas
            </p>
          </div>
        </div>
        {data.es_producto_comida && (
          <div className="ml-6 mt-3 p-3 bg-white dark:bg-slate-900 rounded-md border-l-4 border-orange-400 dark:border-orange-600 shadow-sm">
            <p className="text-sm text-orange-900 dark:text-orange-100 font-medium">
              💡 <strong>Próximo Paso:</strong> Agrega adicionales (extras) en la pestaña <strong>"Productos de Comida"</strong>
            </p>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
              Ejemplos: Leche extra (+3Bs), Chocolate (+5Bs), Uvas Pasa (+2Bs)
            </p>
          </div>
        )}
      </div> */}

      {/* ✅ NUEVA SECCIÓN: Venta sin Stock (solo para farmacias) */}
      {es_farmacia && (
        <div className="space-y-3 mt-6 p-5 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-2 border-purple-200 dark:border-purple-700 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <Checkbox
                id="permite_venta_sin_stock"
                checked={!!data.permite_venta_sin_stock}
                onCheckedChange={(v) => setData('permite_venta_sin_stock', !!v)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="permite_venta_sin_stock" className="font-semibold cursor-pointer flex items-center gap-2 text-base">
                <span>💉</span> Permitir Venta sin Stock
              </Label>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-2 leading-relaxed">
                Marca este producto si es un servicio que se puede vender incluso sin inventario disponible.
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1 font-medium">
                💊 Ejemplo: Inyecciones, curaciones, aplicación de medicamentos
              </p>
            </div>
          </div>
          {data.permite_venta_sin_stock && (
            <div className="ml-6 mt-3 p-3 bg-white dark:bg-slate-900 rounded-md border-l-4 border-purple-400 dark:border-purple-600 shadow-sm">
              <p className="text-sm text-purple-900 dark:text-purple-100 font-medium">
                ✅ <strong>Servicio Habilitado:</strong> Este producto se puede vender sin stock disponible
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                Se permitirá crear ventas incluso si el inventario es 0 o negativo
              </p>
            </div>
          )}
        </div>
      )}

      {/* ✨ NUEVA SECCIÓN: Información de Medicamentos (solo para farmacias) */}
      {es_farmacia && (
        <div className="space-y-3 mt-6 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7.53-2a10 10 0 11-14.06 0M9 12l2 2 4-4m0 0l4-4m-4 4l-4-4" />
            </svg>
            <div className="flex-1">
              <Label className="font-semibold flex items-center gap-2 text-base">
                <span>💊</span> Información de Medicamento
              </Label>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 leading-relaxed">
                Complete los campos de medicamento para identificar el principio activo e indicaciones de uso.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="space-y-1">
              <Label htmlFor="principio_activo" className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">⚗️</span> Principio Activo
              </Label>
              <textarea
                id="principio_activo"
                value={data.principio_activo ?? ''}
                onChange={e => setData('principio_activo', e.target.value || null)}
                placeholder="Ej: Ibuprofeno, Paracetamol, Amoxicilina"
                className={`w-full px-3 py-2 rounded-md border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getInputClassName('principio_activo')}`}
                rows={3}
              />
              {errors.principio_activo && <div className="text-red-500 text-sm mt-1">⚠️ {errors.principio_activo}</div>}
              <div className="text-xs text-muted-foreground mt-1">
                💡 Ingresa el ingrediente activo del medicamento
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="uso_de_medicacion" className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">📋</span> Uso / Indicaciones
              </Label>
              <textarea
                id="uso_de_medicacion"
                value={data.uso_de_medicacion ?? ''}
                onChange={e => setData('uso_de_medicacion', e.target.value || null)}
                placeholder="Ej: Dolor, fiebre, inflamación / Infecciones bacterianas"
                className={`w-full px-3 py-2 rounded-md border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getInputClassName('uso_de_medicacion')}`}
                rows={3}
              />
              {errors.uso_de_medicacion && <div className="text-red-500 text-sm mt-1">⚠️ {errors.uso_de_medicacion}</div>}
              <div className="text-xs text-muted-foreground mt-1">
                💡 Describe las indicaciones o usos principales del medicamento
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✨ NUEVA SECCIÓN: Visibilidad en App */}
      <div className="space-y-3 mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <Checkbox
              id="visible_app"
              checked={!!data.visible_app}
              onCheckedChange={(v) => setData('visible_app', !!v)}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="visible_app" className="font-semibold cursor-pointer flex items-center gap-2 text-base">
              <span>👁️</span> Visible en App
            </Label>
            <p className="text-sm text-green-700 dark:text-green-300 mt-2 leading-relaxed">
              {data.visible_app ? '✅ Este producto es visible en la aplicación móvil' : '❌ Este producto está oculto en la aplicación móvil'}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              💡 Desactiva esta opción si quieres ocultarlo de los clientes en la app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step1DatosProducto;
