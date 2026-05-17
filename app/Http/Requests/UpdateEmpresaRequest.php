<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmpresaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'nombre_comercial' => ['required', 'string', 'max:255'],
            'razon_social' => ['required', 'string', 'max:255'],
            'nit' => ['nullable', 'string', 'max:20'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'sitio_web' => ['nullable', 'string', 'max:255'],
            'direccion' => ['nullable', 'string', 'max:500'],
            'ciudad' => ['nullable', 'string', 'max:100'],
            'pais' => ['nullable', 'string', 'max:100'],
            'logo_principal' => ['nullable', 'file', 'image', 'max:4096', 'mimes:jpeg,png,jpg,gif'],
            'logo_compacto' => ['nullable', 'file', 'image', 'max:4096', 'mimes:jpeg,png,jpg,gif'],
            'logo_footer' => ['nullable', 'file', 'image', 'max:4096', 'mimes:jpeg,png,jpg,gif'],
            'mensaje_footer' => ['nullable', 'string', 'max:500'],
            'mensaje_legal' => ['nullable', 'string'],
            'activo' => ['nullable', 'boolean'],
            'es_principal' => ['nullable', 'boolean'],
            'permite_productos_fraccionados' => ['nullable', 'boolean'], // ✨ NUEVO
            'es_farmacia' => ['nullable', 'boolean'], // ✨ NUEVO - Para habilitar campos de medicamentos
        ];
    }

    /**
     * Prepare the data for validation.
     * Convierte valores de FormData a booleanos correctamente.
     */
    protected function prepareForValidation(): void
    {
        // Convertir strings "true"/"false" a boolean
        if ($this->has('activo')) {
            $this->merge([
                'activo' => $this->activo === true || $this->activo === 'true' || $this->activo === '1' || $this->activo === 1,
            ]);
        }

        if ($this->has('es_principal')) {
            $this->merge([
                'es_principal' => $this->es_principal === true || $this->es_principal === 'true' || $this->es_principal === '1' || $this->es_principal === 1,
            ]);
        }

        // ✨ NUEVO: Convertir permite_productos_fraccionados
        if ($this->has('permite_productos_fraccionados')) {
            $this->merge([
                'permite_productos_fraccionados' => $this->permite_productos_fraccionados === true || $this->permite_productos_fraccionados === 'true' || $this->permite_productos_fraccionados === '1' || $this->permite_productos_fraccionados === 1,
            ]);
        }

        // ✨ NUEVO: Convertir es_farmacia
        if ($this->has('es_farmacia')) {
            $this->merge([
                'es_farmacia' => $this->es_farmacia === true || $this->es_farmacia === 'true' || $this->es_farmacia === '1' || $this->es_farmacia === 1,
            ]);
        }
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'nombre_comercial.required' => 'El nombre comercial es obligatorio.',
            'nombre_comercial.max' => 'El nombre comercial no puede exceder 255 caracteres.',
            'razon_social.required' => 'La razón social es obligatoria.',
            'razon_social.max' => 'La razón social no puede exceder 255 caracteres.',
            'nit.max' => 'El NIT no puede exceder 20 caracteres.',
            'telefono.max' => 'El teléfono no puede exceder 20 caracteres.',
            'email.email' => 'El correo electrónico no es válido.',
            'email.max' => 'El correo no puede exceder 255 caracteres.',
            'sitio_web.url' => 'El sitio web debe ser una URL válida.',
            'sitio_web.max' => 'El sitio web no puede exceder 255 caracteres.',
            'direccion.max' => 'La dirección no puede exceder 500 caracteres.',
            'ciudad.max' => 'La ciudad no puede exceder 100 caracteres.',
            'pais.max' => 'El país no puede exceder 100 caracteres.',
            'logo_principal.file' => 'El logo principal debe ser un archivo válido.',
            'logo_principal.image' => 'El logo principal debe ser una imagen válida.',
            'logo_principal.max' => 'El logo principal no puede exceder 4MB.',
            'logo_principal.mimes' => 'El logo principal debe ser JPEG, PNG, JPG o GIF.',
            'logo_compacto.file' => 'El logo compacto debe ser un archivo válido.',
            'logo_compacto.image' => 'El logo compacto debe ser una imagen válida.',
            'logo_compacto.max' => 'El logo compacto no puede exceder 4MB.',
            'logo_compacto.mimes' => 'El logo compacto debe ser JPEG, PNG, JPG o GIF.',
            'logo_footer.file' => 'El logo de footer debe ser un archivo válido.',
            'logo_footer.image' => 'El logo de footer debe ser una imagen válida.',
            'logo_footer.max' => 'El logo de footer no puede exceder 4MB.',
            'logo_footer.mimes' => 'El logo de footer debe ser JPEG, PNG, JPG o GIF.',
            'mensaje_footer.max' => 'El mensaje de footer no puede exceder 500 caracteres.',
            'activo.boolean' => 'El estado activo debe ser verdadero o falso.',
            'es_principal.boolean' => 'El indicador de empresa principal debe ser verdadero o falso.',
            'permite_productos_fraccionados.boolean' => 'La opción de productos fraccionados debe ser verdadera o falsa.', // ✨ NUEVO
            'es_farmacia.boolean' => 'La opción de farmacia debe ser verdadera o falsa.', // ✨ NUEVO
        ];
    }

    /**
     * Custom attribute names for better error messages
     */
    public function attributes(): array
    {
        return [
            'nombre_comercial' => 'nombre comercial',
            'razon_social' => 'razón social',
            'nit' => 'NIT',
            'telefono' => 'teléfono',
            'email' => 'correo electrónico',
            'sitio_web' => 'sitio web',
            'direccion' => 'dirección',
            'ciudad' => 'ciudad',
            'pais' => 'país',
            'logo_principal' => 'logo principal',
            'logo_compacto' => 'logo compacto',
            'logo_footer' => 'logo de footer',
            'mensaje_footer' => 'mensaje de footer',
            'mensaje_legal' => 'mensaje legal',
            'activo' => 'estado activo',
            'es_principal' => 'empresa principal',
            'permite_productos_fraccionados' => 'productos fraccionados', // ✨ NUEVO
            'es_farmacia' => 'farmacia', // ✨ NUEVO
        ];
    }
}
