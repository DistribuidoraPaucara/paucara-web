import type { StockAlmacen } from '@/domain/entities/productos';
import { Button } from '@/presentation/components/ui/button';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import SearchSelect from '@/presentation/components/ui/search-select';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/presentation/components/ui/tooltip';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { Fragment, useState, type ReactNode } from 'react';

interface Option {
    value: number | string;
    label: string;
}

export interface Step3Props {
    data: { almacenes: StockAlmacen[]; globalSectorId?: number }; // ✨ NUEVO: Incluir globalSectorId en data
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

// Función para detectar si una fecha está vencida
function isLoteVencido(fechaVencimiento: string | null | undefined): boolean {
    if (!fechaVencimiento) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Parsear fecha sin problemas de timezone
    const [year, month, day] = fechaVencimiento.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    fecha.setHours(0, 0, 0, 0);

    return fecha < hoy;
}

// Encabezado de columna con ayuda: un solo tooltip por columna en lugar de uno por fila
function EncabezadoConAyuda({ ayuda, derecha, children }: { ayuda: string; derecha?: boolean; children: ReactNode }) {
    return (
        <th scope="col" className={`px-3 py-2 font-semibold ${derecha ? 'text-right' : 'text-left'}`}>
            <span className={`inline-flex items-center gap-1 ${derecha ? 'justify-end' : ''}`}>
                {children}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button type="button" aria-label={ayuda} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <HelpCircle size={12} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">{ayuda}</TooltipContent>
                </Tooltip>
            </span>
        </th>
    );
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
    const [, setLoadingSectores] = useState<Record<number | string, boolean>>({});

    // ✨ NUEVO: Pre-llenar globalSectorId desde data.globalSectorId o del primer almacén
    const initialSectorId = data.globalSectorId || (data.almacenes || []).find((a: StockAlmacen) => a.sector_id)?.sector_id;
    const [globalSectorId, setGlobalSectorId] = useState<number | undefined>(initialSectorId);
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
            
            <div className="w-full items-center justify-between gap-2 mt-4 space-y-6">

                {/* SECCIÓN 2: ALMACENES Y STOCK (LOTES) */}
                <div className="space-y-4 mt-2">
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
                            <div className="mt-2 text-sm text-muted-foreground">No hay entradas. Añada al menos un almacén si desea controlar stock.</div>
                        )}

                        {expandedAlmacenes && (data.almacenes || []).length > 0 && (
                            <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-700">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50 text-xs text-gray-600 dark:bg-zinc-800 dark:text-zinc-300">
                                        <tr>
                                            <th scope="col" className="px-3 py-2 text-left font-semibold">ID</th>
                                            <EncabezadoConAyuda ayuda="Selecciona el almacén donde se guarda este lote">Almacén *</EncabezadoConAyuda>
                                            <EncabezadoConAyuda ayuda="Identificador del lote para trazabilidad">Lote</EncabezadoConAyuda>
                                            <EncabezadoConAyuda ayuda="Marca la casilla si el lote tiene fecha de vencimiento">Vencimiento</EncabezadoConAyuda>
                                            <EncabezadoConAyuda ayuda="Cantidad total del lote en almacén" derecha>Total</EncabezadoConAyuda>
                                            <EncabezadoConAyuda ayuda="Cantidad disponible para vender" derecha>Disp.</EncabezadoConAyuda>
                                            <EncabezadoConAyuda ayuda="Cantidad reservada para pedidos pendientes" derecha>Res.</EncabezadoConAyuda>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                        {(data.almacenes || []).map((a: StockAlmacen, i: number) => {
                                            const totalStock = Number(a.cantidad ?? a.stock ?? 0);
                                            const disponible = Number(a.cantidad_disponible ?? 0);
                                            const reservada = Number(a.cantidad_reservada ?? 0);
                                            const hasError = canEditStockQuantities && totalStock < disponible + reservada;
                                            const eliminado = !!(a as any).is_deleted;
                                            const vencido = isLoteVencido(a.fecha_vencimiento);
                                            const claseError = hasError ? 'border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200' : '';

                                            return (
                                                <Fragment key={i}>
                                                    <tr
                                                        className={
                                                            eliminado
                                                                ? 'bg-gray-100 opacity-60 dark:bg-gray-800'
                                                                : vencido
                                                                  ? 'bg-red-50/70 dark:bg-red-900/10'
                                                                  : 'bg-white dark:bg-zinc-900'
                                                        }
                                                    >
                                                        <td className="px-3 py-2 whitespace-nowrap">
                                                            {a.id ? (
                                                                <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-600 dark:bg-zinc-800 dark:text-zinc-300">
                                                                    #{a.id}
                                                                </span>
                                                            ) : (
                                                                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                                    Nuevo
                                                                </span>
                                                            )}
                                                            {eliminado && (
                                                                <span className="ml-1 rounded bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">ELIMINADO</span>
                                                            )}
                                                        </td>

                                                        <td className="px-3 py-2">
                                                            <select
                                                                id={`almacen-select-${i}`}
                                                                aria-label={`Almacén de la fila ${i + 1}`}
                                                                value={a.almacen_id ? String(a.almacen_id) : ''}
                                                                onChange={(e) => handleAlmacenChange(i, e.target.value ? Number(e.target.value) : '')}
                                                                className="h-9 w-44 rounded-md border border-gray-300 bg-white px-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                                            >
                                                                <option value="">Seleccione…</option>
                                                                {almacenesOptions.map((o) => (
                                                                    <option key={o.value} value={String(o.value)}>
                                                                        {o.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>

                                                        <td className="px-3 py-2">
                                                            <Input
                                                                value={a.lote || ''}
                                                                onChange={(e) => setAlmacen(i, 'lote', e.target.value)}
                                                                placeholder="Sin lote"
                                                                className="h-9 w-32 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                                                aria-label={`Lote ${i + 1}`}
                                                            />
                                                        </td>

                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <Checkbox
                                                                    id={`has-exp-${i}`}
                                                                    aria-label={`El lote ${i + 1} tiene vencimiento`}
                                                                    checked={!!a.fecha_vencimiento}
                                                                    onCheckedChange={(v) => {
                                                                        setAlmacen(i, 'fecha_vencimiento', v ? a.fecha_vencimiento || todayISO() : '');
                                                                    }}
                                                                    className="h-4 w-4"
                                                                />
                                                                <Input
                                                                    type="date"
                                                                    aria-label={`Vencimiento del lote ${i + 1}`}
                                                                    value={a.fecha_vencimiento || ''}
                                                                    onChange={(e) => setAlmacen(i, 'fecha_vencimiento', e.target.value)}
                                                                    disabled={!a.fecha_vencimiento}
                                                                    className={`h-9 w-36 text-xs disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 disabled:dark:bg-zinc-900 ${
                                                                        vencido ? 'border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-900/20' : ''
                                                                    }`}
                                                                />
                                                                {vencido && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <button type="button" aria-label="Este lote está vencido" className="text-red-500">
                                                                                <AlertTriangle size={14} />
                                                                            </button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="top">Este lote está vencido</TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td className="px-3 py-2 text-right">
                                                            <Input
                                                                type="number"
                                                                inputMode="decimal"
                                                                step="0.01"
                                                                aria-label={`Total del lote ${i + 1}`}
                                                                value={totalStock || ''}
                                                                onChange={(e) => {
                                                                    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
                                                                    if (handleCantidadTotalChange) {
                                                                        handleCantidadTotalChange(i, newValue);
                                                                    }
                                                                }}
                                                                readOnly={!canEditStockQuantities}
                                                                className={`ml-auto h-9 w-24 text-right text-xs ${
                                                                    canEditStockQuantities
                                                                        ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-100'
                                                                        : 'bg-blue-50/50 opacity-60 dark:bg-blue-950/20 dark:text-blue-300'
                                                                } ${claseError}`}
                                                            />
                                                        </td>

                                                        <td className="px-3 py-2 text-right">
                                                            <Input
                                                                type="number"
                                                                inputMode="decimal"
                                                                step="0.01"
                                                                aria-label={`Disponible del lote ${i + 1}`}
                                                                value={disponible || ''}
                                                                onChange={(e) => {
                                                                    setAlmacen(i, 'cantidad_disponible', e.target.value === '' ? undefined : Number(e.target.value));
                                                                }}
                                                                readOnly={!canEditStockQuantities}
                                                                className={`ml-auto h-9 w-24 text-right text-xs ${
                                                                    canEditStockQuantities
                                                                        ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100'
                                                                        : 'bg-emerald-50/50 opacity-60 dark:bg-emerald-950/20 dark:text-emerald-300'
                                                                } ${claseError}`}
                                                            />
                                                        </td>

                                                        <td className="px-3 py-2 text-right">
                                                            <Input
                                                                type="number"
                                                                inputMode="decimal"
                                                                step="0.01"
                                                                aria-label={`Reservada del lote ${i + 1}`}
                                                                value={reservada || ''}
                                                                onChange={(e) => {
                                                                    setAlmacen(i, 'cantidad_reservada', e.target.value === '' ? undefined : Number(e.target.value));
                                                                }}
                                                                readOnly={!canEditStockQuantities}
                                                                className={`ml-auto h-9 w-24 text-right text-xs ${
                                                                    canEditStockQuantities
                                                                        ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100'
                                                                        : 'bg-amber-50/50 opacity-60 dark:bg-amber-950/20 dark:text-amber-300'
                                                                } ${claseError}`}
                                                            />
                                                        </td>
                                                    </tr>

                                                    {hasError && (
                                                        <tr className="bg-red-50 dark:bg-red-950/30">
                                                            <td colSpan={7} className="px-3 py-1.5 text-xs text-red-600 dark:text-red-300">
                                                                ⚠️ Total debe ser ≥ Disponible + Reservado
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
