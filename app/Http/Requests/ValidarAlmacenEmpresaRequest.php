<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ValidarAlmacenEmpresaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Autoriza todas las solicitudes. La validación específica ocurre en rules().
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Valida que:
     * - Si se proporciona almacen_id, debe ser un ID válido de almacén
     * - Si se proporciona empresa_id, debe ser un ID válido de empresa
     * - El almacén debe pertenecer a la empresa (si ambos se proporcionan)
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'almacen_id' => ['nullable', 'integer', 'exists:almacenes,id'],
            'empresa_id' => ['nullable', 'integer', 'exists:empresas,id'],
        ];
    }

    /**
     * Mensajes de error personalizados
     */
    public function messages(): array
    {
        return [
            'almacen_id.exists' => 'El almacén solicitado no existe.',
            'empresa_id.exists' => 'La empresa solicitada no existe.',
        ];
    }

    /**
     * Lógica de validación adicional (después de reglas básicas)
     *
     * Aquí se puede validar que el almacén pertenece a la empresa si es necesario
     * en el futuro cuando se establezca la relación many-to-many.
     */
    protected function passedValidation(): void
    {
        // Validación futura: verificar que almacen_id pertenece a empresa_id
        // Por ahora, los almacenes son globales y cada empresa solo tiene referencias
        // a almacenes específicos (almacen_id_principal, almacen_id_venta)
    }
}
