import { useState, useCallback } from 'react';
import tipoAjusteInventarioService from '@/infrastructure/services/tipoAjusteInventario.service';
import type { TipoAjusteInventario } from '@/domain/entities/tipos-ajuste-inventario';

export function useTipoAjustInventario() {
    const [tipos, setTipos] = useState<TipoAjusteInventario[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTipos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tipoAjusteInventarioService.getAll();
            setTipos(data);
        } catch (err) {
            setError('Error al cargar los tipos de ajuste');
            console.error('Error fetching tipos:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { tipos, loading, error, fetchTipos };
}
