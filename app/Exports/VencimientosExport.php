<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class VencimientosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
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
            'Cantidad',
            'Fecha Vencimiento',
            'Días para Vencer',
            'Estado',
            'Precio Compra',
            'Valor Total',
        ];
    }

    public function map($row): array
    {
        return [
            $row['codigo'],
            $row['nombre_producto'],
            $row['almacen'],
            $row['categoria'],
            $row['cantidad'],
            $row['fecha_vencimiento'],
            $row['dias_para_vencer'],
            $row['estado'],
            number_format($row['precio_compra'], 2, '.', ''),
            number_format($row['valor_total'], 2, '.', ''),
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
                    'startColor' => ['rgb' => 'CC0000'],
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
            'E' => 12, // Cantidad
            'F' => 16, // Fecha Vencimiento
            'G' => 15, // Días para Vencer
            'H' => 18, // Estado
            'I' => 14, // Precio Compra
            'J' => 14, // Valor Total
        ];
    }
}
