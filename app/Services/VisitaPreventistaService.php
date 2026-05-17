<?php

namespace App\Services;

use App\Enums\EstadoVisitaPreventista;
use App\Models\VisitaPreventistaCliente;
use App\Models\VentanaEntregaCliente;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class VisitaPreventistaService
{
    /**
     * Registrar una nueva visita
     */
    public function registrarVisita(array $data): VisitaPreventistaCliente
    {
        // Calcular si está dentro de ventana horaria
        $dentroVentana = $this->estaEnVentanaHoraria(
            $data['cliente_id'],
            Carbon::parse($data['fecha_hora_visita'])
        );

        // Guardar foto si existe
        $fotoPath = null;
        if (isset($data['foto_local'])) {
            $fotoPath = $this->guardarFoto($data['foto_local'], $data['cliente_id']);
        }

        return VisitaPreventistaCliente::create([
            'preventista_id' => $data['preventista_id'],
            'cliente_id' => $data['cliente_id'],
            'fecha_hora_visita' => $data['fecha_hora_visita'],
            'tipo_visita' => $data['tipo_visita'],
            'estado_visita' => $data['estado_visita'],
            'motivo_no_atencion' => $data['motivo_no_atencion'] ?? null,
            'latitud' => $data['latitud'],
            'longitud' => $data['longitud'],
            'foto_local' => $fotoPath,
            'observaciones' => $data['observaciones'] ?? null,
            'dentro_ventana_horaria' => $dentroVentana['dentro_ventana'],
            'ventana_entrega_id' => $dentroVentana['ventana_id'],
        ]);
    }

    /**
     * Verificar si la visita está dentro de ventana horaria
     */
    public function estaEnVentanaHoraria(int $clienteId, Carbon $fechaHoraVisita): array
    {
        $diaSemana = $fechaHoraVisita->dayOfWeek; // 0=Domingo, 6=Sábado
        $horaVisita = $fechaHoraVisita->format('H:i');

        $ventana = VentanaEntregaCliente::where('cliente_id', $clienteId)
            ->where('dia_semana', $diaSemana)
            ->where('activo', true)
            ->where('hora_inicio', '<=', $horaVisita)
            ->where('hora_fin', '>=', $horaVisita)
            ->first();

        return [
            'dentro_ventana' => $ventana !== null,
            'ventana_id' => $ventana?->id,
            'advertencia' => $ventana === null ? 'Visita fuera de horario programado' : null,
        ];
    }

    /**
     * Guardar foto de la visita
     */
    private function guardarFoto($foto, int $clienteId): string
    {
        $timestamp = now()->format('YmdHis');
        $filename = "visita_cliente_{$clienteId}_{$timestamp}.jpg";

        return $foto->storeAs('visitas/fotos', $filename, 'public');
    }

    /**
     * Obtener estadísticas de visitas por preventista
     */
    public function obtenerEstadisticasPreventista(int $preventistaId, ?string $fechaInicio = null, ?string $fechaFin = null): array
    {
        $query = VisitaPreventistaCliente::where('preventista_id', $preventistaId);

        if ($fechaInicio && $fechaFin) {
            $query->whereBetween('fecha_hora_visita', [
                Carbon::parse($fechaInicio)->startOfDay(),
                Carbon::parse($fechaFin)->endOfDay()
            ]);
        }

        $total = $query->count();
        $exitosas = $query->clone()->where('estado_visita', EstadoVisitaPreventista::EXITOSA)->count();
        $noAtendidas = $query->clone()->where('estado_visita', EstadoVisitaPreventista::NO_ATENDIDO)->count();
        $fueraHorario = $query->clone()->where('dentro_ventana_horaria', false)->count();

        return [
            'total_visitas' => $total,
            'visitas_exitosas' => $exitosas,
            'visitas_no_atendidas' => $noAtendidas,
            'visitas_fuera_horario' => $fueraHorario,
            'porcentaje_exitosas' => $total > 0 ? round(($exitosas / $total) * 100, 2) : 0,
            'porcentaje_fuera_horario' => $total > 0 ? round(($fueraHorario / $total) * 100, 2) : 0,
        ];
    }

    /**
     * Obtener desglose por tipo de visita
     */
    public function obtenerDesgloseporTipo(int $preventistaId, ?string $fechaInicio = null, ?string $fechaFin = null): array
    {
        $query = VisitaPreventistaCliente::where('preventista_id', $preventistaId);

        if ($fechaInicio && $fechaFin) {
            $query->whereBetween('fecha_hora_visita', [
                Carbon::parse($fechaInicio)->startOfDay(),
                Carbon::parse($fechaFin)->endOfDay()
            ]);
        }

        $desglose = $query->selectRaw('tipo_visita, COUNT(*) as total')
            ->groupBy('tipo_visita')
            ->get()
            ->mapWithKeys(function($item) {
                return [$item->tipo_visita->value => $item->total];
            });

        return $desglose->toArray();
    }
}
