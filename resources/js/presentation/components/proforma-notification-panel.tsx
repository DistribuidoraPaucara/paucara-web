import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { useNotifications } from '@/application/contexts/notifications-context';
import type {
  CategoriaNotificacion,
  NotificacionBandeja,
} from '@/application/hooks/use-bandeja-notificaciones';
import { Button } from '@/presentation/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/presentation/components/ui/dropdown-menu';
import { Bell, BellRing, CheckCheck, AlertTriangle, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

type Pestana = 'todas' | CategoriaNotificacion;

const PESTANAS: { id: Pestana; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'proformas', label: 'Proformas' },
  { id: 'entregas', label: 'Entregas' },
  { id: 'creditos', label: 'Créditos' },
  { id: 'avisos', label: 'Avisos' },
];

const COLOR_CATEGORIA: Record<CategoriaNotificacion, string> = {
  proformas: 'bg-blue-500',
  entregas: 'bg-green-500',
  creditos: 'bg-amber-500',
  avisos: 'bg-purple-500',
};

/**
 * Campana del header: bandeja persistida (hoy + no leídas), con pestañas por
 * categoría y una tarjeta resumen de cuentas vencidas.
 */
export default function ProformaNotificationPanel() {
  const { bandeja, requestNotificationPermission } = useNotifications();
  const { items, noLeidas, porCategoria, vencidas, cargando, marcarLeida, marcarTodasLeidas } = bandeja;
  const [pestana, setPestana] = useState<Pestana>('todas');
  const [abierto, setAbierto] = useState(false);

  const visibles = pestana === 'todas' ? items : items.filter((n) => n.categoria === pestana);

  const abrirNotificacion = (n: NotificacionBandeja) => {
    marcarLeida(n.id);
    if (n.url) {
      setAbierto(false);
      router.visit(n.url);
    }
  };

  return (
    <DropdownMenu open={abierto} onOpenChange={setAbierto}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" title="Notificaciones">
          <Bell className="h-5 w-5" />
          {noLeidas > 0 && (
            <span
              aria-label={`${noLeidas} notificaciones sin leer`}
              className="pointer-events-none absolute right-1 top-1 flex h-[18px] min-w-[18px] translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white tabular-nums ring-2 ring-background"
            >
              {noLeidas > 99 ? '99+' : noLeidas}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[26rem] max-w-[calc(100vw-1rem)] p-0 dark:bg-slate-800 dark:border-slate-700"
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h3 className="font-semibold text-sm dark:text-gray-100">Notificaciones</h3>
            <p className="text-xs text-muted-foreground">
              {noLeidas > 0 ? `${noLeidas} sin leer` : 'Estás al día'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Activar notificaciones del navegador"
              onClick={() => requestNotificationPermission()}
            >
              <BellRing className="h-4 w-4" />
            </Button>
            {noLeidas > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={marcarTodasLeidas}>
                <CheckCheck className="h-3.5 w-3.5 mr-1" />
                Marcar todas
              </Button>
            )}
          </div>
        </div>

        {/* Tarjeta resumen de cuentas vencidas */}
        {vencidas && vencidas.total > 0 && (
          <Link
            href="/ventas/cuentas-por-cobrar"
            onClick={() => setAbierto(false)}
            className="mx-3 mb-2 flex items-center gap-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-800 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
          >
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <div className="flex-1 text-xs">
              <p className="font-semibold">
                {vencidas.total} {vencidas.total === 1 ? 'cuenta vencida' : 'cuentas vencidas'}
              </p>
              <p>Bs. {vencidas.monto_total.toLocaleString('es-BO', { minimumFractionDigits: 2 })} por cobrar</p>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}

        {/* Pestañas */}
        <div className="flex gap-1 overflow-x-auto px-3 pb-2">
          {PESTANAS.map((p) => {
            const count = p.id === 'todas' ? noLeidas : porCategoria[p.id];
            const activa = pestana === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPestana(p.id)}
                className={`flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs transition ${
                  activa
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {p.label}
                {count > 0 && <span className="font-semibold">{count > 99 ? '99+' : count}</span>}
              </button>
            );
          })}
        </div>

        <DropdownMenuSeparator className="m-0 dark:bg-slate-700" />

        {/* Lista */}
        <div className="max-h-[22rem] overflow-y-auto">
          {visibles.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <Bell className="mx-auto mb-2 h-8 w-8 opacity-40" />
              <p>{cargando ? 'Cargando…' : 'No hay notificaciones de hoy'}</p>
            </div>
          ) : (
            visibles.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => abrirNotificacion(n)}
                className={`flex w-full gap-3 border-b px-4 py-3 text-left transition last:border-0 hover:bg-muted/60 dark:border-slate-700 ${
                  n.leida ? '' : 'bg-blue-50/70 dark:bg-blue-900/20'
                }`}
              >
                <span
                  className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                    n.leida ? 'bg-transparent' : COLOR_CATEGORIA[n.categoria]
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm dark:text-gray-100 ${n.leida ? '' : 'font-semibold'}`}>{n.titulo}</p>
                  {n.mensaje && (
                    <p className="mt-0.5 break-words text-xs text-gray-600 dark:text-gray-300">{n.mensaje}</p>
                  )}
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: es })}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <DropdownMenuSeparator className="m-0 dark:bg-slate-700" />

        <Link
          href="/mis-notificaciones"
          onClick={() => setAbierto(false)}
          className="block px-4 py-2.5 text-center text-xs font-medium text-primary hover:bg-muted/60"
        >
          Ver todas las notificaciones
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
