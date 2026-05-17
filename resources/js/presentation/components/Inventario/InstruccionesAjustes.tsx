import React, { useState } from 'react';

interface InstruccionesAjustesProps {
  tiposAjuste: any[];
  almacenes: any[];
}

export default function InstruccionesAjustes({
  tiposAjuste,
  almacenes,
}: InstruccionesAjustesProps) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="space-y-4">
      {/* Botón para expandir/colapsar */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full inline-flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        <span className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold text-blue-900 dark:text-blue-200">
            📖 Instrucciones de Uso - Formatos CSV, XLSX, ODS
          </span>
        </span>
        <svg
          className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform ${expandido ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Contenido expandible */}
      {expandido && (
        <div className="space-y-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {/* Columna Producto */}
          <div>
            <h4 className="flex items-center font-semibold text-gray-900 dark:text-white mb-3">
              <span className="text-2xl mr-2">📦</span>
              COLUMNA "producto"
            </h4>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <p>Ingresa el <strong>SKU</strong>, <strong>nombre</strong> o <strong>código</strong> del producto</p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 font-mono text-xs">
                <p className="text-blue-600 dark:text-blue-400">Ejemplos válidos:</p>
                <p>PRD001, "Café Molido", CAR-050, codigo123</p>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                ✓ La búsqueda es flexible: sin tildes, mayúsculas o minúsculas
              </p>
            </div>
          </div>

          {/* Columna Cantidad */}
          <div>
            <h4 className="flex items-center font-semibold text-gray-900 dark:text-white mb-3">
              <span className="text-2xl mr-2">🔢</span>
              COLUMNA "cantidad_ajuste"
            </h4>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <p>Número <strong>positivo</strong> para ENTRADA, <strong>negativo</strong> para SALIDA</p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 font-mono text-xs space-y-1">
                <p><span className="text-green-600 dark:text-green-400">✓ Entrada:</span> 10, 100, 5000</p>
                <p><span className="text-red-600 dark:text-red-400">✓ Salida:</span> -5, -50, -1000</p>
                <p><span className="text-orange-600 dark:text-orange-400">✗ NO acepta:</span> 0 (cero)</p>
              </div>
            </div>
          </div>

          {/* Columna Tipo Ajuste */}
          <div>
            <h4 className="flex items-center font-semibold text-gray-900 dark:text-white mb-3">
              <span className="text-2xl mr-2">⚙️</span>
              COLUMNA "tipo_ajuste"
            </h4>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Valores válidos según tu configuración:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tiposAjuste.length > 0 ? (
                  tiposAjuste.map((tipo) => (
                    <div
                      key={tipo.id}
                      className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm"
                    >
                      <p className="font-mono text-blue-600 dark:text-blue-400">{tipo.clave}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">{tipo.label}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No hay tipos de ajuste configurados
                  </p>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                ✓ La búsqueda es flexible: prueba "AJUSTE" o "ajuste" o "ajuste_fisico"
              </p>
            </div>
          </div>

          {/* Columna Almacén */}
          <div>
            <h4 className="flex items-center font-semibold text-gray-900 dark:text-white mb-3">
              <span className="text-2xl mr-2">🏢</span>
              COLUMNA "almacen"
            </h4>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Almacenes disponibles en tu sistema:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {almacenes.length > 0 ? (
                  almacenes.map((almacen) => (
                    <div
                      key={almacen.id}
                      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3 text-sm"
                    >
                      <p className="font-semibold text-green-900 dark:text-green-200">
                        {almacen.nombre}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No hay almacenes configurados
                  </p>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                ✓ La búsqueda es flexible: puedes escribir "almacen" o "Almacén"
              </p>
            </div>
          </div>

          {/* Columna Observación */}
          <div>
            <h4 className="flex items-center font-semibold text-gray-900 dark:text-white mb-3">
              <span className="text-2xl mr-2">📝</span>
              COLUMNA "observacion"
            </h4>
            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <p>Descripción o motivo del ajuste (máximo 500 caracteres)</p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-xs space-y-1 font-mono">
                <p>"Recuento físico diferencia"</p>
                <p>"Merma por vencimiento"</p>
                <p>"Error en entrada anterior"</p>
              </div>
            </div>
          </div>

          {/* Notas importantes */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="flex items-center font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
              <span className="text-2xl mr-2">⚡</span>
              Notas Importantes
            </h4>
            <ul className="space-y-2 text-yellow-800 dark:text-yellow-300 text-sm">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>
                  La búsqueda de productos y almacenes es <strong>FLEXIBLE</strong>
                  <br />
                  <span className="text-xs ml-4">
                    "Almacén" = "almacen" = "ALMACEN" = "almacenista"
                  </span>
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>
                  Búsqueda insensible a tildes
                  <br />
                  <span className="text-xs ml-4">
                    "Café" = "cafe" = "CAFE"
                  </span>
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>
                  Búsqueda de SKU flexible
                  <br />
                  <span className="text-xs ml-4">
                    "PRD001" = "prd001" = "Prd001"
                  </span>
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Las columnas deben estar en este orden: <br />
                  <span className="font-mono text-xs ml-4">
                    producto, cantidad_ajuste, tipo_ajuste, almacen, observacion
                  </span>
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>NO incluyas espacios al inicio o final de los valores</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>
                  Para valores con comas, enciérralos entre comillas:
                  <br />
                  <span className="font-mono text-xs ml-4">"Producto, Especial"</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Formatos soportados */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="flex items-center font-semibold text-blue-900 dark:text-blue-200 mb-3">
              <span className="text-2xl mr-2">📄</span>
              Formatos Soportados
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { ext: 'CSV', desc: 'Texto plano' },
                { ext: 'XLSX', desc: 'Excel moderno' },
                { ext: 'XLS', desc: 'Excel antiguo' },
                { ext: 'ODS', desc: 'LibreOffice' },
              ].map((fmt) => (
                <div
                  key={fmt.ext}
                  className="bg-blue-100 dark:bg-blue-900 rounded p-2 text-center"
                >
                  <p className="font-semibold text-blue-900 dark:text-blue-200 text-sm">
                    {fmt.ext}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    {fmt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
