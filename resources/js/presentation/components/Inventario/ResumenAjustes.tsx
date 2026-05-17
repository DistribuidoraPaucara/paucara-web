import React from 'react';
import { FilaAjusteValidada } from '@/infrastructure/services/ajustesCSV.service';

interface TipoOperacion {
  id: number;
  clave: string;
  label: string;
  direccion: 'entrada' | 'salida';
}

interface ResumenAjustesProps {
  filasValidas: FilaAjusteValidada[];
  totalProductos: number;
  cantidadTotal: number;
  tiposOperacion?: TipoOperacion[];
}

export default function ResumenAjustes({
  filasValidas,
  totalProductos,
  cantidadTotal,
  tiposOperacion = [],
}: ResumenAjustesProps) {
  // Contar entradas y salidas basándose en la dirección de la operación
  const obtenerDireccion = (tipoOperacionClave: string): 'entrada' | 'salida' | null => {
    const operacion = tiposOperacion.find(o => o.clave === tipoOperacionClave);
    return operacion?.direccion || null;
  };

  const entradas = filasValidas.filter(f => obtenerDireccion(f.tipo_operacion) === 'entrada').length;
  const salidas = filasValidas.filter(f => obtenerDireccion(f.tipo_operacion) === 'salida').length;

  // Sumar cantidades
  const sumaEntradas = filasValidas
    .filter(f => obtenerDireccion(f.tipo_operacion) === 'entrada')
    .reduce((sum, f) => sum + parseInt(String(f.cantidad), 10), 0);

  const sumaSalidas = filasValidas
    .filter(f => obtenerDireccion(f.tipo_operacion) === 'salida')
    .reduce((sum, f) => sum + parseInt(String(f.cantidad), 10), 0);

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H3a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V6a1 1 0 00-1-1h3a1 1 0 000-2h-2.586A2 2 0 0010 2.414 2 2 0 008.414 3H4z" clipRule="evenodd" />
        </svg>
        Resumen de cambios
      </h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total de filas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total de filas</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {filasValidas.length}
          </div>
        </div>

        {/* Entradas */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <div className="text-sm text-green-700 dark:text-green-300 font-medium">Entradas</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {entradas}
          </div>
          <div className="text-xs text-green-600 dark:text-green-300 mt-1">
            +{sumaEntradas} unidades
          </div>
        </div>

        {/* Salidas */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
          <div className="text-sm text-red-700 dark:text-red-300 font-medium">Salidas</div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
            {salidas}
          </div>
          <div className="text-xs text-red-600 dark:text-red-300 mt-1">
            -{sumaSalidas} unidades
          </div>
        </div>

        {/* Neto */}
        <div className={`rounded-lg p-4 border ${
          cantidadTotal >= 0
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
            : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
        }`}>
          <div className={`text-sm font-medium ${
            cantidadTotal >= 0
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-orange-700 dark:text-orange-300'
          }`}>
            Neto
          </div>
          <div className={`text-3xl font-bold mt-2 ${
            cantidadTotal >= 0
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-orange-600 dark:text-orange-400'
          }`}>
            {cantidadTotal >= 0 ? '+' : ''}{cantidadTotal}
          </div>
        </div>
      </div>

      {/* Productos únicos */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Productos únicos afectados</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{totalProductos}</p>
          </div>
          <svg className="w-12 h-12 text-purple-400 dark:text-purple-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
