<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GeocodingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GeocodingController extends Controller
{
    private GeocodingService $geocodingService;

    public function __construct(GeocodingService $geocodingService)
    {
        $this->geocodingService = $geocodingService;
    }

    /**
     * Reverse geocoding: detectar localidad desde coordenadas GPS
     *
     * @param Request $request Debe contener 'latitude' y 'longitude'
     * @return JsonResponse
     */
    public function reverseGeocode(Request $request): JsonResponse
    {
        // Validar coordenadas
        $validated = $request->validate([
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        // Llamar al servicio de geocoding
        $result = $this->geocodingService->reverseGeocode(
            (float) $validated['latitude'],
            (float) $validated['longitude']
        );

        // Si hay error, retornar respuesta de error
        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['error'] ?? 'Error desconocido'
            ], 400);
        }

        // Retornar respuesta exitosa
        return response()->json([
            'success' => true,
            'data' => [
                'localidad' => $result['localidad'],
                'formatted_address' => $result['formatted_address'] ?? '',
                'address_components' => $result['address_components'] ?? [],
            ],
            'message' => $result['localidad']
                ? "Localidad detectada: {$result['localidad']->nombre}"
                : 'No se pudo detectar la localidad automáticamente'
        ]);
    }
}
