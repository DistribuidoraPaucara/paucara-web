<?php

namespace App\Exports;

use App\Models\VisitaPreventistaCliente;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class VisitasExport implements FromQuery, WithHeadings, WithMapping, WithStyles
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = VisitaPreventistaCliente::with(['preventista.user', 'cliente'])
            ->orderBy('fecha_hora_visita', 'desc');

        // Aplicar filtros
        if (!empty($this->filters['preventista_id'])) {
            $query->where('preventista_id', $this->filters['preventista_id']);
        }

        if (!empty($this->filters['fecha_inicio']) && !empty($this->filters['fecha_fin'])) {
            $query->whereBetween('fecha_hora_visita', [
                Carbon::parse($this->filters['fecha_inicio'])->startOfDay(),
                Carbon::parse($this->filters['fecha_fin'])->endOfDay(),
            ]);
        }

        if (!empty($this->filters['estado_visita'])) {
            $query->where('estado_visita', $this->filters['estado_visita']);
        }

        if (!empty($this->filters['tipo_visita'])) {
            $query->where('tipo_visita', $this->filters['tipo_visita']);
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Fecha y Hora',
            'Preventista',
            'Cliente',
            'Tipo de Visita',
            'Estado',
            'Motivo No Atención',
            'Dentro de Horario',
            'Latitud',
            'Longitud',
            'Observaciones',
        ];
    }

    public function map($visita): array
    {
        return [
            $visita->id,
            $visita->fecha_hora_visita->format('d/m/Y H:i'),
            $visita->preventista->user->name ?? 'N/A',
            $visita->cliente->nombre ?? 'N/A',
            $visita->tipo_visita->label(),
            $visita->estado_visita->label(),
            $visita->motivo_no_atencion?->label() ?? '-',
            $visita->dentro_ventana_horaria ? 'Sí' : 'No',
            $visita->latitud,
            $visita->longitud,
            $visita->observaciones ?? '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
