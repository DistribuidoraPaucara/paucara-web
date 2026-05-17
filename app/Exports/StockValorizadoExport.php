<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StockValorizadoExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
{
    protected Collection $datos;

    public function __construct(Collection $datos)
    {
        $this->datos = $datos;
    }

    public function collection(): Collection
    {
        // Expandir datos de almacenes para incluir productos individuales
        $items = [];
        foreach ($this->datos as $almacen) {
            // Fila del resumen del almacén
            $items[] = [
                'tipo' => 'RESUMEN',
                'almacen' => $almacen['almacen'],
                'codigo_producto' => '',
                'nombre_producto' => 'TOTAL ALMACÉN: ' . $almacen['almacen'],
                'cantidad_total' => $almacen['cantidad_total'],
                'valor_compra_total' => $almacen['valor_compra_total'],
                'valor_venta_total' => $almacen['valor_venta_total'],
                'margen_bruto' => $almacen['margen_bruto'],
                'margen_porcentaje' => $almacen['margen_porcentaje'],
            ];

            // Filas de productos individuales
            if (isset($almacen['productos']) && is_array($almacen['productos'])) {
                foreach ($almacen['productos'] as $producto) {
                    $items[] = [
                        'tipo' => 'PRODUCTO',
                        'almacen' => '',
                        'codigo_producto' => $producto['codigo_producto'],
                        'nombre_producto' => $producto['nombre_producto'],
                        'cantidad_total' => $producto['cantidad'],
                        'valor_compra_total' => $producto['valor_compra'],
                        'valor_venta_total' => $producto['valor_venta'],
                        'margen_bruto' => $producto['valor_venta'] - $producto['valor_compra'],
                        'margen_porcentaje' => $producto['valor_compra'] > 0 ? (($producto['valor_venta'] - $producto['valor_compra']) / $producto['valor_compra'] * 100) : 0,
                    ];
                }
            }
        }

        return collect($items);
    }

    public function headings(): array
    {
        return [
            'Almacén',
            'Código',
            'Nombre Producto',
            'Cantidad',
            'Valor Compra Total',
            'Valor Venta Total',
            'Margen Bruto',
            'Margen %',
        ];
    }

    public function map($row): array
    {
        return [
            $row['almacen'],
            $row['codigo_producto'],
            $row['nombre_producto'],
            $row['cantidad_total'],
            number_format($row['valor_compra_total'], 2, '.', ''),
            number_format($row['valor_venta_total'], 2, '.', ''),
            number_format($row['margen_bruto'], 2, '.', ''),
            number_format($row['margen_porcentaje'], 2, '.', '') . '%',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '339933'],
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 20, // Almacén
            'B' => 15, // Código
            'C' => 35, // Nombre
            'D' => 12, // Cantidad
            'E' => 16, // Valor Compra
            'F' => 16, // Valor Venta
            'G' => 14, // Margen Bruto
            'H' => 10, // Margen %
        ];
    }
}
