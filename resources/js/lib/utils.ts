import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'BOB'): string {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: currency === 'USD' ? 'USD' : 'BOB',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
    }).format(amount);
}

export function formatCurrencyWith2Decimals(amount: number, currency = 'BOB'): string {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: currency === 'USD' ? 'USD' : 'BOB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

// ✅ NUEVO: Formatear moneda mostrando solo decimales necesarios
export function formatCurrencyMinimalDecimals(amount: number, currency = 'BOB'): string {
    // Determinar cuántos decimales son necesarios
    const decimalPart = amount % 1;
    let minDecimals = 0;
    let maxDecimals = 2;

    if (decimalPart !== 0) {
        // Si tiene decimales, mostrar hasta 2
        const decimalStr = Math.abs(decimalPart).toFixed(2).substring(2);
        minDecimals = decimalStr.length;
    }

    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: currency === 'USD' ? 'USD' : 'BOB',
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: maxDecimals,
    }).format(amount);
}

export function formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(dateObj);
}

export function formatDateTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(dateObj);
}
