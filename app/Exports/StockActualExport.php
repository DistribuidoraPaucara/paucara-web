<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StockActualExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
{
    protected Collection $datos;

    public function __construct(Collection $datos)
    {
        $this->datos = $datos;
    }

    public function collection(): Collection
    {
        return $this->datos;
    }

    public function headings(): array
    {
        return [
            'Almacén',
            'Código Producto',
            'Nombre Producto',
            'Cantidad',
            'Precio Compra',
            'Precio Venta',
            'Valor Compra Total',
            'Valor Venta Total',
            'Stock Mínimo',
            'Fecha Actualización',
        ];
    }

    public function map($row): array
    {
        return [
            $row['almacen'],
            $row['codigo_producto'],
            $row['nombre_producto'],
            $row['cantidad'],
            number_format($row['precio_compra'], 2, '.', ''),
            number_format($row['precio_venta'], 2, '.', ''),
            number_format($row['valor_compra'], 2, '.', ''),
            number_format($row['valor_venta'], 2, '.', ''),
            $row['stock_minimo'],
            $row['fecha_actualizacion'],
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
                    'startColor' => ['rgb' => '0066CC'],
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
            'E' => 14, // Precio Compra
            'F' => 14, // Precio Venta
            'G' => 16, // Valor Compra
            'H' => 16, // Valor Venta
            'I' => 14, // Stock Mínimo
            'J' => 16, // Fecha Actualización
        ];
    }
}
