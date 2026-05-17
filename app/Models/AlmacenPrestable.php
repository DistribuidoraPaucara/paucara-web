<?php

namespace App\Models;

use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AlmacenPrestable extends Model
{
    use HasFactory, HasActiveScope;

    protected $table = 'almacenes_prestables';

    protected $fillable = [
        'nombre',
        'direccion',
        'ubicacion_fisica',
        'requiere_transporte_externo',
        'responsable',
        'telefono',
        'activo',
        'empresa_id',
        'es_proveedor',
    ];

    protected function casts(): array
    {
        return [
            'activo'                      => 'boolean',
            'requiere_transporte_externo' => 'boolean',
            'es_proveedor'                => 'boolean',
        ];
    }

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }

    public function prestableStocks(): HasMany
    {
        return $this->hasMany(PrestableStock::class, 'almacenes_prestables_id');
    }

    /**
     * Determina si la transferencia hacia otro almacén de prestables requiere transporte
     */
    public function requiereTransporteHacia(AlmacenPrestable $destino): bool
    {
        // Si cualquiera de los almacenes está marcado como requiere transporte externo
        if ($this->requiere_transporte_externo || $destino->requiere_transporte_externo) {
            return true;
        }

        // Si tienen ubicaciones físicas diferentes (no están en el mismo lugar)
        if ($this->ubicacion_fisica && $destino->ubicacion_fisica) {
            return $this->ubicacion_fisica !== $destino->ubicacion_fisica;
        }

        // Si uno tiene ubicación física definida y el otro no, asumir que requiere transporte
        if ($this->ubicacion_fisica || $destino->ubicacion_fisica) {
            return true;
        }

        // Si ambos no tienen ubicación física definida, usar lógica por defecto (almacenes diferentes)
        return $this->id !== $destino->id;
    }

    // ==================== SCOPES ====================

    /**
     * Scope: Filtrar solo almacenes de distribuidora
     */
    public function scopeDistribuidora($query)
    {
        return $query->where('es_proveedor', false);
    }

    /**
     * Scope: Filtrar solo almacenes de proveedores
     */
    public function scopeProveedores($query)
    {
        return $query->where('es_proveedor', true);
    }

    // ==================== MÉTODOS HELPER ====================

    /**
     * Determina el tipo de almacén
     */
    public function getTipoAttribute(): string
    {
        return $this->es_proveedor ? 'PROVEEDOR' : 'DISTRIBUIDORA';
    }

    /**
     * Obtiene la etiqueta visual del almacén
     */
    public function getEtiquetaAttribute(): string
    {
        return $this->es_proveedor ? "📦 {$this->nombre}" : '🏢 Distribuidora';
    }
}
