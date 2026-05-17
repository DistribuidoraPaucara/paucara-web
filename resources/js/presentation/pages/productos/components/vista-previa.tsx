import { useState, useEffect } from 'react';
import { FilaProductoValidada } from '@/domain/entities/productos-masivos';
import SearchSelect, { type SelectOption } from '@/presentation/components/ui/search-select';

/**
 * Componente para mostrar información de producto existente
 */
function ProductoExistenteInfo({
  fila,
  filaIndex,
  onCambiarAccion,
  cargando,
}: {
  fila: FilaProductoValidada;
  filaIndex: number;
  onCambiarAccion?: (filaIndex: number, accion: 'sumar' | 'reemplazar') => void;
  cargando?: boolean;
}) {
  const [detallesExpandido, setDetallesExpandido] = useState(false);
  const producto = fila.producto_existente;

  // Si no hay producto existente, no mostrar nada
  if (!producto) return null;

  const accionActual = fila.accion_stock || 'sumar';
  const stockAnterior = producto.stock_total || 0;
  const cantidad = fila.cantidad || 0;
  const previewSuma = (producto.preview_suma ?? 0);
  const previewReemplazo = (producto.preview_reemplazo ?? cantidad);

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 space-y-3 mt-4">
      {/* Header: Producto Existente + SKU */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block px-2 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded text-xs font-bold">
            ✓ PRODUCTO EXISTENTE
          </span>
          {producto.sku && (
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              SKU: {producto.sku}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({producto.criterio_deteccion === 'codigo_barra' ? '📦 Código' : '🏷️ Nombre'})
          </span>
        </div>
      </div>

      {/* Stock Info: Actual + Nuevo */}
      <div className="bg-white dark:bg-gray-800 rounded p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">Stock total actual:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{stockAnterior} unidades</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">Cantidad a procesar:</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">{cantidad} unidades</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-700 dark:text-gray-300">Stock resultante:</span>
            <span className="text-blue-700 dark:text-blue-400">
              {accionActual === 'sumar' ? previewSuma : previewReemplazo} unidades
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {accionActual === 'sumar'
              ? `${stockAnterior} + ${cantidad} = ${previewSuma}`
              : `Reemplazar ${stockAnterior} por ${previewReemplazo}`
            }
          </div>
        </div>
      </div>

      {/* Detalles por Almacén (Expandible) */}
      {producto.detalles_por_almacen && producto.detalles_por_almacen.length > 0 && (
        <div className="border-t border-blue-200 dark:border-blue-700 pt-3">
          <button
            type="button"
            onClick={() => setDetallesExpandido(!detallesExpandido)}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition flex items-center gap-1"
          >
            {detallesExpandido ? '▼' : '▶'} Detalles por almacén ({producto.detalles_por_almacen.length})
          </button>

          {detallesExpandido && (
            <div className="mt-2 space-y-2 pl-4 border-l-2 border-blue-300 dark:border-blue-600">
              {producto.detalles_por_almacen.map((detalle, idx) => (
                <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                  <div className="font-medium">{detalle.almacen}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    • Cantidad: {detalle.cantidad}
                    {detalle.lotes > 0 && ` • ${detalle.lotes} lote(s)`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Radio buttons: Sumar vs Reemplazar */}
      <div className="border-t border-blue-200 dark:border-blue-700 pt-3 space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Acción con stock:</p>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-800/30 transition">
            <input
              type="radio"
              name={`accion_${filaIndex}`}
              value="sumar"
              checked={accionActual === 'sumar'}
              onChange={() => onCambiarAccion?.(filaIndex, 'sumar')}
              disabled={cargando}
              className="w-4 h-4 accent-green-600"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">Sumar al stock existente</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {stockAnterior} + {cantidad} = {previewSuma} unidades
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-orange-100 dark:hover:bg-orange-800/30 transition">
            <input
              type="radio"
              name={`accion_${filaIndex}`}
              value="reemplazar"
              checked={accionActual === 'reemplazar'}
              onChange={() => onCambiarAccion?.(filaIndex, 'reemplazar')}
              disabled={cargando}
              className="w-4 h-4 accent-orange-600"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">Reemplazar stock existente</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Cambiar de {stockAnterior} a {previewReemplazo} unidades
              </div>
            </div>
          </label>
        </div>

        {/* Advertencia si hay reservas */}
        {producto.stock_almacen_destino !== undefined && producto.stock_almacen_destino > 0 && accionActual === 'reemplazar' && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded p-2 mt-2">
            <p className="text-xs text-orange-700 dark:text-orange-300">
              ⚠️ <strong>Advertencia:</strong> Estás reemplazando stock. Asegúrate de que no hay reservas activas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface VistaPreviewaProductosProps {
  filas: FilaProductoValidada[];
  mostrarErrores?: boolean;
  porcentajeValidez?: number;
  cargando?: boolean;
  onAnalizarErrores?: () => void;
  onConfirmar?: () => void;
  onCancelar?: () => void;
  onEditarFila?: (filaIndex: number, campo: keyof FilaProductoValidada, valor: any) => void;
  onEliminarFila?: (filaIndex: number) => void;
  onCambiarAccionStock?: (filaIndex: number, accion: 'sumar' | 'reemplazar') => void;
  onDetectarSKUsDuplicados?: () => { [sku: string]: FilaProductoValidada[] };
  onUnificarSKUsDuplicados?: () => void;
  categorias?: Array<{ id: number; nombre: string }>;
  marcas?: Array<{ id: number; nombre: string }>;
  unidades?: Array<{ id: number; codigo: string; nombre: string }>;
  almacenes?: Array<{ id: number; nombre: string }>;
}

export default function VistaPreviewaProductos({
  filas,
  mostrarErrores = false,
  porcentajeValidez = 0,
  cargando = false,
  onAnalizarErrores,
  onConfirmar,
  onCancelar,
  onEditarFila,
  onEliminarFila,
  onCambiarAccionStock,
  onDetectarSKUsDuplicados,
  onUnificarSKUsDuplicados,
  categorias = [],
  marcas = [],
  unidades = [],
  almacenes = [],
}: VistaPreviewaProductosProps) {
  const [buscadorSelect, setBuscadorSelect] = useState<{ [key: string]: string }>({});
  const [expandida, setExpandida] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [skusDuplicados, setSkusDuplicados] = useState<{ [sku: string]: FilaProductoValidada[] }>({});

  // Detectar SKUs duplicados automáticamente
  useEffect(() => {
    if (onDetectarSKUsDuplicados) {
      const duplicados = onDetectarSKUsDuplicados();
      setSkusDuplicados(duplicados);
    }
  }, [filas, onDetectarSKUsDuplicados]);

  // Convertir arrays a formato SelectOption
  const categoriasOptions: SelectOption[] = categorias.map(c => ({
    value: c.nombre,
    label: c.nombre,
  }));

  const marcasOptions: SelectOption[] = marcas.map(m => ({
    value: m.nombre,
    label: m.nombre,
  }));

  const unidadesOptions: SelectOption[] = unidades.map(u => ({
    value: u.nombre,
    label: `${u.nombre} (${u.codigo})`,
    description: u.codigo,
  }));

  const almacenesOptions: SelectOption[] = almacenes.map(a => ({
    value: a.id,
    label: a.nombre,
  }));

  // Debug: mostrar datos recibidos en vista-previa
  console.log('📋 Datos recibidos en vista-previa:', {
    categorias: categorias.length,
    marcas: marcas.length,
    unidades: unidades.length,
    almacenes: almacenes.length,
    filas: filas.length,
    categorias_datos: categorias,
    marcas_datos: marcas,
    unidades_datos: unidades,
    almacenes_datos: almacenes,
  });

  // Filtrar filas según búsqueda
  const filasFiltradas = busqueda.trim() === ''
    ? filas
    : filas.filter((fila) => {
        const termino = busqueda.toLowerCase();
        return (
          fila.nombre?.toLowerCase().includes(termino) ||
          fila.codigo_barra?.toLowerCase().includes(termino) ||
          fila.sku?.toLowerCase().includes(termino) ||
          fila.proveedor_nombre?.toLowerCase().includes(termino) ||
          fila.categoria_nombre?.toLowerCase().includes(termino) ||
          fila.marca_nombre?.toLowerCase().includes(termino) ||
          fila.descripcion?.toLowerCase().includes(termino)
        );
      });
  const filasValidas = filas.filter((f) => f.validacion.es_valido).length;
  const filasConErrores = filas.filter((f) => !f.validacion.es_valido).length;

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{filas.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total de filas</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-800">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{filasValidas}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Filas válidas</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{filasConErrores}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Filas con errores</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">Validez</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{porcentajeValidez || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              porcentajeValidez === 100 ? 'bg-green-600 dark:bg-green-500' : porcentajeValidez >= 50 ? 'bg-yellow-600 dark:bg-yellow-500' : 'bg-red-600 dark:bg-red-500'
            }`}
            style={{ width: `${porcentajeValidez || 0}%` }}
          />
        </div>
      </div>

      {/* Alerta de SKUs duplicados */}
      {Object.keys(skusDuplicados).length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-orange-900 dark:text-orange-200 mb-2">
                ⚠️ Se detectaron {Object.keys(skusDuplicados).length} SKUs duplicados
              </h3>
              <div className="space-y-1 text-sm text-orange-800 dark:text-orange-300">
                {Object.entries(skusDuplicados).map(([sku, filasConSKU]) => (
                  <div key={sku} className="flex items-center gap-2">
                    <span className="font-medium">SKU "{sku}":</span>
                    <span>
                      {filasConSKU.length} productos ({filasConSKU.reduce((sum, f) => sum + (f.cantidad || 0), 0)} unidades)
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={onUnificarSKUsDuplicados}
              disabled={cargando}
              className="px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-md hover:bg-orange-700 dark:hover:bg-orange-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap ml-4"
            >
              Unificar SKUs
            </button>
          </div>
          <p className="text-xs text-orange-700 dark:text-orange-400 italic">
            Los productos con el mismo SKU serán agrupados en uno solo, sumando sus cantidades.
          </p>
        </div>
      )}

      {/* Tabla de preview - Editable */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={expandida}
              onChange={(e) => setExpandida(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo edición (tabla expandida)</span>
          </label>

          {/* Buscador */}
          {expandida && (
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="🔍 Buscar producto, código, proveedor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
              {busqueda && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Mostrando {filasFiltradas.length} de {filas.length} filas
                </p>
              )}
            </div>
          )}
        </div>

        {!expandida ? (
          // Vista comprimida
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">#</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Producto</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Cantidad</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Proveedor</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filasFiltradas.map((fila, idx) => (
                  <tr key={fila.fila} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs">
                          {idx + 1}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">{fila.fila}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{fila.nombre}</div>
                      {fila.codigo_barra && <div className="text-xs text-gray-500 dark:text-gray-400">📦 {fila.codigo_barra}</div>}
                    </td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{fila.cantidad}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{fila.proveedor_nombre || '-'}</td>
                    <td className="px-4 py-2 space-y-1">
                      {fila.validacion.es_valido ? (
                        <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                          ✓ Válida
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-medium">
                          ✗ Error
                        </span>
                      )}
                      {fila.producto_existente && (
                        <div>
                          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                            📦 Existente: {fila.producto_existente.stock_total} {fila.accion_stock === 'reemplazar' ? '→ ' + fila.cantidad : '+ ' + fila.cantidad}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Vista editable expandida
          <div className="space-y-3">
            {filasFiltradas.length === 0 ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
                <p className="text-yellow-700 dark:text-yellow-300">
                  No se encontraron productos que coincidan con "{busqueda}"
                </p>
              </div>
            ) : (
              filasFiltradas.map((fila, idx) => {
                const indiceReal = filas.findIndex(f => f.fila === fila.fila);
                return (
              <div key={idx} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{filasFiltradas.length > 1 ? `de ${filasFiltradas.length}` : ''}</span>
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Fila {fila.fila}</span>
                    {fila.validacion.es_valido ? (
                      <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                        ✓ Válida
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-medium">
                        ✗ Error
                      </span>
                    )}
                  </div>
                  {onEliminarFila && (
                    <button
                      type="button"
                      onClick={() => onEliminarFila(indiceReal)}
                      className="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-xs font-medium transition"
                      title="Eliminar fila"
                    >
                      🗑️ Eliminar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Producto *</label>
                    <input
                      type="text"
                      value={fila.nombre}
                      onChange={(e) => onEditarFila?.(indiceReal, 'nombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      disabled={cargando}
                    />
                  </div>

                  {/* Cantidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cantidad *</label>
                    <input
                      type="number"
                      value={fila.cantidad}
                      onChange={(e) => onEditarFila?.(indiceReal, 'cantidad', Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      disabled={cargando}
                    />
                  </div>

                  {/* Almacén */}
                  <div>
                    <SearchSelect
                      label="Almacén *"
                      placeholder="Selecciona un almacén"
                      searchPlaceholder="Buscar almacén..."
                      value={fila.almacen_id || ''}
                      options={almacenesOptions}
                      onChange={(value) => onEditarFila?.(indiceReal, 'almacen_id', value ? Number(value) : null)}
                      disabled={cargando}
                      allowClear={true}
                    />
                    {fila.almacen_nombre && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        📌 Desde CSV: {fila.almacen_nombre}
                      </p>
                    )}
                  </div>

                  {/* Código de barras */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código de barras</label>
                    <input
                      type="text"
                      value={fila.codigo_barra || ''}
                      onChange={(e) => onEditarFila?.(indiceReal, 'codigo_barra', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      disabled={cargando}
                      placeholder="📦"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
                    <input
                      type="text"
                      value={fila.sku || ''}
                      onChange={(e) => onEditarFila?.(indiceReal, 'sku', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      disabled={cargando}
                    />
                  </div>

                  {/* Proveedor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proveedor</label>
                    <input
                      type="text"
                      value={fila.proveedor_nombre || ''}
                      onChange={(e) => onEditarFila?.(indiceReal, 'proveedor_nombre', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      disabled={cargando}
                    />
                  </div>

                  {/* Unidad de medida */}
                  <div>
                    <SearchSelect
                      label="Unidad medida"
                      placeholder="Selecciona una unidad"
                      searchPlaceholder="Buscar unidad..."
                      value={fila.unidad_medida_nombre || ''}
                      options={unidadesOptions}
                      onChange={(value) => onEditarFila?.(indiceReal, 'unidad_medida_nombre', value || undefined)}
                      disabled={cargando}
                      allowClear={true}
                    />
                    {fila.unidad_medida_nombre && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        📌 Desde CSV: {fila.unidad_medida_nombre}
                      </p>
                    )}
                  </div>

                  {/* Precio costo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio costo</label>
                    <input
                      type="number"
                      step="0.01"
                      value={fila.precio_costo || ''}
                      onChange={(e) => onEditarFila?.(indiceReal, 'precio_costo', e.target.value ? Number(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      disabled={cargando}
                    />
                  </div>

                  {/* Precio venta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio venta</label>
                    <input
                      type="number"
                      step="0.01"
                      value={fila.precio_venta || ''}
                      onChange={(e) => onEditarFila?.(indiceReal, 'precio_venta', e.target.value ? Number(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      disabled={cargando}
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <SearchSelect
                      label="Categoría"
                      placeholder="Selecciona una categoría"
                      searchPlaceholder="Buscar categoría..."
                      value={fila.categoria_nombre || ''}
                      options={categoriasOptions}
                      onChange={(value) => onEditarFila?.(indiceReal, 'categoria_nombre', value || undefined)}
                      disabled={cargando}
                      allowClear={true}
                    />
                    {fila.categoria_nombre && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        📌 Desde CSV: {fila.categoria_nombre}
                      </p>
                    )}
                  </div>

                  {/* Marca */}
                  <div>
                    <SearchSelect
                      label="Marca"
                      placeholder="Selecciona una marca"
                      searchPlaceholder="Buscar marca..."
                      value={fila.marca_nombre || ''}
                      options={marcasOptions}
                      onChange={(value) => onEditarFila?.(indiceReal, 'marca_nombre', value || undefined)}
                      disabled={cargando}
                      allowClear={true}
                    />
                    {fila.marca_nombre && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        📌 Desde CSV: {fila.marca_nombre}
                      </p>
                    )}
                  </div>

                  {/* Lote */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lote</label>
                    <input
                      type="text"
                      value={fila.lote || ''}
                      onChange={(e) => onEditarFila?.(indiceReal, 'lote', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      disabled={cargando}
                    />
                  </div>

                  {/* Fecha vencimiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha vencimiento</label>
                    <input
                      type="date"
                      value={fila.fecha_vencimiento || ''}
                      onChange={(e) => onEditarFila?.(indiceReal, 'fecha_vencimiento', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      disabled={cargando}
                    />
                  </div>

                  {/* Descripción */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                    <textarea
                      value={fila.descripcion || ''}
                      onChange={(e) => onEditarFila?.(indiceReal, 'descripcion', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      disabled={cargando}
                      rows={2}
                    />
                  </div>

                  {/* Principio activo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Principio activo</label>
                    <input
                      type="text"
                      value={fila.principio_activo || ''}
                      onChange={(e) => onEditarFila?.(indiceReal, 'principio_activo', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      disabled={cargando}
                      placeholder="Ej: Paracetamol"
                    />
                  </div>

                  {/* Uso de medicación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Uso de medicación</label>
                    <textarea
                      value={fila.uso_de_medicacion || ''}
                      onChange={(e) => onEditarFila?.(indiceReal, 'uso_de_medicacion', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      disabled={cargando}
                      rows={2}
                      placeholder="Ej: Alivio de dolor y fiebre"
                    />
                  </div>
                </div>

                {/* Información de Producto Existente */}
                <ProductoExistenteInfo
                  fila={fila}
                  filaIndex={indiceReal}
                  onCambiarAccion={onCambiarAccionStock}
                  cargando={cargando}
                />
              </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Resumen de registros mostrados */}
      {filasFiltradas.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          Mostrando <span className="font-semibold">{filasFiltradas.length}</span> de <span className="font-semibold">{filas.length}</span> registros
          {busqueda && ` (filtrados por "${busqueda}")`}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition"
          onClick={onCancelar}
          disabled={cargando}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
          onClick={onAnalizarErrores}
          disabled={cargando}
        >
          Analizar Errores
        </button>
        {filasValidas > 0 && (
          <button
            type="button"
            className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            onClick={onConfirmar}
            disabled={cargando || filasValidas === 0}
          >
            Confirmar Carga
          </button>
        )}
      </div>
    </div>
  );
}
