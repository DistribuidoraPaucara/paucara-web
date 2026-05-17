/**
 * WebSocket Listeners Service
 *
 * Escucha eventos del servidor WebSocket y maneja las notificaciones
 * de cambios en tiempo real para cierres de caja
 *
 * Eventos soportados:
 * - cierre.pendiente: Nuevo cierre pendiente (para admins)
 * - cierre.consolidado: Cierre aprobado (para cajero)
 * - cierre.rechazado: Cierre rechazado (para cajero)
 */

interface WebSocketMessage {
    event: string;
    data: any;
}

/**
 * Inicializar listeners de WebSocket
 * Debe llamarse cuando se monta el componente principal
 */
export function initializeWebSocketListeners() {
    // Escuchar notificaciones de cierre consolidado
    if (typeof window !== 'undefined' && (window as any).socket) {
        const socket = (window as any).socket;

        socket.on('cierre.consolidado', (data: any) => {
            handleCierreConsolidado(data);
        });

        socket.on('cierre.rechazado', (data: any) => {
            handleCierreRechazado(data);
        });

        socket.on('cierre.pendiente', (data: any) => {
            handleCierrePendiente(data);
        });
    }
}

/**
 * Manejador: Cierre fue consolidado (aprobado)
 * Notificar al cajero que su cierre fue aprobado
 */
function handleCierreConsolidado(data: any) {
    const message = `✅ Tu cierre de caja en ${data.caja} fue consolidado por ${data.verificador}`;

    // Mostrar notificación
    showNotification({
        type: 'success',
        title: 'Cierre Consolidado',
        message: message,
        duration: 5000,
    });

    // Datos adicionales
    console.log('Cierre consolidado:', {
        cierre_id: data.cierre_id,
        caja: data.caja,
        diferencia: data.diferencia,
        observaciones: data.observaciones,
    });

    // Recargar datos o actualizar UI
    // Por ejemplo: window.location.reload() o actualizar estado local
}

/**
 * Manejador: Cierre fue rechazado
 * Notificar al cajero que su cierre fue rechazado con el motivo
 */
function handleCierreRechazado(data: any) {
    const message = `❌ Tu cierre fue rechazado: ${data.motivo}`;

    // Mostrar notificación
    showNotification({
        type: 'error',
        title: 'Cierre Rechazado',
        message: message,
        duration: 0, // No desaparecer automáticamente
    });

    // Mostrar información adicional
    const details = [
        `Caja: ${data.caja}`,
        `Motivo: ${data.motivo}`,
        data.requiere_reapertura ? '⚠️ Requiere reapertura de caja' : null,
    ].filter(Boolean).join('\n');

    console.log('Cierre rechazado:', {
        cierre_id: data.cierre_id,
        caja: data.caja,
        motivo: data.motivo,
        requiere_reapertura: data.requiere_reapertura,
    });

    // Mostrar diálogo adicional
    if (typeof window !== 'undefined') {
        // Aquí puedes disparar un evento personalizado o actualizar estado
        document.dispatchEvent(new CustomEvent('cierre:rechazado', { detail: data }));
    }

    // Recargar página para mostrar el estado actualizado
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

/**
 * Manejador: Nuevo cierre pendiente
 * Notificar a admins de un nuevo cierre que requiere verificación
 */
function handleCierrePendiente(data: any) {
    const message = `🔔 Nuevo cierre pendiente de ${data.usuario} en ${data.caja}`;

    // Mostrar notificación
    showNotification({
        type: 'info',
        title: 'Nuevo Cierre Pendiente',
        message: message,
        duration: 5000,
    });

    // Datos adicionales para el admin
    console.log('Nuevo cierre pendiente:', {
        cierre_id: data.cierre_id,
        caja: data.caja,
        usuario: data.usuario,
        diferencia: data.diferencia,
        monto_esperado: data.monto_esperado,
        monto_real: data.monto_real,
    });

    // Actualizar badge de cierres pendientes
    updatePendientesCount();

    // Disparar evento personalizado
    if (typeof window !== 'undefined') {
        document.dispatchEvent(new CustomEvent('cierre:pendiente', { detail: data }));
    }
}

/**
 * Mostrar notificación en pantalla
 */
function showNotification(options: {
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    duration?: number;
}) {
    // Si existe un sistema de notificaciones personalizado, usar ese
    if (typeof window !== 'undefined' && (window as any).showNotification) {
        (window as any).showNotification(options);
        return;
    }

    // Fallback: usar alert nativo (no es ideal pero funciona)
    alert(`${options.title}\n${options.message}`);

    // En una aplicación real, aquí iría integración con toast/notificación library
    console.log(`[${options.type.toUpperCase()}] ${options.title}: ${options.message}`);
}

/**
 * Actualizar contador de cierres pendientes en el UI
 */
function updatePendientesCount() {
    // Buscar elemento que muestre contador de pendientes
    const badge = document.querySelector('[data-cierre-pendientes-count]');
    if (badge) {
        const currentCount = parseInt(badge.textContent || '0', 10);
        badge.textContent = (currentCount + 1).toString();
    }

    // Disparar evento para que componentes se actualicen
    if (typeof window !== 'undefined') {
        document.dispatchEvent(new CustomEvent('cierres:pendientes:updated'));
    }
}

/**
 * Conectar a WebSocket
 * Debe llamarse cuando sea necesario establecer conexión
 */
export function connectWebSocket(userId: number, userRole: string) {
    if (typeof window === 'undefined') return;

    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';

    try {
        // Si ya existe conexión, no crear otra
        if ((window as any).socket && (window as any).socket.connected) {
            console.log('WebSocket ya está conectado');
            return;
        }

        // Aquí va la lógica de conexión actual que use tu aplicación
        // Por ejemplo, si usas Socket.io, Laravel Echo, etc.
        console.log(`Conectando a WebSocket: ${wsUrl} como usuario ${userId} (${userRole})`);

        // Inicializar listeners después de conectar
        initializeWebSocketListeners();
    } catch (error) {
        console.error('Error conectando a WebSocket:', error);
    }
}

/**
 * Desconectar de WebSocket
 */
export function disconnectWebSocket() {
    if (typeof window !== 'undefined' && (window as any).socket) {
        (window as any).socket.disconnect();
        console.log('Desconectado de WebSocket');
    }
}

/**
 * Escuchar cambios en estado de cierre rechazado
 * Hook para componentes React
 */
export function useWebSocketCierreRechazado(callback: (data: any) => void) {
    React.useEffect(() => {
        const handleRechazado = (event: CustomEvent) => {
            callback(event.detail);
        };

        document.addEventListener('cierre:rechazado', handleRechazado as EventListener);

        return () => {
            document.removeEventListener('cierre:rechazado', handleRechazado as EventListener);
        };
    }, [callback]);
}

/**
 * Escuchar nuevo cierre pendiente
 * Hook para componentes React
 */
export function useWebSocketCierrePendiente(callback: (data: any) => void) {
    React.useEffect(() => {
        const handlePendiente = (event: CustomEvent) => {
            callback(event.detail);
        };

        document.addEventListener('cierre:pendiente', handlePendiente as EventListener);

        return () => {
            document.removeEventListener('cierre:pendiente', handlePendiente as EventListener);
        };
    }, [callback]);
}

/**
 * Escuchar actualizaciones de cierres pendientes
 * Hook para componentes React
 */
export function useWebSocketPendientesUpdated(callback: () => void) {
    React.useEffect(() => {
        const handleUpdate = () => {
            callback();
        };

        document.addEventListener('cierres:pendientes:updated', handleUpdate);

        return () => {
            document.removeEventListener('cierres:pendientes:updated', handleUpdate);
        };
    }, [callback]);
}

// Importar React para los hooks
import React from 'react';
