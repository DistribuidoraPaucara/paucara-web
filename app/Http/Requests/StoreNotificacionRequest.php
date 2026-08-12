<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNotificacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can("notificaciones.create") || 
               $this->user()->can("notificaciones.update");
    }

    public function rules(): array
    {
        return [
            "titulo" => "required|string|max:255",
            "descripcion" => "required|string",
            "tipo" => "required|in:promocion,evento,informativo,oferta",
            "frecuencia" => "required|in:una_vez,diario,semanal,mensual",
            "hora_envio" => "required|date_format:H:i",
            "fecha_inicio" => "required|date",
            "fecha_fin" => "nullable|date|after:fecha_inicio",
            "dias_semana" => "nullable|array",
            "dias_semana.*" => "string",
            "dia_mes" => "nullable|integer|min:1|max:31",
            "activo" => "boolean",
            // ✅ NUEVO: Validación de roles
            "roles" => "nullable|array",
            "roles.*" => "integer|exists:roles,id",
        ];
    }

    public function messages(): array
    {
        return [
            "titulo.required" => "El título es requerido",
            "descripcion.required" => "La descripción es requerida",
            "tipo.required" => "El tipo de notificación es requerido",
            "frecuencia.required" => "La frecuencia es requerida",
            "hora_envio.required" => "La hora de envío es requerida",
            "fecha_inicio.required" => "La fecha de inicio es requerida",
            // ✅ NUEVO: Mensajes de validación de roles
            "roles.array" => "Los roles deben ser un array",
            "roles.*.integer" => "Cada rol debe ser un número válido",
            "roles.*.exists" => "Uno o más roles seleccionados no existen",
        ];
    }
}
