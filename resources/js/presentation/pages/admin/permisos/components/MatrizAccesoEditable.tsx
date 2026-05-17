import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import toast from 'react-hot-toast';
import { MatrizAccesoRol } from '@/presentation/components/matriz-acceso-rol';
import { Edit2, Save, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface MatrizAccesoEditableProps {
  modoInicial?: 'lectura' | 'edicion';
}

interface CambioPendiente {
  rol_id: number;
  rol_nombre: string;
  modulo_id: number;
  modulo_titulo: string;
  permisos: string[];
  accion: 'agregar' | 'eliminar' | 'reemplazar';
}

export function MatrizAccesoEditable({ modoInicial = 'lectura' }: MatrizAccesoEditableProps) {
  const [modoEdicion, setModoEdicion] = useState(modoInicial === 'edicion');
  const [cambiosPendientes, setCambiosPendientes] = useState<Map<string, CambioPendiente>>(new Map());
  const [guardando, setGuardando] = useState(false);
  const [mostrarDialogoConfirmacion, setMostrarDialogoConfirmacion] = useState(false);

  const cantidadCambios = useMemo(() => cambiosPendientes.size, [cambiosPendientes]);

  const cancelarEdicion = () => {
    if (cantidadCambios > 0) {
      if (
        confirm(
          `Tienes ${cantidadCambios} cambio${cantidadCambios !== 1 ? 's' : ''} sin guardar. ¿Estás seguro de que quieres cancelar?`
        )
      ) {
        setCambiosPendientes(new Map());
        setModoEdicion(false);
      }
    } else {
      setModoEdicion(false);
    }
  };

  const guardarCambios = async () => {
    if (cantidadCambios === 0) {
      toast.error('No hay cambios para guardar');
      return;
    }

    setMostrarDialogoConfirmacion(false);
    setGuardando(true);

    try {
      const cambios = Array.from(cambiosPendientes.values());

      const response = await fetch('/api/modulos-sidebar/matriz-acceso/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          cambios,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los cambios');
      }

      const data = await response.json();
      toast.success(`${cantidadCambios} cambios guardados correctamente`);
      setCambiosPendientes(new Map());
      setModoEdicion(false);

      // Recargar la página o actualizar el estado según sea necesario
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar los cambios');
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  const agregarCambio = (
    rolId: number,
    rolNombre: string,
    moduloId: number,
    moduloTitulo: string,
    permisos: string[],
    accion: 'agregar' | 'eliminar' | 'reemplazar'
  ) => {
    const clave = `${rolId}-${moduloId}`;
    const nuevosCambios = new Map(cambiosPendientes);

    nuevosCambios.set(clave, {
      rol_id: rolId,
      rol_nombre: rolNombre,
      modulo_id: moduloId,
      modulo_titulo: moduloTitulo,
      permisos,
      accion,
    });

    setCambiosPendientes(nuevosCambios);
  };

  const removerCambio = (rolId: number, moduloId: number) => {
    const clave = `${rolId}-${moduloId}`;
    const nuevosCambios = new Map(cambiosPendientes);
    nuevosCambios.delete(clave);
    setCambiosPendientes(nuevosCambios);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Matriz de Acceso Editable
              {modoEdicion && <Badge className="bg-blue-600">Modo Edición</Badge>}
            </CardTitle>
            <CardDescription>
              Gestiona los permisos de acceso de roles a módulos {modoEdicion ? '(Modo edición activo)' : '(Vista de lectura)'}
            </CardDescription>
          </div>

          {!modoEdicion ? (
            <Button
              onClick={() => setModoEdicion(true)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Editar Permisos
            </Button>
          ) : (
            <div className="flex gap-2">
              {cantidadCambios > 0 && (
                <Button
                  onClick={() => setMostrarDialogoConfirmacion(true)}
                  disabled={guardando}
                  className="bg-green-600 hover:bg-green-700 gap-2"
                >
                  <Save className="h-4 w-4" />
                  Guardar {cantidadCambios} Cambio{cantidadCambios !== 1 ? 's' : ''}
                </Button>
              )}
              <Button
                onClick={cancelarEdicion}
                variant="outline"
                disabled={guardando}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Modo lectura */}
        {!modoEdicion && (
          <div>
            <MatrizAccesoRol />
          </div>
        )}

        {/* Modo edición */}
        {modoEdicion && (
          <div className="space-y-4">
            {/* Info sobre modo edición */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Modo de Edición Activo
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                En esta versión, los cambios se registran en modo edición. La edición inline de celdas será agregada en futuras versiones.
                Puedes agregar cambios manualmente y aplicarlos todos de una vez.
              </p>
            </div>

            {/* Cambios pendientes */}
            {cantidadCambios > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {cantidadCambios} Cambio{cantidadCambios !== 1 ? 's' : ''} Pendiente{cantidadCambios !== 1 ? 's' : ''}
                </h4>

                <div className="space-y-2">
                  {Array.from(cambiosPendientes.values()).map((cambio, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded border border-yellow-300 dark:border-yellow-600"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {cambio.rol_nombre} ↔ {cambio.modulo_titulo}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Acción: <Badge variant="outline" className="ml-1">{cambio.accion}</Badge>
                        </p>
                      </div>
                      <Button
                        onClick={() => removerCambio(cambio.rol_id, cambio.modulo_id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matriz en modo lectura (dentro de modo edición) */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Vista actual de la matriz (cambios pendientes no se reflejan aquí hasta guardar):
              </p>
              <MatrizAccesoRol />
            </div>
          </div>
        )}

        {/* Diálogo de confirmación */}
        {mostrarDialogoConfirmacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Confirmar Cambios
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                ¿Estás seguro de que quieres guardar {cantidadCambios} cambio{cantidadCambios !== 1 ? 's' : ''} en la matriz de acceso?
                Esta acción actualizará los permisos de roles para los módulos seleccionados.
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={() => setMostrarDialogoConfirmacion(false)}
                  variant="outline"
                  disabled={guardando}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={guardarCambios}
                  disabled={guardando}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {guardando ? 'Guardando...' : 'Confirmar'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
