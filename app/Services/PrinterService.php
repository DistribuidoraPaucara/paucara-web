<?php

namespace App\Services;

use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * PrinterService - Maneja impresión térmica en red
 *
 * Responsabilidades:
 * ✓ Conectarse a impresora térmica en red (ESC/POS)
 * ✓ Generar tickets con formato ESC/POS
 * ✓ Enviar datos a la impresora
 * ✓ Manejo de errores y reconexión
 *
 * Configuración requerida en .env:
 * - PRINTER_HOST: IP de la impresora (ej: 192.168.1.100)
 * - PRINTER_PORT: Puerto (default: 9100)
 * - PRINTER_PAPER_WIDTH: Ancho en mm (58 o 80)
 * - PRINTER_ENABLED: true/false para activar/desactivar impresión
 */
class PrinterService
{
    private ?Printer $printer = null;
    private string $printerHost;
    private int $printerPort;
    private int $paperWidth; // 58 o 80 mm
    private bool $enabled;

    public function __construct()
    {
        $this->printerHost = config('printer.host', env('PRINTER_HOST', '192.168.1.100'));
        $this->printerPort = config('printer.port', env('PRINTER_PORT', 9100));
        $this->paperWidth = config('printer.paper_width', env('PRINTER_PAPER_WIDTH', 58));
        $this->enabled = config('printer.enabled', env('PRINTER_ENABLED', false));

        Log::info('🖨️ PrinterService inicializado', [
            'host' => $this->printerHost,
            'port' => $this->printerPort,
            'paperWidth' => $this->paperWidth,
            'enabled' => $this->enabled,
        ]);
    }

    /**
     * Conectar a la impresora térmica
     */
    private function connect(): bool
    {
        if (!$this->enabled) {
            Log::warning('⚠️ Impresora deshabilitada en configuración');
            return false;
        }

        try {
            if ($this->printer === null) {
                Log::info('🔌 Conectando a impresora térmica', [
                    'host' => $this->printerHost,
                    'port' => $this->printerPort,
                ]);

                $connector = new NetworkPrintConnector(
                    $this->printerHost,
                    $this->printerPort,
                    timeout: 5
                );

                $this->printer = new Printer($connector);

                Log::info('✅ Conexión exitosa a impresora térmica');
                return true;
            }

            return true;
        } catch (Exception $e) {
            Log::error('❌ Error conectando a impresora térmica: ' . $e->getMessage(), [
                'host' => $this->printerHost,
                'port' => $this->printerPort,
            ]);

            $this->printer = null;
            return false;
        }
    }

    /**
     * Desconectar impresora
     */
    private function disconnect(): void
    {
        try {
            if ($this->printer !== null) {
                $this->printer->close();
                $this->printer = null;
            }
        } catch (Exception $e) {
            Log::warning('⚠️ Error al desconectar impresora: ' . $e->getMessage());
        }
    }

    /**
     * Imprimir ticket de venta
     *
     * @param array $datos Datos del ticket:
     *  - numero: Número de venta/documento
     *  - cliente_nombre: Nombre del cliente
     *  - cliente_nit: NIT del cliente
     *  - fecha: Fecha de la venta
     *  - detalles: Array de items [['producto' => string, 'cantidad' => float, 'precio' => float, 'subtotal' => float]]
     *  - subtotal: Subtotal
     *  - descuento: Descuento
     *  - total: Total
     *  - tipo_pago: Tipo de pago (ej: "Contado")
     */
    public function printTicket(array $datos): bool
    {
        if (!$this->enabled) {
            Log::info('⏭️ Saltar impresión - Impresora deshabilitada');
            return false;
        }

        try {
            if (!$this->connect()) {
                return false;
            }

            Log::info('📄 Generando ticket ESC/POS', [
                'numero' => $datos['numero'] ?? 'N/A',
                'cliente' => $datos['cliente_nombre'] ?? 'N/A',
            ]);

            // Configurar impresora
            $this->printer->setJustification(Printer::JUSTIFY_CENTER);

            // Encabezado
            $this->printHeader($datos);

            // Separador
            $this->printSeparator();

            // Información cliente
            $this->printClientInfo($datos);

            // Separador
            $this->printSeparator('simple');

            // Detalles de items
            $this->printItems($datos['detalles'] ?? []);

            // Separador
            $this->printSeparator('double');

            // Totales
            $this->printTotals($datos);

            // Separador
            $this->printSeparator();

            // Tipo de pago
            $this->printer->setJustification(Printer::JUSTIFY_CENTER);
            $this->printer->text(strtoupper($datos['tipo_pago'] ?? 'CONTADO'));

            // Cortar papel
            $this->printer->cut(Printer::CUT_FULL);

            // Vaciar buffer
            $this->printer->pulse();

            Log::info('✅ Ticket impreso exitosamente', [
                'numero' => $datos['numero'] ?? 'N/A',
            ]);

            return true;
        } catch (Exception $e) {
            Log::error('❌ Error imprimiendo ticket: ' . $e->getMessage(), [
                'numero' => $datos['numero'] ?? 'N/A',
                'exception' => $e,
            ]);

            return false;
        } finally {
            $this->disconnect();
        }
    }

    /**
     * Imprimir encabezado del ticket
     */
    private function printHeader(array $datos): void
    {
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);

        // Nombre empresa (si está disponible)
        $empresa = config('app.name', 'Distribuidora Paucara');
        $this->printer->setEmphasis(true);
        $this->printer->setTextSize(2, 1); // Aumentar tamaño
        $this->printer->text($empresa);
        $this->printer->setEmphasis(false);
        $this->printer->setTextSize(1, 1);

        // Tipo de documento y número
        $this->printer->text("TICKET #" . ($datos['numero'] ?? 'N/A'));

        // Fecha y hora
        $fecha = isset($datos['fecha'])
            ? $datos['fecha']->format('d/m/Y H:i')
            : date('d/m/Y H:i');
        $this->printer->setTextSize(1, 1);
        $this->printer->text($fecha);
    }

    /**
     * Imprimir información del cliente
     */
    private function printClientInfo(array $datos): void
    {
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);

        if (!empty($datos['cliente_nombre'])) {
            $this->printer->setEmphasis(true);
            $this->printer->text($datos['cliente_nombre']);
            $this->printer->setEmphasis(false);
        }

        if (!empty($datos['cliente_nit'])) {
            $this->printer->text("NIT: " . $datos['cliente_nit']);
        }
    }

    /**
     * Imprimir items/detalles
     */
    private function printItems(array $detalles): void
    {
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);

        foreach ($detalles as $detalle) {
            $nombre = $detalle['producto'] ?? 'Producto';
            $cantidad = $detalle['cantidad'] ?? 0;
            $precio = $detalle['precio'] ?? 0;
            $subtotal = $detalle['subtotal'] ?? 0;

            // Nombre del producto (truncado)
            $nombreTruncado = substr($nombre, 0, 30);
            $this->printer->setEmphasis(true);
            $this->printer->text($nombreTruncado);
            $this->printer->setEmphasis(false);

            // Cantidad x Precio = Subtotal
            $lineaItem = sprintf(
                "%d x %.2f = %.2f",
                (int)$cantidad,
                (float)$precio,
                (float)$subtotal
            );
            $this->printer->text($lineaItem);

            // Línea vacía entre items
            $this->printer->text("");
        }
    }

    /**
     * Imprimir totales
     */
    private function printTotals(array $datos): void
    {
        $this->printer->setJustification(Printer::JUSTIFY_LEFT);

        $subtotal = $datos['subtotal'] ?? 0;
        $descuento = $datos['descuento'] ?? 0;
        $total = $datos['total'] ?? 0;

        // Subtotal (si hay descuento)
        if ($descuento > 0) {
            $lineaSubtotal = sprintf(
                "%-15s %8.2f",
                "Subtotal:",
                $subtotal + $descuento
            );
            $this->printer->text($lineaSubtotal);

            // Descuento
            $lineaDescuento = sprintf(
                "%-15s %8.2f",
                "Descuento:",
                -$descuento
            );
            $this->printer->text($lineaDescuento);
        }

        // Total
        $this->printer->setEmphasis(true);
        $lineaTotal = sprintf(
            "%-15s %8.2f",
            "TOTAL:",
            $total
        );
        $this->printer->text($lineaTotal);
        $this->printer->setEmphasis(false);
    }

    /**
     * Imprimir separador
     */
    private function printSeparator(string $tipo = 'normal'): void
    {
        $this->printer->setJustification(Printer::JUSTIFY_CENTER);

        if ($tipo === 'double') {
            $this->printer->text("================================");
            $this->printer->text("================================");
        } elseif ($tipo === 'simple') {
            $this->printer->text("--------------------------------");
        } else {
            $this->printer->text("================================");
        }
    }

    /**
     * Verificar conexión a impresora
     */
    public function testConnection(): bool
    {
        try {
            if (!$this->connect()) {
                return false;
            }

            Log::info('✅ Prueba de conexión exitosa a impresora');
            return true;
        } catch (Exception $e) {
            Log::error('❌ Prueba de conexión fallida: ' . $e->getMessage());
            return false;
        } finally {
            $this->disconnect();
        }
    }

    /**
     * Obtener configuración actual
     */
    public function getConfig(): array
    {
        return [
            'host' => $this->printerHost,
            'port' => $this->printerPort,
            'paperWidth' => $this->paperWidth,
            'enabled' => $this->enabled,
        ];
    }
}
