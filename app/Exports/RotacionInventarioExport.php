<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RotacionInventarioExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
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
            'Categoría',
            'Total Movimientos',
            'Cantidad Total Movida',
            'Promedio por Movimiento',
            'Última Fecha Movimiento',
            'Clasificación Rotación',
        ];
    }

    public function map($row): array
    {
        return [
            $row['codigo'],
            $row['nombre_producto'],
            $row['categoria'],
            $row['total_movimientos'],
            $row['cantidad_total_movida'],
            number_format($row['promedio_por_movimiento'], 2, '.', ''),
            $row['ultima_fecha_movimiento'],
            $row['rotacion_clasificacion'],
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
                    'startColor' => ['rgb' => '0099CC'],
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
            'C' => 20, // Categoría
            'D' => 18, // Total Movimientos
            'E' => 18, // Cantidad Total Movida
            'F' => 18, // Promedio por Movimiento
            'G' => 18, // Última Fecha Movimiento
            'H' => 20, // Clasificación Rotación
        ];
    }
}
