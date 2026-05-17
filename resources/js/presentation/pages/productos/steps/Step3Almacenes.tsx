import { Label } from '@/presentation/components/ui/label';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import SearchSelect from '@/presentation/components/ui/search-select';
import type { StockAlmacen } from '@/domain/entities/productos';
import { useState, useEffect } from 'react';

interface Option { value: number | string; label: string }

export interface Step3Props {
  data: { almacenes: StockAlmacen[] };
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
export function validarYAjustarAlmacenes(almacenes: any[]): { validos: any[], ajustes: Map<number, any> } {
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
        mensaje: `Almacén ${idx + 1}: Se ajustó Disponible de ${disponible.toFixed(2)} a ${disponibleAjustado.toFixed(2)} (Reservada: ${reservada.toFixed(2)}, Total: ${total.toFixed(2)})`
      });

      return {
        ...almacen,
        cantidad_disponible: disponibleAjustado
      };
    }

    return almacen;
  });

  return { validos: almacenesAjustados, ajustes };
}

export default function Step3Almacenes({ data, almacenesOptions, sectores, addAlmacen, setAlmacen, removeAlmacen, canEditStockQuantities = false, setSectorConSincronizacion, handleCantidadTotalChange }: Step3Props) {
  // console.log('🏢 Almacenes Options:', almacenesOptions);
  // console.log('🏭 Sectores Pre-cargados del backend:', sectores);
  // console.log('📋 Data (almacenes del formulario):', data.almacenes);
  // console.log('✏️ canEditStockQuantities:', canEditStockQuantities);
  // console.log('═'.repeat(60));

  // ✨ Inicializar con sectores pre-cargados del backend si están disponibles
  const [sectoresOptions, setSectoresOptions] = useState<Record<number | string, Option[]>>(sectores || {});
  const [loadingSectores, setLoadingSectores] = useState<Record<number | string, boolean>>({});

  // Cargar sectores cuando se selecciona un almacén
  const handleAlmacenChange = async (i: number, almacenId: number | string) => {
    console.log(`🔄 Almacén seleccionado en posición ${i}:`, almacenId);
    setAlmacen(i, 'almacen_id', almacenId);

    if (!almacenId) {
      console.log(`❌ Almacén vacío, limpiando sector`);
      setAlmacen(i, 'sector_id', undefined);
      return;
    }

    // ✨ NUEVO: Auto-completar sector si otros cards del mismo almacén ya tienen uno
    const almacenesDelMismoAlmacen = (data.almacenes || []).filter(
      (a: StockAlmacen, idx: number) => idx !== i && a.almacen_id === almacenId && a.sector_id
    );

    if (almacenesDelMismoAlmacen.length > 0) {
      const sectorDelPrimero = almacenesDelMismoAlmacen[0].sector_id;
      const todosTienenMismoSector = almacenesDelMismoAlmacen.every(
        (a: StockAlmacen) => a.sector_id === sectorDelPrimero
      );

      if (todosTienenMismoSector && sectorDelPrimero) {
        // console.log(`✨ Auto-completando sector ${sectorDelPrimero} (otros cards tienen el mismo)`);
        setAlmacen(i, 'sector_id', sectorDelPrimero);
      }
    }

    // ✨ Si ya tenemos los sectores (pre-cargados o en caché), no cargar de nuevo
    if (sectoresOptions[almacenId]) {
      // console.log(`✅ Sectores ya en caché para almacén ${almacenId}:`, sectoresOptions[almacenId]);
      return;
    }

    // Cargar sectores del almacén si no están pre-cargados
    // console.log(`⏳ Cargando sectores desde API para almacén ${almacenId}...`);
    setLoadingSectores(prev => ({ ...prev, [almacenId]: true }));
    try {
      const response = await fetch(`/api/almacenes/${almacenId}/sectores`);
      if (response.ok) {
        const result = await response.json();
        // console.log(`✅ Sectores cargados del API para almacén ${almacenId}:`, result);
        const options = result.data?.map((s: any) => ({
          value: s.id,
          label: s.nombre,
          descripcion: s.descripcion,
          es_generico: s.es_generico,
          stock_minimo: s.stock_minimo,
          stock_maximo: s.stock_maximo,
        })) || [];
        // console.log(`📦 Opciones formateadas:`, options);
        setSectoresOptions(prev => ({ ...prev, [almacenId]: options }));
      }
    } catch (error) {
      console.error('❌ Error cargando sectores:', error);
    } finally {
      setLoadingSectores(prev => ({ ...prev, [almacenId]: false }));
    }
  };

  return (
    <div className="space-x-3">
      {/* <div className="text-sm font-semibold text-foreground mb-1">Paso 3: Ajustes de almacén, sector y stock</div>
      <div className="text-xs text-muted-foreground mb-3">Complete información por almacén: seleccione un sector (opcional), defina stock, número de lote y fecha de vencimiento.
        <span className="block mt-1">💡 Tip: Los sectores se cargan automáticamente al seleccionar un almacén. Si gestionas lotes constantemente, usa el control de inventario.</span>
      </div> */}
      <div>
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Almacenes y Sectores</Label>
          <Button type="button" size="sm" onClick={() => addAlmacen()} variant="outline" aria-label="Agregar almacén">Añadir almacén</Button>
        </div>
        {(data.almacenes || []).length === 0 && (
          <div className="text-sm text-muted-foreground">No hay entradas. Añada al menos un almacén si desea controlar stock.</div>
        )}
        {(data.almacenes || []).map((a: StockAlmacen, i: number) => (
          <div key={i} className="border rounded bg-card p-3 space-y-3 relative">
            {/* 🔢 Número de secuencia del almacén */}
            <div className="absolute top-2 left-3 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {i + 1}
            </div>
            {/* Fila 1: Almacén y Sector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-4">
              <div>
                <Label className="text-xs font-semibold text-foreground">Almacén *</Label>
                <SearchSelect
                  id={`almacen-select-${i}`}
                  placeholder="Seleccione un almacén"
                  value={a.almacen_id ?? ''}
                  options={almacenesOptions}
                  onChange={(value) => handleAlmacenChange(i, value ? Number(value) : '')}
                  allowClear={true}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-foreground">Sector (Opcional)</Label>
                <SearchSelect
                  id={`sector-select-${i}`}
                  placeholder={loadingSectores[a.almacen_id] ? "Cargando sectores..." : "Seleccione un sector"}
                  value={a.sector_id ?? ''}
                  options={sectoresOptions[a.almacen_id] || []}
                  onChange={(value) => {
                    const sectorId = value ? Number(value) : undefined;
                    console.log(`🏢 Sector seleccionado en fila ${i + 1}:`, sectorId);

                    // ✨ NUEVO: Usar función de sincronización desde form.tsx
                    if (setSectorConSincronizacion) {
                      setSectorConSincronizacion(i, sectorId);
                    } else {
                      // Fallback si la función no existe
                      setAlmacen(i, 'sector_id', sectorId);
                    }
                  }}
                  allowClear={true}
                  disabled={!a.almacen_id || loadingSectores[a.almacen_id]}
                />
              </div>
            </div>

            {/* Fila 2: Lote y Fecha de vencimiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-semibold text-foreground">Lote (Opcional)</Label>
                <Input
                  value={a.lote || ''}
                  onChange={e => setAlmacen(i, 'lote', e.target.value)}
                  placeholder="Código de lote"
                  aria-label={`Lote almacén ${i + 1}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-semibold text-foreground">Fecha de vencimiento</Label>
                  <div className="flex items-center gap-2">
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
                    <Label htmlFor={`has-exp-${i}`} className="text-xs cursor-pointer">Tiene vencimiento</Label>
                  </div>
                </div>
                <Input
                  type="date"
                  value={a.fecha_vencimiento || ''}
                  onChange={e => setAlmacen(i, 'fecha_vencimiento', e.target.value)}
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
              const esValido = totalStock >= (disponible + reservada);
              const hasError = canEditStockQuantities && !esValido;

              return (
                <>
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-2 p-3 rounded border transition-colors ${hasError
                      ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800'
                      : 'bg-muted/50 dark:bg-muted/30 border-border dark:border-border'
                    }`}>
                    <div>
                      <Label className="text-xs font-semibold text-foreground">
                        Cantidad Total
                        {canEditStockQuantities && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
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
                        className={`transition-colors ${canEditStockQuantities
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100'
                            : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50 text-blue-900 dark:text-blue-300 cursor-not-allowed opacity-60'
                          }`}
                        aria-label={`Cantidad total almacén ${i + 1}`}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-foreground">
                        Disponible
                        {canEditStockQuantities && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
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
                        className={`transition-colors ${canEditStockQuantities
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                            : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-300 cursor-not-allowed opacity-60'
                          }`}
                        aria-label={`Cantidad disponible almacén ${i + 1}`}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-foreground">
                        Reservada
                        {canEditStockQuantities && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
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
                        className={`transition-colors ${canEditStockQuantities
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
                            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-300 cursor-not-allowed opacity-60'
                          }`}
                        aria-label={`Cantidad reservada almacén ${i + 1}`}
                      />
                    </div>
                  </div>

                  {/* ⚠️ Mensaje de validación */}
                  {hasError && (
                    <div className="bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded p-2 text-xs text-red-700 dark:text-red-300">
                      ⚠️ Advertencia: La cantidad total ({totalStock.toFixed(2)}) debe ser mayor o igual a disponible ({disponible.toFixed(2)}) + reservada ({reservada.toFixed(2)}) = {(disponible + reservada).toFixed(2)}
                    </div>
                  )}

                  {/* 💡 Información para usuarios con permiso */}
                  {canEditStockQuantities && !hasError && (
                    <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded p-2 text-xs text-blue-700 dark:text-blue-300">
                      ✅ Puedes editar las cantidades. Los valores se validarán al guardar el producto.
                    </div>
                  )}
                </>
              );
            })()}

          </div>
        ))}

        {/* ✨ RESUMEN TOTAL DE TODOS LOS ALMACENES */}
        {(data.almacenes || []).length > 0 && (() => {
          const totalGeneral = {
            cantidad: 0,
            disponible: 0,
            reservada: 0,
          };

          (data.almacenes || []).forEach((a: StockAlmacen) => {
            totalGeneral.cantidad += Number(a.stock ?? 0);
            totalGeneral.disponible += Number(a.cantidad_disponible ?? 0);
            totalGeneral.reservada += Number(a.cantidad_reservada ?? 0);
          });

          return (
            <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-4 mt-4">
              <div className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                📊 Resumen Total de Stock
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Total General */}
                <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                  <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">💙 Total General</div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalGeneral.cantidad.toFixed(2)}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">unidades en stock</div>
                </div>

                {/* Total Disponible */}
                <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-md p-3">
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">💚 Total Disponible</div>
                  <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{totalGeneral.disponible.toFixed(2)}</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">listo para usar</div>
                </div>

                {/* Total Reservada */}
                <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">🟠 Total Reservada</div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{totalGeneral.reservada.toFixed(2)}</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">comprometido</div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-700">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  📦 <span className="font-semibold">{(data.almacenes || []).length}</span> almacén{(data.almacenes || []).length !== 1 ? 'es' : ''} configurado{(data.almacenes || []).length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
