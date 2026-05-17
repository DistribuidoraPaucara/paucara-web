<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReporteProductoDanado extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'reportes_productos_danados';

    protected $fillable = [
        'venta_id',
        'cliente_id',
        'usuario_id',
        'observaciones',
        'estado',
        'notas_respuesta',
        'fecha_reporte',
    ];

    protected function casts(): array
    {
        return [
            'fecha_reporte' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * Relación con Venta
     */
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'venta_id');
    }

    /**
     * Relación con Cliente
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    /**
     * Relación con Usuario (quien reporta)
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Relación con imágenes del reporte
     */
    public function imagenes(): HasMany
    {
        return $this->hasMany(ReporteProductoDañadoImagen::class, 'reporte_id');
    }

    /**
     * Obtener el estado en español
     */
    public function getEstadoSpanish(): string
    {
        return match ($this->estado) {
            'pendiente' => 'Pendiente de Revisión',
            'en_revision' => 'En Revisión',
            'aprobado' => 'Aprobado',
            'rechazado' => 'Rechazado',
            default => 'Desconocido',
        };
    }

    /**
     * Obtener color para el estado
     */
    public function getEstadoColor(): string
    {
        return match ($this->estado) {
            'pendiente' => '#FFA500', // Naranja
            'en_revision' => '#4169E1', // Azul
            'aprobado' => '#28A745', // Verde
            'rechazado' => '#DC3545', // Rojo
            default => '#6C757D', // Gris
        };
    }

    /**
     * Alcances de query
     */
    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    public function scopeEnRevision($query)
    {
        return $query->where('estado', 'en_revision');
    }

    public function scopeAprobados($query)
    {
        return $query->where('estado', 'aprobado');
    }

    public function scopeRechazados($query)
    {
        return $query->where('estado', 'rechazado');
    }

    public function scopeDeCliente($query, $clienteId)
    {
        return $query->where('cliente_id', $clienteId);
    }

    public function scopeDeVenta($query, $ventaId)
    {
        return $query->where('venta_id', $ventaId);
    }
}
