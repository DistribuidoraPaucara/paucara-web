import { useState, useEffect } from 'react';
import { AlertCircle, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';

interface CapacityDetail {
  producto_id: number;
  producto_nombre: string;
  cantidad_requerida: number;
  stock_disponible: number;
  combos_posibles: number;
  es_obligatorio: boolean;
  es_cuello_botella: boolean;
}

interface CapacityData {
  capacidad_total: number;
  detalles: CapacityDetail[];
}

interface ComboCapacityProps {
  comboId: number;
  almacenId?: number;
  compact?: boolean;
}

export default function ComboCapacity({ comboId, almacenId, compact = false }: ComboCapacityProps) {
  const [capacity, setCapacity] = useState<CapacityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCapacity = async () => {
      try {
        setLoading(true);
        const url = new URL(`/api/combos/${comboId}/capacidad-detalles`, window.location.origin);
        if (almacenId) {
          url.searchParams.set('almacen_id', almacenId.toString());
        }

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Error cargando capacidad');

        const data = await response.json();
        setCapacity(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setCapacity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCapacity();
  }, [comboId, almacenId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-500 dark:text-gray-400">Cargando capacidad...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
        <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
        <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
      </div>
    );
  }

  if (!capacity) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Package size={16} className="text-blue-600 dark:text-blue-400" />
        <span className="font-semibold dark:text-gray-100">{capacity.capacidad_total}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">combos</span>
      </div>
    );
  }

  const obligatorios = capacity.detalles.filter((d) => d.es_obligatorio);
  const opcionales = capacity.detalles.filter((d) => !d.es_obligatorio);
  const cuelloBotella = obligatorios.find((d) => d.es_cuello_botella);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp size={20} />
          Capacidad de Manufactura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Capacity Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Capacidad Total</span>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{capacity.capacidad_total}</div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">combos máximos que se pueden manufacturar</p>
        </div>

        {/* Obligatory Products */}
        {obligatorios.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Badge>Obligatorios</Badge>
            </h4>
            <div className="space-y-2">
              {obligatorios.map((detail) => (
                <div
                  key={detail.producto_id}
                  className={`p-3 border rounded-lg ${
                    detail.es_cuello_botella
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800'
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm dark:text-gray-100">{detail.producto_nombre}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Requerido: {detail.cantidad_requerida} | Stock: {detail.stock_disponible}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg dark:text-gray-100">{detail.combos_posibles}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">combos</p>
                    </div>
                  </div>
                  {detail.es_cuello_botella && (
                    <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40 rounded px-2 py-1 inline-block">
                      ⚠️ Cuello de botella
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Products */}
        {opcionales.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Badge variant="secondary">Opcionales (referencia)</Badge>
            </h4>
            <div className="space-y-2">
              {opcionales.map((detail) => (
                <div key={detail.producto_id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-600 dark:text-gray-300">{detail.producto_nombre}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Requerido: {detail.cantidad_requerida} | Stock: {detail.stock_disponible}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-600 dark:text-gray-300">{detail.combos_posibles}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">combos</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        {cuelloBotella && (
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded border border-gray-200 dark:border-gray-700">
            <strong className="dark:text-gray-300">{cuelloBotella.producto_nombre}</strong> es el factor limitante. Se pueden manufacturar{' '}
            <strong className="dark:text-gray-300">{capacity.capacidad_total}</strong> combos máximo.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
