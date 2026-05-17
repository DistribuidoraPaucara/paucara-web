<?php

namespace App\Exports;

use App\Models\Envio;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Export de Entregas Rechazadas o con Problemas
 *
 * Exporta todos los envios que tuvieron problemas en la entrega:
 * - Cliente ausente
 * - Tienda cerrada
 * - Otros problemas
 *
 * Con fotos y motivos de rechazo como evidencia
 */
class EntregasRechazadasExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
{
    protected Collection $envios;

    public function __construct(Collection $envios)
    {
        $this->envios = $envios;
    }

    /**
     * @return Collection
     */
    public function collection(): Collection
    {
        return $this->envios;
    }

    /**
     * Encabezados de las columnas
     */
    public function headings(): array
    {
        return [
            'N° Envío',
            'Venta',
            'Cliente',
            'Chofer',
            'Tipo de Rechazo',
            'Motivo',
            'Fotos',
            'Fecha Intento',
            'Fecha Creación',
            'Observaciones',
        ];
    }

    /**
     * Mapear cada envío rechazado a una fila
     */
    public function map($envio): array
    {
        $tipoRechazo = $this->formatearTipoRechazo($envio->estado_entrega);
        $fotosInfo = count($envio->fotos_rechazo ?? []) . ' foto(s)';

        return [
            $envio->numero_envio,
            $envio->venta->numero ?? '',
            $envio->venta->cliente->nombre ?? '',
            $envio->chofer->name ?? '',
            $tipoRechazo,
            $envio->motivo_rechazo ?? '',
            $fotosInfo,
            $envio->fecha_intento_entrega ? $envio->fecha_intento_entrega->format('d/m/Y H:i') : '',
            $envio->created_at ? $envio->created_at->format('d/m/Y H:i') : '',
            $envio->observaciones ?? '',
        ];
    }

    /**
     * Estilos de la hoja
     */
    public function styles(Worksheet $sheet): array
    {
        return [
            // Estilo para la fila de encabezados
            1 => [
                'font' => [
                    'color' => ['rgb' => 'FFFFFF'],
                    'bold' => true,
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'C0504D'], // Rojo oscuro para rechazo
                ],
            ],
        ];
    }

    /**
     * Anchos de columna
     */
    public function columnWidths(): array
    {
        return [
            'A' => 18,  // N° Envío
            'B' => 15,  // Venta
            'C' => 30,  // Cliente
            'D' => 25,  // Chofer
            'E' => 20,  // Tipo de Rechazo
            'F' => 40,  // Motivo
            'G' => 12,  // Fotos
            'H' => 18,  // Fecha Intento
            'I' => 18,  // Fecha Creación
            'J' => 35,  // Observaciones
        ];
    }

    /**
     * Formatear tipo de rechazo con emoji
     */
    private function formatearTipoRechazo(?string $estado): string
    {
        $tipos = [
            Envio::ESTADO_ENTREGA_CLIENTE_AUSENTE => '🚷 Cliente Ausente',
            Envio::ESTADO_ENTREGA_TIENDA_CERRADA => '🔒 Tienda Cerrada',
            Envio::ESTADO_ENTREGA_PROBLEMA => '⚠️ Otro Problema',
            Envio::ESTADO_ENTREGA_RECHAZADA => '❌ Rechazada',
        ];

        return $tipos[$estado] ?? $estado ?? 'No especificado';
    }
}
