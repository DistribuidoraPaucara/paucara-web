import { useState, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import toast from 'react-hot-toast';
import { Plus, Trash2, Copy } from 'lucide-react';
import AdvancedPermissionSelector from '@/presentation/components/roles/AdvancedPermissionSelector';
import axios from 'axios';
import type { PermissionGroup } from '@/domain/entities/admin-permisos';

interface Template {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: number[];
  created_by: number;
  creador?: { id: number; name: string };
  created_at: string;
}

interface TemplatesTabProps {
  todosLosPermisos: PermissionGroup[];
}

export function TemplatesTab({ todosLosPermisos }: TemplatesTabProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    permisos: [] as number[],
  });

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const cargarPlantillas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/roles-data/templates');
      setTemplates(response.data);
    } catch (error) {
      toast.error('Error cargando plantillas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!formData.nombre.trim()) {
      toast.error('El nombre de la plantilla es requerido');
      return;
    }

    if (formData.permisos.length === 0) {
      toast.error('Selecciona al menos un permiso');
      return;
    }

    try {
      setSaving(true);
      await axios.post('/roles-data/templates', {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        permisos: formData.permisos,
      });
      toast.success('Plantilla creada exitosamente');
      setShowCreateDialog(false);
      setFormData({ nombre: '', descripcion: '', permisos: [] });
      cargarPlantillas();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear plantilla';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) return;

    try {
      await axios.delete(`/roles-data/templates/${id}`);
      toast.success('Plantilla eliminada');
      cargarPlantillas();
    } catch (error) {
      toast.error('Error al eliminar plantilla');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Plantillas de Permisos</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Crea y gestiona plantillas reutilizables de permisos.</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Listado de plantillas */}
      {loading ? (
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">Cargando plantillas...</div>
          </CardContent>
        </Card>
      ) : templates.length === 0 ? (
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No hay plantillas creadas.</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Plantilla
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col dark:bg-slate-800 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-900 transition-shadow">
              <CardHeader>
                <CardTitle className="text-base text-gray-900 dark:text-white">{template.nombre}</CardTitle>
                <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-400">
                  {template.descripcion || 'Sin descripción'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Permisos:</span>
                    <span className="font-semibold text-lg text-gray-900 dark:text-white">{template.permisos.length}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Creada: {new Date(template.created_at).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(template.permisos));
                        toast.success('Permisos copiados');
                      }}
                    >
                      <Copy className="mr-1 h-4 w-4" />
                      Copiar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog: Crear plantilla */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto dark:bg-slate-800 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Crear Nueva Plantilla</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Define el nombre, descripción y permisos para esta plantilla.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Información de plantilla */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-gray-900 dark:text-gray-200">Nombre de la Plantilla *</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Vendedor Estándar"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-gray-900 dark:text-gray-200">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe para qué se usa esta plantilla..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Selector de permisos */}
            <div>
              <Label className="text-base mb-4 block text-gray-900 dark:text-gray-200">Selecciona Permisos *</Label>
              <AdvancedPermissionSelector
                selectedPermissions={formData.permisos}
                onChange={(permisos) => setFormData({ ...formData, permisos })}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-600">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={saving} className="dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-600">
                Cancelar
              </Button>
              <Button onClick={handleCreateTemplate} disabled={saving}>
                {saving ? 'Guardando...' : 'Crear Plantilla'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
