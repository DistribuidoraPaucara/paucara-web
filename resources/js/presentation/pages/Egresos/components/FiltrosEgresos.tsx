import { useState } from 'react';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { Label } from '@/presentation/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';

interface FiltrosEgresosProps {
    filtros: any;
    onFiltrosChange: (filtros: any) => void;
    cargando: boolean;
}

const CATEGORIAS_COMUNES = [
    'TRANSPORTE',
    'LIMPIEZA',
    'MANTENIMIENTO',
    'SERVICIOS',
    'ALIMENTACION_DESAYUNO',
    'ALIMENTACION_ALMUERZO',
    'ALIMENTACION_CENA',
    'ALIMENTACION_REFRIGERIO',
    'ALIMENTACION_OTROS',
    'SUELDO',
    'BONO',
    'COMISIÓN',
];

export default function FiltrosEgresos({
    filtros,
    onFiltrosChange,
    cargando
}: FiltrosEgresosProps) {
    const [filtrosTemp, setFiltrosTemp] = useState(filtros);

    const handleChange = (campo: string, valor: any) => {
        setFiltrosTemp({
            ...filtrosTemp,
            [campo]: valor,
        });
    };

    const handleAplicar = () => {
        onFiltrosChange(filtrosTemp);
    };

    const handleLimpiar = () => {
        const filtrosLimpios = {
            estado_caja: 'todas',
            per_page: 15,
            categoria: undefined,
        };
        setFiltrosTemp(filtrosLimpios);
        onFiltrosChange(filtrosLimpios);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Fecha Desde */}
                <div className="space-y-2">
                    <Label htmlFor="fecha_desde" className="text-gray-900 dark:text-gray-100">
                        📅 Desde
                    </Label>
                    <Input
                        id="fecha_desde"
                        type="date"
                        value={filtrosTemp.fecha_desde || ''}
                        onChange={(e) => handleChange('fecha_desde', e.target.value)}
                        className="dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>

                {/* Fecha Hasta */}
                <div className="space-y-2">
                    <Label htmlFor="fecha_hasta" className="text-gray-900 dark:text-gray-100">
                        📅 Hasta
                    </Label>
                    <Input
                        id="fecha_hasta"
                        type="date"
                        value={filtrosTemp.fecha_hasta || ''}
                        onChange={(e) => handleChange('fecha_hasta', e.target.value)}
                        className="dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>

                {/* Categoría */}
                <div className="space-y-2">
                    <Label htmlFor="categoria" className="text-gray-900 dark:text-gray-100">
                        🏷️ Categoría
                    </Label>
                    <Select
                        value={filtrosTemp.categoria || 'todas'}
                        onValueChange={(value) => handleChange('categoria', value === 'todas' ? undefined : value)}
                    >
                        <SelectTrigger className="dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue placeholder="Todas las categorías" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Todas las categorías</SelectItem>
                            {CATEGORIAS_COMUNES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat.replace(/_/g, ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Estado de Caja */}
                <div className="space-y-2">
                    <Label htmlFor="estado_caja" className="text-gray-900 dark:text-gray-100">
                        🔒 Estado de Caja
                    </Label>
                    <Select
                        value={filtrosTemp.estado_caja || 'todas'}
                        onValueChange={(value) => handleChange('estado_caja', value)}
                    >
                        <SelectTrigger className="dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Todas</SelectItem>
                            <SelectItem value="abierta">Abierta</SelectItem>
                            <SelectItem value="cerrada">Cerrada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Rango de Montos */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="monto_min" className="text-gray-900 dark:text-gray-100">
                        💰 Monto Mínimo (Bs)
                    </Label>
                    <Input
                        id="monto_min"
                        type="number"
                        min="0"
                        step="0.01"
                        value={filtrosTemp.monto_min || ''}
                        onChange={(e) => handleChange('monto_min', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="0.00"
                        className="dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="monto_max" className="text-gray-900 dark:text-gray-100">
                        💰 Monto Máximo (Bs)
                    </Label>
                    <Input
                        id="monto_max"
                        type="number"
                        min="0"
                        step="0.01"
                        value={filtrosTemp.monto_max || ''}
                        onChange={(e) => handleChange('monto_max', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="0.00"
                        className="dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
            </div> */}

            {/* Botones */}
            <div className="flex gap-2 justify-end">
                <Button
                    variant="outline"
                    onClick={handleLimpiar}
                    disabled={cargando}
                >
                    🗑️ Limpiar
                </Button>
                <Button
                    onClick={handleAplicar}
                    disabled={cargando}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {cargando ? '⏳ Aplicando...' : '🔍 Aplicar Filtros'}
                </Button>
            </div>
        </div>
    );
}
