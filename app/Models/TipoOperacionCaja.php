<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoOperacionCaja extends Model
{
    use HasFactory;

    protected $table = 'tipo_operacion_caja';

    public $timestamps = false;

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'direccion',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    // Relaciones
    public function movimientos()
    {
        return $this->hasMany(MovimientoCaja::class, 'tipo_operacion_id');
    }

    // Scopes
    public function scopeSearchByName($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->whereRaw('nombre ilike ?', ['%' . $search . '%'])
              ->orWhereRaw('codigo ilike ?', ['%' . $search . '%'])
              ->orWhereRaw('descripcion ilike ?', ['%' . $search . '%']);
        });
    }

    // Constantes para los tipos
    const APERTURA = 'APERTURA';

    const CIERRE = 'CIERRE';

    const VENTA = 'VENTA';

    const COMPRA = 'COMPRA';

    const GASTO = 'GASTO';

    const INGRESO_EXTRA = 'INGRESO_EXTRA';

    const CREDITO = 'CREDITO'; // ✅ Tipo de operación para créditos otorgados

    const PAGO_SUELDO = 'PAGO_SUELDO'; // ✅ NUEVO: Tipo de operación para pagos de sueldo

    const ANTICIPO = 'ANTICIPO'; // ✅ NUEVO: Tipo de operación para anticipos

    /**
     * ✅ Obtener tipos de operación clasificados por dirección (ENTRADA/SALIDA/AJUSTE)
     * Agrupa los tipos directamente desde la columna 'direccion' de la BD
     *
     * @return array Array con estructura: ['ENTRADA' => [...], 'SALIDA' => [...], 'AJUSTE' => [...]]
     */
    public static function obtenerTiposClasificados(): array
    {
        // Tipos especiales que se excluyen (tienen sus propios diálogos)
        $excluidos = ['APERTURA', 'CIERRE'];

        // Obtener todos los tipos excepto los especiales y agrupar por dirección
        $resultado = self::whereNotIn('codigo', $excluidos)
            ->get(['id', 'codigo', 'nombre', 'direccion'])
            ->groupBy('direccion')
            ->map(function ($grupo) {
                return $grupo->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'codigo' => $item->codigo,
                        'nombre' => $item->nombre,
                    ];
                })->values()->all();
            })
            ->all();

        // Asegurar que existan las tres direcciones aunque estén vacías
        return [
            'ENTRADA' => $resultado['ENTRADA'] ?? [],
            'SALIDA' => $resultado['SALIDA'] ?? [],
            'AJUSTE' => $resultado['AJUSTE'] ?? [],
        ];
    }
}
