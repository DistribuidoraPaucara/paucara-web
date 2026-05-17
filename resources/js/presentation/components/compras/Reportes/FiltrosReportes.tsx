/**
 * Componente: FiltrosReportes
 *
 * Responsabilidades:
 * - Renderizar formulario de filtros
 * - Actualizar filtros locales
 * - Desencadenar generación de reporte
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { BarChart3, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import type { Proveedor } from '@/domain/entities/proveedores';
import type { FiltrosReportesCompras } from '@/domain/entities/compras-reportes';
import type { Id } from '@/domain/entities/shared';

interface FiltrosReportesProps {
    filtros: FiltrosReportesCompras;
    onFiltroChange: (key: keyof FiltrosReportesCompras, value: string) => void;
    onAplicarFiltros: () => void;
    onLimpiarFiltros: () => void;
    cargando: boolean;
    error?: string | null;
    proveedores: Proveedor[];
    monedas: Array<{
        id: Id;
        nombre: string;
        codigo: string;
    }>;
}

/**
 * Componente que renderiza los filtros del reporte
 *
 * Permite:
 * - Seleccionar rango de fechas
 * - Filtrar por proveedor
 * - Filtrar por moneda
 * - Aplicar o limpiar filtros
 */
export const FiltrosReportes: React.FC<FiltrosReportesProps> = ({
    filtros,
    onFiltroChange,
    onAplicarFiltros,
    onLimpiarFiltros,
    cargando,
    error,
    proveedores,
    monedas,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-lg">
                    <Filter className="w-5 h-5 mr-2" />
                    Filtros de Reporte
                </CardTitle>
                <CardDescription>
                    Personaliza el período y criterios para generar el reporte
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                )}

                {/* Filtros Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Fecha Inicio */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Fecha Inicio
                        </label>
                        <Input
                            type="date"
                            value={filtros.fecha_inicio || ''}
                            onChange={(e) => onFiltroChange('fecha_inicio', e.target.value)}
                            disabled={cargando}
                        />
                    </div>

                    {/* Fecha Fin */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Fecha Fin
                        </label>
                        <Input
                            type="date"
                            value={filtros.fecha_fin || ''}
                            onChange={(e) => onFiltroChange('fecha_fin', e.target.value)}
                            disabled={cargando}
                        />
                    </div>

                    {/* Proveedor */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Proveedor
                        </label>
                        <Select
                            value={filtros.proveedor_id || 'all'}
                            onValueChange={(value) => onFiltroChange('proveedor_id', value)}
                            disabled={cargando}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Todos los proveedores" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los proveedores</SelectItem>
                                {(proveedores || [])
                                    .filter((proveedor) => proveedor.id && Number(proveedor.id) > 0)
                                    .map((proveedor) => {
                                        const valueId = String(proveedor.id).trim();
                                        return valueId !== '' ? (
                                            <SelectItem key={proveedor.id} value={valueId}>
                                                {proveedor.nombre}
                                            </SelectItem>
                                        ) : null;
                                    })
                                    .filter(Boolean)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Moneda */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Moneda
                        </label>
                        <Select
                            value={filtros.moneda_id || 'all'}
                            onValueChange={(value) => onFiltroChange('moneda_id', value)}
                            disabled={cargando}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Todas las monedas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las monedas</SelectItem>
                                {(monedas || [])
                                    .filter((moneda) => moneda.id && Number(moneda.id) > 0)
                                    .map((moneda) => {
                                        const valueId = String(moneda.id).trim();
                                        return valueId !== '' ? (
                                            <SelectItem key={moneda.id} value={valueId}>
                                                {moneda.nombre} ({moneda.codigo})
                                            </SelectItem>
                                        ) : null;
                                    })
                                    .filter(Boolean)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onLimpiarFiltros}
                        disabled={cargando}
                    >
                        Limpiar Filtros
                    </Button>
                    <Button
                        onClick={onAplicarFiltros}
                        disabled={cargando}
                    >
                        {cargando ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Generando...
                            </>
                        ) : (
                            <>
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Generar Reporte
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
