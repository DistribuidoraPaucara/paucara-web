<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportarCreditosHistoricosRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasRole(['Admin', 'admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'archivo' => ['required', 'file', 'mimes:csv,txt', 'max:5120'], // 5MB max
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'archivo.required' => 'El archivo es requerido',
            'archivo.file' => 'Debe ser un archivo válido',
            'archivo.mimes' => 'Solo se aceptan archivos CSV',
            'archivo.max' => 'El archivo no puede exceder 5MB',
        ];
    }
}
