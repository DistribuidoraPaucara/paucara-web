import { useState } from 'react';
import { CargoCSVProducto } from '@/domain/entities/productos-masivos';

interface ModalRevertirProps {
  cargo: CargoCSVProducto;
  cargando?: boolean;
  onConfirmar?: (motivo: string) => void;
  onCancelar?: () => void;
}

export default function ModalRevertir({
  cargo,
  cargando = false,
  onConfirmar,
  onCancelar,
}: ModalRevertirProps) {
  const [motivo, setMotivo] = useState('');
  const [aceptaConservacion, setAceptaConservacion] = useState(false);

  const handleConfirmar = () => {
    if (!aceptaConservacion) {
      alert('Debes aceptar que entiendes las consecuencias de la reversión');
      return;
    }
    onConfirmar?.(motivo);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Encabezado */}
        <div className="bg-red-50 border-b border-red-200 px-6 py-4">
          <h2 className="text-lg font-bold text-red-900">⚠️ Revertir Carga</h2>
          <p className="text-sm text-red-700 mt-1">ID: {cargo.id}</p>
        </div>

        {/* Contenido */}
        <div className="px-6 py-4 space-y-4">
          {/* Advertencia */}
          <div className="bg-red-100 border border-red-300 rounded p-3">
            <p className="text-sm font-medium text-red-900">⚠️ Esta acción no se puede deshacer</p>
            <p className="text-xs text-red-700 mt-2">
              Se eliminarán los <span className="font-bold">{cargo.cantidad_validas}</span> productos
              creados/actualizados.
            </p>
          </div>

          {/* Detalles */}
          <div className="bg-gray-50 rounded p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Detalles de la carga:</h3>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>
                <span className="text-gray-600">Archivo: </span>
                <span className="font-medium">{cargo.nombre_archivo}</span>
              </li>
              <li>
                <span className="text-gray-600">Productos: </span>
                <span className="font-medium">{cargo.cantidad_validas}</span>
              </li>
              <li>
                <span className="text-gray-600">Errores: </span>
                <span className="font-medium">{cargo.cantidad_errores}</span>
              </li>
            </ul>
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (opcional)</label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Explica por qué se revierte esta carga..."
              disabled={cargando}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              rows={3}
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={aceptaConservacion}
              onChange={(e) => setAceptaConservacion(e.target.checked)}
              id="acepta-reversión"
              disabled={cargando}
              className="mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="acepta-reversión" className="text-sm text-gray-700">
              Entiendo que se <span className="font-bold text-red-600">eliminarán</span> todos los productos
              importados en esta carga
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="bg-gray-50 border-t px-6 py-3 flex gap-3 justify-end">
          <button
            type="button"
            disabled={cargando}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-white font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={cargando || !aceptaConservacion}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirmar}
          >
            {cargando ? 'Revirtiendo...' : 'Confirmar reversión'}
          </button>
        </div>
      </div>
    </div>
  );
}
