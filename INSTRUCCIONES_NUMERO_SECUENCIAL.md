# 📋 Instrucciones: NumeroSecuencialService

## ✅ Qué se Creó

- `database/migrations/2026_07_04_210241_create_numero_secuencias_table.php` - Tabla de secuencias
- `app/Models/NumeroSecuencia.php` - Modelo
- `app/Services/NumeroSecuencialService.php` - Servicio (90 líneas, bien documentado)

---

## 🚀 Cómo Usar

### En ApiProformaController.php

**Cambio actual (con saltos de números):**
```php
$proforma = Proforma::create([
    'numero' => Proforma::generarNumeroProforma(),  // ❌ Salta números
    'cliente_id' => $requestData['cliente_id'],
    ...
]);
```

**Cambio nuevo (sin saltos):**
```php
use App\Services\NumeroSecuencialService;

// En el controller
$numeroService = app(NumeroSecuencialService::class);
$numero = $numeroService->generar('PROFORMA');  // ✅ VEN20260704-0001

$proforma = Proforma::create([
    'numero' => $numero,
    'cliente_id' => $requestData['cliente_id'],
    ...
]);
```

---

## 📝 Ejemplos Completos

### Generar número para VENTA
```php
use App\Services\NumeroSecuencialService;

class ApiVentaController {
    public function store(Request $request, NumeroSecuencialService $numeroService)
    {
        $venta = Venta::create([
            'numero' => $numeroService->generar('VENTA'),  // ✅ VEN20260704-0001
            'cliente_id' => $request->cliente_id,
            ...
        ]);
        
        return response()->json($venta);
    }
}
```

### Generar número para PROFORMA
```php
$numero = $numeroService->generar('PROFORMA');  // ✅ PRO20260704-0001

$proforma = Proforma::create([
    'numero' => $numero,
    ...
]);
```

### Generar número para COMPRA
```php
$numero = $numeroService->generar('COMPRA');  // ✅ COM20260704-0001

$compra = Compra::create([
    'numero' => $numero,
    ...
]);
```

### Generar número para DEVOLUCIÓN
```php
$numero = $numeroService->generar('DEVOLUCION');  // ✅ DEV20260704-0001

$devolucion = Devolucion::create([
    'numero' => $numero,
    ...
]);
```

---

## 🔍 Métodos Disponibles

### 1. `generar($tipo, $padding = 4, $dateFormat = 'Ymd')`
Genera un número secuencial único.

```php
$numero = $numeroService->generar('VENTA');
// Retorna: VEN20260704-0001
```

### 2. `obtenerSiguiente($tipo, $dateFormat = 'Ymd')`
Obtiene el próximo número que se generará (sin incrementar).

```php
$siguiente = $numeroService->obtenerSiguiente('VENTA');
// Retorna: VEN20260704-0001 (si no hay registros del día)
```

### 3. `obtenerUltimos($tipo, $dateFormat = 'Ymd', $limite = 10)`
Obtiene los últimos números generados.

```php
$ultimos = $numeroService->obtenerUltimos('VENTA', 'Ymd', 10);
// Retorna: ['VEN20260704-0010', 'VEN20260704-0009', ...]
```

### 4. `resetear($tipo, $fecha = null)`
Resetea la secuencia del día (solo en development/test).

```php
$numeroService->resetear('VENTA');  // Resetea hoy
$numeroService->resetear('VENTA', '2026-07-04');  // Resetea fecha específica
```

---

## 📊 Ventajas vs Método Anterior

| Aspecto | GeneratesSequentialCode | NumeroSecuencialService |
|--------|------------------------|----------------------|
| **Saltos de números** | ❌ Salta en transacciones fallidas | ✅ NO salta nunca |
| **Tabla dedicada** | ❌ No | ✅ Sí (numero_secuencias) |
| **Transacción atómica** | ⚠️ Dentro del Modelo | ✅ Separada |
| **Reintentos automáticos** | ✅ Sí | ✅ Sí |
| **Bloqueo pesimista** | ✅ lockForUpdate() | ✅ lockForUpdate() |
| **Complejidad** | Baja | Media |

---

## 🔒 Seguridad

El servicio usa:
- ✅ `lockForUpdate()` - Bloqueo pesimista para evitar condiciones de carrera
- ✅ Transacciones DB atómicas - Garantiza consistencia
- ✅ Reintentos con backoff exponencial - Maneja deadlocks
- ✅ Logging detallado - Auditoría completa

---

## 📌 Próximos Pasos

### 1. Actualizar ApiProformaController
Busca línea `487` y cambia:
```php
'numero' => Proforma::generarNumeroProforma(),
```

Por:
```php
'numero' => app(NumeroSecuencialService::class)->generar('PROFORMA'),
```

### 2. Actualizar ApiVentaController
Busca todas las creaciones de ventas y reemplaza:
```php
'numero' => Venta::generarNumeroVenta(),  // Si existe
```

Por:
```php
'numero' => app(NumeroSecuencialService::class)->generar('VENTA'),
```

### 3. Actualizar otros Controllers
- CompraController
- DevolucionController
- Cualquier otro que genere números secuenciales

---

## 🧪 Probar en Tinker

```bash
php artisan tinker

$numeroService = app(App\Services\NumeroSecuencialService::class);

# Generar 5 números
$numeroService->generar('VENTA');  # VEN20260704-0001
$numeroService->generar('VENTA');  # VEN20260704-0002
$numeroService->generar('VENTA');  # VEN20260704-0003

# Ver próximo
$numeroService->obtenerSiguiente('VENTA');  # VEN20260704-0004

# Ver últimos
$numeroService->obtenerUltimos('VENTA', 'Ymd', 5);

exit
```

---

## ⚠️ Importante

- **NO** elimines `GeneratesSequentialCode` del modelo Proforma/Venta aún
- **PRIMERO** actualiza todos los controllers
- **LUEGO** puedes eliminar llamadas a `generateSequentialCode()` si no se usan más
- El método antiguo seguirá funcionando en paralelo (no interfiere)

---

## 📖 Referencia Tipos Soportados

```
VENTA → VEN
PROFORMA → PRO
COMPRA → COM
DEVOLUCION → DEV
ASIENTO → ASI
COMPROBANTE → CBE
FACTURA → FAC
```

Si necesitas más tipos, agrega al array `TIPO_PREFIJO` en `NumeroSecuencialService.php`.
