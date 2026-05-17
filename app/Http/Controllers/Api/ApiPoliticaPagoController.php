<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

/**
 * API Controller para Políticas de Pago
 *
 * Proporciona endpoints para obtener las políticas de pago disponibles
 * en el sistema, sincronizadas con el frontend.
 *
 * @route /api/politicas-pago
 */
class ApiPoliticaPagoController extends Controller
{
    /**
     * Catálogo de políticas de pago disponibles
     *
     * Retorna todas las políticas de pago configuradas en el sistema
     * con sus características y requisitos.
     *
     * @route GET /api/politicas-pago
     * @return JsonResponse
     *
     * @example
     * GET /api/politicas-pago
     * Response:
     * {
     *   "success": true,
     *   "data": [
     *     {
     *       "codigo": "CONTRA_ENTREGA",
     *       "nombre": "Contra Entrega",
     *       "descripcion": "Pago al momento de recibir la mercadería",
     *       "porcentaje_minimo": 0,
     *       "requiere_cliente_solvente": false,
     *       "permitida": true
     *     },
     *     ...
     *   ]
     * }
     */
    public function index(): JsonResponse
    {
        $politicas = [
            [
                'codigo' => 'CONTRA_ENTREGA',
                'nombre' => 'Contra Entrega',
                'descripcion' => 'Pago al momento de recibir la mercadería',
                'porcentaje_minimo' => 0,
                'requiere_cliente_solvente' => false,
                'permitida' => true,
            ],
            [
                'codigo' => 'MEDIO_MEDIO',
                'nombre' => '50% Anticipo + 50% Contra Entrega',
                'descripcion' => 'Mitad ahora, mitad al recibir la mercadería',
                'porcentaje_minimo' => 50,
                'requiere_cliente_solvente' => false,
                'permitida' => true,
            ],
            [
                'codigo' => 'ANTICIPADO_100',
                'nombre' => '100% Anticipado',
                'descripcion' => 'Pago completo por adelantado',
                'porcentaje_minimo' => 100,
                'requiere_cliente_solvente' => false,
                'permitida' => true,
            ],
            [
                'codigo' => 'CREDITO',
                'nombre' => 'Crédito',
                'descripcion' => 'Pago a través de cuenta corriente (requiere aprobación)',
                'porcentaje_minimo' => 0,
                'requiere_cliente_solvente' => true,
                'permitida' => true,
            ],
        ];

        return response()->json([
            'success' => true,
            'message' => 'Políticas de pago obtenidas correctamente',
            'data' => $politicas,
        ]);
    }

    /**
     * Obtener políticas de pago disponibles para un cliente específico
     *
     * Retorna las políticas que un cliente puede usar, considerando
     * sus permisos de crédito y límite disponible.
     *
     * @route GET /api/politicas-pago/disponibles/{clienteId}
     * @param int $clienteId ID del cliente
     * @return JsonResponse
     *
     * @example
     * GET /api/politicas-pago/disponibles/1
     * Response:
     * {
     *   "success": true,
     *   "data": {
     *     "disponibles": [...],
     *     "cliente": {
     *       "id": 1,
     *       "nombre": "Cliente ABC",
     *       "puede_tener_credito": true,
     *       "limite_credito": 5000.00
     *     },
     *     "restricciones": {
     *       "CREDITO": {
     *         "permitida": true,
     *         "razon": null
     *       }
     *     }
     *   }
     * }
     */
    public function disponibles(int $clienteId): JsonResponse
    {
        // Obtener el cliente
        $cliente = \App\Models\Cliente::find($clienteId);

        if (!$cliente) {
            return response()->json([
                'success' => false,
                'message' => 'Cliente no encontrado',
            ], 404);
        }

        // Catálogo completo de políticas
        $todasLasPoliticas = [
            [
                'codigo' => 'CONTRA_ENTREGA',
                'nombre' => 'Contra Entrega',
                'descripcion' => 'Pago al momento de recibir la mercadería',
                'porcentaje_minimo' => 0,
                'requiere_cliente_solvente' => false,
                'permitida' => true,
            ],
            [
                'codigo' => 'MEDIO_MEDIO',
                'nombre' => '50% Anticipo + 50% Contra Entrega',
                'descripcion' => 'Mitad ahora, mitad al recibir la mercadería',
                'porcentaje_minimo' => 50,
                'requiere_cliente_solvente' => false,
                'permitida' => true,
            ],
            [
                'codigo' => 'ANTICIPADO_100',
                'nombre' => '100% Anticipado',
                'descripcion' => 'Pago completo por adelantado',
                'porcentaje_minimo' => 100,
                'requiere_cliente_solvente' => false,
                'permitida' => true,
            ],
            [
                'codigo' => 'CREDITO',
                'nombre' => 'Crédito',
                'descripcion' => 'Pago a través de cuenta corriente (requiere aprobación)',
                'porcentaje_minimo' => 0,
                'requiere_cliente_solvente' => true,
                'permitida' => true,
            ],
        ];

        // Filtrar políticas disponibles para este cliente
        $disponibles = [];
        $restricciones = [];

        foreach ($todasLasPoliticas as $politica) {
            $puedeUsar = true;
            $razon = null;

            // Validación especial para CREDITO
            if ($politica['codigo'] === 'CREDITO') {
                if (!$cliente->puede_tener_credito) {
                    $puedeUsar = false;
                    $razon = "El cliente no tiene permiso para solicitar crédito";
                } elseif (!$cliente->limite_credito || $cliente->limite_credito <= 0) {
                    $puedeUsar = false;
                    $razon = "El cliente no tiene límite de crédito configurado";
                }
            }

            if ($puedeUsar) {
                $disponibles[] = $politica;
            }

            $restricciones[$politica['codigo']] = [
                'permitida' => $puedeUsar,
                'razon' => $razon,
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Políticas disponibles obtenidas correctamente',
            'data' => [
                'disponibles' => $disponibles,
                'cliente' => [
                    'id' => $cliente->id,
                    'nombre' => $cliente->nombre,
                    'puede_tener_credito' => $cliente->puede_tener_credito,
                    'limite_credito' => (float) $cliente->limite_credito,
                ],
                'restricciones' => $restricciones,
            ],
        ]);
    }
}
