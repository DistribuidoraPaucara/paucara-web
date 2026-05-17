<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConfirmarEntregaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'receptor_nombre'       => 'required|string|max:255',
            'receptor_documento'    => 'nullable|string|max:20',
            'foto_entrega'          => 'nullable|image|max:2048',
            'observaciones_entrega' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'receptor_nombre.required'    => 'El nombre del receptor es requerido.',
            'receptor_nombre.max'         => 'El nombre del receptor no puede exceder 255 caracteres.',
            'receptor_documento.max'      => 'El documento del receptor no puede exceder 20 caracteres.',
            'foto_entrega.image'          => 'El archivo debe ser una imagen.',
            'foto_entrega.max'            => 'La imagen no puede exceder 2MB.',
            'observaciones_entrega.max'   => 'Las observaciones no pueden exceder 500 caracteres.',
        ];
    }
}
