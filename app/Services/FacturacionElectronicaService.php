<?php

namespace App\Services;

use App\Models\FacturaElectronica;
use App\Models\TipoDocumento;
use App\Models\Venta;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FacturacionElectronicaService
{
    private $sinApiUrl;

    private $nitEmisor;

    private $codigoPuntoVenta;

    public function __construct()
    {
        $this->sinApiUrl = config('services.sin.api_url', 'https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionCodigos');
        $this->nitEmisor = config('services.sin.nit_emisor');
        $this->codigoPuntoVenta = config('services.sin.codigo_punto_venta', 0);
    }

    /**
     * Generar factura electrónica para una venta
     */
    public function generarFacturaElectronica(Venta $venta): FacturaElectronica
    {
        // Generar CUF (Código Único de Facturación)
        $cuf = $this->generarCUF($venta);

        // Obtener siguiente número de factura
        $numeroFactura = $this->obtenerSiguienteNumeroFactura($venta->tipoDocumento);

        $facturaElectronica = FacturaElectronica::create([
            'cuf' => $cuf,
            'numero_factura' => $numeroFactura,
            'nit_emisor' => $this->nitEmisor,
            'fecha_emision' => $venta->fecha_venta,
            'hora_emision' => now(),
            'monto_total' => $venta->monto_total,
            'monto_total_sujeto_iva' => $this->calcularMontoSujetoIva($venta),
            'monto_total_moneda_extranjera' => 0, // Por defecto en bolivianos
            'tipo_cambio' => 1,
            'codigo_moneda' => 1, // 1 = Bolivianos
            'codigo_punto_venta' => $this->codigoPuntoVenta,
            'modalidad' => 1, // 1 = Electronico en linea
            'tipo_emision' => 1, // 1 = Emision en linea
            'tipo_factura_documento' => $this->mapearTipoDocumentoSIN($venta->tipoDocumento),
            'estado' => 'pendiente',
            'venta_id' => $venta->id,
        ]);

        return $facturaElectronica;
    }

    /**
     * Enviar factura al SIN
     */
    public function enviarFacturaAlSIN(FacturaElectronica $factura): bool
    {
        try {
            $xml = $this->generarXMLFactura($factura);

            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer '.$this->obtenerTokenSIN(),
                ])
                ->post($this->sinApiUrl.'/recepcionFactura', [
                    'archivo' => base64_encode($xml),
                    'fechaEnvio' => now()->format('Y-m-d\TH:i:s.v'),
                    'hashArchivo' => hash('sha256', $xml),
                ]);

            if ($response->successful()) {
                $responseData = $response->json();

                $factura->update([
                    'codigo_recepcion' => $responseData['codigoRecepcion'] ?? null,
                    'fecha_envio_sin' => now(),
                    'respuesta_sin' => json_encode($responseData),
                    'estado' => $responseData['transaccion'] ? 'enviado' : 'error',
                ]);

                return $responseData['transaccion'] ?? false;
            }

            $factura->update([
                'estado' => 'error',
                'observaciones_sin' => 'Error en envío: '.$response->body(),
                'fecha_envio_sin' => now(),
            ]);

            return false;

        } catch (\Exception $e) {
            Log::error('Error enviando factura al SIN: '.$e->getMessage(), [
                'factura_id' => $factura->id,
                'cuf' => $factura->cuf,
            ]);

            $factura->update([
                'estado' => 'error',
                'observaciones_sin' => 'Error de conexión: '.$e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Verificar estado de factura en el SIN
     */
    public function verificarEstadoFactura(FacturaElectronica $factura): bool
    {
        if (! $factura->codigo_recepcion) {
            return false;
        }

        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'Authorization' => 'Bearer '.$this->obtenerTokenSIN(),
                ])
                ->get($this->sinApiUrl.'/verificacionEstado', [
                    'codigoRecepcion' => $factura->codigo_recepcion,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                $factura->update([
                    'fecha_procesamiento_sin' => now(),
                    'estado' => $data['codigoEstado'] == 908 ? 'vigente' : 'observada',
                    'observaciones_sin' => $data['descripcion'] ?? null,
                ]);

                return $data['codigoEstado'] == 908; // 908 = Validado
            }

            return false;

        } catch (\Exception $e) {
            Log::error('Error verificando estado en SIN: '.$e->getMessage(), [
                'factura_id' => $factura->id,
                'codigo_recepcion' => $factura->codigo_recepcion,
            ]);

            return false;
        }
    }

    /**
     * Anular factura en el SIN
     */
    public function anularFactura(FacturaElectronica $factura, string $motivo = 'Anulación por error'): bool
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer '.$this->obtenerTokenSIN(),
                ])
                ->post($this->sinApiUrl.'/anulacionFactura', [
                    'codigoRecepcion' => $factura->codigo_recepcion,
                    'cuf' => $factura->cuf,
                    'motivo' => $motivo,
                ]);

            if ($response->successful()) {
                $responseData = $response->json();

                $factura->update([
                    'estado' => 'anulada',
                    'observaciones_sin' => "Anulada: {$motivo}",
                    'respuesta_sin' => json_encode($responseData),
                ]);

                return true;
            }

            return false;

        } catch (\Exception $e) {
            Log::error('Error anulando factura en SIN: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Generar CUF (Código Único de Facturación)
     */
    private function generarCUF(Venta $venta): string
    {
        // Formato CUF según normativa SIN:
        // NIT + Fecha + Sucursal + Modalidad + Tipo + Número + Punto Venta + Complemento

        $fecha = $venta->fecha_venta->format('Ymd');
        $sucursal = '0'; // Por defecto sucursal 0
        $modalidad = '1'; // 1 = Electronico
        $tipoDocumento = $this->mapearTipoDocumentoSIN($venta->tipoDocumento);
        $numeroDocumento = str_pad($venta->id, 10, '0', STR_PAD_LEFT);
        $puntoVenta = str_pad($this->codigoPuntoVenta, 4, '0', STR_PAD_LEFT);

        $base = $this->nitEmisor.$fecha.$sucursal.$modalidad.$tipoDocumento.$numeroDocumento.$puntoVenta;

        // Generar dígito verificador
        $modulo = $this->calcularModulo11($base);

        return $base.$modulo;
    }

    /**
     * Calcular módulo 11 para CUF
     */
    private function calcularModulo11(string $cadena): string
    {
        $secuencia = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7];
        $suma = 0;

        for ($i = 0; $i < strlen($cadena); $i++) {
            $suma += intval($cadena[$i]) * $secuencia[$i];
        }

        $residuo = $suma % 11;

        return $residuo < 2 ? (string) $residuo : (string) (11 - $residuo);
    }

    /**
     * Mapear tipo de documento a código SIN
     */
    private function mapearTipoDocumentoSIN(?TipoDocumento $tipoDocumento): string
    {
        if (! $tipoDocumento) {
            return '1'; // Factura por defecto
        }

        return match ($tipoDocumento->codigo) {
            'FAC' => '1',
            'BOL' => '2',
            'NCR' => '3',
            'NDB' => '4',
            'REC' => '5',
            default => '1',
        };
    }

    /**
     * Calcular monto sujeto a IVA
     */
    private function calcularMontoSujetoIva(Venta $venta): float
    {
        $impuestoIva = $venta->ventaImpuestos()
            ->whereHas('impuesto', fn ($q) => $q->where('codigo', 'IVA'))
            ->first();

        return $impuestoIva ? $impuestoIva->base_imponible : $venta->monto_total;
    }

    /**
     * Generar XML para factura (simplificado)
     */
    private function generarXMLFactura(FacturaElectronica $factura): string
    {
        // Este sería el XML completo según especificaciones del SIN
        // Por simplicidad, devolvemos un XML básico
        return '<?xml version="1.0" encoding="UTF-8"?>'.
            '<facturaComputarizadaCompraVenta>'.
            "<nitEmisor>{$factura->nit_emisor}</nitEmisor>".
            "<numeroFactura>{$factura->numero_factura}</numeroFactura>".
            "<cuf>{$factura->cuf}</cuf>".
            "<fechaEmision>{$factura->fecha_emision->format('Y-m-d\TH:i:s')}</fechaEmision>".
            "<montoTotal>{$factura->monto_total}</montoTotal>".
            '</facturaComputarizadaCompraVenta>';
    }

    /**
     * Obtener siguiente número de factura
     */
    private function obtenerSiguienteNumeroFactura(?TipoDocumento $tipoDocumento): string
    {
        if (! $tipoDocumento) {
            return '001';
        }

        return $tipoDocumento->obtenerSiguienteNumero();
    }

    /**
     * Obtener token de autenticación del SIN
     */
    private function obtenerTokenSIN(): string
    {
        // Implementar autenticación con SIN
        // Por ahora devolvemos un token de prueba
        return config('services.sin.token', 'TOKEN_PRUEBA');
    }

    /**
     * Obtener facturas pendientes de envío
     */
    public function obtenerFacturasPendientes()
    {
        return FacturaElectronica::where('estado', 'pendiente')
            ->orWhere('estado', 'error')
            ->with(['venta.cliente'])
            ->get();
    }

    /**
     * Procesar facturas pendientes (para comando artisan)
     */
    public function procesarFacturasPendientes(): array
    {
        $facturas = $this->obtenerFacturasPendientes();
        $resultados = [
            'procesadas' => 0,
            'exitosas' => 0,
            'con_errores' => 0,
        ];

        foreach ($facturas as $factura) {
            $resultados['procesadas']++;

            if ($this->enviarFacturaAlSIN($factura)) {
                $resultados['exitosas']++;

                // Verificar estado después de un momento
                sleep(2);
                $this->verificarEstadoFactura($factura);
            } else {
                $resultados['con_errores']++;
            }
        }

        return $resultados;
    }
}
