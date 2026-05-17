/**
 * Componente de EJEMPLO para mostrar cómo usar WebSocketContext
 * Este archivo NO debe ser usado en producción, solo como referencia
 */

import { useWebSocketContext } from './WebSocketContext';
import { useEffect, useState } from 'react';

export function WebSocketStatusExample() {
  const { isConnected, socketId, status, error } = useWebSocketContext();

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
      <h3>Estado de Conexión WebSocket</h3>
      <p>
        <strong>Estado:</strong> <span style={{ color: isConnected ? 'green' : 'red' }}>
          {status.toUpperCase()}
        </span>
      </p>
      <p><strong>Socket ID:</strong> {socketId || 'N/A'}</p>
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
    </div>
  );
}

/**
 * Ejemplo: Componente que se suscribe a un canal
 */
export function ChannelSubscriptionExample() {
  const { isConnected, subscribe, unsubscribe, on, off } = useWebSocketContext();
  const [messages, setMessages] = useState<string[]>([]);
  const [channelName] = useState('entrega.123');

  useEffect(() => {
    if (!isConnected) return;

    console.log(`📡 Suscribiendo a canal: ${channelName}`);
    subscribe(channelName);

    const handleMessage = (data: any) => {
      const message = `[${new Date().toLocaleTimeString()}] ${JSON.stringify(data)}`;
      setMessages(prev => [...prev, message].slice(-10)); // Mantener últimos 10 mensajes
      console.log(`📨 Mensaje recibido: ${message}`);
    };

    on('ubicacion.actualizada', handleMessage);

    return () => {
      console.log(`🚫 Desuscribiendo de canal: ${channelName}`);
      off('ubicacion.actualizada', handleMessage);
      unsubscribe(channelName);
    };
  }, [isConnected, channelName, subscribe, unsubscribe, on, off]);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
      <h3>Mensajes del canal: {channelName}</h3>
      <div style={{ height: '200px', overflow: 'auto', backgroundColor: '#f5f5f5', padding: '0.5rem' }}>
        {messages.length === 0 ? (
          <p style={{ color: '#999' }}>Esperando mensajes...</p>
        ) : (
          messages.map((msg, idx) => <p key={idx} style={{ fontSize: '0.85rem' }}>{msg}</p>)
        )}
      </div>
    </div>
  );
}

/**
 * Ejemplo: Componente que emite eventos
 */
export function EmitEventExample() {
  const { emit } = useWebSocketContext();

  const handleSendEvent = () => {
    const data = {
      latitude: 10.5,
      longitude: 20.3,
      timestamp: new Date().toISOString(),
    };

    console.log('📤 Enviando evento:', data);
    emit('driver_location_update', data);
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
      <h3>Emitir Evento</h3>
      <button onClick={handleSendEvent} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Enviar ubicación de conductor
      </button>
    </div>
  );
}

/**
 * Ejemplo completo: Componente que monitorea múltiples eventos
 */
export function CompleteExample() {
  const { isConnected, subscribe, on, off, emit } = useWebSocketContext();
  const [status, setStatus] = useState<string>('desconectado');
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (!isConnected) {
      setStatus('desconectado');
      return;
    }

    setStatus('conectado');
    subscribe('entrega.123');

    const handlers = {
      'ubicacion.actualizada': (data: any) => {
        const msg = `Ubicación actualizada: ${data.latitude}, ${data.longitude}`;
        setNotifications(prev => [...prev, msg].slice(-5));
      },
      'entrega.estado-cambio': (data: any) => {
        const msg = `Estado cambió a: ${data.estado}`;
        setNotifications(prev => [...prev, msg].slice(-5));
      },
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      on(event, handler as any);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        off(event, handler as any);
      });
    };
  }, [isConnected, subscribe, on, off]);

  return (
    <div style={{ padding: '1rem', border: '2px solid #007bff' }}>
      <h2>Ejemplo Completo - Monitor de Entregas</h2>

      <div style={{ marginBottom: '1rem' }}>
        <p>
          <strong>Estado:</strong>{' '}
          <span style={{ color: status === 'conectado' ? 'green' : 'red', fontWeight: 'bold' }}>
            {status.toUpperCase()}
          </span>
        </p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h4>Notificaciones recientes:</h4>
        <ul style={{ backgroundColor: '#f9f9f9', padding: '1rem' }}>
          {notifications.length === 0 ? (
            <li style={{ color: '#999' }}>Sin notificaciones</li>
          ) : (
            notifications.map((notif, idx) => <li key={idx}>{notif}</li>)
          )}
        </ul>
      </div>

      <button
        onClick={() => emit('shipment_status_check', { shipment_id: 123 })}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none' }}
      >
        Verificar estado del envío
      </button>
    </div>
  );
}
