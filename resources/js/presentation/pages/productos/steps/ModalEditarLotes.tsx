import { useState, useEffect } from 'react';
import { X, Edit2, Trash2, Plus } from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';

interface StockProducto {
  id: number;
  almacen_id: number;
  almacen_nombre?: string;
  cantidad: number;
  cantidad_disponible: number;
  cantidad_reservada: number;
  lote: string | null;
  fecha_vencimiento: string | null;
}

interface ModalEditarLotesProps {
  isOpen: boolean;
  onClose: () => void;
  productoId: number;
  productoNombre: string;
  almacenesOptions: Array<{ value: number | string; label: string }>;
}

export default function ModalEditarLotes({
  isOpen,
  onClose,
  productoId,
  productoNombre,
  almacenesOptions,
}: ModalEditarLotesProps) {
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<StockProducto[]>([]);
  const [editando, setEditando] = useState<Record<number, boolean>>({});
  const [lotes, setLotes] = useState<Record<number, string>>({});
  const [fechas, setFechas] = useState<Record<number, string>>({});

  // Cargar stocks cuando se abre el modal
  useEffect(() => {
    if (isOpen && productoId) {
      cargarStocks();
    }
  }, [isOpen, productoId]);

  const cargarStocks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/productos/${productoId}/stocks`);
      if (response.ok) {
        const data = await response.json();
        const stocksConAlmacen = data.data.map((stock: StockProducto) => ({
          ...stock,
          almacen_nombre: almacenesOptions.find(a => a.value === stock.almacen_id)?.label || 'N/A',
        }));
        setStocks(stocksConAlmacen);

        // Inicializar estado de edición
        const lotesInit: Record<number, string> = {};
        const fechasInit: Record<number, string> = {};
        stocksConAlmacen.forEach((s: StockProducto) => {
          lotesInit[s.id] = s.lote || '';
          fechasInit[s.id] = s.fecha_vencimiento ? s.fecha_vencimiento.split('T')[0] : '';
        });
        setLotes(lotesInit);
        setFechas(fechasInit);
      } else {
        NotificationService.error('Error al cargar stocks');
      }
    } catch (error) {
      console.error('Error:', error);
      NotificationService.error('Error al cargar stocks');
    } finally {
      setLoading(false);
    }
  };

  const guardarCambios = async (stockId: number) => {
    try {
      const response = await fetch(`/api/productos/${productoId}/stocks/${stockId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify({
          lote: lotes[stockId] || null,
          fecha_vencimiento: fechas[stockId] || null,
        }),
      });

      if (response.ok) {
        NotificationService.success('Lote actualizado correctamente');
        setEditando(prev => ({ ...prev, [stockId]: false }));
        await cargarStocks();
      } else {
        NotificationService.error('Error al actualizar lote');
      }
    } catch (error) {
      console.error('Error:', error);
      NotificationService.error('Error al actualizar lote');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📦 Editar Lotes</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{productoNombre}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="text-center text-gray-500">Cargando stocks...</div>
          ) : stocks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No hay stocks registrados para este producto
            </div>
          ) : (
            <div className="space-y-3">
              {stocks.map((stock) => (
                <div
                  key={stock.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Almacén */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Almacén
                      </label>
                      <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-gray-900 dark:text-white">
                        {stock.almacen_nombre}
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Stock
                      </label>
                      <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm">
                        <div className="text-blue-900 dark:text-blue-100 font-semibold">
                          {stock.cantidad.toFixed(2)}
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                          Disp: {stock.cantidad_disponible.toFixed(2)} | Res: {stock.cantidad_reservada.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Lote */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Lote
                      </label>
                      {editando[stock.id] ? (
                        <input
                          type="text"
                          value={lotes[stock.id]}
                          onChange={(e) => setLotes(prev => ({ ...prev, [stock.id]: e.target.value }))}
                          placeholder="Código de lote"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-gray-900 dark:text-white font-mono">
                          {lotes[stock.id] || '—'}
                        </div>
                      )}
                    </div>

                    {/* Fecha Vencimiento */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Vencimiento
                      </label>
                      {editando[stock.id] ? (
                        <input
                          type="date"
                          value={fechas[stock.id]}
                          onChange={(e) => setFechas(prev => ({ ...prev, [stock.id]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-gray-900 dark:text-white">
                          {fechas[stock.id] || '—'}
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="md:col-span-4 flex gap-2 justify-end">
                      {editando[stock.id] ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              guardarCambios(stock.id);
                            }}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition"
                          >
                            ✓ Guardar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditando(prev => ({ ...prev, [stock.id]: false }));
                              setLotes(prev => ({ ...prev, [stock.id]: stock.lote || '' }));
                              setFechas(prev => ({
                                ...prev,
                                [stock.id]: stock.fecha_vencimiento ? stock.fecha_vencimiento.split('T')[0] : '',
                              }));
                            }}
                            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium rounded-md transition"
                          >
                            ✕ Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditando(prev => ({ ...prev, [stock.id]: true }))}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
