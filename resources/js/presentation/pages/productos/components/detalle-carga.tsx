import { CargoCSVProducto } from '@/domain/entities/productos-masivos';

interface DetalleCargaProps {
  cargo: CargoCSVProducto;
  onCerrar?: () => void;
  onRevertir?: (cargo: CargoCSVProducto) => void;
}

export default function DetalleCarga({ cargo, onCerrar, onRevertir }: DetalleCargaProps) {
  const porcentajeValidez = () => {
    if (cargo.cantidad_filas === 0) return 0;
    return Math.round((cargo.cantidad_validas / cargo.cantidad_filas) * 100);
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{cargo.nombre_archivo}</h2>
          <p className="text-gray-600 mt-1">
            ID: <span className="font-mono font-bold">{cargo.id}</span> • {formatFecha(cargo.created_at)}
          </p>
        </div>
        <button type="button" className="text-gray-400 hover:text-gray-600" onClick={onCerrar}>
          ✕
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-2xl font-bold text-blue-600">{cargo.cantidad_filas}</p>
          <p className="text-sm text-gray-600">Total filas</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-2xl font-bold text-green-600">{cargo.cantidad_validas}</p>
          <p className="text-sm text-gray-600">Válidas</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-2xl font-bold text-red-600">{cargo.cantidad_errores}</p>
          <p className="text-sm text-gray-600">Errores</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-2xl font-bold text-purple-600">{porcentajeValidez()}%</p>
          <p className="text-sm text-gray-600">Validez</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 font-medium">Distribución</span>
          <span className="text-gray-600">{porcentajeValidez()}% válido</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden flex">
          <div className="bg-green-600" style={{ width: `${porcentajeValidez()}%` }} />
          <div className="bg-red-600" style={{ width: `${100 - porcentajeValidez()}%` }} />
        </div>
      </div>

      {/* Información del usuario */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Información de carga</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Cargado por:</p>
            <p className="font-medium text-gray-900">{cargo.usuario?.nombre || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="font-medium text-gray-900">{cargo.usuario?.email || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Estado:</p>
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                cargo.estado === 'procesado'
                  ? 'bg-green-100 text-green-800'
                  : cargo.estado === 'revertido'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {cargo.estado}
            </span>
          </div>
          {cargo.estado === 'revertido' && (
            <div>
              <p className="text-gray-600">Revertido por:</p>
              <p className="font-medium text-gray-900">{cargo.usuarioReversion?.nombre || '-'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Errores si los hay */}
      {cargo.errores_json && cargo.errores_json.length > 0 && (
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <h3 className="font-semibold text-red-900 mb-2">Errores detectados:</h3>
          <ul className="space-y-1 text-sm text-red-700">
            {cargo.errores_json.slice(0, 10).map((error: any, idx: number) => (
              <li key={idx} className="flex gap-2">
                <span>•</span>
                <span>
                  Fila {error.fila}: {error.mensaje}
                </span>
              </li>
            ))}
          </ul>
          {cargo.errores_json.length > 10 && (
            <p className="text-sm text-red-700 mt-2 font-medium">
              ...y {cargo.errores_json.length - 10} errores más
            </p>
          )}
        </div>
      )}

      {/* Cambios realizados */}
      {cargo.cambios_json && cargo.cambios_json.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Productos afectados:</h3>
          <div className="space-y-2">
            {cargo.cambios_json.slice(0, 10).map((cambio: any, idx: number) => (
              <div key={idx} className="bg-white rounded p-2 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{cambio.producto_nombre}</p>
                    <p className="text-xs text-gray-500">Fila {cambio.fila}</p>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      cambio.accion === 'creado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {cambio.accion}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <p>
                    Stock anterior: <span className="font-medium">{cambio.stock_anterior}</span> → Nuevo:{' '}
                    <span className="font-medium">{cambio.stock_nuevo}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          {cargo.cambios_json.length > 10 && (
            <p className="text-sm text-blue-700 mt-2 font-medium">
              ...y {cargo.cambios_json.length - 10} productos más
            </p>
          )}
        </div>
      )}

      {/* Información de reversión */}
      {cargo.estado === 'revertido' && (
        <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
          <h3 className="font-semibold text-gray-900 mb-2">Reversión</h3>
          <div className="text-sm space-y-2">
            <p>
              <span className="text-gray-600">Fecha: </span>
              <span className="font-medium">{formatFecha(cargo.fecha_reversion!)}</span>
            </p>
            {cargo.motivo_reversion && (
              <p>
                <span className="text-gray-600">Motivo: </span>
                <span className="font-medium">{cargo.motivo_reversion}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
          onClick={onCerrar}
        >
          Cerrar
        </button>
        {cargo.estado === 'procesado' && (
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
            onClick={() => onRevertir?.(cargo)}
          >
            Revertir carga
          </button>
        )}
      </div>
    </div>
  );
}
