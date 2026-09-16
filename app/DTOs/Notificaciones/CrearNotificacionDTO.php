<?php
namespace App\DTOs\Notificaciones;

use App\DTOs\BaseDTO;
use Illuminate\Http\Request;

class CrearNotificacionDTO extends BaseDTO
{
    public function __construct(
        public string $titulo,
        public string $descripcion,
        public string $tipo,
        public string $frecuencia,
        public ?string $hora_envio = null, // ⚠️ DEPRECADO: mantener para retrocompatibilidad
        public string $fecha_inicio = '',
        public ?string $fecha_fin = null,
        public ?array $dias_semana = null,
        public ?int $dia_mes = null,
        public bool $activo = true,
        public ?int $usuario_id = null,
        // ✅ NUEVO: Array de horarios múltiples
        public array $horarios = [], // [{hora: "08:00", activo: true}, {hora: "14:00", activo: true}]
        // ✅ NUEVO: URL de imagen dinámico
        public ?string $imagen_url = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $usuarioAutenticado = \Illuminate\Support\Facades\Auth::user();
        $usuarioId = $usuarioAutenticado?->id;

        // ✅ Procesar múltiples horarios desde el request
        $horarios = [];
        $horaEnvioDefault = '09:00';

        if ($request->has('horarios') && is_array($request->input('horarios'))) {
            $horarios = array_map(function ($h) {
                return [
                    'hora' => $h['hora'] ?? $h,
                    'activo' => $h['activo'] ?? true,
                ];
            }, $request->input('horarios'));

            // ✅ NUEVO: Usar el primer horario como hora_envio (para retrocompatibilidad con BD)
            if (!empty($horarios)) {
                $horaEnvioDefault = $horarios[0]['hora'];
            }
        } elseif ($request->has('hora_envio') && !empty($request->input('hora_envio'))) {
            // Retrocompatibilidad: si viene hora_envio (una sola), convertir a array
            $horaEnvioDefault = $request->input('hora_envio');
            $horarios = [
                [
                    'hora' => $horaEnvioDefault,
                    'activo' => true,
                ]
            ];
        }

        return new self(
            titulo: (string) $request->input('titulo'),
            descripcion: (string) $request->input('descripcion'),
            tipo: (string) $request->input('tipo', 'informativo'),
            frecuencia: (string) $request->input('frecuencia', 'una_vez'),
            hora_envio: $horaEnvioDefault,
            fecha_inicio: (string) $request->input('fecha_inicio', today()->toDateString()),
            fecha_fin: $request->input('fecha_fin'),
            dias_semana: $request->input('dias_semana'),
            dia_mes: $request->input('dia_mes') ? (int) $request->input('dia_mes') : null,
            activo: (bool) $request->input('activo', true),
            usuario_id: $usuarioId,
            horarios: $horarios,
            imagen_url: $request->input('imagen_url'), // ✅ NUEVO: Pasar imagen_url
        );
    }

    public function validar(): void
    {
        if (empty($this->titulo)) {
            throw new \Exception('El título es requerido');
        }

        if (empty($this->descripcion)) {
            throw new \Exception('La descripción es requerida');
        }

        if (!in_array($this->tipo, ['promocion', 'evento', 'informativo', 'oferta'])) {
            throw new \Exception('Tipo de notificación inválido');
        }

        if (!in_array($this->frecuencia, ['una_vez', 'diario', 'semanal', 'mensual'])) {
            throw new \Exception('Frecuencia inválida');
        }

        // ✅ NUEVO: Validar múltiples horarios
        if (empty($this->horarios)) {
            throw new \Exception('Debe agregar al menos un horario');
        }

        foreach ($this->horarios as $horario) {
            if (!isset($horario['hora']) || !preg_match('/^\d{2}:\d{2}$/', $horario['hora'])) {
                throw new \Exception('Cada horario debe estar en formato HH:mm');
            }
        }

        // Retrocompatibilidad: si viene hora_envio, validar
        if ($this->hora_envio && !preg_match('/^\d{2}:\d{2}$/', $this->hora_envio)) {
            throw new \Exception('Hora debe ser en formato HH:mm');
        }

        if ($this->frecuencia === 'semanal' && empty($this->dias_semana)) {
            throw new \Exception('Debe seleccionar al menos un día para frecuencia semanal');
        }

        if ($this->frecuencia === 'mensual' && ($this->dia_mes < 1 || $this->dia_mes > 31)) {
            throw new \Exception('Día del mes debe estar entre 1 y 31');
        }
    }
}
