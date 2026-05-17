import { useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import SearchSelect from '@/presentation/components/ui/search-select';
import { Calendar, Filter, RotateCcw, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Importar tipos del domain
import type {
    FiltrosCompras,
    DatosParaFiltrosCompras
} from '@/domain/entities/compras';

// Importar service
import comprasService from '@/infrastructure/services/compras.service';

interface Props {
    filtros?: FiltrosCompras;
    datosParaFiltros?: DatosParaFiltrosCompras;
    className?: string;
}

export default function FiltrosCompras({ filtros, datosParaFiltros, className }: Props) {
    // Valores por defecto para evitar errores de undefined
    const filtrosSeguras = filtros || {};
    const datosSeguras = datosParaFiltros || {
        proveedores: [],
        estados: [],
        monedas: [],
        tipos_pago: []
    };

    const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(
        Boolean(
            filtrosSeguras.proveedor_id ||
            filtrosSeguras.estado_documento_id ||
            filtrosSeguras.moneda_id ||
            filtrosSeguras.tipo_pago_id ||
            filtrosSeguras.fecha_desde ||
            filtrosSeguras.fecha_hasta
        )
    );

    const [valoresLocales, setValoresLocales] = useState<FiltrosCompras>({
        q: filtrosSeguras.q || '',
        id: filtrosSeguras.id || '',
        proveedor_id: filtrosSeguras.proveedor_id || '',
        estado_documento_id: filtrosSeguras.estado_documento_id || '',
        moneda_id: filtrosSeguras.moneda_id || '',
        tipo_pago_id: filtrosSeguras.tipo_pago_id || '',
        fecha_desde: filtrosSeguras.fecha_desde || '',
        fecha_hasta: filtrosSeguras.fecha_hasta || '',
        sort_by: filtrosSeguras.sort_by || 'created_at',
        sort_dir: filtrosSeguras.sort_dir || 'desc',
    });

    // Estado local para el input de búsqueda combinada
    const [busquedaCombinada, setBusquedaCombinada] = useState<string>(
        filtrosSeguras.q || filtrosSeguras.id || ''
    );

    const aplicarFiltros = () => {
        const filtrosLimpios = Object.fromEntries(
            Object.entries(valoresLocales).filter(([, value]) => value !== '' && value != null)
        );

        comprasService.search(filtrosLimpios as FiltrosCompras);
    };

    const limpiarFiltros = () => {
        setValoresLocales({
            q: '',
            id: '',
            proveedor_id: '',
            estado_documento_id: '',
            moneda_id: '',
            tipo_pago_id: '',
            fecha_desde: '',
            fecha_hasta: '',
            sort_by: 'created_at',
            sort_dir: 'desc',
        });

        setBusquedaCombinada('');
        comprasService.clearFilters();
    };

    const busquedaRapida = (e: React.FormEvent) => {
        e.preventDefault();

        // Detectar si la búsqueda es por ID (solo números) o búsqueda general (texto)
        const filtrosParaBusqueda: FiltrosCompras = {
            ...Object.fromEntries(
                Object.entries(valoresLocales).filter(([key, value]) =>
                    key !== 'q' && key !== 'id' && value !== '' && value != null
                )
            )
        };

        if (busquedaCombinada) {
            if (/^\d+$/.test(busquedaCombinada)) {
                // Solo números: buscar por ID
                filtrosParaBusqueda.id = Number(busquedaCombinada);
            } else {
                // Contiene letras: búsqueda general
                filtrosParaBusqueda.q = busquedaCombinada;
            }
        }

        comprasService.search(filtrosParaBusqueda);
    };

    const hayFiltrosActivos = Object.values(filtrosSeguras).some(value =>
        value !== '' && value != null && value !== 'created_at' && value !== 'desc'
    );

    const opcionesProveedores = datosSeguras.proveedores.map(p => ({
        value: p.id,
        label: p.nombre
    }));

    const opcionesEstados = datosSeguras.estados.map(e => ({
        value: e.id,
        label: e.nombre
    }));

    const opcionesMonedas = datosSeguras.monedas.map(m => ({
        value: m.id,
        label: `${m.codigo} (${m.simbolo})`
    }));

    const opcionesTiposPago = datosSeguras.tipos_pago.map(t => ({
        value: t.id,
        label: `${t.nombre} (${t.codigo})`
    }));

    const opcionesOrden = [
        { value: 'created_at', label: 'Fecha de creación' },
        { value: 'fecha', label: 'Fecha de compra' },
        { value: 'numero', label: 'Número' },
        { value: 'total', label: 'Total' },
        { value: 'proveedor', label: 'Proveedor' },
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
            <form onSubmit={busquedaRapida} className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Buscar por ID, número, factura, proveedor..."
                            title="Escribe un número para buscar por ID, o texto para búsqueda general"
                            value={busquedaCombinada}
                            onChange={e => setBusquedaCombinada(e.target.value)}
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
                        {/* Proveedor */}
                        <div>
                            <Label htmlFor="proveedor_id" className="text-sm font-medium">
                                Proveedor
                            </Label>
                            <SearchSelect
                                id="proveedor_id"
                                placeholder="Todos los proveedores"
                                value={valoresLocales.proveedor_id || ''}
                                options={opcionesProveedores}
                                onChange={value => setValoresLocales(prev => ({ ...prev, proveedor_id: String(value) }))}
                                allowClear
                                emptyText="No hay proveedores disponibles"
                            />
                        </div>

                        {/* Estado */}
                        <div>
                            <Label htmlFor="estado_documento_id" className="text-sm font-medium">
                                Estado
                            </Label>
                            <SearchSelect
                                id="estado_documento_id"
                                placeholder="Todos los estados"
                                value={valoresLocales.estado_documento_id || ''}
                                options={opcionesEstados}
                                onChange={value => setValoresLocales(prev => ({ ...prev, estado_documento_id: String(value) }))}
                                allowClear
                                emptyText="No hay estados disponibles"
                            />
                        </div>

                        {/* Moneda */}
                        <div>
                            <Label htmlFor="moneda_id" className="text-sm font-medium">
                                Moneda
                            </Label>
                            <SearchSelect
                                id="moneda_id"
                                placeholder="Todas las monedas"
                                value={valoresLocales.moneda_id || ''}
                                options={opcionesMonedas}
                                onChange={value => setValoresLocales(prev => ({ ...prev, moneda_id: String(value) }))}
                                allowClear
                                emptyText="No hay monedas disponibles"
                            />
                        </div>

                        {/* Tipo de Pago */}
                        <div>
                            <Label htmlFor="tipo_pago_id" className="text-sm font-medium">
                                Tipo de Pago
                            </Label>
                            <SearchSelect
                                id="tipo_pago_id"
                                placeholder="Todos los tipos"
                                value={valoresLocales.tipo_pago_id || ''}
                                options={opcionesTiposPago}
                                onChange={value => setValoresLocales(prev => ({ ...prev, tipo_pago_id: String(value) }))}
                                allowClear
                                emptyText="No hay tipos de pago disponibles"
                            />
                        </div>
                    </div>

                    {/* Rango de fechas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="fecha_desde" className="text-sm font-medium">
                                Fecha desde
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    id="fecha_desde"
                                    type="date"
                                    value={valoresLocales.fecha_desde}
                                    onChange={e => setValoresLocales(prev => ({ ...prev, fecha_desde: e.target.value }))}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="fecha_hasta" className="text-sm font-medium">
                                Fecha hasta
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    id="fecha_hasta"
                                    type="date"
                                    value={valoresLocales.fecha_hasta}
                                    onChange={e => setValoresLocales(prev => ({ ...prev, fecha_hasta: e.target.value }))}
                                    className="pl-10"
                                />
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
                    {filtrosSeguras.id && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            ID: {filtrosSeguras.id}
                        </span>
                    )}
                    {filtrosSeguras.q && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Búsqueda: {filtrosSeguras.q}
                        </span>
                    )}
                    {filtrosSeguras.proveedor_id && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Proveedor: {datosSeguras.proveedores.find(p => p.id === Number(filtrosSeguras.proveedor_id))?.nombre || 'Desconocido'}
                        </span>
                    )}
                    {filtrosSeguras.estado_documento_id && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Estado: {datosSeguras.estados.find(e => e.id === Number(filtrosSeguras.estado_documento_id))?.nombre || 'Desconocido'}
                        </span>
                    )}
                    {filtrosSeguras.fecha_desde && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Desde: {new Date(filtrosSeguras.fecha_desde).toLocaleDateString('es-ES')}
                        </span>
                    )}
                    {filtrosSeguras.fecha_hasta && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Hasta: {new Date(filtrosSeguras.fecha_hasta).toLocaleDateString('es-ES')}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
