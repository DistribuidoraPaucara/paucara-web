import { useState, useEffect } from 'react';
import { AlertCircle, Package, Boxes } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';

interface ComboDet {
  combo_id: number;
  combo_nombre: string;
  combo_sku: string;
  precio_venta: number;
  capacidad_total: number;
  es_obligatorio: boolean;
  cantidad_requerida: number;
  combos_posibles_por_este_producto: number;
  es_cuello_botella: boolean;
  detalles: Array<{
    producto_id: number;
    producto_nombre: string;
    cantidad_requerida: number;
    stock_disponible: number;
    combos_posibles: number;
    es_obligatorio: boolean;
    es_cuello_botella: boolean;
  }>;
}

interface ProductoCombosData {
  producto_id: number;
  producto_nombre: string;
  total_combos: number;
  combos: ComboDet[];
}

interface ProductoCombosProps {
  productoId: number;
  almacenId?: number;
}

export default function ProductoCombos({ productoId, almacenId }: ProductoCombosProps) {
  const [data, setData] = useState<ProductoCombosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        setLoading(true);
        const url = new URL(`/api/productos/${productoId}/combos`, window.location.origin);
        if (almacenId) {
          url.searchParams.set('almacen_id', almacenId.toString());
        }

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Error cargando combos');

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, [productoId, almacenId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-500">Cargando combos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded">
        <AlertCircle size={18} className="text-red-600" />
        <span className="text-sm text-red-600">{error}</span>
      </div>
    );
  }

  if (!data || data.total_combos === 0) {
    return (
      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded">
        <Package size={18} className="text-blue-600" />
        <span className="text-sm text-blue-600">Este producto no pertenece a ningún combo</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Boxes size={20} />
          Combos que contienen este producto
        </CardTitle>
        <p className="text-sm text-gray-500 mt-2">
          Este producto está en <strong>{data.total_combos}</strong> combo{data.total_combos !== 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.combos.map((combo) => (
            <div
              key={combo.combo_id}
              className={`p-4 border rounded-lg ${
                combo.es_cuello_botella
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* Header del combo */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{combo.combo_nombre}</h4>
                    <Badge variant={combo.es_obligatorio ? 'default' : 'secondary'}>
                      {combo.es_obligatorio ? 'Obligatorio' : 'Opcional'}
                    </Badge>
                    {combo.es_cuello_botella && (
                      <Badge className="bg-yellow-600">⚠️ Cuello de botella</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">SKU: {combo.combo_sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{combo.capacidad_total}</p>
                  <p className="text-xs text-gray-500">combos posibles</p>
                </div>
              </div>

              {/* Info sobre este producto en el combo */}
              <div className="bg-white rounded p-3 mb-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Cantidad requerida en combo</p>
                    <p className="text-xs text-gray-500 mt-1">Limiting factor: {combo.combos_posibles_por_este_producto} combos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{combo.cantidad_requerida}</p>
                    <p className="text-xs text-gray-500">unidad{combo.cantidad_requerida !== 1 ? 'es' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Detalles de todos los productos en el combo */}
              <details className="cursor-pointer">
                <summary className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Ver detalles de todos los productos del combo
                </summary>
                <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                  {combo.detalles.map((detalle) => (
                    <div
                      key={detalle.producto_id}
                      className={`p-2 rounded text-xs ${
                        detalle.producto_id === productoId
                          ? 'bg-blue-100 border border-blue-300'
                          : detalle.es_cuello_botella
                          ? 'bg-yellow-100 border border-yellow-300'
                          : 'bg-gray-100 border border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{detalle.producto_nombre}</p>
                          <p className="text-gray-600 mt-1">
                            Req: {detalle.cantidad_requerida} | Stock: {detalle.stock_disponible}
                          </p>
                        </div>
                        <div className="text-right ml-2">
                          <p className="font-bold text-gray-900">{detalle.combos_posibles}</p>
                          <p className="text-gray-600">combos</p>
                        </div>
                      </div>
                      {detalle.producto_id === productoId && (
                        <div className="mt-1 text-blue-700 font-semibold">← Este producto</div>
                      )}
                    </div>
                  ))}
                </div>
              </details>

              {/* Precio y info */}
              <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                <p className="text-gray-600">
                  Precio venta: <span className="font-semibold text-gray-900">Bs {combo.precio_venta.toFixed(2)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
