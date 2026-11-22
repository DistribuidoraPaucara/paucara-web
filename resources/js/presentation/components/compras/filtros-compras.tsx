import { useEffect, useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import SearchSelect from '@/presentation/components/ui/search-select';
import { Filter, RotateCcw, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Importar tipos del domain
import type { FiltrosCompras, DatosParaFiltrosCompras } from '@/domain/entities/compras';

// Importar service
import comprasService from '@/infrastructure/services/compras.service';

interface Props {
    filtros?: FiltrosCompras;
    datosParaFiltros?: DatosParaFiltrosCompras;
    className?: string;
}

type ClaveFiltro = Exclude<keyof FiltrosCompras, 'sort_by' | 'sort_dir'>;

// Fecha en formato yyyy-mm-dd usando la zona horaria local (toISOString usaría UTC y cambiaría el día)
const fechaLocal = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Muestra una fecha yyyy-mm-dd como dd/mm/yyyy sin desfase de zona horaria
const mostrarFecha = (valor: string) => {
    const [y, m, d] = valor.split('-');
    return y && m && d ? `${d}/${m}/${y}` : valor;
};

// Valor de un SearchSelect (puede venir null al limpiarlo)
const valorSelect = (v: unknown) => (v === null || v === undefined || v === '' ? '' : String(v));

const chipClase = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    slate: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    violet: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
};

function Chip({ texto, color, onQuitar }: { texto: string; color: keyof typeof chipClase; onQuitar: () => void }) {
    return (
        <span className={cn('inline-flex items-center gap-1 rounded-full py-1 pr-1 pl-2 text-xs', chipClase[color])}>
            {texto}
            <button
                type="button"
                onClick={onQuitar}
                className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                aria-label={`Quitar filtro ${texto}`}
                title="Quitar este filtro"
            >
                <X className="h-3 w-3" />
            </button>
        </span>
    );
}

export default function FiltrosCompras({ filtros, datosParaFiltros, className }: Props) {
    // Los filtros vigentes son los de la URL (props). Cada cambio se aplica sobre ellos y recarga el listado.
    const filtrosUrl: FiltrosCompras = filtros || {};
    // El orden se elige en los encabezados de la tabla: siempre se toma de la URL actual
    const orden = { sort_by: filtrosUrl.sort_by, sort_dir: filtrosUrl.sort_dir };
    const datosSeguras: DatosParaFiltrosCompras = datosParaFiltros || { proveedores: [], estados: [], monedas: [], tipos_pago: [], usuarios: [] };

    const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

    // Borradores de los campos que se escriben (monto y fechas): se aplican al completar un valor válido
    const [busquedaCombinada, setBusquedaCombinada] = useState<string>(String(filtrosUrl.q || filtrosUrl.id || ''));
    const [montoMin, setMontoMin] = useState<string>(String(filtrosUrl.monto_min ?? ''));
    const [montoMax, setMontoMax] = useState<string>(String(filtrosUrl.monto_max ?? ''));
    const [fechaDesde, setFechaDesde] = useState<string>(filtrosUrl.fecha_desde || '');
    const [fechaHasta, setFechaHasta] = useState<string>(filtrosUrl.fecha_hasta || '');

    // Si cambian los filtros de la URL (por ejemplo al quitar un chip), los campos se actualizan
    useEffect(() => {
        setBusquedaCombinada(String(filtrosUrl.q || filtrosUrl.id || ''));
    }, [filtrosUrl.q, filtrosUrl.id]);
    useEffect(() => {
        setMontoMin(String(filtrosUrl.monto_min ?? ''));
        setMontoMax(String(filtrosUrl.monto_max ?? ''));
    }, [filtrosUrl.monto_min, filtrosUrl.monto_max]);
    useEffect(() => {
        setFechaDesde(filtrosUrl.fecha_desde || '');
        setFechaHasta(filtrosUrl.fecha_hasta || '');
    }, [filtrosUrl.fecha_desde, filtrosUrl.fecha_hasta]);

    // ── Validaciones ──────────────────────────────────────────────
    const rangoFechasInvalido = Boolean(fechaDesde && fechaHasta && fechaDesde > fechaHasta);
    const rangoMontoInvalido = montoMin !== '' && montoMax !== '' && Number(montoMin) > Number(montoMax);
    const montoNegativo = (montoMin !== '' && Number(montoMin) < 0) || (montoMax !== '' && Number(montoMax) < 0);

    // ── Aplicar filtros ──────────────────────────────────────────
    // Combina los filtros vigentes con los cambios, quita los vacíos y recarga el listado (vuelve a la página 1)
    const aplicar = (cambios: Partial<Record<ClaveFiltro, string | number>>) => {
        const actuales: Partial<Record<ClaveFiltro, string | number | undefined>> = {
            q: filtrosUrl.q,
            id: filtrosUrl.id,
            proveedor_id: filtrosUrl.proveedor_id,
            estado_documento_id: filtrosUrl.estado_documento_id,
            moneda_id: filtrosUrl.moneda_id,
            tipo_pago_id: filtrosUrl.tipo_pago_id,
            usuario_id: filtrosUrl.usuario_id,
            monto_min: filtrosUrl.monto_min,
            monto_max: filtrosUrl.monto_max,
            con_factura: filtrosUrl.con_factura,
            fecha_desde: filtrosUrl.fecha_desde,
            fecha_hasta: filtrosUrl.fecha_hasta,
        };

        const combinados = { ...actuales, ...cambios, ...orden };
        const limpios = Object.fromEntries(
            Object.entries(combinados).filter(([, v]) => v !== '' && v !== null && v !== undefined)
        );

        comprasService.search(limpios as FiltrosCompras);
    };

    const limpiarTodo = () => {
        setBusquedaCombinada('');
        setMontoMin('');
        setMontoMax('');
        setFechaDesde('');
        setFechaHasta('');
        comprasService.search({ ...orden });
    };

    // Búsqueda general: número solo = ID; texto = búsqueda general
    const busquedaRapida = (e: React.FormEvent) => {
        e.preventDefault();
        const texto = busquedaCombinada.trim();

        if (!texto) {
            aplicar({ q: '', id: '' });
            return;
        }

        if (/^\d+$/.test(texto)) {
            aplicar({ id: Number(texto), q: '' });
        } else {
            aplicar({ q: texto, id: '' });
        }
    };

    // Selects: se aplican al elegir
    const cambiarSelect = (clave: 'proveedor_id' | 'estado_documento_id' | 'tipo_pago_id' | 'usuario_id' | 'con_factura', v: unknown) => {
        aplicar({ [clave]: valorSelect(v) } as Partial<Record<ClaveFiltro, string>>);
    };

    // Monto: se aplica al salir del campo o con Enter, si el rango es válido
    const aplicarMonto = () => {
        if (rangoMontoInvalido || montoNegativo) return;
        const actualesMin = String(filtrosUrl.monto_min ?? '');
        const actualesMax = String(filtrosUrl.monto_max ?? '');
        if (montoMin === actualesMin && montoMax === actualesMax) return;
        aplicar({ monto_min: montoMin, monto_max: montoMax });
    };

    // Fechas: se aplican al cambiar, si el rango es válido
    const cambiarFecha = (clave: 'fecha_desde' | 'fecha_hasta', valor: string) => {
        const desde = clave === 'fecha_desde' ? valor : fechaDesde;
        const hasta = clave === 'fecha_hasta' ? valor : fechaHasta;
        if (clave === 'fecha_desde') setFechaDesde(valor);
        else setFechaHasta(valor);

        if (desde && hasta && desde > hasta) return; // Se muestra el aviso; no se aplica
        aplicar({ [clave]: valor });
    };

    // Accesos rápidos de fecha
    const rangoRapido = (tipo: 'hoy' | 'semana' | 'mes' | 'mes_anterior' | 'todo') => {
        const hoy = new Date();
        let desde = '';
        let hasta = '';

        if (tipo === 'hoy') {
            desde = hasta = fechaLocal(hoy);
        } else if (tipo === 'semana') {
            const lunes = new Date(hoy);
            lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7)); // semana de lunes a domingo
            desde = fechaLocal(lunes);
            hasta = fechaLocal(hoy);
        } else if (tipo === 'mes') {
            desde = fechaLocal(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
            hasta = fechaLocal(new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0));
        } else if (tipo === 'mes_anterior') {
            desde = fechaLocal(new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1));
            hasta = fechaLocal(new Date(hoy.getFullYear(), hoy.getMonth(), 0));
        }

        setFechaDesde(desde);
        setFechaHasta(hasta);
        aplicar({ fecha_desde: desde, fecha_hasta: hasta });
    };

    // ── Filtros activos (chips) ──────────────────────────────
    // El orden y la paginación no son filtros
    const hayFiltrosActivos = Object.entries(filtrosUrl).some(
        ([clave, valor]) => !['sort_by', 'sort_dir', 'page', 'per_page'].includes(clave) && valor !== '' && valor != null
    );

    // Nombre de una opción por id (comparado como texto: los ids pueden venir como número o como string)
    const nombreDe = <T extends { id: unknown }>(lista: T[], id: unknown, campo: (x: T) => string) => {
        const encontrado = lista.find((x) => String(x.id) === String(id));
        return encontrado ? campo(encontrado) : 'Desconocido';
    };

    const chips: Array<{ clave: string; texto: string; color: keyof typeof chipClase; quitar: () => void }> = [];

    if (filtrosUrl.id) chips.push({ clave: 'id', texto: `ID: ${filtrosUrl.id}`, color: 'blue', quitar: () => aplicar({ id: '' }) });
    if (filtrosUrl.q) chips.push({ clave: 'q', texto: `Búsqueda: ${filtrosUrl.q}`, color: 'blue', quitar: () => aplicar({ q: '' }) });
    if (filtrosUrl.proveedor_id)
        chips.push({
            clave: 'proveedor_id',
            texto: `Proveedor: ${nombreDe(datosSeguras.proveedores, filtrosUrl.proveedor_id, (p) => p.nombre)}`,
            color: 'green',
            quitar: () => aplicar({ proveedor_id: '' }),
        });
    if (filtrosUrl.estado_documento_id)
        chips.push({
            clave: 'estado_documento_id',
            texto: `Estado: ${nombreDe(datosSeguras.estados, filtrosUrl.estado_documento_id, (e) => e.nombre)}`,
            color: 'yellow',
            quitar: () => aplicar({ estado_documento_id: '' }),
        });
    if (filtrosUrl.tipo_pago_id)
        chips.push({
            clave: 'tipo_pago_id',
            texto: `Pago: ${nombreDe(datosSeguras.tipos_pago, filtrosUrl.tipo_pago_id, (t) => t.nombre)}`,
            color: 'slate',
            quitar: () => aplicar({ tipo_pago_id: '' }),
        });
    if (filtrosUrl.moneda_id)
        chips.push({
            clave: 'moneda_id',
            texto: `Moneda: ${nombreDe(datosSeguras.monedas, filtrosUrl.moneda_id, (m) => m.codigo)}`,
            color: 'slate',
            quitar: () => aplicar({ moneda_id: '' }),
        });
    if (filtrosUrl.usuario_id)
        chips.push({
            clave: 'usuario_id',
            texto: `Creador: ${nombreDe(datosSeguras.usuarios ?? [], filtrosUrl.usuario_id, (u) => u.name)}`,
            color: 'purple',
            quitar: () => aplicar({ usuario_id: '' }),
        });
    if (filtrosUrl.monto_min !== undefined && filtrosUrl.monto_min !== '')
        chips.push({
            clave: 'monto_min',
            texto: `Monto ≥ ${filtrosUrl.monto_min}`,
            color: 'green',
            quitar: () => aplicar({ monto_min: '' }),
        });
    if (filtrosUrl.monto_max !== undefined && filtrosUrl.monto_max !== '')
        chips.push({
            clave: 'monto_max',
            texto: `Monto ≤ ${filtrosUrl.monto_max}`,
            color: 'green',
            quitar: () => aplicar({ monto_max: '' }),
        });
    if (filtrosUrl.con_factura)
        chips.push({
            clave: 'con_factura',
            texto: filtrosUrl.con_factura === 'si' ? 'Con factura' : 'Sin factura',
            color: 'violet',
            quitar: () => aplicar({ con_factura: '' }),
        });
    if (filtrosUrl.fecha_desde)
        chips.push({
            clave: 'fecha_desde',
            texto: `Desde: ${mostrarFecha(filtrosUrl.fecha_desde)}`,
            color: 'purple',
            quitar: () => {
                setFechaDesde('');
                aplicar({ fecha_desde: '' });
            },
        });
    if (filtrosUrl.fecha_hasta)
        chips.push({
            clave: 'fecha_hasta',
            texto: `Hasta: ${mostrarFecha(filtrosUrl.fecha_hasta)}`,
            color: 'purple',
            quitar: () => {
                setFechaHasta('');
                aplicar({ fecha_hasta: '' });
            },
        });

    // Cantidad de filtros avanzados activos (para el contador del botón "Filtros")
    const avanzadosActivos = [
        filtrosUrl.proveedor_id,
        filtrosUrl.estado_documento_id,
        filtrosUrl.tipo_pago_id,
        filtrosUrl.usuario_id,
        filtrosUrl.monto_min,
        filtrosUrl.monto_max,
        filtrosUrl.con_factura,
        filtrosUrl.fecha_desde,
        filtrosUrl.fecha_hasta,
    ].filter((v) => v !== undefined && v !== '' && v !== null).length;

    // ── Opciones de los selects ──────────────────────────────
    const opcionesProveedores = datosSeguras.proveedores.map((p) => ({ value: p.id, label: p.nombre }));
    const opcionesEstados = datosSeguras.estados.map((e) => ({ value: e.id, label: e.nombre }));
    const opcionesTiposPago = datosSeguras.tipos_pago.map((t) => ({ value: t.id, label: `${t.nombre} (${t.codigo})` }));
    const opcionesUsuarios = (datosSeguras.usuarios ?? []).map((u) => ({ value: u.id, label: u.name }));
    const opcionesFactura = [
        { value: 'si', label: 'Con número de factura' },
        { value: 'no', label: 'Sin número de factura' },
    ];

    if (!filtros) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="text-center text-gray-500 dark:text-gray-400">Cargando filtros...</div>
            </div>
        );
    }

    return (
        <div className={cn('space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800', className)}>
            {/* Búsqueda rápida */}
            <form onSubmit={busquedaRapida} className="flex flex-wrap gap-3">
                <div className="min-w-[200px] flex-1">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Buscar por ID, número, factura, proveedor..."
                            title="Escribe un número para buscar por ID, o texto para búsqueda general"
                            value={busquedaCombinada}
                            onChange={(e) => setBusquedaCombinada(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <Button type="submit" variant="outline" size="sm" aria-label="Buscar">
                    <Search className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                    aria-expanded={mostrarFiltrosAvanzados}
                    className={cn(mostrarFiltrosAvanzados && 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20')}
                >
                    <Filter className="mr-1 h-4 w-4" />
                    Filtros
                    {avanzadosActivos > 0 && (
                        <span className="ml-2 rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">{avanzadosActivos}</span>
                    )}
                </Button>
                {hayFiltrosActivos && (
                    <Button type="button" variant="outline" size="sm" onClick={limpiarTodo}>
                        <RotateCcw className="mr-1 h-4 w-4" />
                        Limpiar
                    </Button>
                )}
            </form>

            {/* Filtros avanzados: se aplican al cambiar cada campo */}
            {mostrarFiltrosAvanzados && (
                <div className="space-y-4 border-t pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <Label htmlFor="proveedor_id" className="text-sm font-medium">Proveedor</Label>
                            <SearchSelect
                                id="proveedor_id"
                                placeholder="Todos los proveedores"
                                value={filtrosUrl.proveedor_id || ''}
                                options={opcionesProveedores}
                                onChange={(v) => cambiarSelect('proveedor_id', v)}
                                allowClear
                                emptyText="No hay proveedores disponibles"
                            />
                        </div>

                        <div>
                            <Label htmlFor="estado_documento_id" className="text-sm font-medium">Estado</Label>
                            <SearchSelect
                                id="estado_documento_id"
                                placeholder="Todos los estados"
                                value={filtrosUrl.estado_documento_id || ''}
                                options={opcionesEstados}
                                onChange={(v) => cambiarSelect('estado_documento_id', v)}
                                allowClear
                                emptyText="No hay estados disponibles"
                            />
                        </div>

                        <div>
                            <Label htmlFor="tipo_pago_id" className="text-sm font-medium">Tipo de Pago</Label>
                            <SearchSelect
                                id="tipo_pago_id"
                                placeholder="Todos los tipos"
                                value={filtrosUrl.tipo_pago_id || ''}
                                options={opcionesTiposPago}
                                onChange={(v) => cambiarSelect('tipo_pago_id', v)}
                                allowClear
                                emptyText="No hay tipos de pago disponibles"
                            />
                        </div>

                        <div>
                            <Label htmlFor="usuario_id" className="text-sm font-medium">Creador</Label>
                            <SearchSelect
                                id="usuario_id"
                                placeholder="Todos los creadores"
                                value={filtrosUrl.usuario_id || ''}
                                options={opcionesUsuarios}
                                onChange={(v) => cambiarSelect('usuario_id', v)}
                                allowClear
                                emptyText="No hay creadores disponibles"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <Label htmlFor="monto_min" className="text-sm font-medium">Monto mínimo</Label>
                            <Input
                                id="monto_min"
                                type="number"
                                min={0}
                                step="any"
                                placeholder="0"
                                value={montoMin}
                                onChange={(e) => setMontoMin(e.target.value)}
                                onBlur={aplicarMonto}
                                onKeyDown={(e) => e.key === 'Enter' && aplicarMonto()}
                            />
                        </div>

                        <div>
                            <Label htmlFor="monto_max" className="text-sm font-medium">Monto máximo</Label>
                            <Input
                                id="monto_max"
                                type="number"
                                min={0}
                                step="any"
                                placeholder="Sin límite"
                                value={montoMax}
                                onChange={(e) => setMontoMax(e.target.value)}
                                onBlur={aplicarMonto}
                                onKeyDown={(e) => e.key === 'Enter' && aplicarMonto()}
                            />
                        </div>

                        <div>
                            <Label htmlFor="con_factura" className="text-sm font-medium">Factura</Label>
                            <SearchSelect
                                id="con_factura"
                                placeholder="Todas"
                                value={filtrosUrl.con_factura || ''}
                                options={opcionesFactura}
                                onChange={(v) => cambiarSelect('con_factura', v)}
                                allowClear
                                emptyText="—"
                            />
                        </div>
                    </div>

                    {(rangoMontoInvalido || montoNegativo) && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {montoNegativo ? 'Los montos no pueden ser negativos.' : 'El monto mínimo no puede ser mayor que el máximo.'}
                        </p>
                    )}

                    {/* Rango de fechas con accesos rápidos */}
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { k: 'hoy', t: 'Hoy' },
                                { k: 'semana', t: 'Esta semana' },
                                { k: 'mes', t: 'Este mes' },
                                { k: 'mes_anterior', t: 'Mes anterior' },
                                { k: 'todo', t: 'Todo el tiempo' },
                            ].map((r) => (
                                <Button
                                    key={r.k}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => rangoRapido(r.k as 'hoy' | 'semana' | 'mes' | 'mes_anterior' | 'todo')}
                                >
                                    {r.t}
                                </Button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="fecha_desde" className="text-sm font-medium">Fecha desde</Label>
                                <Input
                                    id="fecha_desde"
                                    type="date"
                                    value={fechaDesde}
                                    max={fechaHasta || undefined}
                                    onChange={(e) => cambiarFecha('fecha_desde', e.target.value)}
                                    className="[&::-webkit-calendar-picker-indicator]:opacity-70"
                                />
                            </div>
                            <div>
                                <Label htmlFor="fecha_hasta" className="text-sm font-medium">Fecha hasta</Label>
                                <Input
                                    id="fecha_hasta"
                                    type="date"
                                    value={fechaHasta}
                                    min={fechaDesde || undefined}
                                    onChange={(e) => cambiarFecha('fecha_hasta', e.target.value)}
                                    className="[&::-webkit-calendar-picker-indicator]:opacity-70"
                                />
                            </div>
                        </div>

                        {rangoFechasInvalido && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                La fecha "desde" no puede ser posterior a la fecha "hasta".
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setMostrarFiltrosAvanzados(false)}>
                            <X className="mr-1 h-4 w-4" />
                            Cerrar
                        </Button>
                    </div>
                </div>
            )}

            {/* Filtros activos: cada uno se puede quitar */}
            {chips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Filtros activos:</span>
                    {chips.map((c) => (
                        <Chip key={c.clave} texto={c.texto} color={c.color} onQuitar={c.quitar} />
                    ))}
                </div>
            )}
        </div>
    );
}
