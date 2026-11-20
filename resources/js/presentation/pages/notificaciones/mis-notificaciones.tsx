import { useCallback, useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Bell, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useNotifications } from '@/application/contexts/notifications-context';
import type {
  CategoriaNotificacion,
  NotificacionBandeja,
} from '@/application/hooks/use-bandeja-notificaciones';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';

type Estado = 'todas' | 'no_leidas' | 'leidas';

const CATEGORIAS: { id: '' | CategoriaNotificacion; label: string }[] = [
  { id: '', label: 'Todas' },
  { id: 'proformas', label: 'Proformas' },
  { id: 'entregas', label: 'Entregas' },
  { id: 'creditos', label: 'Créditos' },
  { id: 'avisos', label: 'Avisos' },
];

const ETIQUETA_CATEGORIA: Record<CategoriaNotificacion, string> = {
  proformas: 'Proforma',
  entregas: 'Entrega',
  creditos: 'Crédito',
  avisos: 'Aviso',
};

interface Meta {
  current_page: number;
  last_page: number;
  total: number;
}

export default function MisNotificaciones() {
  const { bandeja } = useNotifications();
  const [items, setItems] = useState<NotificacionBandeja[]>([]);
  const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1, total: 0 });
  const [cargando, setCargando] = useState(true);

  const [categoria, setCategoria] = useState<'' | CategoriaNotificacion>('');
  const [estado, setEstado] = useState<Estado>('todas');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [pagina, setPagina] = useState(1);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const { data } = await axios.get('/api/mis-notificaciones/historial', {
        params: {
          categoria: categoria || undefined,
          estado,
          desde: desde || undefined,
          hasta: hasta || undefined,
          page: pagina,
          per_page: 25,
        },
      });
      setItems(data.data ?? []);
      setMeta(data.meta);
    } catch (e) {
      console.warn('No se pudo cargar el historial de notificaciones', e);
    } finally {
      setCargando(false);
    }
  }, [categoria, estado, desde, hasta, pagina]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Al cambiar un filtro, volver a la primera página (mismo render → una sola consulta)
  const filtro = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPagina(1);
  };

  const abrir = async (n: NotificacionBandeja) => {
    if (!n.leida) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, leida: true } : x)));
      axios.post(`/api/mis-notificaciones/${n.id}/marcar-leida`).finally(() => bandeja.recargar());
    }
    if (n.url) router.visit(n.url);
  };

  const marcarTodas = async () => {
    await bandeja.marcarTodasLeidas();
    cargar();
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Mis notificaciones', href: '/mis-notificaciones' }]}>
      <Head title="Mis notificaciones" />

      <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold">Mis notificaciones</h1>
            <p className="text-sm text-muted-foreground">
              {meta.total} {meta.total === 1 ? 'notificación' : 'notificaciones'} · las leídas se conservan 90 días
            </p>
          </div>
          {bandeja.noLeidas > 0 && (
            <Button variant="outline" size="sm" onClick={marcarTodas}>
              <CheckCheck className="mr-1 h-4 w-4" />
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="flex flex-wrap items-end gap-3 p-4">
            <div className="flex flex-wrap gap-1">
              {CATEGORIAS.map((c) => (
                <button
                  key={c.id || 'todas'}
                  type="button"
                  onClick={() => filtro(setCategoria)(c.id)}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    categoria === c.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <select
              value={estado}
              onChange={(e) => filtro(setEstado)(e.target.value as Estado)}
              className="h-9 rounded-md border bg-background px-2 text-sm"
              aria-label="Estado"
            >
              <option value="todas">Leídas y no leídas</option>
              <option value="no_leidas">Solo no leídas</option>
              <option value="leidas">Solo leídas</option>
            </select>

            <label className="flex flex-col text-xs text-muted-foreground">
              Desde
              <Input type="date" value={desde} onChange={(e) => filtro(setDesde)(e.target.value)} className="h-9 w-40" />
            </label>
            <label className="flex flex-col text-xs text-muted-foreground">
              Hasta
              <Input type="date" value={hasta} onChange={(e) => filtro(setHasta)(e.target.value)} className="h-9 w-40" />
            </label>
          </CardContent>
        </Card>

        {/* Lista */}
        <Card>
          <CardContent className="p-0">
            {cargando && items.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">Cargando…</p>
            ) : items.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                <Bell className="mx-auto mb-2 h-8 w-8 opacity-40" />
                No hay notificaciones con estos filtros
              </div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => abrir(n)}
                  className={`flex w-full items-start gap-3 border-b px-4 py-3 text-left transition last:border-0 hover:bg-muted/60 ${
                    n.leida ? '' : 'bg-blue-50/70 dark:bg-blue-900/20'
                  }`}
                >
                  <span
                    className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${n.leida ? 'bg-transparent' : 'bg-blue-500'}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-sm ${n.leida ? '' : 'font-semibold'}`}>{n.titulo}</p>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        {ETIQUETA_CATEGORIA[n.categoria]}
                      </span>
                    </div>
                    {n.mensaje && <p className="mt-0.5 break-words text-sm text-muted-foreground">{n.mensaje}</p>}
                  </div>
                  <time className="whitespace-nowrap text-xs text-muted-foreground" dateTime={n.created_at}>
                    {format(new Date(n.created_at), "d MMM, HH:mm", { locale: es })}
                  </time>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Paginación */}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {meta.current_page} de {meta.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagina >= meta.last_page}
              onClick={() => setPagina((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
