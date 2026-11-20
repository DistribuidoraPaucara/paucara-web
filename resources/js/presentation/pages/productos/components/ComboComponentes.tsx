import { Button } from '@/presentation/components/ui/button';
import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ComponenteCombo {
    producto_id: number;
    producto_nombre: string;
    cantidad_requerida: number;
    stock_disponible: number;
    combos_posibles: number;
    es_obligatorio: boolean;
}

interface ComboComponentesProps {
    comboId: number | string;
    almacenes: Array<{ id: number; nombre: string }>;
    almacenPrincipalId?: number;
}

/** Stock de los componentes de un combo y cuántos combos se pueden armar. */
export default function ComboComponentes({ comboId, almacenes, almacenPrincipalId }: ComboComponentesProps) {
    const [almacenId, setAlmacenId] = useState(almacenes.some((a) => a.id === almacenPrincipalId) ? String(almacenPrincipalId) : '');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [capacidad, setCapacidad] = useState(0);
    const [componentes, setComponentes] = useState<ComponenteCombo[]>([]);

    useEffect(() => {
        const peticion = new AbortController();
        setCargando(true);
        setError(null);

        fetch(`/combos/${comboId}/capacidad-detalles${almacenId ? `?almacen_id=${almacenId}` : ''}`, {
            headers: { Accept: 'application/json' },
            signal: peticion.signal,
        })
            .then(async (respuesta) => {
                if (respuesta.status === 403) throw new Error('No tienes permiso para ver el stock de los componentes.');
                if (!respuesta.ok) throw new Error('No se pudo cargar el stock de los componentes.');
                const datos = await respuesta.json();
                setCapacidad(datos.capacidad_total ?? 0);
                setComponentes(datos.detalles ?? []);
                setCargando(false);
            })
            .catch((e: Error) => {
                if (e.name === 'AbortError') return;
                setError(e.message);
                setCargando(false);
            });

        return () => peticion.abort();
    }, [comboId, almacenId]);

    return (
        <div className="mt-4 space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm text-muted-foreground">Combos que se pueden armar</p>
                    <p className={`text-3xl font-bold ${capacidad > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {cargando ? '…' : capacidad}
                    </p>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                    <label className="text-sm">
                        <span className="mb-1 block text-muted-foreground">Almacén</span>
                        <select
                            value={almacenId}
                            onChange={(e) => setAlmacenId(e.target.value)}
                            className="h-9 w-56 rounded-md border border-input bg-background px-2 text-sm"
                        >
                            <option value="">Todos los almacenes</option>
                            {almacenes.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.nombre}
                                    {a.id === almacenPrincipalId ? ' (principal)' : ''}
                                </option>
                            ))}
                        </select>
                    </label>
                    <Button asChild variant="outline">
                        <Link href={`/combos/${comboId}/edit`}>Editar componentes</Link>
                    </Button>
                </div>
            </div>

            {error ? (
                <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">{error}</p>
            ) : !cargando && componentes.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Este combo no tiene componentes.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th scope="col" className="px-3 py-2 text-left font-medium">Componente</th>
                                <th scope="col" className="px-3 py-2 text-left font-medium">Tipo</th>
                                <th scope="col" className="px-3 py-2 text-right font-medium">Por combo</th>
                                <th scope="col" className="px-3 py-2 text-right font-medium">Stock disponible</th>
                                <th scope="col" className="px-3 py-2 text-right font-medium">Alcanza para</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-border ${cargando ? 'opacity-50' : ''}`}>
                            {componentes.map((c) => {
                                // El que define la capacidad del combo; también cuando la capacidad es 0
                                const limita = c.es_obligatorio && c.combos_posibles === capacidad;
                                return (
                                    <tr key={c.producto_id} className={limita ? 'bg-amber-50/70 dark:bg-amber-950/20' : ''}>
                                        <td className="px-3 py-2">
                                            <span className="font-medium">{c.producto_nombre}</span>{' '}
                                            <a
                                                href={`/productos/${c.producto_id}/edit`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Editar producto en otra pestaña"
                                                className="inline-flex items-center gap-0.5 text-xs text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                ID {c.producto_id}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </td>
                                        <td className="px-3 py-2 text-xs text-muted-foreground">
                                            {c.es_obligatorio ? 'Obligatorio' : 'Opcional'}
                                            {limita && <span className="ml-2 font-semibold text-amber-700 dark:text-amber-400">Limita el combo</span>}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono tabular-nums">{c.cantidad_requerida}</td>
                                        <td className={`px-3 py-2 text-right font-mono tabular-nums ${c.stock_disponible === 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                                            {c.stock_disponible}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono tabular-nums">{c.combos_posibles} combos</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="text-xs text-muted-foreground">Los componentes opcionales no afectan la cantidad de combos que se pueden armar.</p>
        </div>
    );
}
