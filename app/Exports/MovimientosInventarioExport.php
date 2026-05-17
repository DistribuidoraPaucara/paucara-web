<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MovimientosInventarioExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
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
            'Fecha',
            'Almacén',
            'Código Producto',
            'Nombre Producto',
            'Tipo Movimiento',
            'Cantidad',
            'Motivo',
            'Usuario',
            'Referencia',
        ];
    }

    public function map($row): array
    {
        return [
            $row['fecha'],
            $row['almacen'],
            $row['codigo_producto'],
            $row['nombre_producto'],
            $row['tipo_movimiento'],
            $row['cantidad'],
            $row['motivo'],
            $row['usuario'],
            $row['referencia'],
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
                    'startColor' => ['rgb' => '00A651'],
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
            'A' => 18, // Fecha
            'B' => 20, // Almacén
            'C' => 15, // Código
            'D' => 35, // Nombre
            'E' => 18, // Tipo Movimiento
            'F' => 12, // Cantidad
            'G' => 25, // Motivo
            'H' => 20, // Usuario
            'I' => 20, // Referencia
        ];
    }
}
