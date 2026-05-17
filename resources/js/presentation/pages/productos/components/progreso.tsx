import { ResultadoProductosMasivos } from '@/domain/entities/productos-masivos';

interface ProgresoProductosProps {
  progreso?: number;
  resultado?: ResultadoProductosMasivos | null;
  cargando?: boolean;
  error?: string;
  onNuevamente?: () => void;
  onIrHistorial?: () => void;
  onIrProductos?: () => void;
}

export default function ProgresoProductos({
  progreso = 0,
  resultado = null,
  cargando = false,
  error,
  onNuevamente,
  onIrHistorial,
  onIrProductos,
}: ProgresoProductosProps) {
  const mostrarResultado = !cargando && resultado;
  const exitoso = resultado?.cantidad_procesados === resultado?.cantidad_total;

  return (
    <div className="space-y-6">
      {cargando && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Procesando carga masiva...</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">Progreso</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{progreso}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-4">⏳ Esto puede tomar unos momentos...</p>
        </div>
      )}

      {mostrarResultado && (
        <div className="space-y-4">
          {exitoso ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">✅</span>
                <h2 className="text-xl font-bold text-green-900 dark:text-green-300">Carga completada exitosamente</h2>
              </div>
              <div className="space-y-2 text-sm text-green-800 dark:text-green-300">
                <p>
                  <span className="font-medium">{resultado!.cantidad_procesados} productos</span> fueron importados
                  exitosamente
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚠️</span>
                <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-300">Carga completada con errores</h2>
              </div>
              <div className="space-y-3 text-sm text-yellow-800 dark:text-yellow-300">
                <div className="flex justify-between">
                  <span>Procesados correctamente:</span>
                  <span className="font-bold">{resultado!.cantidad_procesados}</span>
                </div>
                <div className="flex justify-between">
                  <span>Con errores:</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{resultado!.cantidad_errores}</span>
                </div>
              </div>
            </div>
          )}

          {(resultado?.saltados_detalle && resultado.saltados_detalle.length > 0) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900 dark:text-yellow-300 mb-2">
                ⏭️ Productos saltados ({resultado.saltados_detalle.length}):
              </h3>
              <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-400">
                {resultado.saltados_detalle.slice(0, 10).map((saltado, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="font-medium">Fila {saltado.fila}:</span>
                    <span>{saltado.producto_nombre} - {saltado.motivo}</span>
                  </li>
                ))}
              </ul>
              {resultado.saltados_detalle.length > 10 && (
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-2">
                  ...y {resultado.saltados_detalle.length - 10} más
                </p>
              )}
            </div>
          )}

          {resultado!.cantidad_errores > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="font-bold text-red-900 dark:text-red-300 mb-2">Errores detectados:</h3>
              <ul className="space-y-1 text-sm text-red-800 dark:text-red-400">
                {resultado!.errores.slice(0, 5).map((error, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span>•</span>
                    <span>
                      Fila {error.fila}: {error.mensaje}
                    </span>
                  </li>
                ))}
              </ul>
              {resultado!.cantidad_errores > 5 && (
                <p className="text-sm text-red-700 dark:text-red-400 mt-2">...y {resultado!.cantidad_errores - 5} errores más</p>
              )}
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              📌 ID de carga: <span className="font-mono font-bold">{resultado!.cargo_id}</span>
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-gray-700 dark:text-gray-300 transition"
              onClick={onNuevamente}
            >
              Cargar más productos
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-800 font-medium transition"
              onClick={onIrProductos}
            >
              Ver productos importados
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 font-medium transition"
              onClick={onIrHistorial}
            >
              Ver historial de cargas
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">❌</span>
            <h2 className="text-xl font-bold text-red-900 dark:text-red-300">Error en la carga</h2>
          </div>
          <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-800 font-medium transition"
            onClick={onNuevamente}
          >
            Intentar nuevamente
          </button>
        </div>
      )}
    </div>
  );
}
