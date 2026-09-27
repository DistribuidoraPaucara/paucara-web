<?php

namespace App\Services\WebSocket;

/**
 * Servicio especializado para notificaciones WebSocket de préstamos
 *
 * Maneja todas las notificaciones en tiempo real relacionadas con préstamos
 */
class PrestamoWebSocketService extends BaseWebSocketService
{
    /**
     * ✅ Notificar creación de préstamo a cliente a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Usuario creador
     * - Admins (web)
     * - Cajeros (web)
     * - Cliente propietario (mobile/web)
     */
    public function notifyPrestamoClienteCreated($prestamo): bool
    {
        // Calcular cantidad total prestada
        $cantidadTotal = ($prestamo->detalles ?? collect())
            ->sum('cantidad_prestada');

        $eventData = [
            'id' => $prestamo->id,
            'cliente_id' => $prestamo->cliente_id,
            'cliente_nombre' => $prestamo->cliente?->nombre ?? 'Cliente',
            'cliente' => [
                'id' => $prestamo->cliente_id,
                'nombre' => $prestamo->cliente?->nombre ?? 'Cliente',
                'apellido' => $prestamo->cliente?->apellido ?? '',
            ],
            'cantidad' => (int) $cantidadTotal,
            'estado' => $prestamo->estado,
            'items' => ($prestamo->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad_prestada' => (int) $item->cantidad_prestada,
                ];
            })->toArray(),
            'creador' => [
                'id' => $prestamo->created_by,
                'name' => $prestamo->creador?->name ?? 'Sistema',
            ],
            'fecha_creacion' => $prestamo->created_at?->toIso8601String(),
            'tipo' => 'prestamo_cliente',
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        // 👤 Agregar usuario creador
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // 🚗 Agregar chofer si está asignado
        if ($prestamo->chofer_id) {
            $userIds[] = $prestamo->chofer_id;
        }

        // 📱 Agregar cliente específico si tiene user_id
        if ($prestamo->cliente?->user_id) {
            $userIds[] = $prestamo->cliente->user_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('prestamo.cliente.creado', $eventData, array_unique($userIds), $roles);
    }

    /**
     * ✅ Notificar creación de préstamo a evento a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Usuario creador
     * - Admins (web)
     * - Cajeros (web)
     * - Cliente propietario (cliente eventos, ID=51)
     */
    public function notifyPrestamoEventoCreated($prestamo): bool
    {
        // Calcular cantidad total prestada
        $cantidadTotal = ($prestamo->detalles ?? collect())
            ->sum('cantidad_prestada');

        $eventData = [
            'id' => $prestamo->id,
            'nombre_evento' => $prestamo->nombre_evento,
            'cantidad' => (int) $cantidadTotal,
            'estado' => $prestamo->estado,
            'encargado_evento' => $prestamo->encargado_evento,
            'items' => ($prestamo->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad_prestada' => (int) $item->cantidad_prestada,
                ];
            })->toArray(),
            'creador' => [
                'id' => $prestamo->created_by,
                'name' => $prestamo->creador?->name ?? 'Sistema',
            ],
            'fecha_creacion' => $prestamo->created_at?->toIso8601String(),
            'tipo' => 'prestamo_evento',
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        // 👤 Agregar usuario creador
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // 🚗 Agregar chofer si está asignado
        if ($prestamo->chofer_id) {
            $userIds[] = $prestamo->chofer_id;
        }

        // 📱 Agregar cliente eventos si tiene user_id
        if ($prestamo->cliente?->user_id) {
            $userIds[] = $prestamo->cliente->user_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('prestamo.evento.creado', $eventData, array_unique($userIds), $roles);
    }

    /**
     * ✅ Notificar creación de préstamo a proveedor a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Usuario creador
     * - Admins (web)
     * - Cajeros (web)
     * - Proveedor propietario (si tiene user_id)
     */
    public function notifyPrestamoProveedorCreated($prestamo): bool
    {
        // Calcular cantidad total prestada
        $cantidadTotal = ($prestamo->detalles ?? collect())
            ->sum('cantidad_prestada');

        $eventData = [
            'id' => $prestamo->id,
            'proveedor_id' => $prestamo->proveedor_id,
            'proveedor_nombre' => $prestamo->proveedor?->nombre ?? 'Proveedor',
            'proveedor' => [
                'id' => $prestamo->proveedor_id,
                'nombre' => $prestamo->proveedor?->nombre ?? 'Proveedor',
            ],
            'cantidad' => (int) $cantidadTotal,
            'estado' => $prestamo->estado,
            'items' => ($prestamo->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad_prestada' => (int) $item->cantidad_prestada,
                ];
            })->toArray(),
            'creador' => [
                'id' => $prestamo->created_by,
                'name' => $prestamo->creador?->name ?? 'Sistema',
            ],
            'fecha_creacion' => $prestamo->created_at?->toIso8601String(),
            'tipo' => 'prestamo_proveedor',
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        // 👤 Agregar usuario creador
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // 📱 Agregar proveedor si tiene user_id
        if ($prestamo->proveedor?->user_id) {
            $userIds[] = $prestamo->proveedor->user_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('prestamo.proveedor.creado', $eventData, array_unique($userIds), $roles);
    }

    /**
     * ✅ NUEVO: Notificar anulación de préstamo a cliente a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Usuario que anuló
     * - Usuario creador
     * - Admins (web)
     * - Cajeros (web)
     * - Cliente propietario (mobile/web)
     */
    public function notifyPrestamoClienteAnulado($prestamo, ?string $razonAnulacion = null): bool
    {
        // Calcular cantidad total prestada
        $cantidadTotal = ($prestamo->detalles ?? collect())
            ->sum('cantidad_prestada');

        $eventData = [
            'id' => $prestamo->id,
            'cliente_id' => $prestamo->cliente_id,
            'cliente_nombre' => $prestamo->cliente?->nombre ?? 'Cliente',
            'cliente' => [
                'id' => $prestamo->cliente_id,
                'nombre' => $prestamo->cliente?->nombre ?? 'Cliente',
                'apellido' => $prestamo->cliente?->apellido ?? '',
            ],
            'cantidad' => (int) $cantidadTotal,
            'estado' => $prestamo->estado,
            'razon_anulacion' => $razonAnulacion,
            'items' => ($prestamo->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad_prestada' => (int) $item->cantidad_prestada,
                ];
            })->toArray(),
            'creador' => [
                'id' => $prestamo->created_by,
                'name' => $prestamo->creador?->name ?? 'Sistema',
            ],
            'anulador_id' => auth()->id(),
            'anulador_nombre' => auth()->user()?->name ?? 'Sistema',
            'fecha_anulacion' => now()->toIso8601String(),
            'tipo' => 'prestamo_cliente',
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        // 👤 Agregar usuario que anuló
        if (auth()->id()) {
            $userIds[] = auth()->id();
        }

        // 👤 Agregar usuario creador
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // 🚗 Agregar chofer si está asignado
        if ($prestamo->chofer_id) {
            $userIds[] = $prestamo->chofer_id;
        }

        // 📱 Agregar cliente específico si tiene user_id
        if ($prestamo->cliente?->user_id) {
            $userIds[] = $prestamo->cliente->user_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('prestamo.cliente.anulado', $eventData, array_unique($userIds), $roles);
    }

    /**
     * ✅ NUEVO: Notificar anulación de préstamo a evento a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Usuario que anuló
     * - Usuario creador
     * - Admins (web)
     * - Cajeros (web)
     * - Cliente eventos propietario (mobile/web)
     */
    public function notifyPrestamoEventoAnulado($prestamo, ?string $razonAnulacion = null): bool
    {
        // Calcular cantidad total prestada
        $cantidadTotal = ($prestamo->detalles ?? collect())
            ->sum('cantidad_prestada');

        $eventData = [
            'id' => $prestamo->id,
            'nombre_evento' => $prestamo->nombre_evento,
            'cantidad' => (int) $cantidadTotal,
            'estado' => $prestamo->estado,
            'razon_anulacion' => $razonAnulacion,
            'encargado_evento' => $prestamo->encargado_evento,
            'items' => ($prestamo->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad_prestada' => (int) $item->cantidad_prestada,
                ];
            })->toArray(),
            'creador' => [
                'id' => $prestamo->created_by,
                'name' => $prestamo->creador?->name ?? 'Sistema',
            ],
            'anulador_id' => auth()->id(),
            'anulador_nombre' => auth()->user()?->name ?? 'Sistema',
            'fecha_anulacion' => now()->toIso8601String(),
            'tipo' => 'prestamo_evento',
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        // 👤 Agregar usuario que anuló
        if (auth()->id()) {
            $userIds[] = auth()->id();
        }

        // 👤 Agregar usuario creador
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // 🚗 Agregar chofer si está asignado
        if ($prestamo->chofer_id) {
            $userIds[] = $prestamo->chofer_id;
        }

        // 📱 Agregar cliente eventos si tiene user_id
        if ($prestamo->cliente?->user_id) {
            $userIds[] = $prestamo->cliente->user_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('prestamo.evento.anulado', $eventData, array_unique($userIds), $roles);
    }

    /**
     * ✅ NUEVO: Notificar anulación de préstamo a proveedor a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Usuario que anuló
     * - Usuario creador
     * - Admins (web)
     * - Cajeros (web)
     * - Proveedor propietario (mobile/web)
     */
    public function notifyPrestamoProveedorAnulado($prestamo, ?string $razonAnulacion = null): bool
    {
        // Calcular cantidad total prestada
        $cantidadTotal = ($prestamo->detalles ?? collect())
            ->sum('cantidad_prestada');

        $eventData = [
            'id' => $prestamo->id,
            'proveedor_id' => $prestamo->proveedor_id,
            'proveedor_nombre' => $prestamo->proveedor?->nombre ?? 'Proveedor',
            'proveedor' => [
                'id' => $prestamo->proveedor_id,
                'nombre' => $prestamo->proveedor?->nombre ?? 'Proveedor',
            ],
            'cantidad' => (int) $cantidadTotal,
            'estado' => $prestamo->estado,
            'razon_anulacion' => $razonAnulacion,
            'items' => ($prestamo->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad_prestada' => (int) $item->cantidad_prestada,
                ];
            })->toArray(),
            'creador' => [
                'id' => $prestamo->created_by,
                'name' => $prestamo->creador?->name ?? 'Sistema',
            ],
            'anulador_id' => auth()->id(),
            'anulador_nombre' => auth()->user()?->name ?? 'Sistema',
            'fecha_anulacion' => now()->toIso8601String(),
            'tipo' => 'prestamo_proveedor',
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        // 👤 Agregar usuario que anuló
        if (auth()->id()) {
            $userIds[] = auth()->id();
        }

        // 👤 Agregar usuario creador
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // 📱 Agregar proveedor si tiene user_id
        if ($prestamo->proveedor?->user_id) {
            $userIds[] = $prestamo->proveedor->user_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('prestamo.proveedor.anulado', $eventData, array_unique($userIds), $roles);
    }

    /**
     * ✅ NUEVO: Notificar cuando se registra una devolución de préstamo a cliente
     */
    public function notifyDevolucionClienteRegistrada($devolucion): bool
    {
        $prestamo = $devolucion->prestamoCliente;
        $cantidadDevuelto = $devolucion->cantidad_total ?? $devolucion->detalles->count();

        $eventData = [
            'id' => $devolucion->id,
            'devolucion_numero' => $devolucion->numero ?? $devolucion->id,
            'prestamo_id' => $prestamo->id,
            'cliente_nombre' => $prestamo->cliente?->nombre ?? 'Cliente',
            'cantidad_devuelto' => (int) $cantidadDevuelto,
            'registrado_por' => $devolucion->registradoPor?->name ?? 'Sistema',
            'fecha_registro' => $devolucion->created_at?->toIso8601String(),
            'items' => ($devolucion->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad' => (int) ($item->cantidad ?? 0),
                ];
            })->toArray(),
        ];

        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        // Usuario creador del préstamo
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // Usuario que registró la devolución
        if ($devolucion->registrado_por_usuario_id) {
            $userIds[] = $devolucion->registrado_por_usuario_id;
        }

        return $this->notifyMultiChannel('devolucion.cliente.registrada', $eventData, array_unique($userIds), $roles);
    }

    /**
     * ✅ NUEVO: Notificar cuando se anula una devolución de préstamo a cliente
     */
    public function notifyDevolucionClienteAnulada($devolucion, ?string $razonAnulacion = null): bool
    {
        $prestamo = $devolucion->prestamoCliente;
        $cantidadDevuelto = $devolucion->cantidad_total ?? $devolucion->detalles->count();

        $eventData = [
            'id' => $devolucion->id,
            'devolucion_numero' => $devolucion->numero ?? $devolucion->id,
            'prestamo_id' => $prestamo->id,
            'cliente_nombre' => $prestamo->cliente?->nombre ?? 'Cliente',
            'cantidad_devuelto' => (int) $cantidadDevuelto,
            'razon_anulacion' => $razonAnulacion,
            'anulado_por' => $devolucion->anuladoPor?->name ?? 'Sistema',
            'fecha_anulacion' => $devolucion->anulado_en?->toIso8601String(),
            'items' => ($devolucion->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad' => (int) ($item->cantidad ?? 0),
                ];
            })->toArray(),
        ];

        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        // Usuario creador del préstamo
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // Usuario que anuló
        if (auth()->id()) {
            $userIds[] = auth()->id();
        }

        return $this->notifyMultiChannel('devolucion.cliente.anulada', $eventData, array_unique($userIds), $roles);
    }

    /**
     * ✅ NUEVO: Notificar cuando se registra una devolución de préstamo a evento
     */
    public function notifyDevolucionEventoRegistrada($devolucion): bool
    {
        $prestamo = $devolucion->prestamoEvento;
        $cantidadDevuelto = $devolucion->cantidad_total ?? $devolucion->detalles->count();

        $eventData = [
            'id' => $devolucion->id,
            'prestamo_id' => $prestamo->id,
            'nombre_evento' => $prestamo->nombre_evento,
            'cantidad_devuelto' => (int) $cantidadDevuelto,
            'registrado_por' => $devolucion->registradoPor?->name ?? 'Sistema',
            'fecha_registro' => $devolucion->created_at?->toIso8601String(),
            'items' => ($devolucion->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad' => (int) ($item->cantidad ?? 0),
                ];
            })->toArray(),
        ];

        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        if ($devolucion->registrado_por_usuario_id) {
            $userIds[] = $devolucion->registrado_por_usuario_id;
        }

        return $this->notifyMultiChannel('devolucion.evento.registrada', $eventData, array_unique($userIds), $roles);
    }

    /**
     * ✅ NUEVO: Notificar cuando se anula una devolución de préstamo a evento
     */
    public function notifyDevolucionEventoAnulada($devolucion, ?string $razonAnulacion = null): bool
    {
        $prestamo = $devolucion->prestamoEvento;
        $cantidadDevuelto = $devolucion->cantidad_total ?? $devolucion->detalles->count();

        $eventData = [
            'id' => $devolucion->id,
            'prestamo_id' => $prestamo->id,
            'nombre_evento' => $prestamo->nombre_evento,
            'cantidad_devuelto' => (int) $cantidadDevuelto,
            'razon_anulacion' => $razonAnulacion,
            'anulado_por' => $devolucion->anuladoPor?->name ?? 'Sistema',
            'fecha_anulacion' => $devolucion->anulado_en?->toIso8601String(),
            'items' => ($devolucion->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad' => (int) ($item->cantidad ?? 0),
                ];
            })->toArray(),
        ];

        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        if (auth()->id()) {
            $userIds[] = auth()->id();
        }

        return $this->notifyMultiChannel('devolucion.evento.anulada', $eventData, array_unique($userIds), $roles);
    }

    /**
     * ✅ NUEVO: Notificar cuando se registra una devolución de préstamo a proveedor
     */
    public function notifyDevolucionProveedorRegistrada($devolucion): bool
    {
        $prestamo = $devolucion->prestamoProveedor;
        $cantidadDevuelto = $devolucion->cantidad_total ?? $devolucion->detalles->count();

        $eventData = [
            'id' => $devolucion->id,
            'prestamo_id' => $prestamo->id,
            'proveedor_nombre' => $prestamo->proveedor?->nombre ?? 'Proveedor',
            'cantidad_devuelto' => (int) $cantidadDevuelto,
            'registrado_por' => $devolucion->registradoPor?->name ?? 'Sistema',
            'fecha_registro' => $devolucion->created_at?->toIso8601String(),
            'items' => ($devolucion->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad' => (int) ($item->cantidad ?? 0),
                ];
            })->toArray(),
        ];

        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        if ($devolucion->registrado_por_usuario_id) {
            $userIds[] = $devolucion->registrado_por_usuario_id;
        }

        return $this->notifyMultiChannel('devolucion.proveedor.registrada', $eventData, array_unique($userIds), $roles);
    }

    /**
     * ✅ NUEVO: Notificar cuando se anula una devolución de préstamo a proveedor
     */
    public function notifyDevolucionProveedorAnulada($devolucion, ?string $razonAnulacion = null): bool
    {
        $prestamo = $devolucion->prestamoProveedor;
        $cantidadDevuelto = $devolucion->cantidad_total ?? $devolucion->detalles->count();

        $eventData = [
            'id' => $devolucion->id,
            'prestamo_id' => $prestamo->id,
            'proveedor_nombre' => $prestamo->proveedor?->nombre ?? 'Proveedor',
            'cantidad_devuelto' => (int) $cantidadDevuelto,
            'razon_anulacion' => $razonAnulacion,
            'anulado_por' => $devolucion->anuladoPor?->name ?? 'Sistema',
            'fecha_anulacion' => $devolucion->anulado_en?->toIso8601String(),
            'items' => ($devolucion->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad' => (int) ($item->cantidad ?? 0),
                ];
            })->toArray(),
        ];

        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        if (auth()->id()) {
            $userIds[] = auth()->id();
        }

        return $this->notifyMultiChannel('devolucion.proveedor.anulada', $eventData, array_unique($userIds), $roles);
    }
}
