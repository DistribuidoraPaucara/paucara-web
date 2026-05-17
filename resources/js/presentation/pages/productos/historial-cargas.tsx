import { useState, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import HistorialTabla from './components/historial-tabla';
import DetalleCarga from './components/detalle-carga';
import ModalRevertir from './components/modal-revertir';
import { productosCSVService } from '@/infrastructure/services/productosCSV.service';
import { CargoCSVProducto } from '@/domain/entities/productos-masivos';

export default function HistorialCargas() {
  // Estado
  const [cargas, setCargas] = useState<CargoCSVProducto[]>([]);
  const [cargaSeleccionada, setCargaSeleccionada] = useState<CargoCSVProducto | null>(null);
  const [cargaParaRevertir, setCargaParaRevertir] = useState<CargoCSVProducto | null>(null);
  const [cargando, setCargando] = useState(false);
  const [paginaActual] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState<'success' | 'error'>('success');

  // Métodos
  const obtenerCargas = useCallback(async () => {
    try {
      setCargando(true);
      const resultado = await productosCSVService.obtenerHistorialCargas(paginaActual, filtroEstado);
      setCargas(resultado.data);
    } catch (error: any) {
      setTipo('error');
      setMensaje(error.message || 'Error obteniendo cargas');
    } finally {
      setCargando(false);
    }
  }, [paginaActual, filtroEstado]);

  const verDetalle = async (cargo: CargoCSVProducto) => {
    try {
      setCargando(true);
      const detalles = await productosCSVService.obtenerDetalleCarga(cargo.id);
      setCargaSeleccionada(detalles.data);
    } catch (error: any) {
      setTipo('error');
      setMensaje(error.message || 'Error obteniendo detalles');
    } finally {
      setCargando(false);
    }
  };

  const abrirModalRevertir = (cargo: CargoCSVProducto) => {
    setCargaParaRevertir(cargo);
  };

  const confirmarRevertir = async (motivo: string) => {
    if (!cargaParaRevertir) return;

    try {
      setCargando(true);
      const resultado = await productosCSVService.revertirCarga(cargaParaRevertir.id, motivo);
      setTipo('success');
      setMensaje('Carga revertida exitosamente');
      setCargaParaRevertir(null);
      setCargaSeleccionada(null);
      await obtenerCargas();
    } catch (error: any) {
      setTipo('error');
      setMensaje(error.message || 'Error revirtiendo carga');
    } finally {
      setCargando(false);
    }
  };

  const cambiarFiltro = (nuevoFiltro: string) => {
    setFiltroEstado(nuevoFiltro);
    obtenerCargas();
  };

  // Montar
  useEffect(() => {
    obtenerCargas();
  }, [obtenerCargas]);

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Productos', href: '/productos' },
      { title: 'Historial de Cargas', href: '#' }
    ]}>
      <Head title="Historial de Cargas de Productos" />

      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Historial de Cargas</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Consulta todas las importaciones de productos</p>
          </div>
          <Link
            href="/productos/carga-masiva"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            + Nueva carga
          </Link>
        </div>
        {/* Mensaje */}
        {mensaje && (
          <div
            className={`mb-4 p-4 rounded-lg border ${
              tipo === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <p className="font-medium">{mensaje}</p>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Filtrar por estado:</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filtroEstado === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => cambiarFiltro('')}
            >
              Todos
            </button>
            {['procesado', 'pendiente', 'cancelado', 'revertido'].map((estado) => (
              <button
                key={estado}
                type="button"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filtroEstado === estado ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => cambiarFiltro(estado)}
              >
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow">
          {cargas.length > 0 ? (
            <HistorialTabla cargas={cargas} cargando={cargando} onVerDetalle={verDetalle} onRevertir={abrirModalRevertir} />
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg font-medium">No hay cargas registradas</p>
              <p className="text-sm mt-1">Comienza cargando tu primer archivo de productos</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      {cargaSeleccionada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
          onClick={() => setCargaSeleccionada(null)}
        >
          <div
            className="bg-white rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <DetalleCarga
                cargo={cargaSeleccionada}
                onCerrar={() => setCargaSeleccionada(null)}
                onRevertir={abrirModalRevertir}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de revertir */}
      {cargaParaRevertir && (
        <ModalRevertir
          cargo={cargaParaRevertir}
          cargando={cargando}
          onConfirmar={confirmarRevertir}
          onCancelar={() => setCargaParaRevertir(null)}
        />
      )}
    </AppLayout>
  );
}
