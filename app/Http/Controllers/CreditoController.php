<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\CuentaPorCobrar;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CreditoController extends Controller
{
    /**
     * Mostrar formulario para crear crédito manual
     */
    public function create(): Response
    {
        $clientes = Cliente::where('activo', true)
            ->select('id', 'nombre', 'email')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('admin/creditos/crear', [
            'clientes' => $clientes,
        ]);
    }

    /**
     * Crear crédito manual desde API
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validar permisos
            if (!auth()->user()->hasPermissionTo('admin.creditos.importar')) {
                return response()->json(['message' => 'No tienes permiso'], 403);
            }

            Log::info('🟠 [CREAR CREDITO MANUAL] INICIO', [
                'usuario_id' => Auth::id(),
            ]);

            // Validar datos
            $validated = $request->validate([
                'cliente_id' => 'required|integer|exists:clientes,id',
                'monto' => 'required|numeric|min:0.01',
                'monto_pagado' => 'nullable|numeric|min:0',
                'fecha_venta' => 'required|date|before_or_equal:today',
                'numero_documento' => 'required|string|unique:cuentas_por_cobrar,referencia_documento',
                'observaciones' => 'nullable|string|max:1000',
            ], [
                'cliente_id.required' => 'El cliente es requerido',
                'cliente_id.exists' => 'El cliente no existe',
                'monto.required' => 'El monto es requerido',
                'monto.numeric' => 'El monto debe ser un número',
                'monto.min' => 'El monto debe ser mayor a 0',
                'fecha_venta.required' => 'La fecha de venta es requerida',
                'fecha_venta.date' => 'La fecha debe ser válida',
                'fecha_venta.before_or_equal' => 'La fecha no puede ser futura',
                'numero_documento.required' => 'El número de documento es requerido',
                'numero_documento.unique' => 'Este número de documento ya existe',
            ]);

            // Verificar cliente
            $cliente = Cliente::findOrFail($validated['cliente_id']);

            // Crear crédito en transacción
            DB::transaction(function () use ($validated, $cliente) {
                $fechaVenta = new \DateTime($validated['fecha_venta']);
                $fechaVencimiento = (clone $fechaVenta)->modify('+7 days');

                $montoTotal = floatval($validated['monto']);
                $montoPagado = floatval($validated['monto_pagado'] ?? 0);
                $saldoPendiente = max(0, $montoTotal - $montoPagado);

                // Calcular días de atraso
                $hoy = new \DateTime();
                $diasAtraso = max(0, $hoy->diff($fechaVencimiento)->days);
                if ($hoy > $fechaVencimiento) {
                    $diasAtraso = $hoy->diff($fechaVencimiento)->days;
                } else {
                    $diasAtraso = 0;
                }

                // Construir observaciones: primero las del usuario, luego las del sistema
                $observacionesFinal = '';

                if ($validated['observaciones']) {
                    $observacionesFinal .= $validated['observaciones'] . "\n\n";
                }

                $observacionesFinal .= "--- Información del Sistema ---\n";
                $observacionesFinal .= "Tipo: Crédito creado manualmente\n";
                $observacionesFinal .= "Usuario: " . Auth::user()->name . "\n";
                $observacionesFinal .= "Fecha de creación: " . now()->toDateTimeString();

                CuentaPorCobrar::create([
                    'cliente_id' => $validated['cliente_id'],
                    'monto_original' => $montoTotal,
                    'monto_total' => $montoTotal,
                    'monto_pagado' => $montoPagado,
                    'saldo_pendiente' => $saldoPendiente,
                    'estado' => 'PENDIENTE',
                    'fecha_vencimiento' => $fechaVencimiento,
                    'dias_vencido' => $diasAtraso,
                    'referencia_documento' => $validated['numero_documento'],
                    'tipo' => 'CREDITO_MANUAL',
                    'observaciones' => $observacionesFinal,
                    'usuario_id' => Auth::id(),
                    'es_migracion' => false,
                ]);

                Log::info('✅ [CREAR CREDITO MANUAL] CxC creada', [
                    'cliente_id' => $validated['cliente_id'],
                    'monto' => $montoTotal,
                    'monto_pagado' => $montoPagado,
                    'saldo_pendiente' => $saldoPendiente,
                    'numero_documento' => $validated['numero_documento'],
                    'usuario_id' => Auth::id(),
                ]);
            });

            Log::info('🟢 [CREAR CREDITO MANUAL] COMPLETADO', [
                'cliente_id' => $validated['cliente_id'],
                'monto' => $validated['monto'],
                'numero_documento' => $validated['numero_documento'],
            ]);

            return response()->json([
                'success' => true,
                'message' => "Crédito de \${$validated['monto']} creado exitosamente para {$cliente->nombre}",
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Construir mensaje descriptivo con todos los errores
            $errores = $e->errors();
            $detallesErrores = [];
            foreach ($errores as $campo => $mensajes) {
                $detallesErrores[] = implode(', ', $mensajes);
            }

            Log::warning('❌ [CREAR CREDITO MANUAL] VALIDACIÓN FALLIDA', [
                'usuario_id' => Auth::id(),
                'errores' => $detallesErrores,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $errores,
                'detalles' => implode(' | ', $detallesErrores),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ [CREAR CREDITO MANUAL] ERROR', [
                'error' => $e->getMessage(),
                'usuario_id' => Auth::id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear el crédito',
                'error_detail' => $e->getMessage(),
            ], 500);
        }
    }
}
