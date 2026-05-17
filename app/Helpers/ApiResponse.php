<?php

namespace App\Helpers;

class ApiResponse
{
    public static function success(mixed $data = null, string $message = 'Operación exitosa', int $code = 200): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    public static function error(string $message = 'Ocurrió un error', int $code = 400, mixed $data = null): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => $data,
        ], $code);
    }
}
