import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useWebSocketContext } from '@/application/contexts/WebSocketContext';

interface PrestamoClienteData {
    id: number;
    cliente_id: number;
    cliente_nombre: string;
    cantidad: number;
    estado: string;
    creador_nombre: string;
    fecha_creacion?: string;
    items: Array<{
        prestable_id: number;
        prestable_nombre: string;
        cantidad_prestada: number;
    }>;
}

interface PrestamoClienteAnuladoData extends PrestamoClienteData {
    razon_anulacion?: string;
    anulador_nombre: string;
    fecha_anulacion: string;
}

interface PrestamoEventoData {
    id: number;
    nombre_evento: string;
    cantidad: number;
    estado: string;
    creador_nombre: string;
    encargado_evento?: string;
    fecha_creacion?: string;
    items: Array<{
        prestable_id: number;
        prestable_nombre: string;
        cantidad_prestada: number;
    }>;
}

interface PrestamoEventoAnuladoData extends PrestamoEventoData {
    razon_anulacion?: string;
    anulador_nombre: string;
    fecha_anulacion: string;
}

interface PrestamoProveedorData {
    id: number;
    proveedor_id: number;
    proveedor_nombre: string;
    cantidad: number;
    estado: string;
    creador_nombre: string;
    fecha_creacion?: string;
    items: Array<{
        prestable_id: number;
        prestable_nombre: string;
        cantidad_prestada: number;
    }>;
}

interface PrestamoProveedorAnuladoData extends PrestamoProveedorData {
    razon_anulacion?: string;
    anulador_nombre: string;
    fecha_anulacion: string;
}

interface DevolucionClienteData {
    id: number;
    devolucion_numero: string | number;
    prestamo_id: number;
    cliente_nombre: string;
    cantidad_devuelto: number;
    registrado_por: string;
    fecha_registro?: string;
    items: Array<{
        prestable_id: number;
        prestable_nombre: string;
        cantidad: number;
    }>;
}

interface DevolucionClienteAnuladaData extends DevolucionClienteData {
    razon_anulacion?: string;
    anulado_por: string;
    fecha_anulacion: string;
}

interface DevolucionEventoData {
    id: number;
    prestamo_id: number;
    nombre_evento: string;
    cantidad_devuelto: number;
    registrado_por: string;
    fecha_registro?: string;
    items: Array<{
        prestable_id: number;
        prestable_nombre: string;
        cantidad: number;
    }>;
}

interface DevolucionEventoAnuladaData extends DevolucionEventoData {
    razon_anulacion?: string;
    anulado_por: string;
    fecha_anulacion: string;
}

interface DevolucionProveedorData {
    id: number;
    prestamo_id: number;
    proveedor_nombre: string;
    cantidad_devuelto: number;
    registrado_por: string;
    fecha_registro?: string;
    items: Array<{
        prestable_id: number;
        prestable_nombre: string;
        cantidad: number;
    }>;
}

interface DevolucionProveedorAnuladaData extends DevolucionProveedorData {
    razon_anulacion?: string;
    anulado_por: string;
    fecha_anulacion: string;
}

/**
 * Hook para escuchar notificaciones de préstamos
 *
 * Actualmente escucha:
 * - prestamo.cliente.creado: Cuando se crea un préstamo a cliente
 * - prestamo.cliente.anulado: Cuando se anula un préstamo a cliente
 * - prestamo.evento.creado: Cuando se crea un préstamo a evento
 * - prestamo.evento.anulado: Cuando se anula un préstamo a evento
 * - prestamo.proveedor.creado: Cuando se crea un préstamo a proveedor
 * - prestamo.proveedor.anulado: Cuando se anula un préstamo a proveedor
 * - devolucion.cliente.registrada: Cuando se registra una devolución a cliente
 * - devolucion.cliente.anulada: Cuando se anula una devolución a cliente
 * - devolucion.evento.registrada: Cuando se registra una devolución a evento
 * - devolucion.evento.anulada: Cuando se anula una devolución a evento
 * - devolucion.proveedor.registrada: Cuando se registra una devolución a proveedor
 * - devolucion.proveedor.anulada: Cuando se anula una devolución a proveedor
 *
 * Comportamiento:
 * - Muestra notificación toast con los detalles
 * - Puede actualizar listas relacionadas si es necesario
 */
export function usePrestamoNotification() {
    const { on, off } = useWebSocketContext();

    useEffect(() => {
        // Handler para creación de préstamo a cliente
        const handlePrestamoClienteCreado = (data: PrestamoClienteData) => {
            console.log('🎁 [usePrestamoNotification] Evento prestamo.cliente.creado recibido:', data);

            // Construir mensaje con información del préstamo
            const mensaje = `
                ✨ Préstamo Creado

                Cliente: ${data.cliente_nombre}
                Cantidad: ${data.cantidad} items
                Creado por: ${data.creador_nombre}
            `.trim();

            // Mostrar notificación
            toast.success(mensaje, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.log('✅ [usePrestamoNotification] Notificación de creación mostrada');
        };

        // Handler para anulación de préstamo a cliente
        const handlePrestamoClienteAnulado = (data: PrestamoClienteAnuladoData) => {
            console.log('🎁 [usePrestamoNotification] Evento prestamo.cliente.anulado recibido:', data);

            // Construir mensaje con información del préstamo
            const mensaje = `
                📋 Préstamo Anulado

                Cliente: ${data.cliente_nombre}
                Cantidad: ${data.cantidad} items
                Anulado por: ${data.anulador_nombre}
                ${data.razon_anulacion ? `Razón: ${data.razon_anulacion}` : ''}
            `.trim();

            // Mostrar notificación
            toast.warning(mensaje, {
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.log('✅ [usePrestamoNotification] Notificación de anulación mostrada');
        };

        // Handler para creación de préstamo a evento
        const handlePrestamoEventoCreado = (data: PrestamoEventoData) => {
            console.log('🎪 [usePrestamoNotification] Evento prestamo.evento.creado recibido:', data);

            // Construir mensaje con información del préstamo
            const mensaje = `
                ✨ Préstamo a Evento Creado

                Evento: ${data.nombre_evento}
                Cantidad: ${data.cantidad} items
                Creado por: ${data.creador_nombre}
            `.trim();

            // Mostrar notificación
            toast.success(mensaje, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.log('✅ [usePrestamoNotification] Notificación de creación de evento mostrada');
        };

        // Handler para anulación de préstamo a evento
        const handlePrestamoEventoAnulado = (data: PrestamoEventoAnuladoData) => {
            console.log('🎪 [usePrestamoNotification] Evento prestamo.evento.anulado recibido:', data);

            // Construir mensaje con información del préstamo
            const mensaje = `
                📋 Préstamo a Evento Anulado

                Evento: ${data.nombre_evento}
                Cantidad: ${data.cantidad} items
                Anulado por: ${data.anulador_nombre}
                ${data.razon_anulacion ? `Razón: ${data.razon_anulacion}` : ''}
            `.trim();

            // Mostrar notificación
            toast.warning(mensaje, {
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.log('✅ [usePrestamoNotification] Notificación de anulación de evento mostrada');
        };

        // Handler para creación de préstamo a proveedor
        const handlePrestamoProveedorCreado = (data: PrestamoProveedorData) => {
            console.log('📦 [usePrestamoNotification] Evento prestamo.proveedor.creado recibido:', data);

            // Construir mensaje con información del préstamo
            const mensaje = `
                ✨ Préstamo a Proveedor Creado

                Proveedor: ${data.proveedor_nombre}
                Cantidad: ${data.cantidad} items
                Creado por: ${data.creador_nombre}
            `.trim();

            // Mostrar notificación
            toast.success(mensaje, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.log('✅ [usePrestamoNotification] Notificación de creación de proveedor mostrada');
        };

        // Handler para anulación de préstamo a proveedor
        const handlePrestamoProveedorAnulado = (data: PrestamoProveedorAnuladoData) => {
            console.log('📦 [usePrestamoNotification] Evento prestamo.proveedor.anulado recibido:', data);

            // Construir mensaje con información del préstamo
            const mensaje = `
                📋 Préstamo a Proveedor Anulado

                Proveedor: ${data.proveedor_nombre}
                Cantidad: ${data.cantidad} items
                Anulado por: ${data.anulador_nombre}
                ${data.razon_anulacion ? `Razón: ${data.razon_anulacion}` : ''}
            `.trim();

            // Mostrar notificación
            toast.warning(mensaje, {
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.log('✅ [usePrestamoNotification] Notificación de anulación de proveedor mostrada');
        };

        // Handler para registración de devolución de cliente
        const handleDevolucionClienteRegistrada = (data: DevolucionClienteData) => {
            console.log('🔄 [usePrestamoNotification] Evento devolucion.cliente.registrada recibido:', data);

            const mensaje = `
                🔄 Devolución Registrada

                Cliente: ${data.cliente_nombre}
                Cantidad: ${data.cantidad_devuelto} items
                Registrado por: ${data.registrado_por}
            `.trim();

            toast.info(mensaje, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.log('✅ [usePrestamoNotification] Notificación de devolución registrada mostrada');
        };

        // Handler para anulación de devolución de cliente
        const handleDevolucionClienteAnulada = (data: DevolucionClienteAnuladaData) => {
            console.log('🔄 [usePrestamoNotification] Evento devolucion.cliente.anulada recibido:', data);

            const mensaje = `
                ⚠️ Devolución Anulada

                Cliente: ${data.cliente_nombre}
                Cantidad: ${data.cantidad_devuelto} items
                Anulado por: ${data.anulado_por}
                ${data.razon_anulacion ? `Razón: ${data.razon_anulacion}` : ''}
            `.trim();

            toast.error(mensaje, {
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.log('✅ [usePrestamoNotification] Notificación de devolución anulada mostrada');
        };

        // Handler para registración de devolución de evento
        const handleDevolucionEventoRegistrada = (data: DevolucionEventoData) => {
            console.log('🎪 [usePrestamoNotification] Evento devolucion.evento.registrada recibido:', data);

            const mensaje = `
                🔄 Devolución Evento Registrada

                Evento: ${data.nombre_evento}
                Cantidad: ${data.cantidad_devuelto} items
                Registrado por: ${data.registrado_por}
            `.trim();

            toast.info(mensaje, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.log('✅ [usePrestamoNotification] Notificación de devolución evento registrada mostrada');
        };

        // Handler para anulación de devolución de evento
        const handleDevolucionEventoAnulada = (data: DevolucionEventoAnuladaData) => {
            console.log('🎪 [usePrestamoNotification] Evento devolucion.evento.anulada recibido:', data);

            const mensaje = `
                ⚠️ Devolución Evento Anulada

                Evento: ${data.nombre_evento}
                Cantidad: ${data.cantidad_devuelto} items
                Anulado por: ${data.anulado_por}
                ${data.razon_anulacion ? `Razón: ${data.razon_anulacion}` : ''}
            `.trim();

            toast.error(mensaje, {
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.log('✅ [usePrestamoNotification] Notificación de devolución evento anulada mostrada');
        };

        // Handler para registración de devolución de proveedor
        const handleDevolucionProveedorRegistrada = (data: DevolucionProveedorData) => {
            console.log('📦 [usePrestamoNotification] Evento devolucion.proveedor.registrada recibido:', data);

            const mensaje = `
                🔄 Devolución Proveedor Registrada

                Proveedor: ${data.proveedor_nombre}
                Cantidad: ${data.cantidad_devuelto} items
                Registrado por: ${data.registrado_por}
            `.trim();

            toast.info(mensaje, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.log('✅ [usePrestamoNotification] Notificación de devolución proveedor registrada mostrada');
        };

        // Handler para anulación de devolución de proveedor
        const handleDevolucionProveedorAnulada = (data: DevolucionProveedorAnuladaData) => {
            console.log('📦 [usePrestamoNotification] Evento devolucion.proveedor.anulada recibido:', data);

            const mensaje = `
                ⚠️ Devolución Proveedor Anulada

                Proveedor: ${data.proveedor_nombre}
                Cantidad: ${data.cantidad_devuelto} items
                Anulado por: ${data.anulado_por}
                ${data.razon_anulacion ? `Razón: ${data.razon_anulacion}` : ''}
            `.trim();

            toast.error(mensaje, {
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.log('✅ [usePrestamoNotification] Notificación de devolución proveedor anulada mostrada');
        };

        // Escuchar eventos
        on('prestamo.cliente.creado', handlePrestamoClienteCreado);
        on('prestamo.cliente.anulado', handlePrestamoClienteAnulado);
        on('prestamo.evento.creado', handlePrestamoEventoCreado);
        on('prestamo.evento.anulado', handlePrestamoEventoAnulado);
        on('prestamo.proveedor.creado', handlePrestamoProveedorCreado);
        on('prestamo.proveedor.anulado', handlePrestamoProveedorAnulado);
        on('devolucion.cliente.registrada', handleDevolucionClienteRegistrada);
        on('devolucion.cliente.anulada', handleDevolucionClienteAnulada);
        on('devolucion.evento.registrada', handleDevolucionEventoRegistrada);
        on('devolucion.evento.anulada', handleDevolucionEventoAnulada);
        on('devolucion.proveedor.registrada', handleDevolucionProveedorRegistrada);
        on('devolucion.proveedor.anulada', handleDevolucionProveedorAnulada);

        console.log('🎧 [usePrestamoNotification] Listeners agregados');
        console.log('   - prestamo.cliente.creado');
        console.log('   - prestamo.cliente.anulado');
        console.log('   - prestamo.evento.creado');
        console.log('   - prestamo.evento.anulado');
        console.log('   - prestamo.proveedor.creado');
        console.log('   - prestamo.proveedor.anulado');
        console.log('   - devolucion.cliente.registrada');
        console.log('   - devolucion.cliente.anulada');
        console.log('   - devolucion.evento.registrada');
        console.log('   - devolucion.evento.anulada');
        console.log('   - devolucion.proveedor.registrada');
        console.log('   - devolucion.proveedor.anulada');

        // Cleanup
        return () => {
            off('prestamo.cliente.creado', handlePrestamoClienteCreado);
            off('prestamo.cliente.anulado', handlePrestamoClienteAnulado);
            off('prestamo.evento.creado', handlePrestamoEventoCreado);
            off('prestamo.evento.anulado', handlePrestamoEventoAnulado);
            off('prestamo.proveedor.creado', handlePrestamoProveedorCreado);
            off('prestamo.proveedor.anulado', handlePrestamoProveedorAnulado);
            off('devolucion.cliente.registrada', handleDevolucionClienteRegistrada);
            off('devolucion.cliente.anulada', handleDevolucionClienteAnulada);
            off('devolucion.evento.registrada', handleDevolucionEventoRegistrada);
            off('devolucion.evento.anulada', handleDevolucionEventoAnulada);
            off('devolucion.proveedor.registrada', handleDevolucionProveedorRegistrada);
            off('devolucion.proveedor.anulada', handleDevolucionProveedorAnulada);
            console.log('🎧 [usePrestamoNotification] Listeners removidos');
        };
    }, [on, off]);
}
