import { useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Label } from '@/presentation/components/ui/label';
import { Input } from '@/presentation/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';

import type { Id } from '@/domain/entities/shared';
import type { BulkOperation } from '@/domain/entities/admin-permisos';

type OperationType = 'estado' | 'categoria' | 'permisos' | 'visible_dashboard';

interface ModulosBulkEditModalProps {
  cantidad: number;
  selectedIds: Set<Id>;
  onClose: () => void;
  onSubmit: (selectedIds: Set<Id>, operacion: BulkOperation) => Promise<void>;
  cargando: boolean;
}

export function ModulosBulkEditModal({
  cantidad,
  selectedIds,
  onClose,
  onSubmit,
  cargando,
}: ModulosBulkEditModalProps) {
  const [operacion, setOperacion] = useState<OperationType>('estado');
  const [estadoValor, setEstadoValor] = useState<'activar' | 'desactivar'>('activar');
  const [categoriaValor, setCategoriaValor] = useState('');
  const [dashboardValor, setDashboardValor] = useState<'mostrar' | 'ocultar'>('mostrar');

  const handleSubmit = async () => {
    let bulkOp: BulkOperation;

    switch (operacion) {
      case 'estado':
        bulkOp = { tipo: 'estado', valor: estadoValor === 'activar' };
        break;
      case 'categoria':
        if (!categoriaValor.trim()) {
          alert('Por favor ingresa una categoría');
          return;
        }
        bulkOp = { tipo: 'categoria', valor: categoriaValor };
        break;
      case 'permisos':
        // Este caso será manejado después cuando integrar con PermisosCheckboxForm
        bulkOp = { tipo: 'permisos', permisos: [], accion: 'agregar' };
        break;
      case 'visible_dashboard':
        bulkOp = { tipo: 'visible_dashboard', valor: dashboardValor === 'mostrar' };
        break;
      default:
        return;
    }

    await onSubmit(selectedIds, bulkOp);
  };

  return (
    <div className="fixed inset-0 bg-black dark:bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Editar {cantidad} módulo{cantidad !== 1 ? 's' : ''}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Selecciona la operación que deseas aplicar a los módulos seleccionados
        </p>

        {/* Selector de operación */}
        <div className="mb-6">
          <Label htmlFor="operacion">Operación</Label>
          <Select value={operacion} onValueChange={(value) => setOperacion(value as OperationType)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar operación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="estado">Cambiar Estado</SelectItem>
              <SelectItem value="categoria">Cambiar Categoría</SelectItem>
              <SelectItem value="visible_dashboard">Cambiar Visibilidad en Dashboard</SelectItem>
              {/* <SelectItem value="permisos">Asignar Permisos</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Estado */}
        {operacion === 'estado' && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Label htmlFor="estado" className="dark:text-gray-300">Estado</Label>
            <Select value={estadoValor} onValueChange={(value) => setEstadoValor(value as 'activar' | 'desactivar')}>
              <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-gray-100">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activar">Activar Todos</SelectItem>
                <SelectItem value="desactivar">Desactivar Todos</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              Esto {estadoValor === 'activar' ? 'activará' : 'desactivará'} todos los {cantidad} módulos seleccionados
            </p>
          </div>
        )}

        {/* Categoría */}
        {operacion === 'categoria' && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <Label htmlFor="categoria" className="dark:text-gray-300">Nueva Categoría</Label>
            <Input
              id="categoria"
              placeholder="ej: Inventario, Comercial, Reportes..."
              value={categoriaValor}
              onChange={(e) => setCategoriaValor(e.target.value)}
              className="mt-2 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-100"
            />
            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
              Asignará la categoría "{categoriaValor || '(sin especificar)'}" a todos los {cantidad} módulos
            </p>
          </div>
        )}

        {/* Visibilidad en Dashboard */}
        {operacion === 'visible_dashboard' && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <Label htmlFor="dashboard" className="dark:text-gray-300">Visibilidad en Dashboard</Label>
            <Select
              value={dashboardValor}
              onValueChange={(value) => setDashboardValor(value as 'mostrar' | 'ocultar')}
            >
              <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-gray-100">
                <SelectValue placeholder="Seleccionar visibilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mostrar">Mostrar en Dashboard</SelectItem>
                <SelectItem value="ocultar">Ocultar en Dashboard</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
              Los módulos se {dashboardValor === 'mostrar' ? 'mostrarán' : 'ocultarán'} en el dashboard
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={cargando}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={cargando || (operacion === 'categoria' && !categoriaValor.trim())}
            className="flex-1"
          >
            {cargando ? 'Aplicando...' : 'Aplicar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
