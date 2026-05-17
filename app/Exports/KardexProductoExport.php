<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class KardexProductoExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
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
            'Tipo Movimiento',
            'Cantidad',
            'Motivo',
            'Usuario',
            'Referencia',
            'Observaciones',
        ];
    }

    public function map($row): array
    {
        return [
            $row['fecha'],
            $row['almacen'],
            $row['tipo_movimiento'],
            $row['cantidad'],
            $row['motivo'],
            $row['usuario'],
            $row['referencia'],
            $row['observaciones'],
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
                    'startColor' => ['rgb' => '6600CC'],
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
            'C' => 18, // Tipo Movimiento
            'D' => 12, // Cantidad
            'E' => 25, // Motivo
            'F' => 20, // Usuario
            'G' => 20, // Referencia
            'H' => 35, // Observaciones
        ];
    }
}
