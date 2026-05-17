import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { Badge } from '@/presentation/components/ui/badge';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import axios from 'axios';

interface RoleOption {
  value: string;
  label: string;
}

interface RolesSelectorProps {
  value: string[] | undefined;
  onChange: (roles: string[]) => void;
  disabled?: boolean;
  puedeAccederSistema?: boolean;
  label?: string;
  error?: string;
}

export default function RolesSelector({
  value = [],
  onChange,
  disabled = false,
  puedeAccederSistema = false,
  label = 'Roles de Sistema',
  error
}: RolesSelectorProps) {
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(value || []);

  // Cargar roles disponibles - ✅ Solo los 5 roles: admin, manager, preventista, chofer, cajero
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const response = await axios.get('/empleados-data/roles');
        setRoles(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error cargando roles:', err);
        setLoading(false);
      }
    };

    cargarRoles();
  }, []);

  const toggleRole = (roleName: string) => {
    if (disabled) return;

    const newRoles = selectedRoles.includes(roleName)
      ? selectedRoles.filter(r => r !== roleName)
      : [...selectedRoles, roleName];

    setSelectedRoles(newRoles);
    onChange(newRoles);
  };

  if (!puedeAccederSistema) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <label className="text-base font-semibold">{label}</label>
        <div className="text-center py-8">Cargando roles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="text-base font-semibold">{label}</label>

      {error && (
        <Alert className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      {/* Grid compacto de roles - 5 roles disponibles */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {roles.map((role) => {
          const isSelected = selectedRoles.includes(role.value);

          return (
            <div
              key={role.value}
              onClick={() => toggleRole(role.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleRole(role.value);
                }
              }}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-green-500 border-green-500 bg-green-50 dark:bg-green-950'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-400 dark:border-gray-600'
              }`}>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="text-sm font-semibold text-center">
                {role.label}
              </span>
            </div>
          );
        })}
      </div>

      {selectedRoles.length > 0 && (
        <div className="pt-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Roles seleccionados ({selectedRoles.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedRoles.map((rol) => (
              <Badge key={rol} variant="default" className="gap-1">
                {rol}
                <button
                  onClick={() => toggleRole(rol)}
                  className="ml-1 text-white hover:text-gray-200"
                  disabled={disabled}
                >
                  ✕
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
