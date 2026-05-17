<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\CuentaPorCobrar;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;
use Carbon\Carbon;

class CreditoImportService
{
    /**
     * Validar archivo CSV sin crear registros (preview)
     */
    public function validarArchivo($archivoPath): array
    {
        Log::info('🟠 [CREDITO IMPORT] Validando archivo', [
            'archivo' => $archivoPath,
        ]);

        $filas = $this->parsearCSV($archivoPath);
        $validas = [];
        $errores = [];
        $advertencias = [];

        foreach ($filas as $indice => $fila) {
            $resultado = $this->validarFila($fila, $indice);

            if ($resultado['valida']) {
                $validas[] = array_merge($fila, [
                    'fila' => $indice + 2, // +2 porque la fila 1 es encabezado
                    'estado' => 'VALIDA',
                ]);
            } else {
                $errores[] = [
                    'fila' => $indice + 2,
                    'datos' => $fila,
                    'errores' => $resultado['errores'],
                ];
            }

            // Agregar advertencias si las hay
            if (!empty($resultado['advertencias'])) {
                $advertencias[] = [
                    'fila' => $indice + 2,
                    'datos' => $fila,
                    'advertencias' => $resultado['advertencias'],
                ];
            }
        }

        Log::info('✅ [CREDITO IMPORT] Validación completada', [
            'total_filas' => count($filas),
            'validas' => count($validas),
            'errores' => count($errores),
            'advertencias' => count($advertencias),
        ]);

        return [
            'total_filas' => count($filas),
            'validas' => $validas,
            'errores' => $errores,
            'advertencias' => $advertencias,
            'puede_importar' => empty($errores),
        ];
    }

    /**
     * Importar créditos validados
     */
    public function importar($archivoPath): array
    {
        Log::info('🟠 [CREDITO IMPORT] Iniciando importación', [
            'usuario' => Auth::user()->name,
            'archivo' => $archivoPath,
        ]);

        $filas = $this->parsearCSV($archivoPath);
        $importados = [];
        $rechazados = [];

        try {
            DB::transaction(function () use ($filas, &$importados, &$rechazados) {
                foreach ($filas as $indice => $fila) {
                    $resultado = $this->validarFila($fila, $indice);

                    if (!$resultado['valida']) {
                        $rechazados[] = [
                            'fila' => $indice + 2,
                            'datos' => $fila,
                            'errores' => $resultado['errores'],
                        ];
                        continue;
                    }

                    // Crear CuentaPorCobrar
                    $cxc = $this->crearCuentaPorCobrar($fila);
                    $importados[] = [
                        'fila' => $indice + 2,
                        'cliente_id' => $cxc->cliente_id,
                        'monto' => $cxc->monto_total,
                        'cxc_id' => $cxc->id,
                        'estado' => 'CREADA',
                    ];

                    Log::info('✅ [CREDITO IMPORT] CxC creada', [
                        'cxc_id' => $cxc->id,
                        'cliente_id' => $cxc->cliente_id,
                        'monto' => $cxc->monto_total,
                    ]);
                }
            });

            Log::info('🟢 [CREDITO IMPORT] Importación completada', [
                'importados' => count($importados),
                'rechazados' => count($rechazados),
                'usuario' => Auth::user()->name,
            ]);

            return [
                'exito' => true,
                'importados' => $importados,
                'rechazados' => $rechazados,
                'total_importados' => count($importados),
                'total_rechazados' => count($rechazados),
                'mensaje' => count($importados) . ' créditos importados exitosamente.',
            ];

        } catch (\Exception $e) {
            Log::error('❌ [CREDITO IMPORT] Error durante importación', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'exito' => false,
                'error' => 'Error al importar: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Parsear archivo CSV
     */
    private function parsearCSV($archivoPath): array
    {
        $filas = [];
        $archivo = fopen($archivoPath, 'r');

        if (!$archivo) {
            throw new \Exception('No se pudo abrir el archivo CSV');
        }

        // Leer encabezado
        $encabezado = fgetcsv($archivo);
        if (!$encabezado) {
            throw new \Exception('El archivo CSV está vacío');
        }

        // Validar que tenga las columnas requeridas
        $columnasRequeridas = ['cliente_id', 'monto', 'fecha_venta', 'numero_documento'];
        $columnasEncontradas = array_filter($encabezado);
        $faltantes = array_diff($columnasRequeridas, $columnasEncontradas);

        if (!empty($faltantes)) {
            throw new \Exception('Faltan columnas: ' . implode(', ', $faltantes));
        }

        // Leer filas
        while (($fila = fgetcsv($archivo)) !== false) {
            // Ignorar filas vacías
            if (empty(array_filter($fila))) {
                continue;
            }

            $filas[] = array_combine($encabezado, $fila);
        }

        fclose($archivo);

        return $filas;
    }

    /**
     * Validar una fila individual
     */
    private function validarFila(array $fila, int $indice): array
    {
        $errores = [];
        $advertencias = [];

        // Validar cliente_id
        if (empty($fila['cliente_id'])) {
            $errores[] = 'cliente_id es requerido';
        } else {
            $cliente = Cliente::find((int) $fila['cliente_id']);
            if (!$cliente) {
                $errores[] = "Cliente con ID {$fila['cliente_id']} no existe";
            }
        }

        // Validar monto
        if (empty($fila['monto'])) {
            $errores[] = 'monto es requerido';
        } else {
            $monto = (float) str_replace([',', ' '], ['', ''], $fila['monto']);
            if ($monto <= 0) {
                $errores[] = 'monto debe ser mayor a 0';
            }
        }

        // Validar fecha_venta
        if (empty($fila['fecha_venta'])) {
            $errores[] = 'fecha_venta es requerida';
        } else {
            try {
                $fecha = Carbon::createFromFormat('Y-m-d', $fila['fecha_venta']);
                if ($fecha->isFuture()) {
                    $errores[] = 'fecha_venta no puede ser futura';
                }
            } catch (\Exception $e) {
                $errores[] = 'fecha_venta debe estar en formato YYYY-MM-DD';
            }
        }

        // Validar numero_documento
        if (empty($fila['numero_documento'])) {
            $errores[] = 'numero_documento es requerido';
        } else {
            // Verificar que no sea duplicado
            $existe = CuentaPorCobrar::where('referencia_documento', $fila['numero_documento'])->exists();
            if ($existe) {
                $errores[] = 'numero_documento ya existe';
            }
        }

        // Advertencias (no bloquean pero informan)
        if (!empty($fila['cliente_id'])) {
            $cliente = Cliente::find((int) $fila['cliente_id']);
            if ($cliente) {
                // Advertir si cliente no tiene ventas previas
                $ventasAntes = CuentaPorCobrar::where('cliente_id', $cliente->id)
                    ->where('es_migracion', false)
                    ->exists();
                if (!$ventasAntes) {
                    $advertencias[] = "Cliente no tiene ventas registradas anteriormente (nueva cuenta)";
                }
            }
        }

        return [
            'valida' => empty($errores),
            'errores' => $errores,
            'advertencias' => $advertencias,
        ];
    }

    /**
     * Crear CuentaPorCobrar
     */
    private function crearCuentaPorCobrar(array $fila): CuentaPorCobrar
    {
        $clienteId = (int) $fila['cliente_id'];
        $monto = (float) str_replace([',', ' '], ['', ''], $fila['monto']);
        $fechaVenta = Carbon::createFromFormat('Y-m-d', $fila['fecha_venta']);
        $numeroDocumento = $fila['numero_documento'];
        $observaciones = $fila['observaciones'] ?? '';

        // Construir observaciones: primero las del usuario, luego las del sistema
        $observacionesFinal = '';
        if (!empty($observaciones)) {
            $observacionesFinal .= $observaciones . "\n\n";
        }
        $observacionesFinal .= "--- Información del Sistema ---\n";
        $observacionesFinal .= "Tipo: Crédito histórico importado\n";
        $observacionesFinal .= "Usuario: " . Auth::user()->name . "\n";
        $observacionesFinal .= "Fecha de creación: " . now()->toDateTimeString();

        $cxc = CuentaPorCobrar::create([
            'cliente_id' => $clienteId,
            'monto_total' => $monto,
            'monto_pagado' => 0,
            'estado' => 'PENDIENTE',
            'fecha_vencimiento' => $fechaVenta->addDays(7),
            'referencia_documento' => $numeroDocumento,
            'tipo' => 'CREDITO_HISTORICO',
            'observaciones' => $observacionesFinal,
            'usuario_id' => Auth::id(),
            'es_migracion' => true,
        ]);

        return $cxc;
    }
}
