import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface TipoOperacion {
  id: number;
  clave: string;
  label: string;
  direccion: 'entrada' | 'salida';
  requiere_tipo_motivo: string | null;
  requiere_proveedor: boolean;
  requiere_cliente: boolean;
  descripcion: string;
}

interface InstruccionesOperacionesProps {
  tiposOperacion: TipoOperacion[];
  tiposAjuste: any[];
  tiposMerma: any[];
}

/**
 * Componente que muestra instrucciones sobre los tipos de operaciones disponibles
 * Expande/contrae para mostrar detalles de cada operación
 */
export const InstruccionesOperaciones: React.FC<InstruccionesOperacionesProps> = ({
  tiposOperacion,
  tiposAjuste,
  tiposMerma,
}) => {
  const [expandido, setExpandido] = useState(true);

  const obtenerIconoOperacion = (direccion: string): string => {
    return direccion === 'entrada' ? '📥' : '📤';
  };

  const obtenerValoresMotivo = (operacion: TipoOperacion): string[] => {
    if (operacion.requiere_tipo_motivo === 'tipo_ajuste') {
      return tiposAjuste.map(t => `${t.clave} (${t.label})`);
    } else if (operacion.requiere_tipo_motivo === 'tipo_merma') {
      return tiposMerma.map(t => `${t.clave} (${t.label})`);
    } else if (operacion.requiere_proveedor) {
      return ['Nombre del Proveedor (texto libre)'];
    } else if (operacion.requiere_cliente) {
      return ['Nombre del Cliente (texto libre)'];
    }
    return ['(No requerido)'];
  };

  const obtenerEtiquetaMotivo = (operacion: TipoOperacion): string => {
    if (operacion.requiere_tipo_motivo === 'tipo_ajuste') {
      return '⚙️ Tipo de Ajuste';
    } else if (operacion.requiere_tipo_motivo === 'tipo_merma') {
      return '⚠️ Tipo de Merma';
    } else if (operacion.requiere_proveedor) {
      return '🏢 Proveedor';
    } else if (operacion.requiere_cliente) {
      return '👤 Cliente';
    }
    return 'Motivo';
  };

  return (
    <div className="mb-6 border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 rounded-lg overflow-hidden">
      {/* Encabezado expandible */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full px-4 py-3 flex items-center justify-between bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-150 dark:hover:bg-blue-900/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Tipos de Operaciones Disponibles
          </h3>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-600 dark:text-gray-300 transition-transform ${
            expandido ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Contenido expandible */}
      {expandido && (
        <div className="p-4 space-y-4">
          {tiposOperacion.map((operacion) => (
            <div
              key={operacion.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              {/* Encabezado de la operación */}
              <div className="flex items-start gap-2 mb-2">
                <span className="text-2xl">{obtenerIconoOperacion(operacion.direccion)}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {operacion.clave}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {operacion.label}
                  </p>
                </div>
              </div>

              {/* Descripción */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 ml-10">
                {operacion.descripcion}
              </p>

              {/* Cuadrícula de requisitos */}
              <div className="ml-10 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {/* Dirección */}
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">
                    📊 Dirección
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {operacion.direccion === 'entrada' ? '↑ Entrada (suma stock)' : '↓ Salida (resta stock)'}
                  </p>
                </div>

                {/* Tipo de Motivo */}
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">
                    {obtenerEtiquetaMotivo(operacion)}
                  </p>
                  <div className="text-gray-600 dark:text-gray-300">
                    {obtenerValoresMotivo(operacion).length > 0 ? (
                      <ul className="list-disc list-inside">
                        {obtenerValoresMotivo(operacion).map((valor, idx) => (
                          <li key={idx} className="text-xs">
                            {valor}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ejemplo de uso */}
              <div className="ml-10 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-2">
                  📝 Ejemplo:
                </p>
                <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/30 p-2 rounded font-mono">
                  <div>Producto: PRO0001</div>
                  <div>Cantidad: 10</div>
                  <div>Tipo Operación: {operacion.clave}</div>
                  <div>
                    Tipo Motivo:{' '}
                    {obtenerValoresMotivo(operacion)[0]?.split(' ')[0] || '-'}
                  </div>
                  <div>Almacén: Almacén Principal</div>
                </div>
              </div>
            </div>
          ))}

          {/* Nota importante */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-4">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
              ⚡ Notas Importantes:
            </p>
            <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>
                • La <strong>cantidad es siempre positiva</strong> - la dirección se determina por el tipo de operación
              </li>
              <li>
                • La búsqueda de productos y almacenes es <strong>flexible</strong> (sin tildes, mayúsculas o minúsculas)
              </li>
              <li>
                • El campo <strong>tipo motivo es dinámico</strong> según la operación seleccionada
              </li>
              <li>
                • Para <strong>ENTRADA_COMPRA</strong> y <strong>SALIDA_VENTA</strong>, el tipo motivo es libre (Proveedor/Cliente)
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstruccionesOperaciones;
