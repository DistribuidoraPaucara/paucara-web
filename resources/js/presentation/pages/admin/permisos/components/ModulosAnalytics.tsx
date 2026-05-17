import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import type { ModuloSidebar } from '@/domain/entities/admin-permisos';
import { BarChart3, Database, Eye, Lock, Layers, Users } from 'lucide-react';

interface ModulosAnalyticsProps {
  modulos: ModuloSidebar[];
}

interface Analytics {
  totalModulos: number;
  modulosActivos: number;
  modulosConPermisos: number;
  modulosEnDashboard: number;
  porcentajeActivos: number;
  porcentajeConPermisos: number;
  porcentajeEnDashboard: number;
  categorias: Array<{ nombre: string; cantidad: number; porcentaje: number }>;
  modulosPorTipo: {
    principales: number;
    submodulos: number;
  };
}

export function ModulosAnalytics({ modulos }: ModulosAnalyticsProps) {
  const analytics = useMemo(() => {
    const totalModulos = modulos.length;
    const modulosActivos = modulos.filter((m) => m.activo).length;
    const modulosConPermisos = modulos.filter((m) => m.permisos && m.permisos.length > 0).length;
    const modulosEnDashboard = modulos.filter((m) => m.visible_dashboard).length;

    // Categorías
    const categoriasMap = new Map<string, number>();
    modulos.forEach((m) => {
      const categoria = m.categoria || 'Sin categoría';
      categoriasMap.set(categoria, (categoriasMap.get(categoria) || 0) + 1);
    });

    const categorias = Array.from(categoriasMap.entries())
      .map(([nombre, cantidad]) => ({
        nombre,
        cantidad,
        porcentaje: totalModulos > 0 ? Math.round((cantidad / totalModulos) * 100) : 0,
      }))
      .sort((a, b) => b.cantidad - a.cantidad);

    // Módulos por tipo
    const modulosPorTipo = {
      principales: modulos.filter((m) => !m.es_submenu).length,
      submodulos: modulos.filter((m) => m.es_submenu).length,
    };

    return {
      totalModulos,
      modulosActivos,
      modulosConPermisos,
      modulosEnDashboard,
      porcentajeActivos: totalModulos > 0 ? Math.round((modulosActivos / totalModulos) * 100) : 0,
      porcentajeConPermisos: totalModulos > 0 ? Math.round((modulosConPermisos / totalModulos) * 100) : 0,
      porcentajeEnDashboard: totalModulos > 0 ? Math.round((modulosEnDashboard / totalModulos) * 100) : 0,
      categorias,
      modulosPorTipo,
    };
  }, [modulos]);

  if (modulos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 mt-8">
      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de módulos */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Módulos</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {analytics.totalModulos}
                </p>
              </div>
              <Database className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Módulos activos */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Módulos Activos</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {analytics.modulosActivos}
                </p>
                <p className="text-xs text-gray-500 mt-1">{analytics.porcentajeActivos}% del total</p>
              </div>
              <Eye className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Módulos con permisos */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Con Permisos</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                  {analytics.modulosConPermisos}
                </p>
                <p className="text-xs text-gray-500 mt-1">{analytics.porcentajeConPermisos}% del total</p>
              </div>
              <Lock className="h-12 w-12 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Módulos en dashboard */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">En Dashboard</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                  {analytics.modulosEnDashboard}
                </p>
                <p className="text-xs text-gray-500 mt-1">{analytics.porcentajeEnDashboard}% del total</p>
              </div>
              <Layers className="h-12 w-12 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Módulos por tipo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Distribución por Tipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Módulos Principales</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                {analytics.modulosPorTipo.principales}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Submódulos</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                {analytics.modulosPorTipo.submodulos}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorías */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Módulos por Categoría
          </CardTitle>
          <CardDescription>
            Distribución de módulos según su categoría de agrupación
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.categorias.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay categorías definidas</p>
          ) : (
            <div className="space-y-3">
              {analytics.categorias.map((categoria) => (
                <div key={categoria.nombre} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="outline" className="min-w-fit">
                      {categoria.nombre}
                    </Badge>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${categoria.porcentaje}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {categoria.cantidad}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({categoria.porcentaje}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <BarChart3 className="h-5 w-5" />
            Resumen de Estadísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Módulos no categorizados:</span>
              <Badge>{modulos.filter((m) => !m.categoria).length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Módulos inactivos:</span>
              <Badge variant="secondary">{modulos.filter((m) => !m.activo).length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Módulos sin visibilidad en dashboard:</span>
              <Badge variant="secondary">{modulos.filter((m) => !m.visible_dashboard).length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Módulos sin permisos asignados:</span>
              <Badge variant="outline">{modulos.filter((m) => !m.permisos || m.permisos.length === 0).length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
