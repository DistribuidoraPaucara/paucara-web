import NotificationService from './notification.service';

export interface GeocodingResult {
    success: boolean;
    data?: {
        localidad?: {
            id: number;
            nombre: string;
            codigo: string;
            activo: boolean;
        };
        formatted_address?: string;
        address_components?: {
            locality: string | null;
            sublocality: string | null;
            admin_area_1: string | null;
            country: string | null;
        };
    };
    message?: string;
}

class GeocodingService {
    private readonly baseUrl = '/api/geocoding';

    /**
     * Detectar localidad desde coordenadas GPS usando reverse geocoding
     * Llama a la API backend que utiliza Google Geocoding API
     *
     * @param latitude Latitud en formato decimal (-90 a 90)
     * @param longitude Longitud en formato decimal (-180 a 180)
     * @returns Promise con resultado de localidad detectada o null en caso de error
     */
    async detectLocalidad(latitude: number, longitude: number): Promise<GeocodingResult | null> {
        try {
            // Obtener CSRF token del documento HTML
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

            // Realizar llamada al backend
            const response = await fetch(`${this.baseUrl}/reverse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin',
                body: JSON.stringify({ latitude, longitude })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Error al detectar localidad';
                throw new Error(errorMessage);
            }

            const result: GeocodingResult = await response.json();

            // Mostrar notificación apropiada
            if (result.success && result.data?.localidad) {
                NotificationService.success(
                    result.message || `Localidad detectada: ${result.data.localidad.nombre}`
                );
            } else if (result.success && !result.data?.localidad) {
                NotificationService.info(
                    result.message || 'No se pudo detectar la localidad automáticamente'
                );
            }

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error desconocido al detectar localidad';

            console.error('[GeocodingService] Error:', {
                latitude,
                longitude,
                error: errorMessage
            });

            NotificationService.error(errorMessage);
            return null;
        }
    }
}

// Exportar como singleton
export default new GeocodingService();
