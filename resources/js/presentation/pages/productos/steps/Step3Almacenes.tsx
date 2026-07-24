import type { StockAlmacen } from '@/domain/entities/productos';
import { Button } from '@/presentation/components/ui/button';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import SearchSelect from '@/presentation/components/ui/search-select';
import { useState } from 'react';

interface Option {
    value: number | string;
    label: string;
}

export interface Step3Props {
    data: { almacenes: StockAlmacen[] };
    setData: (key: string, value: any) => void; // ✨ NUEVO: Para actualizar estado atomicamente
    almacenesOptions: Option[];
    sectores?: Record<number | string, Option[]>; // ✨ NUEVO: Sectores pre-cargados del backend
    addAlmacen: (prefill?: Partial<StockAlmacen>) => void;
    setAlmacen: (i: number, key: keyof StockAlmacen, value: number | string | undefined) => void;
    removeAlmacen: (i: number) => void | Promise<void>;
    canEditStockQuantities?: boolean; // ✨ NUEVO: Permiso para editar cantidades
    setSectorConSincronizacion?: (i: number, sectorId: number | undefined) => void; // ✨ NUEVO: Sincronizar sector en todos los cards del mismo almacén
    handleCantidadTotalChange?: (i: number, newValue: number | undefined) => void; // ✨ NUEVO: Auto-llenar disponible y reservada
}

function todayISO(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * ✨ NUEVO: Validar y ajustar almacenes antes de guardar
 * Asegura que: total >= (disponible + reservada)
 * Si no cumple, ajusta disponible = total - reservada
 */
export function validarYAjustarAlmacenes(almacenes: any[]): { validos: any[]; ajustes: Map<number, any> } {
    const ajustes = new Map<number, any>();

    const almacenesAjustados = (almacenes || []).map((almacen, idx) => {
        const total = Number(almacen.cantidad ?? almacen.stock ?? 0);
        const disponible = Number(almacen.cantidad_disponible ?? 0);
        const reservada = Number(almacen.cantidad_reservada ?? 0);
        const suma = disponible + reservada;

        // Validar invariante
        if (suma > total) {
            // Ajustar disponible para cumplir: total = disponible + reservada
            const disponibleAjustado = Math.max(0, total - reservada);

            ajustes.set(idx, {
                original: { disponible, reservada, total },
                ajustado: { disponible: disponibleAjustado, reservada, total },
                mensaje: `Almacén ${idx + 1}: Se ajustó Disponible de ${disponible.toFixed(2)} a ${disponibleAjustado.toFixed(2)} (Reservada: ${reservada.toFixed(2)}, Total: ${total.toFixed(2)})`,
            });

            return {
                ...almacen,
                cantidad_disponible: disponibleAjustado,
            };
        }

        return almacen;
    });

    return { validos: almacenesAjustados, ajustes };
}

export default function Step3Almacenes({
    data,
    setData,
    almacenesOptions,
    sectores,
    addAlmacen,
    setAlmacen,
    removeAlmacen,
    canEditStockQuantities = false,
    setSectorConSincronizacion,
    handleCantidadTotalChange,
}: Step3Props) {
    // console.log('🏢 Almacenes Options:', almacenesOptions);
    // console.log('🏭 Sectores Pre-cargados del backend:', sectores);
    // console.log('📋 Data (almacenes del formulario):', data.almacenes);
    // console.log('✏️ canEditStockQuantities:', canEditStockQuantities);
    // console.log('═'.repeat(60));

    // ✨ Inicializar con sectores pre-cargados del backend si están disponibles
    const [sectoresOptions, setSectoresOptions] = useState<Record<number | string, Option[]>>(sectores || {});
    const [setLoadingSectores] = useState<Record<number | string, boolean>>({});

    // ✨ NUEVO: Pre-llenar globalSectorId con el sector del primer almacén que tenga uno
    const initialSectorId = (data.almacenes || []).find((a: StockAlmacen) => a.sector_id)?.sector_id;
    const [globalSectorId, setGlobalSectorId] = useState<number | undefined>(initialSectorId);
    const [activeTab, setActiveTab] = useState<'almacenes' | 'sector'>('sector');
    const [expandedAlmacenes, setExpandedAlmacenes] = useState<boolean>(true);

    // Cargar sectores cuando se selecciona un almacén
    const handleAlmacenChange = async (i: number, almacenId: number | string) => {
        console.log(`🔄 Almacén seleccionado en posición ${i}:`, almacenId);

        // ✨ ACTUALIZADO: Usar newData local en lugar de data.almacenes que puede estar desactualizado
        const newData = [...(data.almacenes || [])];
        const finalAlmacenId = almacenId !== '' ? Number(almacenId) : undefined;
        newData[i] = { ...newData[i], almacen_id: finalAlmacenId };

        if (!almacenId) {
            console.log(`❌ Almacén vacío, limpiando sector`);
            newData[i] = { ...newData[i], sector_id: undefined };
            setData('almacenes', newData);
            return;
        }

        // ✨ NUEVO: Auto-completar sector si otros cards del mismo almacén ya tienen uno
        const almacenesDelMismoAlmacen = newData.filter(
            (a: StockAlmacen, idx: number) => idx !== i && String(a.almacen_id) === String(finalAlmacenId) && a.sector_id,
        );

        if (almacenesDelMismoAlmacen.length > 0) {
            const sectorDelPrimero = almacenesDelMismoAlmacen[0].sector_id;
            const todosTienenMismoSector = almacenesDelMismoAlmacen.every((a: StockAlmacen) => a.sector_id === sectorDelPrimero);

            if (todosTienenMismoSector && sectorDelPrimero) {
                newData[i] = { ...newData[i], sector_id: sectorDelPrimero };
            }
        }

        // ✨ ACTUALIZADO: Actualizar estado de una sola vez
        setData('almacenes', newData);

        // ✨ Si ya tenemos los sectores (pre-cargados o en caché), no cargar de nuevo
        if (sectoresOptions[almacenId]) {
            // console.log(`✅ Sectores ya en caché para almacén ${almacenId}:`, sectoresOptions[almacenId]);
            return;
        }

        // Cargar sectores del almacén si no están pre-cargados
        // console.log(`⏳ Cargando sectores desde API para almacén ${almacenId}...`);
        setLoadingSectores((prev) => ({ ...prev, [almacenId]: true }));
        try {
            const response = await fetch(`/api/almacenes/${almacenId}/sectores`);
            if (response.ok) {
                const result = await response.json();
                // console.log(`✅ Sectores cargados del API para almacén ${almacenId}:`, result);
                const options =
                    result.data?.map((s: any) => ({
                        value: s.id,
                        label: s.nombre,
                        descripcion: s.descripcion,
                        es_generico: s.es_generico,
                        stock_minimo: s.stock_minimo,
                        stock_maximo: s.stock_maximo,
                    })) || [];
                // console.log(`📦 Opciones formateadas:`, options);
                setSectoresOptions((prev) => ({ ...prev, [almacenId]: options }));
            }
        } catch (error) {
            console.error('❌ Error cargando sectores:', error);
        } finally {
            setLoadingSectores((prev) => ({ ...prev, [almacenId]: false }));
        }
    };

    return (
        <div className="mt-2">
            {/* ✨ RESUMEN TOTAL DE TODOS LOS ALMACENES */}
            {(data.almacenes || []).length > 0 &&
                (() => {
                    const totalGeneral = {
                        cantidad: 0,
                        disponible: 0,
                        reservada: 0,
                    };

                    (data.almacenes || []).forEach((a: StockAlmacen) => {
                        totalGeneral.cantidad += Number(a.cantidad ?? a.stock ?? 0);
                        totalGeneral.disponible += Number(a.cantidad_disponible ?? 0);
                        totalGeneral.reservada += Number(a.cantidad_reservada ?? 0);
                    });

                    return (
                        <div className="mt-2 rounded-lg border-2 border-slate-300 bg-gradient-to-r from-slate-100 to-slate-50 p-2 dark:border-slate-700 dark:from-slate-950 dark:to-slate-900">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                {/* Total General */}
                                <div className="justify-content items-center rounded-md border border-blue-200 bg-blue-50 p-2 dark:border-blue-800 dark:bg-blue-950/50">
                                    <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">Total General: {totalGeneral.cantidad.toFixed(2)}</div>
                                </div>

                                {/* Total Disponible */}
                                <div className="justify-content items-center rounded-md border border-emerald-200 bg-emerald-50 p-2 dark:border-emerald-800 dark:bg-emerald-950/50">
                                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Disponible para vender: {totalGeneral.disponible.toFixed(2)}</div>
                                </div>

                                {/* Total Reservada */}
                                <div className="justify-content items-center rounded-md border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-950/50">
                                    <div className="text-xs font-semibold text-amber-700 dark:text-amber-300">Reservado: {totalGeneral.reservada.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Información adicional */}
                            {/* <div className="mt-3 border-t border-slate-300 pt-3 dark:border-slate-700">
                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                    📦 <span className="font-semibold">{(data.almacenes || []).length}</span> almacén
                                    {(data.almacenes || []).length !== 1 ? 'es' : ''} asociado {(data.almacenes || []).length !== 1 ? 's' : ''}
                                </div>
                            </div> */}
                        </div>
                    );
                })()}
            <div className="w-full items-center justify-between gap-2 mt-4">
                {/* Tabs Navigation - DIVs en lugar de componente Tabs */}
                <div className="grid w-full grid-cols-2 border-b border-border bg-background">
                    <button
                        type="button"
                        onClick={() => setActiveTab('almacenes')}
                        className={`px-4 py-2 text-sm font-medium text-center transition-colors ${
                            activeTab === 'almacenes'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        📦 Almacenes
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('sector')}
                        className={`px-4 py-2 text-sm font-medium text-center transition-colors ${
                            activeTab === 'sector'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        🏢 Sector Global
                    </button>
                </div>

                {/* TAB 1: ALMACENES Y STOCK */}
                {activeTab === 'almacenes' && <div className="space-y-4 mt-2">
                    <div>
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setExpandedAlmacenes(!expandedAlmacenes)}
                                className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors"
                            >
                                {expandedAlmacenes ? '▼' : '▶'} Gestión de Almacenes ({(data.almacenes || []).length})
                            </button>
                            <Button type="button" size="sm" onClick={() => addAlmacen()} variant="outline" aria-label="Agregar almacén">
                                📦Añadir almacén
                            </Button>
                        </div>

                        {(data.almacenes || []).length === 0 && (
                            <div className="text-sm text-muted-foreground">No hay entradas. Añada al menos un almacén si desea controlar stock.</div>
                        )}
                        {expandedAlmacenes && (data.almacenes || []).map((a: StockAlmacen, i: number) => (
                            <div key={i} className="mt-2 flex items-end gap-1 overflow-x-auto pb-1">
                                {/* Almacén */}
                                <div className="flex-shrink-0">
                                    <Label className="text-xs font-semibold text-foreground">Almacén* #{a.id}</Label>
                                    <SearchSelect
                                        id={`almacen-select-${i}`}
                                        placeholder="Sel."
                                        value={a.almacen_id ? String(a.almacen_id) : ''}
                                        options={almacenesOptions}
                                        onChange={(value) => handleAlmacenChange(i, value ? Number(value) : undefined)}
                                        allowClear={true}
                                    />
                                </div>

                                {/* Lote */}
                                <div className="flex-shrink-0 w-24">
                                    <Label className="text-xs font-semibold text-foreground">Lote</Label>
                                    <Input
                                        size="sm"
                                        value={a.lote || ''}
                                        onChange={(e) => setAlmacen(i, 'lote', e.target.value)}
                                        placeholder="Lote"
                                        className="h-9 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                                        aria-label={`Lote ${i + 1}`}
                                    />
                                </div>

                                {/* Vencimiento */}
                                <div className="flex-shrink-0 flex items-center gap-1">
                                    <div className="flex items-center gap-1">
                                        <Checkbox
                                            id={`has-exp-${i}`}
                                            checked={!!a.fecha_vencimiento}
                                            onCheckedChange={(v) => {
                                                const checked = !!v;
                                                setAlmacen(i, 'fecha_vencimiento', checked ? (a.fecha_vencimiento || todayISO()) : '');
                                            }}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor={`has-exp-${i}`} className="text-xs cursor-pointer whitespace-nowrap">Vto.</Label>
                                    </div>
                                    <Input
                                        type="date"
                                        value={a.fecha_vencimiento || ''}
                                        onChange={(e) => setAlmacen(i, 'fecha_vencimiento', e.target.value)}
                                        disabled={!a.fecha_vencimiento}
                                        className="h-9 text-xs w-48 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 disabled:opacity-50 disabled:dark:bg-zinc-900"
                                    />
                                </div>

                                {/* Stock: Cantidad Total, Disponible, Reservada */}
                                {(() => {
                                    const totalStock = Number(a.cantidad ?? a.stock ?? 0);
                                    const disponible = Number(a.cantidad_disponible ?? 0);
                                    const reservada = Number(a.cantidad_reservada ?? 0);
                                    const esValido = totalStock >= disponible + reservada;
                                    const hasError = canEditStockQuantities && !esValido;

                                    return (
                                        <>
                                            {/* Cantidad Total */}
                                            <div className="flex-shrink-0 w-20">
                                                <Label className="text-xs font-semibold text-foreground">Total</Label>
                                                <Input
                                                    type="number"
                                                    inputMode="decimal"
                                                    step="0.01"
                                                    value={totalStock || ''}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value === '' ? undefined : Number(e.target.value);
                                                        if (handleCantidadTotalChange) {
                                                            handleCantidadTotalChange(i, newValue);
                                                        }
                                                    }}
                                                    readOnly={!canEditStockQuantities}
                                                    className={`h-9 text-xs ${
                                                        canEditStockQuantities
                                                            ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-100'
                                                            : 'opacity-60 bg-blue-50/50 dark:bg-blue-950/20 dark:text-blue-300'
                                                    } ${hasError ? 'border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200' : ''}`}
                                                />
                                            </div>

                                            {/* Disponible */}
                                            <div className="flex-shrink-0 w-20">
                                                <Label className="text-xs font-semibold text-foreground">Disp.</Label>
                                                <Input
                                                    type="number"
                                                    inputMode="decimal"
                                                    step="0.01"
                                                    value={disponible || ''}
                                                    onChange={(e) => {
                                                        setAlmacen(
                                                            i,
                                                            'cantidad_disponible',
                                                            e.target.value === '' ? undefined : Number(e.target.value),
                                                        );
                                                    }}
                                                    readOnly={!canEditStockQuantities}
                                                    className={`h-9 text-xs ${
                                                        canEditStockQuantities
                                                            ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100'
                                                            : 'opacity-60 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-300'
                                                    } ${hasError ? 'border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200' : ''}`}
                                                />
                                            </div>

                                            {/* Reservada */}
                                            <div className="flex-shrink-0 w-20">
                                                <Label className="text-xs font-semibold text-foreground">Res.</Label>
                                                <Input
                                                    type="number"
                                                    inputMode="decimal"
                                                    step="0.01"
                                                    value={reservada || ''}
                                                    onChange={(e) => {
                                                        setAlmacen(
                                                            i,
                                                            'cantidad_reservada',
                                                            e.target.value === '' ? undefined : Number(e.target.value),
                                                        );
                                                    }}
                                                    readOnly={!canEditStockQuantities}
                                                    className={`h-9 text-xs ${
                                                        canEditStockQuantities
                                                            ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100'
                                                            : 'opacity-60 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-300'
                                                    } ${hasError ? 'border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200' : ''}`}
                                                />
                                            </div>

                                            {/* Botón eliminar */}
                                            {/* <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => removeAlmacen(i)}
                                                className="flex-shrink-0 h-9 mt-5"
                                            >
                                                🗑️
                                            </Button> */}

                                            {/* Error inline */}
                                            {hasError && (
                                                <div className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-red-50 p-1 rounded whitespace-nowrap">
                                                    ⚠️ Total debe ser ≥ Disp. + Res.
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        ))}
                    </div>
                </div>}

                {/* TAB 2: SECTOR GLOBAL */}
                {activeTab === 'sector' && <div className="space-y-4">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                        <Label className="mb-2 block text-sm font-medium">🏢 Asignar Sector</Label>
                        <p className="mb-4 text-xs text-gray-600 dark:text-gray-400">Selecciona UN sector para TODOS los lotes de este producto</p>

                        <div className="space-y-3">
                            <div>
                                <Label className="mb-2 block text-xs font-semibold text-foreground">Sector *</Label>
                                <SearchSelect
                                    id="sector-global"
                                    placeholder="Seleccione un sector"
                                    value={globalSectorId ? String(globalSectorId) : ''}
                                    options={Object.values(sectoresOptions).flat()}
                                    onChange={(value) => {
                                        // ⚠️ Solo guardar en estado local, NO aplicar automáticamente
                                        const sectorId = value ? Number(value) : undefined;
                                        setGlobalSectorId(sectorId);
                                    }}
                                    allowClear={true}
                                />
                            </div>

                            {/* Botón para aplicar sector */}
                            <Button
                                type="button"
                                size="sm"
                                variant="default"
                                onClick={() => {
                                    // Aplicar sector solo cuando el usuario hace clic
                                    if (globalSectorId && (data.almacenes || []).length > 0) {
                                        const updated = data.almacenes.map((a) => ({
                                            ...a,
                                            sector_id: globalSectorId,
                                        }));
                                        setData('almacenes', updated);
                                    }
                                }}
                                disabled={!globalSectorId || !data.almacenes || data.almacenes.length === 0}
                            >
                                ✨ Aplicar sector a todos los lotes
                            </Button>

                            {/* Resumen de aplicación */}
                            {globalSectorId && (data.almacenes || []).length > 0 && (
                                <div className="rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        ℹ️ Presiona "Aplicar sector" para asignar a <span className="font-bold">{(data.almacenes || []).length}</span>{' '}
                                        lote{(data.almacenes || []).length !== 1 ? 's' : ''}, luego guarda el formulario.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    );
}
