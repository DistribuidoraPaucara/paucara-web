<?php

namespace App\Services\Formatters;

use App\Models\Cliente;
use App\Models\Producto;
use App\Models\User;
use App\Models\Vehiculo;

/**
 * Servicio para formatear datos consistentemente en notificaciones WebSocket
 *
 * Responsabilidad única: Estandarizar el formato de datos que se envían a través
 * de WebSocket hacia clientes en tiempo real.
 *
 * Elimina duplicación de código en:
 * - ProformaWebSocketService
 * - EntregaWebSocketService
 * - PagoWebSocketService
 * - StockWebSocketService
 *
 * Uso:
 * use App\Services\Formatters\WebSocketDataFormatter as Format;
 *
 * $data = Format::wrap([
 *     'proforma_id' => $proforma->id,
 *     'numero' => $proforma->numero,
 *     'cliente' => Format::formatCliente($proforma->cliente, true),
 *     'total' => (float) $proforma->total,
 *     'estado' => $proforma->estado,
 * ]);
 * // Resultado incluye 'timestamp' automáticamente
 */
class WebSocketDataFormatter
{
    /**
     * Formatear información de cliente para WebSocket
     *
     * @param Cliente|null $cliente Instancia del cliente (null si no existe)
     * @param bool $completo Si incluir todos los campos (apellido, teléfono, email)
     * @return array Array formateado con información del cliente
     *
     * Ejemplo:
     * Format::formatCliente($cliente, true);
     * // Resultado: [
     * //     'id' => 123,
     * //     'nombre' => 'Juan Pérez',
     * //     'apellido' => 'García',
     * //     'telefono' => '1234567890',
     * //     'email' => 'juan@example.com'
     * // ]
     */
    public static function formatCliente(?Cliente $cliente, bool $completo = false): array
    {
        if (!$cliente) {
            return [
                'id' => null,
                'nombre' => 'Cliente',
            ];
        }

        $data = [
            'id' => $cliente->id,
            'nombre' => $cliente->nombre ?? 'Cliente',
        ];

        if ($completo) {
            $data['apellido'] = $cliente->apellido ?? '';
            $data['telefono'] = $cliente->telefono ?? null;
            $data['email'] = $cliente->email ?? null;
            $data['codigo'] = $cliente->codigo_cliente ?? null;
        }

        return $data;
    }

    /**
     * Formatear información de vehículo para WebSocket
     *
     * @param Vehiculo|null $vehiculo Instancia del vehículo
     * @param bool $completo Si incluir detalles completos
     * @return array Array formateado con información del vehículo
     *
     * Ejemplo:
     * Format::formatVehiculo($vehiculo, true);
     * // Resultado: [
     * //     'id' => 45,
     * //     'placa' => 'ABC-1234',
     * //     'marca' => 'Toyota',
     * //     'modelo' => 'Hiace',
     * //     'capacidad' => 1000,
     * //     'anio' => 2022
     * // ]
     */
    public static function formatVehiculo(?Vehiculo $vehiculo, bool $completo = false): array
    {
        if (!$vehiculo) {
            return [
                'id' => null,
                'placa' => null,
            ];
        }

        $data = [
            'id' => $vehiculo->id,
            'placa' => $vehiculo->placa ?? null,
        ];

        if ($completo) {
            $data['marca'] = $vehiculo->marca ?? null;
            $data['modelo'] = $vehiculo->modelo ?? null;
            $data['capacidad'] = $vehiculo->capacidad ?? null;
            $data['anio'] = $vehiculo->anio ?? null;
            $data['color'] = $vehiculo->color ?? null;
        }

        return $data;
    }

    /**
     * Formatear información de producto para WebSocket
     *
     * @param Producto|null $producto Instancia del producto
     * @param bool $incluirStock Si incluir información de stock disponible
     * @return array Array formateado con información del producto
     *
     * Ejemplo:
     * Format::formatProducto($producto, true);
     * // Resultado: [
     * //     'id' => 789,
     * //     'nombre' => 'Aceite de Motor',
     * //     'sku' => 'ACE-001',
     * //     'stock_total' => 150,
     * //     'disponible' => true
     * // ]
     */
    public static function formatProducto(?Producto $producto, bool $incluirStock = false): array
    {
        if (!$producto) {
            return [
                'id' => null,
                'nombre' => 'Producto',
            ];
        }

        $data = [
            'id' => $producto->id,
            'nombre' => $producto->nombre ?? 'Producto',
            'sku' => $producto->sku ?? null,
        ];

        if ($incluirStock) {
            try {
                $stockTotal = $producto->stock()->sum('cantidad') ?? 0;
                $data['stock_total'] = (int) $stockTotal;
                $data['disponible'] = $stockTotal > 0;
            } catch (\Exception $e) {
                // Si hay error al obtener stock, retornar valores por defecto
                $data['stock_total'] = 0;
                $data['disponible'] = false;
            }
        }

        return $data;
    }

    /**
     * Formatear información de usuario para WebSocket
     *
     * @param User|null $usuario Instancia del usuario
     * @return array Array formateado con información del usuario
     *
     * Ejemplo:
     * Format::formatUsuario($usuario);
     * // Resultado: [
     * //     'id' => 5,
     * //     'name' => 'Carlos López',
     * //     'email' => 'carlos@example.com'
     * // ]
     */
    public static function formatUsuario(?User $usuario): array
    {
        if (!$usuario) {
            return [
                'id' => null,
                'name' => 'Sistema',
            ];
        }

        return [
            'id' => $usuario->id,
            'name' => $usuario->name ?? 'Usuario',
            'email' => $usuario->email ?? null,
        ];
    }

    /**
     * Agregar timestamp actual en formato ISO8601
     *
     * Agrega automáticamente la fecha/hora actual al array de datos.
     * Útil para que el cliente sepa cuándo se envió la notificación.
     *
     * @param array $data Array de datos
     * @return array Array con timestamp agregado
     *
     * Ejemplo:
     * $data = ['id' => 1, 'nombre' => 'Test'];
     * Format::addTimestamp($data);
     * // Resultado: ['id' => 1, 'nombre' => 'Test', 'timestamp' => '2025-12-10T14:30:45Z']
     */
    public static function addTimestamp(array $data): array
    {
        $data['timestamp'] = now()->toIso8601String();
        return $data;
    }

    /**
     * Envolver datos con timestamp automáticamente (alias para addTimestamp)
     *
     * @param array $data
     * @return array
     *
     * Ejemplo:
     * $datosConTimestamp = Format::wrap(['id' => 1, 'estado' => 'APROBADA']);
     */
    public static function wrap(array $data): array
    {
        return self::addTimestamp($data);
    }

    /**
     * Formatear items/detalles de un documento para WebSocket
     *
     * Convierte detalles de Proforma/Venta a formato consistente para WebSocket.
     *
     * @param \Illuminate\Database\Eloquent\Collection|array|null $detalles
     * @return array Array de items formateados
     *
     * Ejemplo:
     * Format::formatItems($proforma->detalles);
     * // Resultado: [
     * //     [
     * //         'producto_id' => 123,
     * //         'producto_nombre' => 'Producto A',
     * //         'cantidad' => 5,
     * //         'precio_unitario' => 100.00,
     * //         'subtotal' => 500.00
     * //     ],
     * //     ...
     * // ]
     */
    public static function formatItems($detalles): array
    {
        if (!$detalles || (is_countable($detalles) && count($detalles) === 0)) {
            return [];
        }

        // Convertir a array si es Collection
        $items = is_array($detalles) ? $detalles : $detalles->toArray();

        return array_map(function ($item) {
            return [
                'producto_id' => $item['producto_id'] ?? $item['id'] ?? null,
                'producto_nombre' => $item['producto']['nombre'] ?? $item['nombre'] ?? 'Producto',
                'cantidad' => (float) ($item['cantidad'] ?? 0),
                'precio_unitario' => (float) ($item['precio_unitario'] ?? 0),
                'subtotal' => (float) ($item['subtotal'] ?? 0),
            ];
        }, $items);
    }

    /**
     * Formatear resumen de dinero/totales
     *
     * Asegura que los montos siempre sean flotantes y con precisión decimal consistente.
     *
     * @param float|int|null $monto Monto a formatear
     * @param int $decimales Decimales a mostrar (default: 2)
     * @return float Monto formateado
     */
    public static function formatMonto($monto, int $decimales = 2): float
    {
        if ($monto === null) {
            return 0.0;
        }

        return (float) number_format((float) $monto, $decimales, '.', '');
    }

    /**
     * Formatear fecha para WebSocket
     *
     * @param \Carbon\Carbon|string|null $fecha
     * @param string $formato Formato de salida (default: ISO8601)
     * @return string|null Fecha formateada o null
     */
    public static function formatFecha($fecha, string $formato = 'c'): ?string
    {
        if (!$fecha) {
            return null;
        }

        return $fecha instanceof \Carbon\Carbon
            ? $fecha->format($formato)
            : \Carbon\Carbon::parse($fecha)->format($formato);
    }
}
