<?php

namespace App\Services\WebSocket;

/**
 * Servicio especializado para notificaciones WebSocket de entregas
 * Maneja todas las notificaciones en tiempo real relacionadas con entregas
 */
class EntregaWebSocketService extends BaseWebSocketService
{
    /**
     * Notificar creación de entrega consolidada
     */
    public function notifyCreated($entrega): bool
    {
        return $this->send('notify/entrega-creada', [
            'entrega_id' => $entrega->id,
            'entrega_numero' => $entrega->numero_entrega,
            'estado' => $entrega->estado,
            'chofer_id' => $entrega->chofer_id,
            'chofer_nombre' => $entrega->chofer?->name ?? 'Chofer',
            'vehiculo_id' => $entrega->vehiculo_id,
            'vehiculo_placa' => $entrega->vehiculo?->placa ?? 'Vehículo',
            'ventas_count' => $entrega->ventas()->count() ?? 0,
            'fecha_asignacion' => $entrega->fecha_asignacion?->toIso8601String(),
        ]);
    }

    /**
     * ✅ NUEVO: Notificar al chofer que le fue asignada una entrega
     * Incluye todos los detalles de la entrega y usa user_id para routing correcto
     */
    public function notifyChoferAsignado($entrega): bool
    {
        // ✅ Cargar relación del chofer si no está cargada
        if (!$entrega->relationLoaded('chofer')) {
            $entrega->load('chofer');
        }

        // Obtener user_id del chofer
        $choferUserId = $entrega->chofer?->id; // El chofer_id apunta a users.id

        if (!$choferUserId) {
            \Log::warning('EntregaWebSocketService: Chofer user_id es null', [
                'entrega_id' => $entrega->id,
                'chofer_id' => $entrega->chofer_id,
            ]);
            return false;
        }

        return $this->send('notify/entrega-asignada', [
            'entrega_id' => $entrega->id,
            'numero_entrega' => $entrega->numero_entrega,
            'estado' => $entrega->estado,
            'chofer_id' => $entrega->chofer_id,
            'user_id' => $choferUserId, // ✅ user_id del chofer para routing en Node.js
            'chofer_nombre' => $entrega->chofer?->name ?? 'Chofer',
            'vehiculo_id' => $entrega->vehiculo_id,
            'vehiculo' => $entrega->vehiculo ? [
                'id' => $entrega->vehiculo->id,
                'placa' => $entrega->vehiculo->placa,
                'marca' => $entrega->vehiculo->marca,
            ] : null,
            'ventas_count' => $entrega->ventas()->count() ?? 0,
            'peso_kg' => $entrega->peso_total ?? 0,
            'volumen_m3' => $entrega->volumen_total ?? 0,
            'fecha_asignacion' => $entrega->fecha_asignacion?->toIso8601String(),
        ]);
    }

    /**
     * Notificar que una venta fue asignada a una entrega
     * ✅ Incluye nombre del estado logístico y mensaje centralizado
     */
    public function notifyVentaAsignada($venta, $entrega): bool
    {
        // ✅ Cargar relación del estado logístico si no está cargada
        if (!$venta->relationLoaded('estadoLogistico')) {
            $venta->load('estadoLogistico');
        }

        // ✅ NUEVO: Usar servicio centralizado de mensajes
        $estadoLogisticoNombre = $venta->estadoLogistico?->nombre ?? 'Pendiente';
        $mensaje = \App\Services\Notifications\NotificationMessageService::ventasAsignadasAEntrega(
            entregaId: $entrega->id,
            estadoLogistico: $estadoLogisticoNombre,
            clienteNombre: $venta->cliente?->nombre
        );

        return $this->send('notify/venta-asignada-entrega', [
            'venta_id' => $venta->id,
            'venta_numero' => $venta->numero,
            'entrega_id' => $entrega->id,
            'entrega_numero' => $entrega->numero_entrega,
            'cliente_id' => $venta->cliente_id,
            'cliente_nombre' => $venta->cliente?->nombre ?? 'Cliente',
            'user_id' => $venta->cliente?->user_id, // Para routing correcto en WebSocket
            'preventista_id' => $venta->preventista_id,
            'total' => (float) $venta->total,
            'chofer_nombre' => $entrega->chofer?->name ?? 'Chofer asignado',
            'vehiculo_placa' => $entrega->vehiculo?->placa ?? 'Vehículo',
            'estado_logistico_nombre' => $estadoLogisticoNombre,  // ✅ Estado logístico
            'mensaje' => $mensaje,  // ✅ NUEVO: Mensaje centralizado
            'fecha_asignacion' => $entrega->fecha_asignacion?->toIso8601String(),
        ]);
    }

    /**
     * Notificar que un reporte de carga fue generado
     */
    public function notifyReporteCargoGenerado($entrega, $reporte): bool
    {
        return $this->send('notify/reporte-cargo-generado', [
            'entrega_id' => $entrega->id,
            'entrega_numero' => $entrega->numero_entrega,
            'reporte_id' => $reporte->id,
            'reporte_numero' => $reporte->numero,
            'estado' => $entrega->estado,
            'chofer_nombre' => $entrega->chofer?->name ?? 'Chofer',
            'vehiculo_placa' => $entrega->vehiculo?->placa ?? 'Vehículo',
            'ventas_count' => $entrega->ventas()->count() ?? 0,
            'fecha_generacion' => now()->toIso8601String(),
        ]);
    }

    /**
     * ✅ NUEVO: Notificar cambio de estado de entrega a clientes y preventistas
     *
     * Cuando el chofer marca la entrega como "LISTO_PARA_ENTREGA", "EN_TRANSITO", etc.
     * Se notifica a todos los clientes y preventistas cuyas ventas están en esa entrega
     *
     * @param $entrega - Modelo de entrega
     * @param string $estadoNuevo - Código del nuevo estado (ej: "LISTO_PARA_ENTREGA")
     * @param string|null $estadoAnterior - Código del estado anterior
     */
    public function notifyEstadoSincronizado($entrega, string $estadoNuevo, ?string $estadoAnterior = null): bool
    {
        try {
            // Cargar ventas con relaciones necesarias
            $ventas = $entrega->ventas()
                ->with(['cliente', 'cliente.user', 'preventista', 'estadoLogistica'])
                ->get();

            if ($ventas->isEmpty()) {
                \Log::info('EntregaWebSocketService: No hay ventas en entrega', [
                    'entrega_id' => $entrega->id,
                ]);
                return false;
            }

            \Log::info('📢 EntregaWebSocketService::notifyEstadoSincronizado', [
                'entrega_id' => $entrega->id,
                'estado_nuevo' => $estadoNuevo,
                'cantidad_ventas' => $ventas->count(),
            ]);

            $exitosas = 0;

            // Notificar a clientes y preventistas de cada venta
            foreach ($ventas as $venta) {
                try {
                    // Obtener nombre del estado logístico
                    $estadoLogisticoNombre = $venta->estadoLogistica?->nombre ?? $estadoNuevo;

                    // Construir mensaje centralizado
                    $mensaje = \App\Services\Notifications\NotificationMessageService::ventaEstadoCambio(
                        ventaId: $venta->id,
                        nuevoEstado: $estadoLogisticoNombre,
                        entregaId: $entrega->id,
                        clienteNombre: $venta->cliente?->nombre
                    );

                    // Datos comunes para todas las notificaciones
                    $notificacionData = [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'cliente_id' => $venta->cliente_id,
                        'cliente' => [
                            'id' => $venta->cliente->id,
                            'nombre' => $venta->cliente->nombre,
                        ],
                        'estado_nuevo' => [
                            'codigo' => $estadoNuevo,
                            'nombre' => $estadoLogisticoNombre,
                        ],
                        'entrega' => [
                            'id' => $entrega->id,
                            'numero' => $entrega->numero_entrega,
                        ],
                        'chofer' => [
                            'id' => $entrega->chofer_id,
                            'nombre' => $entrega->chofer?->name,
                        ],
                        'razon' => 'Cambio de estado de entrega',
                        'total' => (float) $venta->total,
                        'mensaje' => $mensaje,
                        'fecha_cambio' => now()->toIso8601String(),
                        'categoria' => 'venta_logistica',
                    ];

                    // 1️⃣ Notificar al CLIENTE
                    if ($venta->cliente?->user_id) {
                        \Log::info('📢 Enviando notificación a CLIENTE', [
                            'venta_id' => $venta->id,
                            'cliente_id' => $venta->cliente->id,
                            'cliente_user_id' => $venta->cliente->user_id,
                            'estado_nuevo' => $estadoNuevo,
                        ]);
                        $this->send('notify/venta-estado-cambio', array_merge($notificacionData, [
                            'user_id' => $venta->cliente->user_id, // ✅ Usar user_id para routing
                        ]));
                        $exitosas++;
                    } else {
                        \Log::warning('⚠️ Cliente NO tiene user_id', [
                            'venta_id' => $venta->id,
                            'cliente_id' => $venta->cliente_id,
                            'cliente' => $venta->cliente ? ['id' => $venta->cliente->id, 'nombre' => $venta->cliente->nombre] : null,
                        ]);
                    }

                    // 2️⃣ Notificar al PREVENTISTA (si existe)
                    if ($venta->preventista_id) {
                        \Log::info('📢 Enviando notificación a PREVENTISTA', [
                            'venta_id' => $venta->id,
                            'preventista_id' => $venta->preventista_id,
                            'estado_nuevo' => $estadoNuevo,
                        ]);
                        $this->send('notify/venta-estado-cambio', array_merge($notificacionData, [
                            'user_id' => $venta->preventista_id, // Preventista es User
                        ]));
                        $exitosas++;
                    }

                } catch (\Exception $e) {
                    \Log::warning('EntregaWebSocketService: Error notificando venta', [
                        'venta_id' => $venta->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            // 3️⃣ Notificar a ADMINS y CAJEROS (supervisión de estado de entregas)
            try {
                $datosEntrega = [
                    'entrega_id' => $entrega->id,
                    'numero_entrega' => $entrega->numero_entrega,
                    'estado_nuevo' => $estadoNuevo,
                    'chofer' => [
                        'id' => $entrega->chofer_id,
                        'nombre' => $entrega->chofer?->name,
                    ],
                    'vehiculo' => [
                        'placa' => $entrega->vehiculo?->placa,
                        'marca' => $entrega->vehiculo?->marca,
                    ],
                    'cantidad_ventas' => $ventas->count(),
                    'monto_total' => $ventas->sum('total'),
                    'fecha_cambio' => now()->toIso8601String(),
                ];

                // Emitir a ADMINS (supervisión completa)
                $this->send('notify/entrega-estado-cambio', array_merge($datosEntrega, [
                    'destinatario' => 'admins',
                ]));

                // Emitir a CAJEROS (control de pagos)
                $this->send('notify/entrega-estado-cambio', array_merge($datosEntrega, [
                    'destinatario' => 'cajeros',
                ]));

                // ✅ NUEVO: Emitir al CREADOR (quién creó la entrega)
                if ($entrega->created_by) {
                    $this->send('notify/entrega-estado-cambio', array_merge($datosEntrega, [
                        'destinatario' => 'creador',
                        'user_id' => $entrega->created_by, // ✅ ID del creador para routing en Node.js
                    ]));
                    $exitosas++;
                }

                $exitosas += 2; // admins + cajeros

                \Log::info('✅ Notificaciones enviadas a admins, cajeros y creador', [
                    'entrega_id' => $entrega->id,
                    'estado_nuevo' => $estadoNuevo,
                    'creador_id' => $entrega->created_by,
                ]);

            } catch (\Exception $e) {
                \Log::warning('EntregaWebSocketService: Error notificando admins/cajeros/creador', [
                    'entrega_id' => $entrega->id,
                    'error' => $e->getMessage(),
                ]);
            }

            \Log::info('✅ Notificaciones enviadas a clientes/preventistas', [
                'entrega_id' => $entrega->id,
                'notificaciones_exitosas' => $exitosas,
            ]);

            return $exitosas > 0;

        } catch (\Exception $e) {
            \Log::error('❌ EntregaWebSocketService::notifyEstadoSincronizado Error', [
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * ✅ NUEVO: Notificar cuando entrega cambia a "EN_TRANSITO" con validación SLA
     *
     * @param $entrega
     * @param string $estadoNuevo
     */
    public function notifyEstadoConValidacionSLA($entrega, string $estadoNuevo): bool
    {
        // Por ahora, usar el mismo método de sincronización
        // En el futuro se puede agregar lógica de SLA
        return $this->notifyEstadoSincronizado($entrega, $estadoNuevo);
    }

    /**
     * ✅ NUEVO: Notificar cuando una VENTA es confirmada como ENTREGADA o con NOVEDAD
     * Envía notificaciones personalizadas según tipo de entrega:
     * - COMPLETA: Entrega exitosa sin problemas
     * - CON_NOVEDAD: Hay problemas (tienda cerrada, cliente rechaza, devolución, etc)
     */
    public function notifyVentaEntregada(
        $venta,
        $entrega,
        $cliente,
        ?string $tipoEntrega = 'COMPLETA',
        ?string $tipoNovedad = null,
        $confirmacion = null,
        ?string $estadoPago = 'PAGADO',
        ?float $totalRecibido = 0
    ): bool {
        try {
            // Cargar relaciones si no están cargadas
            if (!$venta->relationLoaded('cliente')) {
                $venta->load('cliente');
            }

            \Log::info('📢 EntregaWebSocketService::notifyVentaEntregada', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'entrega_id' => $entrega->id,
                'cliente_id' => $venta->cliente_id,
                'tipo_entrega' => $tipoEntrega,
                'tipo_novedad' => $tipoNovedad,
                'estado_pago' => $estadoPago,
            ]);

            $exitosas = 0;

            // ✅ Generar mensajes personalizados según tipo de entrega
            $mensajeCliente = $this->generarMensajeEntrega(
                tipoEntrega: $tipoEntrega,
                tipoNovedad: $tipoNovedad,
                venta: $venta,
                entrega: $entrega,
                estadoPago: $estadoPago,
                totalRecibido: $totalRecibido,
                rol: 'cliente'
            );

            $mensajeAdmin = $this->generarMensajeEntrega(
                tipoEntrega: $tipoEntrega,
                tipoNovedad: $tipoNovedad,
                venta: $venta,
                entrega: $entrega,
                estadoPago: $estadoPago,
                totalRecibido: $totalRecibido,
                rol: 'admin'
            );

            // Datos comunes para la notificación
            $notificacionData = [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'cliente_id' => $venta->cliente_id,
                'cliente_nombre' => $venta->cliente?->nombre ?? 'Cliente',
                'entrega_id' => $entrega->id,
                'entrega_numero' => $entrega->numero_entrega,
                'chofer' => [
                    'id' => $entrega->chofer_id,
                    'nombre' => $entrega->chofer?->name ?? 'Chofer',
                ],
                'total' => (float) $venta->total,
                'tipo_entrega' => $tipoEntrega,
                'tipo_novedad' => $tipoNovedad,
                'estado_pago' => $estadoPago,
                'total_recibido' => $totalRecibido ?? 0,
                'estado' => 'ENTREGADA',
                'fecha_entrega' => now()->toIso8601String(),
                'categoria' => 'venta_entregada',
            ];

            // 1️⃣ Notificar al CLIENTE
            if ($venta->cliente?->user_id) {
                \Log::info('📢 Enviando notificación a CLIENTE de venta entregada', [
                    'venta_id' => $venta->id,
                    'cliente_id' => $venta->cliente->id,
                    'cliente_user_id' => $venta->cliente->user_id,
                    'tipo_entrega' => $tipoEntrega,
                ]);
                $this->send('notify/venta-entregada-cliente', array_merge($notificacionData, [
                    'user_id' => $venta->cliente->user_id,
                    'mensaje' => $mensajeCliente,
                ]));
                $exitosas++;
            }

            // 2️⃣ Notificar al PREVENTISTA (si existe)
            if ($venta->preventista_id) {
                \Log::info('📢 Enviando notificación a PREVENTISTA de venta entregada', [
                    'venta_id' => $venta->id,
                    'preventista_id' => $venta->preventista_id,
                    'tipo_entrega' => $tipoEntrega,
                ]);
                $this->send('notify/venta-entregada-cliente', array_merge($notificacionData, [
                    'user_id' => $venta->preventista_id,
                    'mensaje' => $mensajeCliente,
                ]));
                $exitosas++;
            }

            // 3️⃣ Notificar a ADMINS (supervisión)
            try {
                \Log::info('📢 Enviando notificación a ADMINS de venta entregada', [
                    'venta_id' => $venta->id,
                    'entrega_id' => $entrega->id,
                    'tipo_entrega' => $tipoEntrega,
                ]);
                $this->send('notify/venta-entregada-admin', array_merge($notificacionData, [
                    'destinatario' => 'admins',
                    'mensaje' => $mensajeAdmin,
                ]));
                $exitosas++;
            } catch (\Exception $e) {
                \Log::warning('Error notificando a admins', ['error' => $e->getMessage()]);
            }

            // 4️⃣ Notificar a CAJEROS (control de pagos)
            try {
                \Log::info('📢 Enviando notificación a CAJEROS de venta entregada', [
                    'venta_id' => $venta->id,
                    'total' => $venta->total,
                    'estado_pago' => $estadoPago,
                ]);
                $this->send('notify/venta-entregada-admin', array_merge($notificacionData, [
                    'destinatario' => 'cajeros',
                    'mensaje' => $mensajeAdmin,
                ]));
                $exitosas++;
            } catch (\Exception $e) {
                \Log::warning('Error notificando a cajeros', ['error' => $e->getMessage()]);
            }

            \Log::info('✅ Notificaciones de venta entregada enviadas', [
                'venta_id' => $venta->id,
                'notificaciones_exitosas' => $exitosas,
                'tipo_entrega' => $tipoEntrega,
            ]);

            return $exitosas > 0;

        } catch (\Exception $e) {
            \Log::error('❌ EntregaWebSocketService::notifyVentaEntregada Error', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * ✅ Generar mensaje personalizado según tipo de entrega y novedad
     * Mensajes diferentes para cliente vs admin
     */
    private function generarMensajeEntrega(
        string $tipoEntrega,
        ?string $tipoNovedad,
        $venta,
        $entrega,
        ?string $estadoPago,
        ?float $totalRecibido,
        string $rol = 'cliente'
    ): string {
        $cliente = $venta->cliente?->nombre ?? 'Cliente';
        $chofer = $entrega->chofer?->name ?? 'Chofer';

        if ($tipoEntrega === 'COMPLETA') {
            // ✅ Entrega exitosa
            if ($rol === 'cliente') {
                return match ($estadoPago) {
                    'PAGADO' => "✅ Tu venta #{$venta->numero} fue entregada y pagada correctamente por {$chofer}",
                    'PARCIAL' => "✅ Tu venta #{$venta->numero} fue entregada. Pago recibido: Bs. {$totalRecibido} (Saldo pendiente)",
                    'NO_PAGADO' => "✅ Tu venta #{$venta->numero} fue entregada sin pago registrado",
                    default => "✅ Tu venta #{$venta->numero} fue entregada exitosamente por {$chofer}"
                };
            } else {
                return match ($estadoPago) {
                    'PAGADO' => "✅ Venta #{$venta->numero} ({$cliente}) - Entregada y pagada - Bs. {$venta->total}",
                    'PARCIAL' => "✅ Venta #{$venta->numero} ({$cliente}) - Entregada, pago parcial: Bs. {$totalRecibido}",
                    'NO_PAGADO' => "⚠️ Venta #{$venta->numero} ({$cliente}) - Entregada sin pago - Monto: Bs. {$venta->total}",
                    default => "✅ Venta #{$venta->numero} ({$cliente}) entregada correctamente"
                };
            }
        } else {
            // ❌ Entrega con NOVEDAD
            $mensajeNovedad = match ($tipoNovedad) {
                'TIENDA_CERRADA' => '🏪 Tienda cerrada',
                'CLIENTE_AUSENTE' => '👤 Cliente ausente',
                'CLIENTE_RECHAZA' => '❌ Cliente rechazó la entrega',
                'CLIENTE_NO_IDENTIFICADO' => '🚫 Cliente no identificado',
                'DEVOLUCIÓN_PARCIAL' => '📦 Devolución parcial de productos',
                'OTRO' => '⚠️ Novedad en la entrega',
                default => '⚠️ Entrega con novedad'
            };

            if ($rol === 'cliente') {
                return "⚠️ Tu venta #{$venta->numero} tiene una novedad: {$mensajeNovedad}. Por favor, contacta con el equipo de logística";
            } else {
                return "{$mensajeNovedad} - Venta #{$venta->numero} ({$cliente}) - Requiere acción";
            }
        }
    }
}
