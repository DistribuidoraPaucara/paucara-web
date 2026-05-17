/**
 * Utility Functions: Cajas (Box Management)
 *
 * Responsabilidades:
 * ✅ Formatting functions for currency and time display
 * ✅ Icon and color helpers for movement visualization
 * ✅ Reusable across Cajas-related components
 */

/**
 * Convertir valor a número (maneja strings de decimales)
 * @example toNumber("1500.50") => 1500.50
 * @example toNumber(1500.50) => 1500.50
 * @example toNumber(null) => 0
 */
export function toNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format currency amount in Bolivianos (BOB)
 * @example formatCurrency(1500) => "Bs 1,500.00"
 */
export function formatCurrency(amount: number | string): string {
    const numAmount = toNumber(amount);
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2
    }).format(numAmount);
}

/**
 * Format time from ISO date string
 * @example formatTime("2025-12-17T14:30:00Z") => "14:30"
 */
export function formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format date and time from ISO date string
 * @example formatDateTime("2025-12-17T14:30:00Z") => "17/12 14:30"
 */
export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit'
    });
    const formattedTime = date.toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${formattedDate} ${formattedTime}`;
}

/**
 * Get directional icon for cash movement
 * - Positive amounts (income) show upward arrow (green)
 * - Negative amounts (expenses) show downward arrow (red)
 * @example getMovimientoIcon(500) => ↗️ (green)
 * @example getMovimientoIcon(-500) => ↘️ (red)
 */
export function getMovimientoIcon(monto: number): JSX.Element {
    if (monto >= 0) {
        return <span className="inline-block w-4 h-4 text-green-500">↗️</span>;
    }
    return <span className="inline-block w-4 h-4 text-red-500">↘️</span>;
}

/**
 * Get text color class for amount display
 * - Positive amounts: green
 * - Negative amounts: red
 * @example getMovimientoColor(500) => "text-green-600"
 * @example getMovimientoColor(-500) => "text-red-600"
 */
export function getMovimientoColor(monto: number): string {
    return monto >= 0 ? 'text-green-600' : 'text-red-600';
}

/**
 * Get Tailwind color classes for caja status badge
 * @example getCajaStatusColor("abierta") => { bg: "bg-green-100", text: "text-green-800" }
 */
export function getCajaStatusClasses(estado: 'abierta' | 'cerrada' | 'sin_abrir') {
    const classes = {
        abierta: {
            bg: 'bg-green-100 dark:bg-green-900',
            text: 'text-green-800 dark:text-green-300',
            icon: '✅'
        },
        cerrada: {
            bg: 'bg-gray-100 dark:bg-gray-700',
            text: 'text-gray-800 dark:text-gray-300',
            icon: '❌'
        },
        sin_abrir: {
            bg: 'bg-red-100 dark:bg-red-900',
            text: 'text-red-800 dark:text-red-300',
            icon: '⚠️'
        }
    };

    return classes[estado];
}

/**
 * Get badge styles for caja status
 * Used in status indicator badge
 */
export function getCajaStatusBadgeClasses(estado: 'abierta' | 'cerrada' | 'sin_abrir') {
    const colors = getCajaStatusClasses(estado);
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`;
}
