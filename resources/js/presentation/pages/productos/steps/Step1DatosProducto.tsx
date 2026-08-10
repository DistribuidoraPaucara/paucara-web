import NotificationService from '@/infrastructure/services/notification.service';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { FeatureToggle } from '@/presentation/components/ui/feature-toggle';
import { Input } from '@/presentation/components/ui/input';
import InputSearch from '@/presentation/components/ui/input-search';
import { Label } from '@/presentation/components/ui/label';
import SearchSelect from '@/presentation/components/ui/search-select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/presentation/components/ui/tooltip';
import { useState } from 'react';

interface Option {
    value: number | string;
    label: string;
    description?: string;
}

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
    visible_app, // ✨ NUEVO
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
                setProductosCacheMap((prev) => ({ ...prev, ...newCache }));

                return result.data.map((producto: any) => ({
                    value: producto.id,
                    label: producto.nombre,
                    description: `SKU: ${producto.sku || 'N/A'} | Categoría: ${producto.categoria?.nombre || 'N/A'}`,
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
                    stock_total: undefined,
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
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
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="mb-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Busca productos existentes por nombre para cargarlos automáticamente</TooltipContent>
                        </Tooltip>
                    </div>
                    {lastProductSearchQuery && lastProductSearchQuery.length >= 2 && !productSearchResultsFound && (
                        <div className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-200">
                            ⚠️ No encontramos "{lastProductSearchQuery}". Puedes crear uno nuevo con este nombre.
                        </div>
                    )}
                </div>
                <div>
                    <div className="mb-1 flex items-center gap-2">
                        <div className="relative flex-1">
                            <label
                                htmlFor="sku"
                                className={`pointer-events-none absolute left-3 transition-all duration-200 ${
                                    data.sku
                                        ? 'top-[-6px] text-xs font-medium text-blue-600 dark:text-blue-400'
                                        : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                SKU / Código (opcional)
                            </label>
                            <Input
                                id="sku"
                                value={data.sku ?? ''}
                                onChange={(e) => setData('sku', e.target.value)}
                                placeholder=""
                                className={`pt-2 ${getInputClassName('sku')}`}
                            />
                            {errors.sku && <div className="mt-1 text-sm text-red-500">⚠️ {errors.sku}</div>}
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Si no lo ingresas, se generará automáticamente (ej.: PRO0001)</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
                <div>
                    <div className="mb-1 flex items-center gap-2">
                        <div className="relative flex-1">
                            {/* <label
                                htmlFor="sku"
                                className={`pointer-events-none absolute left-3 transition-all duration-200 ${
                                    data.sku
                                        ? 'top-[-6px] text-xs font-medium text-blue-600 dark:text-blue-400'
                                        : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                Proveedor (opcional)
                            </label> */}
                            <InputSearch
                                id="proveedor"
                                label=""
                                value={data.proveedor_id ?? ''}
                                onChange={(value) => setData('proveedor_id', value ? Number(value) : '')}
                                onSearch={searchProveedores}
                                placeholder="Busca o crea tu Proveedor"
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
                                                        NotificationService.error(
                                                            'Ya existe un proveedor con ese nombre. Por favor, elige un nombre diferente.',
                                                        );
                                                    } else {
                                                        NotificationService.error(result.message || 'Error al crear el proveedor');
                                                    }
                                                }
                                            } else {
                                                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                                                console.error('❌ Error HTTP:', response.status, errorData.message);

                                                // Manejar errores de validación específicos
                                                if (response.status === 422 && errorData.errors?.nombre) {
                                                    NotificationService.error(
                                                        'Ya existe un proveedor con ese nombre. Por favor, elige un nombre diferente.',
                                                    );
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
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Si no encuentras el proveedor, puedes crearlo haciendo clic en el botón ➕. El sistema evitará crear proveedores con
                                nombres duplicados.
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    {lastSearchQuery && lastSearchQuery.length >= 2 && !searchResultsFound && (
                        <div className="mt-1 px-1 text-xs font-semibold text-amber-700 dark:text-amber-200">
                            ⚠️ No encontramos "{lastSearchQuery}" en la base de datos. Puedes crearlo haciendo clic en el botón ➕.
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                        value={data.unidad_medida_id ?? unidadesOptions.find((u) => u.description === 'UN')?.value ?? ''}
                        options={unidadesOptions}
                        onChange={(value) => setData('unidad_medida_id', value ? Number(value) : '')}
                        error={errors.unidad_medida_id}
                        allowClear={true}
                        emptyText="No se encontraron unidades"
                        searchPlaceholder="Buscar unidades..."
                        renderOption={(option, isSelected) => (
                            <div
                                className={`flex items-center justify-between px-3 py-2 ${isSelected ? 'border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            >
                                <span className="text-sm font-medium">{option.label}</span>
                                {option.description && (
                                    <span className="rounded bg-secondary px-2 py-1 text-xs text-muted-foreground">{option.description}</span>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                    <div className="relative">
                        <label
                            htmlFor="peso"
                            className={`pointer-events-none absolute left-3 transition-all duration-200 ${
                                data.peso
                                    ? 'top-[-6px] text-xs font-medium text-blue-600 dark:text-blue-400'
                                    : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            Peso (Kg) (opcional para entregas)
                        </label>
                        <Input
                            id="peso"
                            type="number"
                            step="0.001"
                            value={data.peso ?? ''}
                            onChange={(e) => setData('peso', e.target.value ? Number(e.target.value) : null)}
                            placeholder=""
                            className={`pt-2 ${getInputClassName('peso')}`}
                        />
                    </div>
                    {errors.peso && <div className="mt-1 text-sm text-red-500">⚠️ {errors.peso}</div>}
                </div>
                {/* 🆕 Campo activo oculto - el valor por defecto (true) se establece en form.tsx */}
                <div className="hidden">
                    <Checkbox id="activo" checked={!!data.activo} onCheckedChange={(v) => setData('activo', !!v)} />
                    <Label htmlFor="activo">Activo</Label>
                </div>
                <div className="space-y-1">
                    <div className="relative">
                        <label
                            htmlFor="descripcion"
                            className={`pointer-events-none absolute left-3 transition-all duration-200 ${
                                data.descripcion
                                    ? 'top-[-6px] text-xs font-medium text-blue-600 dark:text-blue-400'
                                    : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            Descripción
                        </label>
                        <Input
                            id="descripcion"
                            value={data.descripcion ?? ''}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            placeholder=""
                            className={`pt-2 ${getInputClassName('descripcion')}`}
                        />
                    </div>
                    {errors.descripcion && <div className="mt-1 text-sm text-red-500">⚠️ {errors.descripcion}</div>}
                </div>
            </div>
            <div className="mt-2 border-t border-blue-200 p-2">
                <div className="flex items-start gap-2">
                    <svg
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        <strong>Alertas de Stock Globales:</strong> Para evitar agotamientos, configura estos valores.
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1">
                        <Label htmlFor="stock_minimo" className="flex items-center gap-2">
                            Stock Mínimo
                            <span className="text-xs font-normal text-muted-foreground">(Alerta global)</span>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>Recibirás una alerta cuando el stock total sea menor a este valor</TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input
                            id="stock_minimo"
                            type="number"
                            min="0"
                            step="1"
                            value={data.stock_minimo ?? ''}
                            onChange={(e) => setData('stock_minimo', e.target.value ? Number(e.target.value) : null)}
                            className={getInputClassName('stock_minimo')}
                            placeholder="Ej: 10"
                        />
                        {errors.stock_minimo && <div className="mt-1 text-sm text-red-500">⚠️ {errors.stock_minimo}</div>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="stock_maximo" className="flex items-center gap-2">
                            Stock Máximo
                            <span className="text-xs font-normal text-muted-foreground">(Alerta global)</span>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>Recibirás una alerta cuando el stock total supere este valor</TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input
                            id="stock_maximo"
                            type="number"
                            min="0"
                            step="1"
                            value={data.stock_maximo ?? ''}
                            onChange={(e) => setData('stock_maximo', e.target.value ? Number(e.target.value) : null)}
                            className={getInputClassName('stock_maximo')}
                            placeholder="Ej: 100"
                        />
                        {errors.stock_maximo && <div className="mt-1 text-sm text-red-500">⚠️ {errors.stock_maximo}</div>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="limite_venta" className="flex items-center gap-2">
                            Límite de Venta
                            <span className="text-xs font-normal text-muted-foreground">(Máximo por venta)</span>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>Cantidad máxima permitida para adicionar al carrito. Dejar vacío = sin límite</TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input
                            id="limite_venta"
                            type="number"
                            min="1"
                            step="1"
                            value={data.limite_venta ?? ''}
                            onChange={(e) => {
                                const valor = e.target.value.trim();
                                setData('limite_venta', valor === '' ? null : parseInt(valor, 10));
                            }}
                            className={getInputClassName('limite_venta')}
                            placeholder="Ej: 50 (dejar vacío para sin límite)"
                        />
                        {errors.limite_venta && <div className="mt-1 text-sm text-red-500">⚠️ {errors.limite_venta}</div>}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {/* ✨ NUEVA SECCIÓN: Productos Fraccionados */}
                {permite_productos_fraccionados && (
                    <FeatureToggle
                        id="es_fraccionado"
                        checked={!!data.es_fraccionado}
                        onCheckedChange={(v) => setData('es_fraccionado', !!v)}
                        icon="⚡"
                        title="Productos Fraccionados"
                        description="Permite fraccionamiento de este producto en diferentes unidades de medida."
                        colorScheme="blue"
                    />
                )}

                {/* 🍦 NUEVA SECCIÓN: Producto de Comida/Helado */}
                {/* <FeatureToggle
                    id="es_producto_comida"
                    checked={!!data.es_producto_comida}
                    onCheckedChange={(v) => setData('es_producto_comida', !!v)}
                    icon="🍦"
                    title="Producto Resort"
                    description="Marca este producto si es una comida o helado que se vende sin control de stock."
                    hint="Ejemplo: Helados, postres, bebidas personalizadas"
                    colorScheme="orange"
                /> */}

                {/* ✅ NUEVA SECCIÓN: Venta sin Stock (solo para farmacias) */}
                <FeatureToggle
                    id="permite_venta_sin_stock"
                    checked={!!data.permite_venta_sin_stock}
                    onCheckedChange={(v) => setData('permite_venta_sin_stock', !!v)}
                    icon="⚙️"
                    title="Vender sin Stock"
                    description="Marca este producto si es un servicio que se puede vender incluso sin inventario disponible."
                    hint="Ejemplo: Inyecciones, curaciones, aplicación de medicamentos"
                    colorScheme="purple"
                    /* additionalContent={
                          <div>
                              <p className="text-sm font-medium">✅ <strong>Servicio Habilitado:</strong> Este producto se puede vender sin stock disponible</p>
                              <p className="mt-1 text-xs opacity-75">Se permitirá crear ventas incluso si el inventario es 0 o negativo</p>
                          </div>
                      } */
                />

                {/* ✨ NUEVA SECCIÓN: Visibilidad en App */}
                <FeatureToggle
                    id="visible_app"
                    checked={!!data.visible_app}
                    onCheckedChange={(v) => setData('visible_app', !!v)}
                    icon="👁️"
                    title="Visible en App"
                    description={
                        data.visible_app
                            ? '✅ Este producto es visible en la aplicación móvil'
                            : '❌ Este producto está oculto en la aplicación móvil'
                    }
                    hint="Desactiva esta opción si quieres ocultarlo de los clientes en la app"
                    colorScheme="green"
                />
            </div>

            {/* ✨ NUEVA SECCIÓN: Información de Medicamentos (solo para farmacias) */}
            {es_farmacia && (
                <div className="mt-2 space-y-3 rounded-lg border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-2 shadow-sm dark:border-blue-800 dark:from-blue-950/30 dark:to-cyan-950/30">
                    <div className="flex items-start gap-3">
                        <svg
                            className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m7.53-2a10 10 0 11-14.06 0M9 12l2 2 4-4m0 0l4-4m-4 4l-4-4"
                            />
                        </svg>
                        <div className="flex-1">
                            <Label className="flex items-center gap-2 text-base font-semibold">
                                <span>💊</span> Información de Medicamento
                            </Label>
                            {/* <p className="mt-2 text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                                Complete los campos de medicamento para identificar el principio activo e indicaciones de uso.
                            </p> */}
                        </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="principio_activo" className="flex items-center gap-2">
                                <span className="text-blue-600 dark:text-blue-400">⚗️</span> Principio Activo
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Ingresa el ingrediente activo del medicamento</TooltipContent>
                                </Tooltip>
                            </Label>
                            <textarea
                                id="principio_activo"
                                value={data.principio_activo ?? ''}
                                onChange={(e) => setData('principio_activo', e.target.value || null)}
                                placeholder="Ej: Ibuprofeno, Paracetamol, Amoxicilina"
                                className={`w-full rounded-md border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none ${getInputClassName('principio_activo')}`}
                                rows={3}
                            />
                            {errors.principio_activo && <div className="mt-1 text-sm text-red-500">⚠️ {errors.principio_activo}</div>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="uso_de_medicacion" className="flex items-center gap-2">
                                <span className="text-blue-600 dark:text-blue-400">📋</span> Uso / Indicaciones
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Describe las indicaciones o usos principales del medicamento</TooltipContent>
                                </Tooltip>
                            </Label>
                            <textarea
                                id="uso_de_medicacion"
                                value={data.uso_de_medicacion ?? ''}
                                onChange={(e) => setData('uso_de_medicacion', e.target.value || null)}
                                placeholder="Ej: Dolor, fiebre, inflamación / Infecciones bacterianas"
                                className={`w-full rounded-md border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none ${getInputClassName('uso_de_medicacion')}`}
                                rows={3}
                            />
                            {errors.uso_de_medicacion && <div className="mt-1 text-sm text-red-500">⚠️ {errors.uso_de_medicacion}</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Step1DatosProducto;
