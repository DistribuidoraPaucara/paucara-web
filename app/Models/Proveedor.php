<?php
namespace App\Models;

use App\Models\Traits\GeneratesSequentialCode;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Proveedor extends Model
{
    use HasFactory, GeneratesSequentialCode;

    public $timestamps = false;

    protected $table = 'proveedores';

    protected $fillable = [
        'nombre', 'razon_social', 'nit', 'telefono', 'email', 'direccion', 'contacto', 'activo', 'fecha_registro',
        'foto_perfil', 'ci_anverso', 'ci_reverso', 'codigo_proveedor', 'latitud', 'longitud',
    ];

    protected function casts(): array
    {
        return [
            'activo'         => 'boolean',
            'fecha_registro' => 'datetime',
            'latitud'        => 'decimal:8',
            'longitud'       => 'decimal:8',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        // Generar el código de proveedor DESPUÉS de crear, para poder usar el ID del proveedor
        static::created(function ($proveedor) {
            try {
                if (! $proveedor->codigo_proveedor) {
                    $codigo = $proveedor->generateCodigoProveedor();
                    Log::info('Generando código para proveedor', [
                        'proveedor_id' => $proveedor->id,
                        'codigo'       => $codigo,
                    ]);

                    // Usar update directo en lugar de saveQuietly para evitar problemas de listeners
                    static::where('id', $proveedor->id)->update([
                        'codigo_proveedor' => $codigo,
                    ]);

                    // Recargar el modelo
                    $proveedor->refresh();
                }
            } catch (\Exception $e) {
                Log::error('Error generando código para proveedor', [
                    'error'        => $e->getMessage(),
                    'proveedor_id' => $proveedor->id,
                ]);
            }
        });
    }

    public function generateCodigoProveedor(): string
    {
        // Regla: PRV + 000 + IDPROVEEDOR (con padding a 4 dígitos hasta 999)
        $numero = (int) $this->id;
        if ($numero < 1000) {
            // 1 => PRV0001, 12 => PRV0012, 999 => PRV0999
            return 'PRV' . str_pad((string) $numero, 4, '0', STR_PAD_LEFT);
        }

        // A partir de 1000, se usa el número tal cual (PRV1000, PRV1001, ...)
        return 'PRV' . $numero;
    }

    // Relaciones
    public function compras()
    {
        return $this->hasMany(Compra::class);
    }

    public function productos()
    {
        return $this->hasMany(Producto::class, 'proveedor_id');
    }
}
