<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarUbicacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'latitud'  => 'required|numeric|between:-90,90',
            'longitud' => 'required|numeric|between:-180,180',
        ];
    }

    public function messages(): array
    {
        return [
            'latitud.required'  => 'La latitud es requerida.',
            'latitud.numeric'   => 'La latitud debe ser numérica.',
            'latitud.between'   => 'La latitud debe estar entre -90 y 90.',
            'longitud.required' => 'La longitud es requerida.',
            'longitud.numeric'  => 'La longitud debe ser numérica.',
            'longitud.between'  => 'La longitud debe estar entre -180 y 180.',
        ];
    }
}
