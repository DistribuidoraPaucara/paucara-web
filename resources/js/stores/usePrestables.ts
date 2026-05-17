import { useState, useCallback } from 'react';
import prestableService from '@/infrastructure/services/prestable.service';
import type { Prestable } from '@/domain/entities/prestamos';

export function usePrestables() {
    const [prestables, setPrestables] = useState<Prestable[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPrestables = useCallback(async () => {
        setLoading(true);
        try {
            const data = await prestableService.getAll();
            setPrestables(data);
        } finally {
            setLoading(false);
        }
    }, []);

    return { prestables, loading, fetchPrestables };
}
