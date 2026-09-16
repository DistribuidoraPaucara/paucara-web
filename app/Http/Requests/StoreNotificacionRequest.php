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
            // ✅ ACTUALIZADO: Soportar múltiples horarios
            "hora_envio" => "nullable|date_format:H:i", // Para retrocompatibilidad
            "horarios" => "required|array|min:1",
            "horarios.*.hora" => "required|date_format:H:i",
            "horarios.*.activo" => "nullable|boolean",
            "fecha_inicio" => "required|date",
            "fecha_fin" => "nullable|date|after:fecha_inicio",
            "dias_semana" => "nullable|array",
            "dias_semana.*" => "string",
            "dia_mes" => "nullable|integer|min:1|max:31",
            "activo" => "boolean",
            // ✅ Validación de roles
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
            "fecha_inicio.required" => "La fecha de inicio es requerida",
            // ✅ NUEVO: Mensajes para múltiples horarios
            "horarios.required" => "Debe agregar al menos un horario",
            "horarios.array" => "Los horarios deben ser un array",
            "horarios.min" => "Debe agregar al menos un horario",
            "horarios.*.hora.required" => "Cada horario debe tener una hora",
            "horarios.*.hora.date_format" => "Cada hora debe estar en formato HH:mm (ej: 08:00)",
            "horarios.*.activo.boolean" => "El estado activo debe ser verdadero o falso",
            // ✅ Mensajes de validación de roles
            "roles.array" => "Los roles deben ser un array",
            "roles.*.integer" => "Cada rol debe ser un número válido",
            "roles.*.exists" => "Uno o más roles seleccionados no existen",
        ];
    }
}
