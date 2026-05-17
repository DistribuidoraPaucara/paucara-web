/**
 * Servicio para manejar preferencias de choferes por usuario
 * Almacena en BD para persistencia entre dispositivos
 */

import type { Id } from '@/domain/entities/shared';

export interface ChoferPreferencia {
    chofer_id: Id;
    fecha_uso: string; // ISO datetime
    frecuencia: number; // Cuántas veces ha sido usado
}

class ChoferPreferenciasService {
    private readonly API_ENDPOINT = '/api/user/chofer-preferencias';

    /**
     * Cargar preferencias de choferes del usuario actual
     */
    async cargarPreferencias(): Promise<ChoferPreferencia[]> {
        try {
            const response = await fetch(this.API_ENDPOINT);
            if (!response.ok) {
                console.warn('Error cargando preferencias:', response.status);
                return [];
            }
            const data = await response.json();
            return data.preferencias || [];
        } catch (error) {
            console.error('Error en cargarPreferencias:', error);
            return [];
        }
    }

    /**
     * Guardar uso de un chofer
     */
    async guardarUso(chofer_id: Id): Promise<void> {
        try {
            const response = await fetch(this.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
                body: JSON.stringify({ chofer_id }),
            });

            if (!response.ok) {
                console.warn('Error guardando preferencia:', response.status);
            }
        } catch (error) {
            console.error('Error en guardarUso:', error);
            // No fallar si no se puede guardar (es opcional)
        }
    }

    /**
     * Obtener el token CSRF del documento
     */
    private getCsrfToken(): string {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta?.getAttribute('content') || '';
    }

    /**
     * Ordenar choferes por preferencia (más usados primero)
     */
    ordenarPorPreferencia<T extends { id: Id }>(
        items: T[],
        preferencias: ChoferPreferencia[]
    ): T[] {
        const preferenciaMap = new Map(preferencias.map((p) => [p.chofer_id, p.frecuencia]));

        return [...items].sort((a, b) => {
            const freqA = preferenciaMap.get(a.id) || 0;
            const freqB = preferenciaMap.get(b.id) || 0;
            return freqB - freqA; // Descendente
        });
    }
}

export const choferPreferenciasService = new ChoferPreferenciasService();
