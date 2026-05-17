/**
 * Obtiene el color del badge según el nombre del rol
 */
export const getRoleColor = (roleName: string): string => {
    const colors: Record<string, string> = {
        'admin': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
        'manager': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
        'manager_de_ruta': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
        'preventista': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
        'cobrador': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
        'chofer': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
        'user': 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200',
    };
    return colors[roleName] || colors['user'];
};

/**
 * Obtiene el ícono emoji según el tipo de rol
 */
export const getRoleEmoji = (roleName: string): string => {
    const emojis: Record<string, string> = {
        'admin': '👑',
        'manager': '📊',
        'manager_de_ruta': '🗺️',
        'preventista': '📋',
        'cobrador': '💰',
        'chofer': '🚚',
        'user': '👤',
    };
    return emojis[roleName] || '👤';
};

/**
 * Obtiene el color del badge según el tipo de acción en auditoría
 */
export const getAuditActionColor = (action: string): string => {
    const colors: Record<string, string> = {
        'create': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
        'update': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
        'delete': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
        'bulk_update': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
    };
    return colors[action] || colors['update'];
};

/**
 * Formatea el texto de acción de auditoría
 */
export const formatAuditAction = (action: string): string => {
    const translations: Record<string, string> = {
        'create': 'Creado',
        'update': 'Actualizado',
        'delete': 'Eliminado',
        'bulk_update': 'Actualización en lote',
    };
    return translations[action] || action;
};

/**
 * Formatea el tipo de target en auditoría
 */
export const formatTargetType = (type: string): string => {
    const translations: Record<string, string> = {
        'Usuario': 'Usuario',
        'Rol': 'Rol',
        'Permission': 'Permiso',
    };
    return translations[type] || type;
};
