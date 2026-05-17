import type { ReactNode } from 'react';
import { Eye, Plus, Pencil, Trash2, Shield } from 'lucide-react';

/**
 * Obtiene el color del badge según el tipo de permiso
 */
export const getPermissionBadgeColor = (permissionName: string): string => {
    if (permissionName.includes('.index') || permissionName.includes('.show')) {
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200';
    }
    if (permissionName.includes('.create') || permissionName.includes('.store')) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200';
    }
    if (permissionName.includes('.edit') || permissionName.includes('.update')) {
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200';
    }
    if (permissionName.includes('.destroy') || permissionName.includes('.delete')) {
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200';
};

/**
 * Obtiene el ícono según el tipo de permiso
 */
export const getPermissionIcon = (permissionName: string): ReactNode => {
    if (permissionName.includes('.index') || permissionName.includes('.show')) {
        return <Eye className="w-3 h-3" />;
    }
    if (permissionName.includes('.create') || permissionName.includes('.store')) {
        return <Plus className="w-3 h-3" />;
    }
    if (permissionName.includes('.edit') || permissionName.includes('.update')) {
        return <Pencil className="w-3 h-3" />;
    }
    if (permissionName.includes('.destroy') || permissionName.includes('.delete')) {
        return <Trash2 className="w-3 h-3" />;
    }
    return <Shield className="w-3 h-3" />;
};

/**
 * Formatea el nombre del permiso en un formato más legible
 */
export const formatPermissionName = (name: string): string => {
    const parts = name.split('.');
    if (parts.length >= 2) {
        const module = parts[0].replace(/([A-Z])/g, ' $1').trim();
        const action = parts[1].replace(/([A-Z])/g, ' $1').trim();
        return `${module}: ${action}`;
    }
    return name.replace(/([A-Z])/g, ' $1').trim();
};
