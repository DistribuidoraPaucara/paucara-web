<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entrega extends Model
{
    use HasFactory;

    protected $fillable = [
        // Asignación de recursos
        'chofer_id',
        'created_by',               // ✅ Usuario que creó la entrega
        'vehiculo_id',
        'zona_id',                  // ✅ FK a tabla localidades (localidad de entrega)

        // Identificadores
        'numero_entrega',           // ID legible (ENT-20251227-001)

        // Estados y flujo
        'estado',                   // ENUM (legacy, será deprecado)
        'estado_entrega_id',        // FK a estados_logistica (categoría: entrega) - NUEVO
        'fecha_asignacion',
        'fecha_inicio',
        'fecha_llegada',
        'fecha_entrega',
        'fecha_programada',

        // SLA (copiado de venta para sincronización)
        'fecha_entrega_comprometida',  // NUEVO
        'ventana_entrega_ini',         // NUEVO
        'ventana_entrega_fin',         // NUEVO

        // Información de entrega
        'peso_kg',                  // Suma de pesos de ventas
        'observaciones',
        'entregador_id',            // FK a users (quién realiza la entrega)
        'motivo_novedad',
        'motivo_cancelacion',       // NUEVO: Razón de cancelación
        'cancelada_en',             // NUEVO: Fecha de cancelación
        'cancelada_por_id',         // NUEVO: ID del usuario que canceló

        // Comprobantes
        'firma_digital_url',
        'foto_entrega_url',
        'fecha_firma_entrega',

        // Flujo de carga
        'confirmado_carga_por',
        'fecha_confirmacion_carga',
        'iniciada_entrega_por',
        'fecha_inicio_entrega',

        // GPS Tracking
        'latitud_actual',
        'longitud_actual',
        'fecha_ultima_ubicacion',
    ];

    protected function casts(): array
    {
        return [
            'fecha_asignacion' => 'datetime',
            'fecha_inicio' => 'datetime',
            'fecha_llegada' => 'datetime',
            'fecha_entrega' => 'datetime',
            'fecha_programada' => 'datetime',
            'fecha_entrega_comprometida' => 'datetime',  // NUEVO: SLA
            'ventana_entrega_ini' => 'string',           // NUEVO: SLA (TIME type - cast as string HH:MM:SS)
            'ventana_entrega_fin' => 'string',           // NUEVO: SLA (TIME type - cast as string HH:MM:SS)
            'fecha_firma_entrega' => 'datetime',
            'fecha_confirmacion_carga' => 'datetime',
            'fecha_inicio_entrega' => 'datetime',
            'fecha_ultima_ubicacion' => 'datetime',
            'cancelada_en' => 'datetime',          // NUEVO: Fecha de cancelación
            'latitud_actual' => 'decimal:8',
            'longitud_actual' => 'decimal:8',
        ];
    }

    // Estados de la entrega - Flujo original
    const ESTADO_PROGRAMADO = 'PROGRAMADO';     // Estado inicial
    const ESTADO_ASIGNADA = 'ASIGNADA';
    const ESTADO_EN_CAMINO = 'EN_CAMINO';
    const ESTADO_LLEGO = 'LLEGO';
    const ESTADO_ENTREGADO = 'ENTREGADO';
    const ESTADO_NOVEDAD = 'NOVEDAD';
    const ESTADO_CANCELADA = 'CANCELADA';

    // Estados de la entrega - Nuevo flujo de carga (PREPARACION_CARGA → EN_CARGA → LISTO_PARA_ENTREGA → EN_TRANSITO → ENTREGADO)
    const ESTADO_PREPARACION_CARGA = 'PREPARACION_CARGA';      // Reporte generado, awaiting physical loading
    const ESTADO_EN_CARGA = 'EN_CARGA';                        // Physical loading in progress
    const ESTADO_LISTO_PARA_ENTREGA = 'LISTO_PARA_ENTREGA';   // Ready to depart
    const ESTADO_EN_TRANSITO = 'EN_TRANSITO';                 // GPS tracking active
    const ESTADO_RECHAZADO = 'RECHAZADO';                     // Rejected at delivery

    /**
     * Relaciones
     */

    /**
     * Ventas asociadas a esta entrega (NUEVA ARQUITECTURA - FASE 3)
     *
     * RELACIÓN 1:N: Una entrega contiene MUCHAS ventas
     *
     * MIGRACIÓN:
     * - FASE 1: N:M via pivot table (entrega_venta) ← LEGACY
     * - FASE 3: 1:N via FK venta.entrega_id (relación actual) ← ACTUAL
     *
     * Uso:
     *   $entrega->ventas;           // Todas las ventas
     *   $entrega->ventas->count()   // Cantidad de ventas
     *   $entrega->ventas()->where('estado_logistico_id', $id)->get()
     *
     * NOTA: Se mantiene compatible con métodos legacy como confirmadas(), pendientes()
     */
    public function ventas(): HasMany
    {
        return $this->hasMany(Venta::class, 'entrega_id');
    }

    /**
     * Ventas asociadas a esta entrega (LEGACY - PHASE 1)
     *
     * ⚠️ DEPRECADO en FASE 3: Usar $entrega->ventas() en su lugar
     *
     * Relación N:M via pivot table entrega_venta
     * Se mantiene por compatibilidad durante transición
     *
     * SERÁ ELIMINADA cuando se dropee tabla pivot en FASE 3b
     */
    public function ventasLegacy(): BelongsToMany
    {
        return $this->belongsToMany(
            Venta::class,
            'entrega_venta',      // tabla pivot
            'entrega_id',         // FK en pivot hacia entregas
            'venta_id'            // FK en pivot hacia ventas
        )
        ->withPivot([
            'orden',
            'confirmado_por',
            'fecha_confirmacion',
            'notas',
            'created_at',
            'updated_at',
        ])
        ->orderByPivot('orden');  // Ordenar por orden de carga (evita ambiguous column)
    }

    /**
     * Acceso directo a la tabla pivot (entrega_venta)
     * Útil para acceder a metadatos del vínculo
     */
    public function ventasAsociadas(): HasMany
    {
        return $this->hasMany(EntregaVenta::class);
    }

    /**
     * Chofer (User) asignado a esta entrega
     * FK a users.id (user con rol 'Chofer')
     *
     * Relación inversa: User -> empleado() para acceder a datos del empleado
     */
    public function chofer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'chofer_id');
    }

    /**
     * Entregador (User) que realiza la entrega
     * FK a users.id (user con rol 'Chofer')
     *
     * ✅ NUEVO: Relación con el usuario que realiza la entrega
     * Puede ser el mismo chofer u otro usuario del sistema
     */
    public function entregador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'entregador_id');
    }

    /**
     * Vehículo asignado a esta entrega
     */
    public function vehiculo(): BelongsTo
    {
        return $this->belongsTo(Vehiculo::class);
    }

    /**
     * Localidad de entrega
     *
     * ✅ SINCRONIZADO: zona_id es FK a tabla localidades (localidades son ciudades/pueblos)
     * Localidades pueden tener relación M-M con Zonas (áreas de distribución) via tabla localidad_zona
     *
     * Acceso:
     *   $entrega->localidad->nombre        // Ej: "La Paz"
     *   $entrega->localidad->zonas()->get() // Zonas de distribución de esta localidad
     */
    public function localidad(): BelongsTo
    {
        return $this->belongsTo(Localidad::class, 'zona_id');
    }

    /**
     * Estado logístico normalizado (NUEVO - FASE 1)
     *
     * FK a estados_logistica.categoria = 'entrega'
     * Reemplaza al ENUM 'estado' con transiciones validadas en BD
     *
     * Uso:
     *   $entrega->estadoEntrega->codigo       // 'ENTREGADO'
     *   $entrega->estadoEntrega->nombre       // 'Entregada'
     *   $entrega->estadoEntrega->esEstadoFinal()  // true/false
     */
    public function estadoEntrega(): BelongsTo
    {
        return $this->belongsTo(EstadoLogistica::class, 'estado_entrega_id');
    }

    /**
     * Ubicaciones de tracking de esta entrega
     */
    public function ubicaciones(): HasMany
    {
        return $this->hasMany(UbicacionTracking::class);
    }

    /**
     * Historial de cambios de estado
     */
    public function historialEstados(): HasMany
    {
        return $this->hasMany(EntregaEstadoHistorial::class);
    }

    /**
     * Confirmaciones de entrega por venta
     *
     * Registros de confirmación de entregas por venta individual
     * Incluye fotos, firma digital, contexto de entrega (tienda abierta, cliente presente)
     * y motivos de rechazo si aplica
     *
     * Uso:
     *   $entrega->confirmacionesVentas              // Todas las confirmaciones
     *   $entrega->confirmacionesVentas()->count()   // Cantidad de ventas confirmadas
     */
    public function confirmacionesVentas(): HasMany
    {
        return $this->hasMany(EntregaVentaConfirmacion::class);
    }

    /**
     * Reportes de carga asociados a esta entrega (Many-to-Many)
     *
     * NUEVA RELACIÓN: Una entrega puede estar en múltiples reportes
     * - Si se divide una entrega entre varios reportes
     * - O si se recrea un reporte
     */
    public function reportes()
    {
        return $this->belongsToMany(
            ReporteCarga::class,
            'reporte_carga_entregas',
            'entrega_id',
            'reporte_carga_id'
        )->withPivot(['orden', 'incluida_en_carga', 'notas'])
         ->withTimestamps()
         ->orderBy('reporte_carga_entregas.created_at', 'desc');
    }

    /**
     * Acceso directo a la tabla pivot (reporte_carga_entregas)
     * Útil para acceder a metadatos del vínculo (orden, incluida_en_carga, notas)
     */
    public function reporteEntregas(): HasMany
    {
        return $this->hasMany(ReporteCargaEntrega::class);
    }

    /**
     * Usuario que confirmó la carga
     */
    public function confirmadorCarga(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmado_carga_por');
    }

    /**
     * Usuario que inició la entrega
     */
    public function iniciadorEntrega(): BelongsTo
    {
        return $this->belongsTo(User::class, 'iniciada_entrega_por');
    }

    /**
     * ✅ NUEVO: Usuario que creó la entrega
     * Permite notificar al creador de cambios de estado
     */
    public function creador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Boot del modelo
     * Validaciones antes de crear/actualizar + Sincronización con Ventas
     *
     * CAMBIOS EN FASE 2:
     * - Removemos validación de venta_id (ahora via pivot entrega_venta)
     * - La sincronización ocurre a través del servicio CrearEntregaPorLocalidadService
     * - Cada entrega puede tener 0 o N ventas (se agregan después via pivot)
     */
    protected static function boot(): void
    {
        parent::boot();

        // Validar que siempre haya proforma_id O entregas estén siendo creadas sin venta_id
        // (Las ventas se agregan después via pivot entrega_venta)
        static::creating(function ($model) {
            // En la nueva arquitectura, venta_id no es requerido
            // Las ventas se asignan después via la tabla pivot entrega_venta
            // Solo validar proforma_id para compatibilidad legacy
            // (En la mayoría de casos nuevos, proforma_id será null)
        });

        // ⚠️ NOTA: La sincronización de estados de ventas se ejecuta MANUALMENTE
        // después de cambiar el estado, NO en el boot event.
        //
        // Razón: El boot event se ejecuta durante la transacción y las relaciones
        // no están recargadas correctamente. Es más seguro sincronizar después
        // en el contexto donde sabemos exactamente qué cambió.
        //
        // Ubicación: confirmarVentaCargada() → cambiarEstado() → sincronizarEstadosVentas()
    }

    /**
     * Métodos útiles
     */

    /**
     * Obtener la última ubicación registrada
     */
    public function ultimaUbicacion()
    {
        return $this->ubicaciones()->latest('timestamp')->first();
    }

    /**
     * Definir transiciones válidas de estados
     *
     * Estados antiguos (legacy):
     *   PROGRAMADO → ASIGNADA → EN_CAMINO → LLEGO → ENTREGADO
     *
     * Estados nuevos (flujo de carga):
     *   PROGRAMADO → PREPARACION_CARGA → EN_CARGA → LISTO_PARA_ENTREGA → EN_TRANSITO → ENTREGADO
     *
     * Ambos flujos pueden ir a CANCELADA, NOVEDAD o RECHAZADO en cualquier momento
     */
    private function obtenerTransicionesValidas(): array
    {
        return [
            // Estado inicial
            self::ESTADO_PROGRAMADO => [
                self::ESTADO_ASIGNADA,              // Flujo legacy
                self::ESTADO_PREPARACION_CARGA,     // Flujo nuevo de carga
                self::ESTADO_CANCELADA,             // Cancelar desde inicio
            ],
            // Flujo legacy
            self::ESTADO_ASIGNADA => [
                self::ESTADO_EN_CAMINO,
                self::ESTADO_CANCELADA,
                self::ESTADO_NOVEDAD,
            ],
            self::ESTADO_EN_CAMINO => [
                self::ESTADO_LLEGO,
                self::ESTADO_NOVEDAD,
            ],
            self::ESTADO_LLEGO => [
                self::ESTADO_ENTREGADO,
                self::ESTADO_NOVEDAD,
                self::ESTADO_RECHAZADO,
            ],
            // Flujo nuevo de carga
            self::ESTADO_PREPARACION_CARGA => [
                self::ESTADO_EN_CARGA,
                self::ESTADO_CANCELADA,
            ],
            self::ESTADO_EN_CARGA => [
                self::ESTADO_LISTO_PARA_ENTREGA,
                self::ESTADO_CANCELADA,
            ],
            self::ESTADO_LISTO_PARA_ENTREGA => [
                self::ESTADO_EN_TRANSITO,
                self::ESTADO_CANCELADA,
            ],
            self::ESTADO_EN_TRANSITO => [
                self::ESTADO_ENTREGADO,
                self::ESTADO_NOVEDAD,
                self::ESTADO_RECHAZADO,
            ],
            // Estados finales/excepcionales
            self::ESTADO_ENTREGADO => [],          // Terminal
            self::ESTADO_CANCELADA => [],          // Terminal
            self::ESTADO_NOVEDAD => [
                self::ESTADO_ENTREGADO,
                self::ESTADO_CANCELADA,
            ],
            self::ESTADO_RECHAZADO => [
                self::ESTADO_CANCELADA,
            ],
        ];
    }

    /**
     * Validar si una transición de estado es permitida
     */
    public function esTransicionValida(string $nuevoEstado): bool
    {
        $transiciones = $this->obtenerTransicionesValidas();
        $estadoActual = $this->estado;

        if (!isset($transiciones[$estadoActual])) {
            return false;
        }

        return in_array($nuevoEstado, $transiciones[$estadoActual]);
    }

    /**
     * Obtener los estados a los que puede transicionar
     */
    public function obtenerEstadosSiguientes(): array
    {
        $transiciones = $this->obtenerTransicionesValidas();
        return $transiciones[$this->estado] ?? [];
    }

    /**
     * Cambiar estado de la entrega con validación
     *
     * Actualiza tanto el enum 'estado' como la FK 'estado_entrega_id'
     * para mantener sincronización entre FASE 1 (legacy) y FASE 3 (actual)
     */
    public function cambiarEstado(string $nuevoEstado, ?string $comentario = null, ?\Illuminate\Foundation\Auth\User $usuario = null): void
    {
        // Validar que la transición sea válida
        if (!$this->esTransicionValida($nuevoEstado)) {
            $estadoActual = $this->estado;
            $estadosSiguientes = $this->obtenerEstadosSiguientes();
            $estados = implode(', ', $estadosSiguientes);
            throw new \InvalidArgumentException(
                "No se puede transicionar de '{$estadoActual}' a '{$nuevoEstado}'. " .
                "Estados válidos: {$estados}"
            );
        }

        // Obtener el estado logístico correspondiente
        $estadoLogistico = \App\Models\EstadoLogistica::where('codigo', $nuevoEstado)
            ->where('categoria', 'entrega')
            ->first();

        if (!$estadoLogistico) {
            \Log::error('❌ [cambiarEstado] Estado logístico no encontrado', [
                'entrega_id' => $this->id,
                'codigo_estado' => $nuevoEstado,
                'categoria' => 'entrega',
            ]);
        }

        // Registrar en historial
        $this->historialEstados()->create([
            'estado_anterior' => $this->estado,
            'estado_nuevo' => $nuevoEstado,
            'comentario' => $comentario,
            'usuario_id' => $usuario?->id,
            'metadata' => null,
        ]);

        // Actualizar AMBOS estados: enum y FK
        $this->update([
            'estado' => $nuevoEstado,
            'estado_entrega_id' => $estadoLogistico?->id,  // ✅ FK a estados_logistica
        ]);

        \Log::info('✅ [cambiarEstado] Estado de entrega actualizado', [
            'entrega_id' => $this->id,
            'estado_anterior' => $this->getOriginal('estado'),
            'estado_nuevo' => $nuevoEstado,
            'estado_entrega_id' => $estadoLogistico?->id,
        ]);
    }

    /**
     * Obtener la fuente de la entrega (Venta o Proforma)
     */
    public function obtenerFuente()
    {
        if ($this->venta_id) {
            return $this->venta;
        }
        return $this->proforma;
    }

    /**
     * Obtener el nombre de la fuente
     */
    public function obtenerNombreFuente(): string
    {
        return $this->venta_id ? 'Venta' : 'Proforma';
    }

    /**
     * Verificar si está en el flujo nuevo de carga
     */
    public function estaEnFlujoDeCargas(): bool
    {
        return in_array($this->estado, [
            self::ESTADO_PREPARACION_CARGA,
            self::ESTADO_EN_CARGA,
            self::ESTADO_LISTO_PARA_ENTREGA,
            self::ESTADO_EN_TRANSITO,
        ]);
    }

    /**
     * Verificar si está en el flujo legacy
     */
    public function estaEnFlujoLegacy(): bool
    {
        return in_array($this->estado, [
            self::ESTADO_ASIGNADA,
            self::ESTADO_EN_CAMINO,
            self::ESTADO_LLEGO,
        ]);
    }

    /**
     * Verificar si la entrega ha sido entregada
     */
    public function esEntregada(): bool
    {
        return $this->estado === self::ESTADO_ENTREGADO;
    }

    /**
     * Verificar si está en tránsito
     */
    public function estaEnTransito(): bool
    {
        return in_array($this->estado, [self::ESTADO_EN_CAMINO, self::ESTADO_LLEGO, self::ESTADO_EN_TRANSITO]);
    }

    /**
     * Verificar si fue cancelada
     */
    public function fueCancelada(): bool
    {
        return $this->estado === self::ESTADO_CANCELADA;
    }

    /**
     * Verificar si tiene reporte de carga
     */
    public function tieneReporteDeCarga(): bool
    {
        return $this->reporte_carga_id !== null;
    }

    /**
     * ─────────────────────────────────────────────
     * MÉTODOS PARA CONFIRMACIÓN DE CARGA (FASE 2+)
     * ─────────────────────────────────────────────
     *
     * Flujo:
     * 1. Almacenero ve Entrega #100 con 3 ventas
     * 2. Confirma cada venta al cargarla al vehículo
     * 3. Sistema marca automáticamente Entrega como LISTA_PARA_ENTREGA
     *    cuando todas las ventas están confirmadas
     */

    /**
     * Obtener todas las ventas de esta entrega
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function obtenerVentas()
    {
        return $this->ventas()->orderBy('entrega_venta.orden')->get();
    }

    /**
     * Obtener las ventas confirmadas como cargadas
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function obtenerVentasConfirmadas()
    {
        return $this->ventasAsociadas()
            ->confirmed()
            ->get()
            ->map(fn($ev) => $ev->venta);
    }

    /**
     * Obtener las ventas pendientes de confirmación
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function obtenerVentasPendientes()
    {
        return $this->ventasAsociadas()
            ->pendientes()
            ->get()
            ->map(fn($ev) => $ev->venta);
    }

    /**
     * Confirmar una venta como cargada en el vehículo
     *
     * Uso:
     *   $entrega->confirmarVentaCargada($venta, auth()->user(), 'Notas...');
     *
     * @param \App\Models\Venta $venta
     * @param \App\Models\User|null $usuario Usuario que confirma (almacenero)
     * @param string|null $notas Observaciones
     * @return void
     * @throws \Exception Si la venta no pertenece a esta entrega
     */
    public function confirmarVentaCargada(Venta $venta, ?User $usuario = null, ?string $notas = null): void
    {
        // Verificar que la venta pertenece a esta entrega (FASE 3: 1:N directa O FASE 1: pivot)
        $entregaVenta = $this->ventasAsociadas()
            ->where('venta_id', $venta->id)
            ->first();

        // Si no está en la tabla pivot (legacy), verificar si está en la relación 1:N (FASE 3)
        if (!$entregaVenta && !$this->ventas()->where('id', $venta->id)->exists()) {
            throw new \InvalidArgumentException(
                "Venta #{$venta->id} no pertenece a Entrega #{$this->id}"
            );
        }

        // Si está en relación 1:N pero no en pivot, crear el registro pivot
        if (!$entregaVenta && $this->ventas()->where('id', $venta->id)->exists()) {
            $entregaVenta = EntregaVenta::create([
                'entrega_id' => $this->id,
                'venta_id' => $venta->id,
                'orden' => $this->ventasAsociadas()->max('orden') + 1,
            ]);
        }

        // Confirmar la venta
        $entregaVenta->confirmarCarga($usuario, $notas);

        \Log::info('✅ [CONFIRM] Venta confirmada como cargada', [
            'entrega_id' => $this->id,
            'venta_id' => $venta->id,
            'venta_numero' => $venta->numero,
        ]);

        // Sincronizar el estado de la venta que acaba de confirmarse
        try {
            $this->sincronizarEstadosVentas();
        } catch (\Exception $e) {
            \Log::error('❌ [CONFIRM] Error en sincronización inicial', [
                'entrega_id' => $this->id,
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);
        }

        // Actualizar estado de la venta a PENDIENTE_ENVIO (DESPUÉS de sincronización para que no sea sobrescrito)
        $estadoPendienteEnvioId = \App\Models\EstadoLogistica::where('codigo', 'PENDIENTE_ENVIO')
            ->where('categoria', 'venta_logistica')
            ->value('id');

        if ($estadoPendienteEnvioId) {
            $estadoAnterior = $venta->estado_logistico_id;
            $venta->update(['estado_logistico_id' => $estadoPendienteEnvioId]);

            \Log::info('✅ [CONFIRM] Venta actualizada a PENDIENTE_ENVIO (post-sync)', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'estado_anterior_id' => $estadoAnterior,
                'estado_nuevo_id' => $estadoPendienteEnvioId,
            ]);
        } else {
            \Log::error('❌ [CONFIRM] Estado PENDIENTE_ENVIO no encontrado en BD', [
                'venta_id' => $venta->id,
                'categoria' => 'venta_logistica',
            ]);
        }

        // Si todas las ventas están confirmadas, cambiar estado a LISTA_PARA_ENTREGA
        if ($this->todasVentasConfirmadas()) {
            \Log::info('🔄 [CONFIRM] Todas las ventas confirmadas, integrando cambio de estado', [
                'entrega_id' => $this->id,
                'estado_actual' => $this->estado,
            ]);

            try {
                if ($this->esTransicionValida(self::ESTADO_LISTO_PARA_ENTREGA)) {
                    // Cambiar estado
                    $this->cambiarEstado(
                        self::ESTADO_LISTO_PARA_ENTREGA,
                        'Todas las ventas fueron confirmadas como cargadas',
                        $usuario
                    );

                    \Log::info('✅ [CONFIRM] Estado de entrega cambiado a LISTO_PARA_ENTREGA', [
                        'entrega_id' => $this->id,
                    ]);

                    // Sincronizar nuevamente después de cambiar estado
                    $this->sincronizarEstadosVentas();
                } else {
                    $estadosSiguientes = $this->obtenerEstadosSiguientes();
                    \Log::warning('⚠️  [CONFIRM] Transición inválida a LISTO_PARA_ENTREGA', [
                        'entrega_id' => $this->id,
                        'estado_actual' => $this->estado,
                        'estados_validos' => $estadosSiguientes,
                    ]);
                }
            } catch (\Exception $e) {
                // Log pero no fallar si no se puede cambiar estado
                \Log::warning("❌ [CONFIRM] No se pudo cambiar estado de entrega a LISTO_PARA_ENTREGA: " . $e->getMessage(), [
                    'entrega_id' => $this->id,
                    'error_trace' => $e->getTraceAsString(),
                ]);

                // Sincronizar de todos modos para actualizar estados
                try {
                    $this->sincronizarEstadosVentas();
                } catch (\Exception $syncError) {
                    \Log::error('❌ [CONFIRM] Error en sincronización de recuperación', [
                        'entrega_id' => $this->id,
                        'error' => $syncError->getMessage(),
                    ]);
                }
            }
        } else {
            \Log::info('⏳ [CONFIRM] Hay ventas pendientes de confirmación', [
                'entrega_id' => $this->id,
                'progreso' => $this->obtenerProgresoConfirmacion(),
            ]);
        }
    }

    /**
     * Verificar si todas las ventas de esta entrega fueron confirmadas como cargadas
     *
     * @return bool
     */
    public function todasVentasConfirmadas(): bool
    {
        $total = $this->ventas()->count();
        if ($total === 0) {
            return false;  // Si no hay ventas, no está todo confirmado
        }

        $confirmadas = $this->ventasAsociadas()
            ->whereNotNull('fecha_confirmacion')
            ->count();

        return $confirmadas === $total;
    }

    /**
     * Obtener el progreso de confirmación de carga
     *
     * @return array ['confirmadas' => 2, 'total' => 3, 'porcentaje' => 66.67]
     */
    public function obtenerProgresoConfirmacion(): array
    {
        $total = $this->ventas()->count();
        $confirmadas = $this->ventasAsociadas()
            ->whereNotNull('fecha_confirmacion')
            ->count();

        return [
            'confirmadas' => $confirmadas,
            'total' => $total,
            'pendientes' => $total - $confirmadas,
            'porcentaje' => $total > 0 ? round(($confirmadas / $total) * 100, 2) : 0,
            'completado' => $confirmadas === $total,
        ];
    }

    /**
     * Sincronizar los estados logísticos de todas las ventas en esta entrega
     *
     * Se llama manualmente después de cambiar el estado de la entrega.
     * Actualiza el campo `estado_logistico_id` en cada venta según el estado actual de la entrega
     *
     * Ventas que serán sincronizadas:
     * - Todas las ventas con relación 1:N directa (FASE 3: venta.entrega_id = entrega.id)
     *
     * @return void
     */
    public function sincronizarEstadosVentas(): void
    {
        \Log::info('🔄 [SYNC] Iniciando sincronización de estados de ventas', [
            'entrega_id' => $this->id,
            'estado_entrega' => $this->estado,
        ]);

        try {
            // Obtener TODAS las ventas de esta entrega (FASE 3: relación 1:N directa)
            $ventas = $this->ventas()->get();

            \Log::info('🔄 [SYNC] Ventas a sincronizar', [
                'entrega_id' => $this->id,
                'cantidad_ventas' => $ventas->count(),
                'venta_ids' => $ventas->pluck('id')->toArray(),
            ]);

            if ($ventas->isEmpty()) {
                \Log::info('⚠️ [SYNC] No hay ventas para sincronizar', [
                    'entrega_id' => $this->id,
                ]);
                return;
            }

            $sincronizador = app(\App\Services\Logistica\SincronizacionVentaEntregaService::class);
            $ventasActualizadas = 0;

            foreach ($ventas as $venta) {
                try {
                    // ✅ IMPORTANTE: No sincronizar ventas que ya fueron confirmadas como cargadas
                    // Si una venta está en estado PENDIENTE_ENVIO, significa que el usuario la confirmó
                    // como cargada manualmente, y no debemos cambiar su estado automáticamente
                    if ($venta->estadoLogistica?->codigo === 'PENDIENTE_ENVIO') {
                        \Log::info('⏭️  [SYNC] Venta ya confirmada como cargada, saltando sincronización', [
                            'venta_id' => $venta->id,
                            'venta_numero' => $venta->numero,
                            'estado_actual' => 'PENDIENTE_ENVIO',
                        ]);
                        continue; // Saltar esta venta, no cambiar su estado
                    }

                    $estadoAnterior = $venta->estado_logistico;
                    $estadoAnteriorId = $venta->estado_logistico_id;

                    // Determinar nuevo estado
                    $nuevoEstado = $sincronizador->determinarEstadoLogistico($venta);

                    \Log::info('🔄 [SYNC] Procesando venta', [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'estado_anterior' => $estadoAnterior,
                        'estado_nuevo_calculado' => $nuevoEstado,
                    ]);

                    // Obtener ID del nuevo estado
                    $nuevoEstadoLogisticoId = \App\Models\EstadoLogistica::where('codigo', $nuevoEstado)
                        ->where('categoria', 'venta_logistica')
                        ->value('id');

                    if (!$nuevoEstadoLogisticoId) {
                        \Log::error('❌ [SYNC] Estado logístico no encontrado en BD', [
                            'venta_id' => $venta->id,
                            'codigo' => $nuevoEstado,
                            'categoria' => 'venta_logistica',
                            'estados_disponibles' => \App\Models\EstadoLogistica::where('categoria', 'venta_logistica')
                                ->pluck('codigo')
                                ->toArray(),
                        ]);

                        // Intentar usar PENDIENTE_ENVIO como fallback
                        $fallbackId = \App\Models\EstadoLogistica::where('codigo', 'PENDIENTE_ENVIO')
                            ->where('categoria', 'venta_logistica')
                            ->value('id');

                        if ($fallbackId) {
                            \Log::warning('⚠️  [SYNC] Usando estado fallback PENDIENTE_ENVIO', [
                                'venta_id' => $venta->id,
                                'codigo_solicitado' => $nuevoEstado,
                            ]);
                            $nuevoEstadoLogisticoId = $fallbackId;
                        } else {
                            \Log::error('❌ [SYNC] No hay estado fallback disponible', [
                                'venta_id' => $venta->id,
                            ]);
                            continue;
                        }
                    }

                    // Actualizar solo si cambió el estado
                    if ($estadoAnteriorId !== $nuevoEstadoLogisticoId) {
                        $venta->update(['estado_logistico_id' => $nuevoEstadoLogisticoId]);

                        \Log::info('✅ [SYNC] Venta actualizada', [
                            'venta_id' => $venta->id,
                            'venta_numero' => $venta->numero,
                            'estado_anterior_id' => $estadoAnteriorId,
                            'estado_nuevo_id' => $nuevoEstadoLogisticoId,
                            'estado_anterior_codigo' => $estadoAnterior,
                            'estado_nuevo_codigo' => $nuevoEstado,
                        ]);

                        $ventasActualizadas++;
                    } else {
                        \Log::info('⏭️  [SYNC] Venta sin cambios', [
                            'venta_id' => $venta->id,
                            'venta_numero' => $venta->numero,
                            'estado_id' => $estadoAnteriorId,
                        ]);
                    }
                } catch (\Exception $e) {
                    \Log::error('❌ [SYNC] Error sincronizando venta', [
                        'venta_id' => $venta->id,
                        'entrega_id' => $this->id,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]);
                }
            }

            \Log::info('✅ [SYNC] Sincronización completada', [
                'entrega_id' => $this->id,
                'estado_entrega' => $this->estado,
                'ventas_totales' => $ventas->count(),
                'ventas_actualizadas' => $ventasActualizadas,
            ]);
        } catch (\Exception $e) {
            \Log::error('❌ [SYNC] Error crítico en sincronización', [
                'entrega_id' => $this->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * Desmarcar una venta como cargada
     * (En caso de error después de confirmar)
     *
     * @param \App\Models\Venta $venta
     * @param string|null $razon
     * @return void
     * @throws \Exception Si la venta no pertenece a esta entrega
     */
    public function desmarcarVentaCargada(Venta $venta, ?string $razon = null): void
    {
        // Verificar que la venta pertenece a esta entrega (FASE 3: 1:N directa O FASE 1: pivot)
        $entregaVenta = $this->ventasAsociadas()
            ->where('venta_id', $venta->id)
            ->first();

        // Si no está en la tabla pivot pero sí en la relación 1:N, permitir
        if (!$entregaVenta && !$this->ventas()->where('id', $venta->id)->exists()) {
            throw new \InvalidArgumentException(
                "Venta #{$venta->id} no pertenece a Entrega #{$this->id}"
            );
        }

        // Si está en relación 1:N pero no en pivot, nada que desmarcar
        if (!$entregaVenta) {
            return;
        }

        $entregaVenta->desmarcarCarga($razon ?? 'Desmarcado manualmente');
    }

    /**
     * Obtener el peso total de todas las ventas
     *
     * @return float
     */
    public function obtenerPesoTotal(): float
    {
        return $this->ventas()->sum('peso_estimado') ?? 0;
    }

    /**
     * Obtener el volumen total de todas las ventas
     *
     * @return float
     */
    public function obtenerVolumenTotal(): float
    {
        return $this->ventas()->sum('volumen_estimado') ?? 0;
    }

    /**
     * Verificar si la entrega cabe en el vehículo asignado
     *
     * @return bool
     */
    public function cabe_en_vehiculo(): bool
    {
        if (!$this->vehiculo) {
            return true;  // Sin vehículo asignado, asumir que cabe
        }

        $pesoTotal = $this->obtenerPesoTotal();
        return $pesoTotal <= ($this->vehiculo->capacidad_kg ?? PHP_INT_MAX);
    }

    /**
     * Obtener el porcentaje de utilización del vehículo
     *
     * @return float 0 a 100
     */
    public function obtenerPorcentajeUtilizacion(): float
    {
        if (!$this->vehiculo || !$this->vehiculo->capacidad_kg) {
            return 0;
        }

        $pesoTotal = $this->obtenerPesoTotal();
        return min(100, round(($pesoTotal / $this->vehiculo->capacidad_kg) * 100, 2));
    }

    /**
     * Agregar una venta a esta entrega
     *
     * Uso:
     *   $entrega->agregarVenta($venta, 4, 'Agregada posteriormente');
     *
     * @param \App\Models\Venta $venta
     * @param int|null $orden Orden de carga (si null, se agrega al final)
     * @param string|null $notas Notas
     * @return \App\Models\EntregaVenta
     */
    public function agregarVenta(Venta $venta, ?int $orden = null, ?string $notas = null)
    {
        // Obtener el orden si no se proporciona
        if ($orden === null) {
            $orden = ($this->ventas()->count() ?? 0) + 1;
        }

        // Verificar que la venta no esté ya en esta entrega
        if ($this->ventas()->where('venta_id', $venta->id)->exists()) {
            throw new \InvalidArgumentException(
                "Venta #{$venta->id} ya pertenece a Entrega #{$this->id}"
            );
        }

        // Agregar a la relación
        $this->ventas()->attach($venta->id, [
            'orden' => $orden,
            'notas' => $notas,
        ]);

        // Retornar el registro pivot
        return $this->ventasAsociadas()
            ->where('venta_id', $venta->id)
            ->first();
    }

    /**
     * Remover una venta de esta entrega
     *
     * @param \App\Models\Venta $venta
     * @return bool
     */
    public function removerVenta(Venta $venta): bool
    {
        return (bool)$this->ventas()->detach($venta->id);
    }

    /**
     * Accesores para alias de coordenadas
     * Mapea latitud_actual → latitud y longitud_actual → longitud
     */
    public function getLatitudAttribute(): ?float
    {
        return $this->latitud_actual;
    }

    public function getLongitudAttribute(): ?float
    {
        return $this->longitud_actual;
    }

    /**
     * Accessors para exponer datos del estado logístico en la serialización
     * Permite que el frontend acceda a: estado_entrega_id, estado_entrega_codigo, etc
     */
    public function getEstadoEntregaIdAttribute(): ?int
    {
        return $this->attributes['estado_entrega_id'] ?? null;
    }

    public function getEstadoEntregaCodigoAttribute(): ?string
    {
        return $this->relationLoaded('estadoEntrega')
            ? $this->estadoEntrega?->codigo
            : null;
    }

    public function getEstadoEntregaNombreAttribute(): ?string
    {
        return $this->relationLoaded('estadoEntrega')
            ? $this->estadoEntrega?->nombre
            : null;
    }

    public function getEstadoEntregaColorAttribute(): ?string
    {
        return $this->relationLoaded('estadoEntrega')
            ? $this->estadoEntrega?->color
            : null;
    }

    public function getEstadoEntregaIconoAttribute(): ?string
    {
        return $this->relationLoaded('estadoEntrega')
            ? $this->estadoEntrega?->icono
            : null;
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════
     * MÉTODOS DE UTILIDAD
     * ═══════════════════════════════════════════════════════════════════════
     */

    /**
     * Obtener todas las localidades de los clientes en las ventas de esta entrega
     *
     * RELACIÓN:
     *   Entrega → Ventas (via entrega_id) → Cliente → Localidad
     *
     * RETORNA:
     *   Collection de Localidad (únicos)
     *
     * EJEMPLO:
     *   $entrega->getLocalidades()
     *   → [Localidad{id:1, nombre:'La Paz'}, Localidad{id:2, nombre:'Santa Cruz'}]
     *
     * @return \Illuminate\Database\Eloquent\Collection|array
     */
    public function getLocalidades()
    {
        // Cargar relaciones si no están ya cargadas
        if (!$this->relationLoaded('ventas')) {
            $this->load('ventas.cliente.localidad');
        }

        // Obtener localidades únicas desde las ventas
        return $this->ventas
            ->pluck('cliente.localidad')
            ->filter()  // Remover nulls
            ->unique('id')  // Localidades únicas por ID
            ->values()  // Re-indexar colección
            ->all();
    }

    /**
     * Obtener información resumida de localidades
     *
     * RETORNA:
     *   Array con estructura: [
     *     {
     *       'localidad_id' => 1,
     *       'localidad_nombre' => 'La Paz',
     *       'cantidad_ventas' => 3,
     *       'clientes' => ['Cliente A', 'Cliente B']
     *     },
     *     ...
     *   ]
     *
     * EJEMPLO:
     *   $entrega->getLocalidadesResumen()
     *
     * @return array
     */
    public function getLocalidadesResumen(): array
    {
        // Cargar relaciones si no están ya cargadas
        if (!$this->relationLoaded('ventas')) {
            $this->load('ventas.cliente.localidad');
        }

        // Agrupar por localidad
        $localidades = [];

        foreach ($this->ventas as $venta) {
            $cliente = $venta->cliente;
            $localidad = $cliente?->localidad;

            if (!$localidad) {
                continue;
            }

            $localidadId = $localidad->id;

            // Inicializar si no existe
            if (!isset($localidades[$localidadId])) {
                $localidades[$localidadId] = [
                    'localidad_id' => $localidad->id,
                    'localidad_nombre' => $localidad->nombre,
                    'cantidad_ventas' => 0,
                    'clientes' => [],
                ];
            }

            // Incrementar cantidad de ventas
            $localidades[$localidadId]['cantidad_ventas']++;

            // Agregar cliente si no existe
            if ($cliente && !in_array($cliente->nombre, $localidades[$localidadId]['clientes'])) {
                $localidades[$localidadId]['clientes'][] = $cliente->nombre;
            }
        }

        // Retornar como array indexado
        return array_values($localidades);
    }

    /**
     * Validar si la entrega tiene múltiples localidades
     *
     * RETORNA:
     *   bool - true si tiene clientes en 2 o más localidades
     *
     * EJEMPLO:
     *   if ($entrega->tieneMultiplesLocalidades()) {
     *     // Entrega consolidada de múltiples localidades
     *   }
     *
     * @return bool
     */
    public function tieneMultiplesLocalidades(): bool
    {
        $localidades = $this->getLocalidades();
        return count($localidades) > 1;
    }
}
