<?php

namespace App\Http\Requests;

use App\Enums\TipoVisitaPreventista;
use App\Enums\EstadoVisitaPreventista;
use App\Enums\MotivoNoAtencionVisita;
use App\Models\Cliente;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreVisitaPreventistaRequest extends FormRequest
{
    public function authorize(): bool
    {
        // ✅ ACTUALIZADO (2026-05-08): Cualquier preventista puede registrar visitas a cualquier cliente
        // Solo se valida que el usuario esté autenticado y tenga un empleado asociado
        $empleado = auth()->user()->empleado;
        return (bool) $empleado;
    }

    public function rules(): array
    {
        return [
            'cliente_id' => 'required|exists:clientes,id',
            'fecha_hora_visita' => 'required|date',
            'tipo_visita' => ['required', new Enum(TipoVisitaPreventista::class)],
            'estado_visita' => ['required', new Enum(EstadoVisitaPreventista::class)],
            'motivo_no_atencion' => [
                'required_if:estado_visita,NO_ATENDIDO',
                new Enum(MotivoNoAtencionVisita::class)
            ],
            'latitud' => 'required|numeric|between:-90,90',
            'longitud' => 'required|numeric|between:-180,180',
            'foto_local' => 'nullable|image|mimes:jpeg,jpg,png|max:5120',
            'observaciones' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'cliente_id.required' => 'El cliente es obligatorio.',
            'cliente_id.exists' => 'El cliente seleccionado no existe.',
            'fecha_hora_visita.required' => 'La fecha y hora de visita es obligatoria.',
            'fecha_hora_visita.date' => 'Formato de fecha inválido.',
            'tipo_visita.required' => 'El tipo de visita es obligatorio.',
            'estado_visita.required' => 'El estado de la visita es obligatorio.',
            'motivo_no_atencion.required_if' => 'El motivo de no atención es obligatorio cuando la visita no fue atendida.',
            'latitud.required' => 'La ubicación GPS es obligatoria.',
            'latitud.numeric' => 'La latitud debe ser un número válido.',
            'latitud.between' => 'La latitud debe estar entre -90 y 90.',
            'longitud.required' => 'La ubicación GPS es obligatoria.',
            'longitud.numeric' => 'La longitud debe ser un número válido.',
            'longitud.between' => 'La longitud debe estar entre -180 y 180.',
            'foto_local.image' => 'La foto debe ser una imagen válida.',
            'foto_local.mimes' => 'La foto debe ser JPG, JPEG o PNG.',
            'foto_local.max' => 'La foto no puede exceder 5MB.',
            'observaciones.max' => 'Las observaciones no pueden exceder 1000 caracteres.',
        ];
    }
}
