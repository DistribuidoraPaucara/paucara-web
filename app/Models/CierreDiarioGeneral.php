<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model: CierreDiarioGeneral
 *
 * Responsabilidades:
 * ✅ Registrar cada ejecución de cierre diario general
 * ✅ Almacenar resumen de cajas cerradas y consolidadas
 * ✅ Guardar detalles completos de cada cierre
 * ✅ Facilitar auditoría y reportes históricos
 */
class CierreDiarioGeneral extends Model
{
    protected $table = 'cierres_diarios_generales';

    protected $fillable = [
        'usuario_id',
        'fecha_ejecucion',
        'total_cajas_procesadas',
        'total_cajas_cerradas',
        'total_cajas_con_discrepancia',
        'cajas_sin_apertura',
        'total_monto_esperado',
        'total_monto_real',
        'total_diferencias',
        'detalle_cajas',
        'observaciones',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'fecha_ejecucion' => 'datetime',
        'detalle_cajas' => 'array',
        'total_monto_esperado' => 'decimal:2',
        'total_monto_real' => 'decimal:2',
        'total_diferencias' => 'decimal:2',
    ];

    // ========== RELACIONES ==========

    /**
     * Usuario que ejecutó el cierre diario
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // ========== SCOPES ==========

    /**
     * Filtrar por fecha
     */
    public function scopePorFecha($query, $fecha)
    {
        return $query->whereDate('fecha_ejecucion', $fecha);
    }

    /**
     * Filtrar por rango de fechas
     */
    public function scopeEntreFechas($query, $desde, $hasta)
    {
        return $query->whereBetween('fecha_ejecucion', [$desde, $hasta]);
    }

    /**
     * Filtrar por usuario
     */
    public function scopePorUsuario($query, $usuarioId)
    {
        return $query->where('usuario_id', $usuarioId);
    }

    /**
     * Más recientes primero
     */
    public function scopeRecientes($query)
    {
        return $query->orderBy('fecha_ejecucion', 'desc');
    }

    /**
     * Solo cierres con discrepancias
     */
    public function scopeConDiscrepancias($query)
    {
        return $query->where('total_cajas_con_discrepancia', '>', 0);
    }

    // ========== MÉTODOS ==========

    /**
     * Obtener resumen ejecutivo
     */
    public function obtenerResumen(): array
    {
        return [
            'id' => $this->id,
            'fecha' => $this->fecha_ejecucion->format('d/m/Y H:i'),
            'ejecutado_por' => $this->usuario->name,
            'cajas_cerradas' => $this->total_cajas_cerradas,
            'cajas_con_discrepancia' => $this->total_cajas_con_discrepancia,
            'total_monto_esperado' => (float)$this->total_monto_esperado,
            'total_monto_real' => (float)$this->total_monto_real,
            'total_diferencias' => (float)$this->total_diferencias,
            'tiene_discrepancias' => $this->total_cajas_con_discrepancia > 0,
        ];
    }

    /**
     * Crear desde reporte de cierre
     */
    public static function crearDelReporte(User $usuario, array $reporte, $request)
    {
        return self::create([
            'usuario_id' => $usuario->id,
            'fecha_ejecucion' => $reporte['fecha_ejecucion'],
            'total_cajas_procesadas' => count($reporte['cajas_procesadas']) + count($reporte['cajas_sin_apertura_abierta']),
            'total_cajas_cerradas' => $reporte['total_cajas_cerradas'],
            'total_cajas_con_discrepancia' => $reporte['total_cajas_con_discrepancia'],
            'cajas_sin_apertura' => count($reporte['cajas_sin_apertura_abierta']),
            'total_monto_esperado' => $reporte['total_monto_esperado'],
            'total_monto_real' => $reporte['total_monto_real'],
            'total_diferencias' => $reporte['total_diferencias'],
            'detalle_cajas' => $reporte['cajas_procesadas'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
