import { CargoCSVProducto } from '@/domain/entities/productos-masivos';

interface HistorialTablaProps {
  cargas: CargoCSVProducto[];
  cargando?: boolean;
  onVerDetalle?: (cargo: CargoCSVProducto) => void;
  onRevertir?: (cargo: CargoCSVProducto) => void;
}

export default function HistorialTabla({
  cargas,
  cargando = false,
  onVerDetalle,
  onRevertir,
}: HistorialTablaProps) {
  const getBadgeEstado = (estado: string) => {
    const badges: { [key: string]: string } = {
      procesado: 'bg-green-100 text-green-800',
      pendiente: 'bg-yellow-100 text-yellow-800',
      cancelado: 'bg-red-100 text-red-800',
      revertido: 'bg-gray-100 text-gray-800',
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Archivo</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Fecha</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Filas</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Válidas</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Errores</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Usuario</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cargas.map((cargo) => (
            <tr key={cargo.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                <div className="truncate max-w-xs">{cargo.nombre_archivo}</div>
                <div className="text-xs text-gray-500 font-mono">ID: {cargo.id}</div>
              </td>
              <td className="px-4 py-3 text-gray-600 text-xs">{formatFecha(cargo.created_at)}</td>
              <td className="px-4 py-3 text-center font-medium text-gray-900">{cargo.cantidad_filas}</td>
              <td className="px-4 py-3 text-center text-green-600 font-medium">{cargo.cantidad_validas}</td>
              <td className="px-4 py-3 text-center text-red-600 font-medium">{cargo.cantidad_errores}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getBadgeEstado(cargo.estado)}`}>
                  {cargo.estado}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 text-xs">{cargo.usuario?.nombre || '-'}</td>
              <td className="px-4 py-3 text-center space-x-2 flex justify-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 font-medium"
                  onClick={() => onVerDetalle?.(cargo)}
                >
                  Ver
                </button>
                {cargo.estado === 'procesado' && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 font-medium"
                    onClick={() => onRevertir?.(cargo)}
                  >
                    Revertir
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
