<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateClienteRequest extends FormRequest
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
     * Prepare the data for validation
     */
    protected function prepareForValidation(): void
    {
        // Convertir valores booleanos para API
        if ($this->isApiRequest()) {
            $data = [];
            if ($this->has('activo')) {
                $data['activo'] = $this->convertToBoolean($this->input('activo'));
            }
            if ($this->has('crear_usuario')) {
                $data['crear_usuario'] = $this->convertToBoolean($this->input('crear_usuario'));
            }
            if ($this->has('puede_tener_credito')) {
                $data['puede_tener_credito'] = $this->convertToBoolean($this->input('puede_tener_credito'));
            }

            // Convertir booleanos en direcciones
            if ($this->has('direcciones') && is_array($this->direcciones)) {
                $direcciones = $this->direcciones;
                foreach ($direcciones as &$direccion) {
                    if (isset($direccion['es_principal'])) {
                        $direccion['es_principal'] = $this->convertToBoolean($direccion['es_principal']);
                    }
                    if (isset($direccion['activa'])) {
                        $direccion['activa'] = $this->convertToBoolean($direccion['activa']);
                    }
                }
                $data['direcciones'] = $direcciones;
            }

            // Convertir booleanos en ventanas de entrega
            if ($this->has('ventanas_entrega') && is_array($this->ventanas_entrega)) {
                $ventanas = $this->ventanas_entrega;
                foreach ($ventanas as &$ventana) {
                    if (isset($ventana['activo'])) {
                        $ventana['activo'] = $this->convertToBoolean($ventana['activo']);
                    }
                }
                $data['ventanas_entrega'] = $ventanas;
            }

            if (!empty($data)) {
                $this->merge($data);
            }
        }

        // Filtrar direcciones vacías o incompletas
        if ($this->has('direcciones') && is_array($this->direcciones)) {
            $filtered = array_filter($this->direcciones, function ($direccion) {
                return !empty($direccion['direccion']) ||
                       !empty($direccion['latitud']) ||
                       !empty($direccion['longitud']);
            });

            $filtered = array_values($filtered); // Reindex

            $this->merge(['direcciones' => empty($filtered) ? null : $filtered]);
        }
    }

    /**
     * Helper method to convert value to boolean
     */
    private function convertToBoolean($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }
        if (is_string($value)) {
            return in_array(strtolower($value), ['true', '1', 'yes', 'on']);
        }
        return (bool) $value;
    }

    /**
     * Check if this is an API request
     */
    private function isApiRequest(): bool
    {
        return $this->is('api/*') || $this->expectsJson();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $cliente = $this->route('cliente');

        return [
            // Campos básicos
            'codigo_cliente'                 => 'nullable|string|max:50',
            'crear_usuario'                  => 'nullable|boolean',
            'password'                       => 'nullable|string|min:8',
            'password_confirmation'          => 'required_with:password|same:password',
            'nombre'                         => 'sometimes|required|string|max:255',
            'razon_social'                   => 'nullable|string|max:255',
            'nit'                            => 'nullable|string|max:50',
            'email'                          => 'nullable|email|max:255',
            'telefono'                       => 'nullable|string|max:20',
            'limite_credito'                 => 'nullable|numeric|min:0',
            'puede_tener_credito'            => 'nullable|boolean',
            'localidad_id'                   => 'nullable|exists:localidades,id',
            'activo'                         => 'nullable|boolean',
            'observaciones'                  => 'nullable|string',

            // Archivos de imagen (opcionales)
            'foto_perfil'                    => 'nullable|sometimes|image|mimes:jpeg,jpg,png,gif|max:5120',
            'ci_anverso'                     => 'nullable|sometimes|image|mimes:jpeg,jpg,png,gif|max:5120',
            'ci_reverso'                     => 'nullable|sometimes|image|mimes:jpeg,jpg,png,gif|max:5120',

            // Direcciones opcionales
            'direcciones'                    => 'nullable|array',
            'direcciones.*.direccion'        => 'nullable|string|max:500', // ✅ Opcional - usuario puede borrar el texto
            'direcciones.*.latitud'          => 'required_with:direcciones|numeric|between:-90,90',
            'direcciones.*.longitud'         => 'required_with:direcciones|numeric|between:-180,180',
            'direcciones.*.observaciones'    => 'nullable|string|max:1000',
            'direcciones.*.es_principal'     => 'nullable|boolean',
            'direcciones.*.activa'           => 'nullable|boolean',

            // Ventanas de entrega preferidas (opcional)
            'ventanas_entrega'               => 'nullable|array',
            'ventanas_entrega.*.dia_semana'  => 'required_with:ventanas_entrega|integer|between:0,6',
            'ventanas_entrega.*.hora_inicio' => 'required_with:ventanas_entrega|date_format:H:i',
            'ventanas_entrega.*.hora_fin'    => 'required_with:ventanas_entrega|date_format:H:i',
            'ventanas_entrega.*.activo'      => 'nullable|boolean',

            // Categorías del cliente (opcional)
            'categorias_ids'                 => 'nullable|array',
            'categorias_ids.*'               => 'integer|exists:categorias_cliente,id',

            // Teleféfono único ignorando el cliente actual
            'telefono' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('clientes')->ignore($cliente->id),
            ],
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'nombre.required'                           => 'El nombre del cliente es obligatorio.',
            'nombre.string'                             => 'El nombre debe ser texto.',
            'nombre.max'                                => 'El nombre no puede exceder 255 caracteres.',
            'email.email'                               => 'El correo electrónico debe ser válido.',
            'email.max'                                 => 'El correo electrónico no puede exceder 255 caracteres.',
            'telefono.unique'                           => 'El teléfono ya está registrado para otro cliente.',
            'telefono.max'                              => 'El teléfono no puede exceder 20 caracteres.',
            'nit.max'                                   => 'El NIT no puede exceder 50 caracteres.',
            'limite_credito.numeric'                    => 'El límite de crédito debe ser un número.',
            'limite_credito.min'                        => 'El límite de crédito no puede ser negativo.',
            'puede_tener_credito.boolean'               => 'El campo habilitación de crédito debe ser verdadero o falso.',
            'password.min'                              => 'La contraseña debe tener al menos 8 caracteres.',
            'password_confirmation.required_with'       => 'Debe confirmar la contraseña.',
            'password_confirmation.same'                => 'Las contraseñas no coinciden.',

            'foto_perfil.image'                         => 'La foto de perfil debe ser una imagen válida.',
            'foto_perfil.mimes'                         => 'La foto de perfil debe ser JPEG, PNG o GIF.',
            'foto_perfil.max'                           => 'La foto de perfil no puede exceder 5MB.',
            'ci_anverso.image'                          => 'El CI anverso debe ser una imagen válida.',
            'ci_anverso.mimes'                          => 'El CI anverso debe ser JPEG, PNG o GIF.',
            'ci_anverso.max'                            => 'El CI anverso no puede exceder 5MB.',
            'ci_reverso.image'                          => 'El CI reverso debe ser una imagen válida.',
            'ci_reverso.mimes'                          => 'El CI reverso debe ser JPEG, PNG o GIF.',
            'ci_reverso.max'                            => 'El CI reverso no puede exceder 5MB.',

            'direcciones.array'                         => 'Las direcciones deben ser un arreglo.',
            'direcciones.*.direccion.string'            => 'La dirección debe ser texto.',
            'direcciones.*.direccion.max'               => 'La dirección no puede exceder 500 caracteres.',
            'direcciones.*.latitud.required_with'       => 'La latitud es obligatoria cuando se proporciona dirección.',
            'direcciones.*.latitud.numeric'             => 'La latitud debe ser un número.',
            'direcciones.*.latitud.between'             => 'La latitud debe estar entre -90 y 90.',
            'direcciones.*.longitud.required_with'      => 'La longitud es obligatoria cuando se proporciona dirección.',
            'direcciones.*.longitud.numeric'            => 'La longitud debe ser un número.',
            'direcciones.*.longitud.between'            => 'La longitud debe estar entre -180 y 180.',
            'direcciones.*.observaciones.max'           => 'Las observaciones no pueden exceder 1000 caracteres.',

            'ventanas_entrega.array'                    => 'Las ventanas de entrega deben ser un arreglo.',
            'ventanas_entrega.*.dia_semana.required_with' => 'El día de la semana es obligatorio.',
            'ventanas_entrega.*.dia_semana.integer'    => 'El día de la semana debe ser un número entero.',
            'ventanas_entrega.*.dia_semana.between'    => 'El día de la semana debe estar entre 0 (domingo) y 6 (sábado).',
            'ventanas_entrega.*.hora_inicio.required_with' => 'La hora de inicio es obligatoria.',
            'ventanas_entrega.*.hora_inicio.date_format' => 'La hora de inicio debe tener formato HH:MM.',
            'ventanas_entrega.*.hora_fin.required_with' => 'La hora de fin es obligatoria.',
            'ventanas_entrega.*.hora_fin.date_format'  => 'La hora de fin debe tener formato HH:MM.',

            'categorias_ids.array'                      => 'Las categorías deben ser un arreglo.',
            'categorias_ids.*.integer'                  => 'Cada categoría debe ser un ID numérico.',
            'categorias_ids.*.exists'                   => 'Una de las categorías seleccionadas no existe.',
        ];
    }

    /**
     * Custom attribute names for better error messages
     */
    public function attributes(): array
    {
        return [
            'codigo_cliente'                   => 'código del cliente',
            'nombre'                           => 'nombre del cliente',
            'razon_social'                     => 'razón social',
            'nit'                              => 'NIT',
            'email'                            => 'correo electrónico',
            'telefono'                         => 'teléfono',
            'limite_credito'                   => 'límite de crédito',
            'puede_tener_credito'              => 'habilitación de crédito',
            'localidad_id'                     => 'localidad',
            'activo'                           => 'estado activo',
            'observaciones'                    => 'observaciones',
            'crear_usuario'                    => 'crear usuario',

            'foto_perfil'                      => 'foto de perfil',
            'ci_anverso'                       => 'CI anverso',
            'ci_reverso'                       => 'CI reverso',

            'direcciones'                      => 'direcciones',
            'direcciones.*.direccion'          => 'dirección',
            'direcciones.*.latitud'            => 'latitud',
            'direcciones.*.longitud'           => 'longitud',
            'direcciones.*.observaciones'      => 'observaciones de dirección',

            'ventanas_entrega'                 => 'ventanas de entrega',
            'ventanas_entrega.*.dia_semana'    => 'día de la semana',
            'ventanas_entrega.*.hora_inicio'   => 'hora de inicio',
            'ventanas_entrega.*.hora_fin'      => 'hora de fin',

            'categorias_ids'                   => 'categorías del cliente',
        ];
    }

    /**
     * Add custom validation logic after Laravel validation
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $cliente = $this->route('cliente');

            // Validaciones condicionales según crear_usuario
            if ($this->input('crear_usuario')) {
                $this->validarTelefonoUniqueUpdate($validator, $cliente);
                $this->validarEmailUniqueUpdate($validator, $cliente);
            } else {
                $this->validarTelefonoUniqueUpdate($validator, $cliente);
            }

            // Validar que hora_fin > hora_inicio en ventanas
            $this->validarVentanasHorario($validator);
        });
    }

    /**
     * Validar que teléfono sea único (ignorando el cliente actual) cuando se actualiza
     */
    private function validarTelefonoUniqueUpdate(Validator $validator, $cliente): void
    {
        $telefono = $this->input('telefono');

        if ($telefono) {
            // Validar que sea único en clientes (ignorando el cliente actual)
            if (\App\Models\Cliente::where('telefono', $telefono)
                ->where('id', '!=', $cliente->id)
                ->exists()) {
                $validator->errors()->add('telefono',
                    'El teléfono ya está registrado para otro cliente.'
                );
            }
        }
    }

    /**
     * Validar que email sea único en tabla users cuando se actualiza y se crea usuario
     */
    private function validarEmailUniqueUpdate(Validator $validator, $cliente): void
    {
        $email = $this->input('email');

        if ($email) {
            if ($cliente->user_id) {
                // Si ya tiene usuario, ignorar su email actual
                if (\App\Models\User::where('email', $email)
                    ->where('id', '!=', $cliente->user_id)
                    ->exists()) {
                    $validator->errors()->add('email',
                        'El correo electrónico ya está registrado.'
                    );
                }
            } else {
                // Si no tiene usuario, validar que el email no exista
                if (\App\Models\User::where('email', $email)->exists()) {
                    $validator->errors()->add('email',
                        'El correo electrónico ya está registrado.'
                    );
                }
            }
        }
    }

    /**
     * Validar que hora_fin > hora_inicio en cada ventana de entrega
     */
    private function validarVentanasHorario(Validator $validator): void
    {
        $ventanas = $this->input('ventanas_entrega', []);

        if (!is_array($ventanas)) {
            return;
        }

        foreach ($ventanas as $index => $ventana) {
            if (!is_array($ventana)) {
                continue;
            }

            $horaInicio = $ventana['hora_inicio'] ?? null;
            $horaFin = $ventana['hora_fin'] ?? null;

            if ($horaInicio && $horaFin && $horaInicio >= $horaFin) {
                $validator->errors()->add(
                    "ventanas_entrega.{$index}.hora_fin",
                    'La hora de fin debe ser posterior a la hora de inicio.'
                );
            }
        }
    }
}
