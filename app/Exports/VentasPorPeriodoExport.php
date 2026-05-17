<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class VentasPorPeriodoExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
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
            'Período',
            'Total Ventas',
            'Monto Total',
            'Descuentos Totales',
            'Ticket Promedio',
            'Clientes Únicos',
        ];
    }

    public function map($row): array
    {
        return [
            $row['periodo'],
            $row['total_ventas'],
            number_format($row['monto_total'], 2, '.', ''),
            number_format($row['descuentos_totales'], 2, '.', ''),
            number_format($row['ticket_promedio'], 2, '.', ''),
            $row['clientes_unicos'],
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
            'A' => 20, // Período
            'B' => 15, // Total Ventas
            'C' => 18, // Monto Total
            'D' => 20, // Descuentos Totales
            'E' => 18, // Ticket Promedio
            'F' => 18, // Clientes Únicos
        ];
    }
}
