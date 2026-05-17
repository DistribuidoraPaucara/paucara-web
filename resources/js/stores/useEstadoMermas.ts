import { useState, useCallback } from 'react';
import estadoMermaService from '@/infrastructure/services/estadoMerma.service';
import type { EstadoMerma } from '@/domain/entities/estado-merma';

export function useEstadoMermas() {
    const [estados, setEstados] = useState<EstadoMerma[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchEstados = useCallback(async () => {
        setLoading(true);
        try {
            const data = await estadoMermaService.getAll();
            setEstados(data);
        } finally {
            setLoading(false);
        }
    }, []);

    return { estados, loading, fetchEstados };
}
