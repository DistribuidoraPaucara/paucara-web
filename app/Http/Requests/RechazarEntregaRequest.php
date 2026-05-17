<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class RechazarEntregaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: Implementar autorización con permisos
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'tipo_rechazo'     => 'required|in:cliente_ausente,tienda_cerrada,otro_problema',
            'motivo_detallado' => 'nullable|string|max:500',
            'fotos'            => 'nullable|array|max:5',
            'fotos.*'          => 'image|max:5120', // 5MB each photo
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'tipo_rechazo.required'        => 'El tipo de rechazo es obligatorio.',
            'tipo_rechazo.in'              => 'El tipo de rechazo debe ser "cliente_ausente", "tienda_cerrada" u "otro_problema".',

            'motivo_detallado.string'      => 'El motivo detallado debe ser texto.',
            'motivo_detallado.max'         => 'El motivo detallado no puede exceder 500 caracteres.',

            'fotos.array'                  => 'Las fotos deben ser un arreglo.',
            'fotos.max'                    => 'No puede subir más de 5 fotos.',
            'fotos.*.image'                => 'Cada archivo debe ser una imagen válida.',
            'fotos.*.max'                  => 'Cada foto no puede exceder 5MB.',
        ];
    }

    /**
     * Custom attribute names for better error messages
     */
    public function attributes(): array
    {
        return [
            'tipo_rechazo'     => 'tipo de rechazo',
            'motivo_detallado' => 'motivo detallado',
            'fotos'            => 'fotos',
        ];
    }

    /**
     * Add custom validation logic after Laravel validation
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $this->validarEnvioPuedeRechazarse($validator);
            $this->validarMotivoRequerido($validator);
        });
    }

    /**
     * Validar que el envío pueda ser rechazado
     */
    private function validarEnvioPuedeRechazarse(Validator $validator): void
    {
        $envio = $this->route('envio');

        if (!$envio || !$envio->puedeRechazarEntrega()) {
            $validator->errors()->add('envio',
                'Este envío no puede rechazarse en su estado actual: ' . ($envio->estado ?? 'desconocido')
            );
        }
    }

    /**
     * Validar que motivo detallado sea requerido cuando tipo_rechazo es "otro_problema"
     */
    private function validarMotivoRequerido(Validator $validator): void
    {
        $tipoRechazo = $this->input('tipo_rechazo');
        $motivoDetallado = $this->input('motivo_detallado');

        if ($tipoRechazo === 'otro_problema' && empty($motivoDetallado)) {
            $validator->errors()->add('motivo_detallado',
                'El motivo detallado es obligatorio cuando el tipo de rechazo es "otro_problema".'
            );
        }
    }
}
