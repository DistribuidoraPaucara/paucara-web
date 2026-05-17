import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import DetalleCargoCSV from './DetalleCargoCSV';

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

interface PaginationData {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export default function HistorialCargasCSV() {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });
  const [cargando, setCargando] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [busqueda, setBusqueda] = useState('');
  const [cargoSeleccionado, setCargoSeleccionado] = useState<Cargo | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const cargarHistorial = async (page = 1) => {
    setCargando(true);
    try {
      const params: any = { page, per_page: 15 };
      if (filtroEstado) {
        params.estado = filtroEstado;
      }

      const response = await axios.get('/api/inventario/cargos-csv', { params });

      if (response.data.success) {
        setCargos(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      toast.error('Error al cargar el historial');
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, [filtroEstado]);

  const handleVerDetalles = async (cargo: Cargo) => {
    setCargoSeleccionado(cargo);
    setMostrarDetalles(true);
  };

  const handleCerrarDetalles = () => {
    setMostrarDetalles(false);
    setTimeout(() => {
      setCargoSeleccionado(null);
      cargarHistorial(pagination.current_page);
    }, 300);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'procesado':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pendiente':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'revertido':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'cancelado':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      procesado: 'Procesado',
      pendiente: 'Pendiente',
      revertido: 'Revertido',
      cancelado: 'Cancelado',
    };
    return labels[estado] || estado;
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar archivo
            </label>
            <input
              type="text"
              placeholder="Nombre del archivo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="procesado">Procesado</option>
              <option value="pendiente">Pendiente</option>
              <option value="revertido">Revertido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => cargarHistorial(1)}
              disabled={cargando}
              className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualizar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de cargos */}
      {cargos.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Archivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Filas
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Válidas
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Errores
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Procesadas
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {cargos.map((cargo) => (
                  <tr key={cargo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {cargo.archivo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {cargo.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {cargo.usuario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-400">
                      {cargo.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        {cargo.validas}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {cargo.errores > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                          {cargo.errores}
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-400">
                      {cargo.procesadas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(cargo.estado)}`}>
                        {getEstadoLabel(cargo.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => handleVerDetalles(cargo)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md font-medium transition-colors text-xs"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {pagination.last_page > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  disabled={pagination.current_page === 1 || cargando}
                  onClick={() => cargarHistorial(pagination.current_page - 1)}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  disabled={pagination.current_page === pagination.last_page || cargando}
                  onClick={() => cargarHistorial(pagination.current_page + 1)}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando <span className="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> de{' '}
                    <span className="font-medium">{pagination.total}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        disabled={cargando}
                        onClick={() => cargarHistorial(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.current_page === page
                            ? 'z-10 bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-300'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">No hay cargas registradas</p>
        </div>
      )}

      {/* Modal de detalles */}
      {mostrarDetalles && cargoSeleccionado && (
        <DetalleCargoCSV cargo={cargoSeleccionado} onCerrar={handleCerrarDetalles} />
      )}
    </div>
  );
}
