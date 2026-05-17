import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface Cargo {
  id: number;
  archivo: string;
  fecha: string;
  usuario: string;
  total: number;
  validas: number;
  errores: number;
  procesadas: number;
  estado: string;
  puede_revertir: boolean;
}

interface DetalleCargoCSVProps {
  cargo: Cargo;
  onCerrar: () => void;
}

interface Movimiento {
  id: number;
  numero_documento: string;
  producto: string;
  sku: string;
  cantidad: number;
  tipo: string;
  almacen: string;
  observacion: string;
  fecha: string;
}

export default function DetalleCargoCSV({ cargo, onCerrar }: DetalleCargoCSVProps) {
  const [detalle, setDetalle] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [revertiendo, setRevertiendo] = useState(false);
  const [mostrarFormularioRevertir, setMostrarFormularioRevertir] = useState(false);
  const [motivoReversion, setMotivoReversion] = useState('');

  useEffect(() => {
    cargarDetalle();
  }, []);

  const cargarDetalle = async () => {
    setCargando(true);
    try {
      const response = await axios.get(`/api/inventario/cargos-csv/${cargo.id}`);

      if (response.data.success) {
        setDetalle(response.data);
      }
    } catch (error: any) {
      toast.error('Error al cargar los detalles');
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleRevertir = async () => {
    if (!motivoReversion.trim()) {
      toast.error('Por favor ingresa un motivo para la reversión');
      return;
    }

    setRevertiendo(true);
    try {
      const response = await axios.post(`/api/inventario/cargos-csv/${cargo.id}/revertir`, {
        motivo: motivoReversion,
      });

      if (response.data.success) {
        toast.success(response.data.mensaje);
        setMostrarFormularioRevertir(false);
        setMotivoReversion('');

        // Recargar detalles
        setTimeout(() => {
          cargarDetalle();
        }, 1000);
      }
    } catch (error: any) {
      const mensaje = error.response?.data?.message || error.message || 'Error al revertir el cargo';
      toast.error(mensaje);
      console.error('Error:', error);
    } finally {
      setRevertiendo(false);
    }
  };

  if (cargando) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <svg className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!detalle) {
    return null;
  }

  const getTipoMovimientoLabel = (tipo: string): string => {
    const labels: Record<string, string> = {
      'entrada_ajuste': 'Entrada (Ajuste)',
      'salida_ajuste': 'Salida (Ajuste)',
      'entrada_merma': 'Entrada (Merma)',
      'salida_merma': 'Salida (Merma)',
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detalles del Cargo</h2>
          <button
            onClick={onCerrar}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Información general */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Archivo</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{detalle.cargo.archivo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fecha</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{detalle.cargo.fecha}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Usuario</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{detalle.cargo.usuario}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    detalle.cargo.estado === 'procesado'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : detalle.cargo.estado === 'revertido'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {detalle.cargo.estado.charAt(0).toUpperCase() + detalle.cargo.estado.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Resumen de números */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de filas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{detalle.cargo.total}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded p-4">
              <p className="text-sm text-green-700 dark:text-green-300">Filas válidas</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{detalle.cargo.validas}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded p-4">
              <p className="text-sm text-red-700 dark:text-red-300">Con errores</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{detalle.cargo.errores}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">Procesadas</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{detalle.cargo.procesadas}</p>
            </div>
          </div>

          {/* Movimientos */}
          {detalle.movimientos && detalle.movimientos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Movimientos de Inventario ({detalle.movimientos.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-semibold">Documento</th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-semibold">Producto</th>
                      <th className="px-4 py-2 text-center text-gray-700 dark:text-gray-300 font-semibold">Cantidad</th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-semibold">Tipo</th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-semibold">Almacén</th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-semibold">Observación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {detalle.movimientos.map((movimiento: Movimiento, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-2 text-gray-900 dark:text-gray-100 font-medium">{movimiento.numero_documento}</td>
                        <td className="px-4 py-2">
                          <div>
                            <p className="text-gray-900 dark:text-gray-100">{movimiento.producto}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{movimiento.sku}</p>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center text-gray-900 dark:text-gray-100 font-semibold">{movimiento.cantidad}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400 text-xs">{getTipoMovimientoLabel(movimiento.tipo)}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{movimiento.almacen}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400 max-w-xs truncate">{movimiento.observacion || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Errores si existen */}
          {detalle.errores && detalle.errores.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">Filas con errores</h4>
              <ul className="space-y-1">
                {detalle.errores.map((error: any, idx: number) => (
                  <li key={idx} className="text-sm text-red-800 dark:text-red-300">
                    <strong>Fila {error.fila}:</strong> {error.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer con botones */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onCerrar}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md font-medium transition-colors"
          >
            Cerrar
          </button>

          {detalle.puede_revertir && !mostrarFormularioRevertir && (
            <button
              onClick={() => setMostrarFormularioRevertir(true)}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors"
            >
              <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Revertir Cargo
            </button>
          )}

          {mostrarFormularioRevertir && (
            <div className="flex items-center gap-2">
              <textarea
                value={motivoReversion}
                onChange={(e) => setMotivoReversion(e.target.value)}
                placeholder="Motivo de la reversión (máx 500 caracteres)..."
                maxLength={500}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleRevertir}
                disabled={revertiendo}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {revertiendo ? 'Revirtiendo...' : 'Confirmar'}
              </button>
              <button
                onClick={() => {
                  setMostrarFormularioRevertir(false);
                  setMotivoReversion('');
                }}
                disabled={revertiendo}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
