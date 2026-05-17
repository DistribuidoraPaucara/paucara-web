import { useState } from 'react';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { X } from 'lucide-react';

interface ReservasFiltersProps {
    filtros: {
        tipo: string | null;
        estado: string | null;
        busqueda: string | null;
        page: number;
        per_page: number;
    };
}

export default function ReservasFilters({ filtros }: ReservasFiltersProps) {
    const [busqueda, setBusqueda] = useState(filtros.busqueda || '');
    const [tipoFiltro, setTipoFiltro] = useState(filtros.tipo || '');
    const [estadoFiltro, setEstadoFiltro] = useState(filtros.estado || '');

    const construirUrl = (nuevosFiltros: Partial<typeof filtros>) => {
        const params = new URLSearchParams();

        if (nuevosFiltros.tipo) params.append('tipo', nuevosFiltros.tipo);
        if (nuevosFiltros.estado) params.append('estado', nuevosFiltros.estado);
        if (nuevosFiltros.busqueda) params.append('busqueda', nuevosFiltros.busqueda);
        if (nuevosFiltros.page) params.append('page', nuevosFiltros.page.toString());
        if (nuevosFiltros.per_page) params.append('per_page', nuevosFiltros.per_page.toString());

        return `?${params.toString()}`;
    };

    const limpiarFiltros = () => {
        setBusqueda('');
        setTipoFiltro('');
        setEstadoFiltro('');
        window.location.href = '/inventario/reservas';
    };

    const aplicarFiltros = () => {
        window.location.href = construirUrl({
            tipo: tipoFiltro || null,
            estado: estadoFiltro || null,
            busqueda: busqueda || null,
            page: 1,
            per_page: filtros.per_page,
        });
    };

    const tieneActivosFiltros = tipoFiltro || estadoFiltro || busqueda;

    return (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Búsqueda por SKU/Producto */}
                <div>
                    <label className="text-sm font-medium mb-2 block">Buscar por SKU o Producto</label>
                    <Input
                        type="text"
                        placeholder="Ej: PRO001, Acetona..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="h-9"
                    />
                </div>

                {/* Filtro por Tipo */}
                <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de Reserva</label>
                    <select
                        value={tipoFiltro}
                        onChange={(e) => setTipoFiltro(e.target.value)}
                        className="h-9 w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    >
                        <option value="">Todas</option>
                        <option value="inconsistentes">Inconsistentes</option>
                        <option value="proximas_expirar">Próximas a Expirar</option>
                        <option value="normales">Normales</option>
                    </select>
                </div>

                {/* Filtro por Estado */}
                <div>
                    <label className="text-sm font-medium mb-2 block">Estado</label>
                    <select
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                        className="h-9 w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    >
                        <option value="">Todas</option>
                        <option value="ACTIVA">Activa</option>
                        <option value="EXPIRADA">Expirada</option>
                        <option value="LIBERADA">Liberada</option>
                        <option value="CONSUMIDA">Consumida</option>
                    </select>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2">
                <Button onClick={aplicarFiltros} size="sm">
                    Aplicar Filtros
                </Button>
                {tieneActivosFiltros && (
                    <Button
                        onClick={limpiarFiltros}
                        size="sm"
                        variant="outline"
                        className="text-muted-foreground"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Limpiar
                    </Button>
                )}
            </div>
        </div>
    );
}
