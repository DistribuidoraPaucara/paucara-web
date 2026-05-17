<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class VentasPorClienteProductoExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
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
            'Cliente',
            'Producto',
            'Total Ventas',
            'Cantidad Total',
            'Monto Total',
            'Última Venta',
        ];
    }

    public function map($row): array
    {
        return [
            $row['cliente_nombre'],
            $row['producto_nombre'],
            $row['total_ventas'],
            number_format($row['cantidad_total'], 2, '.', ''),
            number_format($row['monto_total'], 2, '.', ''),
            $row['ultima_venta'],
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
            'A' => 30, // Cliente
            'B' => 30, // Producto
            'C' => 15, // Total Ventas
            'D' => 18, // Cantidad Total
            'E' => 18, // Monto Total
            'F' => 20, // Última Venta
        ];
    }
}
