import { useState, useCallback } from 'react';
import tipoMermaService from '@/infrastructure/services/tipoMerma.service';
import type { TipoMerma } from '@/domain/entities/tipo-merma';

export function useTipoMermas() {
    const [tipos, setTipos] = useState<TipoMerma[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTipos = useCallback(async () => {
        setLoading(true);
        try {
            const data = await tipoMermaService.getAll();
            setTipos(data);
        } finally {
            setLoading(false);
        }
    }, []);

    return { tipos, loading, fetchTipos };
}
