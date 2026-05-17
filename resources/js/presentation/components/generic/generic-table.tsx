// Presentation Layer: Generic table component - Enhanced UI (Modernized)
import { Button } from '@/presentation/components/ui/button';
import type { BaseEntity, TableColumn } from '@/domain/entities/generic';
import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import productosService from '@/infrastructure/services/productos.service';
import NotificationService from '@/infrastructure/services/notification.service';
import { Trash2, Pencil, DollarSign, Image, Eye, Package } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/presentation/components/ui/tooltip';

interface ProductoLike extends BaseEntity {
  nombre?: string;
  precios?: { nombre: string; monto: number; tipo_precio_id?: number }[];
  codigos?: { codigo: string; es_principal?: boolean; tipo?: string }[];
  perfil?: { url?: string; file?: File | null } | null;
  galeria?: { id?: number; url?: string; file?: File | null; _delete?: boolean }[];
  historial_precios?: { id?: number; tipo_precio_nombre?: string; fecha_cambio?: string; valor_anterior?: number; valor_nuevo?: number; porcentaje_cambio?: number; motivo?: string; usuario?: string }[];
}

interface FiltersState { [k: string]: string | number | undefined | null; }

interface GenericTableProps<T extends BaseEntity> {
  entities: T[];
  columns: TableColumn<T>[];
  onEdit: (entity: T) => void;
  onDelete: (entity: T) => void;
  entityName: string;
  isLoading?: boolean;
  puedeEditar?: boolean;
  puedeEliminar?: boolean;
}

/**
 * Obtiene el valor de una propiedad anidada usando notación de punto
 * Ejemplo: getNestedValue({ user: { name: 'John' } }, 'user.name') => 'John'
 */
function getNestedValue<T>(obj: T, path: string): unknown {
  const keys = path.split('.');
  let value: any = obj;

  for (const key of keys) {
    if (value === null || value === undefined) {
      return undefined;
    }
    value = value[key];
  }

  return value;
}

export default function GenericTable<T extends BaseEntity>({
  entities,
  columns,
  onEdit,
  onDelete,
  entityName,
  isLoading = false,
  puedeEditar = true,
  puedeEliminar = true
}: GenericTableProps<T>) {
  const [historialModal, setHistorialModal] = useState<{ entity: ProductoLike } | null>(null);
  const [quickPrecioModal, setQuickPrecioModal] = useState<{ entity: ProductoLike } | null>(null);
  const [quickImagenModal, setQuickImagenModal] = useState<{ entity: ProductoLike } | null>(null);
  const [quickViewModal, setQuickViewModal] = useState<{ entity: T } | null>(null);

  const openHistorialModal = (entity: ProductoLike) => setHistorialModal({ entity });
  const closeHistorialModal = () => setHistorialModal(null);
  const closeQuickPrecioModal = () => setQuickPrecioModal(null);
  const closeQuickImagenModal = () => setQuickImagenModal(null);
  const openQuickViewModal = (entity: T) => setQuickViewModal({ entity });
  const closeQuickViewModal = () => setQuickViewModal(null);

  const openQuickPrecioModal = (entity: T | ProductoLike) => {
    const prod = entity as ProductoLike;
    if (prod.precios || prod.codigos) {
      const clone: ProductoLike = JSON.parse(JSON.stringify({
        precios: prod.precios || [],
        codigos: prod.codigos || [],
        id: prod.id,
        nombre: prod.nombre
      }));
      setQuickPrecioModal({ entity: clone });
    }
  };
  const openQuickImagenModal = (entity: T | ProductoLike) => {
    const prod = entity as ProductoLike;
    if (prod.perfil || prod.galeria) {
      setQuickImagenModal({ entity: { id: prod.id, nombre: prod.nombre, perfil: prod.perfil || null, galeria: prod.galeria || [] } });
    }
  };

  const saveQuickPreciosCodigos = () => {
    if (!quickPrecioModal?.entity?.id) return;
    const { entity } = quickPrecioModal;
    const formData = new FormData();
    formData.append('_method', 'PUT');
    (entity.precios || []).forEach((p, i) => {
      if (!p.nombre?.trim()) return;
      formData.append(`precios[${i}][nombre]`, p.nombre);
      formData.append(`precios[${i}][monto]`, String(p.monto ?? 0));
      if (p.tipo_precio_id != null) formData.append(`precios[${i}][tipo_precio_id]`, String(p.tipo_precio_id));
    });
    (entity.codigos || []).forEach((c, i) => {
      if (!c.codigo?.trim()) return;
      formData.append(`codigos[${i}][codigo]`, c.codigo.trim());
      if (c.es_principal) formData.append(`codigos[${i}][es_principal]`, '1');
      if (c.tipo) formData.append(`codigos[${i}][tipo]`, c.tipo);
    });
    const toastId = NotificationService.loading('Guardando cambios de precios y códigos...');
    router.post(productosService.updateUrl(entity.id), formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => { NotificationService.dismiss(toastId); NotificationService.success('Precios y códigos actualizados'); closeQuickPrecioModal(); router.reload({ only: ['productos'] }); },
      onError: () => { NotificationService.dismiss(toastId); NotificationService.error('Error al actualizar precios/códigos'); }
    });
  };

  const saveQuickImagenes = () => {
    if (!quickImagenModal?.entity?.id) return;
    const { entity } = quickImagenModal;
    const formData = new FormData();
    formData.append('_method', 'PUT');
    if (entity.perfil?.file instanceof File) formData.append('perfil', entity.perfil.file);
    (entity.galeria || []).forEach((img, i) => {
      if (img._delete && img.id) { formData.append(`galeria_eliminar[${i}]`, String(img.id)); }
      else if (img.file instanceof File) { formData.append(`galeria[${i}]`, img.file); }
    });
    const toastId = NotificationService.loading('Guardando imágenes...');
    router.post(productosService.updateUrl(entity.id), formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => { NotificationService.dismiss(toastId); NotificationService.success('Imágenes actualizadas'); closeQuickImagenModal(); router.reload({ only: ['productos'] }); },
      onError: () => { NotificationService.dismiss(toastId); NotificationService.error('Error al actualizar imágenes'); }
    });
  };

  const { props } = usePage<{ props?: { filters?: FiltersState } }>() as unknown as { props: { filters?: FiltersState } };
  const currentFilters: FiltersState = props?.filters || {};
  const orderBy = currentFilters.order_by || (currentFilters as Record<string, unknown>).orderBy || undefined;
  const orderDir = (currentFilters.order_dir || (currentFilters as Record<string, unknown>).orderDir || 'desc') as 'asc' | 'desc';

  const toggleSort = (col: TableColumn<T>) => {
    if (!col.sortable) return;
    const newDir: 'asc' | 'desc' = orderBy === col.key ? (orderDir === 'asc' ? 'desc' : 'asc') : 'asc';
    const raw: Record<string, unknown> = { ...currentFilters, order_by: String(col.key), order_dir: newDir };
    const query: Record<string, string | number> = {};
    Object.entries(raw).forEach(([k, v]) => { if (v != null) query[k] = typeof v === 'number' ? v : String(v); });
    router.get(window.location.pathname, query, { preserveState: true, preserveScroll: true });
  };

  if (!entities.length) {
    return (
      <div className="text-center py-16 px-4">
        <div className="mx-auto w-20 h-20 mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No hay {entityName}s registrados</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Comienza agregando tu primer {entityName} para verlo aparecer aquí.
        </p>
      </div>
    );
  }

  const renderCellValue = (column: TableColumn<T>, entity: T) => {
    // Usar getNestedValue para soportar propiedades anidadas como 'localidad.nombre'
    const value = getNestedValue(entity, column.key as string);
    if (column.render) {
      if (column.key === 'historial_precios') return column.render(value as never, entity, openHistorialModal as unknown as (e: T) => void);
      return column.render(value as never, entity);
    }
    switch (column.type) {
      case 'boolean':
        return (
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all ${value
              ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-2 border-emerald-300 dark:from-emerald-900/40 dark:to-emerald-800/40 dark:text-emerald-200 dark:border-emerald-600'
              : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-2 border-red-300 dark:from-red-900/40 dark:to-red-800/40 dark:text-red-200 dark:border-red-600'
            }`}>
            <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${value ? 'bg-emerald-500 shadow-emerald-400/50' : 'bg-red-500 shadow-red-400/50'} shadow-md`}></span>
            {value ? 'Activo' : 'Inactivo'}
          </span>
        );
      case 'date':
        return value ? (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-foreground">
              {new Date(String(value)).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/60 italic">Sin fecha</span>
        );
      case 'number':
        const numValue = typeof value === 'number' ? value : (typeof value === 'string' && value !== '' ? parseFloat(value) : null);
        return numValue !== null && !isNaN(numValue) ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            {numValue.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        );
      default:
        if (value && typeof value === 'object' && 'nombre' in (value as Record<string, unknown>)) {
          return <span className="font-medium text-foreground">{(value as { nombre: string }).nombre || '-'}</span>;
        }
        if (value && typeof value === 'object' && 'codigo' in (value as Record<string, unknown>) && 'nombre' in (value as Record<string, unknown>)) {
          const v = value as { codigo: string; nombre: string };
          return (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 px-2 py-1 rounded border border-blue-200 dark:border-blue-700 font-semibold">
                {v.codigo}
              </span>
              <span className="font-medium text-foreground">{v.nombre}</span>
            </div>
          );
        }
        return value ? (
          <span className="text-foreground">{String(value)}</span>
        ) : (
          <span className="text-muted-foreground/40 italic text-sm">—</span>
        );
    }
  };

  // Skeleton Loader Component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {columns.map((column, idx) => (
        <td key={String(column.key)} className="px-4 py-3.5">
          {idx === 0 ? (
            <div className="h-6 w-12 bg-muted rounded-full"></div>
          ) : (
            <div className="h-4 bg-muted rounded" style={{ width: `${60 + Math.random() * 40}%` }}></div>
          )}
        </td>
      ))}
      <td className="px-4 py-3.5">
        <div className="flex justify-end gap-1">
          <div className="h-8 w-8 bg-muted rounded"></div>
          <div className="h-8 w-8 bg-muted rounded"></div>
          <div className="h-8 w-8 bg-muted rounded"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <TooltipProvider>
      <div className="relative rounded-lg border border-border overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto max-h-[calc(100vh-300px)]">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/80 border-b-2 border-border shadow-sm">
              <tr>
                {columns.map(column => (
                  <th
                    key={String(column.key)}
                    onClick={() => toggleSort(column)}
                    className={`px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-muted select-none transition-colors' : ''
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {column.label}
                      {column.sortable && (
                        <span className={`text-xs transition-all ${orderBy === column.key ? 'text-blue-600 dark:text-blue-400 opacity-100' : 'opacity-40 hover:opacity-70'}`}>
                          {orderBy === column.key ? (orderDir === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-foreground uppercase tracking-wider sticky right-0 bg-muted/95 backdrop-blur">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                // Show skeleton loaders when loading
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : (
                entities.map((entity, index) => (
                  <tr
                    key={entity.id}
                    className={`transition-colors hover:bg-accent/50 ${
                      index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                    }`}
                  >
                    {columns.map(column => (
                      <td key={String(column.key)} className="px-4 py-3.5">
                        {column.key === 'id' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-200 dark:border-blue-700">
                            #{entity.id}
                          </span>
                        ) : (
                          <div className={`${column.key === columns[1]?.key ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                            {renderCellValue(column, entity)}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3.5 sticky right-0 bg-inherit">
                      <div className="flex justify-end items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openQuickViewModal(entity)}
                              className="h-8 w-8 p-0 hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-300 transition-all"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Vista rápida</p>
                          </TooltipContent>
                        </Tooltip>

                        {puedeEditar && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onEdit(entity)}
                                disabled={isLoading}
                                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/40 dark:hover:text-blue-300 transition-all"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Editar {entityName}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {'precios' in (entity as unknown as Record<string, unknown>) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openQuickPrecioModal(entity)}
                                className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-900/40 dark:hover:text-amber-300 transition-all"
                              >
                                <DollarSign className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Editar precios y códigos</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {'perfil' in (entity as unknown as Record<string, unknown>) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openQuickImagenModal(entity)}
                                className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/40 dark:hover:text-purple-300 transition-all"
                              >
                                <Image className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Editar imágenes</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {puedeEliminar && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onDelete(entity)}
                                disabled={isLoading}
                                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/40 dark:hover:text-red-300 transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Eliminar {entityName}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {historialModal?.entity?.historial_precios && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-card rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={closeHistorialModal} aria-label="Cerrar">✕</button>
            <h2 className="text-lg font-bold mb-4">Historial de precios de {historialModal.entity.nombre}</h2>
            {historialModal.entity.historial_precios.length === 0 ? <div className="text-muted-foreground italic">Sin historial de precios.</div> : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {historialModal.entity.historial_precios.map((h, i) => (
                  <div key={h.id || i} className="border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-blue-700 dark:text-blue-300">{h.tipo_precio_nombre}</span>
                      <span className="text-xs text-muted-foreground">{h.fecha_cambio}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs mt-1">
                      <span className="bg-gray-100 dark:bg-secondary px-2 py-0.5 rounded">Anterior: <b>{h.valor_anterior}</b></span>
                      <span className="bg-gray-100 dark:bg-secondary px-2 py-0.5 rounded">Nuevo: <b>{h.valor_nuevo}</b></span>
                      <span className="bg-gray-100 dark:bg-secondary px-2 py-0.5 rounded">% Cambio: <b>{h.porcentaje_cambio}</b></span>
                      <span className="bg-gray-100 dark:bg-secondary px-2 py-0.5 rounded">Motivo: <b>{h.motivo}</b></span>
                      <span className="bg-gray-100 dark:bg-secondary px-2 py-0.5 rounded">Usuario: <b>{h.usuario}</b></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {quickPrecioModal?.entity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-card rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={closeQuickPrecioModal} aria-label="Cerrar">✕</button>
            <h2 className="text-lg font-bold mb-4">Precios y Códigos - {quickPrecioModal.entity.nombre}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-2">Precios</h3>
                <div className="space-y-2">
                  {(quickPrecioModal.entity.precios || []).map((p, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input className="flex-1 border rounded px-2 py-1 text-sm bg-background" value={p.nombre} placeholder="Nombre" onChange={e => { const next = [...(quickPrecioModal.entity.precios || [])]; next[i].nombre = e.target.value; setQuickPrecioModal(m => m ? { entity: { ...m.entity, precios: next } } : m); }} />
                      <input type="number" step="0.01" className="w-32 border rounded px-2 py-1 text-sm text-right font-mono" value={p.monto} onChange={e => { const next = [...(quickPrecioModal.entity.precios || [])]; next[i].monto = parseFloat(e.target.value || '0'); setQuickPrecioModal(m => m ? { entity: { ...m.entity, precios: next } } : m); }} />
                      <button className="text-red-600 text-xs hover:underline" onClick={() => { const next = [...(quickPrecioModal.entity.precios || [])]; next.splice(i, 1); setQuickPrecioModal(m => m ? { entity: { ...m.entity, precios: next } } : m); }}>Quitar</button>
                    </div>
                  ))}
                  <button type="button" className="text-blue-600 text-xs hover:underline" onClick={() => setQuickPrecioModal(m => m ? { entity: { ...m.entity, precios: [...(m.entity.precios || []), { nombre: '', monto: 0 }] } } : m)}>+ Agregar precio</button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">Códigos de Barra</h3>
                <div className="space-y-2">
                  {(quickPrecioModal.entity.codigos || []).map((c, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input className="flex-1 border rounded px-2 py-1 text-sm font-mono" value={c.codigo} placeholder="Código de barras" onChange={e => { const next = [...(quickPrecioModal.entity.codigos || [])]; next[i].codigo = e.target.value; setQuickPrecioModal(m => m ? { entity: { ...m.entity, codigos: next } } : m); }} />
                      <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!c.es_principal} onChange={e => { const next = [...(quickPrecioModal.entity.codigos || [])].map((x, idx) => ({ ...x, es_principal: idx === i ? e.target.checked : false })); setQuickPrecioModal(m => m ? { entity: { ...m.entity, codigos: next } } : m); }} /> Principal</label>
                      <button className="text-red-600 text-xs hover:underline" onClick={() => { const next = [...(quickPrecioModal.entity.codigos || [])]; next.splice(i, 1); setQuickPrecioModal(m => m ? { entity: { ...m.entity, codigos: next } } : m); }}>Quitar</button>
                    </div>
                  ))}
                  <button type="button" className="text-blue-600 text-xs hover:underline" onClick={() => setQuickPrecioModal(m => m ? { entity: { ...m.entity, codigos: [...(m.entity.codigos || []), { codigo: '', es_principal: false }] } } : m)}>+ Agregar código</button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={closeQuickPrecioModal}>Cancelar</Button>
                <Button size="sm" onClick={saveQuickPreciosCodigos} className="bg-amber-600 hover:bg-amber-700 text-white">Guardar</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quickImagenModal?.entity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-card rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={closeQuickImagenModal} aria-label="Cerrar">✕</button>
            <h2 className="text-lg font-bold mb-4">Imágenes - {quickImagenModal.entity.nombre}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-2">Imagen principal</h3>
                <div className="flex items-start gap-4">
                  {quickImagenModal.entity.perfil?.url ? <img src={quickImagenModal.entity.perfil.url} alt="Perfil" className="w-24 h-24 object-cover rounded border" /> : <div className="w-24 h-24 flex items-center justify-center border rounded text-xs text-muted-foreground">Sin imagen</div>}
                  <div className="space-y-2 text-xs">
                    <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) { setQuickImagenModal(m => m ? { entity: { ...m.entity, perfil: { ...(m.entity.perfil || {}), file, url: URL.createObjectURL(file) } } } : m); } }} />
                    {quickImagenModal.entity.perfil?.url && <button type="button" className="text-red-600 hover:underline" onClick={() => setQuickImagenModal(m => m ? { entity: { ...m.entity, perfil: null } } : m)}>Quitar</button>}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">Galería</h3>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {(quickImagenModal.entity.galeria || []).map((img, i) => (
                    <div key={i} className="relative group border rounded overflow-hidden">
                      {img.url ? <img src={img.url} alt={`Img ${i + 1}`} className="object-cover w-full h-24" /> : img.file ? <img src={URL.createObjectURL(img.file)} alt={`New ${i + 1}`} className="object-cover w-full h-24" /> : <div className="w-full h-24 flex items-center justify-center text-[10px] text-muted-foreground">Nueva</div>}
                      <button type="button" onClick={() => { const next = [...(quickImagenModal.entity.galeria || [])]; if (next[i].id) { next[i]._delete = !next[i]._delete; } else { next.splice(i, 1); } setQuickImagenModal(m => m ? { entity: { ...m.entity, galeria: next } } : m); }} className={`absolute top-1 right-1 text-white text-xs px-1 rounded bg-red-600/80 hover:bg-red-700 ${img._delete ? 'line-through' : ''}`}>X</button>
                    </div>
                  ))}
                </div>
                <input type="file" accept="image/*" multiple className="text-xs" onChange={e => { const files = Array.from(e.target.files || []); if (files.length) { const next = [...(quickImagenModal.entity.galeria || []), ...files.map(f => ({ file: f }))]; setQuickImagenModal(m => m ? { entity: { ...m.entity, galeria: next } } : m); } }} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={closeQuickImagenModal}>Cancelar</Button>
                <Button size="sm" onClick={saveQuickImagenes} className="bg-purple-600 hover:bg-purple-700 text-white">Guardar</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quickViewModal?.entity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-border">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-800 dark:to-blue-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Vista Rápida</h2>
                  <p className="text-xs text-white/80">Información detallada del {entityName}</p>
                </div>
              </div>
              <button
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
                onClick={closeQuickViewModal}
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {columns.map((column) => {
                  // Usar getNestedValue para soportar propiedades anidadas
                  const value = getNestedValue(quickViewModal.entity, column.key as string);

                  // Skip rendering if value is undefined or null or if it's the historial_precios column
                  if (value === undefined || value === null || column.key === 'historial_precios') return null;

                  return (
                    <div key={String(column.key)} className={`space-y-2 ${column.key === 'perfil' ? 'md:col-span-2' : ''}`}>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        {column.key === 'id' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                        )}
                        {column.key === 'perfil' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                        {column.label}
                      </label>
                      <div className={`bg-secondary/30 border border-border rounded-lg p-3 ${column.key === 'perfil' ? 'flex justify-center' : ''}`}>
                        {renderCellValue(column, quickViewModal.entity)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-muted/50 px-6 py-4 border-t border-border flex justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={closeQuickViewModal}
                className="hover:bg-secondary"
              >
                Cerrar
              </Button>
              {puedeEditar && (
                <Button
                  size="sm"
                  onClick={() => {
                    closeQuickViewModal();
                    onEdit(quickViewModal.entity);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
