<?php
namespace App\Models;

use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Almacen extends Model
{
    use HasFactory, HasActiveScope;

    protected $table = 'almacenes';

    protected $fillable = [
        'nombre',
        'direccion',
        'ubicacion_fisica',
        'requiere_transporte_externo',
        'responsable',
        'telefono',
        'activo',
        'empresa_id',
    ];

    protected function casts(): array
    {
        return [
            'activo'                      => 'boolean',
            'requiere_transporte_externo' => 'boolean',
        ];
    }

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }

    public function stockProductos()
    {
        return $this->hasMany(StockProducto::class, 'almacen_id');
    }

    public function sectores()
    {
        return $this->hasMany(Sector::class, 'almacen_id');
    }

    /**
     * Obtener el sector genérico automático de este almacén
     * Usado para asignar stocks cuando no se especifica un sector
     */
    public function sectorGenerico()
    {
        return $this->sectores()->where('es_generico', true)->first();
    }

    /**
     * Contar total de sectores en el almacén
     */
    public function getCountSectoresAttribute(): int
    {
        return $this->sectores()->count();
    }

    /**
     * Contar sectores personalizados (excluyendo genérico)
     */
    public function countSectoresPersonalizados(): int
    {
        return $this->sectores()->where('es_generico', false)->count();
    }

    /**
     * Boot del modelo - Crear sector genérico automáticamente
     */
    protected static function booted()
    {
        // Crear sector "General" cuando se crea un almacén
        static::created(function ($almacen) {
            // Verificar que no exista ya un sector genérico (por si acaso)
            $sectorExistente = Sector::where('almacen_id', $almacen->id)
                ->where('es_generico', true)
                ->first();

            if (!$sectorExistente) {
                Sector::create([
                    'almacen_id' => $almacen->id,
                    'nombre' => 'General',
                    'es_generico' => true,
                    'descripcion' => 'Sector genérico automático - Productos sin clasificación específica',
                ]);

                \Illuminate\Support\Facades\Log::info('Almacen: Sector genérico creado automáticamente', [
                    'almacen_id' => $almacen->id,
                    'almacen_nombre' => $almacen->nombre,
                ]);
            }
        });
    }

    /**
     * Determina si la transferencia hacia otro almacén requiere transporte
     */
    public function requiereTransporteHacia(Almacen $destino): bool
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
}
