<?php

namespace App\Services;

use App\DTOs\CodigoBarraDTO;
use App\Enums\TipoCodigoBarraEnum;
use App\Models\CodigoBarra;
use App\Models\Producto;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CodigoBarraService
{
    /**
     * Validar código de barras según su tipo
     *
     * @param string $codigo Código a validar
     * @param TipoCodigoBarraEnum $tipo Tipo de código
     * @return array ['valido' => bool, 'mensaje' => string, 'errores' => array]
     */
    public function validar(string $codigo, TipoCodigoBarraEnum $tipo): array
    {
        $codigo = trim($codigo);

        $validaciones = [
            'vacio' => strlen($codigo) === 0,
            'tipo' => !$this->validarTipo($codigo, $tipo),
        ];

        if ($tipo === TipoCodigoBarraEnum::EAN) {
            $validaciones['ean'] = !$this->validarEAN($codigo);
        } elseif ($tipo === TipoCodigoBarraEnum::UPC) {
            $validaciones['upc'] = !$this->validarUPC($codigo);
        }

        $errores = [];
        if ($validaciones['vacio']) {
            $errores[] = 'El código no puede estar vacío';
        }
        if ($validaciones['tipo']) {
            $errores[] = "Formato inválido para {$tipo->getDescripcion()}";
        }
        if ($validaciones['ean'] ?? false) {
            $errores[] = 'Dígito verificador inválido para EAN-13';
        }
        if ($validaciones['upc'] ?? false) {
            $errores[] = 'Dígito verificador inválido para UPC';
        }

        return [
            'valido' => empty($errores),
            'mensaje' => empty($errores) ? 'Código válido' : implode(', ', $errores),
            'errores' => $errores,
        ];
    }

    /**
     * Validar que el código tenga la longitud correcta según su tipo
     */
    private function validarTipo(string $codigo, TipoCodigoBarraEnum $tipo): bool
    {
        $longitudValida = $tipo->getLongitudValida();

        if (empty($longitudValida)) {
            return true; // Sin validación de longitud
        }

        return in_array(strlen($codigo), $longitudValida);
    }

    /**
     * Validar formato EAN-13 incluyendo dígito verificador
     *
     * Algoritmo EAN-13:
     * 1. Sumar pesos de posiciones impares (derecha a izquierda) × 1
     * 2. Sumar pesos de posiciones pares × 3
     * 3. Dígito verificador = (10 - (suma % 10)) % 10
     */
    private function validarEAN(string $codigo): bool
    {
        // Solo aceptar 8 o 13 dígitos
        if (!preg_match('/^\d{8}$|^\d{13}$/', $codigo)) {
            return false;
        }

        // Para EAN-8 o EAN-13, validar dígito verificador
        if (strlen($codigo) === 8) {
            return $this->validarDigitoVerificador($codigo, 8);
        }

        return $this->validarDigitoVerificador($codigo, 13);
    }

    /**
     * Validar formato UPC
     */
    private function validarUPC(string $codigo): bool
    {
        // UPC-A tiene 12 dígitos, UPC-E tiene 8
        if (!preg_match('/^\d{8}$|^\d{12}$/', $codigo)) {
            return false;
        }

        return $this->validarDigitoVerificador($codigo, strlen($codigo));
    }

    /**
     * Validar dígito verificador usando algoritmo modulo 10
     */
    private function validarDigitoVerificador(string $codigo, int $longitud): bool
    {
        if (strlen($codigo) !== $longitud) {
            return false;
        }

        $digitoVerificador = intval($codigo[-1]);
        $codigoSinVerificador = substr($codigo, 0, -1);

        $suma = 0;
        $peso = ($longitud - 1) % 2 === 0 ? 3 : 1;

        for ($i = 0; $i < strlen($codigoSinVerificador); $i++) {
            $suma += intval($codigoSinVerificador[$i]) * $peso;
            $peso = $peso === 1 ? 3 : 1;
        }

        $calculado = (10 - ($suma % 10)) % 10;

        return $calculado === $digitoVerificador;
    }

    /**
     * Generar código EAN-13 automáticamente
     *
     * Formato: 977 + 6 dígitos secuenciales + dígito verificador
     * (977 es prefijo para productos internos)
     */
    public function generarEAN13(): string
    {
        // Obtener el último código interno generado
        $ultimoCodigo = CodigoBarra::where('tipo', 'EAN')
            ->where('activo', true)
            ->orderBy('id', 'desc')
            ->first();

        // Extraer número secuencial (posiciones 3-9 del código)
        $numero = 1;
        if ($ultimoCodigo) {
            $numero = intval(substr($ultimoCodigo->codigo, 3, 7)) + 1;
        }

        // Garantizar 6 dígitos para el número secuencial
        $numero = str_pad($numero, 7, '0', STR_PAD_LEFT);
        $codigoSinVerificador = '977' . $numero;

        // Calcular dígito verificador
        $suma = 0;
        for ($i = 0; $i < strlen($codigoSinVerificador); $i++) {
            $peso = ($i % 2 === 0) ? 1 : 3;
            $suma += intval($codigoSinVerificador[$i]) * $peso;
        }

        $digitoVerificador = (10 - ($suma % 10)) % 10;

        return $codigoSinVerificador . $digitoVerificador;
    }

    /**
     * Crear código de barra para un producto
     */
    public function crear(int $productoId, string $codigo, TipoCodigoBarraEnum $tipo = null, bool $esPrincipal = false): CodigoBarra
    {
        $tipo = $tipo ?? TipoCodigoBarraEnum::EAN;

        // Validar código
        $validacion = $this->validar($codigo, $tipo);
        if (!$validacion['valido']) {
            throw new \InvalidArgumentException('Código inválido: ' . $validacion['mensaje']);
        }

        // Verificar que el producto exista
        $producto = Producto::findOrFail($productoId);

        // Verificar unicidad de código activo
        $existente = CodigoBarra::where('codigo', $codigo)
            ->where('activo', true)
            ->first();

        if ($existente && $existente->producto_id !== $productoId) {
            throw new \InvalidArgumentException("Código ya existe en producto: {$existente->producto->nombre}");
        }

        // Si es principal, desmarcar otros
        if ($esPrincipal) {
            CodigoBarra::where('producto_id', $productoId)
                ->where('es_principal', true)
                ->update(['es_principal' => false]);
        }

        return CodigoBarra::create([
            'producto_id' => $productoId,
            'codigo' => $codigo,
            'tipo' => $tipo->value,
            'es_principal' => $esPrincipal,
            'activo' => true,
        ]);
    }

    /**
     * Crear múltiples códigos en transacción
     */
    public function crearMultiples(int $productoId, array $codigos): Collection
    {
        return DB::transaction(function () use ($productoId, $codigos) {
            $resultado = new Collection();

            foreach ($codigos as $index => $codigo) {
                $esPrincipal = $index === 0; // Primero como principal
                $tipo = TipoCodigoBarraEnum::EAN;

                $codigoCreado = $this->crear($productoId, $codigo, $tipo, $esPrincipal);
                $resultado->push($codigoCreado);
            }

            return $resultado;
        });
    }

    /**
     * Generar y asignar automáticamente un código EAN-13 a un producto
     */
    public function generarYAsignar(int $productoId): CodigoBarra
    {
        $codigo = $this->generarEAN13();
        return $this->crear($productoId, $codigo, TipoCodigoBarraEnum::EAN, true);
    }

    /**
     * Marcar un código como principal
     */
    public function marcarPrincipal(string $codigoId): CodigoBarra
    {
        $codigo = CodigoBarra::findOrFail($codigoId);

        if (!$codigo->activo) {
            throw new \InvalidArgumentException('No se puede marcar como principal un código inactivo');
        }

        DB::transaction(function () use ($codigo) {
            // Desmarcar otros
            CodigoBarra::where('producto_id', $codigo->producto_id)
                ->where('es_principal', true)
                ->update(['es_principal' => false]);

            // Marcar este
            $codigo->update(['es_principal' => true]);
        });

        return $codigo->refresh();
    }

    /**
     * Inactivar un código de barra
     */
    public function inactivar(string $codigoId): CodigoBarra
    {
        $codigo = CodigoBarra::findOrFail($codigoId);

        if ($codigo->es_principal && $codigo->producto->codigosBarra()->active()->count() === 1) {
            throw new \InvalidArgumentException('No se puede inactivar el único código activo del producto');
        }

        $codigo->update(['activo' => false]);

        // Si era principal, marcar otro como principal
        if ($codigo->es_principal) {
            $nuevosPrincipal = CodigoBarra::where('producto_id', $codigo->producto_id)
                ->where('activo', true)
                ->where('es_principal', false)
                ->first();

            if ($nuevosPrincipal) {
                $nuevosPrincipal->update(['es_principal' => true]);
            }
        }

        return $codigo->refresh();
    }

    /**
     * Buscar producto por código de barra
     */
    public function buscarPorCodigo(string $codigo): ?Producto
    {
        $codigoBarra = CodigoBarra::where('codigo', trim($codigo))
            ->where('activo', true)
            ->with('producto')
            ->first();

        return $codigoBarra?->producto;
    }

    /**
     * Obtener todos los códigos de un producto
     */
    public function obtenerCodigosProducto(int $productoId): Collection
    {
        return CodigoBarra::where('producto_id', $productoId)
            ->where('activo', true)
            ->orderByDesc('es_principal')
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Obtener código principal de un producto
     */
    public function obtenerCodigoPrincipal(int $productoId): ?CodigoBarra
    {
        return CodigoBarra::where('producto_id', $productoId)
            ->where('activo', true)
            ->where('es_principal', true)
            ->first();
    }

    /**
     * Obtener segundo código (para etiquetas duales)
     */
    public function obtenerSegundoCodigo(int $productoId): ?CodigoBarra
    {
        return CodigoBarra::where('producto_id', $productoId)
            ->where('activo', true)
            ->orderByDesc('es_principal')
            ->skip(1)
            ->first();
    }

    /**
     * Verificar si un código es único (no existe en productos activos)
     */
    public function esUnico(string $codigo, ?int $productoIdActual = null): bool
    {
        $query = CodigoBarra::where('codigo', trim($codigo))
            ->where('activo', true);

        if ($productoIdActual) {
            $query->where('producto_id', '!=', $productoIdActual);
        }

        return !$query->exists();
    }

    /**
     * Contar códigos activos de un producto
     */
    public function contarCodigosActivos(int $productoId): int
    {
        return CodigoBarra::where('producto_id', $productoId)
            ->where('activo', true)
            ->count();
    }

    /**
     * Obtener DTOs de códigos de un producto
     */
    public function obtenerCodigosDTO(int $productoId): array
    {
        return $this->obtenerCodigosProducto($productoId)
            ->map(fn (CodigoBarra $codigo) => $this->toDTO($codigo))
            ->toArray();
    }

    /**
     * Convertir modelo a DTO
     */
    public function toDTO(CodigoBarra $codigoBarra): CodigoBarraDTO
    {
        return new CodigoBarraDTO(
            id: $codigoBarra->id,
            producto_id: $codigoBarra->producto_id,
            codigo: $codigoBarra->codigo,
            tipo: TipoCodigoBarraEnum::from($codigoBarra->tipo),
            es_principal: $codigoBarra->es_principal,
            activo: $codigoBarra->activo,
            created_at: $codigoBarra->created_at?->toIso8601String(),
            updated_at: $codigoBarra->updated_at?->toIso8601String(),
        );
    }
}
