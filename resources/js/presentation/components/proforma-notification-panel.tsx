import { useUnifiedNotifications } from '@/application/hooks/use-unified-notifications';
import { useAuth } from '@/application/hooks/use-auth';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/presentation/components/ui/dropdown-menu';
import { Bell, Trash2, BellRing } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect } from 'react';
import type { NotificationType } from '@/domain/entities/websocket-events';

export default function ProformaNotificationPanel() {
  const { user, roles } = useAuth();

  const {
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications,
    requestNotificationPermission,
  } = useUnifiedNotifications({
    userRoles: roles.map((r) => r.toLowerCase()),
    filterByRoles: true,
    autoSubscribePublic: true,
    autoSubscribeUser: user?.id,
    userId: user?.id,
    fetchAlertasVencidas: true,
  });

  // Detectar si hay alertas críticas de créditos no leídas
  const hasUnreadCreditos = notifications.some(
    (n) => n.type === 'creditos' && !n.read
  );

  // Reproducir sonido cuando hay alertas de créditos
  const playAlertSound = () => {
    try {
      // Sonido de alerta de emergencia/crítico (usando beep múltiple)
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Parámetros de sonido: beep agudo y corto
      oscillator.frequency.value = 800; // Frecuencia aguda
      oscillator.type = 'sine';

      // Volumen suave pero perceptible
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);

      // Segundo beep para hacerlo más llamativo
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);

      oscillator2.frequency.value = 1000;
      oscillator2.type = 'sine';
      gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.15);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.35);

      oscillator2.start(audioContext.currentTime + 0.15);
      oscillator2.stop(audioContext.currentTime + 0.35);
    } catch (error) {
      console.log('No se pudo reproducir sonido de alerta:', error);
    }
  };

  // Color mapping for notification types
  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'proforma':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'entrega':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'ruta':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'ubicacion':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'novedad':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'chofer':
        return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'dashboard':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'creditos':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const handleRequestNotification = async () => {
    await requestNotificationPermission();
  };

  // Reproducir sonido cuando hay nuevas alertas de créditos
  useEffect(() => {
    if (hasUnreadCreditos) {
      // Pequeño delay para que el sonido no sea inmediato
      const timer = setTimeout(() => {
        playAlertSound();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [hasUnreadCreditos]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative transition-all ${hasUnreadCreditos ? 'animate-bell-jump animate-bell-pulse' : ''}`}
          title="Notificaciones de sistema"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className={`absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 transition-all ${
                hasUnreadCreditos
                  ? 'bg-red-600 dark:bg-red-500 animate-pulse'
                  : 'bg-red-500 dark:bg-red-600'
              }`}
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 max-h-96 overflow-y-auto dark:bg-slate-800 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-2 dark:border-slate-700">
          <h3 className="font-semibold text-sm dark:text-gray-100">Todas las Notificaciones</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotifications}
              className="text-xs dark:hover:bg-slate-700"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        <DropdownMenuSeparator className="dark:bg-slate-700" />

        {/* Opciones de configuración */}
        <div className="px-4 py-2 space-y-2 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 dark:text-gray-300" />
              <span className="text-xs font-medium dark:text-gray-300">Notificaciones Push</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRequestNotification}
              className="h-6 w-6 p-0 dark:hover:bg-slate-700"
            >
              ✓
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator className="dark:bg-slate-700" />

        {notifications.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground dark:text-gray-400">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay notificaciones</p>
          </div>
        ) : (
          <div className="space-y-0">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 border-b dark:border-slate-700 last:border-0 cursor-pointer transition ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {/* Title with type badge */}
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-lg flex-shrink-0">{notification.title.split(' ')[0]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold dark:text-gray-100 break-words">
                          {notification.title.substring(notification.title.indexOf(' ') + 1)}
                        </p>
                        <Badge
                          className={`inline-block text-xs mt-1 ${getTypeColor(notification.type)}`}
                          variant="outline"
                        >
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 break-words">
                      {notification.message}
                    </p>

                    {/* Timestamp */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>

                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="mt-2 h-1 w-1 rounded-full bg-blue-500 dark:bg-blue-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
