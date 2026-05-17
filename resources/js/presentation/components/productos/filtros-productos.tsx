import { useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import SearchSelect from '@/presentation/components/ui/search-select';
import { Filter, RotateCcw, Search, X, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

// Importar tipos del domain
import type {
    FiltrosProductos,
    DatosParaFiltrosProductos
} from '@/domain/entities/productos';

// Importar service
import productosService from '@/infrastructure/services/productos.service';

interface Props {
    filtros?: FiltrosProductos;
    datosParaFiltros?: DatosParaFiltrosProductos;
    className?: string;
}

export default function FiltrosProductos({ filtros, datosParaFiltros, className }: Props) {
    // Valores por defecto para evitar errores de undefined
    const filtrosSeguras = filtros || {};
    const datosSeguras = datosParaFiltros || {
        categorias: [],
        marcas: []
    };

    const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(
        Boolean(
            filtrosSeguras.categoria_id ||
            filtrosSeguras.marca_id ||
            filtrosSeguras.activo ||
            filtrosSeguras.stock_minimo ||
            filtrosSeguras.stock_maximo ||
            filtrosSeguras.precio_desde ||
            filtrosSeguras.precio_hasta
        )
    );

    const [valoresLocales, setValoresLocales] = useState<FiltrosProductos>({
        q: filtrosSeguras.q || '',
        categoria_id: filtrosSeguras.categoria_id || '',
        marca_id: filtrosSeguras.marca_id || '',
        activo: filtrosSeguras.activo || '',
        stock_minimo: filtrosSeguras.stock_minimo || '',
        stock_maximo: filtrosSeguras.stock_maximo || '',
        precio_desde: filtrosSeguras.precio_desde || '',
        precio_hasta: filtrosSeguras.precio_hasta || '',
        sort_by: filtrosSeguras.sort_by || 'created_at',
        sort_dir: filtrosSeguras.sort_dir || 'desc',
    });

    const aplicarFiltros = () => {
        const filtrosLimpios = Object.fromEntries(
            Object.entries(valoresLocales).filter(([, value]) => value !== '' && value != null)
        );

        productosService.search(filtrosLimpios as FiltrosProductos);
    };

    const limpiarFiltros = () => {
        setValoresLocales({
            q: '',
            categoria_id: '',
            marca_id: '',
            activo: '',
            stock_minimo: '',
            stock_maximo: '',
            precio_desde: '',
            precio_hasta: '',
            sort_by: 'created_at',
            sort_dir: 'desc',
        });

        productosService.clearFilters();
    };

    const busquedaRapida = (e: React.FormEvent) => {
        e.preventDefault();

        const filtrosParaBusqueda = {
            ...Object.fromEntries(
                Object.entries(valoresLocales).filter(([key, value]) =>
                    key !== 'q' && value !== '' && value != null
                )
            ),
            q: valoresLocales.q
        };

        productosService.search(filtrosParaBusqueda as FiltrosProductos);
    };

    const hayFiltrosActivos = Object.values(filtrosSeguras).some(value =>
        value !== '' && value != null && value !== 'created_at' && value !== 'desc'
    );

    const opcionesCategorias = datosSeguras.categorias.map(c => ({
        value: c.id,
        label: c.nombre
    }));

    const opcionesMarcas = datosSeguras.marcas.map(m => ({
        value: m.id,
        label: m.nombre
    }));

    const opcionesActivo = [
        { value: '1', label: 'Activos' },
        { value: '0', label: 'Inactivos' },
    ];

    const opcionesOrden = [
        { value: 'created_at', label: 'Fecha de creación' },
        { value: 'nombre', label: 'Nombre' },
        { value: 'codigo_barras', label: 'Código' },
        { value: 'precio_base', label: 'Precio' },
        { value: 'stock_total', label: 'Stock' },
    ];

    // Validar que los filtros existan
    if (!filtros) {
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Cargando filtros...
                </div>
            </div>
        );
    }

    return (
        <div className={cn('bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4', className)}>
            {/* Búsqueda rápida */}
            <form onSubmit={busquedaRapida} className="flex gap-3">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Buscar por nombre, código, descripción..."
                            value={valoresLocales.q}
                            onChange={e => setValoresLocales(prev => ({ ...prev, q: e.target.value }))}
                            className="pl-10"
                        />
                    </div>
                </div>
                <Button type="submit" variant="outline" size="sm">
                    <Search className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                    className={cn(
                        mostrarFiltrosAvanzados && 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    )}
                >
                    <Filter className="h-4 w-4 mr-1" />
                    Filtros
                </Button>
                {hayFiltrosActivos && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={limpiarFiltros}
                    >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Limpiar
                    </Button>
                )}
            </form>

            {/* Filtros avanzados */}
            {mostrarFiltrosAvanzados && (
                <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Categoría */}
                        <div>
                            <Label htmlFor="categoria_id" className="text-sm font-medium">
                                Categoría
                            </Label>
                            <SearchSelect
                                id="categoria_id"
                                placeholder="Todas las categorías"
                                value={valoresLocales.categoria_id || ''}
                                options={opcionesCategorias}
                                onChange={value => setValoresLocales(prev => ({ ...prev, categoria_id: String(value) }))}
                                allowClear
                                emptyText="No hay categorías disponibles"
                            />
                        </div>

                        {/* Marca */}
                        <div>
                            <Label htmlFor="marca_id" className="text-sm font-medium">
                                Marca
                            </Label>
                            <SearchSelect
                                id="marca_id"
                                placeholder="Todas las marcas"
                                value={valoresLocales.marca_id || ''}
                                options={opcionesMarcas}
                                onChange={value => setValoresLocales(prev => ({ ...prev, marca_id: String(value) }))}
                                allowClear
                                emptyText="No hay marcas disponibles"
                            />
                        </div>

                        {/* Estado Activo */}
                        <div>
                            <Label htmlFor="activo" className="text-sm font-medium">
                                Estado
                            </Label>
                            <SearchSelect
                                id="activo"
                                placeholder="Todos los estados"
                                value={valoresLocales.activo || ''}
                                options={opcionesActivo}
                                onChange={value => setValoresLocales(prev => ({ ...prev, activo: String(value) }))}
                                allowClear
                                emptyText="No hay estados disponibles"
                            />
                        </div>

                        {/* Stock mínimo */}
                        <div>
                            <Label htmlFor="stock_minimo" className="text-sm font-medium">
                                Stock mínimo
                            </Label>
                            <Input
                                id="stock_minimo"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={valoresLocales.stock_minimo}
                                onChange={e => setValoresLocales(prev => ({ ...prev, stock_minimo: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Rango de stock y precios */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="stock_maximo" className="text-sm font-medium">
                                Stock máximo
                            </Label>
                            <Input
                                id="stock_maximo"
                                type="number"
                                min="0"
                                placeholder="Sin límite"
                                value={valoresLocales.stock_maximo}
                                onChange={e => setValoresLocales(prev => ({ ...prev, stock_maximo: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Rango de precios</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Precio desde"
                                        value={valoresLocales.precio_desde}
                                        onChange={e => setValoresLocales(prev => ({ ...prev, precio_desde: e.target.value }))}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Precio hasta"
                                        value={valoresLocales.precio_hasta}
                                        onChange={e => setValoresLocales(prev => ({ ...prev, precio_hasta: e.target.value }))}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ordenamiento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="sort_by" className="text-sm font-medium">
                                Ordenar por
                            </Label>
                            <SearchSelect
                                id="sort_by"
                                placeholder="Campo de ordenamiento"
                                value={valoresLocales.sort_by || 'created_at'}
                                options={opcionesOrden}
                                onChange={value => setValoresLocales(prev => ({ ...prev, sort_by: String(value) }))}
                                allowClear={false}
                            />
                        </div>

                        <div>
                            <Label htmlFor="sort_dir" className="text-sm font-medium">
                                Dirección
                            </Label>
                            <SearchSelect
                                id="sort_dir"
                                placeholder="Dirección"
                                value={valoresLocales.sort_dir || 'desc'}
                                options={[
                                    { value: 'asc', label: 'Ascendente' },
                                    { value: 'desc', label: 'Descendente' },
                                ]}
                                onChange={value => setValoresLocales(prev => ({ ...prev, sort_dir: String(value) }))}
                                allowClear={false}
                            />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3 pt-2 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setMostrarFiltrosAvanzados(false)}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Cerrar
                        </Button>
                        <Button
                            type="button"
                            onClick={aplicarFiltros}
                            size="sm"
                        >
                            Aplicar Filtros
                        </Button>
                    </div>
                </div>
            )}

            {/* Indicadores de filtros activos */}
            {hayFiltrosActivos && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Filtros activos:</span>
                    {filtrosSeguras.q && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Búsqueda: {filtrosSeguras.q}
                        </span>
                    )}
                    {filtrosSeguras.categoria_id && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Categoría: {datosSeguras.categorias.find(c => c.id === Number(filtrosSeguras.categoria_id))?.nombre || 'Desconocido'}
                        </span>
                    )}
                    {filtrosSeguras.marca_id && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Marca: {datosSeguras.marcas.find(m => m.id === Number(filtrosSeguras.marca_id))?.nombre || 'Desconocido'}
                        </span>
                    )}
                    {filtrosSeguras.activo && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Estado: {filtrosSeguras.activo === '1' ? 'Activos' : 'Inactivos'}
                        </span>
                    )}
                    {filtrosSeguras.stock_minimo && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            Stock min: {filtrosSeguras.stock_minimo}
                        </span>
                    )}
                    {filtrosSeguras.stock_maximo && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            Stock max: {filtrosSeguras.stock_maximo}
                        </span>
                    )}
                    {filtrosSeguras.precio_desde && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                            Precio desde: Bs. {Number(filtrosSeguras.precio_desde).toFixed(2)}
                        </span>
                    )}
                    {filtrosSeguras.precio_hasta && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                            Precio hasta: Bs. {Number(filtrosSeguras.precio_hasta).toFixed(2)}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
