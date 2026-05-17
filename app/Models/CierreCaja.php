<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Model: CierreCaja
 *
 * Responsabilidades:
 * ✅ Registrar cierres de caja con estados
 * ✅ Gestionar flujo de verificación (PENDIENTE -> CONSOLIDADA/RECHAZADA)
 * ✅ Permitir corrección de cierres rechazados
 * ✅ Mantener auditoría completa de cambios de estado
 * ✅ Enviar notificaciones WebSocket en tiempo real
 *
 * Estados del Cierre:
 * - PENDIENTE: Creado por cajero, espera verificación de admin
 * - CONSOLIDADA: Verificado y aprobado por admin
 * - RECHAZADA: Rechazado por admin, requiere corrección del cajero
 * - CORREGIDA: Rechazado que fue corregido por cajero
 */
class CierreCaja extends Model
{
    use HasFactory;

    protected $table = 'cierres_caja';

    // ========== CONSTANTES ==========
    const PENDIENTE = 'PENDIENTE';
    const CONSOLIDADA = 'CONSOLIDADA';
    const RECHAZADA = 'RECHAZADA';
    const CORREGIDA = 'CORREGIDA';

    // ========== FILLABLE & CASTS ==========

    protected $fillable = [
        'caja_id',
        'user_id',
        'apertura_caja_id',
        'fecha',
        'monto_esperado',
        'monto_real',
        'diferencia',
        'observaciones',
        'estado_cierre_id',
        'usuario_verificador_id',
        'fecha_verificacion',
        'observaciones_verificacion',
        'observaciones_rechazo',
        'requiere_reapertura',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'datetime',
            'fecha_verificacion' => 'datetime',
            'monto_esperado' => 'decimal:2',
            'monto_real' => 'decimal:2',
            'diferencia' => 'decimal:2',
            'requiere_reapertura' => 'boolean',
        ];
    }

    // ========== RELACIONES ==========

    public function caja()
    {
        return $this->belongsTo(Caja::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function apertura()
    {
        return $this->belongsTo(AperturaCaja::class, 'apertura_caja_id');
    }

    public function estadoCierre()
    {
        return $this->belongsTo(EstadoCierre::class, 'estado_cierre_id');
    }

    public function verificador()
    {
        return $this->belongsTo(User::class, 'usuario_verificador_id');
    }

    // ========== ACCESSORS ==========

    /**
     * Obtener el código del estado actual
     */
    public function getEstadoAttribute()
    {
        return $this->estadoCierre?->codigo;
    }

    // ========== SCOPES ==========

    public function scopeDelDia($query, $fecha = null)
    {
        $fecha = $fecha ?? today();
        return $query->whereDate('fecha', $fecha);
    }

    public function scopeConDiferencias($query)
    {
        return $query->where('diferencia', '!=', 0);
    }

    /**
     * Filtrar cierres pendientes de verificación
     */
    public function scopePendientes($query)
    {
        return $query->whereHas('estadoCierre', fn($q) => $q->where('codigo', self::PENDIENTE));
    }

    /**
     * Filtrar cierres consolidados
     */
    public function scopeConsolidadas($query)
    {
        return $query->whereHas('estadoCierre', fn($q) => $q->where('codigo', self::CONSOLIDADA));
    }

    /**
     * Filtrar cierres rechazados
     */
    public function scopeRechazadas($query)
    {
        return $query->whereHas('estadoCierre', fn($q) => $q->where('codigo', self::RECHAZADA));
    }

    /**
     * Filtrar cierres que requieren atención (pendientes por más de 2 horas)
     */
    public function scopeRequierenAtencion($query)
    {
        return $query->whereHas('estadoCierre', fn($q) => $q->where('codigo', self::PENDIENTE))
                     ->where('fecha', '<', now()->subHours(2));
    }

    // ========== MÉTODOS DE NEGOCIO ==========

    /**
     * Verificar si el cierre puede ser consolidado
     */
    public function puedeConsolidar(): bool
    {
        return $this->estado === self::PENDIENTE;
    }

    /**
     * Verificar si el cierre puede ser rechazado
     */
    public function puedeRechazar(): bool
    {
        return $this->estado === self::PENDIENTE;
    }

    /**
     * Consolidar un cierre de caja (aprobarlo)
     *
     * @param User $verificador Usuario admin que consolida
     * @param string|null $observaciones Observaciones adicionales
     * @return bool
     */
    public function consolidar(User $verificador, ?string $observaciones = null): bool
    {
        if (!$this->puedeConsolidar()) {
            return false;
        }

        DB::beginTransaction();
        try {
            $estadoId = EstadoCierre::obtenerIdConsolidada();

            $this->update([
                'estado_cierre_id' => $estadoId,
                'usuario_verificador_id' => $verificador->id,
                'fecha_verificacion' => now(),
                'observaciones_verificacion' => $observaciones,
            ]);

            // Registrar en auditoría
            AuditoriaCaja::create([
                'user_id' => $verificador->id,
                'caja_id' => $this->caja_id,
                'apertura_caja_id' => $this->apertura_caja_id,
                'accion' => 'CIERRE_CONSOLIDADO',
                'operacion_intentada' => 'POST /admin/cierres/consolidar',
                'exitosa' => true,
                'detalle_operacion' => [
                    'cierre_id' => $this->id,
                    'diferencia' => (float)$this->diferencia,
                    'monto_esperado' => (float)$this->monto_esperado,
                    'monto_real' => (float)$this->monto_real,
                    'observaciones' => $observaciones,
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            DB::commit();

            // Notificar a través de WebSocket
            $this->enviarNotificacionConsolidacion($verificador);

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error consolidando cierre', [
                'cierre_id' => $this->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Rechazar un cierre de caja
     *
     * @param User $verificador Usuario admin que rechaza
     * @param string $motivo Motivo del rechazo
     * @param bool $requiereReapertura Si requiere reabrir la caja
     * @return bool
     */
    public function rechazar(User $verificador, string $motivo, bool $requiereReapertura = false): bool
    {
        if (!$this->puedeRechazar()) {
            return false;
        }

        DB::beginTransaction();
        try {
            $estadoId = EstadoCierre::obtenerIdRechazada();

            $this->update([
                'estado_cierre_id' => $estadoId,
                'usuario_verificador_id' => $verificador->id,
                'fecha_verificacion' => now(),
                'observaciones_rechazo' => $motivo,
                'requiere_reapertura' => $requiereReapertura,
            ]);

            // Registrar en auditoría
            AuditoriaCaja::create([
                'user_id' => $verificador->id,
                'caja_id' => $this->caja_id,
                'apertura_caja_id' => $this->apertura_caja_id,
                'accion' => 'CIERRE_RECHAZADO',
                'operacion_intentada' => 'POST /admin/cierres/rechazar',
                'exitosa' => true,
                'detalle_operacion' => [
                    'cierre_id' => $this->id,
                    'motivo' => $motivo,
                    'requiere_reapertura' => $requiereReapertura,
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            DB::commit();

            // Notificar al cajero
            $this->enviarNotificacionRechazo($verificador, $motivo);

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error rechazando cierre', [
                'cierre_id' => $this->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Corregir un cierre rechazado
     *
     * @param User $cajero Usuario que corrige
     * @param float $nuevoMontoReal Nuevo monto real
     * @param string|null $observaciones Observaciones de la corrección
     * @return bool
     */
    public function corregir(User $cajero, float $nuevoMontoReal, ?string $observaciones = null): bool
    {
        if ($this->estado !== self::RECHAZADA) {
            return false;
        }

        DB::beginTransaction();
        try {
            // Recalcular diferencia
            $nuevaDiferencia = $nuevoMontoReal - $this->monto_esperado;

            // Actualizar cierre y volver a PENDIENTE
            $estadoPendiente = EstadoCierre::obtenerIdPendiente();

            $this->update([
                'estado_cierre_id' => $estadoPendiente,
                'monto_real' => $nuevoMontoReal,
                'diferencia' => $nuevaDiferencia,
                'observaciones' => $observaciones ?? $this->observaciones,
                'observaciones_rechazo' => null, // Limpiar motivo anterior
            ]);

            // Ajustar movimiento AJUSTE si es necesario
            $this->ajustarMovimientoAjuste($nuevaDiferencia);

            // Registrar en auditoría
            AuditoriaCaja::create([
                'user_id' => $cajero->id,
                'caja_id' => $this->caja_id,
                'apertura_caja_id' => $this->apertura_caja_id,
                'accion' => 'CIERRE_CORREGIDO',
                'operacion_intentada' => 'POST /cajas/cierres/corregir',
                'exitosa' => true,
                'detalle_operacion' => [
                    'cierre_id' => $this->id,
                    'monto_real_anterior' => (float)$this->getOriginal('monto_real'),
                    'monto_real_nuevo' => $nuevoMontoReal,
                    'diferencia_nueva' => $nuevaDiferencia,
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            DB::commit();

            // Notificar a admins de nuevo cierre pendiente
            $this->enviarNotificacionNuevoPendiente();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error corrigiendo cierre', [
                'cierre_id' => $this->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Ajustar el movimiento AJUSTE cuando se corrige un cierre
     *
     * @param float $nuevaDiferencia Nueva diferencia calculada
     * @return void
     */
    private function ajustarMovimientoAjuste(float $nuevaDiferencia): void
    {
        $tipoAjuste = TipoOperacionCaja::where('codigo', 'AJUSTE')->first();

        if (!$tipoAjuste) {
            return;
        }

        // Eliminar movimiento de ajuste anterior del mismo día
        MovimientoCaja::where('caja_id', $this->caja_id)
            ->where('user_id', $this->user_id)
            ->where('tipo_operacion_id', $tipoAjuste->id)
            ->whereDate('fecha', $this->fecha->toDateString())
            ->delete();

        // Crear nuevo movimiento si hay diferencia
        if ($nuevaDiferencia != 0) {
            MovimientoCaja::create([
                'caja_id' => $this->caja_id,
                'tipo_operacion_id' => $tipoAjuste->id,
                'numero_documento' => 'AJUSTE-COR-'.date('Ymd').'-'.$this->user_id,
                'descripcion' => 'Ajuste corregido - '.($nuevaDiferencia > 0 ? 'Sobrante' : 'Faltante'),
                'monto' => $nuevaDiferencia,
                'fecha' => $this->fecha,
                'user_id' => $this->user_id,
            ]);
        }
    }

    /**
     * Enviar notificación de consolidación por WebSocket
     */
    private function enviarNotificacionConsolidacion(User $verificador): void
    {
        try {
            app(\App\Services\WebSocket\CajaWebSocketService::class)
                ->notifyCierreConsolidado($this->fresh(['usuario', 'caja', 'verificador']));
        } catch (\Exception $e) {
            Log::warning('Error enviando WebSocket consolidación', [
                'cierre_id' => $this->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Enviar notificación de rechazo por WebSocket
     */
    private function enviarNotificacionRechazo(User $verificador, string $motivo): void
    {
        try {
            app(\App\Services\WebSocket\CajaWebSocketService::class)
                ->notifyCierreRechazado($this->fresh(['usuario', 'caja', 'verificador']), $motivo);
        } catch (\Exception $e) {
            Log::warning('Error enviando WebSocket rechazo', [
                'cierre_id' => $this->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Enviar notificación de nuevo cierre pendiente por WebSocket
     */
    private function enviarNotificacionNuevoPendiente(): void
    {
        try {
            app(\App\Services\WebSocket\CajaWebSocketService::class)
                ->notifyCierrePendiente($this->fresh(['usuario', 'caja']));
        } catch (\Exception $e) {
            Log::warning('Error enviando WebSocket nuevo pendiente', [
                'cierre_id' => $this->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
