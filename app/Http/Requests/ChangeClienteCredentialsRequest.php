<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;
use Illuminate\Support\Facades\Hash;

class ChangeClienteCredentialsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo el usuario autenticado puede cambiar sus propias credenciales
        return $this->user() !== null && $this->user()->esCliente();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $user = $this->user();

        return [
            'usernick'        => [
                'required',
                'string',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password_actual' => [
                'required',
                'string',
            ],
            'password_nueva'  => [
                'required',
                'string',
                'min:8',
            ],
            'email'           => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'usernick.required'        => 'El nombre de usuario es obligatorio.',
            'usernick.string'          => 'El nombre de usuario debe ser texto.',
            'usernick.max'             => 'El nombre de usuario no puede exceder 255 caracteres.',
            'usernick.unique'          => 'El nombre de usuario ya está registrado.',

            'password_actual.required' => 'La contraseña actual es obligatoria.',
            'password_actual.string'   => 'La contraseña actual debe ser texto.',

            'password_nueva.required'  => 'La nueva contraseña es obligatoria.',
            'password_nueva.string'    => 'La nueva contraseña debe ser texto.',
            'password_nueva.min'       => 'La nueva contraseña debe tener al menos 8 caracteres.',

            'email.email'              => 'El correo electrónico debe ser válido.',
            'email.max'                => 'El correo electrónico no puede exceder 255 caracteres.',
            'email.unique'             => 'El correo electrónico ya está registrado.',
        ];
    }

    /**
     * Custom attribute names for better error messages
     */
    public function attributes(): array
    {
        return [
            'usernick'        => 'nombre de usuario',
            'password_actual' => 'contraseña actual',
            'password_nueva'  => 'nueva contraseña',
            'email'           => 'correo electrónico',
        ];
    }

    /**
     * Add custom validation logic after Laravel validation
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $this->validarPasswordActual($validator);
        });
    }

    /**
     * Validar que la contraseña actual sea correcta
     */
    private function validarPasswordActual(Validator $validator): void
    {
        $user = $this->user();
        $passwordActual = $this->input('password_actual');

        if (!Hash::check($passwordActual, $user->password)) {
            $validator->errors()->add('password_actual',
                'La contraseña actual es incorrecta.'
            );
        }
    }
}
