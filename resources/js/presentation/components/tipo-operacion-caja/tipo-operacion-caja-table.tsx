// Presentation Layer: Tabla de tipos de operación de caja
import { Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import type { TipoOperacionCaja } from '@/domain/entities/tipo-operacion-caja';

interface TipoOperacionCajaTableProps {
  items: TipoOperacionCaja[];
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

export default function TipoOperacionCajaTable({
  items,
  onDelete,
  isLoading = false
}: TipoOperacionCajaTableProps) {
  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este tipo de operación?')) {
      onDelete?.(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No hay registros</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Código
            </th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Nombre
            </th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Descripción
            </th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Dirección
            </th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
              Estado
            </th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900">
          {items.map((item) => {
            const rowColorClass =
              item.direccion === 'ENTRADA'
                ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                : item.direccion === 'SALIDA'
                ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                : item.direccion === 'AJUSTE'
                ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800';

            return (
            <tr key={item.id} className={`border-t border-gray-200 dark:border-gray-700 ${rowColorClass}`}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                {item.codigo}
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                {item.nombre}
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {item.descripcion || '-'}
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {item.direccion || '-'}
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    item.activo
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                  }`}
                >
                  {item.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Link
                    href={`/tipo-operacion-caja/${item.id}/edit`}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
