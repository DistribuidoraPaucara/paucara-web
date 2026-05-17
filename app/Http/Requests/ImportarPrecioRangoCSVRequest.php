<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportarPrecioRangoCSVRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'archivo' => 'required|file|mimes:csv,txt',
            'producto_id' => 'nullable|integer|exists:productos,id',
            'sobreescribir' => 'sometimes|boolean',
            'correcciones' => 'nullable|string',
            'filas_eliminadas' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'archivo.required' => 'El archivo CSV es requerido',
            'archivo.file' => 'Debe ser un archivo válido',
            'archivo.mimes' => 'El archivo debe ser CSV',
            'producto_id.exists' => 'El producto no existe',
        ];
    }
}
