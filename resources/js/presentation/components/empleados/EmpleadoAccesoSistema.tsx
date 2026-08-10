import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/presentation/components/ui/tooltip';
import axios from 'axios';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronRight, Eye, EyeOff, Search, Shield, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RoleOption {
    value: string;
    label: string;
    description?: string;
    permisos?: string[];
}

interface RolAsignado {
    id: number;
    name: string;
    permissions: string[];
}

interface EmpleadoAccesoSistemaProps {
    empleado?: any;
    usernick?: string;
    onUsernickChange?: (value: string) => void;
    password?: string;
    onPasswordChange?: (value: string) => void;
    passwordConfirmation?: string;
    onPasswordConfirmationChange?: (value: string) => void;
    selectedRoles?: string[];
    onRolesChange?: (roles: string[]) => void;
    fotoPerfil?: string | File;
    onFotoPerfilChange?: (file: File | null) => void;
    selectedPermissions?: string[];
    onPermissionsChange?: (permissions: string[]) => void;
    disabled?: boolean;
    puedeAccederSistema?: boolean;
    isEditing?: boolean;
    error?: string;
    rolesDisponibles?: RoleOption[];
    rolesAsignados?: string[] | RolAsignado[];
    permisosAsignados?: string[];
    permisosAsignadosMap?: Record<string, string>;
    permisosHeredados?: string[];
    permisosHeredadosMap?: Record<string, string>;
    permisosDisponibles?: Record<string, string[]>;
    rolesDisponiblesDetallados?: RolAsignado[];
}

export default function EmpleadoAccesoSistema({
    empleado,
    usernick = '',
    onUsernickChange,
    password = '',
    onPasswordChange,
    passwordConfirmation = '',
    onPasswordConfirmationChange,
    selectedRoles = [],
    onRolesChange,
    selectedPermissions = [],
    onPermissionsChange,
    fotoPerfil,
    onFotoPerfilChange,
    disabled = false,
    puedeAccederSistema = false,
    isEditing = false,
    error,
    rolesDisponibles = [],
    rolesAsignados = [],
    permisosAsignados = [],
    permisosAsignadosMap = {},
    permisosHeredados = [],
    permisosHeredadosMap = {},
    permisosDisponibles = {},
    rolesDisponiblesDetallados = [],
}: EmpleadoAccesoSistemaProps) {
    const [roles, setRoles] = useState<RoleOption[]>(rolesDisponibles as RoleOption[]);
    const [loading, setLoading] = useState(!rolesDisponibles?.length && !rolesDisponiblesDetallados?.length);
    const [showPassword, setShowPassword] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [searchRoles, setSearchRoles] = useState<string>('');
    const [searchPermiso, setSearchPermiso] = useState<string>('');
    const [calculatedInheritedPermissions, setCalculatedInheritedPermissions] = useState<string[]>([]);

    // Cargar roles disponibles con permisos (si no vienen desde props)
    useEffect(() => {
        if (rolesDisponibles && rolesDisponibles.length > 0) {
            setRoles(rolesDisponibles as RoleOption[]);
            setLoading(false);
            return;
        }

        // Si vienen los datos nuevos estructurados, no cargar del API
        if (rolesDisponiblesDetallados && rolesDisponiblesDetallados.length > 0) {
            setLoading(false);
            return;
        }

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
    }, [rolesDisponibles, rolesDisponiblesDetallados]);

    // Calcular permisos heredados de los roles seleccionados
    useEffect(() => {
        const inherited: Set<string> = new Set();

        // Si tenemos datos detallados de roles, usarlos para calcular permisos heredados
        if (rolesDisponiblesDetallados && rolesDisponiblesDetallados.length > 0) {
            selectedRoles.forEach((roleName: string) => {
                const roleData = rolesDisponiblesDetallados.find((r: any) => r.name === roleName);
                if (roleData && roleData.permissions && Array.isArray(roleData.permissions)) {
                    roleData.permissions.forEach((perm: string) => {
                        inherited.add(perm);
                    });
                }
            });
        }

        setCalculatedInheritedPermissions(Array.from(inherited));
    }, [selectedRoles, rolesDisponiblesDetallados]);

    const toggleRole = (roleName: string) => {
        if (disabled || !puedeAccederSistema) return;

        const newRoles = selectedRoles.includes(roleName)
            ? selectedRoles.filter((r) => r !== roleName)
            : [...selectedRoles, roleName];
        onRolesChange?.(newRoles);
    };

    const toggleCategory = (categoria: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoria]: !prev[categoria],
        }));
    };

    const removePermission = (permiso: string) => {
        if (disabled) return;
        const newPermissions = selectedPermissions.filter((p) => p !== permiso);
        onPermissionsChange?.(newPermissions);
    };

    // Helper para renderizar permiso con tooltip
    const renderPermisoConTooltip = (
        permiso: string,
        descripcion: string | undefined,
        badgeClass: string,
        showRemoveButton: boolean = false,
        onRemove?: () => void
    ) => {
        const badge = (
            <div className={`flex items-center gap-1 ${badgeClass} px-2 py-1 rounded text-xs`}>
                <span>{permiso.split('.').slice(1).join('.')}</span>
                {showRemoveButton && (
                    <button
                        onClick={onRemove}
                        className="ml-1 text-opacity-60 hover:text-opacity-100 transition-opacity"
                        title="Remover permiso"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>
        );

        if (descripcion) {
            return (
                <TooltipProvider key={permiso}>
                    <Tooltip>
                        <TooltipTrigger asChild>{badge}</TooltipTrigger>
                        <TooltipContent className="max-w-xs text-xs">
                            <p className="font-medium">{permiso}</p>
                            <p className="text-gray-300">{descripcion}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }

        return badge;
    };

    if (!puedeAccederSistema) {
        return (
            <div className="py-12 text-center">
                <Shield className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">Habilita "Puede Acceder al Sistema" para configurar acceso y roles</p>
            </div>
        );
    }

    const selectedRoleObjects = roles.filter((r) => selectedRoles.includes(r.value));

    return (
        <div className="space-y-6">
            {error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                </Alert>
            )}

            {/* Credenciales */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Credenciales de Acceso
                    </CardTitle>
                    <CardDescription>Usuario y contraseña del sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de Usuario (Nick)</label>
                        <input
                            type="text"
                            value={usernick}
                            onChange={(e) => onUsernickChange?.(e.target.value)}
                            placeholder="nick_empleado"
                            disabled={disabled}
                            maxLength={50}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <p className="mt-1 text-xs text-gray-500">Se puede usar para iniciar sesión</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Contraseña {!isEditing ? '(Requerida)' : '(Dejar vacía para no cambiar)'}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => onPasswordChange?.(e.target.value)}
                                    placeholder={isEditing ? 'Dejar vacío para mantener actual' : 'Mínimo 8 caracteres'}
                                    disabled={disabled}
                                    minLength={8}
                                    autoComplete="new-password"
                                    spellCheck={false}
                                    data-form-type="other"
                                    data-lpignore="true"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-2.5 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Confirmation */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Contraseña</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordConfirmation}
                                onChange={(e) => onPasswordConfirmationChange?.(e.target.value)}
                                placeholder="Repetir la contraseña"
                                disabled={disabled}
                                minLength={8}
                                autoComplete="new-password"
                                spellCheck={false}
                                data-form-type="other"
                                data-lpignore="true"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Roles y Permisos - Nueva vista mejorada */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Control de Acceso - Roles y Permisos
                    </CardTitle>
                    <CardDescription>Visualiza los roles y permisos asignados y disponibles</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-8 text-center">Cargando información...</div>
                    ) : (
                        <>
                            {/* Vista Unificada: Roles y Permisos */}
                            <div className="space-y-6">
                                    {/* Permisos Directos Asignados - Agrupados por Categoría (Collapsible) */}
                                    {selectedPermissions && selectedPermissions.length > 0 && (
                                        <div>
                                            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                                <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                Permisos Directos ({selectedPermissions.length})
                                            </h4>
                                            {/* Buscador de permisos */}
                                            <div className="relative mb-4">
                                                <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Buscar permisos..."
                                                    value={searchPermiso}
                                                    onChange={(e) => setSearchPermiso(e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                {Object.entries(
                                                    (selectedPermissions as string[])
                                                        .filter((p) => p.toLowerCase().includes(searchPermiso.toLowerCase()))
                                                        .reduce((acc: Record<string, string[]>, permiso: string) => {
                                                            const categoria = permiso.split('.')[0];
                                                            if (!acc[categoria]) acc[categoria] = [];
                                                            acc[categoria].push(permiso);
                                                            return acc;
                                                        }, {}),
                                                )
                                                    .sort(([a], [b]) => a.localeCompare(b))
                                                    .map(([categoria, permisos]) => {
                                                        const isExpanded = expandedCategories[`directo-${categoria}`];
                                                        return (
                                                            <div key={categoria} className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                                                <div
                                                                    onClick={() => toggleCategory(`directo-${categoria}`)}
                                                                    className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
                                                                >
                                                                    {isExpanded ? (
                                                                        <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                    ) : (
                                                                        <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                    )}
                                                                    <p className="flex-1 text-xs font-semibold text-blue-700 uppercase dark:text-blue-300">
                                                                        📂 {categoria} ({permisos.length})
                                                                    </p>
                                                                </div>
                                                                {isExpanded && (
                                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                                        {permisos.map((permiso: string, idx: number) => (
                                                                            <div
                                                                                key={idx}
                                                                                className="flex items-center gap-1 rounded border border-blue-300 bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                                                                            >
                                                                                <span>✓ {permiso.split('.').slice(1).join('.')}</span>
                                                                                {isEditing && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => removePermission(permiso)}
                                                                                        className="ml-1 text-blue-600 transition-colors hover:text-red-600 dark:text-blue-300 dark:hover:text-red-400"
                                                                                        title="Remover permiso"
                                                                                    >
                                                                                        <X className="h-3 w-3" />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}

                                    {/* {!selectedRoles?.length && !selectedPermissions?.length && (
                                        <div className="py-8 text-center text-gray-600 dark:text-gray-400">
                                            <Shield className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                            <p>Sin roles ni permisos asignados</p>
                                        </div>
                                    )} */}
                                </div>

                            {/* Listado Unificado de Permisos */}
                            <div>
                                <div>
                                    {/* Roles Disponibles */}
                                    {rolesDisponiblesDetallados && rolesDisponiblesDetallados.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Todos los Roles</h4>
                                            <div className="relative mb-4">
                                                <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                                                <input type="text" placeholder="Buscar roles..." value={searchRoles} onChange={(e) => setSearchRoles(e.target.value)} className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                {rolesDisponiblesDetallados.filter((role: any) => role.name.toLowerCase().includes(searchRoles.toLowerCase())).map((role: any) => {
                                                    const isSelected = selectedRoles.includes(role.name);
                                                    return (
                                                        <div
                                                            key={role.id}
                                                            onClick={() => toggleRole(role.name)}
                                                            className={`cursor-pointer rounded-lg border-2 p-2 transition-all ${
                                                                isSelected
                                                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-950'
                                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-900'
                                                            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div
                                                                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-all ${
                                                                        isSelected
                                                                            ? 'border-blue-500 bg-blue-500'
                                                                            : 'border-gray-400 dark:border-gray-600'
                                                                    }`}
                                                                >
                                                                    {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                        {role.name}
                                                                    </h5>
                                                                    {role.permissions && role.permissions.length > 0 && (
                                                                        <TooltipProvider>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <div className="mt-2 inline-flex items-center gap-2 cursor-help">
                                                                                        <Badge
                                                                                            variant="outline"
                                                                                            className="bg-blue-100 text-blue-800 text-xs dark:bg-blue-900/40 dark:text-blue-200 border-blue-300 dark:border-blue-700"
                                                                                        >
                                                                                            📋 {role.permissions.length} permisos
                                                                                        </Badge>
                                                                                    </div>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent className="max-w-sm">
                                                                                    <div className="space-y-2">
                                                                                        <p className="font-semibold text-sm">Permisos del rol:</p>
                                                                                        <div className="space-y-1">
                                                                                            {role.permissions.map((perm: string, i: number) => (
                                                                                                <div key={i} className="text-xs py-0.5">
                                                                                                    • {perm}
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-gray-600 dark:text-gray-400">
                                            <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-green-600 opacity-50" />
                                            <p>Todos los roles han sido asignados</p>
                                        </div>
                                    )}

                                    {/* Listado Unificado de Permisos con Checkboxes */}
                                    <div>
                                        {(() => {
                                            const selectedCount = selectedPermissions.length + calculatedInheritedPermissions.length;
                                            const totalCount = Object.values(permisosDisponibles).flat().length;

                                            return (
                                                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    Permisos
                                                    <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                                                        <span>✓ {selectedCount}</span>
                                                        <span className="text-blue-400">/</span>
                                                        <span>{totalCount}</span>
                                                    </span>
                                                </h4>
                                            );
                                        })()}


                                        {/* Buscador */}
                                        <div className="relative mb-4">
                                            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar permisos..."
                                                value={searchPermiso}
                                                onChange={(e) => setSearchPermiso(e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        {/* Listado por Categoría */}
                                        <div className="space-y-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                                            {permisosDisponibles && Object.keys(permisosDisponibles).length > 0 && Object.entries(permisosDisponibles)
                                                .sort(([a], [b]) => a.localeCompare(b))
                                                .map(([categoria, permisos]: [string, any]) => {
                                                    const filteredPermisos = (permisos as string[]).filter((p: string) =>
                                                        p.toLowerCase().includes(searchPermiso.toLowerCase())
                                                    );

                                                    if (filteredPermisos.length === 0) return null;

                                                    const isExpanded = expandedCategories[`permisos-${categoria}`];

                                                    return (
                                                        <div
                                                            key={categoria}
                                                            className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900/30"
                                                        >
                                                            <div
                                                                onClick={() => toggleCategory(`permisos-${categoria}`)}
                                                                className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
                                                            >
                                                                {isExpanded ? (
                                                                    <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                                ) : (
                                                                    <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                                )}
                                                                <p className="flex-1 text-xs font-semibold text-gray-700 uppercase dark:text-gray-300">
                                                                    📂 {categoria} ({filteredPermisos.length})
                                                                </p>
                                                            </div>

                                                            {isExpanded && (
                                                                <div className="mt-3 space-y-2">
                                                                    {filteredPermisos.map((permiso: string, idx: number) => {
                                                                        const isHerited = calculatedInheritedPermissions.includes(permiso);
                                                                        const isDirect = selectedPermissions.includes(permiso);
                                                                        const isChecked = isHerited || isDirect;

                                                                        return (
                                                                            <div
                                                                                key={idx}
                                                                                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id={`perm-${permiso}`}
                                                                                    checked={isChecked}
                                                                                    onChange={(e) => {
                                                                                        if (isHerited && !isDirect) {
                                                                                            // No permitir desmarcar permisos heredados puros
                                                                                            return;
                                                                                        }
                                                                                        if (e.target.checked) {
                                                                                            onPermissionsChange?.([...selectedPermissions, permiso]);
                                                                                        } else {
                                                                                            onPermissionsChange?.(selectedPermissions.filter(p => p !== permiso));
                                                                                        }
                                                                                    }}
                                                                                    disabled={isHerited && !isDirect}
                                                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                />
                                                                                <label
                                                                                    htmlFor={`perm-${permiso}`}
                                                                                    className={`flex-1 text-sm flex items-center gap-2 cursor-pointer ${
                                                                                        isHerited && !isDirect
                                                                                            ? 'cursor-not-allowed opacity-70'
                                                                                            : ''
                                                                                    }`}
                                                                                >
                                                                                    <span>{permiso.split('.').slice(1).join('.')}</span>
                                                                                    {isHerited && (
                                                                                        <Badge variant="outline" className="bg-purple-100 text-purple-700 text-xs dark:bg-purple-900/30 dark:text-purple-200">
                                                                                            heredado
                                                                                        </Badge>
                                                                                    )}
                                                                                </label>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
