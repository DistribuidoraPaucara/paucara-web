<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BannerPublicitario;
use Illuminate\Http\JsonResponse;

class BannerPublicitarioController extends Controller
{
    /**
     * Obtener banners vigentes y activos para mostrar en la app
     */
    public function index(): JsonResponse
    {
        try {
            $banners = BannerPublicitario::vigentes()->get();

            return response()->json([
                'success' => true,
                'data' => $banners,
                'message' => 'Banners cargados correctamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar banners: ' . $e->getMessage(),
            ], 500);
        }
    }
}
