<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProductosSinMovimientoExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
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
            'Categoría',
            'Cantidad Stock',
            'Precio Compra',
            'Precio Venta',
            'Valor Inmobilizado',
            'Días Sin Movimiento',
            'Última Actualización',
        ];
    }

    public function map($row): array
    {
        return [
            $row['codigo'],
            $row['nombre_producto'],
            $row['almacen'],
            $row['categoria'],
            $row['cantidad_stock'],
            number_format($row['precio_compra'], 2, '.', ''),
            number_format($row['precio_venta'], 2, '.', ''),
            number_format($row['valor_inmobilizado'], 2, '.', ''),
            $row['dias_sin_movimiento'],
            $row['fecha_ultimo_movimiento'],
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
                    'startColor' => ['rgb' => 'CC6600'],
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
            'D' => 20, // Categoría
            'E' => 14, // Cantidad Stock
            'F' => 14, // Precio Compra
            'G' => 14, // Precio Venta
            'H' => 16, // Valor Inmobilizado
            'I' => 18, // Días Sin Movimiento
            'J' => 18, // Última Actualización
        ];
    }
}
