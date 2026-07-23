import DynamicSearchSelect from '@/presentation/components/form-sections/DynamicSearchSelect';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { ChevronDown, Filter, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

/**
 * Estado de filtros avanzados
 */
export interface FiltrosEntregas {
    estado: string;
    busqueda_entrega?: string;
    busqueda_ventas?: string;
    chofer_id?: string;
    vehiculo_id?: string;
    entregador_id?: string; // ✅ NUEVO: Filtrar por entregador
    localidad_id?: string;
    estado_logistica_id?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    tipo_fecha?: 'created_at' | 'fecha_programada'; // ✅ NUEVO
    turno?: 'manana' | 'tarde' | ''; // ✅ NUEVO
}

interface Props {
    filtros: FiltrosEntregas;
    onFilterChange: (key: keyof FiltrosEntregas, value: string) => void;
    onReset: () => void;
    onApply?: (filtrosDirectos?: Partial<FiltrosEntregas>) => void;
    estadosAPI: Array<{ codigo: string; nombre: string }>;
    vehiculos: Array<{ id: number; placa: string; marca: string; modelo: string }>;
    choferes: Array<{ id: number; nombre: string }>;
    entregadores?: Array<{ id: number; nombre: string }>; // ✅ NUEVO: Array de entregadores
    localidades: Array<{ id: number; nombre: string; codigo: string }>;
    estadosLogisticos: Array<{ id: number; codigo: string; nombre: string; color?: string; icono?: string }>;
    isLoading?: boolean;
}

/**
 * Componente de filtros avanzados para entregas
 *
 * CARACTERÍSTICAS:
 * ✅ Filtros por: estado, chofer, vehículo, fecha, búsqueda
 * ✅ Indicador visual de filtros activos
 * ✅ Botón reset rápido
 * ✅ Búsqueda con debounce
 * ✅ Responsive y accesible
 */
export function EntregasFilters({
    filtros,
    onFilterChange,
    onReset,
    onApply,
    estadosAPI,
    vehiculos,
    choferes,
    entregadores = [], // ✅ NUEVO: Entregadores
    localidades,
    estadosLogisticos,
    isLoading = false,
}: Props) {
    // 🔍 DEBUG: Revisar si localidades está llegando
    console.log('🔍 EntregasFilters DEBUG:', {
        localidadesCount: localidades?.length || 0,
        localidades: localidades,
        entregadoresCount: entregadores?.length || 0,
        entregadores: entregadores,
    });

    // ✅ Estado para controlar visibilidad de filtros
    const [filtrosVisibles, setFiltrosVisibles] = useState(false);

    // ✅ NUEVO: Estados para búsquedas dinámicas (DynamicSearchSelect)
    const [choferSearch, setChoferSearch] = useState('');
    const [vehiculoSearch, setVehiculoSearch] = useState('');
    const [entregadorSearch, setEntregadorSearch] = useState(''); // ✅ NUEVO: Búsqueda de entregador
    const [localidadSearch, setLocalidadSearch] = useState('');
    const [estadoLogisticoSearch, setEstadoLogisticoSearch] = useState('');

    // ✅ NUEVO (2026-07-23): Estados locales para fechas (no actualizar URL hasta presionar Buscar)
    const [fechaDesdeLocal, setFechaDesdeLocal] = useState(filtros.fecha_desde || '');
    const [fechaHastaLocal, setFechaHastaLocal] = useState(filtros.fecha_hasta || '');

    const floatingInputClassName =
        'peer w-full rounded-lg border bg-background px-3 pb-2 pt-5 text-sm outline-none transition-colors placeholder:text-transparent focus:border-primary';
    const floatingLabelClassName =
        'absolute left-3 top-0 z-10 -translate-y-1/2 bg-background px-1 origin-left text-xs font-medium text-muted-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-background peer-focus:px-1 peer-focus:text-xs peer-focus:text-primary';

    // Calcular cuántos filtros están activos
    const filtrosActivos = useMemo(() => {
        return [
            filtros.estado !== 'TODOS' && { label: 'Estado', value: filtros.estado },
            filtros.busqueda_entrega && { label: 'Búsqueda Entrega', value: filtros.busqueda_entrega },
            filtros.busqueda_ventas && { label: 'Búsqueda Ventas', value: filtros.busqueda_ventas },
            filtros.chofer_id && {
                label: 'Chofer',
                value: choferes.find((c) => c.id.toString() === filtros.chofer_id)?.nombre || filtros.chofer_id,
            },
            filtros.vehiculo_id && {
                label: 'Vehículo',
                value: vehiculos.find((v) => v.id.toString() === filtros.vehiculo_id)?.placa || filtros.vehiculo_id,
            },
            filtros.localidad_id && {
                label: 'Localidad',
                value: localidades.find((l) => l.id.toString() === filtros.localidad_id)?.nombre || filtros.localidad_id,
            },
            filtros.estado_logistica_id && {
                label: 'Estado Logístico',
                value: estadosLogisticos.find((e) => e.id.toString() === filtros.estado_logistica_id)?.nombre || filtros.estado_logistica_id,
            },
            filtros.fecha_desde && { label: 'Desde', value: filtros.fecha_desde },
            filtros.fecha_hasta && { label: 'Hasta', value: filtros.fecha_hasta },
            filtros.tipo_fecha &&
                filtros.tipo_fecha !== 'fecha_programada' && {
                    label: 'Tipo Fecha',
                    value: filtros.tipo_fecha === 'created_at' ? 'Creación' : 'Programada',
                }, // ✅ NUEVO
            filtros.turno && { label: 'Turno', value: filtros.turno === 'manana' ? 'Mañana' : 'Tarde' }, // ✅ NUEVO
        ].filter(Boolean);
    }, [filtros, choferes, vehiculos, localidades, estadosLogisticos]);

    const handleRemoveFiltro = (key: keyof FiltrosEntregas) => {
        onFilterChange(key, key === 'estado' ? 'TODOS' : '');
    };

    // ✅ NUEVO: Filtrar items según búsqueda (para DynamicSearchSelect)
    const choferesFiltered = useMemo(() => {
        if (!choferSearch) return choferes;
        const query = choferSearch.toLowerCase();
        return choferes.filter((c) => c.nombre.toLowerCase().includes(query));
    }, [choferes, choferSearch]);

    const vehiculosFiltered = useMemo(() => {
        if (!vehiculoSearch) return vehiculos;
        const query = vehiculoSearch.toLowerCase();
        return vehiculos.filter(
            (v) => v.placa.toLowerCase().includes(query) || v.marca.toLowerCase().includes(query) || v.modelo.toLowerCase().includes(query),
        );
    }, [vehiculos, vehiculoSearch]);

    const localidadesFiltered = useMemo(() => {
        if (!localidadSearch) return localidades;
        const query = localidadSearch.toLowerCase();
        return localidades.filter((l) => l.nombre.toLowerCase().includes(query) || l.codigo.toLowerCase().includes(query));
    }, [localidades, localidadSearch]);

    const estadosLogisticosFiltered = useMemo(() => {
        if (!estadoLogisticoSearch) return estadosLogisticos;
        const query = estadoLogisticoSearch.toLowerCase();
        return estadosLogisticos.filter((e) => e.nombre.toLowerCase().includes(query) || e.codigo.toLowerCase().includes(query));
    }, [estadosLogisticos, estadoLogisticoSearch]);

    // ✅ NUEVO: Filtrar entregadores según búsqueda
    const entregadoresFiltered = useMemo(() => {
        if (!entregadorSearch) return entregadores;
        const query = entregadorSearch.toLowerCase();
        return entregadores.filter((e) => e.nombre.toLowerCase().includes(query));
    }, [entregadores, entregadorSearch]);

    return (
        <div className="space-y-4">
            {/* Búsqueda Separada: Entrega vs Ventas */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Búsqueda en ENTREGA (ID, placa, chofer) */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            placeholder="Entrega: ID, placa, chofer..."
                            value={filtros.busqueda_entrega || ''}
                            onChange={(e) => onFilterChange('busqueda_entrega', e.target.value)}
                            className={`${floatingInputClassName} pl-3`}
                            disabled={isLoading}
                        />
                        <label className={floatingLabelClassName}>Entrega: ID, placa, chofer</label>
                        <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>

                    {/* Búsqueda en VENTAS (ID venta, cliente, número venta) */}
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            placeholder="Ventas: ID, cliente, número..."
                            value={filtros.busqueda_ventas || ''}
                            onChange={(e) => onFilterChange('busqueda_ventas', e.target.value)}
                            className={`${floatingInputClassName} pl-3`}
                            disabled={isLoading}
                        />
                        <label className={floatingLabelClassName}>Ventas: ID, cliente, número</label>
                        <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 py-2 text-muted-foreground" />
                    </div>

                    {/* ✅ ÚNICO BOTÓN: Aplicar todos los filtros */}
                    {onApply && (
                        <Button onClick={onApply} disabled={isLoading} className="bg-blue-600 p-2 text-white hover:bg-blue-700" size="sm">
                            <Search className="mr-2 h-4 w-4" />
                            Buscar
                        </Button>
                    )}
                </div>

                <button
                    onClick={() => setFiltrosVisibles(!filtrosVisibles)}
                    className="flex cursor-pointer items-center justify-between rounded-lg border bg-background px-2 transition-colors hover:bg-muted/50"
                >
                    <div className="flex flex-wrap items-center gap-1 p-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filtros</span>
                        {filtrosActivos.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {filtrosActivos.length} activo{filtrosActivos.length !== 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${filtrosVisibles ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Grid de filtros - COLAPSABLE */}
            {filtrosVisibles && (
                <div className="space-y-2 duration-200 animate-in fade-in">
                    {/* Grid de filtros principales */}
                    <div className="grid grid-cols-1 gap-3 rounded-lg border bg-muted/50 p-2 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Filtro por Estado Logístico - DynamicSearchSelect */}
                        <DynamicSearchSelect
                            label="Estado Logístico"
                            placeholder="Buscar estado..."
                            selectedItem={
                                filtros.estado_logistica_id ? estadosLogisticos.find((e) => e.id.toString() === filtros.estado_logistica_id) : null
                            }
                            items={estadosLogisticosFiltered}
                            isLoading={isLoading}
                            searchValue={estadoLogisticoSearch}
                            onSearch={setEstadoLogisticoSearch}
                            onSelect={(estado) => {
                                onFilterChange('estado_logistica_id', estado.id.toString());
                                setEstadoLogisticoSearch('');
                            }}
                            onClear={() => {
                                onFilterChange('estado_logistica_id', '');
                                setEstadoLogisticoSearch('');
                            }}
                            renderItem={(estado) => (
                                <div className="text-sm">
                                    <div className="font-medium">
                                        {estado.icono && `${estado.icono} `}
                                        {estado.nombre}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{estado.codigo}</div>
                                </div>
                            )}
                            getItemId={(estado) => estado.id.toString()}
                            getDisplayValue={(estado) => `${estado.icono ? `${estado.icono} ` : ''}${estado.nombre}`}
                        />

                        {/* Filtro por Chofer - DynamicSearchSelect */}
                        <DynamicSearchSelect
                            label="Chofer"
                            placeholder="Buscar chofer..."
                            selectedItem={filtros.chofer_id ? choferes.find((c) => c.id.toString() === filtros.chofer_id) : null}
                            items={choferesFiltered}
                            isLoading={isLoading}
                            searchValue={choferSearch}
                            onSearch={setChoferSearch}
                            onSelect={(chofer) => {
                                onFilterChange('chofer_id', chofer.id.toString());
                                setChoferSearch('');
                            }}
                            onClear={() => {
                                onFilterChange('chofer_id', '');
                                setChoferSearch('');
                            }}
                            renderItem={(chofer) => (
                                <div className="text-sm">
                                    <div className="font-medium">{chofer.nombre}</div>
                                </div>
                            )}
                            getItemId={(chofer) => chofer.id.toString()}
                            getDisplayValue={(chofer) => chofer.nombre}
                        />

                        {/* Filtro por Vehículo - DynamicSearchSelect */}
                        <DynamicSearchSelect
                            label="Vehículo"
                            placeholder="Buscar vehículo..."
                            selectedItem={filtros.vehiculo_id ? vehiculos.find((v) => v.id.toString() === filtros.vehiculo_id) : null}
                            items={vehiculosFiltered}
                            isLoading={isLoading}
                            searchValue={vehiculoSearch}
                            onSearch={setVehiculoSearch}
                            onSelect={(vehiculo) => {
                                onFilterChange('vehiculo_id', vehiculo.id.toString());
                                setVehiculoSearch('');
                            }}
                            onClear={() => {
                                onFilterChange('vehiculo_id', '');
                                setVehiculoSearch('');
                            }}
                            renderItem={(vehiculo) => (
                                <div className="text-sm">
                                    <div className="font-medium">{vehiculo.placa}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {vehiculo.marca} {vehiculo.modelo}
                                    </div>
                                </div>
                            )}
                            getItemId={(vehiculo) => vehiculo.id.toString()}
                            getDisplayValue={(vehiculo) => vehiculo.placa}
                        />

                        {/* ✅ NUEVO: Filtro por Entregador - DynamicSearchSelect */}
                        <DynamicSearchSelect
                            label="Entregador"
                            placeholder="Buscar entregador..."
                            selectedItem={filtros.entregador_id ? entregadores.find((e) => e.id.toString() === filtros.entregador_id) : null}
                            items={entregadoresFiltered}
                            isLoading={isLoading}
                            searchValue={entregadorSearch}
                            onSearch={setEntregadorSearch}
                            onSelect={(entregador) => {
                                onFilterChange('entregador_id', entregador.id.toString());
                                setEntregadorSearch('');
                            }}
                            onClear={() => {
                                onFilterChange('entregador_id', '');
                                setEntregadorSearch('');
                            }}
                            renderItem={(entregador) => (
                                <div className="text-sm">
                                    <div className="font-medium">{entregador.nombre}</div>
                                </div>
                            )}
                            getItemId={(entregador) => entregador.id.toString()}
                            getDisplayValue={(entregador) => entregador.nombre}
                        />

                        {/* Filtro por Localidad - DynamicSearchSelect */}
                        {/* <DynamicSearchSelect
                            label="Localidad"
                            placeholder="Buscar localidad..."
                            selectedItem={
                                filtros.localidad_id
                                    ? localidades.find((l) => l.id.toString() === filtros.localidad_id)
                                    : null
                            }
                            items={localidadesFiltered}
                            isLoading={isLoading}
                            searchValue={localidadSearch}
                            onSearch={setLocalidadSearch}
                            onSelect={(localidad) => {
                                onFilterChange('localidad_id', localidad.id.toString());
                                setLocalidadSearch('');
                            }}
                            onClear={() => {
                                onFilterChange('localidad_id', '');
                                setLocalidadSearch('');
                            }}
                            renderItem={(localidad) => (
                                <div className="text-sm">
                                    <div className="font-medium">{localidad.nombre}</div>
                                    <div className="text-xs text-muted-foreground">{localidad.codigo}</div>
                                </div>
                            )}
                            getItemId={(localidad) => localidad.id.toString()}
                            getDisplayValue={(localidad) => localidad.nombre}
                        /> */}
                    </div>

                    {/* Filtros de fechas */}
                    <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border bg-muted/50 p-2 duration-200 animate-in fade-in">
                        {/* ✅ NUEVO: Selector de tipo de fecha */}
                        <div>
                            <label className="block text-xs mb-2">Tipo de Fecha</label>
                            <div className="flex gap-4">
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="radio"
                                        name="tipo_fecha"
                                        value="fecha_programada"
                                        checked={filtros.tipo_fecha !== 'created_at'}
                                        onChange={() => onFilterChange('tipo_fecha', 'fecha_programada')}
                                        disabled={isLoading}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-xs">📅 Fecha Programada</span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="radio"
                                        name="tipo_fecha"
                                        value="created_at"
                                        checked={filtros.tipo_fecha === 'created_at'}
                                        onChange={() => onFilterChange('tipo_fecha', 'created_at')}
                                        disabled={isLoading}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-xs">📝 Creación</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            {/* ✅ NUEVO: Botones rápidos de fecha (Ayer, Hoy, Mañana) */}
                            <div className="mb-2 block w-full">
                                <label className="block text-xs mb-2">Fechas Rápidas</label>
                                <div className="flex gap-2 items-start">
                                    <Button
                                        size="sm"
                                        variant={
                                            fechaDesdeLocal === new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() => {
                                            const ayer = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
                                            setFechaDesdeLocal(ayer);
                                            setFechaHastaLocal(ayer);
                                        }}
                                        disabled={isLoading}
                                    >
                                        ← Ayer
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={fechaDesdeLocal === new Date().toISOString().split('T')[0] ? 'default' : 'outline'}
                                        onClick={() => {
                                            const hoy = new Date().toISOString().split('T')[0];
                                            setFechaDesdeLocal(hoy);
                                            setFechaHastaLocal(hoy);
                                        }}
                                        disabled={isLoading}
                                    >
                                        Hoy
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={
                                            fechaDesdeLocal === new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() => {
                                            const manana = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
                                            setFechaDesdeLocal(manana);
                                            setFechaHastaLocal(manana);
                                        }}
                                        disabled={isLoading}
                                    >
                                        Mañana →
                                    </Button>

                                    {/* Filtro por Fecha Desde */}
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            value={fechaDesdeLocal}
                                            onChange={(e) => setFechaDesdeLocal(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    onFilterChange('fecha_desde', fechaDesdeLocal);
                                                    onFilterChange('fecha_hasta', fechaHastaLocal);
                                                    onApply?.({ ...filtros, fecha_desde: fechaDesdeLocal, fecha_hasta: fechaHastaLocal });
                                                }
                                            }}
                                            className={`${floatingInputClassName} [&::-webkit-calendar-picker-indicator]:opacity-0`}
                                            disabled={isLoading}
                                        />
                                        <label className={floatingLabelClassName}>Desde</label>
                                    </div>

                                    {/* Filtro por Fecha Hasta */}
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            value={fechaHastaLocal}
                                            onChange={(e) => setFechaHastaLocal(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    onFilterChange('fecha_desde', fechaDesdeLocal);
                                                    onFilterChange('fecha_hasta', fechaHastaLocal);
                                                    onApply?.({ ...filtros, fecha_desde: fechaDesdeLocal, fecha_hasta: fechaHastaLocal });
                                                }
                                            }}
                                            className={`${floatingInputClassName} [&::-webkit-calendar-picker-indicator]:opacity-0`}
                                            disabled={isLoading}
                                        />
                                        <label className={floatingLabelClassName}>Hasta</label>
                                    </div>

                                    {/* Botón Buscar para aplicar filtros de fecha */}
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => {
                                            onFilterChange('fecha_desde', fechaDesdeLocal);
                                            onFilterChange('fecha_hasta', fechaHastaLocal);
                                            onApply?.({ ...filtros, fecha_desde: fechaDesdeLocal, fecha_hasta: fechaHastaLocal });
                                        }}
                                        disabled={isLoading}
                                        className="whitespace-nowrap"
                                    >
                                        🔍 Buscar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tags de filtros activos con opción de remover */}
            {filtrosActivos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filtrosActivos.map((filtro) => (
                        <Badge
                            key={filtro.label}
                            variant="secondary"
                            className="cursor-pointer transition-colors hover:bg-secondary/80"
                            onClick={() => {
                                // Determinar la clave del filtro basado en el label
                                const keyMap: Record<string, keyof FiltrosEntregas> = {
                                    Estado: 'estado',
                                    'Búsqueda Entrega': 'busqueda_entrega',
                                    'Búsqueda Ventas': 'busqueda_ventas',
                                    Chofer: 'chofer_id',
                                    Vehículo: 'vehiculo_id',
                                    Localidad: 'localidad_id',
                                    'Estado Logístico': 'estado_logistica_id',
                                    Desde: 'fecha_desde',
                                    Hasta: 'fecha_hasta',
                                    'Tipo Fecha': 'tipo_fecha', // ✅ NUEVO
                                    Turno: 'turno', // ✅ NUEVO
                                };
                                handleRemoveFiltro(keyMap[filtro.label]);
                            }}
                        >
                            {filtro.label}: <span className="ml-1 font-semibold">{filtro.value}</span>
                            <X className="ml-2 h-3 w-3" />
                        </Badge>
                    ))}

                    {/* Botón Limpiar (se muestra cuando hay filtros activos) */}
                    {filtrosActivos.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive/90"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Limpiar filtros ({filtrosActivos.length})
                        </Button>
                    )}
                </div>
            )}

            {/* Separador visual */}
            {filtrosActivos.length > 0 && <div className="h-px bg-border" />}
        </div>
    );
}
