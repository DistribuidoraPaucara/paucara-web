<?php

namespace App\Helpers;

class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'Operación exitosa',
        int $code = 200,
        ?string $codeError = null
    ): \Illuminate\Http\JsonResponse {
        $response = [
            'success' => true,
            'status'  => $code,
            'message' => $message,
        ];

        if ($codeError) {
            $response['code'] = $codeError;
        }

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $code);
    }

    public static function error(
        string $message = 'Ocurrió un error',
        int $code = 400,
        mixed $data = null,
        ?string $errorCode = null
    ): \Illuminate\Http\JsonResponse {
        $response = [
            'success' => false,
            'status'  => $code,
            'message' => $message,
        ];

        if ($errorCode) {
            $response['code'] = $errorCode;
        }

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $code);
    }

    public static function validation(array $errors, string $message = 'Error de validación'): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success' => false,
            'status'  => 422,
            'code'    => 'VALIDATION_ERROR',
            'message' => $message,
            'errors'  => $errors,
        ], 422);
    }

    public static function notFound(string $message = 'Recurso no encontrado'): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success' => false,
            'status'  => 404,
            'code'    => 'NOT_FOUND',
            'message' => $message,
        ], 404);
    }

    public static function unauthorized(string $message = 'No autenticado'): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success' => false,
            'status'  => 401,
            'code'    => 'UNAUTHORIZED',
            'message' => $message,
        ], 401);
    }

    public static function forbidden(string $message = 'Acceso denegado'): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success' => false,
            'status'  => 403,
            'code'    => 'FORBIDDEN',
            'message' => $message,
        ], 403);
    }
}
