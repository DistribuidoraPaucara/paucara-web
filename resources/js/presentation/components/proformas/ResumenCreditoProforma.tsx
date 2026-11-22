import { useEffect, useState } from 'react';

// Crédito de la proforma: límite del cliente, lo ya aceptado (cuentas por cobrar),
// lo solicitado en proformas a crédito (incluida esta) y lo disponible.
// Solo se usa cuando la proforma está solicitada a crédito.

interface ResumenCredito {
    limite_credito: number;
    monto_utilizado: number;
    total_intenciones: number;
    monto_proforma_actual: number;
    disponible: number;
    puede_convertir?: boolean;
    advertencia?: string | null;
    proformas_pendientes?: Array<{ id: number }>;
}

const fmt = (n: number) => `Bs ${Number(n || 0).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ResumenCreditoProforma({ proformaId }: { proformaId: number }) {
    const [resumen, setResumen] = useState<ResumenCredito | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let activo = true;
        setCargando(true);
        setError(null);

        fetch(`/proformas/${proformaId}/resumen-credito`, { headers: { Accept: 'application/json' } })
            .then((r) => r.json())
            .then((json) => {
                if (!activo) return;
                if (json.success) setResumen(json.data);
                else setError(json.message || 'No se pudo cargar el crédito');
            })
            .catch(() => activo && setError('No se pudo cargar el crédito'))
            .finally(() => activo && setCargando(false));

        return () => {
            activo = false;
        };
    }, [proformaId]);

    if (cargando) {
        return <div className="rounded-lg border border-blue-200 p-3 text-sm text-blue-700 dark:border-blue-800 dark:text-blue-300">Cargando crédito del cliente…</div>;
    }

    if (error || !resumen) {
        return <div className="rounded-lg border border-red-200 p-3 text-sm text-red-700 dark:border-red-800 dark:text-red-300">{error ?? 'Sin datos de crédito'}</div>;
    }

    const disponibleNegativo = resumen.disponible < 0;
    const otrasPendientes = (resumen.proformas_pendientes?.length ?? 0);

    const tarjetas = [
        { titulo: 'Límite de crédito', valor: fmt(resumen.limite_credito), clase: 'text-gray-900 dark:text-white' },
        { titulo: 'Aceptado (por cobrar)', valor: fmt(resumen.monto_utilizado), clase: 'text-amber-700 dark:text-amber-300' },
        { titulo: `Solicitado (${otrasPendientes + 1} proformas)`, valor: fmt(resumen.total_intenciones), clase: 'text-orange-700 dark:text-orange-300' },
        { titulo: 'Monto de esta proforma', valor: fmt(resumen.monto_proforma_actual), clase: 'text-blue-700 dark:text-blue-300' },
        { titulo: 'Disponible', valor: fmt(resumen.disponible), clase: disponibleNegativo ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300' },
    ];

    return (
        <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">💳 Crédito del cliente (proforma a crédito)</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                {tarjetas.map((t) => (
                    <div key={t.titulo} className="rounded-md bg-white p-2 dark:bg-zinc-900">
                        <p className="text-[11px] uppercase text-gray-500 dark:text-gray-400">{t.titulo}</p>
                        <p className={`font-mono text-sm font-semibold ${t.clase}`}>{t.valor}</p>
                    </div>
                ))}
            </div>
            {(resumen.advertencia || disponibleNegativo || resumen.puede_convertir === false) && (
                <p className="text-xs text-red-700 dark:text-red-300">
                    {resumen.advertencia ?? (disponibleNegativo ? 'El monto de esta proforma supera el crédito disponible.' : 'No puede convertirse a venta a crédito.')}
                </p>
            )}
        </div>
    );
}
