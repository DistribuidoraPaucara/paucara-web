import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import SearchSelect from '@/presentation/components/ui/search-select';
import { Badge } from '@/presentation/components/ui/badge';
import { Calendar, Filter, X, Search } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/presentation/components/ui/collapsible';
import type { FiltrosMovimientos as IFiltrosMovimientos } from '@/domain/entities/movimientos-inventario';

interface TipoAjuste {
    id: number;
    clave: string;
    label: string;
}

interface FiltrosMovimientosProps {
    filtros: IFiltrosMovimientos;
    onFiltrosChange: (filtros: IFiltrosMovimientos) => void;
    almacenes: Array<{ id: number; nombre: string; }>;
    productos: Array<{ id: number; nombre: string; codigo?: string; }>;
    tiposAjuste?: TipoAjuste[];
    showAdvanced?: boolean;
}

const tiposMovimiento = [
    // ✅ Tipos principales
    { value: 'ENTRADA', label: 'Entradas' },
    { value: 'SALIDA', label: 'Salidas' },
    { value: 'AJUSTE', label: 'Ajustes' },
    { value: 'TRANSFERENCIA', label: 'Transferencias' },
    { value: 'MERMA', label: 'Mermas' },
    { value: 'PRODUCCION', label: 'Producción' },
    { value: 'DEVOLUCION', label: 'Devoluciones' },
    // ✅ NUEVO (2026-02-12): Tipos de reservas de proforma
    { value: 'RESERVA_PROFORMA', label: 'Reserva de Proforma' },
    { value: 'LIBERACION_RESERVA', label: 'Liberación de Reserva' },
    { value: 'CONSUMO_RESERVA', label: 'Consumo de Reserva' },
];

export default function FiltrosMovimientos({
    filtros,
    onFiltrosChange,
    almacenes,
    productos,
    tiposAjuste = [],
    showAdvanced = false
}: FiltrosMovimientosProps) {
    // ✅ Estado local para los filtros - NO se aplican hasta hacer clic en buscar
    const [filtrosLocal, setFiltrosLocal] = useState<IFiltrosMovimientos>(filtros);
    const [isOpen, setIsOpen] = useState(true);

    // Convertir opciones a formato SearchSelect
    const tiposMovimientoOptions = tiposMovimiento.map(tipo => ({
        value: tipo.value,
        label: tipo.label,
    }));

    const almacenesOptions = almacenes.map(a => ({
        value: a.id.toString(),
        label: a.nombre,
    }));

    const productosOptions = productos.map(p => ({
        value: p.id.toString(),
        label: p.codigo ? `${p.codigo} - ${p.nombre}` : p.nombre,
    }));

    const tiposAjusteOptions = tiposAjuste.map(ta => ({
        value: ta.id.toString(),
        label: ta.label,
        description: ta.clave,
    }));

    // ✅ Actualizar estado local (sin navegar)
    const updateFiltroLocal = (key: keyof IFiltrosMovimientos, value: string | number | boolean | undefined) => {
        setFiltrosLocal({
            ...filtrosLocal,
            [key]: value
        });
    };

    // ✅ Aplicar filtros - SOLO cuando se hace clic en buscar
    const aplicarFiltros = () => {
        onFiltrosChange(filtrosLocal);
    };

    // ✅ Manejar Enter en inputs
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            aplicarFiltros();
        }
    };

    const clearFiltro = (key: keyof IFiltrosMovimientos) => {
        const newFiltros = { ...filtrosLocal };
        delete newFiltros[key];
        setFiltrosLocal(newFiltros);
    };

    const clearAllFiltros = () => {
        setFiltrosLocal({});
    };

    const hasActiveFilters = Object.keys(filtrosLocal).length > 0;

    // ✅ NUEVO (2026-03-27): Detectar si está activo el filtro de proformas
    const isProformasFilterActive = (filtrosLocal as any).referencia_tipo === 'proforma';

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros
                        {hasActiveFilters && (
                            <Badge variant="secondary" className="ml-2">
                                {Object.keys(filtrosLocal).length}
                            </Badge>
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="default"
                            size="sm"
                            onClick={aplicarFiltros}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Search className="h-4 w-4 mr-1" />
                            Buscar
                        </Button>
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFiltros}
                                className="text-muted-foreground"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Limpiar
                            </Button>
                        )}
                        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                            <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm">
                                    {isOpen ? 'Ocultar' : 'Mostrar'} filtros
                                </Button>
                            </CollapsibleTrigger>
                        </Collapsible>
                    </div>
                </div>
            </CardHeader>

            {/* ✅ NUEVO: Botones de filtro rápido */}
            <CardContent className="pb-0 pt-2 space-y-3">
                {/* Filtro de tipo */}
                <div className="flex flex-wrap gap-2">
                    <Label className="text-xs text-muted-foreground w-full">Por tipo:</Label>
                    <Button
                        variant={filtrosLocal.tipo === 'SALIDA_VENTA' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            // ✅ TOGGLE: Si ya está seleccionado, deselecciona; si no, selecciona
                            const newFiltros = filtrosLocal.tipo === 'SALIDA_VENTA'
                                ? { ...filtrosLocal, tipo: undefined }
                                : { ...filtrosLocal, tipo: 'SALIDA_VENTA' };
                            setFiltrosLocal(newFiltros);
                        }}
                        className="flex-shrink-0"
                    >
                        💰 Ventas
                    </Button>
                    <Button
                        variant={filtrosLocal.tipo === 'ENTRADA_COMPRA' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            const newFiltros = filtrosLocal.tipo === 'ENTRADA_COMPRA'
                                ? { ...filtrosLocal, tipo: undefined }
                                : { ...filtrosLocal, tipo: 'ENTRADA_COMPRA' };
                            setFiltrosLocal(newFiltros);
                        }}
                        className="flex-shrink-0"
                    >
                        📦 Compras
                    </Button>
                    <Button
                        variant={filtrosLocal.tipo === 'AJUSTE' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            const newFiltros = filtrosLocal.tipo === 'AJUSTE'
                                ? { ...filtrosLocal, tipo: undefined }
                                : { ...filtrosLocal, tipo: 'AJUSTE' };
                            setFiltrosLocal(newFiltros);
                        }}
                        className="flex-shrink-0"
                    >
                        🔧 Ajustes
                    </Button>
                    {/* ✅ NUEVO (2026-03-27): Filtro rápido para Proformas - Usa referencia_tipo */}
                    <Button
                        variant={isProformasFilterActive ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            if (isProformasFilterActive) {
                                // Si ya está seleccionado, deselecciona
                                const newFiltros = { ...filtrosLocal } as any;
                                delete newFiltros.referencia_tipo;
                                setFiltrosLocal(newFiltros);
                            } else {
                                // Selecciona todas las proformas (RESERVA_PROFORMA, LIBERACION_RESERVA, CONSUMO_RESERVA)
                                setFiltrosLocal({ ...filtrosLocal, referencia_tipo: 'proforma' } as any);
                            }
                        }}
                        className="flex-shrink-0"
                        title="Filtra por movimientos de proformas (Reservas, Liberaciones, Consumos)"
                    >
                        📋 Proformas
                    </Button>
                    {filtrosLocal.tipo && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const newFiltros = { ...filtrosLocal };
                                delete newFiltros.tipo;
                                setFiltrosLocal(newFiltros);
                            }}
                            className="flex-shrink-0 ml-auto"
                        >
                            <X className="h-3 w-3 mr-1" />
                            Limpiar
                        </Button>
                    )}
                </div>

                {/* Filtro de estado */}
                <div className="flex flex-wrap gap-2">
                    <Label className="text-xs text-muted-foreground w-full">Por estado:</Label>
                    <Button
                        variant={filtrosLocal.anulado === false ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            // ✅ TOGGLE: Si ya está seleccionado, deselecciona (sin estado = TODOS)
                            const newFiltros = filtrosLocal.anulado === false
                                ? { ...filtrosLocal, anulado: undefined }
                                : { ...filtrosLocal, anulado: false };
                            setFiltrosLocal(newFiltros);
                        }}
                        className="flex-shrink-0"
                    >
                        ✅ Aprobados
                    </Button>
                    <Button
                        variant={filtrosLocal.anulado === true ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            const newFiltros = filtrosLocal.anulado === true
                                ? { ...filtrosLocal, anulado: undefined }
                                : { ...filtrosLocal, anulado: true };
                            setFiltrosLocal(newFiltros);
                        }}
                        className="flex-shrink-0"
                    >
                        ❌ Anulados
                    </Button>
                    <Button
                        variant={filtrosLocal.tipo === 'ENTRADA_AJUSTE' && filtrosLocal.es_reversión === true ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            // ✅ TOGGLE: Reversiones es un tipo especial
                            const isReversionsSelected = filtrosLocal.tipo === 'ENTRADA_AJUSTE' && filtrosLocal.es_reversión === true;
                            if (isReversionsSelected) {
                                const newFiltros = { ...filtrosLocal };
                                delete newFiltros.tipo;
                                delete newFiltros.es_reversión;
                                setFiltrosLocal(newFiltros);
                            } else {
                                setFiltrosLocal({ ...filtrosLocal, tipo: 'ENTRADA_AJUSTE', es_reversión: true });
                            }
                        }}
                        className="flex-shrink-0"
                    >
                        🔄 Reversiones
                    </Button>
                    {(filtrosLocal.anulado !== undefined || (filtrosLocal.tipo === 'ENTRADA_AJUSTE' && filtrosLocal.es_reversión === true)) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const newFiltros = { ...filtrosLocal };
                                delete newFiltros.anulado;
                                delete newFiltros.tipo;
                                delete newFiltros.es_reversión;
                                setFiltrosLocal(newFiltros);
                            }}
                            className="flex-shrink-0 ml-auto"
                        >
                            <X className="h-3 w-3 mr-1" />
                            Limpiar
                        </Button>
                    )}
                </div>
            </CardContent>

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleContent>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Búsqueda de producto - columna más ancha */}
                            <div className="col-span-1 md:col-span-1 lg:col-span-1 space-y-2">
                                <Label htmlFor="producto_busqueda">🔍 Producto</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="producto_busqueda"
                                        placeholder="ID, SKU, nombre, código..."
                                        value={filtrosLocal.producto_busqueda || ''}
                                        onChange={(e) => updateFiltroLocal('producto_busqueda', e.target.value || undefined)}
                                        onKeyPress={handleKeyPress}
                                        className="pl-9"
                                    />
                                    {filtrosLocal.producto_busqueda && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                            onClick={() => updateFiltroLocal('producto_busqueda', undefined)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Número de documento */}
                            <div className="space-y-2">
                                <Label htmlFor="numero_documento">Número de documento</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="numero_documento"
                                        placeholder="Ej: FAC-001, TRANSF-100..."
                                        value={filtrosLocal.numero_documento || ''}
                                        onChange={(e) => updateFiltroLocal('numero_documento', e.target.value || undefined)}
                                        onKeyPress={handleKeyPress}
                                        className="pl-9"
                                    />
                                    {filtrosLocal.numero_documento && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                            onClick={() => updateFiltroLocal('numero_documento', undefined)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Tipo de movimiento */}
                            <div className="space-y-2">
                                <Label>Tipo de movimiento</Label>
                                <SearchSelect
                                    placeholder="Seleccionar tipo..."
                                    value={filtrosLocal.tipo || ''}
                                    options={tiposMovimientoOptions}
                                    onChange={(value) => updateFiltroLocal('tipo', value || undefined)}
                                    allowClear={true}
                                    emptyText="No se encontraron tipos"
                                />
                            </div>

                            {/* Tipo de Ajuste */}
                            {tiposAjusteOptions.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Tipo de Ajuste</Label>
                                    <SearchSelect
                                        placeholder="Seleccionar ajuste..."
                                        value={filtrosLocal.tipo_ajuste_id?.toString() || ''}
                                        options={tiposAjusteOptions}
                                        onChange={(value) => updateFiltroLocal('tipo_ajuste_id', value ? parseInt(value) : undefined)}
                                        allowClear={true}
                                        emptyText="No se encontraron ajustes"
                                    />
                                </div>
                            )}

                            {/* Almacén */}
                            <div className="space-y-2">
                                <Label>Almacén</Label>
                                <SearchSelect
                                    placeholder="Seleccionar almacén..."
                                    value={filtrosLocal.almacen_id?.toString() || ''}
                                    options={almacenesOptions}
                                    onChange={(value) => updateFiltroLocal('almacen_id', value ? parseInt(value) : undefined)}
                                    allowClear={true}
                                    emptyText="No se encontraron almacenes"
                                />
                            </div>

                            {/* Fecha desde */}
                            <div className="space-y-2">
                                <Label htmlFor="fecha_inicio">Fecha desde</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="fecha_inicio"
                                        type="date"
                                        value={filtrosLocal.fecha_inicio || ''}
                                        onChange={(e) => updateFiltroLocal('fecha_inicio', e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {/* Fecha hasta */}
                            <div className="space-y-2">
                                <Label htmlFor="fecha_fin">Fecha hasta</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="fecha_fin"
                                        type="date"
                                        value={filtrosLocal.fecha_fin || ''}
                                        onChange={(e) => updateFiltroLocal('fecha_fin', e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>

                        {showAdvanced && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
                                {/* Número de referencia */}
                                <div className="space-y-2">
                                    <Label htmlFor="numero_referencia">Número de referencia</Label>
                                    <Input
                                        id="numero_referencia"
                                        placeholder="Ej: FAC-001, TRANSF-100..."
                                        value={filtrosLocal.numero_referencia || ''}
                                        onChange={(e) => updateFiltroLocal('numero_referencia', e.target.value)}
                                    />
                                </div>

                                {/* Cantidad mínima */}
                                <div className="space-y-2">
                                    <Label htmlFor="cantidad_min">Cantidad mínima</Label>
                                    <Input
                                        id="cantidad_min"
                                        type="number"
                                        placeholder="0"
                                        value={filtrosLocal.cantidad_min || ''}
                                        onChange={(e) => updateFiltroLocal('cantidad_min', e.target.value ? parseFloat(e.target.value) : undefined)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Filtros activos */}
                        {hasActiveFilters && (
                            <div className="pt-4 border-t">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm text-muted-foreground">Filtros activos:</span>
                                    {Object.entries(filtrosLocal).map(([key, value]) => {
                                        if (!value) return null;

                                        let displayValue = value.toString();
                                        let displayKey = key;

                                        // Personalizar la visualización de algunos filtros
                                        if (key === 'almacen_id') {
                                            const almacen = almacenes.find(a => a.id === value);
                                            displayValue = almacen?.nombre || value.toString();
                                            displayKey = 'Almacén';
                                        } else if (key === 'producto_id') {
                                            const producto = productos.find(p => p.id === value);
                                            displayValue = producto?.nombre || value.toString();
                                            displayKey = 'Producto';
                                        } else if (key === 'tipo') {
                                            const tipo = tiposMovimiento.find(t => t.value === value);
                                            displayValue = tipo?.label || value.toString();
                                            displayKey = 'Tipo';
                                        } else if (key === 'tipo_ajuste_id') {
                                            const ajuste = tiposAjuste.find(ta => ta.id === value);
                                            displayValue = ajuste?.label || value.toString();
                                            displayKey = 'Tipo Ajuste';
                                        }

                                        return (
                                            <Badge
                                                key={key}
                                                variant="secondary"
                                                className="flex items-center gap-1"
                                            >
                                                {displayKey}: {displayValue}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-3 w-3 p-0 hover:bg-transparent"
                                                    onClick={() => clearFiltro(key as keyof IFiltrosMovimientos)}
                                                >
                                                    <X className="h-2 w-2" />
                                                </Button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
