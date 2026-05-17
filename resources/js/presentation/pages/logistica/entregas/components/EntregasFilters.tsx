import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import SearchSelect from '@/presentation/components/ui/search-select';
import { Badge } from '@/presentation/components/ui/badge';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useDebouncedValue } from '@/application/hooks/use-debounce';

/**
 * Estado de filtros avanzados
 */
export interface FiltrosEntregas {
    estado: string;
    busqueda_entrega?: string;
    busqueda_ventas?: string;
    chofer_id?: string;
    vehiculo_id?: string;
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
    localidades,
    estadosLogisticos,
    isLoading = false,
}: Props) {
    // ✅ Estado para controlar visibilidad de filtros
    const [filtrosVisibles, setFiltrosVisibles] = useState(false);


    // Calcular cuántos filtros están activos
    const filtrosActivos = useMemo(() => {
        return [
            filtros.estado !== 'TODOS' && { label: 'Estado', value: filtros.estado },
            filtros.busqueda_entrega && { label: 'Búsqueda Entrega', value: filtros.busqueda_entrega },
            filtros.busqueda_ventas && { label: 'Búsqueda Ventas', value: filtros.busqueda_ventas },
            filtros.chofer_id && {
                label: 'Chofer',
                value: choferes.find(c => c.id.toString() === filtros.chofer_id)?.nombre || filtros.chofer_id
            },
            filtros.vehiculo_id && {
                label: 'Vehículo',
                value: vehiculos.find(v => v.id.toString() === filtros.vehiculo_id)?.placa || filtros.vehiculo_id
            },
            filtros.localidad_id && {
                label: 'Localidad',
                value: localidades.find(l => l.id.toString() === filtros.localidad_id)?.nombre || filtros.localidad_id
            },
            filtros.estado_logistica_id && {
                label: 'Estado Logístico',
                value: estadosLogisticos.find(e => e.id.toString() === filtros.estado_logistica_id)?.nombre || filtros.estado_logistica_id
            },
            filtros.fecha_desde && { label: 'Desde', value: filtros.fecha_desde },
            filtros.fecha_hasta && { label: 'Hasta', value: filtros.fecha_hasta },
            filtros.tipo_fecha && filtros.tipo_fecha !== 'fecha_programada' && { label: 'Tipo Fecha', value: filtros.tipo_fecha === 'created_at' ? 'Creación' : 'Programada' }, // ✅ NUEVO
            filtros.turno && { label: 'Turno', value: filtros.turno === 'manana' ? 'Mañana' : 'Tarde' }, // ✅ NUEVO
        ].filter(Boolean);
    }, [filtros, choferes, vehiculos, localidades, estadosLogisticos]);

    const handleRemoveFiltro = (key: keyof FiltrosEntregas) => {
        onFilterChange(key, key === 'estado' ? 'TODOS' : '');
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // ✅ Pasar los filtros actualizados directamente a onApply para evitar timing issues
            const filtrosActualizados = { ...filtros, busqueda: busquedaLocal };
            onApply?.(filtrosActualizados);
        }
    };

    return (
        <div className="space-y-4">
            {/* Búsqueda Separada: Entrega vs Ventas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Búsqueda en ENTREGA (ID, placa, chofer) */}
                <div className="flex gap-2 items-end">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Entrega: ID, placa, chofer..."
                            value={filtros.busqueda_entrega || ''}
                            onChange={(e) => onFilterChange('busqueda_entrega', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const filtrosActualizados = { ...filtros, busqueda_entrega: e.currentTarget.value };
                                    onApply?.(filtrosActualizados);
                                }
                            }}
                            className="pl-10 bg-background"
                            disabled={isLoading}
                        />
                    </div>
                    <Button
                        size="sm"
                        onClick={() => {
                            const filtrosActualizados = { ...filtros, busqueda_entrega: filtros.busqueda_entrega || '' };
                            onApply?.(filtrosActualizados);
                        }}
                        disabled={isLoading}
                        className="whitespace-nowrap"
                    >
                        Buscar
                    </Button>
                    {filtros.busqueda_entrega && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                const filtrosLimpios = { ...filtros, busqueda_entrega: '' };
                                onApply?.(filtrosLimpios);
                            }}
                            disabled={isLoading}
                            className="whitespace-nowrap"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Búsqueda en VENTAS (ID venta, cliente, número venta) */}
                <div className="flex gap-2 items-end">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Ventas: ID, cliente, número..."
                            value={filtros.busqueda_ventas || ''}
                            onChange={(e) => onFilterChange('busqueda_ventas', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const filtrosActualizados = { ...filtros, busqueda_ventas: e.currentTarget.value };
                                    onApply?.(filtrosActualizados);
                                }
                            }}
                            className="pl-10 bg-background"
                            disabled={isLoading}
                        />
                    </div>
                    <Button
                        size="sm"
                        onClick={() => {
                            const filtrosActualizados = { ...filtros, busqueda_ventas: filtros.busqueda_ventas || '' };
                            onApply?.(filtrosActualizados);
                        }}
                        disabled={isLoading}
                        className="whitespace-nowrap"
                    >
                        Buscar
                    </Button>
                    {filtros.busqueda_ventas && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                const filtrosLimpios = { ...filtros, busqueda_ventas: '' };
                                onApply?.(filtrosLimpios);
                            }}
                            disabled={isLoading}
                            className="whitespace-nowrap"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
            {/* Header de filtros con contador - CLICKEABLE */}
            <button
                onClick={() => setFiltrosVisibles(!filtrosVisibles)}
                className="w-full flex items-center justify-between p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filtros</span>
                    {filtrosActivos.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {filtrosActivos.length} activo{filtrosActivos.length !== 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>
                <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${filtrosVisibles ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Botón Limpiar (se muestra cuando hay filtros activos) */}
            {filtrosActivos.length > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
                    className="w-full text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar todos los filtros ({filtrosActivos.length})
                </Button>
            )}

            {/* Grid de filtros - COLAPSABLE */}
            {filtrosVisibles && (
                <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Grid de filtros principales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-muted/50 rounded-lg border">
                        {/* Filtro por Estado */}
                        <SearchSelect
                            placeholder="Buscar estado..."
                            searchPlaceholder="Buscar estado..."
                            value={filtros.estado || 'TODOS'}
                            options={[
                                { value: 'TODOS', label: 'Todos' },
                                ...estadosAPI.map(estado => ({
                                    value: estado.codigo,
                                    label: estado.nombre
                                }))
                            ]}
                            onChange={(value) => onFilterChange('estado', value.toString())}
                            disabled={isLoading}
                            allowClear={false}
                        />

                        {/* Filtro por Chofer */}
                        <SearchSelect
                            placeholder="Buscar chofer..."
                            searchPlaceholder="Buscar chofer..."
                            value={filtros.chofer_id || ''}
                            options={[
                                { value: '', label: 'Todos los choferes' },
                                ...choferes.map(chofer => ({
                                    value: chofer.id.toString(),
                                    label: chofer.nombre
                                }))
                            ]}
                            onChange={(value) => onFilterChange('chofer_id', value.toString())}
                            disabled={isLoading}
                            allowClear
                        />

                        {/* Filtro por Vehículo */}
                        <SearchSelect
                            placeholder="Buscar vehículo..."
                            searchPlaceholder="Buscar vehículo..."
                            value={filtros.vehiculo_id || ''}
                            options={[
                                { value: '', label: 'Todos los vehículos' },
                                ...vehiculos.map(vehiculo => ({
                                    value: vehiculo.id.toString(),
                                    label: `${vehiculo.placa}`,
                                    description: `${vehiculo.marca} ${vehiculo.modelo}`
                                }))
                            ]}
                            onChange={(value) => onFilterChange('vehiculo_id', value.toString())}
                            disabled={isLoading}
                            allowClear
                        />

                        {/* Filtro por Localidad */}
                        <SearchSelect
                            placeholder="Buscar localidad..."
                            searchPlaceholder="Buscar localidad..."
                            value={filtros.localidad_id || ''}
                            options={[
                                { value: '', label: 'Todas las localidades' },
                                ...localidades.map(localidad => ({
                                    value: localidad.id.toString(),
                                    label: localidad.nombre,
                                    description: localidad.codigo
                                }))
                            ]}
                            onChange={(value) => onFilterChange('localidad_id', value.toString())}
                            disabled={isLoading}
                            allowClear
                        />

                        {/* Filtro por Estado Logístico */}
                        <SearchSelect
                            placeholder="Buscar estado..."
                            searchPlaceholder="Buscar estado..."
                            value={filtros.estado_logistica_id || ''}
                            options={[
                                { value: '', label: 'Todos los estados' },
                                ...estadosLogisticos.map(estado => ({
                                    value: estado.id.toString(),
                                    label: `${estado.icono ? `${estado.icono} ` : ''}${estado.nombre}`,
                                    description: estado.codigo
                                }))
                            ]}
                            onChange={(value) => onFilterChange('estado_logistica_id', value.toString())}
                            disabled={isLoading}
                            allowClear
                        />
                    </div>

                    {/* ✅ NUEVO: Selector de tipo de fecha */}
                    <div className="p-4 bg-muted/50 rounded-lg border animate-in fade-in duration-200">
                        <label className="text-sm font-medium mb-3 block">Tipo de Fecha</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="tipo_fecha"
                                    value="fecha_programada"
                                    checked={filtros.tipo_fecha !== 'created_at'}
                                    onChange={() => onFilterChange('tipo_fecha', 'fecha_programada')}
                                    disabled={isLoading}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">📅 Fecha Programada</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="tipo_fecha"
                                    value="created_at"
                                    checked={filtros.tipo_fecha === 'created_at'}
                                    onChange={() => onFilterChange('tipo_fecha', 'created_at')}
                                    disabled={isLoading}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">📝 Creación</span>
                            </label>
                        </div>
                    </div>

                    {/* ✅ NUEVO: Botones rápidos de fecha (Ayer, Hoy, Mañana) */}
                    <div className="p-4 bg-muted/50 rounded-lg border animate-in fade-in duration-200">
                        <label className="text-sm font-medium mb-3 block">Fechas Rápidas</label>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant={filtros.fecha_desde === new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0] ? 'default' : 'outline'}
                                onClick={() => {
                                    const ayer = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
                                    onFilterChange('fecha_desde', ayer);
                                    onFilterChange('fecha_hasta', ayer);
                                    onApply?.({ ...filtros, fecha_desde: ayer, fecha_hasta: ayer });
                                }}
                                disabled={isLoading}
                            >
                                ← Ayer
                            </Button>
                            <Button
                                size="sm"
                                variant={filtros.fecha_desde === new Date().toISOString().split('T')[0] ? 'default' : 'outline'}
                                onClick={() => {
                                    const hoy = new Date().toISOString().split('T')[0];
                                    onFilterChange('fecha_desde', hoy);
                                    onFilterChange('fecha_hasta', hoy);
                                    onApply?.({ ...filtros, fecha_desde: hoy, fecha_hasta: hoy });
                                }}
                                disabled={isLoading}
                            >
                                Hoy
                            </Button>
                            <Button
                                size="sm"
                                variant={filtros.fecha_desde === new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] ? 'default' : 'outline'}
                                onClick={() => {
                                    const manana = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
                                    onFilterChange('fecha_desde', manana);
                                    onFilterChange('fecha_hasta', manana);
                                    onApply?.({ ...filtros, fecha_desde: manana, fecha_hasta: manana });
                                }}
                                disabled={isLoading}
                            >
                                Mañana →
                            </Button>
                        </div>
                    </div>

                    {/* Filtros de fechas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg border animate-in fade-in duration-200">
                        {/* Filtro por Fecha Desde */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Desde</label>
                            <Input
                                type="date"
                                value={filtros.fecha_desde || ''}
                                onChange={(e) => onFilterChange('fecha_desde', e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onApply?.();
                                    }
                                }}
                                className="bg-background"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Filtro por Fecha Hasta */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Hasta</label>
                            <Input
                                type="date"
                                value={filtros.fecha_hasta || ''}
                                onChange={(e) => onFilterChange('fecha_hasta', e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onApply?.();
                                    }
                                }}
                                className="bg-background"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* ✅ NUEVO: Selector de turno (Mañana / Tarde) */}
                    <div className="p-4 bg-muted/50 rounded-lg border animate-in fade-in duration-200">
                        <label className="text-sm font-medium mb-3 block">Turno</label>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant={filtros.turno === 'manana' ? 'default' : 'outline'}
                                onClick={() => {
                                    const nuevoTurno = filtros.turno === 'manana' ? '' : 'manana';
                                    onFilterChange('turno', nuevoTurno);
                                    onApply?.({ ...filtros, turno: nuevoTurno });
                                }}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                ☀ Mañana (08:00-12:00)
                            </Button>
                            <Button
                                size="sm"
                                variant={filtros.turno === 'tarde' ? 'default' : 'outline'}
                                onClick={() => {
                                    const nuevoTurno = filtros.turno === 'tarde' ? '' : 'tarde';
                                    onFilterChange('turno', nuevoTurno);
                                    onApply?.({ ...filtros, turno: nuevoTurno });
                                }}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                🌇 Tarde (14:00-18:00)
                            </Button>
                        </div>
                    </div>

                    {/* Botón Aplicar Filtros */}
                    {onApply && (
                        <Button
                            onClick={onApply}
                            disabled={isLoading}
                            className="w-full"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Aplicar Filtros
                        </Button>
                    )}
                </div>
            )}

            {/* Tags de filtros activos con opción de remover */}
            {filtrosActivos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filtrosActivos.map((filtro) => (
                        <Badge
                            key={filtro.label}
                            variant="secondary"
                            className="cursor-pointer hover:bg-secondary/80 transition-colors"
                            onClick={() => {
                                // Determinar la clave del filtro basado en el label
                                const keyMap: Record<string, keyof FiltrosEntregas> = {
                                    'Estado': 'estado',
                                    'Búsqueda Entrega': 'busqueda_entrega',
                                    'Búsqueda Ventas': 'busqueda_ventas',
                                    'Chofer': 'chofer_id',
                                    'Vehículo': 'vehiculo_id',
                                    'Localidad': 'localidad_id',
                                    'Estado Logístico': 'estado_logistica_id',
                                    'Desde': 'fecha_desde',
                                    'Hasta': 'fecha_hasta',
                                    'Tipo Fecha': 'tipo_fecha', // ✅ NUEVO
                                    'Turno': 'turno', // ✅ NUEVO
                                };
                                handleRemoveFiltro(keyMap[filtro.label]);
                            }}
                        >
                            {filtro.label}: <span className="font-semibold ml-1">{filtro.value}</span>
                            <X className="h-3 w-3 ml-2" />
                        </Badge>
                    ))}
                </div>
            )}

            {/* Separador visual */}
            {filtrosActivos.length > 0 && (
                <div className="h-px bg-border" />
            )}
        </div>
    );
}
