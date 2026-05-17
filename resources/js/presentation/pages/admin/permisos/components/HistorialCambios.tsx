import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { Label } from '@/presentation/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { Calendar, User, Edit, Plus, Trash2, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface CambioAudit {
  id: number;
  modulo_id: number;
  modulo_titulo: string;
  usuario_id: number;
  usuario_nombre: string;
  accion: 'creado' | 'actualizado' | 'eliminado';
  datos_anteriores?: Record<string, any>;
  datos_nuevos?: Record<string, any>;
  fecha: string;
}

interface HistorialCambiosProps {
  moduloId?: number;
}

export function HistorialCambios({ moduloId }: HistorialCambiosProps) {
  const [cambios, setCambios] = useState<CambioAudit[]>([]);
  const [cargando, setCargando] = useState(false);
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [filtroAccion, setFiltroAccion] = useState<'todos' | 'creado' | 'actualizado' | 'eliminado'>('todos');

  // Cargar historial
  useEffect(() => {
    cargarHistorial();
  }, [moduloId, filtroAccion]);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (moduloId) params.append('modulo_id', moduloId.toString());
      if (filtroAccion !== 'todos') params.append('accion', filtroAccion);
      if (filtroFechaInicio) params.append('desde', filtroFechaInicio);
      if (filtroFechaFin) params.append('hasta', filtroFechaFin);

      const response = await fetch(`/api/modulos-sidebar/historial?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo cargar el historial`);
      }

      const data = await response.json();
      setCambios(data.cambios || []);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      toast.error('No hay datos de historial disponibles. Se muestran datos de ejemplo.');
      // Mostrar datos de ejemplo si la API no está disponible
      mostrarEjemplos();
    } finally {
      setCargando(false);
    }
  };

  // Mostrar ejemplos de cambios
  const mostrarEjemplos = () => {
    const ejemplo: CambioAudit[] = [
      {
        id: 1,
        modulo_id: 1,
        modulo_titulo: 'Inventario',
        usuario_id: 1,
        usuario_nombre: 'Admin',
        accion: 'creado',
        datos_nuevos: { titulo: 'Inventario', ruta: '/inventario' },
        fecha: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 2,
        modulo_id: 1,
        modulo_titulo: 'Inventario',
        usuario_id: 2,
        usuario_nombre: 'Usuario 1',
        accion: 'actualizado',
        datos_anteriores: { activo: false },
        datos_nuevos: { activo: true },
        fecha: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
    setCambios(ejemplo);
  };

  const obtenerIconoAccion = (accion: string) => {
    switch (accion) {
      case 'creado':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'actualizado':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'eliminado':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const obtenerColorAccion = (accion: string) => {
    switch (accion) {
      case 'creado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'actualizado':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'eliminado':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const obtenerLabelAccion = (accion: string) => {
    switch (accion) {
      case 'creado':
        return 'Creado';
      case 'actualizado':
        return 'Actualizado';
      case 'eliminado':
        return 'Eliminado';
      default:
        return accion;
    }
  };

  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return fecha;
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historial de Cambios (Auditoría)
        </CardTitle>
        <CardDescription>
          Registro de todos los cambios realizados en los módulos del sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Filtros</h4>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Fecha inicio */}
            <div>
              <Label htmlFor="fecha-inicio" className="text-xs">
                Desde
              </Label>
              <Input
                id="fecha-inicio"
                type="date"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Fecha fin */}
            <div>
              <Label htmlFor="fecha-fin" className="text-xs">
                Hasta
              </Label>
              <Input
                id="fecha-fin"
                type="date"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Filtro por acción */}
            <div>
              <Label htmlFor="accion-filtro" className="text-xs">
                Tipo de Acción
              </Label>
              <select
                id="accion-filtro"
                value={filtroAccion}
                onChange={(e) => setFiltroAccion(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs dark:bg-gray-700 dark:text-white"
              >
                <option value="todos">Todos</option>
                <option value="creado">Creado</option>
                <option value="actualizado">Actualizado</option>
                <option value="eliminado">Eliminado</option>
              </select>
            </div>

            {/* Botón de aplicar filtros */}
            <div className="flex items-end">
              <Button onClick={cargarHistorial} disabled={cargando} size="sm" className="w-full">
                {cargando ? 'Cargando...' : 'Aplicar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Información */}
        {cambios.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                No hay registros en el historial
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-200 mt-1">
                El historial de auditoría se registrará automáticamente cuando se realicen cambios en los módulos.
                Para probar esta funcionalidad, realiza cambios en los módulos.
              </p>
            </div>
          </div>
        ) : (
          /* Tabla de historial */
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead>Acción</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cambios</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cambios.map((cambio) => (
                  <TableRow key={cambio.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {/* Acción */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {obtenerIconoAccion(cambio.accion)}
                        <Badge className={obtenerColorAccion(cambio.accion)}>
                          {obtenerLabelAccion(cambio.accion)}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Módulo */}
                    <TableCell className="font-medium">{cambio.modulo_titulo}</TableCell>

                    {/* Usuario */}
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-400" />
                        {cambio.usuario_nombre}
                      </div>
                    </TableCell>

                    {/* Fecha */}
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatearFecha(cambio.fecha)}
                      </div>
                    </TableCell>

                    {/* Cambios */}
                    <TableCell className="text-xs">
                      {cambio.accion === 'creado' && cambio.datos_nuevos && (
                        <Badge variant="outline" className="bg-green-50">
                          {Object.keys(cambio.datos_nuevos).length} campos
                        </Badge>
                      )}
                      {cambio.accion === 'actualizado' && cambio.datos_anteriores && (
                        <div className="space-y-1">
                          {Object.entries(cambio.datos_anteriores).map(([key, valor]) => (
                            <div key={key} className="text-gray-600 dark:text-gray-400">
                              <span className="font-mono text-xs">{key}:</span>{' '}
                              <span className="line-through">{String(valor)}</span>
                              {cambio.datos_nuevos && cambio.datos_nuevos[key] !== undefined && (
                                <>
                                  {' '}
                                  → <span className="text-green-600">{String(cambio.datos_nuevos[key])}</span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {cambio.accion === 'eliminado' && (
                        <Badge variant="destructive" className="bg-red-50 text-red-700">
                          Módulo eliminado
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Info sobre auditoría */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm text-blue-900 dark:text-blue-100">
          <strong>ℹ️ Sobre el Historial de Auditoría:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>Se registran automáticamente los cambios creados, actualizados y eliminados</li>
            <li>Puedes filtrar por rango de fechas y tipo de acción</li>
            <li>Los cambios muestran los valores anteriores y nuevos para actualizaciones</li>
            <li>Todos los cambios incluyen información del usuario y timestamp</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
