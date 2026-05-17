<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\PatternFill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use App\Models\Empresa;
use App\Models\Venta;
use App\Models\Compra;
use App\Models\Credito;
use App\Models\Caja;
use App\Models\StockProducto;
use App\Models\Entrega;
use App\Services\ImpresionEntregaService;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * ExcelExportService - Generador profesional de archivos Excel
 *
 * Proporciona métodos para exportar documentos (ventas, compras, etc.)
 * con formato profesional que incluye:
 * - Encabezado con datos de la empresa
 * - Detalles del documento
 * - Pie con totales y observaciones
 */
class ExcelExportService
{
    private Spreadsheet $spreadsheet;
    private Worksheet $sheet;
    private int $currentRow = 1;
    private ?Empresa $empresa = null;

    public function __construct()
    {
        $this->spreadsheet = new Spreadsheet();
        $this->sheet = $this->spreadsheet->getActiveSheet();
        $this->empresa = Empresa::where('activo', true)->first();
    }

    /**
     * Exportar venta a Excel
     *
     * @param Venta $venta
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function exportarVenta(Venta $venta)
    {
        Log::info('📊 ExcelExportService::exportarVenta', ['venta_id' => $venta->id]);

        try {
            // Cargar relaciones
            $venta->load([
                'cliente',
                'moneda',
                'detalles.producto',
                'usuario',
                'estadoDocumento',
                'tipoDocumento',
                'tipoPago'
            ]);

            // Crear encabezado
            $this->crearEncabezado($venta);

            // Crear sección de cliente
            $this->crearSeccionCliente($venta);

            // Crear tabla de detalles
            $this->crearTablaDetalles($venta);

            // Crear sección de totales
            $this->crearSeccionTotales($venta);

            // Crear pie
            $this->crearPie($venta);

            // Aplicar estilos y ajustes
            $this->aplicarFormato();

            // Generar nombre del archivo
            $nombreArchivo = "Venta_{$venta->numero}_" . now()->format('Y-m-d_H-i-s') . '.xlsx';

            // Descargar
            return $this->descargarArchivo($this->spreadsheet, $nombreArchivo);
        } catch (\Exception $e) {
            Log::error('❌ Error al exportar venta a Excel', [
                'error' => $e->getMessage(),
                'venta_id' => $venta->id
            ]);
            throw $e;
        }
    }

    /**
     * Crear encabezado con datos de la empresa
     */
    private function crearEncabezado(Venta $venta): void
    {
        // Logo y nombre empresa
        if ($this->empresa) {
            $this->agregarCelda($this->empresa->nombre, ['fontSize' => 14, 'bold' => true, 'color' => '1F2937']);
            $this->currentRow++;

            if ($this->empresa->nit) {
                $this->agregarCelda('NIT: ' . $this->empresa->nit, ['fontSize' => 10, 'color' => '6B7280']);
                $this->currentRow++;
            }

            if ($this->empresa->direccion) {
                $this->agregarCelda($this->empresa->direccion, ['fontSize' => 10, 'color' => '6B7280']);
                $this->currentRow++;
            }

            if ($this->empresa->telefono) {
                $this->agregarCelda('Tel: ' . $this->empresa->telefono, ['fontSize' => 10, 'color' => '6B7280']);
                $this->currentRow++;
            }
        }

        $this->currentRow += 2;

        // Información del documento
        $this->agregarCelda('VENTA #' . $venta->numero, ['fontSize' => 12, 'bold' => true, 'color' => '1F2937']);
        $this->currentRow++;
        $this->agregarCelda('Fecha: ' . $venta->fecha, ['fontSize' => 10, 'color' => '6B7280']);
        $this->currentRow += 2;
    }

    /**
     * Crear sección de información del cliente
     */
    private function crearSeccionCliente(Venta $venta): void
    {
        // Título
        $this->agregarCelda('INFORMACIÓN DEL CLIENTE', ['fontSize' => 10, 'bold' => true, 'color' => 'FFFFFF', 'bgColor' => '3B82F6']);
        $this->currentRow++;

        // Datos del cliente
        if ($venta->cliente) {
            $this->agregarCelda('Cliente: ' . $venta->cliente->nombre);
            $this->currentRow++;

            if ($venta->cliente->nit) {
                $this->agregarCelda('NIT: ' . $venta->cliente->nit);
                $this->currentRow++;
            }

            if ($venta->cliente->telefono) {
                $this->agregarCelda('Teléfono: ' . $venta->cliente->telefono);
                $this->currentRow++;
            }

            if ($venta->cliente->email) {
                $this->agregarCelda('Email: ' . $venta->cliente->email);
                $this->currentRow++;
            }
        }

        $this->currentRow += 2;
    }

    /**
     * Crear tabla de detalles de productos
     */
    private function crearTablaDetalles(Venta $venta): void
    {
        // Encabezados de tabla
        $headers = ['Producto', 'Cantidad', 'Precio Unitario', 'Descuento', 'Subtotal'];
        foreach ($headers as $index => $header) {
            $col = chr(65 + $index);
            $cell = $this->sheet->getCell($col . $this->currentRow);
            $cell->setValue($header);
            $style = $cell->getStyle();
            $style->getFont()->setBold(true)->setColor(new Color('FFFFFF'));
            $style->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('3B82F6');
            $style->getAlignment()->setHorizontal('center')->setVertical('center');
        }

        $this->currentRow++;

        // Detalles
        foreach ($venta->detalles as $detalle) {
            $this->sheet->setCellValue('A' . $this->currentRow, $detalle->producto->nombre ?? 'Producto desconocido');
            $this->sheet->setCellValue('B' . $this->currentRow, $detalle->cantidad);
            $this->sheet->setCellValue('C' . $this->currentRow, $detalle->precio_unitario);
            $this->sheet->setCellValue('D' . $this->currentRow, $detalle->descuento);
            $this->sheet->setCellValue('E' . $this->currentRow, $detalle->subtotal);

            // Formato de números
            $this->sheet->getStyle('C' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
            $this->sheet->getStyle('D' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
            $this->sheet->getStyle('E' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');

            $this->currentRow++;
        }

        $this->currentRow += 2;
    }

    /**
     * Crear sección de totales
     */
    private function crearSeccionTotales(Venta $venta): void
    {
        // Línea divisoria
        $this->agregarCelda('', ['borderTop' => true]);
        $this->currentRow += 2;

        // Subtotal
        $this->sheet->setCellValue('C' . $this->currentRow, 'Subtotal:');
        $this->sheet->setCellValue('E' . $this->currentRow, $venta->subtotal);
        $this->sheet->getStyle('C' . $this->currentRow)->getFont()->setBold(true);
        $this->sheet->getStyle('E' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
        $this->currentRow++;

        // Descuento
        if ($venta->descuento > 0) {
            $this->sheet->setCellValue('C' . $this->currentRow, 'Descuento:');
            $this->sheet->setCellValue('E' . $this->currentRow, $venta->descuento);
            $this->sheet->getStyle('E' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
            $this->currentRow++;
        }

        // Impuesto
        if ($venta->impuesto > 0) {
            $this->sheet->setCellValue('C' . $this->currentRow, 'Impuesto:');
            $this->sheet->setCellValue('E' . $this->currentRow, $venta->impuesto);
            $this->sheet->getStyle('E' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
            $this->currentRow++;
        }

        // Total
        $this->currentRow++;
        $this->sheet->setCellValue('C' . $this->currentRow, 'TOTAL:');
        $this->sheet->setCellValue('E' . $this->currentRow, $venta->total);
        $styleC = $this->sheet->getStyle('C' . $this->currentRow);
        $styleC->getFont()->setBold(true)->setSize(12)->setColor(new Color('1F2937'));
        $styleC->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('E5E7EB');
        $styleE = $this->sheet->getStyle('E' . $this->currentRow);
        $styleE->getFont()->setBold(true)->setSize(12);
        $styleE->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('E5E7EB');
        $styleE->getNumberFormat()->setFormatCode('#,##0.00');

        $this->currentRow += 3;
    }

    /**
     * Crear pie con información adicional
     */
    private function crearPie(Venta $venta): void
    {
        if ($venta->observaciones) {
            $this->agregarCelda('OBSERVACIONES:', ['fontSize' => 10, 'bold' => true]);
            $this->currentRow++;
            $this->agregarCelda($venta->observaciones, ['fontSize' => 9, 'wrapText' => true]);
            $this->currentRow += 2;
        }

        // Información de pago
        if ($venta->tipoPago) {
            $this->agregarCelda('Método de Pago: ' . $venta->tipoPago->nombre, ['fontSize' => 9, 'color' => '6B7280']);
            $this->currentRow++;
        }

        // Fecha de generación
        $this->agregarCelda('Documento generado: ' . now()->format('d/m/Y H:i:s'), ['fontSize' => 8, 'color' => '9CA3AF']);
        $this->currentRow++;

        // Usuario
        if ($venta->usuario) {
            $this->agregarCelda('Generado por: ' . $venta->usuario->name, ['fontSize' => 8, 'color' => '9CA3AF']);
        }
    }

    /**
     * Agregar celda con estilos
     */
    private function agregarCelda(string|null $valor, array $estilos = []): void
    {
        $cell = $this->sheet->getCell('A' . $this->currentRow);
        $cell->setValue($valor ?? '');

        if (!empty($estilos)) {
            $style = $cell->getStyle();

            if (isset($estilos['fontSize'])) {
                $style->getFont()->setSize($estilos['fontSize']);
            }

            if (isset($estilos['bold']) && $estilos['bold']) {
                $style->getFont()->setBold(true);
            }

            if (isset($estilos['color'])) {
                $style->getFont()->setColor(new Color($estilos['color']));
            }

            if (isset($estilos['bgColor'])) {
                $fill = $style->getFill();
                $fill->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID);
                $fill->getStartColor()->setARGB($estilos['bgColor']);
            }

            if (isset($estilos['wrapText']) && $estilos['wrapText']) {
                $style->getAlignment()->setWrapText(true);
            }
        }
    }

    /**
     * Exportar compra a Excel
     *
     * @param Compra $compra
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function exportarCompra(Compra $compra)
    {
        Log::info('📊 ExcelExportService::exportarCompra', ['compra_id' => $compra->id]);

        try {
            // Cargar relaciones
            $compra->load([
                'proveedor',
                'moneda',
                'detalles.producto',
                'usuario',
                'estadoDocumento',
                'tipoDocumento',
                'tipoPago'
            ]);

            // Crear encabezado
            $this->crearEncabezadoCompra($compra);

            // Crear sección de proveedor
            $this->crearSeccionProveedor($compra);

            // Crear tabla de detalles
            $this->crearTablaDetallesCompra($compra);

            // Crear sección de totales
            $this->crearSeccionTotales($compra);

            // Crear pie
            $this->crearPie($compra);

            // Aplicar estilos
            $this->aplicarFormato();

            $nombreArchivo = "Compra_{$compra->numero}_" . now()->format('Y-m-d_H-i-s') . '.xlsx';

            return $this->descargarArchivo($this->spreadsheet, $nombreArchivo);
        } catch (\Exception $e) {
            Log::error('❌ Error al exportar compra a Excel', [
                'error' => $e->getMessage(),
                'compra_id' => $compra->id
            ]);
            throw $e;
        }
    }

    /**
     * Exportar pago de crédito a Excel
     *
     * @param Credito $credito
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function exportarPago(Credito $credito)
    {
        Log::info('📊 ExcelExportService::exportarPago', ['credito_id' => $credito->id]);

        try {
            $credito->load(['cliente', 'usuario', 'venta']);

            // Crear encabezado
            $this->crearEncabezadoPago($credito);

            // Información del cliente
            $this->crearSeccionCliente($credito);

            // Detalles del pago
            $this->crearSeccionDetallePago($credito);

            // Totales
            $this->crearSeccionTotalPago($credito);

            // Pie
            $this->crearPie($credito);

            $this->aplicarFormato();

            $nombreArchivo = "Pago_Credito_{$credito->id}_" . now()->format('Y-m-d_H-i-s') . '.xlsx';

            return $this->descargarArchivo($this->spreadsheet, $nombreArchivo);
        } catch (\Exception $e) {
            Log::error('❌ Error al exportar pago a Excel', [
                'error' => $e->getMessage(),
                'credito_id' => $credito->id
            ]);
            throw $e;
        }
    }

    /**
     * Exportar caja a Excel
     *
     * @param Caja $caja
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function exportarCaja(Caja $caja)
    {
        Log::info('📊 ExcelExportService::exportarCaja', ['caja_id' => $caja->id]);

        try {
            $caja->load(['usuario', 'movimientos.usuario']);

            // Crear encabezado
            $this->crearEncabezadoCaja($caja);

            // Información de la caja
            $this->crearSeccionInfoCaja($caja);

            // Movimientos
            $this->crearTablaMovimientos($caja);

            // Resumen
            $this->crearResumenCaja($caja);

            $this->aplicarFormato();

            $nombreArchivo = "Caja_{$caja->numero}_" . now()->format('Y-m-d_H-i-s') . '.xlsx';

            return $this->descargarArchivo($this->spreadsheet, $nombreArchivo);
        } catch (\Exception $e) {
            Log::error('❌ Error al exportar caja a Excel', [
                'error' => $e->getMessage(),
                'caja_id' => $caja->id
            ]);
            throw $e;
        }
    }

    /**
     * Crear encabezado para compra
     */
    private function crearEncabezadoCompra(Compra $compra): void
    {
        if ($this->empresa) {
            $this->agregarCelda($this->empresa->nombre, ['fontSize' => 14, 'bold' => true, 'color' => '1F2937']);
            $this->currentRow++;

            if ($this->empresa->nit) {
                $this->agregarCelda('NIT: ' . $this->empresa->nit, ['fontSize' => 10, 'color' => '6B7280']);
                $this->currentRow++;
            }
        }

        $this->currentRow += 2;
        $this->agregarCelda('COMPRA #' . $compra->numero, ['fontSize' => 12, 'bold' => true, 'color' => '1F2937']);
        $this->currentRow++;
        $this->agregarCelda('Fecha: ' . $compra->fecha, ['fontSize' => 10, 'color' => '6B7280']);
        $this->currentRow += 2;
    }

    /**
     * Crear sección de proveedor
     */
    private function crearSeccionProveedor(Compra $compra): void
    {
        $this->agregarCelda('INFORMACIÓN DEL PROVEEDOR', ['fontSize' => 10, 'bold' => true, 'color' => 'FFFFFF', 'bgColor' => '10B981']);
        $this->currentRow++;

        if ($compra->proveedor) {
            $this->agregarCelda('Proveedor: ' . $compra->proveedor->nombre);
            $this->currentRow++;

            if ($compra->proveedor->nit) {
                $this->agregarCelda('NIT: ' . $compra->proveedor->nit);
                $this->currentRow++;
            }

            if ($compra->proveedor->telefono) {
                $this->agregarCelda('Teléfono: ' . $compra->proveedor->telefono);
                $this->currentRow++;
            }
        }

        $this->currentRow += 2;
    }

    /**
     * Crear tabla de detalles para compra
     */
    private function crearTablaDetallesCompra(Compra $compra): void
    {
        $headers = ['Producto', 'Cantidad', 'Precio Unitario', 'Descuento', 'Subtotal'];
        foreach ($headers as $index => $header) {
            $col = chr(65 + $index);
            $cell = $this->sheet->getCell($col . $this->currentRow);
            $cell->setValue($header);
            $style = $cell->getStyle();
            $style->getFont()->setBold(true)->setColor(new Color('FFFFFF'));
            $style->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('10B981');
            $style->getAlignment()->setHorizontal('center')->setVertical('center');
        }

        $this->currentRow++;

        foreach ($compra->detalles as $detalle) {
            $this->sheet->setCellValue('A' . $this->currentRow, $detalle->producto->nombre ?? 'Producto desconocido');
            $this->sheet->setCellValue('B' . $this->currentRow, $detalle->cantidad);
            $this->sheet->setCellValue('C' . $this->currentRow, $detalle->precio_unitario);
            $this->sheet->setCellValue('D' . $this->currentRow, $detalle->descuento ?? 0);
            $this->sheet->setCellValue('E' . $this->currentRow, $detalle->subtotal);

            $this->sheet->getStyle('C' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
            $this->sheet->getStyle('D' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
            $this->sheet->getStyle('E' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');

            $this->currentRow++;
        }

        $this->currentRow += 2;
    }

    /**
     * Crear encabezado para pago
     */
    private function crearEncabezadoPago(Credito $credito): void
    {
        if ($this->empresa) {
            $this->agregarCelda($this->empresa->nombre, ['fontSize' => 14, 'bold' => true, 'color' => '1F2937']);
            $this->currentRow++;
        }

        $this->currentRow += 2;
        $this->agregarCelda('PAGO DE CRÉDITO', ['fontSize' => 12, 'bold' => true, 'color' => '1F2937']);
        $this->currentRow++;
        $this->agregarCelda('Fecha: ' . $credito->created_at->format('Y-m-d'), ['fontSize' => 10, 'color' => '6B7280']);
        $this->currentRow += 2;
    }

    /**
     * Crear sección de detalle de pago
     */
    private function crearSeccionDetallePago(Credito $credito): void
    {
        $this->agregarCelda('DETALLES DEL PAGO', ['fontSize' => 10, 'bold' => true, 'color' => 'FFFFFF', 'bgColor' => '8B5CF6']);
        $this->currentRow++;

        if ($credito->venta) {
            $this->agregarCelda('Venta Relacionada: #' . $credito->venta->numero);
            $this->currentRow++;
        }

        $this->agregarCelda('Monto Pagado: ' . number_format($credito->monto_pago, 2));
        $this->currentRow++;

        $saldoRestante = max(0, $credito->monto_inicial - $credito->monto_pago);
        $this->agregarCelda('Saldo Restante: ' . number_format($saldoRestante, 2));
        $this->currentRow++;

        $this->agregarCelda('Estado: ' . ($credito->saldado ? 'PAGADO' : 'PENDIENTE'));
        $this->currentRow += 2;
    }

    /**
     * Crear sección de total para pago
     */
    private function crearSeccionTotalPago(Credito $credito): void
    {
        $this->currentRow += 1;
        $this->sheet->setCellValue('C' . $this->currentRow, 'Monto Inicial:');
        $this->sheet->setCellValue('E' . $this->currentRow, $credito->monto_inicial);
        $this->sheet->getStyle('E' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
        $this->currentRow++;

        $this->sheet->setCellValue('C' . $this->currentRow, 'Total Pagado:');
        $this->sheet->setCellValue('E' . $this->currentRow, $credito->monto_pago);
        $this->sheet->getStyle('E' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
        $this->currentRow++;

        $saldoRestante = max(0, $credito->monto_inicial - $credito->monto_pago);
        $this->sheet->setCellValue('C' . $this->currentRow, 'Saldo Pendiente:');
        $this->sheet->setCellValue('E' . $this->currentRow, $saldoRestante);
        $this->sheet->getStyle('C' . $this->currentRow)->getFont()->setBold(true);
        $styleE = $this->sheet->getStyle('E' . $this->currentRow);
        $styleE->getFont()->setBold(true)->setSize(12);
        $styleE->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('E5E7EB');
        $styleE->getNumberFormat()->setFormatCode('#,##0.00');
    }

    /**
     * Crear encabezado para caja
     */
    private function crearEncabezadoCaja(Caja $caja): void
    {
        if ($this->empresa) {
            $this->agregarCelda($this->empresa->nombre, ['fontSize' => 14, 'bold' => true, 'color' => '1F2937']);
            $this->currentRow++;
        }

        $this->currentRow += 2;
        $this->agregarCelda('MOVIMIENTOS DE CAJA #' . $caja->numero, ['fontSize' => 12, 'bold' => true, 'color' => '1F2937']);
        $this->currentRow++;
        $this->agregarCelda('Fecha: ' . $caja->fecha_apertura, ['fontSize' => 10, 'color' => '6B7280']);
        $this->currentRow += 2;
    }

    /**
     * Crear sección de información de caja
     */
    private function crearSeccionInfoCaja(Caja $caja): void
    {
        $this->agregarCelda('INFORMACIÓN DE LA CAJA', ['fontSize' => 10, 'bold' => true, 'color' => 'FFFFFF', 'bgColor' => 'F59E0B']);
        $this->currentRow++;

        if ($caja->usuario) {
            $this->agregarCelda('Responsable: ' . $caja->usuario->name);
            $this->currentRow++;
        }

        $this->agregarCelda('Estado: ' . ($caja->estado === 'abierta' ? 'ABIERTA' : 'CERRADA'));
        $this->currentRow++;

        $this->agregarCelda('Monto Inicial: ' . number_format($caja->monto_inicial, 2));
        $this->currentRow += 2;
    }

    /**
     * Crear tabla de movimientos
     */
    private function crearTablaMovimientos(Caja $caja): void
    {
        $headers = ['Fecha', 'Tipo', 'Descripción', 'Monto'];
        foreach ($headers as $index => $header) {
            $col = chr(65 + $index);
            $cell = $this->sheet->getCell($col . $this->currentRow);
            $cell->setValue($header);
            $style = $cell->getStyle();
            $style->getFont()->setBold(true)->setColor(new Color('FFFFFF'));
            $style->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('F59E0B');
            $style->getAlignment()->setHorizontal('center')->setVertical('center');
        }

        $this->currentRow++;

        if ($caja->movimientos) {
            foreach ($caja->movimientos as $movimiento) {
                $this->sheet->setCellValue('A' . $this->currentRow, $movimiento->created_at->format('Y-m-d H:i'));
                $this->sheet->setCellValue('B' . $this->currentRow, $movimiento->tipo);
                $this->sheet->setCellValue('C' . $this->currentRow, $movimiento->descripcion);
                $this->sheet->setCellValue('D' . $this->currentRow, $movimiento->monto);

                $this->sheet->getStyle('D' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');

                $this->currentRow++;
            }
        }

        $this->currentRow += 2;
    }

    /**
     * Crear resumen de caja
     */
    private function crearResumenCaja(Caja $caja): void
    {
        $this->currentRow += 1;
        $this->agregarCelda('RESUMEN FINAL', ['fontSize' => 10, 'bold' => true]);
        $this->currentRow++;

        $totalMovimientos = $caja->movimientos ? $caja->movimientos->sum('monto') : 0;

        $this->sheet->setCellValue('C' . $this->currentRow, 'Monto Inicial:');
        $this->sheet->setCellValue('E' . $this->currentRow, $caja->monto_inicial);
        $this->sheet->getStyle('E' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
        $this->currentRow++;

        $this->sheet->setCellValue('C' . $this->currentRow, 'Total Movimientos:');
        $this->sheet->setCellValue('E' . $this->currentRow, $totalMovimientos);
        $this->sheet->getStyle('E' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
        $this->currentRow++;

        $montoFinal = $caja->monto_inicial + $totalMovimientos;
        $this->sheet->setCellValue('C' . $this->currentRow, 'Monto Final:');
        $this->sheet->setCellValue('E' . $this->currentRow, $montoFinal);
        $this->sheet->getStyle('C' . $this->currentRow)->getFont()->setBold(true);
        $styleE = $this->sheet->getStyle('E' . $this->currentRow);
        $styleE->getFont()->setBold(true)->setSize(12);
        $styleE->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('E5E7EB');
        $styleE->getNumberFormat()->setFormatCode('#,##0.00');
    }

    /**
     * Exportar stock de producto a Excel
     *
     * @param StockProducto $stock
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function exportarInventario(StockProducto $stock)
    {
        Log::info('📊 ExcelExportService::exportarInventario', ['stock_id' => $stock->id]);

        try {
            // Cargar relaciones
            $stock->load([
                'almacen',
                'producto.categoria',
                'producto.marca'
            ]);

            // Crear encabezado
            $this->crearEncabezadoInventario($stock);

            // Crear sección de información general
            $this->crearSeccionInfoInventario($stock);

            // Crear tabla de detalles de stock
            $this->crearTablaInventario($stock);

            // Crear sección de auditoría
            $this->crearSeccionAuditoriaInventario($stock);

            // Aplicar estilos
            $this->aplicarFormato();

            $nombreArchivo = "Inventario_{$stock->producto->codigo}_" . now()->format('Y-m-d_H-i-s') . '.xlsx';

            return $this->descargarArchivo($this->spreadsheet, $nombreArchivo);
        } catch (\Exception $e) {
            Log::error('❌ Error al exportar inventario a Excel', [
                'error' => $e->getMessage(),
                'stock_id' => $stock->id
            ]);
            throw $e;
        }
    }

    /**
     * Exportar entrega a Excel
     *
     * @param Entrega $entrega
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function exportarEntrega(Entrega $entrega)
    {
        Log::info('📊 ExcelExportService::exportarEntrega', ['entrega_id' => $entrega->id]);

        try {
            // Cargar relaciones
            $entrega->load([
                'ventas.cliente',
                'ventas.detalles.producto',
                'chofer',
                'vehiculo',
                'localidad',
            ]);

            // Crear encabezado
            $this->crearEncabezadoEntrega($entrega);

            // Información general de la entrega
            $this->crearSeccionInfoEntrega($entrega);

            // Lista genérica de productos
            $impresionService = app(ImpresionEntregaService::class);
            $productosGenerico = $impresionService->obtenerProductosAgrupados($entrega);
            $this->crearTablaProductosEntrega($productosGenerico);

            // Detalle por venta
            $this->crearSeccionVentas($entrega);

            // Totales y pie
            $this->crearSeccionTotalesEntrega($entrega, $productosGenerico);

            // Aplicar estilos
            $this->aplicarFormato();

            $nombreArchivo = "Entrega_{$entrega->numero_entrega}_" . now()->format('Y-m-d_H-i-s') . '.xlsx';

            return $this->descargarArchivo($this->spreadsheet, $nombreArchivo);
        } catch (\Exception $e) {
            Log::error('❌ Error al exportar entrega a Excel', [
                'error' => $e->getMessage(),
                'entrega_id' => $entrega->id
            ]);
            throw $e;
        }
    }

    /**
     * Crear encabezado para entrega
     */
    private function crearEncabezadoEntrega(Entrega $entrega): void
    {
        if ($this->empresa) {
            $this->agregarCelda($this->empresa->nombre, ['fontSize' => 14, 'bold' => true, 'color' => '1F2937']);
            $this->currentRow++;

            if ($this->empresa->nit) {
                $this->agregarCelda('NIT: ' . $this->empresa->nit, ['fontSize' => 10, 'color' => '6B7280']);
                $this->currentRow++;
            }
        }

        $this->currentRow += 2;
        $this->agregarCelda('ENTREGA #' . $entrega->numero_entrega, ['fontSize' => 12, 'bold' => true, 'color' => '1F2937']);
        $this->currentRow++;
        $this->agregarCelda('Fecha: ' . $entrega->fecha_asignacion->format('Y-m-d H:i'), ['fontSize' => 10, 'color' => '6B7280']);
        $this->currentRow += 2;
    }

    /**
     * Crear sección de información de entrega
     */
    private function crearSeccionInfoEntrega(Entrega $entrega): void
    {
        $this->agregarCelda('INFORMACIÓN DE LA ENTREGA', ['fontSize' => 10, 'bold' => true, 'color' => 'FFFFFF', 'bgColor' => '8B5CF6']);
        $this->currentRow++;

        // Estado
        $this->agregarCelda('Estado: ' . $entrega->estado);
        $this->currentRow++;

        // Chofer
        if ($entrega->chofer) {
            $this->agregarCelda('Chofer: ' . ($entrega->chofer->name ?? $entrega->chofer->nombre));
            $this->currentRow++;
        }

        // Vehículo
        if ($entrega->vehiculo) {
            $this->agregarCelda('Vehículo: ' . $entrega->vehiculo->placa . ' (' . $entrega->vehiculo->marca . ' ' . $entrega->vehiculo->modelo . ')');
            $this->currentRow++;
        }

        // Peso
        if ($entrega->peso_kg) {
            $this->agregarCelda('Peso Total: ' . number_format($entrega->peso_kg, 2) . ' kg');
            $this->currentRow++;
        }

        // Zona
        if ($entrega->localidad) {
            $this->agregarCelda('Zona: ' . $entrega->localidad->nombre);
            $this->currentRow++;
        }

        // Observaciones
        if ($entrega->observaciones) {
            $this->agregarCelda('Observaciones: ' . $entrega->observaciones, ['wrapText' => true]);
            $this->currentRow++;
        }

        $this->currentRow += 2;
    }

    /**
     * Crear tabla de productos agrupados
     */
    private function crearTablaProductosEntrega($productosGenerico): void
    {
        $this->agregarCelda('LISTA GENÉRICA DE PRODUCTOS (CONSOLIDADO)', ['fontSize' => 10, 'bold' => true, 'color' => 'FFFFFF', 'bgColor' => '8B5CF6']);
        $this->currentRow++;

        // Headers
        $headers = ['Producto', 'Cantidad Total', 'Precio Unit.', 'Cantidad Ventas', 'Subtotal'];
        foreach ($headers as $index => $header) {
            $col = chr(65 + $index);
            $cell = $this->sheet->getCell($col . $this->currentRow);
            $cell->setValue($header);
            $style = $cell->getStyle();
            $style->getFont()->setBold(true)->setColor(new Color('FFFFFF'));
            $style->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('8B5CF6');
            $style->getAlignment()->setHorizontal('center')->setVertical('center');
        }

        $this->currentRow++;

        // Datos
        foreach ($productosGenerico as $producto) {
            $this->sheet->setCellValue('A' . $this->currentRow, $producto['producto_nombre']);
            $this->sheet->setCellValue('B' . $this->currentRow, $producto['cantidad_total']);
            $this->sheet->setCellValue('C' . $this->currentRow, $producto['precio_unitario']);
            $this->sheet->setCellValue('D' . $this->currentRow, $producto['cantidad_ventas']);
            $this->sheet->setCellValue('E' . $this->currentRow, $producto['subtotal_total']);

            // Formatos
            $this->sheet->getStyle('B' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
            $this->sheet->getStyle('C' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
            $this->sheet->getStyle('D' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0');
            $this->sheet->getStyle('E' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');

            $this->currentRow++;
        }

        $this->currentRow += 2;
    }

    /**
     * Crear sección de ventas
     */
    private function crearSeccionVentas(Entrega $entrega): void
    {
        if ($entrega->ventas->isEmpty()) {
            return;
        }

        $this->agregarCelda('DETALLE POR VENTA', ['fontSize' => 10, 'bold' => true, 'color' => 'FFFFFF', 'bgColor' => '8B5CF6']);
        $this->currentRow++;

        foreach ($entrega->ventas as $venta) {
            // Encabezado de venta
            $this->agregarCelda('Venta #' . $venta->numero . ' - Cliente: ' . $venta->cliente->nombre, ['bold' => true, 'bgColor' => 'E9D5FF']);
            $this->currentRow++;

            // Headers para productos de esta venta
            $headers = ['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal'];
            foreach ($headers as $index => $header) {
                $col = chr(65 + $index);
                $cell = $this->sheet->getCell($col . $this->currentRow);
                $cell->setValue($header);
                $style = $cell->getStyle();
                $style->getFont()->setBold(true)->setSize(9);
                $style->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('F3E8FF');
            }

            $this->currentRow++;

            // Detalles de productos
            $totalVenta = 0;
            foreach ($venta->detalles as $detalle) {
                $this->sheet->setCellValue('A' . $this->currentRow, $detalle->producto->nombre);
                $this->sheet->setCellValue('B' . $this->currentRow, $detalle->cantidad);
                $this->sheet->setCellValue('C' . $this->currentRow, $detalle->precio_unitario);
                $this->sheet->setCellValue('D' . $this->currentRow, $detalle->subtotal);

                $this->sheet->getStyle('B' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
                $this->sheet->getStyle('C' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
                $this->sheet->getStyle('D' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');

                $totalVenta += $detalle->subtotal;
                $this->currentRow++;
            }

            // Total de venta
            $this->sheet->setCellValue('C' . $this->currentRow, 'Total:');
            $this->sheet->setCellValue('D' . $this->currentRow, $totalVenta);
            $style = $this->sheet->getStyle('C' . $this->currentRow);
            $style->getFont()->setBold(true);
            $style = $this->sheet->getStyle('D' . $this->currentRow);
            $style->getFont()->setBold(true);
            $style->getNumberFormat()->setFormatCode('#,##0.00');

            $this->currentRow += 2;
        }
    }

    /**
     * Crear sección de totales de entrega
     */
    private function crearSeccionTotalesEntrega(Entrega $entrega, $productosGenerico): void
    {
        $this->currentRow += 1;
        $this->agregarCelda('RESUMEN FINAL', ['fontSize' => 10, 'bold' => true]);
        $this->currentRow += 2;

        $totalCantidad = $productosGenerico->sum('cantidad_total');
        $totalSubtotal = $productosGenerico->sum('subtotal_total');

        $this->sheet->setCellValue('C' . $this->currentRow, 'Total Productos:');
        $this->sheet->setCellValue('E' . $this->currentRow, $productosGenerico->count());
        $this->currentRow++;

        $this->sheet->setCellValue('C' . $this->currentRow, 'Total Cantidad:');
        $this->sheet->setCellValue('E' . $this->currentRow, $totalCantidad);
        $this->sheet->getStyle('E' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0.00');
        $this->currentRow++;

        $this->sheet->setCellValue('C' . $this->currentRow, 'TOTAL ENTREGA:');
        $this->sheet->setCellValue('E' . $this->currentRow, $totalSubtotal);
        $styleC = $this->sheet->getStyle('C' . $this->currentRow);
        $styleC->getFont()->setBold(true)->setSize(12);
        $styleE = $this->sheet->getStyle('E' . $this->currentRow);
        $styleE->getFont()->setBold(true)->setSize(12)->setColor(new Color('8B5CF6'));
        $styleE->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('F3E8FF');
        $styleE->getNumberFormat()->setFormatCode('#,##0.00');

        $this->currentRow += 3;

        // Información de generación
        $this->agregarCelda('Documento generado: ' . now()->format('d/m/Y H:i:s'), ['fontSize' => 8, 'color' => '9CA3AF']);
    }

    /**
     * Crear encabezado para inventario
     */
    private function crearEncabezadoInventario(StockProducto $stock): void
    {
        if ($this->empresa) {
            $this->agregarCelda($this->empresa->nombre, ['fontSize' => 14, 'bold' => true, 'color' => '1F2937']);
            $this->currentRow++;

            if ($this->empresa->nit) {
                $this->agregarCelda('NIT: ' . $this->empresa->nit, ['fontSize' => 10, 'color' => '6B7280']);
                $this->currentRow++;
            }
        }

        $this->currentRow += 2;
        $this->agregarCelda('REPORTE DE INVENTARIO', ['fontSize' => 12, 'bold' => true, 'color' => '1F2937']);
        $this->currentRow++;
        $this->agregarCelda('Fecha de Generación: ' . now()->format('Y-m-d H:i:s'), ['fontSize' => 10, 'color' => '6B7280']);
        $this->currentRow += 2;
    }

    /**
     * Crear sección de información del inventario
     */
    private function crearSeccionInfoInventario(StockProducto $stock): void
    {
        $this->agregarCelda('INFORMACIÓN DEL PRODUCTO', ['fontSize' => 10, 'bold' => true, 'color' => 'FFFFFF', 'bgColor' => '6366F1']);
        $this->currentRow++;

        // Información del producto
        if ($stock->producto) {
            $this->agregarCelda('Código: ' . $stock->producto->codigo);
            $this->currentRow++;

            $this->agregarCelda('Nombre: ' . $stock->producto->nombre);
            $this->currentRow++;

            if ($stock->producto->categoria) {
                $this->agregarCelda('Categoría: ' . $stock->producto->categoria->nombre);
                $this->currentRow++;
            }

            if ($stock->producto->marca) {
                $this->agregarCelda('Marca: ' . $stock->producto->marca->nombre);
                $this->currentRow++;
            }
        }

        // Información del almacén
        if ($stock->almacen) {
            $this->agregarCelda('Almacén: ' . $stock->almacen->nombre);
            $this->currentRow++;
        }

        $this->currentRow += 2;
    }

    /**
     * Crear tabla de inventario
     */
    private function crearTablaInventario(StockProducto $stock): void
    {
        $this->agregarCelda('DETALLES DE STOCK', ['fontSize' => 10, 'bold' => true, 'color' => 'FFFFFF', 'bgColor' => '6366F1']);
        $this->currentRow++;

        // Headers
        $headers = ['Concepto', 'Valor'];
        foreach ($headers as $index => $header) {
            $col = chr(65 + $index);
            $cell = $this->sheet->getCell($col . $this->currentRow);
            $cell->setValue($header);
            $style = $cell->getStyle();
            $style->getFont()->setBold(true)->setColor(new Color('FFFFFF'));
            $style->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('6366F1');
            $style->getAlignment()->setHorizontal('center')->setVertical('center');
        }

        $this->currentRow++;

        // Datos de stock
        $datos = [
            'Stock Actual' => $stock->cantidad ?? 0,
            'Stock Mínimo' => $stock->cantidad_minima ?? 0,
            'Stock Máximo' => $stock->cantidad_maxima ?? 0,
            'Diferencia' => ($stock->cantidad ?? 0) - ($stock->cantidad_minima ?? 0),
        ];

        foreach ($datos as $label => $valor) {
            $this->sheet->setCellValue('A' . $this->currentRow, $label);
            $this->sheet->setCellValue('B' . $this->currentRow, $valor);

            if (is_numeric($valor)) {
                $this->sheet->getStyle('B' . $this->currentRow)->getNumberFormat()->setFormatCode('#,##0');
            }

            $this->currentRow++;
        }

        $this->currentRow += 2;

        // Estado del stock
        $estado = $this->determinarEstadoStock($stock);
        $this->agregarCelda('ESTADO DE STOCK', ['fontSize' => 10, 'bold' => true, 'color' => 'FFFFFF', 'bgColor' => '6366F1']);
        $this->currentRow++;
        $this->agregarCelda($estado, ['fontSize' => 11, 'bold' => true]);
        $this->currentRow += 2;
    }

    /**
     * Determinar estado del stock
     */
    private function determinarEstadoStock(StockProducto $stock): string
    {
        $cantidad = $stock->cantidad ?? 0;
        $minimo = $stock->cantidad_minima ?? 0;
        $maximo = $stock->cantidad_maxima ?? $minimo * 3;

        if ($cantidad <= 0) {
            return '❌ AGOTADO - Sin stock disponible';
        } elseif ($cantidad < $minimo) {
            return '⚡ BAJO - Stock por debajo del mínimo';
        } elseif ($cantidad > $maximo) {
            return '📦 EXCESO - Stock por encima del máximo';
        } else {
            return '✅ ÓPTIMO - Stock en nivel normal';
        }
    }

    /**
     * Crear sección de auditoría
     */
    private function crearSeccionAuditoriaInventario(StockProducto $stock): void
    {
        $this->agregarCelda('INFORMACIÓN DE AUDITORÍA', ['fontSize' => 10, 'bold' => true, 'color' => 'FFFFFF', 'bgColor' => '6366F1']);
        $this->currentRow++;

        if ($stock->created_at) {
            $this->agregarCelda('Fecha de Creación: ' . $stock->created_at->format('Y-m-d H:i:s'));
            $this->currentRow++;
        }

        if ($stock->updated_at) {
            $this->agregarCelda('Última Actualización: ' . $stock->updated_at->format('Y-m-d H:i:s'));
            $this->currentRow++;
        }

        $this->currentRow += 2;
    }

    /**
     * Aplicar formateo general
     */
    private function aplicarFormato(): void
    {
        // Ancho de columnas
        $this->sheet->getColumnDimension('A')->setWidth(25);
        $this->sheet->getColumnDimension('B')->setWidth(12);
        $this->sheet->getColumnDimension('C')->setWidth(15);
        $this->sheet->getColumnDimension('D')->setWidth(12);
        $this->sheet->getColumnDimension('E')->setWidth(12);

        // Altura de filas
        $this->sheet->getDefaultRowDimension()->setRowHeight(18);

        // Márgenes
        $this->sheet->getPageSetup()->setOrientation('portrait');
        $this->sheet->getPageSetup()->setPaperSize(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::PAPERSIZE_LETTER);
    }

    /**
     * Descargar archivo Excel
     */
    private function descargarArchivo(Spreadsheet $spreadsheet, string $nombreArchivo): StreamedResponse
    {
        $writer = new Xlsx($spreadsheet);

        return response()->stream(function () use ($writer) {
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $nombreArchivo . '"',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0'
        ]);
    }

    /**
     * ✅ NUEVO: Exportar cierre de caja a Excel
     *
     * @param array $datosExcel Datos del cierre preparados
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function exportarCierreCaja(array $datosExcel)
    {
        Log::info('📊 ExcelExportService::exportarCierreCaja', [
            'apertura_id' => $datosExcel['apertura']->id ?? null
        ]);

        try {
            $apertura = $datosExcel['apertura'];
            $cierre = $datosExcel['cierre'];
            $datos = $datosExcel['datos'];
            $usuario = $datosExcel['usuario'];

            // Crear encabezado
            if ($this->empresa) {
                $this->agregarCelda($this->empresa->nombre, ['fontSize' => 14, 'bold' => true, 'color' => '1F2937']);
                $this->currentRow++;

                if ($this->empresa->nit) {
                    $this->agregarCelda('NIT: ' . $this->empresa->nit, ['fontSize' => 10, 'color' => '6B7280']);
                    $this->currentRow++;
                }
            }

            // Título
            $this->agregarCelda('CIERRE DE CAJA', ['fontSize' => 12, 'bold' => true, 'color' => '000000']);
            $this->currentRow++;

            $this->agregarCelda('Folio #' . $cierre->id . ' - ' . now()->format('d/m/Y H:i:s'), ['fontSize' => 10, 'color' => '4B5563']);
            $this->currentRow += 2;

            // Información General
            $this->agregarCelda('INFORMACIÓN GENERAL', ['fontSize' => 11, 'bold' => true, 'color' => '1F2937']);
            $this->currentRow++;

            $this->sheet->setCellValue('A' . $this->currentRow, 'Caja:');
            $this->sheet->setCellValue('B' . $this->currentRow, $apertura->caja->nombre ?? 'N/A');
            $this->currentRow++;

            $this->sheet->setCellValue('A' . $this->currentRow, 'Responsable:');
            $this->sheet->setCellValue('B' . $this->currentRow, $usuario->name ?? 'N/A');
            $this->currentRow++;

            $this->sheet->setCellValue('A' . $this->currentRow, 'Apertura:');
            $this->sheet->setCellValue('B' . $this->currentRow, $apertura->fecha->format('d/m/Y H:i'));
            $this->currentRow++;

            $this->sheet->setCellValue('A' . $this->currentRow, 'Cierre:');
            $this->sheet->setCellValue('B' . $this->currentRow, $cierre->created_at->format('d/m/Y H:i'));
            $this->currentRow += 2;

            // Ventas por Tipo de Pago
            if (isset($datos['ventasPorTipoPago']) && count($datos['ventasPorTipoPago']) > 0) {
                $this->agregarCelda('VENTAS POR TIPO DE PAGO', ['fontSize' => 11, 'bold' => true, 'color' => '1F2937']);
                $this->currentRow++;

                $this->sheet->setCellValue('A' . $this->currentRow, 'Tipo de Pago');
                $this->sheet->setCellValue('B' . $this->currentRow, 'Cantidad');
                $this->sheet->setCellValue('C' . $this->currentRow, 'Total');
                $this->currentRow++;

                $totalVentas = 0;
                $totalCantidad = 0;

                foreach ($datos['ventasPorTipoPago'] as $tipo => $resumen) {
                    $this->sheet->setCellValue('A' . $this->currentRow, $tipo);
                    $this->sheet->setCellValue('B' . $this->currentRow, $resumen['cantidad'] ?? 0);
                    $this->sheet->setCellValue('C' . $this->currentRow, $resumen['total'] ?? 0);
                    $totalVentas += $resumen['total'] ?? 0;
                    $totalCantidad += $resumen['cantidad'] ?? 0;
                    $this->currentRow++;
                }

                $this->sheet->setCellValue('A' . $this->currentRow, 'TOTAL VENTAS');
                $this->sheet->setCellValue('B' . $this->currentRow, $totalCantidad);
                $this->sheet->setCellValue('C' . $this->currentRow, $totalVentas);
                $this->currentRow += 2;
            }

            // Resumen Financiero
            $this->agregarCelda('RESUMEN FINANCIERO', ['fontSize' => 11, 'bold' => true, 'color' => '1F2937']);
            $this->currentRow++;

            $this->sheet->setCellValue('A' . $this->currentRow, 'Monto de Apertura:');
            $this->sheet->setCellValue('B' . $this->currentRow, $apertura->monto_apertura ?? 0);
            $this->currentRow++;

            $this->sheet->setCellValue('A' . $this->currentRow, 'Total Ventas:');
            $this->sheet->setCellValue('B' . $this->currentRow, ($datos['sumatorialVentas'] ?? 0) + ($datos['sumatorialVentasCredito'] ?? 0));
            $this->currentRow++;

            $this->sheet->setCellValue('A' . $this->currentRow, 'Efectivo Esperado:');
            $this->sheet->setCellValue('B' . $this->currentRow, $cierre->monto_esperado ?? 0);
            $this->currentRow++;

            $this->sheet->setCellValue('A' . $this->currentRow, 'Efectivo Contado:');
            $this->sheet->setCellValue('B' . $this->currentRow, $cierre->monto_real ?? 0);
            $this->currentRow++;

            $this->sheet->setCellValue('A' . $this->currentRow, 'DIFERENCIA:');
            $this->sheet->setCellValue('B' . $this->currentRow, $cierre->diferencia ?? 0);
            $this->currentRow += 2;

            // Aplicar formatos
            $this->aplicarFormato();

            // Generar nombre del archivo
            $nombreArchivo = "Cierre_Caja_{$apertura->id}_" . now()->format('Y-m-d_H-i-s') . '.xlsx';

            return $this->descargarArchivo($this->spreadsheet, $nombreArchivo);
        } catch (\Exception $e) {
            Log::error('❌ Error al exportar cierre de caja a Excel', [
                'error' => $e->getMessage(),
                'apertura_id' => $datosExcel['apertura']->id ?? null
            ]);
            throw $e;
        }
    }
}
