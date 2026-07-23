import type { StockAlmacen } from '@/domain/entities/productos';
import { Button } from '@/presentation/components/ui/button';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import SearchSelect from '@/presentation/components/ui/search-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
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
    const [globalSectorId, setGlobalSectorId] = useState<number | undefined>(undefined);

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
            <Tabs defaultValue="almacenes" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="almacenes">📦 Almacenes</TabsTrigger>
                    <TabsTrigger value="sector">🏢 Sector Global</TabsTrigger>
                </TabsList>

                {/* TAB 1: ALMACENES Y STOCK */}
                <TabsContent value="almacenes" className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Gestión de Almacenes</Label>
                    <Button type="button" size="sm" onClick={() => addAlmacen()} variant="outline" aria-label="Agregar almacén">
                        📦Añadir almacén
                    </Button>
                </div>
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
                                    <div className="justify-content items-center rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/50">
                                        <div className="mb-1 text-xs font-semibold text-blue-700 dark:text-blue-300">💙 Total General</div>
                                        <div className="text-md font-bold text-blue-900 dark:text-blue-100">{totalGeneral.cantidad.toFixed(2)}</div>
                                        <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">unidades en stock</div>
                                    </div>

                                    {/* Total Disponible */}
                                    <div className="justify-content items-center rounded-md border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/50">
                                        <div className="mb-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">💚 Total Disponible</div>
                                        <div className="text-md font-bold text-emerald-900 dark:text-emerald-100">
                                            {totalGeneral.disponible.toFixed(2)}
                                        </div>
                                        <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">listo para usar</div>
                                    </div>

                                    {/* Total Reservada */}
                                    <div className="justify-content items-center rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/50">
                                        <div className="mb-1 text-xs font-semibold text-amber-700 dark:text-amber-300">🟠 Total Reservada</div>
                                        <div className="text-md font-bold text-amber-900 dark:text-amber-100">
                                            {totalGeneral.reservada.toFixed(2)}
                                        </div>
                                        <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">comprometido</div>
                                    </div>
                                </div>

                                {/* Información adicional */}
                                <div className="mt-3 border-t border-slate-300 pt-3 dark:border-slate-700">
                                    <div className="text-xs text-slate-600 dark:text-slate-400">
                                        📦 <span className="font-semibold">{(data.almacenes || []).length}</span> almacén
                                        {(data.almacenes || []).length !== 1 ? 'es' : ''} asociado {(data.almacenes || []).length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                {(data.almacenes || []).length === 0 && (
                    <div className="text-sm text-muted-foreground">No hay entradas. Añada al menos un almacén si desea controlar stock.</div>
                )}
                {(data.almacenes || []).map((a: StockAlmacen, i: number) => (
                    <div key={i} className="flex flex-wrap gap-2 mt-2">
                        {/* Fila 1: Almacén y Sector */}
                        <div className="flex flex-wrap gap-2">
                            <div>
                                <Label className="text-xs font-semibold text-foreground">Almacén * #{a.id}</Label>
                                <SearchSelect
                                    id={`almacen-select-${i}`}
                                    placeholder="Seleccione un almacén"
                                    value={a.almacen_id ? String(a.almacen_id) : ''}
                                    options={almacenesOptions}
                                    onChange={(value) => handleAlmacenChange(i, value ? Number(value) : undefined)}
                                    allowClear={true}
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold text-foreground">Lote (Opcional)</Label>
                                <Input
                                    value={a.lote || ''}
                                    onChange={(e) => setAlmacen(i, 'lote', e.target.value)}
                                    placeholder="Código de lote"
                                    aria-label={`Lote almacén ${i + 1}`}
                                />
                            </div>
                            <div>
                                <div className="flex flex-wrap mt-1 mb-1items-center justify-between gap-2">
                                    <Label className="text-xs font-semibold text-foreground">Vencimiento</Label>
                                    <div className="gap-2 items-center flex">
                                        <Checkbox
                                            id={`has-exp-${i}`}
                                            checked={!!a.fecha_vencimiento}
                                            onCheckedChange={(v) => {
                                                const checked = !!v;
                                                if (checked) {
                                                    const next = a.fecha_vencimiento && a.fecha_vencimiento !== '' ? a.fecha_vencimiento : todayISO();
                                                    setAlmacen(i, 'fecha_vencimiento', next);
                                                } else {
                                                    setAlmacen(i, 'fecha_vencimiento', '');
                                                }
                                            }}
                                            aria-label={`Tiene vencimiento almacén ${i + 1}`}
                                        />
                                        <Label htmlFor={`has-exp-${i}`} className="cursor-pointer text-xs">
                                            con vencimiento
                                        </Label>
                                    </div>
                                </div>
                                <Input
                                    type="date"
                                    value={a.fecha_vencimiento || ''}
                                    onChange={(e) => setAlmacen(i, 'fecha_vencimiento', e.target.value)}
                                    aria-label={`Fecha de vencimiento almacén ${i + 1}`}
                                    disabled={!a.fecha_vencimiento}
                                />
                            </div>
                        </div>

                        {/* Fila 3: Información de Stock */}
                        {(() => {
                            // ✨ CORREGIDO: Usar 'cantidad' del backend (no 'stock')
                            const totalStock = Number(a.cantidad ?? a.stock ?? 0);
                            const disponible = Number(a.cantidad_disponible ?? 0);
                            const reservada = Number(a.cantidad_reservada ?? 0);
                            const esValido = totalStock >= disponible + reservada;
                            const hasError = canEditStockQuantities && !esValido;

                            return (
                                <>
                                    <div
                                        className={`flex flex-wrap gap-2 rounded border transition-colors ${
                                            hasError
                                                ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30'
                                                : 'border-border bg-muted/50 dark:border-border dark:bg-muted/30'
                                        } p-2`}
                                    >
                                        <div>
                                            <Label className="text-xs font-semibold text-foreground">
                                                Cantidad Total
                                                {canEditStockQuantities && <span className="ml-1 text-red-600 dark:text-red-400">*</span>}
                                            </Label>
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
                                                className={`transition-colors ${
                                                    canEditStockQuantities
                                                        ? 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100'
                                                        : 'cursor-not-allowed border-blue-200 bg-blue-50 text-blue-900 opacity-60 dark:border-blue-800/50 dark:bg-blue-950/20 dark:text-blue-300'
                                                }`}
                                                aria-label={`Cantidad total almacén ${i + 1}`}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs font-semibold text-foreground">
                                                Disponible
                                                {canEditStockQuantities && <span className="ml-1 text-red-600 dark:text-red-400">*</span>}
                                            </Label>
                                            <Input
                                                type="number"
                                                inputMode="decimal"
                                                step="0.01"
                                                value={disponible || ''}
                                                onChange={(e) => {
                                                    setAlmacen(i, 'cantidad_disponible', e.target.value === '' ? undefined : Number(e.target.value));
                                                }}
                                                readOnly={!canEditStockQuantities}
                                                className={`transition-colors ${
                                                    canEditStockQuantities
                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100'
                                                        : 'cursor-not-allowed border-emerald-200 bg-emerald-50 text-emerald-900 opacity-60 dark:border-emerald-800/50 dark:bg-emerald-950/20 dark:text-emerald-300'
                                                }`}
                                                aria-label={`Cantidad disponible almacén ${i + 1}`}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs font-semibold text-foreground">
                                                Reservada
                                                {canEditStockQuantities && <span className="ml-1 text-red-600 dark:text-red-400">*</span>}
                                            </Label>
                                            <Input
                                                type="number"
                                                inputMode="decimal"
                                                step="0.01"
                                                value={reservada || ''}
                                                onChange={(e) => {
                                                    setAlmacen(i, 'cantidad_reservada', e.target.value === '' ? undefined : Number(e.target.value));
                                                }}
                                                readOnly={!canEditStockQuantities}
                                                className={`transition-colors ${
                                                    canEditStockQuantities
                                                        ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100'
                                                        : 'cursor-not-allowed border-amber-200 bg-amber-50 text-amber-900 opacity-60 dark:border-amber-800/50 dark:bg-amber-950/20 dark:text-amber-300'
                                                }`}
                                                aria-label={`Cantidad reservada almacén ${i + 1}`}
                                            />
                                        </div>
                                    </div>

                                    {/* ⚠️ Mensaje de validación */}
                                    {hasError && (
                                        <div className="rounded border border-red-300 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                                            ⚠️ Advertencia: La cantidad total ({totalStock.toFixed(2)}) debe ser mayor o igual a disponible (
                                            {disponible.toFixed(2)}) + reservada ({reservada.toFixed(2)}) = {(disponible + reservada).toFixed(2)}
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                        ))}
                    </div>
                </TabsContent>

                {/* TAB 2: SECTOR GLOBAL */}
                <TabsContent value="sector" className="space-y-4">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                        <Label className="text-sm font-medium block mb-2">🏢 Asignar Sector</Label>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                            Selecciona UN sector para TODOS los lotes de este producto
                        </p>

                        <div className="space-y-3">
                            <div>
                                <Label className="text-xs font-semibold text-foreground block mb-2">Sector *</Label>
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
                                        const updated = data.almacenes.map(a => ({
                                            ...a,
                                            sector_id: globalSectorId
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
                                        ℹ️ Presiona "Aplicar sector" para asignar a <span className="font-bold">{(data.almacenes || []).length}</span> lote{(data.almacenes || []).length !== 1 ? 's' : ''}, luego guarda el formulario.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
