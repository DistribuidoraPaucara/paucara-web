# WebSocket Context - Guía de Uso

## 📋 Descripción General

El `WebSocketContext` es la nueva forma recomendada de manejar conexiones WebSocket en la aplicación. Reemplaza el hook anterior `useWebSocket()` y garantiza:

- ✅ **Una única conexión global** por toda la aplicación
- ✅ **Sin reconexiones duplicadas** incluso en React StrictMode
- ✅ **Gestión centralizada** de eventos WebSocket
- ✅ **Compatibilidad** con Inertia.js y Vite

## 🚀 Cómo Usar

### 1. El WebSocketProvider ya está configurado

El `AppLayout` ya envuelve la aplicación con `WebSocketProvider`, así que **no necesitas hacer nada especial**.

### 2. Usar el Context en componentes

Importa y usa `useWebSocketContext` en cualquier componente dentro del layout:

```tsx
import { useWebSocketContext } from '@/application/contexts';
import { useEffect } from 'react';

export function MiComponente() {
  const { isConnected, subscribe, on, emit } = useWebSocketContext();

  useEffect(() => {
    if (isConnected) {
      // Suscribirse a un canal
      subscribe('entrega.123');

      // Escuchar eventos
      on('entrega.123', (data) => {
        console.log('Actualización recibida:', data);
      });
    }
  }, [isConnected]);

  const handleClick = () => {
    // Emitir evento
    emit('mi_evento', { datos: 'importante' });
  };

  return (
    <button onClick={handleClick}>
      {isConnected ? '✅ Conectado' : '❌ Desconectado'}
    </button>
  );
}
```

## 📊 API del Context

```tsx
interface WebSocketContextType {
  // Estado
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  isConnected: boolean;
  socketId: string | null;
  error: string | null;

  // Métodos
  subscribe(channel: string): void;        // Suscribirse a un canal
  unsubscribe(channel: string): void;      // Desuscribirse de un canal
  on(event: string, callback: Function): void;     // Escuchar evento
  off(event: string, callback?: Function): void;   // Dejar de escuchar
  emit(event: string, data: any): void;   // Enviar evento al servidor
}
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Monitorear estado de conexión

```tsx
import { useWebSocketContext } from '@/application/contexts';
import { useEffect, useState } from 'react';

export function EstadoConexion() {
  const { isConnected, error } = useWebSocketContext();

  useEffect(() => {
    if (isConnected) {
      console.log('✅ Conectado al servidor WebSocket');
    }
    if (error) {
      console.error('❌ Error:', error);
    }
  }, [isConnected, error]);

  return <span>{isConnected ? '✅ Online' : '❌ Offline'}</span>;
}
```

### Ejemplo 2: Suscribirse a un canal específico

```tsx
import { useWebSocketContext } from '@/application/contexts';
import { useEffect } from 'react';

interface EntregasProps {
  entregaId: number;
}

export function SeguimientoEntrega({ entregaId }: EntregasProps) {
  const { isConnected, subscribe, unsubscribe, on, off } = useWebSocketContext();

  useEffect(() => {
    if (!isConnected) return;

    const channel = `entrega.${entregaId}`;

    // Suscribirse
    subscribe(channel);

    // Definir callback
    const handleUpdate = (data: any) => {
      console.log('Entrega actualizada:', data);
    };

    // Escuchar eventos
    on('ubicacion.actualizada', handleUpdate);

    // Cleanup
    return () => {
      off('ubicacion.actualizada', handleUpdate);
      unsubscribe(channel);
    };
  }, [isConnected, entregaId, subscribe, unsubscribe, on, off]);

  return <div>Monitoreando entrega {entregaId}...</div>;
}
```

### Ejemplo 3: Emitir eventos al servidor

```tsx
import { useWebSocketContext } from '@/application/contexts';

export function ActualizarUbicacion() {
  const { emit } = useWebSocketContext();

  const handleLocationUpdate = (lat: number, lng: number) => {
    emit('driver_location_update', {
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <button onClick={() => handleLocationUpdate(10.5, 20.3)}>
      Actualizar ubicación
    </button>
  );
}
```

## 🔄 Migración desde `useWebSocket()`

Si tienes componentes usando el hook antiguo `useWebSocket()`, aquí está cómo migrar:

### Antes (Hook antiguo - DEPRECADO)

```tsx
import { useWebSocket } from '@/application/hooks/use-websocket';

export function MiComponente() {
  const { isConnected, subscribeTo, on, emit } = useWebSocket({
    autoConnect: true,
    channels: ['entrega.123']
  });

  // ... resto del código
}
```

### Después (Nuevo Context)

```tsx
import { useWebSocketContext } from '@/application/contexts';
import { useEffect } from 'react';

export function MiComponente() {
  const { isConnected, subscribe, on, emit } = useWebSocketContext();

  useEffect(() => {
    if (isConnected) {
      subscribe('entrega.123');
    }
  }, [isConnected]);

  // ... resto del código
}
```

## ⚠️ Diferencias Principales

| Aspecto | Hook Antiguo | Context Nuevo |
|---------|-------------|---------------|
| Importar | `useWebSocket()` | `useWebSocketContext()` |
| Autoconexión | Por hook | Global (en Provider) |
| Múltiples conexiones | ❌ Posible (problema) | ✅ Una sola |
| React StrictMode | ❌ Problemas | ✅ Funciona bien |
| Configuración | Por componente | Global |

## 🔧 Configuración del Provider

Si necesitas cambiar la configuración, edita `app-layout.tsx`:

```tsx
<WebSocketProvider
  autoConnect={true}           // Conectar automáticamente
  channels={['admin.pedidos']} // Canales iniciales (opcional)
>
  <AppLayoutContent {...props}>
    {children}
  </AppLayoutContent>
</WebSocketProvider>
```

## 🐛 Debugging

Si necesitas debuggear, revisa la consola del navegador. El Context registra mensajes informativos:

```
🚀 Iniciando conexión automática del WebSocket Context...
✅ WebSocket ya está conectado. Reutilizando conexión.
📡 Evento: WebSocket conectado
✅ WebSocket conectado exitosamente en el Context
🎉 WebSocket conectado exitosamente en el Context
```

## 📌 Notas Importantes

1. **Contexto debe estar dentro de AppLayout**: Solo puedes usar `useWebSocketContext()` en componentes que estén dentro de `AppLayout`

2. **Una sola conexión**: El Context garantiza que solo haya una conexión WebSocket abierta, incluso si múltiples componentes lo usan

3. **Cleanup automático**: Los listeners se limpian automáticamente cuando desmonthas componentes

4. **Token de autenticación**: Se obtiene automáticamente de `localStorage` o de las props de Inertia

## 🆘 Solución de Problemas

### Problema: "useWebSocketContext debe ser usado dentro de WebSocketProvider"

**Solución**: Asegúrate de estar usando el hook dentro de un componente que esté dentro de `AppLayout`

### Problema: No está conectando

**Solución**: Verifica que:
- ✅ El usuario esté autenticado
- ✅ El token esté en localStorage
- ✅ El servidor WebSocket esté corriendo en puerto 3001
- ✅ Verifica la consola para mensajes de error

### Problema: Eventos no se reciben

**Solución**:
- Asegúrate de suscriberte al canal correcto: `subscribe('entrega.123')`
- Escucha el evento correcto: `on('ubicacion.actualizada', callback)`
- Verifica que el servidor esté enviando el evento

## 📚 Referencias

- Archivo: `WebSocketContext.tsx`
- Hook antiguo (DEPRECADO): `use-websocket.ts`
- Servicio: `websocket.service.ts`
