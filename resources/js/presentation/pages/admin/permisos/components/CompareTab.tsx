import { useState, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import toast from 'react-hot-toast';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';
import type { AdminRol } from '@/domain/entities/admin-permisos';

interface ComparisonResult {
  rol1: {
    id: number;
    nombre: string;
    soloEnEste: string[];
    total: number;
  };
  rol2: {
    id: number;
    nombre: string;
    soloEnEste: string[];
    total: number;
  };
  comunes: number;
  diferentes: number;
}

interface CompareTabProps {
  roles: AdminRol[];
  cargando: boolean;
  onLoadData: (search: string) => void;
}

export function CompareTab({ roles, cargando, onLoadData }: CompareTabProps) {
  const [role1Id, setRole1Id] = useState<string>('');
  const [role2Id, setRole2Id] = useState<string>('');
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roles.length === 0) {
      onLoadData('');
    }
  }, []);

  const handleCompare = async () => {
    if (!role1Id || !role2Id) {
      toast.error('Selecciona dos roles para comparar');
      return;
    }

    if (role1Id === role2Id) {
      toast.error('Selecciona dos roles diferentes');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/roles-data/compare', {
        role1_id: parseInt(role1Id),
        role2_id: parseInt(role2Id),
      });
      setComparison(response.data);
    } catch (error) {
      toast.error('Error al comparar roles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comparar Roles</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Compara permisos entre dos roles para ver diferencias.
        </p>
      </div>

      {/* Selector de roles */}
      <Card className="mb-6 dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Seleccionar Roles</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Elige dos roles para compararlos lado a lado.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5 items-end">
              {/* Rol 1 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Rol 1</label>
                <RoleSelect
                  value={role1Id}
                  onChange={setRole1Id}
                  excludeId={role2Id ? parseInt(role2Id) : undefined}
                  roles={roles}
                  loading={cargando}
                />
              </div>

              {/* Ícono de comparación */}
              <div className="flex justify-center pt-2">
                <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-600" />
              </div>

              {/* Rol 2 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Rol 2</label>
                <RoleSelect
                  value={role2Id}
                  onChange={setRole2Id}
                  excludeId={role1Id ? parseInt(role1Id) : undefined}
                  roles={roles}
                  loading={cargando}
                />
              </div>

              {/* Espacio para botón */}
              <div></div>

              {/* Botón de comparación */}
              <Button
                onClick={handleCompare}
                disabled={!role1Id || !role2Id || loading}
                className="w-full"
              >
                {loading ? 'Comparando...' : 'Comparar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultado de comparación */}
      {comparison && (
        <div className="space-y-4">
          {/* Resumen */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{comparison.comunes}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Permisos Comunes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{comparison.diferentes}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Permisos Diferentes</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <Badge variant="default">
                      {Math.round(
                        (comparison.comunes /
                          (comparison.rol1.total + comparison.rol2.total - comparison.comunes)) *
                          100
                      )}
                      % Similar
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparación lado a lado */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Rol 1 */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">{comparison.rol1.nombre}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Total: {comparison.rol1.total} permisos</CardDescription>
              </CardHeader>
              <CardContent>
                {comparison.rol1.soloEnEste.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-orange-600 dark:text-orange-400 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Exclusivos de {comparison.rol1.nombre}
                    </h4>
                    <div className="space-y-1 max-h-96 overflow-y-auto">
                      {comparison.rol1.soloEnEste.map((permiso, idx) => (
                        <div
                          key={idx}
                          className="text-sm p-2 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-200 rounded border-l-2 border-orange-500 text-orange-900"
                        >
                          {permiso}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No hay permisos exclusivos
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rol 2 */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">{comparison.rol2.nombre}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Total: {comparison.rol2.total} permisos</CardDescription>
              </CardHeader>
              <CardContent>
                {comparison.rol2.soloEnEste.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Exclusivos de {comparison.rol2.nombre}
                    </h4>
                    <div className="space-y-1 max-h-96 overflow-y-auto">
                      {comparison.rol2.soloEnEste.map((permiso, idx) => (
                        <div
                          key={idx}
                          className="text-sm p-2 bg-green-50 dark:bg-green-900/20 dark:text-green-200 rounded border-l-2 border-green-500 text-green-900"
                        >
                          {permiso}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No hay permisos exclusivos
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

// Componente auxiliar para selector de rol
function RoleSelect({
  value,
  onChange,
  excludeId,
  roles = [],
  loading = false,
}: {
  value: string;
  onChange: (value: string) => void;
  excludeId?: number;
  roles?: AdminRol[];
  loading?: boolean;
}) {
  const filteredRoles = roles.filter((r) => !excludeId || r.id !== excludeId);

  if (loading) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">Cargando...</div>;
  }

  if (roles.length === 0) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">No hay roles disponibles</div>;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
        <SelectValue placeholder="Selecciona un rol..." />
      </SelectTrigger>
      <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
        {filteredRoles.map((role) => (
          <SelectItem key={role.id} value={role.id.toString()} className="dark:text-white dark:hover:bg-slate-600">
            {role.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
