<?php
namespace App\Http\Controllers;

use App\Events\CreditoPagoRegistrado;
use App\Helpers\ApiResponse;
use App\Http\Requests\ChangeClienteCredentialsRequest;
use App\Http\Requests\StoreClienteRequest;
use App\Http\Requests\UpdateClienteRequest;
use App\Http\Traits\ApiInertiaUnifiedResponse;
use App\Models\CategoriaCliente;
use App\Models\Cliente as ClienteModel;
use App\Models\Localidad;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ClienteController extends Controller
{
    use ApiInertiaUnifiedResponse;

    /**
     * Cache del rol Cliente para evitar múltiples queries
     */
    private static $clientRoleCache = null;

    /**
     * Obtiene el rol Cliente con cache para evitar queries repetidas
     */
    private function getClientRole()
    {
        if (self::$clientRoleCache === null) {
            self::$clientRoleCache = \Spatie\Permission\Models\Role::where('name', 'cliente')->first();
        }
        return self::$clientRoleCache;
    }

    /**
     * Asigna el rol Cliente de forma optimizada
     */
    private function assignClientRoleOptimized($user): void
    {
        try {
            $clientRole = $this->getClientRole();
            if ($clientRole && ! $user->hasRole('cliente')) {
                $user->roles()->attach($clientRole->id);
                Log::info('✅ Rol cliente asignado', ['user_id' => $user->id]);
            }
        } catch (\Exception $e) {
            Log::warning('⚠️ Error al asignar rol cliente', ['user_id' => $user->id, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Método privado para construir la query de clientes con filtros comunes
     */
    private function buildClientesQuery(Request $request, array $options = []): \Illuminate\Pagination\LengthAwarePaginator
    {
        $defaults = [
            'per_page'                 => 10,
            'include_email'            => false,
            'include_localidad_filter' => true,
            'include_order_options'    => true,
            'default_order_by'         => 'id',
            'default_order_dir'        => 'desc',
            'default_activo'           => null,
        ];

        $options = array_merge($defaults, $options);

        // Procesar parámetros de búsqueda
        $q           = (string) $request->string('q');
        $localidadId = $options['include_localidad_filter'] ? $request->input('localidad_id') : null;

        // Procesar parámetro activo
        $activoParam = $request->input('activo');
        $activo      = $options['default_activo'];

        if ($activoParam !== null && $activoParam !== '' && $activoParam !== 'all') {
            if ($activoParam === '1' || $activoParam === 1 || $activoParam === true || $activoParam === 'true') {
                $activo = true;
            } elseif ($activoParam === '0' || $activoParam === 0 || $activoParam === false || $activoParam === 'false') {
                $activo = false;
            }
        }

        // Procesar ordenamiento
        $orderBy  = $options['default_order_by'];
        $orderDir = $options['default_order_dir'];

        if ($options['include_order_options']) {
            $allowedOrderBy = ['id', 'nombre', 'fecha_registro'];
            $rawOrderBy     = (string) $request->string('order_by');
            $orderBy        = in_array($rawOrderBy, $allowedOrderBy, true) ? $rawOrderBy : $options['default_order_by'];

            $rawOrderDir = strtolower((string) $request->string('order_dir'));
            $orderDir    = in_array($rawOrderDir, ['asc', 'desc'], true) ? $rawOrderDir : $options['default_order_dir'];
        }

        // Construir query
        $query = ClienteModel::query()
            ->forCurrentUser() // ✅ NUEVO: Filtrar por usuario actual (Preventista ve solo sus clientes)
            ->leftJoin('localidades', 'clientes.localidad_id', '=', 'localidades.id')
            ->when($q, function ($query) use ($q, $options) {
                // Convertir búsqueda a minúsculas para hacer búsqueda case-insensitive
                $searchLower = strtolower($q);

                // ✅ NUEVO: Agregar columna de relevancia con prioridades
                // Máxima: id, codigo_cliente (1-2)
                // Media: nombre, telefono (3-4)
                // Baja: razon_social, nit, localidad (5-6)
                $query->selectRaw(
                    'clientes.*,
                    CASE
                        WHEN LOWER(CAST(clientes.id as text)) = LOWER(?) THEN 1
                        WHEN LOWER(clientes.codigo_cliente) = LOWER(?) THEN 2
                        WHEN LOWER(clientes.nombre) LIKE LOWER(?) THEN 3
                        WHEN LOWER(clientes.telefono) LIKE LOWER(?) THEN 4
                        WHEN LOWER(clientes.razon_social) LIKE LOWER(?) THEN 5
                        WHEN LOWER(clientes.nit) LIKE LOWER(?) THEN 6
                        ELSE 7
                    END as relevancia',
                    [$q, $q, "%{$q}%", "%{$q}%", "%{$q}%", "%{$q}%"]
                );

                $query->where(function ($sub) use ($searchLower, $options) {
                    $sub->whereRaw('LOWER(clientes.nombre) like ?', ["%$searchLower%"])
                        ->orWhereRaw('LOWER(clientes.razon_social) like ?', ["%$searchLower%"])
                        ->orWhereRaw('LOWER(clientes.nit) like ?', ["%$searchLower%"])
                        ->orWhereRaw('LOWER(clientes.telefono) like ?', ["%$searchLower%"])
                        ->orWhereRaw('LOWER(clientes.codigo_cliente) like ?', ["%$searchLower%"])
                        ->orWhereRaw('LOWER(localidades.nombre) like ?', ["%$searchLower%"]);

                    if ($options['include_email']) {
                        $sub->orWhereRaw('LOWER(clientes.email) like ?', ["%$searchLower%"]);
                    }
                });
            }, function ($query) {
                // Si no hay búsqueda, seleccionar normalmente
                $query->select('clientes.*');
            })
            ->when($activo !== null, function ($query) use ($activo) {
                $query->where('clientes.activo', $activo);
            })
            ->when($localidadId && is_numeric($localidadId), function ($query) use ($localidadId) {
                $query->where('clientes.localidad_id', $localidadId);
            })
            ->when($q,
                // Si hay búsqueda, ordenar por relevancia
                function ($query) {
                    $query->orderBy('relevancia', 'asc');
                },
                // Si no hay búsqueda, ordenar por los parámetros solicitados
                function ($query) use ($orderBy, $orderDir) {
                    $query->orderBy('clientes.' . $orderBy, $orderDir);
                }
            );

        return $query->paginate($request->integer('per_page', $options['per_page']))->withQueryString();
    }

    public function index(Request $request)
    {
        try {
            // ✅ Autorizar: Solo roles permitidos pueden ver listado de clientes
            // ✅ Remover autorización para permitir a todos los usuarios ver clientes

            // Configurar opciones según el tipo de request
            $options = $this->isApiRequest() ? [
                'per_page'                 => 20,
                'include_email'            => true,
                'include_localidad_filter' => false,
                'include_order_options'    => false,
                'default_order_by'         => 'nombre',
                'default_order_dir'        => 'asc',
                'default_activo'           => true,
            ] : [
                'per_page'                 => 15,
                'include_email'            => false,
                'include_localidad_filter' => true,
                'include_order_options'    => true,
                'default_order_by'         => 'id',
                'default_order_dir'        => 'desc',
                'default_activo'           => null,
            ];

            $clientes = $this->buildClientesQuery($request, $options);

            // Cargar relaciones según el tipo de request
            if ($this->isApiRequest()) {
                $clientes->getCollection()->load('localidad', 'categorias', 'direcciones', 'user', 'ventanasEntrega', 'cuentasPorCobrar');
            } else {
                $clientes->getCollection()->load('localidad', 'categorias', 'cuentasPorCobrar');
            }

            // Agregar URLs de fotos de perfil para el listado
            $clientes->getCollection()->transform(function ($cliente) {
                $cliente->foto_perfil_url = $cliente->foto_perfil ? Storage::url($cliente->foto_perfil) : null;
                return $cliente;
            });

            // Preparar datos adicionales para web
            $additionalData = [];
            if (! $this->isApiRequest()) {
                $additionalData = [
                    'filters'     => $request->only(['q', 'activo', 'localidad_id', 'order_by', 'order_dir']),
                    'localidades' => Localidad::where('activo', true)
                        ->orderBy('nombre')
                        ->get(['id', 'nombre', 'codigo']),
                ];

                // 🔍 DEBUG: Mostrar datos enviados al frontend
                Log::info('📋 CLIENTES INDEX - Datos enviados al frontend:', [
                    'total_clientes' => $clientes->total(),
                    'per_page' => $clientes->perPage(),
                    'current_page' => $clientes->currentPage(),
                    'clientes_count' => count($clientes->items()),
                    'localidades_count' => count($additionalData['localidades']),
                    'primer_cliente' => $clientes->items()[0] ?? null,
                    'primer_cliente_categorias' => isset($clientes->items()[0]) ? $clientes->items()[0]->categorias : null,
                ]);
            }

            return $this->paginatedResponse(
                $clientes,
                $this->isApiRequest() ? null : 'clientes/index',
                'clientes',
                $additionalData
            );

        } catch (\Exception $e) {
            return $this->handleException($e, 'obtener clientes');
        }
    }

    public function create()
    {
        try {
            // ✅ Autorizar: Solo roles que pueden crear clientes
            $this->authorize('create', ClienteModel::class);

            $data = [
                'cliente'     => null,
                'localidades' => Localidad::where('activo', true)
                    ->orderBy('nombre')
                    ->get(['id', 'nombre', 'codigo']),
                'categorias'  => CategoriaCliente::where('activo', true)
                    ->orderBy('nombre')
                    ->get(['id', 'nombre', 'clave']),
            ];

            return $this->dataResponse('clientes/form', $data);

        } catch (\Exception $e) {
            return $this->handleException($e, 'cargar formulario de creación');
        }
    }

    public function store(StoreClienteRequest $request)
    {
        // ✅ Autorizar: Solo roles que pueden crear clientes
        $this->authorize('create', ClienteModel::class);

        try {
            // Data ya validado por StoreClienteRequest
            $data = $request->validated();

            // Determinar si se deben manejar direcciones
            $handleDirecciones = $this->isApiRequest() || $request->has('direcciones');

            // ✅ OPTIMIZACIÓN: Procesar archivos de forma sincrónica (pero de forma rápida)
            $cliente = $this->handleClientCreation($request, $data, false, $handleDirecciones, true);

            // Guardar ventanas de entrega (tanto para web como API)
            $this->syncVentanasEntrega($cliente, isset($data['ventanas_entrega']) ? (array) $data['ventanas_entrega'] : null);

            // Guardar categorías (tanto para web como API)
            $this->syncCategorias($cliente, isset($data['categorias_ids']) ? (array) $data['categorias_ids'] : null);

            // Preparar respuesta según el tipo de request
            if ($this->isApiRequest()) {
                $responseData = [
                    'cliente' => $cliente->load(['direcciones', 'localidad', 'user', 'ventanasEntrega', 'categorias']),
                ];
                if ($cliente->user) {
                    $responseData['usuario'] = $cliente->user;
                }
                return $this->resourceResponse($responseData, 'Cliente creado exitosamente', null, [], 201);
            } else {
                return $this->resourceResponse(
                    $cliente->load('localidad'),
                    'Cliente creado exitosamente',
                    route('clientes.index'),
                    [],
                    201
                );
            }

        } catch (\Exception $e) {
            return $this->handleException($e, 'crear cliente');
        }
    }

    public function edit(ClienteModel $cliente)
    {
        try {
            // ✅ Autorizar: Solo roles que pueden editar este cliente
            $this->authorize('update', $cliente);

            $clienteData = $cliente->load(['localidad', 'direcciones', 'ventanasEntrega', 'user', 'categorias']);
            $localidadesData = Localidad::where('activo', true)
                ->orderBy('nombre')
                ->get(['id', 'nombre', 'codigo']);
            $categoriasData = CategoriaCliente::where('activo', true)
                ->orderBy('nombre')
                ->get(['id', 'nombre', 'clave']);

            $responseData = [
                'cliente'     => $clienteData,
                'localidades' => $localidadesData,
                'categorias'  => $categoriasData,
            ];

            // 🔍 DEBUG: Mostrar todo lo que se envía al frontend
            Log::info('📋 CLIENTE EDIT - Datos enviados al frontend:', [
                'cliente_id' => $cliente->id,
                'cliente_nombre' => $cliente->nombre,
                'cliente_keys' => array_keys($clienteData->toArray()),
                'cliente_categorias_ids' => $clienteData->categorias_ids,
                'cliente_categorias_count' => count($clienteData->categorias),
                'localidades_count' => $localidadesData->count(),
                'categorias_count' => $categoriasData->count(),
                'full_response' => json_encode($responseData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
            ]);

            return $this->dataResponse('clientes/form', $responseData);

        } catch (\Exception $e) {
            return $this->handleException($e, 'cargar formulario de edición');
        }
    }

    public function update(UpdateClienteRequest $request, ClienteModel $cliente)
    {
        // ✅ Autorizar: Solo roles que pueden editar este cliente
        $this->authorize('update', $cliente);

        // Data already validated and prepared by UpdateClienteRequest
        $data = $request->validated();

        try {
            $user = null;

            // Manejar usuario
            if ($request->crear_usuario) {
                if ($cliente->user) {
                    // Actualizar usuario existente
                    $userUpdates = [
                        'name'  => $request->nombre,
                        'email' => $request->email,
                    ];

                    // 🔍 DEBUG: Verificar si password viene en la request
                    $passwordProveniente = $request->input('password');
                    $passwordLlenado = $request->filled('password');

                    Log::info('🔐 VERIFICACIÓN DE PASSWORD EN REQUEST', [
                        'cliente_id' => $cliente->id,
                        'user_id' => $cliente->user->id,
                        'password_value' => $passwordProveniente ? '***[presente]***' : 'null',
                        'password_filled' => $passwordLlenado,
                        'has_password_key' => $request->has('password'),
                    ]);

                    // NUEVO: Cambiar password si se proporciona
                    if ($request->filled('password')) {
                        $hashedPassword = Hash::make($request->password);
                        $userUpdates['password'] = $hashedPassword;

                        Log::info('✅ PASSWORD SERÁ ACTUALIZADO', [
                            'cliente_id' => $cliente->id,
                            'user_id'    => $cliente->user->id,
                            'password_original_length' => strlen($request->password),
                            'password_hash_preview' => substr($hashedPassword, 0, 20) . '...',
                        ]);
                    } else {
                        Log::info('⚠️ PASSWORD NO SERÁ ACTUALIZADO', [
                            'cliente_id' => $cliente->id,
                            'user_id' => $cliente->user->id,
                            'razon' => 'request->filled("password") retornó false',
                        ]);
                    }

                    // 🔍 DEBUG: Mostrar datos antes de actualizar
                    Log::info('🔄 ANTES DE ACTUALIZAR USUARIO', [
                        'cliente_id' => $cliente->id,
                        'user_id' => $cliente->user->id,
                        'password_hash_anterior' => $cliente->user->password ? substr($cliente->user->password, 0, 20) . '...' : 'null',
                        'updates' => [
                            'name' => $userUpdates['name'],
                            'email' => $userUpdates['email'],
                            'password' => isset($userUpdates['password']) ? '[SERÁ ACTUALIZADO]' : '[NO CAMBIA]',
                        ],
                    ]);

                    $cliente->user->update($userUpdates);
                    $user = $cliente->user->fresh(); // Recargar del DB para obtener datos actualizados

                    // 🔍 DEBUG: Mostrar datos después de actualizar - IMPORTANTE: Verificar password
                    Log::info('🔄 DESPUÉS DE ACTUALIZAR USUARIO', [
                        'cliente_id' => $cliente->id,
                        'user_id' => $cliente->user->id,
                        'user_name' => $user->name,
                        'user_email' => $user->email,
                        'password_hash_nuevo' => $user->password ? substr($user->password, 0, 20) . '...' : 'null',
                        'password_cambio_detectado' => isset($userUpdates['password']) ? '✅ SÍ' : '❌ NO',
                        'user_actualizado_completo' => $user->toArray(),
                    ]);
                } else {
                    // Crear nuevo usuario usando teléfono como usernick y password
                    if ($request->telefono) {
                        $telefono = $request->telefono;
                        $usernick = $this->generarUsernickUnico($telefono);

                        $userData = [
                            'name'       => $request->nombre,
                            'usernick'   => $usernick,
                            'password'   => Hash::make($telefono),
                            'activo'     => true,
                            // ✅ NUEVO: Asignar la empresa_id del usuario autenticado
                            'empresa_id' => Auth::user()?->empresa_id,
                        ];

                        if ($request->filled('email')) {
                            $userData['email']             = $request->email;
                            $userData['email_verified_at'] = now();
                        }

                        $user = User::create($userData);
                        $this->assignClientRoleOptimized($user);
                        $data['user_id'] = $user->id;
                    }
                }
            }

            // Procesar archivos de imagen con ruta dinámica (consistente con store())
            Log::info('📸 Procesando archivos en UPDATE del cliente', [
                'cliente_id'     => $cliente->id,
                'has_foto'       => $request->hasFile('foto_perfil'),
                'has_ci_anverso' => $request->hasFile('ci_anverso'),
                'has_ci_reverso' => $request->hasFile('ci_reverso'),
            ]);

            $updates = [];
            if ($request->hasFile('foto_perfil') && $request->file('foto_perfil')->isValid()) {
                if ($cliente->foto_perfil) {
                    Storage::disk('public')->delete($cliente->foto_perfil);
                    Log::info('🗑️ Foto anterior eliminada', ['path' => $cliente->foto_perfil]);
                }
                $folderName             = $this->generateClientFolderName($cliente);
                $path                   = $request->file('foto_perfil')->store($folderName, 'public');
                $data['foto_perfil']    = $path;
                $updates['foto_perfil'] = $path;
                Log::info('✅ Foto de perfil guardada en UPDATE', ['path' => $path]);
            }
            if ($request->hasFile('ci_anverso') && $request->file('ci_anverso')->isValid()) {
                if ($cliente->ci_anverso) {
                    Storage::disk('public')->delete($cliente->ci_anverso);
                    Log::info('🗑️ CI anverso anterior eliminado', ['path' => $cliente->ci_anverso]);
                }
                $folderName            = $this->generateClientFolderName($cliente);
                $path                  = $request->file('ci_anverso')->store($folderName, 'public');
                $data['ci_anverso']    = $path;
                $updates['ci_anverso'] = $path;
                Log::info('✅ CI anverso guardado en UPDATE', ['path' => $path]);
            }
            if ($request->hasFile('ci_reverso') && $request->file('ci_reverso')->isValid()) {
                if ($cliente->ci_reverso) {
                    Storage::disk('public')->delete($cliente->ci_reverso);
                    Log::info('🗑️ CI reverso anterior eliminado', ['path' => $cliente->ci_reverso]);
                }
                $folderName            = $this->generateClientFolderName($cliente);
                $path                  = $request->file('ci_reverso')->store($folderName, 'public');
                $data['ci_reverso']    = $path;
                $updates['ci_reverso'] = $path;
                Log::info('✅ CI reverso guardado en UPDATE', ['path' => $path]);
            }

            // Log de los datos que se van a actualizar
            Log::info('💾 Datos a actualizar en cliente', [
                'cliente_id' => $cliente->id,
                'has_updates' => !empty($updates),
                'updates_keys' => array_keys($updates),
            ]);

            // ✅ CÓDIGO CLIENTE: Si viene en la petición, respetarlo. Si no viene, el evento updating manejará la lógica
            if (isset($data['codigo_cliente']) && !empty($data['codigo_cliente'])) {
                // Usar el código proporcionado del frontend (respetarlo incluso si cambió localidad)
                Log::info('✅ Usando código de cliente del frontend', [
                    'cliente_id' => $cliente->id,
                    'codigo_proporcionado' => $data['codigo_cliente'],
                ]);
            } else {
                // Si no viene codigo_cliente, no lo tocamos aquí
                // El evento updating del modelo manejará la lógica:
                // - Si cambió localidad → regenerar automáticamente
                // - Si no cambió → dejar como está
                unset($data['codigo_cliente']);
                Log::info('ℹ️ Código de cliente no modificado en petición - evento updating manejará la lógica', [
                    'cliente_id' => $cliente->id,
                    'localidad_cambio' => $cliente->localidad_id !== $cliente->getOriginal('localidad_id'),
                ]);
            }

            // ✅ CÓDIGO CLIENTE: Capturar valor anterior para auditoría
            $codigoAnterior = $cliente->codigo_cliente;

            // ✅ CRÉDITO: Capturar valores anteriores para auditoría de crédito
            $creditoAnterior = [
                'puede_tener_credito' => $cliente->getOriginal('puede_tener_credito'),
                'limite_credito'      => $cliente->getOriginal('limite_credito'),
            ];

            // Actualizar el cliente
            $cliente->update($data);
            $cliente->refresh();

            // ✅ CÓDIGO CLIENTE: Registrar cambios en auditoría si cambió
            if (isset($data['codigo_cliente']) && $data['codigo_cliente'] !== $codigoAnterior) {
                $cliente->registrarCambio(
                    'actualizar_codigo_cliente',
                    [
                        'codigo_anterior' => $codigoAnterior,
                        'codigo_nuevo' => $data['codigo_cliente'],
                    ]
                );
                Log::info('📝 Cambio de código de cliente registrado en auditoría', [
                    'cliente_id' => $cliente->id,
                    'codigo_anterior' => $codigoAnterior,
                    'codigo_nuevo' => $data['codigo_cliente'],
                ]);
            }

            // ✅ CRÉDITO: Registrar cambios de crédito en auditoría
            if (isset($data['puede_tener_credito']) || isset($data['limite_credito'])) {
                $creditoActual = [
                    'puede_tener_credito' => $cliente->puede_tener_credito,
                    'limite_credito'      => $cliente->limite_credito,
                ];

                // Verificar si hay cambios en los campos de crédito
                if ($creditoAnterior['puede_tener_credito'] !== $creditoActual['puede_tener_credito'] ||
                    $creditoAnterior['limite_credito'] != $creditoActual['limite_credito']) {

                    $cliente->registrarCambio(
                        'actualizar_credito',
                        [
                            'puede_tener_credito' => [
                                'anterior' => (bool) $creditoAnterior['puede_tener_credito'],
                                'actual'   => (bool) $creditoActual['puede_tener_credito'],
                            ],
                            'limite_credito'      => [
                                'anterior' => (float) $creditoAnterior['limite_credito'],
                                'actual'   => (float) $creditoActual['limite_credito'],
                            ],
                        ],
                        null// Motivo opcional
                    );
                }
            }

            // Sincronizar direcciones si vienen en la petición
            if ($request->has('direcciones')) {
                // DEBUG: Log dirección data para verificar observaciones
                Log::info('🔍 Direcciones recibidas en update:', [
                    'direcciones' => $data['direcciones'] ?? [],
                ]);

                // ✅ VALIDACIÓN: Solo procesar si hay direcciones válidas (no vacías)
                $direccionesValidas = is_array($data['direcciones']) && count($data['direcciones']) > 0;

                if ($direccionesValidas) {
                    // ✅ SEGURIDAD: Solo eliminar si hay nuevas direcciones para reemplazar
                    Log::info('🗑️ Eliminando direcciones antiguas para reemplazar con nuevas', [
                        'cliente_id' => $cliente->id,
                        'direcciones_nuevas' => count($data['direcciones']),
                    ]);
                    $cliente->direcciones()->delete();

                    // Crear nuevas direcciones
                    foreach ($data['direcciones'] as $index => $direccionData) {
                        Log::info("📍 Procesando dirección $index:", ['data' => $direccionData]);

                        $direccionData['activa'] = $direccionData['activa'] ?? true;
                        // Asignar localidad_id del cliente a la dirección
                        $direccionData['localidad_id'] = $cliente->localidad_id;
                        $createdDireccion              = $cliente->direcciones()->create($direccionData);

                        Log::info("✅ Dirección creada:", [
                            'id'            => $createdDireccion->id,
                            'observaciones' => $createdDireccion->observaciones,
                        ]);
                    }
                } else {
                    // ⚠️ ADVERTENCIA: Se intentó actualizar con direcciones vacías o inválidas
                    Log::warning('⚠️ Intento de actualizar direcciones con datos vacíos o inválidos - operación ignorada', [
                        'cliente_id' => $cliente->id,
                        'direcciones_recibidas' => count($data['direcciones'] ?? []),
                        'direcciones_validas' => 0,
                    ]);
                    // NO eliminar direcciones antiguas si no hay nuevas válidas
                }
            }

            // Sincronizar ventanas de entrega (tanto para web como API)
            $this->syncVentanasEntrega($cliente, $request->has('ventanas_entrega') ? (array) $request->input('ventanas_entrega', []) : null);

            // Sincronizar categorías (tanto para web como API)
            $this->syncCategorias($cliente, $request->has('categorias_ids') ? (array) $request->input('categorias_ids') : null);

            // Preparar respuesta según el tipo de request
            if ($this->isApiRequest()) {
                $responseData = [
                    'cliente' => $cliente->fresh(['direcciones', 'localidad', 'user', 'ventanasEntrega', 'categorias']),
                ];
                if ($user) {
                    $responseData['usuario'] = $user;
                }
                return $this->resourceResponse($responseData, 'Cliente actualizado exitosamente');
            } else {
                return $this->resourceResponse(
                    $cliente->load('localidad'),
                    'Cliente actualizado exitosamente',
                    route('clientes.index')
                );
            }

        } catch (\Exception $e) {
            return $this->handleException($e, 'actualizar cliente');
        }
    }

    public function destroy(ClienteModel $cliente)
    {
        try {
            // ✅ Autorizar: Solo admins y managers pueden eliminar clientes
            $this->authorize('delete', $cliente);

            // Verificar si tiene cuentas por cobrar pendientes
            $tieneCuentasPendientes = $cliente->cuentasPorCobrar()->where('saldo_pendiente', '>', 0)->exists();
            if ($tieneCuentasPendientes) {
                return $this->errorResponse('No se puede eliminar un cliente con cuentas por cobrar pendientes', null, null, [], 400);
            }

            // ✅ NUEVO: Verificar si tiene proformas registradas
            $tieneProformas = $cliente->proformas()->exists();
            if ($tieneProformas) {
                return $this->errorResponse('No se puede eliminar el cliente porque tiene proformas registradas', null, null, [], 400);
            }

            // Verificar si tiene ventas registradas
            $tieneVentas = $cliente->ventas()->exists();
            if ($tieneVentas) {
                // Solo desactivar para API, mostrar error para web
                if ($this->isApiRequest()) {
                    $cliente->update(['activo' => false]);
                    return $this->deleteResponse('Cliente desactivado (tiene historial de ventas)');
                } else {
                    return $this->errorResponse('No se puede eliminar el cliente porque tiene ventas registradas');
                }
            }

            // Eliminar completamente
            $cliente->delete();

            return $this->deleteResponse(
                'Cliente eliminado exitosamente',
                $this->isApiRequest() ? null : '/clientes'
            );

        } catch (\Exception $e) {
            return $this->handleException($e, 'eliminar cliente');
        }
    }

    // ================================
    // MÉTODOS API
    // ================================

    /**
     * API: Mostrar cliente específico con TODAS sus relaciones
     * Endpoint: GET /api/clientes/{id}
     * Retorna: Cliente completo con direcciones, categorías, ventanas de entrega, etc.
     */
    public function showApi(ClienteModel $cliente): JsonResponse
    {
        // ✅ Autorizar: Solo roles que pueden ver este cliente
        $this->authorize('view', $cliente);

        // Cargar TODAS las relaciones del cliente de una sola vez
        $cliente->load([
            'user'             => function ($query) {
                $query->select('id', 'name', 'email', 'usernick', 'activo');
            },
            'direcciones',
            'localidad',
            'categorias'       => function ($query) {
                $query->select('categorias_cliente.id', 'categorias_cliente.clave', 'categorias_cliente.nombre', 'categorias_cliente.descripcion', 'categorias_cliente.activo');
            },
            'ventanasEntrega'  => function ($query) {
                $query->select('ventanas_entrega_cliente.id', 'ventanas_entrega_cliente.cliente_id', 'ventanas_entrega_cliente.dia_semana', 'ventanas_entrega_cliente.hora_inicio', 'ventanas_entrega_cliente.hora_fin', 'ventanas_entrega_cliente.activo')
                    ->orderBy('dia_semana');
            },
            'cuentasPorCobrar' => function ($query) {
                $query->where('saldo_pendiente', '>', 0)->orderByDesc('fecha_vencimiento');
            },
        ]);

        // ✅ NUEVO: Calcular crédito utilizado y disponible
        $creditoUtilizado = $cliente->cuentasPorCobrar()
            ->where('saldo_pendiente', '>', 0)
            ->sum('saldo_pendiente');

        $saldoDisponible = max(0, ($cliente->limite_credito ?? 0) - $creditoUtilizado);

        // Agregar al cliente
        $cliente->credito_utilizado = (float) $creditoUtilizado;
        $cliente->saldo_credito     = (float) $saldoDisponible;

        Log::info('📡 API: Cliente cargado completamente', [
            'cliente_id'        => $cliente->id,
            'nombre'            => $cliente->nombre,
            'categorias_count'  => $cliente->categorias->count(),
            'ventanas_count'    => $cliente->ventanasEntrega->count(),
            'direcciones_count' => $cliente->direcciones->count(),
            'credito_utilizado' => $creditoUtilizado,
            'saldo_disponible'  => $saldoDisponible,
        ]);

        return ApiResponse::success($cliente);
    }

    /**
     * API: Obtener el perfil del cliente autenticado (su propio cliente)
     * Endpoint: GET /api/clientes/mi-perfil
     * No requiere pasar ID, acceso directo al cliente vinculado al usuario actual
     */
    public function miPerfil(): JsonResponse
    {
        $user = Auth::user();

        // Si no está autenticado, retornar error
        if (! $user) {
            return ApiResponse::error('No autenticado', 401);
        }

        // Si es Cliente, obtener su cliente vinculado
        if ($user->hasRole(['cliente', 'Preventista', 'preventista', 'Admin', 'admin', 'Manager'])) {
            $cliente = $user->cliente;

            if (! $cliente) {
                return ApiResponse::error('El usuario no tiene un cliente vinculado', 404);
            }

            $cliente->load([
                'user',
                'direcciones',
                'localidad',
                'categorias',
                'ventanasEntrega',
                'cuentasPorCobrar' => function ($query) {
                    $query->where('saldo_pendiente', '>', 0)->orderByDesc('fecha_vencimiento');
                },
            ]);

            // ✅ NUEVO: Calcular crédito utilizado y disponible
            $creditoUtilizado = $cliente->cuentasPorCobrar()
                ->where('saldo_pendiente', '>', 0)
                ->sum('saldo_pendiente');

            $saldoDisponible = max(0, ($cliente->limite_credito ?? 0) - $creditoUtilizado);

            // Agregar al cliente
            $cliente->credito_utilizado = (float) $creditoUtilizado;
            $cliente->saldo_credito     = (float) $saldoDisponible;

            return ApiResponse::success($cliente);
        }

        // Si es un rol administrativo/vendedor, no pueden acceder a este endpoint
        return ApiResponse::error('Solo los clientes pueden acceder a su perfil desde este endpoint', 403);
    }

    /**
     * ✅ CRÉDITO: API: Obtener historial de auditoría de crédito del cliente
     * Endpoint: GET /api/clientes/{id}/auditoria-credito
     * Retorna: Lista de cambios realizados en configuración de crédito
     */
    public function obtenerAuditoriaCreditoApi(ClienteModel $cliente): JsonResponse
    {
        // ✅ Autorizar: Solo roles que pueden ver este cliente
        $this->authorize('view', $cliente);

        $auditorias = \App\Models\ClienteAudit::where('cliente_id', $cliente->id)
            ->where('accion', 'actualizar_credito')
            ->orderByDesc('created_at')
            ->with([
                'preventista.user:id,name,usernick',
                'usuario:id,name,email',
            ])
            ->get()
            ->map(function ($auditoria) {
                return [
                    'id'          => $auditoria->id,
                    'fecha'       => $auditoria->created_at->format('Y-m-d H:i:s'),
                    'accion'      => $auditoria->accion,
                    'responsable' => $auditoria->getResponsableAttribute(),
                    'cambios'     => $auditoria->cambios,
                    'motivo'      => $auditoria->motivo,
                    'ip'          => $auditoria->ip_address,
                ];
            });

        return ApiResponse::success([
            'cliente_id' => $cliente->id,
            'nombre'     => $cliente->nombre,
            'auditoria'  => $auditorias,
        ]);
    }

    /**
     * Método privado para manejar la creación de clientes con lógica compartida
     */
    private function handleClientCreation(Request $request, array $data, bool $requireNitTelefono = false, bool $handleDirecciones = false, bool $processFiles = true): ClienteModel
    {
        // Validaciones adicionales si se va a crear usuario
        if ($request->crear_usuario) {
            $request->validate([
                'telefono' => ['required', 'string', 'max:20', 'unique:clientes,telefono'],
                'email'    => ['nullable', 'email', 'max:255', 'unique:users,email'],
            ]);
        } elseif ($requireNitTelefono) {
            $request->validate([
                'telefono' => ['required', 'string', 'max:20', 'unique:clientes,telefono'],
            ]);
        }

        // Obtener el ID del usuario autenticado que está creando el cliente
        $usuarioCreacionId = Auth::id();

        $user = null;

        // Crear usuario solo si se solicita
        if ($request->crear_usuario && $request->telefono) {
            // Usar teléfono como usernick y password
            $telefono = $request->telefono;
            $usernick = $this->generarUsernickUnico($telefono);

            $userData = [
                'name'       => $request->nombre,
                'usernick'   => $usernick,
                'password'   => Hash::make($telefono), // Usar teléfono como password
                'activo'     => true,
                // ✅ NUEVO: Asignar la empresa_id del usuario autenticado
                'empresa_id' => Auth::user()?->empresa_id,
            ];

            // Agregar email solo si se proporciona
            if ($request->filled('email')) {
                $userData['email']             = $request->email;
                $userData['email_verified_at'] = now();
            }

            $user = User::create($userData);
            $this->assignClientRoleOptimized($user);
        }

        // ✅ NUEVO: Obtener el preventista (empleado) asociado al usuario autenticado
        $preventista   = Auth::user()?->empleado;
        $preventistaId = $preventista?->id;

        $cliente = ClienteModel::create([
            'user_id'             => $user ? $user->id : null,
            'nombre'              => $data['nombre'],
            'razon_social'        => $data['razon_social'] ?? null,
            'nit'                 => $data['nit'] ?? null,
            'email'               => $data['email'] ?? null,
            'telefono'            => $data['telefono'] ?? null,
            'genero'              => $data['genero'] ?? null,
            'limite_credito'      => $data['limite_credito'] ?? 0,
            'localidad_id'        => $data['localidad_id'] ?? null,
            'activo'              => $data['activo'] ?? true,
            'fecha_registro'      => now(),
            'usuario_creacion_id' => $usuarioCreacionId,
            'preventista_id'      => $preventistaId, // ✅ NUEVO
            'estado'              => 'prospecto',    // ✅ NUEVO
        ]);

        // Crear direcciones si se proporcionaron y se deben manejar
        if ($handleDirecciones && isset($data['direcciones']) && is_array($data['direcciones']) && count($data['direcciones']) > 0) {
            Log::info('📍 Creando direcciones para cliente', [
                'cliente_id' => $cliente->id,
                'direcciones_count' => count($data['direcciones']),
            ]);

            foreach ($data['direcciones'] as $index => $direccionData) {
                // ✅ VALIDACIÓN: Verificar que al menos tenga dirección o coordenadas
                $tieneDirectly = !empty($direccionData['direccion']);
                $tieneCoordenadas = !empty($direccionData['latitud']) && !empty($direccionData['longitud']);

                if (!$tieneDirectly && !$tieneCoordenadas) {
                    Log::warning("⚠️ Dirección $index ignorada - está vacía", [
                        'cliente_id' => $cliente->id,
                        'index' => $index,
                    ]);
                    continue;
                }

                // Asegurar que tenga el campo activa con valor por defecto
                $direccionData['activa'] = $direccionData['activa'] ?? true;
                // Asignar localidad_id del cliente a la dirección
                $direccionData['localidad_id'] = $cliente->localidad_id;

                $createdDireccion = $cliente->direcciones()->create($direccionData);
                Log::info("✅ Dirección creada en store:", [
                    'direccion_id' => $createdDireccion->id,
                    'direccion_text' => $createdDireccion->direccion,
                ]);
            }
        } elseif ($handleDirecciones && (!isset($data['direcciones']) || count($data['direcciones'] ?? []) === 0)) {
            Log::info('ℹ️ No hay direcciones para crear', ['cliente_id' => $cliente->id]);
        }

        // Procesar archivos de imagen con ruta dinámica si se solicita
        if ($processFiles) {
            $updates = [];

            Log::info('📸 Procesando archivos del cliente', [
                'cliente_id'     => $cliente->id,
                'has_foto'       => $request->hasFile('foto_perfil'),
                'has_ci_anverso' => $request->hasFile('ci_anverso'),
                'has_ci_reverso' => $request->hasFile('ci_reverso'),
            ]);

            if ($request->hasFile('foto_perfil') && $request->file('foto_perfil')->isValid()) {
                $folderName             = $this->generateClientFolderName($cliente);
                $updates['foto_perfil'] = $request->file('foto_perfil')->store($folderName, 'public');
                Log::info('✅ Foto de perfil guardada', ['path' => $updates['foto_perfil']]);
            }
            if ($request->hasFile('ci_anverso') && $request->file('ci_anverso')->isValid()) {
                $folderName            = $this->generateClientFolderName($cliente);
                $updates['ci_anverso'] = $request->file('ci_anverso')->store($folderName, 'public');
                Log::info('✅ CI anverso guardado', ['path' => $updates['ci_anverso']]);
            }
            if ($request->hasFile('ci_reverso') && $request->file('ci_reverso')->isValid()) {
                $folderName            = $this->generateClientFolderName($cliente);
                $updates['ci_reverso'] = $request->file('ci_reverso')->store($folderName, 'public');
                Log::info('✅ CI reverso guardado', ['path' => $updates['ci_reverso']]);
            }

            // Actualizar cliente con las rutas de las imágenes si se subieron
            if (! empty($updates)) {
                Log::info('💾 Actualizando cliente con archivos', ['updates' => array_keys($updates)]);
                $cliente->update($updates);
                $cliente->refresh(); // Recargar el modelo con los nuevos datos
            }
        } else {
            Log::warning('⚠️ Procesamiento de archivos deshabilitado', ['cliente_id' => $cliente->id]);
        }

        return $cliente;
    }

    /**
     * API: Buscar clientes para autocompletado
     */
    public function buscarApi(Request $request): JsonResponse
    {
        $q      = $request->string('q');
        $limite = $request->integer('limite', 10);

        if (! $q || strlen($q) < 2) {
            return ApiResponse::success([]);
        }

        // Convertir búsqueda a minúsculas para hacer búsqueda case-insensitive
        $searchLower = strtolower($q);
        $clientes    = ClienteModel::forCurrentUser() // ✅ NUEVO: Filtrar por usuario actual
            ->select(['id', 'nombre', 'razon_social', 'nit', 'telefono', 'email'])
            ->where('activo', true)
            ->where(function ($query) use ($searchLower) {
                $query->whereRaw('LOWER(nombre) like ?', ["%$searchLower%"])
                    ->orWhereRaw('LOWER(razon_social) like ?', ["%$searchLower%"])
                    ->orWhereRaw('LOWER(nit) like ?', ["%$searchLower%"])
                    ->orWhereRaw('LOWER(telefono) like ?', ["%$searchLower%"]);
            })
            ->limit($limite)
            ->get();

        return ApiResponse::success($clientes);
    }

    /**
     * API: Obtener saldo de cuentas por cobrar de un cliente
     */
    public function saldoCuentasPorCobrar(ClienteModel $cliente): JsonResponse
    {
        // ✅ Autorizar: Solo el Preventista del cliente o Admin pueden ver el saldo
        $this->authorize('view', $cliente);

        $cuentas = $cliente->cuentasPorCobrar()
            ->where('saldo_pendiente', '>', 0)
            ->orderByDesc('fecha_vencimiento')
            ->get(['id', 'venta_id', 'monto_original', 'saldo_pendiente', 'fecha_vencimiento', 'dias_vencido']);

        $saldoTotal      = $cuentas->sum('saldo_pendiente');
        $cuentasVencidas = $cuentas->where('dias_vencido', '>', 0)->count();

        return ApiResponse::success([
            'cliente'          => [
                'id'             => $cliente->id,
                'nombre'         => $cliente->nombre,
                'limite_credito' => $cliente->limite_credito,
            ],
            'saldo_total'      => $saldoTotal,
            'cuentas_vencidas' => $cuentasVencidas,
            'cuentas_detalle'  => $cuentas,
        ]);
    }

    /**
     * API: Historial de compras del cliente
     */
    public function historialVentas(ClienteModel $cliente, Request $request): JsonResponse
    {
        // ✅ Autorizar: Solo el Preventista del cliente o Admin pueden ver el historial
        $this->authorize('view', $cliente);

        $perPage     = $request->integer('per_page', 10);
        $fechaInicio = $request->date('fecha_inicio');
        $fechaFin    = $request->date('fecha_fin');

        $ventas = $cliente->ventas()
            ->with(['estadoDocumento', 'moneda', 'detalles.producto:id,nombre'])
            ->when($fechaInicio, fn($q) => $q->whereDate('fecha', '>=', $fechaInicio))
            ->when($fechaFin, fn($q) => $q->whereDate('fecha', '<=', $fechaFin))
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->paginate($perPage);

        return ApiResponse::success($ventas);
    }

    /**
     * Genera un usernick único basado en el teléfono del cliente
     * Si el teléfono ya existe como usernick, agrega un sufijo numérico

    /**
     * API: Obtener detalles completos de crédito del cliente
     * Endpoint: GET /api/clientes/{id}/credito/detalles
     * Retorna: Información completa de crédito, cuentas pendientes, historial de pagos y auditoría
     */
    public function obtenerDetallesCreditoApi(ClienteModel $cliente): JsonResponse
    {
        // ✅ Autorizar: Solo roles que pueden ver este cliente
        $this->authorize('view', $cliente);

        // Obtener TODAS las cuentas por cobrar (pendientes y pagadas)
        $todasLasCuentas = $cliente->cuentasPorCobrar()
            ->with([
                'venta:id,numero,fecha,total,estado_pago',
                'pagos' => function ($q) {
                    $q->with(['tipoPago:id,nombre', 'usuario:id,name'])
                        ->orderBy('fecha_pago')
                        ->select('id', 'cuenta_por_cobrar_id', 'tipo_pago_id', 'monto', 'fecha_pago', 'numero_recibo', 'numero_pago', 'usuario_id', 'observaciones', 'estado'); // ✅ NUEVO: incluir estado y numero_pago
                },
            ])
            ->orderByDesc('fecha_vencimiento')
            ->get(['id', 'venta_id', 'monto_original', 'saldo_pendiente', 'fecha_vencimiento', 'dias_vencido', 'estado']);

        // Obtener cuentas pendientes para stats
        $cuentasPendientes = $todasLasCuentas->filter(fn($c) => $c->saldo_pendiente > 0);

        // Calcular totales
        $saldoUtilizado        = $cuentasPendientes->sum('saldo_pendiente');
        $saldoDisponible       = max(0, $cliente->limite_credito - $saldoUtilizado);
        $porcentajeUtilizacion = $cliente->limite_credito > 0 ? ($saldoUtilizado / $cliente->limite_credito) * 100 : 0;

        // Calcular cuentas vencidas
        $cuentasVencidas = $cuentasPendientes->filter(fn($c) => $c->dias_vencido > 0);

        // ✅ Obtener historial de pagos recientes SOLO de ventas a crédito (para compatibilidad)
        // Un pago está relacionado con crédito si la venta tiene una cuenta por cobrar asociada
        $historialPagos = \App\Models\Pago::whereHas('venta', function ($q) use ($cliente) {
            $q->where('cliente_id', $cliente->id)
                ->where('politica_pago', 'CREDITO'); // Solo ventas a crédito
        })
            ->with([
                'venta:id,numero,fecha,politica_pago', // ✅ NUEVO: incluir datos de venta
                'tipoPago:id,nombre',
                'usuario:id,name,email',
            ])
            ->orderByDesc('fecha_pago')
            ->limit(10)
            ->get(['id', 'venta_id', 'tipo_pago_id', 'monto', 'fecha_pago', 'numero_recibo', 'numero_pago', 'usuario_id', 'observaciones', 'estado']); // ✅ NUEVO: incluir estado y numero_pago

        // Obtener auditoría de crédito
        $auditoria = \App\Models\ClienteAudit::where('cliente_id', $cliente->id)
            ->where('accion', 'actualizar_credito')
            ->orderByDesc('created_at')
            ->with(['preventista.user:id,name', 'usuario:id,name,email'])
            ->limit(5)
            ->get(['id', 'accion', 'cambios', 'motivo', 'created_at', 'preventista_id', 'usuario_id', 'ip_address']);

        // Determinar estado del crédito
        $estado = 'normal';
        if ($porcentajeUtilizacion >= 100) {
            $estado = 'excedido';
        } elseif ($porcentajeUtilizacion >= 80) {
            $estado = 'critico';
        }

        // Verificar si hay cuentas vencidas
        if ($cuentasVencidas->count() > 0) {
            $estado = 'vencido';
        }

        return ApiResponse::success([
            'cliente'            => [
                'id'       => $cliente->id,
                'nombre'   => $cliente->nombre,
                'codigo'   => $cliente->codigo_cliente,
                'nit'      => $cliente->nit,
                'email'    => $cliente->email,
                'telefono' => $cliente->telefono,
                'activo'   => $cliente->activo,
            ],
            'credito'            => [
                'limite_credito'         => (float) $cliente->limite_credito,
                'saldo_utilizado'        => (float) $saldoUtilizado,
                'saldo_disponible'       => (float) $saldoDisponible,
                'porcentaje_utilizacion' => round($porcentajeUtilizacion, 2),
                'estado'                 => $estado,
            ],
            'cuentas_pendientes' => [
                'total'               => $cuentasPendientes->count(),
                'monto_total'         => (float) $saldoUtilizado,
                'cuentas_vencidas'    => $cuentasVencidas->count(),
                'dias_maximo_vencido' => $cuentasVencidas->max('dias_vencido') ?? 0,
                'detalles'            => $cuentasPendientes->map(fn($c) => [
                    'id'                => $c->id,
                    'venta_id'          => $c->venta_id,
                    'numero_venta'      => $c->venta?->numero,
                    'fecha_venta'       => $c->venta?->fecha,
                    'monto_original'    => (float) $c->monto_original,
                    'saldo_pendiente'   => (float) $c->saldo_pendiente,
                    'fecha_vencimiento' => $c->fecha_vencimiento->format('Y-m-d'),
                    'dias_vencido'      => $c->dias_vencido,
                    'estado'            => $c->estado,
                ]),
            ],
            'todas_las_cuentas'  => $todasLasCuentas->map(fn($c) => [
                'id'                => $c->id,
                'venta_id'          => $c->venta_id,
                'numero_venta'      => $c->venta?->numero,
                'fecha_venta'       => $c->venta?->fecha,
                'monto_original'    => (float) $c->monto_original,
                'saldo_pendiente'   => (float) $c->saldo_pendiente,
                'fecha_vencimiento' => $c->fecha_vencimiento->format('Y-m-d'),
                'dias_vencido'      => $c->dias_vencido,
                'estado'            => $c->estado,
                'pagos'             => $c->pagos->map(fn($p) => [
                    'id'            => $p->id,
                    'monto'         => (float) $p->monto,
                    'fecha_pago'    => $p->fecha_pago->format('Y-m-d H:i:s'),
                    'tipo_pago'     => $p->tipoPago?->nombre,
                    'numero_recibo' => $p->numero_recibo,
                    'numero_pago'   => $p->numero_pago, // ✅ NUEVO: incluir número único de pago
                    'usuario'       => $p->usuario?->name,
                    'observaciones' => $p->observaciones,
                    'estado'        => $p->estado, // ✅ NUEVO: incluir estado (REGISTRADO o ANULADO)
                ]),
            ]),
            'historial_pagos'    => $historialPagos->map(fn($p) => [
                'id'            => $p->id,
                'venta_id'      => $p->venta_id,
                'numero_venta'  => $p->venta?->numero, // ✅ NUEVO: número de venta
                'fecha_venta'   => $p->venta?->fecha,  // ✅ NUEVO: fecha de venta
                'monto'         => (float) $p->monto,
                'fecha_pago'    => $p->fecha_pago->format('Y-m-d H:i:s'),
                'tipo_pago'     => $p->tipoPago?->nombre,
                'numero_recibo' => $p->numero_recibo,
                'numero_pago'   => $p->numero_pago, // ✅ NUEVO: incluir número único de pago
                'usuario'       => $p->usuario?->name,
                'observaciones' => $p->observaciones,
                'estado'        => $p->estado, // ✅ NUEVO: incluir estado (REGISTRADO o ANULADO)
            ]),
            'auditoria'          => $auditoria->map(fn($a) => [
                'id'          => $a->id,
                'fecha'       => $a->created_at->format('Y-m-d H:i:s'),
                'accion'      => $a->accion,
                'cambios'     => $a->cambios,
                'motivo'      => $a->motivo,
                'responsable' => $a->usuario?->name ?? $a->preventista?->user?->name ?? 'Sistema',
            ]),
        ]);
    }

    /**
     * Genera un usernick único basado en el teléfono del cliente
     * Si el teléfono ya existe como usernick, agrega un sufijo numérico

    /**
     * API: Registrar un pago para una cuenta por cobrar
     * Endpoint: POST /api/clientes/{id}/pagos
     * Body: { cuenta_por_cobrar_id, tipo_pago_id, monto, fecha_pago, numero_recibo?, numero_transferencia?, numero_cheque?, observaciones?, moneda_id? }
     * ✅ moneda_id: opcional, por defecto 1 (BOB)
     */
    public function registrarPagoApi(ClienteModel $cliente, Request $request): JsonResponse
    {
        // ✅ Autorizar: Solo roles que pueden registrar pagos
        $this->authorize('update', $cliente);

        // Validar datos
        $validated = $request->validate([
            'cuenta_por_cobrar_id' => 'required|integer|exists:cuentas_por_cobrar,id',
            'tipo_pago_id'         => 'required|integer|exists:tipos_pago,id',
            'monto'                => 'required|numeric|min:0.01',
            'fecha_pago'           => 'required|date',
            'numero_recibo'        => 'nullable|string|max:100',
            'numero_transferencia' => 'nullable|string|max:100',
            'numero_cheque'        => 'nullable|string|max:100',
            'observaciones'        => 'nullable|string|max:500',
            'moneda_id'            => 'nullable|integer|exists:monedas,id', // ✅ NUEVO
        ]);

        try {
            // ✅ MEJORADO: Validar que existe caja abierta
            // 1️⃣ Buscar caja abierta del día actual
            $aperturaCaja = \App\Models\AperturaCaja::where('user_id', Auth::id())
                ->whereDate('fecha', today())
                ->whereDoesntHave('cierre')
                ->first();

            // 2️⃣ Si no hay caja hoy, buscar la más reciente (posiblemente de ayer)
            if (! $aperturaCaja) {
                $aperturaCaja = \App\Models\AperturaCaja::where('user_id', Auth::id())
                    ->whereDoesntHave('cierre')
                    ->latest('fecha')
                    ->first();

                // 3️⃣ Si hay una caja anterior sin cerrar, avisar pero permitir el pago
                if ($aperturaCaja) {
                    $fechaApertura = \Carbon\Carbon::parse($aperturaCaja->fecha);
                    $esDeOtroDia   = ! $fechaApertura->isToday();

                    if ($esDeOtroDia) {
                        Log::warning('Usando caja de día anterior para registrar pago', [
                            'user_id'        => Auth::id(),
                            'apertura_fecha' => $aperturaCaja->fecha,
                            'caja_id'        => $aperturaCaja->caja_id,
                            'cliente_id'     => $cliente->id,
                        ]);
                    }
                } else {
                    // 4️⃣ Si no hay ninguna caja abierta, bloquear
                    return ApiResponse::error(
                        'Debe abrir una caja antes de registrar pagos. Por favor, abra la caja primero.',
                        400
                    );
                }
            }

            // ✅ NUEVO: Obtener tipo de operación PAGO
            $tipoOperacion = \App\Models\TipoOperacionCaja::where('codigo', 'PAGO')->first();

            if (! $tipoOperacion) {
                Log::error('Tipo de operación PAGO no encontrado en la base de datos');
                return ApiResponse::error(
                    'Tipo de operación PAGO no configurado en el sistema. Contacte al administrador.',
                    500
                );
            }

            // Obtener la cuenta por cobrar
            $cuenta = \App\Models\CuentaPorCobrar::findOrFail($validated['cuenta_por_cobrar_id']);

            // Verificar que la cuenta pertenece al cliente
            if ($cuenta->cliente_id !== $cliente->id) {
                return ApiResponse::error('La cuenta no pertenece a este cliente', 403);
            }

            // Verificar que hay saldo pendiente
            if ($cuenta->saldo_pendiente <= 0) {
                return ApiResponse::error('Esta cuenta ya ha sido pagada completamente', 400);
            }

            // Verificar que el monto no exceda el saldo pendiente
            if ($validated['monto'] > $cuenta->saldo_pendiente) {
                return ApiResponse::error('El monto no puede exceder el saldo pendiente', 400);
            }

            // ✅ Crear el pago con ambos campos de fecha y moneda
            $pago = \App\Models\Pago::create([
                'numero_pago'          => \App\Models\Pago::generarNumeroPago(), // ✅ NUEVO: Número único de pago
                'cuenta_por_cobrar_id' => $validated['cuenta_por_cobrar_id'],
                'venta_id'             => $cuenta->venta_id,
                'tipo_pago_id'         => $validated['tipo_pago_id'],
                'monto'                => $validated['monto'],
                'fecha'                => now(),                    // ✅ datetime completo
                'fecha_pago'           => $validated['fecha_pago'], // ✅ date
                'numero_recibo'        => $validated['numero_recibo'] ?? null,
                'numero_transferencia' => $validated['numero_transferencia'] ?? null,
                'numero_cheque'        => $validated['numero_cheque'] ?? null,
                'observaciones'        => $validated['observaciones'] ?? null,
                'usuario_id'           => Auth::id(),
                'moneda_id'            => $validated['moneda_id'] ?? 1, // ✅ Por defecto: BOB (id=1)
                'estado'               => 'REGISTRADO', // ✅ Estado inicial
            ]);

            // Actualizar el saldo pendiente de la cuenta
            $nuevoSaldo  = $cuenta->saldo_pendiente - $validated['monto'];
            $nuevoEstado = $nuevoSaldo > 0 ? 'PARCIAL' : 'PAGADO';

            $cuenta->update([
                'saldo_pendiente' => $nuevoSaldo,
                'estado'          => $nuevoEstado,
            ]);

            // ✅ Si la cuenta se pagó completamente, actualizar estado en la venta
            if ($nuevoEstado === 'PAGADO') {
                $venta = $cuenta->venta;
                if ($venta) {
                    $venta->update([
                        'estado_pago'     => 'PAGADO',
                        'monto_pagado'    => $venta->total, // ✅ Campo correcto: 'total', no 'monto_total'
                        'monto_pendiente' => 0,
                    ]);
                }
            }

            // ✅ NUEVO: Registrar movimiento en caja
            // ✅ MEJORADO: Siempre incluir número de venta en observaciones
            $venta       = $cuenta->venta;
            $numeroVenta = $venta ? $venta->numero : 'SIN_VENTA';

            // Construir observaciones: observaciones del usuario + número de venta
            $observacionesCaja = 'Pago de cuota - Venta #' . $numeroVenta;
            if (! empty($validated['observaciones'])) {
                $observacionesCaja = $validated['observaciones'] . "\n" . $observacionesCaja;
            }

            // ✅ MEJORADO: Usar numero_pago como número_documento en la caja (respeta el número único de pago)
            // Mantener numero_recibo en observaciones si existe
            if (! empty($validated['numero_recibo'])) {
                $observacionesCaja .= "\nRecibo: {$validated['numero_recibo']}";
            }

            \App\Models\MovimientoCaja::create([
                'caja_id'           => $aperturaCaja->caja_id,
                'user_id'           => Auth::id(),
                'fecha'             => now(),
                'monto'             => $validated['monto'],
                'observaciones'     => $observacionesCaja,
                'numero_documento'  => $pago->numero_pago, // ✅ MEJORADO: Usar numero_pago único del pago
                'tipo_operacion_id' => $tipoOperacion->id,
                'tipo_pago_id'      => $validated['tipo_pago_id'], // ✅ NUEVO: Guardar tipo de pago para análisis
                'pago_id'           => $pago->id,                  // ✅ NUEVO: Guardar ID de pago para rango
            ]);

            // ✅ NUEVO: Disparar evento para notificación WebSocket
            event(new CreditoPagoRegistrado($pago, $cuenta->fresh()));

            return ApiResponse::success([
                'pago'   => [
                    'id'            => $pago->id,
                    'numero_pago'   => $pago->numero_pago, // ✅ NUEVO: Número de pago
                    'monto'         => $pago->monto,
                    'fecha_pago'    => $pago->fecha_pago,
                    'tipo_pago'     => $pago->tipoPago?->nombre,
                    'numero_recibo' => $pago->numero_recibo,
                    'estado'        => $pago->estado,
                ],
                'cuenta' => [
                    'id'              => $cuenta->id,
                    'saldo_anterior'  => $cuenta->getOriginal('saldo_pendiente'),
                    'saldo_pendiente' => $nuevoSaldo,
                    'estado'          => $nuevoEstado,
                ],
            ], 'Pago registrado exitosamente y movimiento de caja creado', 201);

        } catch (\Exception $e) {
            Log::error('Error al registrar pago:', [
                'cliente_id' => $cliente->id,
                'error'      => $e->getMessage(),
                'trace'      => $e->getTraceAsString(),
            ]);
            return ApiResponse::error('Error al registrar el pago: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Anula un pago registrado y revierte todos sus movimientos
     *
     * Revierte:
     * - Saldo pendiente de la cuenta por cobrar
     * - Estado de la cuenta (vuelve a PARCIAL si estaba PAGADO)
     * - Estado de pago en la venta (vuelve a PARCIAL si estaba PAGADO)
     * - Crea movimiento de caja inverso (ANULACION)
     *
     * @param  int $pagoId ID del pago a anular
     * @param  Request $request Con campo 'motivo' (opcional)
     * @return JsonResponse
     */
    public function anularPago(int $pagoId, Request $request): JsonResponse
    {
        try {
            // ✅ 1️⃣ Validación inicial
            $validated = $request->validate([
                'motivo' => 'nullable|string|max:500',
            ]);

            // ✅ 2️⃣ Buscar el pago
            $pago = \App\Models\Pago::findOrFail($pagoId);

            Log::info('🟠 [ANULAR PAGO] INICIO', [
                'pago_id' => $pago->id,
                'cliente_id' => $pago->cuentaPorCobrar?->cliente_id,
                'monto' => $pago->monto,
            ]);

            // ✅ 3️⃣ Validar autorización
            $this->authorize('update', $pago->cuentaPorCobrar->cliente);

            // ✅ 4️⃣ Validar que existe cuenta por cobrar
            $cuenta = $pago->cuentaPorCobrar;
            if (!$cuenta) {
                return ApiResponse::error('Cuenta por cobrar no encontrada para este pago', 404);
            }

            // ✅ 5️⃣ Procesar anulación en transacción (SIN crear MovimientoCaja)
            DB::transaction(function () use (
                $pago,
                $cuenta,
                $validated
            ) {
                // ✅ Recuperar valores anteriores para auditoría
                $montoAnulado = $pago->monto;
                $saldobAnterior = $cuenta->saldo_pendiente;

                // ✅ Aumentar saldo pendiente (revertir descuento)
                $nuevoSaldo = $cuenta->saldo_pendiente + $montoAnulado;

                // ✅ Determinar nuevo estado
                // Si el saldo ahora es > 0, la cuenta vuelve a PARCIAL
                $nuevoEstado = $nuevoSaldo > 0 ? 'PARCIAL' : 'PAGADO';

                // ✅ Actualizar cuenta por cobrar
                $cuenta->update([
                    'saldo_pendiente' => $nuevoSaldo,
                    'estado' => $nuevoEstado,
                ]);

                Log::info('✅ [ANULAR PAGO] Cuenta actualizada', [
                    'cuenta_id' => $cuenta->id,
                    'saldo_anterior' => $saldobAnterior,
                    'saldo_nuevo' => $nuevoSaldo,
                    'estado' => $nuevoEstado,
                ]);

                // ✅ Cambiar estado del pago a ANULADO
                $pago->update([
                    'estado' => 'ANULADO',
                ]);

                Log::info('✅ [ANULAR PAGO] Pago marcado como ANULADO', [
                    'pago_id' => $pago->id,
                    'estado' => 'ANULADO',
                ]);

                // ✅ Si la cuenta vuelve a PARCIAL (había sido PAGADO), actualizar venta
                if ($nuevoEstado === 'PARCIAL') {
                    $venta = $cuenta->venta;
                    if ($venta) {
                        $venta->update([
                            'estado_pago' => 'PARCIAL',
                            'monto_pendiente' => $nuevoSaldo,
                            'monto_pagado' => $venta->total - $nuevoSaldo,
                        ]);

                        Log::info('✅ [ANULAR PAGO] Venta revertida a PARCIAL', [
                            'venta_id' => $venta->id,
                            'estado_pago' => 'PARCIAL',
                        ]);
                    }
                }

                // ✅ MEJORADO: NO crear movimiento de caja de reversión
                // El estado ANULADO del pago es suficiente para que CierreCajaService lo excluya de los cálculos
                // Esto evita duplicar registros en la tabla movimientos_caja

                Log::info('✅ [ANULAR PAGO] Pago anulado sin crear MovimientoCaja de reversión', [
                    'pago_id' => $pago->id,
                    'numero_pago' => $pago->numero_pago,
                    'monto_anulado' => $montoAnulado,
                ]);
            });

            Log::info('🟢 [ANULAR PAGO] COMPLETADO', [
                'pago_id' => $pago->id,
                'monto_anulado' => $pago->monto,
                'motivo' => $validated['motivo'] ?? 'Sin especificar',
            ]);

            return ApiResponse::success([
                'pago_id' => $pago->id,
                'monto_anulado' => $pago->monto,
                'cuenta' => [
                    'id' => $cuenta->id,
                    'saldo_pendiente' => $cuenta->fresh()->saldo_pendiente,
                    'estado' => $cuenta->fresh()->estado,
                ],
            ], 'Pago anulado exitosamente', 200);

        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            Log::warning('⚠️ [ANULAR PAGO] Acceso denegado', [
                'pago_id' => $pagoId,
                'user_id' => Auth::id(),
            ]);
            return ApiResponse::error('No tienes permiso para anular este pago', 403);
        } catch (\Exception $e) {
            Log::error('❌ [ANULAR PAGO] ERROR', [
                'pago_id' => $pagoId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return ApiResponse::error('Error al anular el pago: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Genera un usernick único basado en el teléfono del cliente
     * Si el teléfono ya existe como usernick, agrega un sufijo numérico
     */
    private function generarUsernickUnico(string $telefono): string
    {
        $baseUsernick = $telefono; // Usar teléfono directamente como base
        $usernick     = $baseUsernick;

        // Verificar si el usernick ya existe y agregar número si es necesario
        while (User::where('usernick', $usernick)->exists()) {
            $usernick = $baseUsernick;
        }

        return $usernick;
    }

    /**
     * Permite a un cliente cambiar su usernick y contraseña
     */
    public function cambiarCredenciales(ChangeClienteCredentialsRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Data already validated by ChangeClienteCredentialsRequest
        $validated = $request->validated();

        // Preparar datos para actualizar
        $userUpdates = [
            'usernick' => $validated['usernick'],
            'password' => Hash::make($validated['password_nueva']),
        ];

        // Agregar email solo si se proporciona
        if ($request->filled('email')) {
            $userUpdates['email']             = $validated['email'];
            $userUpdates['email_verified_at'] = now();
        } elseif ($request->has('email') && $request->email === null) {
            // Si se envía email como null, quitar el email
            $userUpdates['email']             = null;
            $userUpdates['email_verified_at'] = null;
        }

        // Actualizar credenciales
        if ($user) {
            $user->update($userUpdates);
        }

        return ApiResponse::success(null, 'Credenciales actualizadas exitosamente');
    }

    /**
     * Convierte diferentes formatos de valores booleanos a boolean real
     */
    private function convertToBoolean($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_string($value)) {
            $lowerValue = strtolower($value);

            return in_array($lowerValue, ['true', '1', 'yes', 'on']);
        }

        if (is_numeric($value)) {
            return $value == 1;
        }

        return false;
    }

    /**
     * Genera el nombre de carpeta para las imágenes del cliente
     * Formato: clientes/{idCliente}_{fechaRegistro}
     */
    private function generateClientFolderName(ClienteModel $cliente): string
    {
        $fechaRegistro = $cliente->fecha_registro->format('Y-m-d');

        return "clientes/{$cliente->id}_{$fechaRegistro}";
    }

    /**
     * Sincroniza las ventanas de entrega del cliente.
     * Si se envía el arreglo, reemplaza las existentes por simplicidad.
     */
    private function syncVentanasEntrega(ClienteModel $cliente, ?array $ventanas): void
    {
        if ($ventanas === null) {
            return;
        }

        // Reemplazar existentes
        $cliente->ventanasEntrega()->delete();

        foreach ($ventanas as $ventana) {
            if (isset($ventana['hora_inicio'], $ventana['hora_fin']) && $ventana['hora_inicio'] >= $ventana['hora_fin']) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'ventanas_entrega' => ['La hora de inicio debe ser menor a la hora de fin.'],
                ]);
            }
            if (! isset($ventana['dia_semana'])) {
                continue;
            }

            $cliente->ventanasEntrega()->create([
                'dia_semana'  => (int) $ventana['dia_semana'],
                'hora_inicio' => $ventana['hora_inicio'],
                'hora_fin'    => $ventana['hora_fin'],
                'activo'      => isset($ventana['activo']) ? (bool) $ventana['activo'] : true,
            ]);
        }
    }

    /**
     * Sincroniza las categorías del cliente si se envían.
     */
    private function syncCategorias(ClienteModel $cliente, ?array $categoriasIds): void
    {
        // 🔍 DEBUG: Mostrar datos antes de sincronizar
        Log::info('🔄 ANTES DE SINCRONIZAR CATEGORÍAS', [
            'cliente_id' => $cliente->id,
            'categorias_actuales' => $cliente->categorias()->pluck('categorias_cliente.id')->toArray(),
            'categorias_ids_nuevas' => $categoriasIds,
        ]);

        if ($categoriasIds === null) {
            Log::info('⚠️ categoriasIds es null, no se sincroniza', ['cliente_id' => $cliente->id]);
            return;
        }

        $resultado = $cliente->categorias()->sync($categoriasIds);

        // 🔍 DEBUG: Mostrar resultado de sync
        Log::info('🔄 DESPUÉS DE SINCRONIZAR CATEGORÍAS', [
            'cliente_id' => $cliente->id,
            'sync_resultado' => $resultado,
            'categorias_ahora' => $cliente->categorias()->pluck('categorias_cliente.id')->toArray(),
            'categorias_con_datos' => $cliente->categorias()->get()->toArray(),
        ]);
    }

    /**
     * Crea un usuario asociado al cliente
     */
    private function createUserForCliente(ClienteModel $cliente, string $password): void
    {
        $usernick = $this->generarUsernickUnico($cliente->telefono);

        $userData = [
            'name'     => $cliente->nombre,
            'usernick' => $usernick,
            'password' => Hash::make($password),
            'activo'   => true,
        ];

        if ($cliente->email) {
            $userData['email']             = $cliente->email;
            $userData['email_verified_at'] = now();
        }

        $user = User::create($userData);
        $this->assignClientRoleOptimized($user);

        // Actualizar el cliente con el user_id
        $cliente->update(['user_id' => $user->id]);
    }

    // ============================================
    // ✅ FASE 3: NUEVOS MÉTODOS PARA CRÉDITOS
    // ============================================

    /**
     * Obtener cuentas pendientes de un cliente
     */
    public function obtenerCuentasPendientes(ClienteModel $cliente): JsonResponse
    {
        try {
            $cuentas = $cliente->cuentasPorCobrar()
                ->where('estado', '!=', 'pagada')
                ->with('venta')
                ->orderBy('fecha_vencimiento', 'asc')
                ->get();

            return ApiResponse::success($cuentas->toArray(), 'Cuentas pendientes obtenidas', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al obtener cuentas pendientes: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Obtener cuentas vencidas de un cliente
     */
    public function obtenerCuentasVencidas(ClienteModel $cliente): JsonResponse
    {
        try {
            $cuentas = $cliente->cuentasPorCobrar()
                ->where('estado', 'vencida')
                ->with('venta')
                ->orderBy('dias_vencido', 'desc')
                ->get();

            return ApiResponse::success($cuentas->toArray(), 'Cuentas vencidas obtenidas', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al obtener cuentas vencidas: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Obtener historial de pagos de un cliente
     */
    public function obtenerHistorialPagos(ClienteModel $cliente, Request $request): JsonResponse
    {
        try {
            $limit = $request->integer('limit', 10);

            $pagos = \App\Models\Pago::whereHas('cuentaPorCobrar', function ($q) use ($cliente) {
                $q->where('cliente_id', $cliente->id);
            })
                ->with('cuentaPorCobrar')
                ->orderBy('fecha_pago', 'desc')
                ->limit($limit)
                ->get();

            return ApiResponse::success($pagos->toArray(), 'Historial de pagos obtenido', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al obtener historial de pagos: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Listar todos los créditos (admin)
     */
    public function listarCreditos(Request $request): JsonResponse
    {
        try {
            $clientes = ClienteModel::with('cuentasPorCobrar')
                ->where('puede_tener_credito', true)
                ->paginate($request->integer('per_page', 15));

            // Transform data to include credit info
            $creditoData = $clientes->map(function ($cliente) {
                $cuentasPendientes = $cliente->cuentasPorCobrar;

                // Credit limit is stored directly in Cliente model
                $limiteCredito         = (float) $cliente->limite_credito ?? 0;
                $saldoPendiente        = $cuentasPendientes->sum('saldo_pendiente') ?? 0;
                $saldoDisponible       = $limiteCredito - $saldoPendiente;
                $porcentajeUtilizacion = $limiteCredito > 0 ? round(($saldoPendiente / $limiteCredito) * 100, 2) : 0;

                // Determine credit status
                $estado = 'disponible';
                if ($saldoPendiente > 0) {
                    if ($porcentajeUtilizacion > 100) {
                        $estado = 'excedido';
                    } elseif ($porcentajeUtilizacion > 80) {
                        $estado = 'critico';
                    } else {
                        $estado = 'en_uso';
                    }
                }

                // Count overdue accounts
                $cuentasVencidas = $cuentasPendientes->filter(function ($cuenta) {
                    return $cuenta->dias_vencido && $cuenta->dias_vencido > 0;
                })->count();

                return [
                    'id'                     => $cliente->id,
                    'nombre'                 => $cliente->nombre,
                    'email'                  => $cliente->email,
                    'limite_credito'         => (float) $limiteCredito,
                    'saldo_disponible'       => (float) max(0, $saldoDisponible),
                    'saldo_utilizado'        => (float) $saldoPendiente,
                    'porcentaje_utilizacion' => (float) $porcentajeUtilizacion,
                    'estado'                 => $estado,
                    'cuentas_pendientes'     => $cuentasPendientes->count(),
                    'cuentas_vencidas'       => $cuentasVencidas,
                ];
            });

            return ApiResponse::success([
                'data'       => $creditoData->values()->toArray(),
                'pagination' => [
                    'total'        => $clientes->total(),
                    'per_page'     => $clientes->perPage(),
                    'current_page' => $clientes->currentPage(),
                    'last_page'    => $clientes->lastPage(),
                ],
            ], 'Créditos obtenidos', 200);
        } catch (\Exception $e) {
            \Log::error('Error al listar créditos: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return ApiResponse::error('Error al listar créditos: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Obtener crédito del usuario actual
     */
    public function obtenerMiCredito(): JsonResponse
    {
        try {
            /** @var User $user */
            $user = Auth::user();

            $cliente = $user->cliente;
            if (! $cliente) {
                return ApiResponse::error('Usuario no tiene cliente asociado', 404);
            }

            if (! $cliente->puede_tener_credito || $cliente->limite_credito <= 0) {
                return ApiResponse::error('Cliente no tiene crédito disponible', 404);
            }

            // Load credit data
            $cliente->load('cuentasPorCobrar');
            $cuentasPendientes = $cliente->cuentasPorCobrar;

            $limiteCredito         = (float) $cliente->limite_credito;
            $saldoPendiente        = $cuentasPendientes->sum('saldo_pendiente') ?? 0;
            $saldoDisponible       = $limiteCredito - $saldoPendiente;
            $porcentajeUtilizacion = $limiteCredito > 0 ? round(($saldoPendiente / $limiteCredito) * 100, 2) : 0;

            $creditoData = [
                'id'                     => $cliente->id,
                'cliente_id'             => $cliente->id,
                'cliente_nombre'         => $cliente->nombre,
                'limite_credito'         => $limiteCredito,
                'saldo_disponible'       => (float) max(0, $saldoDisponible),
                'saldo_utilizado'        => (float) $saldoPendiente,
                'porcentaje_utilizacion' => (float) $porcentajeUtilizacion,
                'cuentas_pendientes'     => $cuentasPendientes->count(),
                'cuentas_vencidas'       => $cuentasPendientes->filter(function ($cuenta) {
                    return $cuenta->dias_vencido && $cuenta->dias_vencido > 0;
                })->count(),
            ];

            return ApiResponse::success($creditoData, 'Crédito obtenido', 200);
        } catch (\Exception $e) {
            \Log::error('Error al obtener mi crédito: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return ApiResponse::error('Error al obtener crédito: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Obtener resumen de crédito de un cliente
     */
    public function obtenerResumenCredito(Request $request): JsonResponse
    {
        try {
            $clienteId = $request->integer('clienteId');

            $cliente = ClienteModel::findOrFail($clienteId);
            $credito = $cliente->credito;

            if (! $credito) {
                return ApiResponse::error('Cliente no tiene crédito', 404);
            }

            $resumen = [
                'cliente_id'           => $cliente->id,
                'cliente_nombre'       => $cliente->nombre,
                'limite_credito'       => $credito->limite_credito_aprobado,
                'saldo_disponible'     => $credito->saldo_disponible,
                'saldo_utilizado'      => $credito->saldo_utilizado,
                'porcentaje_utilizado' => $credito->porcentaje_utilizado,
                'estado'               => $credito->estado,
                'cuentas_pendientes'   => $cliente->cuentasPorCobrar()->where('estado', '!=', 'pagada')->count(),
                'cuentas_vencidas'     => $cliente->cuentasPorCobrar()->where('estado', 'vencida')->count(),
            ];

            return ApiResponse::success($resumen, 'Resumen de crédito obtenido', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al obtener resumen: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Obtener estadísticas de créditos
     */
    public function obtenerEstadisticasCreditos(): JsonResponse
    {
        try {
            $stats = [
                'total_clientes'         => ClienteModel::count(),
                'clientes_con_credito'   => ClienteModel::where('puede_tener_credito', true)->count(),
                'credito_total_aprobado' => \App\Models\Credito::sum('limite_credito_aprobado'),
                'credito_utilizado'      => \App\Models\Credito::sum('saldo_utilizado'),
                'credito_disponible'     => \App\Models\Credito::sum('saldo_disponible'),
                'clientes_criticos'      => \App\Models\Credito::where('estado', 'critico')->count(),
                'clientes_excedidos'     => \App\Models\Credito::where('estado', 'excedido')->count(),
                'cuentas_vencidas_total' => \App\Models\CuentaPorCobrar::where('estado', 'vencida')->count(),
            ];

            return ApiResponse::success($stats, 'Estadísticas obtenidas', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al obtener estadísticas: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Exportar reporte de créditos
     */
    public function exportarReporteCreditos(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        try {
            $formato = $request->string('formato', 'pdf');

            // Obtener datos de créditos
            $creditos = ClienteModel::with('credito')
                ->where('puede_tener_credito', true)
                ->get();

            // TODO: Implementar exportación a PDF o Excel
            // Por ahora, retornar JSON
            return response()->json([
                'success' => true,
                'message' => 'Exportación de créditos en proceso',
                'format'  => $formato,
                'data'    => $creditos,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al exportar: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Ajustar límite de crédito de un cliente
     */
    public function ajustarLimiteCredito(ClienteModel $cliente, Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nuevo_limite' => 'required|numeric|min:0',
                'razon'        => 'nullable|string|max:500',
            ]);

            $credito = $cliente->credito;
            if (! $credito) {
                return ApiResponse::error('Cliente no tiene crédito', 404);
            }

            $limiteAnterior = $credito->limite_credito_aprobado;

            $credito->update([
                'limite_credito_aprobado' => $validated['nuevo_limite'],
                'saldo_disponible'        => $validated['nuevo_limite'] - $credito->saldo_utilizado,
            ]);

            Log::info('Límite de crédito ajustado', [
                'cliente_id'      => $cliente->id,
                'limite_anterior' => $limiteAnterior,
                'limite_nuevo'    => $validated['nuevo_limite'],
                'razon'           => $validated['razon'] ?? 'Sin especificar',
                'usuario_id'      => Auth::id(),
            ]);

            return ApiResponse::success($credito->toArray(), 'Límite de crédito ajustado exitosamente', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al ajustar límite: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Aplica filtros a la query de clientes
     */
    private function applyFilters($query, Request $request): void
    {
        // Filtro de búsqueda (case-insensitive)
        if ($request->filled('q')) {
            $searchLower = strtolower($request->string('q'));
            $query->where(function ($subQuery) use ($searchLower) {
                $subQuery->whereRaw('LOWER(nombre) like ?', ["%$searchLower%"])
                    ->orWhereRaw('LOWER(razon_social) like ?', ["%$searchLower%"])
                    ->orWhereRaw('LOWER(nit) like ?', ["%$searchLower%"])
                    ->orWhereRaw('LOWER(telefono) like ?', ["%$searchLower%"])
                    ->orWhereRaw('LOWER(codigo_cliente) like ?', ["%$searchLower%"]);
            });
        }

        // Filtro de estado activo
        if ($request->has('activo') && $request->activo !== 'all') {
            $query->where('activo', $request->boolean('activo'));
        }

        // Filtro de localidad
        if ($request->filled('localidad_id')) {
            $query->where('localidad_id', $request->integer('localidad_id'));
        }

        // Ordenamiento
        $orderBy  = $request->string('order_by', 'id');
        $orderDir = $request->string('order_dir', 'desc');

        $allowedOrderBy = ['id', 'nombre', 'fecha_registro'];
        if (in_array($orderBy, $allowedOrderBy)) {
            $query->orderBy($orderBy, in_array($orderDir, ['asc', 'desc']) ? $orderDir : 'desc');
        }
    }

    /**
     * API: Imprimir/Descargar reporte de crédito
     * Endpoint: GET /api/clientes/{id}/credito/imprimir?formato=A4&accion=download&cuenta_id=1
     * Parámetros:
     *   - formato: 'A4' | 'TICKET_80' | 'TICKET_58'
     *   - accion: 'download' | 'stream'
     *   - cuenta_id: (opcional) ID de cuenta específica para imprimir solo esa cuenta
     */
    public function imprimirCredito(ClienteModel $cliente, Request $request): \Symfony\Component\HttpFoundation\Response
    {
        try {
            $this->authorize('view', $cliente);

            $formato  = (string) $request->string('formato', 'A4');
            $accion   = (string) $request->string('accion', 'stream');
            $cuentaId = $request->integer('cuenta_id', 0);

            // Validar formato
            $formatosValidos = ['A4', 'TICKET_80', 'TICKET_58'];
            if (! in_array($formato, $formatosValidos)) {
                return response()->json(['error' => 'Formato inválido'], 400);
            }

            // Obtener detalles de crédito
            $response    = $this->obtenerDetallesCreditoApi($cliente);
            $creditoData = json_decode($response->getContent(), true)['data'] ?? [];

            // Filtrar cuenta específica si se especifica cuenta_id
            $todasLasCuentas = collect($creditoData['todas_las_cuentas'] ?? []);
            if ($cuentaId > 0) {
                $todasLasCuentas = $todasLasCuentas->filter(fn($c) => $c['id'] == $cuentaId);
            }

            // Preparar datos para la plantilla
            $datos = [
                'cliente'              => [
                    'id'             => $cliente->id,
                    'nombre'         => $cliente->nombre,
                    'codigo_cliente' => $cliente->codigo_cliente,
                    'nit'            => $cliente->nit,
                    'email'          => $cliente->email,
                    'telefono'       => $cliente->telefono,
                ],
                'credito'              => $creditoData['credito'] ?? [],
                'cuentas_pendientes'   => $creditoData['cuentas_pendientes'] ?? [],
                'todas_las_cuentas'    => $todasLasCuentas,
                'es_cuenta_individual' => $cuentaId > 0,
                'fecha_impresion'      => now(),
                'usuario'              => auth()->user()?->name ?? 'Sistema',
                'empresa'              => \App\Models\Empresa::first(),
                'opciones'             => ['porcentaje_impuesto' => '13'],
            ];

            // Obtener template
            $template = match ($formato) {
                'A4'        => 'impresion.creditos.hoja-completa',
                'TICKET_80' => 'impresion.creditos.ticket-80',
                'TICKET_58' => 'impresion.creditos.ticket-58',
            };

            // Generar PDF
            $pdf = \PDF::loadView($template, $datos);

            // Aplicar configuración de formato
            $this->aplicarConfiguracionFormato($pdf, $formato);

            // Nombre del archivo
            $nombreArchivo = 'Credito_' . $cliente->codigo_cliente . '_' . now()->format('Ymd_His') . '.pdf';

            // Retornar PDF
            if ($accion === 'download') {
                return $pdf->download($nombreArchivo);
            } else {
                return $pdf->stream($nombreArchivo);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Error al generar reporte de crédito',
                'mensaje' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API: Vista previa HTML de reporte de crédito
     * Endpoint: GET /api/clientes/{id}/credito/preview?formato=A4&cuenta_id=1
     */
    public function previewCredito(ClienteModel $cliente, Request $request)
    {
        try {
            $this->authorize('view', $cliente);

            $formato  = (string) $request->string('formato', 'A4');
            $cuentaId = $request->integer('cuenta_id', 0);

            // Validar formato
            $formatosValidos = ['A4', 'TICKET_80', 'TICKET_58'];
            if (! in_array($formato, $formatosValidos)) {
                abort(400, 'Formato inválido');
            }

            // Obtener detalles de crédito
            $response    = $this->obtenerDetallesCreditoApi($cliente);
            $creditoData = json_decode($response->getContent(), true)['data'] ?? [];

            // Filtrar cuenta específica si se especifica cuenta_id
            $todasLasCuentas = collect($creditoData['todas_las_cuentas'] ?? []);
            if ($cuentaId > 0) {
                $todasLasCuentas = $todasLasCuentas->filter(fn($c) => $c['id'] == $cuentaId);
            }

            // Preparar datos para la plantilla
            $datos = [
                'cliente'              => [
                    'id'             => $cliente->id,
                    'nombre'         => $cliente->nombre,
                    'codigo_cliente' => $cliente->codigo_cliente,
                    'nit'            => $cliente->nit,
                    'email'          => $cliente->email,
                    'telefono'       => $cliente->telefono,
                ],
                'credito'              => $creditoData['credito'] ?? [],
                'cuentas_pendientes'   => $creditoData['cuentas_pendientes'] ?? [],
                'todas_las_cuentas'    => $todasLasCuentas,
                'es_cuenta_individual' => $cuentaId > 0,
                'fecha_impresion'      => now(),
                'usuario'              => auth()->user()?->name ?? 'Sistema',
                'empresa'              => \App\Models\Empresa::first(),
                'opciones'             => ['porcentaje_impuesto' => '13'],
            ];

            // Obtener template
            $template = match ($formato) {
                'A4'        => 'impresion.creditos.hoja-completa',
                'TICKET_80' => 'impresion.creditos.ticket-80',
                'TICKET_58' => 'impresion.creditos.ticket-58',
            };

            return view($template, $datos);
        } catch (\Exception $e) {
            abort(500, 'Error al cargar vista previa: ' . $e->getMessage());
        }
    }

    /**
     * API: Generar PDF de comprobante de pago
     * Endpoint: GET /api/clientes/{cliente}/pagos/{pago}/imprimir?formato=A4&accion=stream
     */
    public function imprimirPago(ClienteModel $cliente, \App\Models\Pago $pago, Request $request): \Symfony\Component\HttpFoundation\Response
    {
        try {
            $this->authorize('view', $cliente);

            // Validar que el pago pertenece al cliente
            if ($pago->cuentaPorCobrar && $pago->cuentaPorCobrar->cliente_id !== $cliente->id) {
                return response()->json(['error' => 'El pago no pertenece a este cliente'], 403);
            }

            $formato = (string) $request->string('formato', 'TICKET_80');
            $accion  = (string) $request->string('accion', 'stream');

            // Validar formato
            $formatosValidos = ['A4', 'TICKET_80', 'TICKET_58'];
            if (! in_array($formato, $formatosValidos)) {
                return response()->json(['error' => 'Formato inválido'], 400);
            }

            // Eager load relaciones
            $pago->load(['cuentaPorCobrar.venta', 'venta.cliente', 'tipoPago', 'moneda', 'usuario']);

            // Obtener datos de venta y cuenta
            $venta  = null;
            $cuenta = null;

            if ($pago->cuentaPorCobrar) {
                $cpc   = $pago->cuentaPorCobrar;
                $venta = $cpc->venta ? [
                    'id'     => $cpc->venta->id,
                    'numero' => $cpc->venta->numero,
                    'fecha'  => $cpc->venta->fecha,
                    'total'  => $cpc->venta->total,
                ] : null;

                $cuenta = [
                    'id'                => $cpc->id,
                    'monto_original'    => $cpc->monto_original,
                    'saldo_anterior'    => $cpc->saldo_pendiente + $pago->monto,
                    'saldo_pendiente'   => $cpc->saldo_pendiente,
                    'estado'            => $cpc->estado,
                    'fecha_vencimiento' => $cpc->fecha_vencimiento,
                ];
            } elseif ($pago->venta) {
                $venta = [
                    'id'     => $pago->venta->id,
                    'numero' => $pago->venta->numero,
                    'fecha'  => $pago->venta->fecha,
                    'total'  => $pago->venta->total,
                ];
            }

            // Preparar estructura de datos
            $datos = [
                'pago'            => [
                    'id'                   => $pago->id,
                    'monto'                => $pago->monto,
                    'fecha'                => $pago->fecha,
                    'fecha_pago'           => $pago->fecha_pago,
                    'numero_recibo'        => $pago->numero_recibo,
                    'numero_transferencia' => $pago->numero_transferencia,
                    'numero_cheque'        => $pago->numero_cheque,
                    'observaciones'        => $pago->observaciones,
                    'tipo_pago'            => $pago->tipoPago?->nombre ?? 'No especificado',
                    'moneda'               => [
                        'simbolo' => $pago->moneda?->simbolo ?? 'Bs.',
                        'codigo'  => $pago->moneda?->codigo ?? 'BOB',
                    ],
                    'usuario'              => $pago->usuario?->name ?? 'Sistema',
                ],
                'cliente'         => [
                    'id'             => $cliente->id,
                    'nombre'         => $cliente->nombre,
                    'codigo_cliente' => $cliente->codigo_cliente,
                    'nit'            => $cliente->nit,
                    'email'          => $cliente->email,
                    'telefono'       => $cliente->telefono,
                ],
                'venta'           => $venta,
                'cuenta'          => $cuenta,
                'fecha_impresion' => now(),
                'usuario'         => auth()->user()?->name ?? 'Sistema',
                'empresa'         => \App\Models\Empresa::first(),
            ];

            // Obtener template
            $template = match ($formato) {
                'A4'        => 'impresion.pagos.hoja-completa',
                'TICKET_80' => 'impresion.pagos.ticket-80',
                'TICKET_58' => 'impresion.pagos.ticket-58',
            };

            // Generar PDF
            $pdf = \PDF::loadView($template, $datos);

            // Aplicar configuración de formato
            $this->aplicarConfiguracionFormato($pdf, $formato);

            // Nombre del archivo
            $nombreArchivo = 'Pago_' . $cliente->codigo_cliente . '_' . $pago->id . '_' . now()->format('Ymd_His') . '.pdf';

            // Retornar PDF
            if ($accion === 'download') {
                return $pdf->download($nombreArchivo);
            } else {
                return $pdf->stream($nombreArchivo);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Error al generar comprobante de pago',
                'mensaje' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API: Vista previa HTML de comprobante de pago
     * Endpoint: GET /api/clientes/{cliente}/pagos/{pago}/preview?formato=A4
     */
    public function previewPago(ClienteModel $cliente, \App\Models\Pago $pago, Request $request)
    {
        try {
            $this->authorize('view', $cliente);

            // Validar que el pago pertenece al cliente
            if ($pago->cuentaPorCobrar && $pago->cuentaPorCobrar->cliente_id !== $cliente->id) {
                abort(403, 'El pago no pertenece a este cliente');
            }

            $formato = (string) $request->string('formato', 'TICKET_80');

            // Validar formato
            $formatosValidos = ['A4', 'TICKET_80', 'TICKET_58'];
            if (! in_array($formato, $formatosValidos)) {
                abort(400, 'Formato inválido');
            }

            // Eager load relaciones
            $pago->load(['cuentaPorCobrar.venta', 'venta.cliente', 'tipoPago', 'moneda', 'usuario']);

            // Obtener datos de venta y cuenta
            $venta  = null;
            $cuenta = null;

            if ($pago->cuentaPorCobrar) {
                $cpc   = $pago->cuentaPorCobrar;
                $venta = $cpc->venta ? [
                    'id'     => $cpc->venta->id,
                    'numero' => $cpc->venta->numero,
                    'fecha'  => $cpc->venta->fecha,
                    'total'  => $cpc->venta->total,
                ] : null;

                $cuenta = [
                    'id'                => $cpc->id,
                    'monto_original'    => $cpc->monto_original,
                    'saldo_anterior'    => $cpc->saldo_pendiente + $pago->monto,
                    'saldo_pendiente'   => $cpc->saldo_pendiente,
                    'estado'            => $cpc->estado,
                    'fecha_vencimiento' => $cpc->fecha_vencimiento,
                ];
            } elseif ($pago->venta) {
                $venta = [
                    'id'     => $pago->venta->id,
                    'numero' => $pago->venta->numero,
                    'fecha'  => $pago->venta->fecha,
                    'total'  => $pago->venta->total,
                ];
            }

            // Preparar estructura de datos
            $datos = [
                'pago'            => [
                    'id'                   => $pago->id,
                    'monto'                => $pago->monto,
                    'fecha'                => $pago->fecha,
                    'fecha_pago'           => $pago->fecha_pago,
                    'numero_recibo'        => $pago->numero_recibo,
                    'numero_transferencia' => $pago->numero_transferencia,
                    'numero_cheque'        => $pago->numero_cheque,
                    'observaciones'        => $pago->observaciones,
                    'tipo_pago'            => $pago->tipoPago?->nombre ?? 'No especificado',
                    'moneda'               => [
                        'simbolo' => $pago->moneda?->simbolo ?? 'Bs.',
                        'codigo'  => $pago->moneda?->codigo ?? 'BOB',
                    ],
                    'usuario'              => $pago->usuario?->name ?? 'Sistema',
                ],
                'cliente'         => [
                    'id'             => $cliente->id,
                    'nombre'         => $cliente->nombre,
                    'codigo_cliente' => $cliente->codigo_cliente,
                    'nit'            => $cliente->nit,
                    'email'          => $cliente->email,
                    'telefono'       => $cliente->telefono,
                ],
                'venta'           => $venta,
                'cuenta'          => $cuenta,
                'fecha_impresion' => now(),
                'usuario'         => auth()->user()?->name ?? 'Sistema',
                'empresa'         => \App\Models\Empresa::first(),
            ];

            // Obtener template
            $template = match ($formato) {
                'A4'        => 'impresion.pagos.hoja-completa',
                'TICKET_80' => 'impresion.pagos.ticket-80',
                'TICKET_58' => 'impresion.pagos.ticket-58',
            };

            return view($template, $datos);
        } catch (\Exception $e) {
            abort(500, 'Error al cargar vista previa: ' . $e->getMessage());
        }
    }

    /**
     * Aplicar configuración de formato a DomPDF
     */
    private function aplicarConfiguracionFormato($pdf, $formato): void
    {
        $configuracion = match ($formato) {
            'A4'        => [
                'paper'       => 'A4',
                'orientation' => 'portrait',
                'margins'     => ['left' => 10, 'right' => 10, 'top' => 10, 'bottom' => 10],
            ],
            'TICKET_80' => [
                'paper'       => [0, 0, 226.77, 841.89], // 80mm ancho
                'orientation' => 'portrait',
                'margins'     => ['left' => 5, 'right' => 5, 'top' => 5, 'bottom' => 5],
            ],
            'TICKET_58' => [
                'paper'       => [0, 0, 164.41, 841.89], // 58mm ancho
                'orientation' => 'portrait',
                'margins'     => ['left' => 3, 'right' => 3, 'top' => 3, 'bottom' => 3],
            ],
        };

        $pdf->setPaper($configuracion['paper'], $configuracion['orientation']);
        $pdf->setOption('margin_left', $configuracion['margins']['left']);
        $pdf->setOption('margin_right', $configuracion['margins']['right']);
        $pdf->setOption('margin_top', $configuracion['margins']['top']);
        $pdf->setOption('margin_bottom', $configuracion['margins']['bottom']);
    }

    /**
     * Buscar clientes por nombre (API)
     *
     * GET /api/clientes/search?q=test
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q', '');

        $clientes = ClienteModel::where('activo', true)
            ->where(function ($q) use ($query) {
                $q->where('nombre', 'ilike', "%{$query}%")
                    ->orWhere('razon_social', 'ilike', "%{$query}%")
                    ->orWhere('nit', 'ilike', "%{$query}%");
            })
            ->select('id', 'nombre', 'razon_social', 'nit')
            ->limit(20)
            ->get()
            ->map(function ($cliente) {
                return [
                    'id' => $cliente->id,
                    'nombre' => $cliente->nombre ?? $cliente->razon_social,
                    'nit' => $cliente->nit,
                ];
            });

        return response()->json($clientes);
    }
}
