<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Localidad;

class GeocodingService
{
    private string $apiKey;
    private string $baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    public function __construct()
    {
        $this->apiKey = config('services.google_maps.api_key');
    }

    /**
     * Reverse geocoding: detectar localidad desde coordenadas GPS
     *
     * @param float $latitude Latitud en formato decimal
     * @param float $longitude Longitud en formato decimal
     * @return array Array con estructura: ['success' => bool, 'localidad' => ?Localidad, 'error' => ?string, ...]
     */
    public function reverseGeocode(float $latitude, float $longitude): array
    {
        // 1. Validar coordenadas
        if (!$this->isValidCoordinate($latitude, $longitude)) {
            return ['success' => false, 'error' => 'Coordenadas inválidas'];
        }

        // 2. Llamar a Google API
        try {
            $response = Http::get($this->baseUrl, [
                'latlng' => "$latitude,$longitude",
                'key' => $this->apiKey,
                'language' => 'es',
                'region' => 'BO'  // Bolivia
            ]);

            if (!$response->successful()) {
                Log::error('Google Geocoding API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'coordinates' => ['latitude' => $latitude, 'longitude' => $longitude]
                ]);
                return ['success' => false, 'error' => 'Error al consultar Google Maps'];
            }

            $data = $response->json();

            if ($data['status'] !== 'OK' || empty($data['results'])) {
                Log::warning('Google Geocoding no encontró resultados', [
                    'status' => $data['status'] ?? 'unknown',
                    'coordinates' => ['latitude' => $latitude, 'longitude' => $longitude]
                ]);
                return ['success' => false, 'error' => 'No se encontró información para estas coordenadas'];
            }

            // 3. Parsear componentes de dirección
            $addressComponents = $this->parseAddressComponents($data['results'][0]);

            // 4. Buscar localidad en BD
            $localidad = $this->findMatchingLocalidad($addressComponents);

            return [
                'success' => true,
                'localidad' => $localidad,
                'address_components' => $addressComponents,
                'formatted_address' => $data['results'][0]['formatted_address'] ?? '',
            ];
        } catch (\Exception $e) {
            Log::error('GeocodingService Exception', [
                'message' => $e->getMessage(),
                'coordinates' => ['latitude' => $latitude, 'longitude' => $longitude]
            ]);
            return ['success' => false, 'error' => 'Error al procesar la ubicación'];
        }
    }

    /**
     * Parsea los componentes de dirección de Google Maps
     * Extrae: localidad (ciudad), sublocality (barrio), departamento, país
     *
     * @param array $result Resultado de Google Geocoding API
     * @return array Array con componentes: locality, sublocality, admin_area_2, admin_area_1, country
     */
    private function parseAddressComponents(array $result): array
    {
        $components = [
            'locality' => null,         // Ciudad
            'sublocality' => null,      // Barrio/Zona
            'admin_area_2' => null,     // Municipio
            'admin_area_1' => null,     // Departamento
            'country' => null,
        ];

        if (!isset($result['address_components'])) {
            return $components;
        }

        foreach ($result['address_components'] as $component) {
            $types = $component['types'] ?? [];
            $longName = $component['long_name'] ?? '';

            if (in_array('locality', $types)) {
                $components['locality'] = $longName;
            }

            if (in_array('sublocality', $types) || in_array('sublocality_level_1', $types)) {
                $components['sublocality'] = $longName;
            }

            if (in_array('administrative_area_level_2', $types)) {
                $components['admin_area_2'] = $longName;
            }

            if (in_array('administrative_area_level_1', $types)) {
                $components['admin_area_1'] = $longName;
            }

            if (in_array('country', $types)) {
                $components['country'] = $longName;
            }
        }

        return $components;
    }

    /**
     * Busca una localidad en la base de datos que coincida con los componentes de dirección
     * Intenta en este orden:
     * 1. Match exacto por nombre (case-insensitive)
     * 2. Match parcial (contains)
     * 3. Fuzzy matching con similitud > 80%
     *
     * @param array $components Componentes de dirección parseados
     * @return Localidad|null Localidad encontrada o null si no hay coincidencia
     */
    private function findMatchingLocalidad(array $components): ?Localidad
    {
        // Orden de prioridad para búsqueda
        $searchTerms = array_filter([
            $components['sublocality'],  // Zona Norte, Barrio X (más específico)
            $components['locality'],     // Santa Cruz
            $components['admin_area_2'], // Municipio
        ]);

        foreach ($searchTerms as $term) {
            if (empty($term)) {
                continue;
            }

            // 1. Intentar match exacto (case-insensitive)
            $localidad = Localidad::where('activo', true)
                ->whereRaw('LOWER(nombre) = ?', [strtolower($term)])
                ->first();

            if ($localidad) {
                Log::info('Localidad encontrada (exact match)', [
                    'term' => $term,
                    'localidad_id' => $localidad->id,
                    'localidad_nombre' => $localidad->nombre
                ]);
                return $localidad;
            }

            // 2. Intentar match parcial (contiene)
            $localidad = Localidad::where('activo', true)
                ->whereRaw('LOWER(nombre) LIKE ?', ['%' . strtolower($term) . '%'])
                ->first();

            if ($localidad) {
                Log::info('Localidad encontrada (partial match)', [
                    'term' => $term,
                    'localidad_id' => $localidad->id,
                    'localidad_nombre' => $localidad->nombre
                ]);
                return $localidad;
            }

            // 3. Fuzzy matching (similitud > 80%)
            $localidad = $this->fuzzyMatchLocalidad($term);
            if ($localidad) {
                return $localidad;
            }
        }

        Log::warning('No se encontró localidad para componentes', [
            'components' => $components,
            'search_terms' => array_keys($searchTerms)
        ]);
        return null;
    }

    /**
     * Realiza fuzzy matching usando similar_text()
     * Busca la localidad con mayor similitud > 80%
     *
     * @param string $term Término a buscar
     * @return Localidad|null Localidad encontrada o null
     */
    private function fuzzyMatchLocalidad(string $term): ?Localidad
    {
        $localidades = Localidad::where('activo', true)->get();
        $bestMatch = null;
        $bestScore = 0;

        foreach ($localidades as $localidad) {
            $percent = 0;
            similar_text(
                strtolower($term),
                strtolower($localidad->nombre),
                $percent
            );

            if ($percent > 80 && $percent > $bestScore) {
                $bestMatch = $localidad;
                $bestScore = $percent;
            }
        }

        if ($bestMatch) {
            Log::info('Localidad encontrada (fuzzy match)', [
                'term' => $term,
                'localidad_id' => $bestMatch->id,
                'localidad_nombre' => $bestMatch->nombre,
                'similarity_score' => round($bestScore, 2)
            ]);
            return $bestMatch;
        }

        return null;
    }

    /**
     * Valida que las coordenadas sean válidas
     * Latitud: -90 a 90
     * Longitud: -180 a 180
     *
     * @param float $lat Latitud
     * @param float $lng Longitud
     * @return bool True si son válidas
     */
    private function isValidCoordinate(float $lat, float $lng): bool
    {
        return $lat >= -90 && $lat <= 90 && $lng >= -180 && $lng <= 180;
    }
}
