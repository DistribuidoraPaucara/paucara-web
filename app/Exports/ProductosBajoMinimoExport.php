<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProductosBajoMinimoExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
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
            'Código',
            'Nombre Producto',
            'Almacén',
            'Stock Actual',
            'Stock Mínimo',
            'Falta',
            'Precio Compra',
            'Precio Venta',
            'Categoría',
        ];
    }

    public function map($row): array
    {
        return [
            $row['codigo'],
            $row['nombre_producto'],
            $row['almacen'],
            $row['stock_actual'],
            $row['stock_minimo'],
            $row['falta'],
            number_format($row['precio_compra'], 2, '.', ''),
            number_format($row['precio_venta'], 2, '.', ''),
            $row['categoria'],
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
                    'startColor' => ['rgb' => 'FF9900'],
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
            'A' => 15, // Código
            'B' => 35, // Nombre
            'C' => 20, // Almacén
            'D' => 14, // Stock Actual
            'E' => 14, // Stock Mínimo
            'F' => 10, // Falta
            'G' => 14, // Precio Compra
            'H' => 14, // Precio Venta
            'I' => 20, // Categoría
        ];
    }
}
