<?php

namespace App\Models\Traits;

use App\Services\CodigoBarraService;
use App\Enums\TipoCodigoBarraEnum;

/**
 * Trait GeneratesBarcode
 *
 * Proporciona métodos para generar y gestionar códigos de barras
 * para modelos que tengan relación con la tabla codigos_barra.
 *
 * Uso: use GeneratesBarcode en el modelo Producto
 */
trait GeneratesBarcode
{
    /**
     * Generar un código EAN-13 automático y asignarlo al producto
     */
    public function generarCodigoAutomatico(): \App\Models\CodigoBarra
    {
        return app(CodigoBarraService::class)->generarYAsignar($this->id);
    }

    /**
     * Generar múltiples códigos EAN-13 automáticos
     */
    public function generarMultiplesCodigos(int $cantidad = 5): \Illuminate\Database\Eloquent\Collection
    {
        $service = app(CodigoBarraService::class);
        $codigos = new \Illuminate\Database\Eloquent\Collection();

        for ($i = 0; $i < $cantidad; $i++) {
            $codigos->push($service->generarYAsignar($this->id));
        }

        return $codigos;
    }

    /**
     * Obtener código principal
     */
    public function codigoPrincipalActual(): ?\App\Models\CodigoBarra
    {
        return app(CodigoBarraService::class)->obtenerCodigoPrincipal($this->id);
    }

    /**
     * Obtener segundo código (para etiquetas duales)
     */
    public function segundoCodigoActual(): ?\App\Models\CodigoBarra
    {
        return app(CodigoBarraService::class)->obtenerSegundoCodigo($this->id);
    }

    /**
     * Verificar si tiene códigos de barra
     */
    public function tieneCodigos(): bool
    {
        return $this->codigosBarra()->active()->exists();
    }

    /**
     * Obtener cantidad de códigos activos
     */
    public function cantidadCodigosActivos(): int
    {
        return app(CodigoBarraService::class)->contarCodigosActivos($this->id);
    }

    /**
     * Generar código si no tiene ninguno (se puede usar en observador)
     */
    public function asegurarCodigoAutomatico(): void
    {
        if (!$this->tieneCodigos()) {
            $this->generarCodigoAutomatico();
        }
    }

    /**
     * Asignar código de barra manual
     */
    public function asignarCodigo(string $codigo, ?TipoCodigoBarraEnum $tipo = null, bool $esPrincipal = false): \App\Models\CodigoBarra
    {
        return app(CodigoBarraService::class)->crear(
            $this->id,
            $codigo,
            $tipo ?? TipoCodigoBarraEnum::EAN,
            $esPrincipal
        );
    }
}
