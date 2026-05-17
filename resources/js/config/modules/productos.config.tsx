// Configuration: Productos module configuration
import React, { useState } from 'react';
import type { ModuleConfig } from '@/domain/entities/generic';
import type { Producto, ProductoFormData } from '@/domain/entities/productos';
import { Package } from 'lucide-react';
import { useAuth } from '@/application/hooks/use-auth';

const currency = (n?: number | null) => {
  if (n === undefined || n === null) return '-';
  try {
    return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 }).format(n);
  } catch {
    return n.toFixed(2);
  }
};

// ✅ NUEVO: Componente para celda de precio de costo con validación de permiso
const PrecioCostoCell: React.FC<{ entity: Producto }> = ({ entity }) => {
  const { can } = useAuth();

  // Si no tiene permiso, no mostrar nada
  if (!can('ver_precio_costo')) {
    return (
      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-900/40 border-2 border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">🔒 Restringido</span>
      </span>
    );
  }

  // Extraer precio de costo del array precios
  const preciosArray = (entity as any).precios || [];
  const precioCosto = preciosArray.find((pr: any) =>
    pr.nombre?.toLowerCase().includes('costo') || pr.tipo_precio_id === 1
  )?.monto || 0;

  return precioCosto > 0 ? (
    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/40 border-2 border-blue-200 dark:border-blue-700">
      <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-200">{currency(precioCosto)}</span>
    </span>
  ) : (
    <span className="text-xs text-gray-400 dark:text-gray-600">—</span>
  );
};

// ✅ Componente de tarjeta de producto (puede usar hooks)
const ProductCard: React.FC<{
  p: Producto;
  precioCosto: number;
  precioVenta: number;
  onEdit: (p: Producto) => void;
  onDelete: (p: Producto) => void;
  puedeEditar?: boolean;
  puedeEliminar?: boolean;
}> = ({ p, precioCosto, precioVenta, onEdit, onDelete, puedeEditar = true, puedeEliminar = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { can } = useAuth(); // ✅ Obtener permisos

  return (
    <div className="group relative flex flex-col border border-border bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        type="button"
        onClick={() => {
          console.log(`🖼️ [ProductCard] Click en imagen - Producto ${p.id}, puedeEditar: ${puedeEditar}`);
          puedeEditar ? onEdit(p) : null;
        }}
        disabled={!puedeEditar}
        className={`aspect-[4/3] w-full bg-secondary/40 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-secondary/60 transition-colors ${!puedeEditar ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={puedeEditar ? "Click para editar producto" : "No tienes permiso para editar"}
      >
        {p.perfil?.url ? (
          <img src={p.perfil.url} alt={p.nombre} loading="lazy" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="text-muted-foreground text-xs italic">Sin imagen - Click para editar</div>
        )}
      </button>
      <span className="absolute top-2 left-2 bg-blue-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">#{p.id}</span>
      <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
        {p.activo ? (
          <span className="bg-emerald-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Activo</span>
        ) : (
          <span className="bg-red-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Inactivo</span>
        )}
        {p.visible_app ? (
          <span className="bg-green-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span>👁️</span>
            <span>Visible</span>
          </span>
        ) : (
          <span className="bg-gray-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span>🚫</span>
            <span>Oculto</span>
          </span>
        )}
      </div>
      <div className="p-2 flex flex-col gap-1">
        <div className="space-y-0.5">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">{p.nombre}</h3>
          <div className="flex flex-wrap gap-1 text-[10px] font-medium text-muted-foreground">
            {!p.visible_app && (
              <span className="bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200 px-1.5 py-0.5 rounded font-semibold inline-flex items-center gap-1">
                <span>🚫</span>
                <span>Oculto en App</span>
              </span>
            )}
            {p.sku && <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 px-1.5 py-0.5 rounded font-mono font-semibold">{p.sku}</span>}
            {p.marca?.nombre && <span className="bg-secondary px-1.5 py-0.5 rounded">{p.marca.nombre}</span>}
            {p.categoria?.nombre && <span className="bg-secondary px-1.5 py-0.5 rounded">{p.categoria.nombre}</span>}
          </div>
        </div>
        <div className="flex items-end justify-between mt-auto gap-2">
          <div className="text-xs text-muted-foreground space-y-1 flex-1">
            <div className={`grid ${can('ver_precio_costo') ? 'grid-cols-2' : 'grid-cols-1'} gap-12 mb-2`}>
              <div>
                <span className="block text-[9px] uppercase tracking-wide text-green-600 dark:text-green-400 font-semibold">Venta</span>
                <span className="font-bold text-xs text-green-700 dark:text-green-200">{currency(precioVenta)}</span>
              </div>
              {/* ✅ NUEVO: Ocultar precio base si no tiene permiso */}
              {can('ver_precio_costo') && (
                <div>
                  <span className="block text-[9px] uppercase tracking-wide text-purple-600 dark:text-purple-400 font-semibold">Costo</span>
                  <span className="font-bold text-xs text-purple-700 dark:text-purple-200">{currency(p.precio_base)}</span>
                </div>
              )}
            </div>

            {p.es_combo ? (
              <div>
                <span className="block text-[10px] uppercase tracking-wide">Capacidad</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200">
                  <Package size={12} />
                  {(p as any).capacidad ?? 0} combos
                </span>
              </div>
            ) : (
              <>
                <div>
                  <span className="block text-[10px] uppercase tracking-wide">Stock Disponible</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${((p as any).stock_disponible_calc ?? 0) === 0 ? 'bg-red-100 text-red-700' : ((p as any).stock_disponible_calc ?? 0) < (p.stock_minimo ?? 0) ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {((p as any).stock_disponible_calc ?? 0)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Desktop: Botones de acciones visibles */}
          {(puedeEditar || puedeEliminar) && (
            <div className="hidden md:flex flex-col gap-1">
              <a
                href={`/codigos-barra?producto_id=${p.id}`}
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded p-1.5 text-xs font-medium transition-colors"
                title="Ver códigos de barras"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </a>
              {puedeEditar && (
                <button
                  onClick={() => onEdit(p)}
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded p-1.5 text-xs font-medium transition-colors"
                  title="Editar producto"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
              )}
              {puedeEliminar && (
                <button
                  onClick={() => onDelete(p)}
                  className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded p-1.5 text-xs font-medium transition-colors"
                  title="Eliminar producto"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
            </div>
          )}

          {/* Mobile: Menú popup con 3 puntos - Solo si tiene permisos */}
          {(puedeEditar || puedeEliminar) && (
            <div className="md:hidden relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white rounded p-1.5 text-xs font-medium"
                title="Más opciones"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-0.9 2-2s-0.9-2-2-2-2 0.9-2 2 0.9 2 2 2zm0 2c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2zm0 6c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2z" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <a
                    href={`/codigos-barra?producto_id=${p.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 border-b border-gray-100 dark:border-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Códigos
                  </a>
                  {puedeEditar && (
                    <button
                      onClick={() => {
                        onEdit(p);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-gray-100 dark:border-gray-700"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Editar
                    </button>
                  )}
                  {puedeEliminar && (
                    <button
                      onClick={() => {
                        onDelete(p);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Borrar
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const productosConfig: ModuleConfig<Producto, ProductoFormData> = {
  // Module identification
  moduleName: 'productos',
  singularName: 'producto',
  pluralName: 'productos',

  // Display configuration
  displayName: 'Productos',
  description: 'Gestiona el catálogo de productos',

  // Table configuration
  tableColumns: [
    { key: 'id', label: 'ID', type: 'number', sortable: true },
    {
      key: 'perfil',
      label: 'Imagen',
      type: 'custom',
      // no sortable
      render: (value, entity) =>
        value && value.url ? (
          <img
            src={value.url}
            alt={entity.nombre}
            className="w-14 h-14 object-cover rounded-lg shadow-sm border-2 border-border bg-white ring-2 ring-transparent hover:ring-blue-400/50 transition-all"
            loading="lazy"
          />
        ) : (
          <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-secondary/50 border border-border">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ),
    },
    { key: 'nombre', label: 'Nombre', type: 'text', sortable: true },
    {
      key: 'sku',
      label: 'SKU',
      type: 'custom',
      sortable: true,
      render: (value) => value ? (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 font-mono text-xs font-semibold border border-indigo-200 dark:border-indigo-700">
          {value}
        </span>
      ) : (
        <span className="text-muted-foreground/40 italic text-xs">—</span>
      )
    },
    {
      key: 'codigosBarra',
      label: 'Códigos',
      type: 'custom',
      sortable: false,
      render: (value, entity) => {
        // Usar codigosBarra primero, luego codigos como fallback
        let codigos: any[] = [];

        // Intentar obtener codigosBarra
        if (Array.isArray(value) && value.length > 0) {
          codigos = value;
        }
        // Si no, intentar obtener codigos
        else if (Array.isArray((entity as any)?.codigos)) {
          codigos = (entity as any).codigos;
        }
        // Legacy: si es string
        else if (typeof value === 'string' && value) {
          codigos = [{ codigo: value, es_principal: true }];
        }

        if (!codigos || codigos.length === 0) {
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-200 text-xs font-semibold border border-amber-200 dark:border-amber-700">
              ⚠️ Sin códigos
            </span>
          );
        }

        return (
          <div className="flex flex-wrap gap-1.5">
            {codigos.map((cb: any, idx: number) => (
              <span
                key={`codigo-${idx}-${cb.id || cb.codigo}`}
                className={`inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs font-semibold border transition-colors ${cb.es_principal
                  ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700 hover:bg-green-200'
                  : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700 hover:bg-blue-200'
                  }`}
                title={`${cb.es_principal ? 'Principal' : 'Secundario'} - Tipo: ${cb.tipo || 'N/A'}`}
              >
                {cb.es_principal && <span className="mr-1">★</span>}
                {cb.codigo}
              </span>
            ))}
          </div>
        );
      }
    },
    { key: 'marca', label: 'Marca', type: 'text' },
    { key: 'categoria', label: 'Categoría', type: 'text' },
    { key: 'proveedor', label: 'Proveedor', type: 'text' },
    {
      key: 'precio_costo',
      label: 'Precio Costo',
      type: 'custom',
      sortable: true,
      // ✅ NUEVO: Usar componente con validación de permiso
      render: (v, entity) => <PrecioCostoCell entity={entity} />
    },
    {
      key: 'precio_venta',
      label: 'Precio Venta',
      type: 'custom',
      sortable: true,
      render: (v, entity) => {
        // Extraer precio de venta del array precios
        const preciosArray = (entity as any).precios || [];
        const precioVenta = preciosArray.find((pr: any) =>
          (pr.nombre?.toLowerCase().includes('venta') && !pr.nombre?.toLowerCase().includes('costo')) || pr.tipo_precio_id === 5
        )?.monto || 0;

        console.log('💳 [Tabla Productos] Precio Venta - Producto:', {
          nombre: (entity as any).nombre,
          precioVenta,
          preciosArray: preciosArray.map((p: any) => ({
            nombre: p.nombre,
            tipo_precio_id: p.tipo_precio_id,
            monto: p.monto
          }))
        });

        return precioVenta > 0 ? (
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 border-2 border-green-200 dark:border-green-700">
            <span className="font-mono text-sm font-bold text-green-700 dark:text-green-200">{currency(precioVenta)}</span>
          </span>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-600">—</span>
        );
      }
    },
    /* {
      key: 'precio_base',
      label: 'Precio Base',
      type: 'custom',
      sortable: true,
      render: v => v && v > 0 ? (
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/40 dark:to-pink-900/40 border-2 border-purple-200 dark:border-purple-700">
          <span className="font-mono text-sm font-bold text-purple-700 dark:text-purple-200">{currency(v)}</span>
        </span>
      ) : (
        <span className="text-xs text-gray-400 dark:text-gray-600">—</span>
      )
    }, */
    {
      key: 'stock_disponible_calc',
      label: 'Stock Disponible',
      type: 'custom',
      sortable: true,
      render: (value, entity) => {
        const stockDisponible = value ?? 0;
        const stockTotal = (entity as any).stock_total_calc ?? 0;
        const stockMin = entity.stock_minimo ?? 5;
        const stockReservado = stockTotal - stockDisponible;

        let badgeClasses = '';
        let icon = '';
        let text = '';

        if (stockDisponible === 0) {
          badgeClasses = 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/40 border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-200';
          icon = '🚫';
          text = 'Agotado';
        } else if (stockDisponible < stockMin) {
          badgeClasses = 'bg-gradient-to-r from-orange-50 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 border-2 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-200';
          icon = '⚠️';
          text = 'Bajo';
        } else {
          badgeClasses = 'bg-gradient-to-r from-emerald-50 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-200';
          icon = '✓';
          text = 'OK';
        }

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm ${badgeClasses}`}>
                <span>{icon}</span>
                <span className="font-mono">{stockDisponible}</span>
                <span className="text-[10px] font-semibold opacity-70">({text})</span>
              </span>
            </div>
            {stockTotal > 0 && (
              <div className="text-[10px] text-muted-foreground px-3">
                <span>Total: {stockTotal}</span>
                {stockReservado > 0 && <span className="ml-2 text-amber-600 dark:text-amber-400">Reservado: {stockReservado}</span>}
              </div>
            )}
          </div>
        );
      }
    },
    /* {
      key: 'capacidad',
      label: 'Capacidad',
      type: 'custom',
      sortable: false,
      render: (value, entity) => {
        const esComboCampo = (entity as any).es_combo;
        const capacidad = (entity as any).capacidad;

        if (!esComboCampo || !capacidad) {
          return (
            <span className="text-xs text-gray-400 dark:text-gray-600">—</span>
          );
        }

        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <Package size={14} className="text-blue-600 dark:text-blue-400" />
            <div className="flex flex-col">
              <span className="font-semibold text-blue-700 dark:text-blue-200">{capacidad}</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-300 leading-none">combos</span>
            </div>
          </div>
        );
      }
    }, */
    { key: 'activo', label: 'Estado', type: 'boolean' },
    {
      key: 'visible_app',
      label: 'Visible en App',
      type: 'custom',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm border transition-colors ${value
          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700'
          : 'bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700'
          }`}>
          <span className="text-lg">{value ? '👁️' : '🚫'}</span>
          <span>{value ? 'Visible' : 'Oculto'}</span>
        </span>
      )
    },
    /* {
      key: 'historial_precios',
      label: 'Historial',
      type: 'custom',
      hidden: true,
      render: (value, entity, openHistorialModal) => (
        <button
          type="button"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 text-xs font-semibold border border-blue-200 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
          onClick={e => {
            e.stopPropagation();
            if (openHistorialModal) openHistorialModal(entity);
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Ver historial
        </button>
      ),
    }, */
  ],

  // Form configuration
  formFields: [
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el nombre del producto',
      validation: { maxLength: 255 }
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Ingrese una descripción opcional'
    },
    {
      key: 'categoria_id',
      label: 'Categoría',
      type: 'select',
      placeholder: 'Seleccione una categoría'
    },
    {
      key: 'marca_id',
      label: 'Marca',
      type: 'select',
      placeholder: 'Seleccione una marca'
    },
    {
      key: 'proveedor_id',
      label: 'Proveedor',
      type: 'select',
      placeholder: 'Seleccione un proveedor'
    },
    {
      key: 'peso',
      label: 'Peso',
      type: 'number',
      placeholder: 'Peso del producto'
    },
    {
      key: 'unidad_medida_id',
      label: 'Unidad de medida',
      type: 'select',
      placeholder: 'Seleccione una unidad'
    },
    {
      key: 'fecha_vencimiento',
      label: 'Fecha de vencimiento',
      type: 'date'
    },
    {
      key: 'activo',
      label: 'Producto activo',
      type: 'boolean',
      defaultValue: true, // 🆕 Por defecto activo al crear
      hidden: true, // 🆕 Oculto en el formulario
    }
  ],

  // Search configuration (prioritized by order: ID > SKU > Códigos de barras > Nombre)
  searchableFields: ['id', 'sku', 'codigo_barras', 'nombre', 'descripcion'],
  searchPlaceholder: 'Buscar por ID, SKU, código de barras o nombre...',

  // Modern Index filters configuration
  indexFilters: {
    filters: [
      {
        key: 'categoria_id',
        label: 'Categoría',
        type: 'select' as const,
        placeholder: 'Todas las categorías',
        extraDataKey: 'categorias',
        width: 'md' as const
      },
      {
        key: 'marca_id',
        label: 'Marca',
        type: 'select' as const,
        placeholder: 'Todas las marcas',
        extraDataKey: 'marcas',
        width: 'md' as const
      },
      {
        key: 'proveedor_id',
        label: 'Proveedor',
        type: 'select' as const,
        placeholder: 'Todos los proveedores',
        extraDataKey: 'proveedores',
        width: 'md' as const
      },
      {
        key: 'activo',
        label: 'Estado',
        type: 'boolean' as const,
        placeholder: 'Todos los estados',
        width: 'sm' as const
      },
      {
        key: 'stock_minimo',
        label: 'Stock mínimo',
        type: 'number' as const,
        placeholder: 'Cantidad mínima',
        width: 'sm' as const
      },
      {
        key: 'sin_precio',
        label: 'Sin precio',
        type: 'boolean' as const,
        placeholder: 'Mostrar todos',
        width: 'sm' as const
      },
      {
        key: 'visible_app',
        label: 'Visible en App',
        type: 'boolean' as const,
        placeholder: 'Todos los estados',
        width: 'sm' as const
      }
    ],
    sortOptions: [
      { value: 'id', label: 'ID' },
      { value: 'nombre', label: 'Nombre' },
      { value: 'precio_base', label: 'Precio' },
      { value: 'stock_total', label: 'Stock' },
      { value: 'created_at', label: 'Fecha creación' },
      { value: 'updated_at', label: 'Última actualización' }
    ],
    defaultSort: { field: 'nombre', direction: 'asc' as const },
    layout: 'grid' as const
  },

  // Legacy support (deprecated)
  showIndexFilters: true,

  // Enhanced visualization
  enableCardView: true,
  cardRenderer: (p, { onEdit, onDelete }, extraData) => {
    // 📊 Extraer precio de costo y venta del array precios
    const preciosArray = (p as any).precios || [];
    const precioCosto = preciosArray.find((pr: any) =>
      pr.nombre?.toLowerCase().includes('costo') || pr.tipo_precio_id === 1
    )?.monto || 0;
    const precioVenta = preciosArray.find((pr: any) =>
      pr.nombre?.toLowerCase().includes('venta') && !pr.nombre?.toLowerCase().includes('costo') || pr.tipo_precio_id === 5
    )?.monto || 0;

    // ✅ Usar el componente ProductCard con permisos
    const puedeEditar = (extraData as any)?.puedeEditar ?? true;
    const puedeEliminar = (extraData as any)?.puedeEliminar ?? true;

    // 📊 LOG: Ver permisos en el cardRenderer
    console.log(`📇 [CardRenderer] Producto ${p.id} - ${p.nombre}:`, {
      puedeEditar,
      puedeEliminar,
      extraDataKeys: Object.keys((extraData as any) || {}),
      extraData
    });

    return (
      <ProductCard
        p={p}
        precioCosto={precioCosto}
        precioVenta={precioVenta}
        onEdit={onEdit}
        onDelete={onDelete}
        puedeEditar={puedeEditar}
        puedeEliminar={puedeEliminar}
      />
    );
  }
};
