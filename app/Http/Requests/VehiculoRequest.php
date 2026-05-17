<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VehiculoRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Permisos serán manejados por middleware en las rutas
        return true;
    }

    public function rules(): array
    {
        return [
            'placa'              => ['required', 'string', 'max:50'],
            'marca'              => ['nullable', 'string', 'max:100'],
            'modelo'             => ['nullable', 'string', 'max:100'],
            'anho'               => ['nullable', 'integer'],
            'capacidad_kg'       => ['nullable', 'numeric'],
            'capacidad_volumen'  => ['nullable', 'numeric'],
            'estado'             => ['nullable', 'string', 'max:50'],
            'activo'             => ['boolean'],
            'chofer_asignado_id' => ['nullable', 'exists:users,id'],
            'observaciones'      => ['nullable', 'string', 'max:2000'],
        ];
    }
}
