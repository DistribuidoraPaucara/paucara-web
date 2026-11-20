import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Send,
  Smartphone,
  XCircle,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';

// ─── Tipos ─────────────────────────────────────────────────────────────

type Categoria = 'proformas' | 'entregas' | 'creditos' | 'avisos';

interface Resumen {
  emitidas: number;
  eventos: number;
  leidas: number;
  archivadas: number;
  pct_leidas: number;
  push: { enviados: number; fallidos: number };
  dispositivos: { activos: number; usuarios: number };
  por_tipo: { type: string; categoria: Categoria; emitidas: number; leidas: number }[];
}

interface Evento {
  clave: string;
  type: string;
  categoria: Categoria;
  titulo: string;
  mensaje: string;
  url: string | null;
  fecha: string;
  destinatarios: number;
  leidas: number;
}

interface Destinatario {
  user_id: number;
  nombre: string;
  roles: string[];
  estado: 'leida' | 'no_leida' | 'archivada';
  read_at: string | null;
}

interface Envio {
  id: number;
  fecha: string;
  tipo: string;
  titulo: string | null;
  usuario: string;
  dispositivo: string | null;
  estado: 'enviado' | 'fallido';
  error_codigo: string | null;
  error_detalle: string | null;
}

interface Dispositivo {
  id: number;
  usuario: string;
  roles: string[];
  plataforma: string | null;
  dispositivo: string | null;
  app_version: string | null;
  token: string;
  activo: boolean;
  ultimo_sync: string | null;
}

interface Meta {
  current_page: number;
  last_page: number;
  total: number;
}

const META_INICIAL: Meta = { current_page: 1, last_page: 1, total: 0 };
const BASE = '/admin/notificaciones/data';
const hoy = () => format(new Date(), 'yyyy-MM-dd');

const CATEGORIAS: { id: '' | Categoria; label: string }[] = [
  { id: '', label: 'Todas' },
  { id: 'proformas', label: 'Proformas' },
  { id: 'entregas', label: 'Entregas' },
  { id: 'creditos', label: 'Créditos' },
  { id: 'avisos', label: 'Avisos' },
];

const ROLES = ['admin', 'manager', 'preventista', 'cajero', 'chofer', 'cliente'];

const fecha = (iso: string | null) => (iso ? format(new Date(iso), 'd MMM yyyy, HH:mm', { locale: es }) : '—');
const pct = (a: number, b: number) => (b > 0 ? Math.round((a * 100) / b) : 0);

// ─── Componentes pequeños ──────────────────────────────────────────────

function Kpi({ titulo, valor, detalle, icono }: { titulo: string; valor: string | number; detalle?: string; icono: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div>
          <p className="text-xs text-muted-foreground">{titulo}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{valor}</p>
          {detalle && <p className="mt-0.5 text-xs text-muted-foreground">{detalle}</p>}
        </div>
        <div className="text-muted-foreground">{icono}</div>
      </CardContent>
    </Card>
  );
}

function BarraLectura({ leidas, total }: { leidas: number; total: number }) {
  const p = pct(leidas, total);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${p}%` }} />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">
        {leidas}/{total}
      </span>
    </div>
  );
}

function Paginacion({ meta, onCambiar }: { meta: Meta; onCambiar: (p: number) => void }) {
  if (meta.last_page <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <Button variant="outline" size="sm" disabled={meta.current_page <= 1} onClick={() => onCambiar(meta.current_page - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground">
        Página {meta.current_page} de {meta.last_page} · {meta.total} registros
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={meta.current_page >= meta.last_page}
        onClick={() => onCambiar(meta.current_page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

const SELECT = 'h-9 rounded-md border bg-background px-2 text-sm';

// ─── Pestaña: eventos ──────────────────────────────────────────────────

function FilaEvento({ evento, filtros }: { evento: Evento; filtros: Record<string, unknown> }) {
  const [abierto, setAbierto] = useState(false);
  const [destinatarios, setDestinatarios] = useState<Destinatario[] | null>(null);

  const alternar = async () => {
    const abrir = !abierto;
    setAbierto(abrir);
    if (abrir && destinatarios === null) {
      const { data } = await axios.get(`${BASE}/eventos/destinatarios`, {
        params: { clave: evento.clave, rol: filtros.rol, usuario_id: filtros.usuario_id },
      });
      setDestinatarios(data.data ?? []);
    }
  };

  return (
    <Fragment>
      <tr className="cursor-pointer border-b hover:bg-muted/50" onClick={alternar}>
        <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{fecha(evento.fecha)}</td>
        <td className="px-4 py-3">
          <p className="text-sm font-medium">{evento.titulo}</p>
          {evento.mensaje && <p className="text-xs text-muted-foreground">{evento.mensaje}</p>}
        </td>
        <td className="px-4 py-3 text-right text-sm tabular-nums">{evento.destinatarios}</td>
        <td className="px-4 py-3">
          <BarraLectura leidas={evento.leidas} total={evento.destinatarios} />
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            {evento.url && (
              <Link
                href={evento.url}
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-foreground"
                title="Abrir"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
            {abierto ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </td>
      </tr>
      {abierto && (
        <tr className="border-b bg-muted/30">
          <td colSpan={5} className="px-4 py-3">
            {destinatarios === null ? (
              <p className="text-xs text-muted-foreground">Cargando destinatarios…</p>
            ) : (
              <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {destinatarios.map((d) => (
                  <div key={d.user_id} className="flex items-center gap-2 rounded px-2 py-1 text-xs">
                    {d.estado === 'leida' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                    ) : (
                      <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-muted-foreground/40" />
                    )}
                    <span className="truncate font-medium">{d.nombre}</span>
                    <span className="truncate text-muted-foreground">
                      {d.estado === 'leida'
                        ? `leída ${fecha(d.read_at)}`
                        : d.estado === 'archivada'
                          ? 'archivada'
                          : 'sin leer'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </td>
        </tr>
      )}
    </Fragment>
  );
}

function PestanaEventos({ desde, hasta }: { desde: string; hasta: string }) {
  const [categoria, setCategoria] = useState<'' | Categoria>('');
  const [rol, setRol] = useState('');
  const [usuarioTexto, setUsuarioTexto] = useState('');
  const [usuarios, setUsuarios] = useState<{ id: number; name: string }[]>([]);
  const [pagina, setPagina] = useState(1);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [meta, setMeta] = useState<Meta>(META_INICIAL);
  const [cargando, setCargando] = useState(true);

  const usuarioId = useMemo(() => usuarios.find((u) => u.name === usuarioTexto)?.id, [usuarios, usuarioTexto]);
  const filtros = useMemo(
    () => ({ desde, hasta, categoria: categoria || undefined, rol: rol || undefined, usuario_id: usuarioId }),
    [desde, hasta, categoria, rol, usuarioId],
  );

  // Volver a la página 1 cuando cambian los filtros
  useEffect(() => setPagina(1), [filtros]);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    axios
      .get(`${BASE}/eventos`, { params: { ...filtros, page: pagina, per_page: 25 } })
      .then(({ data }) => {
        if (cancelado) return;
        setEventos(data.data ?? []);
        setMeta(data.meta ?? META_INICIAL);
      })
      .finally(() => !cancelado && setCargando(false));
    return () => {
      cancelado = true;
    };
  }, [filtros, pagina]);

  // Sugerencias de usuarios para el filtro
  useEffect(() => {
    const t = setTimeout(() => {
      axios.get(`${BASE}/usuarios`, { params: { q: usuarioTexto } }).then(({ data }) => setUsuarios(data ?? []));
    }, 250);
    return () => clearTimeout(t);
  }, [usuarioTexto]);

  return (
    <Card>
      <CardHeader className="gap-3">
        <CardTitle className="text-base">Eventos emitidos</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {CATEGORIAS.map((c) => (
              <button
                key={c.id || 'todas'}
                type="button"
                onClick={() => setCategoria(c.id)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  categoria === c.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <select value={rol} onChange={(e) => setRol(e.target.value)} className={SELECT} aria-label="Rol">
            <option value="">Todos los roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <Input
            list="usuarios-notif"
            placeholder="Usuario…"
            value={usuarioTexto}
            onChange={(e) => setUsuarioTexto(e.target.value)}
            className="h-9 w-48"
          />
          <datalist id="usuarios-notif">
            {usuarios.map((u) => (
              <option key={u.id} value={u.name} />
            ))}
          </datalist>
        </div>
        {(rol || usuarioId) && (
          <p className="text-xs text-muted-foreground">
            Los conteos de destinatarios y lecturas se limitan al rol o usuario filtrado.
          </p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Fecha</th>
                <th className="px-4 py-2 font-medium">Evento</th>
                <th className="px-4 py-2 text-right font-medium">Destinatarios</th>
                <th className="px-4 py-2 font-medium">Leídas</th>
                <th className="w-16 px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {eventos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    {cargando ? 'Cargando…' : 'No hay eventos en este rango'}
                  </td>
                </tr>
              ) : (
                eventos.map((e) => <FilaEvento key={e.clave} evento={e} filtros={filtros} />)
              )}
            </tbody>
          </table>
        </div>
        <Paginacion meta={meta} onCambiar={setPagina} />
      </CardContent>
    </Card>
  );
}

// ─── Pestaña: envíos push ──────────────────────────────────────────────

function PestanaEnvios({ desde, hasta }: { desde: string; hasta: string }) {
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [meta, setMeta] = useState<Meta>(META_INICIAL);
  const [cargando, setCargando] = useState(true);

  useEffect(() => setPagina(1), [desde, hasta, estado]);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    axios
      .get(`${BASE}/envios`, { params: { desde, hasta, estado: estado || undefined, page: pagina, per_page: 25 } })
      .then(({ data }) => {
        if (cancelado) return;
        setEnvios(data.data ?? []);
        setMeta(data.meta ?? META_INICIAL);
      })
      .finally(() => !cancelado && setCargando(false));
    return () => {
      cancelado = true;
    };
  }, [desde, hasta, estado, pagina]);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle className="text-base">Envíos push (FCM)</CardTitle>
        <select value={estado} onChange={(e) => setEstado(e.target.value)} className={SELECT} aria-label="Estado">
          <option value="">Enviados y fallidos</option>
          <option value="enviado">Solo enviados</option>
          <option value="fallido">Solo fallidos</option>
        </select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Fecha</th>
                <th className="px-4 py-2 font-medium">Notificación</th>
                <th className="px-4 py-2 font-medium">Usuario</th>
                <th className="px-4 py-2 font-medium">Dispositivo</th>
                <th className="px-4 py-2 font-medium">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {envios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    {cargando ? 'Cargando…' : 'No hay envíos push en este rango'}
                  </td>
                </tr>
              ) : (
                envios.map((e) => (
                  <tr key={e.id} className="border-b last:border-0">
                    <td className="whitespace-nowrap px-4 py-2 text-xs text-muted-foreground">{fecha(e.fecha)}</td>
                    <td className="px-4 py-2">
                      <p>{e.titulo ?? e.tipo}</p>
                      <p className="text-xs text-muted-foreground">{e.tipo}</p>
                    </td>
                    <td className="px-4 py-2">{e.usuario}</td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{e.dispositivo ?? '—'}</td>
                    <td className="px-4 py-2">
                      {e.estado === 'enviado' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" /> Enviado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400" title={e.error_detalle ?? ''}>
                          <XCircle className="h-4 w-4" /> {e.error_codigo ?? 'Fallido'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Paginacion meta={meta} onCambiar={setPagina} />
      </CardContent>
    </Card>
  );
}

// ─── Pestaña: dispositivos ─────────────────────────────────────────────

function PestanaDispositivos() {
  const [buscar, setBuscar] = useState('');
  const [activo, setActivo] = useState('1');
  const [pagina, setPagina] = useState(1);
  const [items, setItems] = useState<Dispositivo[]>([]);
  const [meta, setMeta] = useState<Meta>(META_INICIAL);
  const [cargando, setCargando] = useState(true);

  useEffect(() => setPagina(1), [buscar, activo]);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    const t = setTimeout(() => {
      axios
        .get(`${BASE}/dispositivos`, {
          params: { buscar: buscar || undefined, activo: activo || undefined, page: pagina, per_page: 25 },
        })
        .then(({ data }) => {
          if (cancelado) return;
          setItems(data.data ?? []);
          setMeta(data.meta ?? META_INICIAL);
        })
        .finally(() => !cancelado && setCargando(false));
    }, 250);
    return () => {
      cancelado = true;
      clearTimeout(t);
    };
  }, [buscar, activo, pagina]);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle className="text-base">Dispositivos registrados</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Buscar usuario…" value={buscar} onChange={(e) => setBuscar(e.target.value)} className="h-9 w-48" />
          <select value={activo} onChange={(e) => setActivo(e.target.value)} className={SELECT} aria-label="Estado">
            <option value="1">Activos</option>
            <option value="0">Inactivos</option>
            <option value="">Todos</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Usuario</th>
                <th className="px-4 py-2 font-medium">Dispositivo</th>
                <th className="px-4 py-2 font-medium">Versión</th>
                <th className="px-4 py-2 font-medium">Token</th>
                <th className="px-4 py-2 font-medium">Último sync</th>
                <th className="px-4 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    {cargando ? 'Cargando…' : 'No hay dispositivos'}
                  </td>
                </tr>
              ) : (
                items.map((d) => (
                  <tr key={d.id} className="border-b last:border-0">
                    <td className="px-4 py-2">
                      <p className="font-medium">{d.usuario}</p>
                      <p className="text-xs text-muted-foreground">{d.roles.join(', ')}</p>
                    </td>
                    <td className="px-4 py-2">
                      {d.dispositivo ?? '—'}
                      {d.plataforma && <span className="ml-1 text-xs text-muted-foreground">({d.plataforma})</span>}
                    </td>
                    <td className="px-4 py-2 text-xs">{d.app_version ?? '—'}</td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{d.token}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-xs text-muted-foreground">{fecha(d.ultimo_sync)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          d.activo
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {d.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Paginacion meta={meta} onCambiar={setPagina} />
      </CardContent>
    </Card>
  );
}

// ─── Página ────────────────────────────────────────────────────────────

export default function PanelNotificaciones() {
  const [desde, setDesde] = useState(hoy());
  const [hasta, setHasta] = useState(hoy());
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [pestana, setPestana] = useState('eventos');

  const cargarResumen = useCallback(() => {
    axios.get(`${BASE}/resumen`, { params: { desde, hasta } }).then(({ data }) => setResumen(data));
  }, [desde, hasta]);

  useEffect(() => {
    cargarResumen();
  }, [cargarResumen]);

  const rangoRapido = (dias: number) => {
    const d = new Date();
    d.setDate(d.getDate() - dias);
    setDesde(format(d, 'yyyy-MM-dd'));
    setHasta(hoy());
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Panel de notificaciones', href: '/admin/notificaciones' }]}>
      <Head title="Panel de notificaciones" />

      <div className="space-y-4 p-4">
        {/* Encabezado + rango */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Panel de notificaciones</h1>
            <p className="text-sm text-muted-foreground">Qué se emitió, quién lo leyó y cómo van los envíos push</p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => rangoRapido(0)}>
                Hoy
              </Button>
              <Button variant="outline" size="sm" onClick={() => rangoRapido(6)}>
                7 días
              </Button>
              <Button variant="outline" size="sm" onClick={() => rangoRapido(29)}>
                30 días
              </Button>
            </div>
            <label className="flex flex-col text-xs text-muted-foreground">
              Desde
              <Input type="date" value={desde} max={hasta} onChange={(e) => setDesde(e.target.value)} className="h-9 w-40" />
            </label>
            <label className="flex flex-col text-xs text-muted-foreground">
              Hasta
              <Input type="date" value={hasta} min={desde} onChange={(e) => setHasta(e.target.value)} className="h-9 w-40" />
            </label>
          </div>
        </div>

        {/* Indicadores */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            titulo="Notificaciones emitidas"
            valor={resumen?.emitidas.toLocaleString('es-BO') ?? '—'}
            detalle={resumen ? `${resumen.eventos.toLocaleString('es-BO')} eventos` : undefined}
            icono={<Bell className="h-5 w-5" />}
          />
          <Kpi
            titulo="Leídas"
            valor={resumen ? `${resumen.pct_leidas}%` : '—'}
            detalle={
              resumen
                ? `${resumen.leidas.toLocaleString('es-BO')} leídas` +
                  (resumen.archivadas > 0 ? ` · ${resumen.archivadas.toLocaleString('es-BO')} archivadas` : '')
                : undefined
            }
            icono={<CheckCircle2 className="h-5 w-5" />}
          />
          <Kpi
            titulo="Push enviados"
            valor={resumen?.push.enviados.toLocaleString('es-BO') ?? '—'}
            detalle={resumen ? `${resumen.push.fallidos} fallidos` : undefined}
            icono={<Send className="h-5 w-5" />}
          />
          <Kpi
            titulo="Dispositivos activos"
            valor={resumen?.dispositivos.activos ?? '—'}
            detalle={resumen ? `${resumen.dispositivos.usuarios} usuarios con la app` : undefined}
            icono={<Smartphone className="h-5 w-5" />}
          />
        </div>

        {/* Tipos más frecuentes */}
        {resumen && resumen.por_tipo.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tipos más frecuentes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {resumen.por_tipo.map((t) => (
                <div key={t.type} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-mono text-xs">{t.type}</span>
                  <div className="flex items-center gap-3">
                    <span className="tabular-nums">{t.emitidas.toLocaleString('es-BO')}</span>
                    <BarraLectura leidas={t.leidas} total={t.emitidas} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Tabs value={pestana} onValueChange={setPestana}>
          <TabsList>
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
            <TabsTrigger value="envios">Envíos push</TabsTrigger>
            <TabsTrigger value="dispositivos">Dispositivos</TabsTrigger>
          </TabsList>
          <TabsContent value="eventos">
            <PestanaEventos desde={desde} hasta={hasta} />
          </TabsContent>
          <TabsContent value="envios">
            <PestanaEnvios desde={desde} hasta={hasta} />
          </TabsContent>
          <TabsContent value="dispositivos">
            <PestanaDispositivos />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
