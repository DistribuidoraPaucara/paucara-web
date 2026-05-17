<?php

namespace Tests\Unit\Middleware;

use Tests\TestCase;
use App\Http\Middleware\CheckCajaAbierta;
use App\Models\User;
use App\Models\Empleado;
use App\Models\Caja;
use App\Models\AperturaCaja;
use App\Models\AuditoriaCaja;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Session\Middleware\StartSession;

/**
 * Tests para el Middleware CheckCajaAbierta
 *
 * Valida que:
 * ✅ Usuario sin caja abierta es bloqueado
 * ✅ Usuario con caja abierta es permitido
 * ✅ La caja_id se almacena en request->attributes
 * ✅ Se responde con JSON para API
 * ✅ Se responde con redirect para Web
 */
class CheckCajaAbiertaTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Empleado $empleado;
    protected Caja $caja;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear roles si no existen
        $this->createRoles();

        // Crear usuario con rol de Cajero
        $this->user = User::factory()->create();
        $this->user->assignRole('Cajero');

        // Crear empleado asociado
        $this->empleado = Empleado::factory()->create([
            'user_id' => $this->user->id,
        ]);

        // Crear caja
        $this->caja = Caja::factory()->create([
            'activa' => true,
        ]);

        // Asignar caja al cajero
        $this->empleado->cajasAsignadas()->attach($this->caja->id);
    }

    /**
     * Helper: Crear roles necesarios para las pruebas
     */
    protected function createRoles(): void
    {
        $roleClass = config('permission.models.role');

        if (!$roleClass::where('name', 'Cajero')->exists()) {
            $roleClass::create(['name' => 'Cajero', 'guard_name' => 'web']);
        }
        if (!$roleClass::where('name', 'admin')->exists()) {
            $roleClass::create(['name' => 'admin', 'guard_name' => 'web']);
        }
    }

    /**
     * Test: Usuario sin caja abierta es bloqueado
     */
    public function test_usuario_sin_caja_abierta_es_bloqueado()
    {
        Auth::login($this->user);

        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('POST', '/api/ventas');

        $response = $middleware->handle($request, function () {
            return response()->json(['success' => true]);
        });

        // Debe ser un JSON response con estado 403
        $this->assertEquals(403, $response->status());
        $data = json_decode($response->content(), true);
        $this->assertFalse($data['success']);
        $this->assertStringContainsString('Debe abrir una caja', $data['message']);
    }

    /**
     * Test: Usuario con caja abierta es permitido
     */
    public function test_usuario_con_caja_abierta_es_permitido()
    {
        Auth::login($this->user);

        // Abrir caja
        $apertura = AperturaCaja::create([
            'caja_id' => $this->caja->id,
            'cajero_id' => $this->empleado->id,
            'user_id' => $this->user->id,
            'fecha' => now()->toDateString(),
            'monto_inicial' => 500,
        ]);

        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('POST', '/api/ventas');

        $callbackExecuted = false;
        $response = $middleware->handle($request, function () use (&$callbackExecuted) {
            $callbackExecuted = true;
            return response()->json(['success' => true]);
        });

        // El callback debe ejecutarse
        $this->assertTrue($callbackExecuted);
        $this->assertEquals(200, $response->status());
        $data = json_decode($response->content(), true);
        $this->assertTrue($data['success']);
    }

    /**
     * Test: Se almacena caja_id en request->attributes
     */
    public function test_caja_id_se_almacena_en_request_attributes()
    {
        Auth::login($this->user);

        // Abrir caja
        $apertura = AperturaCaja::create([
            'caja_id' => $this->caja->id,
            'cajero_id' => $this->empleado->id,
            'user_id' => $this->user->id,
            'fecha' => now()->toDateString(),
            'monto_inicial' => 500,
        ]);

        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('POST', '/api/ventas');

        $middleware->handle($request, function () use ($request) {
            // Verificar que caja_id se almacenó
            $this->assertEquals(
                $this->caja->id,
                $request->attributes->get('caja_id')
            );

            return response()->json(['success' => true]);
        });
    }

    /**
     * Test: Usuario no cajero es permitido (no tiene restricción)
     */
    public function test_usuario_no_cajero_es_permitido()
    {
        $userNoEsCajero = User::factory()->create();
        Auth::login($userNoEsCajero);

        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('POST', '/api/ventas');

        $callbackExecuted = false;
        $middleware->handle($request, function () use (&$callbackExecuted) {
            $callbackExecuted = true;
            return response()->json(['success' => true]);
        });

        // El callback debe ejecutarse (sin restricción para no-cajeros)
        $this->assertTrue($callbackExecuted);
    }

    /**
     * Test: Usuario no autenticado es permitido (sin restricción)
     */
    public function test_usuario_no_autenticado_es_permitido()
    {
        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('POST', '/api/ventas');

        $callbackExecuted = false;
        $middleware->handle($request, function () use (&$callbackExecuted) {
            $callbackExecuted = true;
            return response()->json(['success' => true]);
        });

        // El callback debe ejecutarse
        $this->assertTrue($callbackExecuted);
    }

    /**
     * Test: Responder con redirect para Web (no JSON)
     */
    public function test_responder_con_redirect_para_web()
    {
        Auth::login($this->user);

        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('POST', '/ventas');
        $request->headers->set('Accept', 'text/html');

        $response = $middleware->handle($request, function () {
            return response()->json(['success' => true]);
        });

        // Debe ser un redirect
        $this->assertTrue($response->isRedirect());
        $this->assertStringContainsString('/cajas', $response->getTargetUrl());
    }

    /**
     * Test: Permite acceso a ruta web /ventas sin caja (soft warning)
     */
    public function test_permite_acceso_web_ventas_sin_caja()
    {
        Auth::login($this->user);

        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('GET', '/ventas');
        $request->headers->set('Accept', 'text/html');
        $request->session()->start();

        $callbackExecuted = false;
        $response = $middleware->handle($request, function () use (&$callbackExecuted, $request) {
            $callbackExecuted = true;
            // Verificar que se agregó el flash warning
            $this->assertTrue($request->session()->has('caja_warning'));
            return response()->json(['success' => true]);
        });

        // El callback debe ejecutarse (acceso permitido)
        $this->assertTrue($callbackExecuted);
        $this->assertEquals(200, $response->status());
    }

    /**
     * Test: Bloquea acceso API /api/ventas sin caja (hard block)
     */
    public function test_bloquea_api_ventas_sin_caja()
    {
        Auth::login($this->user);

        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('POST', '/api/ventas');

        $response = $middleware->handle($request, function () {
            return response()->json(['success' => true]);
        });

        // Debe retornar 403 Forbidden
        $this->assertEquals(403, $response->status());
        $data = json_decode($response->content(), true);
        $this->assertFalse($data['success']);
    }

    /**
     * Test: Registra auditoría con modo soft-warning para acceso web de ventas
     */
    public function test_registra_auditoria_acceso_sin_caja_con_modo_soft()
    {
        Auth::login($this->user);

        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('GET', '/ventas');
        $request->headers->set('Accept', 'text/html');
        $request->session()->start();

        $middleware->handle($request, function () {
            return response()->json(['success' => true]);
        });

        // Verificar que se registró en auditoría con modo soft-warning
        $this->assertDatabaseHas('cajas_auditoria', [
            'user_id' => $this->user->id,
            'accion' => 'ACCESO_SIN_CAJA',
            'modo' => 'soft-warning',
        ]);
    }

    /**
     * Test: Registra auditoría con modo hard-block para acceso API sin caja
     */
    public function test_registra_auditoria_intento_sin_caja_con_modo_hard_block()
    {
        Auth::login($this->user);

        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('POST', '/api/ventas');

        $middleware->handle($request, function () {
            return response()->json(['success' => true]);
        });

        // Verificar que se registró con acción INTENTO_SIN_CAJA y modo hard-block
        $this->assertDatabaseHas('cajas_auditoria', [
            'user_id' => $this->user->id,
            'accion' => 'INTENTO_SIN_CAJA',
            'modo' => 'hard-block',
        ]);
    }

    /**
     * Test: Flash warning contiene datos correctos para frontend
     */
    public function test_flash_warning_contiene_datos_correctos()
    {
        Auth::login($this->user);

        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('GET', '/ventas');
        $request->headers->set('Accept', 'text/html');
        $request->session()->start();

        $middleware->handle($request, function () {
            return response()->json(['success' => true]);
        });

        $warning = $request->session()->get('caja_warning');

        // Verificar estructura del warning
        $this->assertIsArray($warning);
        $this->assertArrayHasKey('mensaje', $warning);
        $this->assertArrayHasKey('tipo', $warning);
        $this->assertArrayHasKey('mostrar_toast', $warning);
        $this->assertEquals('sin_caja', $warning['tipo']);
        $this->assertTrue($warning['mostrar_toast']);
    }

    /**
     * Test: Ruta /ventas/create sin caja también muestra advertencia suave
     */
    public function test_permite_acceso_web_ventas_create_sin_caja()
    {
        Auth::login($this->user);

        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('GET', '/ventas/create');
        $request->headers->set('Accept', 'text/html');
        $request->session()->start();

        $callbackExecuted = false;
        $response = $middleware->handle($request, function () use (&$callbackExecuted) {
            $callbackExecuted = true;
            return response()->json(['success' => true]);
        });

        // Debe permitir acceso
        $this->assertTrue($callbackExecuted);
        $this->assertEquals(200, $response->status());
    }

    /**
     * Test: Bloquea otros módulos (/compras) sin caja
     */
    public function test_bloquea_compras_sin_caja()
    {
        Auth::login($this->user);

        $middleware = new CheckCajaAbierta();
        $request = $this->makeRequest('GET', '/compras');
        $request->headers->set('Accept', 'text/html');

        $response = $middleware->handle($request, function () {
            return response()->json(['success' => true]);
        });

        // Debe redirigir (web request bloqueado)
        $this->assertTrue($response->isRedirect());
        $this->assertStringContainsString('/cajas', $response->getTargetUrl());
    }

    /**
     * Helper: Crear request mock
     */
    protected function makeRequest($method, $uri, array $data = []): Request
    {
        $request = Request::create($uri, $method, $data);
        $request->headers->set('Accept', 'application/json');
        return $request;
    }
}
