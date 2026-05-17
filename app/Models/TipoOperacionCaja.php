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
        'direccion',  // ✅ NUEVO: ENTRADA, SALIDA, AJUSTE, ESPECIAL
    ];

    // Relaciones
    public function movimientos()
    {
        return $this->hasMany(MovimientoCaja::class, 'tipo_operacion_id');
    }

    // Constantes para los tipos
    const APERTURA = 'APERTURA';

    const CIERRE = 'CIERRE';

    const VENTA = 'VENTA';

    const COMPRA = 'COMPRA';

    const GASTO = 'GASTO';

    const INGRESO_EXTRA = 'INGRESO_EXTRA';

    const CREDITO = 'CREDITO';  // ✅ Tipo de operación para créditos otorgados

    const PAGO_SUELDO = 'PAGO_SUELDO';  // ✅ NUEVO: Tipo de operación para pagos de sueldo

    const ANTICIPO = 'ANTICIPO';  // ✅ NUEVO: Tipo de operación para anticipos

    /**
     * ✅ Obtener tipos de operación clasificados por dirección (ENTRADA/SALIDA/AJUSTE)
     * Agrupa los tipos para mejor presentación en UI
     *
     * @return array Array con estructura: ['ENTRADA' => [...], 'SALIDA' => [...], 'AJUSTE' => [...]]
     */
    public static function obtenerTiposClasificados(): array
    {
        $todos = self::all(['id', 'codigo', 'nombre']);

        // Clasificación de tipos según dirección del flujo de dinero
        $clasificacion = [
            'ENTRADA' => [
                'VENTA',     // Cliente compra
                'PAGO',      // Cliente paga deuda
                'SERVICIO',  // Servicio prestado
            ],
            'SALIDA' => [
                'COMPRA',    // Compra a proveedor
                'GASTOS',    // Gasto operacional
                'PAGO_SUELDO', // Pago a empleados
                'ANTICIPO',  // Anticipo a empleados
                'ANULACION', // Devolución/anulación
                'DEVOLUCION', // Devolución de producto
            ],
            'AJUSTE' => [
                'AJUSTE',    // Ajuste manual
                'CREDITO',   // Otorgamiento de crédito
            ],
        ];

        // Excluir del modal (tienen sus propios diálogos)
        $excluidos = ['APERTURA', 'CIERRE'];

        // Agrupar por clasificación
        $resultado = [
            'ENTRADA' => [],
            'SALIDA' => [],
            'AJUSTE' => [],
        ];

        foreach ($todos as $tipo) {
            // Excluir tipos especiales
            if (in_array($tipo->codigo, $excluidos)) {
                continue;
            }

            // Encontrar la clasificación del tipo
            foreach ($clasificacion as $clase => $codigos) {
                if (in_array($tipo->codigo, $codigos)) {
                    $resultado[$clase][] = $tipo;
                    break;
                }
            }
        }

        return $resultado;
    }
}
