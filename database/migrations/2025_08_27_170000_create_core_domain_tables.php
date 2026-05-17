<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Basic catalogs: monedas, categorias, marcas, almacenes, clientes, proveedores
        Schema::create('monedas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 3)->unique(); // USD, EUR, ARS, etc.
            $table->string('nombre', 50)->unique();
            $table->string('simbolo', 5);                             // $, €, etc.
            $table->decimal('tasa_cambio', 15, 6)->default(1.000000); // Tasa de cambio respecto a moneda base
            $table->integer('decimales')->default(2);
            $table->boolean('es_moneda_base')->default(false); // Solo una puede ser true
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('categorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
        });

        Schema::create('marcas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
        });

        Schema::create('almacenes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->string('direccion')->nullable();
            $table->string('responsable')->nullable();
            $table->string('telefono')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->double('peso')->default(0);
            $table->string('codigo_barras')->nullable()->index();
            $table->string('codigo_qr')->nullable();
            $table->unsignedInteger('stock_minimo')->default(0);
            $table->unsignedInteger('stock_maximo')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->boolean('es_alquilable')->default(false);
            $table->foreignId('categoria_id')->nullable()->constrained('categorias')->nullOnDelete();
            $table->foreignId('marca_id')->nullable()->constrained('marcas')->nullOnDelete();
        });

        Schema::create('imagenes_producto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->cascadeOnDelete();
            $table->string('url');
            $table->boolean('es_principal')->default(false);
            $table->unsignedInteger('orden')->default(0);
            $table->timestamps();
        });

        Schema::create('tipos_precio', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 20)->unique();         // Código identificador (ej: COSTO, VENTA, etc.)
            $table->string('nombre', 100);                  // Nombre descriptivo
            $table->string('descripcion', 255)->nullable(); // Descripción detallada
            $table->decimal('porcentaje_ganancia', 8, 2)->nullable();
            $table->string('color', 20)->default('gray');      // Color para la UI
            $table->boolean('es_ganancia')->default(true);     // Si es precio de ganancia o costo base
            $table->boolean('es_precio_base')->default(false); // Si es el precio base para cálculos
            $table->integer('orden')->default(0);              // Orden de visualización
            $table->boolean('activo')->default(true);          // Estado activo/inactivo
            $table->boolean('es_sistema')->default(false);     // Si es un tipo del sistema (no editable)
            $table->json('configuracion')->nullable();         // Configuraciones adicionales
            $table->timestamps();

            // Índices
            $table->index(['activo', 'orden']);
            $table->index('es_ganancia');
            $table->index('es_precio_base');
        });

        Schema::create('precios_producto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->cascadeOnDelete();
            $table->foreignId('tipo_precio_id')->constrained('tipos_precio')->onDelete('restrict')->onUpdate('cascade');
            $table->string('nombre', 100)->default('Precio General');
            $table->decimal('precio', 18, 2);
            $table->decimal('margen_ganancia', 8, 2)->nullable();
            $table->decimal('porcentaje_ganancia', 5, 2)->nullable();
            $table->boolean('es_precio_base')->default(false);
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->boolean('activo')->default(true);
            $table->string('motivo_cambio')->nullable();
            $table->string('tipo_cliente')->nullable();
            $table->timestamps();

            // Índices para mejor rendimiento
            $table->index(['producto_id', 'tipo_precio_id', 'activo']);
            $table->index('tipo_precio_id');
        });

        Schema::create('stock_productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->cascadeOnDelete();
            $table->foreignId('almacen_id')->constrained('almacenes')->cascadeOnDelete();
            $table->integer('cantidad')->default(0);
            $table->timestamp('fecha_actualizacion')->useCurrent();
            $table->string('lote')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->integer('cantidad_reservada')->default(0);
            $table->integer('cantidad_disponible')->default(0);
            $table->unique(['producto_id', 'almacen_id', 'lote'], 'uq_stock_producto_lote');
        });

        // Actualizar cantidad_disponible con la cantidad existente después de crear la tabla
        DB::statement('UPDATE stock_productos SET cantidad_disponible = cantidad');

        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('razon_social')->nullable();
            $table->string('nit')->nullable()->index();
            $table->string('telefono')->nullable();
            $table->string('email')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamp('fecha_registro')->useCurrent();
            $table->string('foto_perfil')->nullable();
            $table->string('ci_anverso')->nullable();
            $table->string('ci_reverso')->nullable();
            $table->decimal('limite_credito', 18, 2)->default(0);
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
        });

        Schema::create('direcciones_cliente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->string('direccion');
            $table->double('latitud')->nullable();
            $table->double('longitud')->nullable();
            $table->boolean('es_principal')->default(false);
            $table->boolean('activa')->default(true);
            $table->timestamps();
        });

        Schema::create('fotos_lugar_cliente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->foreignId('direccion_cliente_id')->nullable()->constrained('direcciones_cliente')->nullOnDelete();
            $table->string('url');
            $table->string('descripcion')->nullable();
            $table->timestamp('fecha_captura')->useCurrent();
        });

        Schema::create('proveedores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('razon_social')->nullable();
            $table->string('nit')->nullable();
            $table->string('telefono')->nullable();
            $table->string('email')->nullable();
            $table->string('direccion')->nullable();
            $table->string('contacto')->nullable();
            $table->boolean('activo')->default(true);
            $table->string('foto_perfil')->nullable();
            $table->string('ci_anverso')->nullable();
            $table->string('ci_reverso')->nullable();
            $table->timestamp('fecha_registro')->useCurrent();
        });

        // Tipos y estados básicos
        Schema::create('estados_documento', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 10)->unique();
            $table->string('nombre', 100);
            $table->string('descripcion')->nullable();
            $table->string('color', 7)->default('#6B7280'); // Color hexadecimal para UI
            $table->boolean('permite_edicion')->default(true);
            $table->boolean('permite_anulacion')->default(true);
            $table->boolean('es_estado_final')->default(false);
            $table->boolean('activo')->default(true);
            $table->timestamps();

        });

        Schema::create('tipos_documento', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 10)->unique(); // Ej: FAC, BOL, REC, NOT
            $table->string('nombre', 100);          // Factura, Boleta, Recibo, Nota de Crédito
            $table->string('descripcion')->nullable();
            $table->boolean('genera_inventario')->default(true);      // Si afecta inventario
            $table->boolean('requiere_autorizacion')->default(false); // Para facturación electrónica
            $table->string('formato_numeracion')->nullable();         // Ej: FAC-{YYYY}-{####}
            $table->integer('siguiente_numero')->default(1);          // Para auto-numeración
            $table->boolean('activo')->default(true);
            $table->timestamps();

            // Índices
            $table->index(['codigo', 'activo']);
        });

        Schema::create('tipos_pago', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('nombre');
        });

        Schema::create('tipo_operacion_caja', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('nombre');
        });

        Schema::create('estados_pedido', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('nombre');
        });

        // Cajas
        Schema::create('cajas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('ubicacion')->nullable();
            $table->decimal('monto_inicial_dia', 18, 2)->default(0);
            $table->boolean('activa')->default(true);
            $table->timestamps();
        });

        Schema::create('movimientos_caja', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caja_id')->constrained('cajas')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('fecha')->useCurrent();
            $table->decimal('monto', 18, 2);
            $table->string('observaciones')->nullable();
            $table->string('numero_documento')->nullable();
            $table->foreignId('tipo_operacion_id')->constrained('tipo_operacion_caja');
        });

        // Pedidos y delivery mínimos
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->foreignId('cliente_id')->constrained('clientes');
            $table->timestamp('fecha_pedido')->useCurrent();
            $table->date('fecha_entrega_requerida')->nullable();
            $table->timestamp('fecha_entrega_real')->nullable();
            $table->decimal('subtotal', 18, 2)->default(0);
            $table->decimal('total', 18, 2)->default(0);
            $table->string('observaciones')->nullable();
            $table->string('direccion_entrega')->nullable();
            $table->double('latitud_entrega')->nullable();
            $table->double('longitud_entrega')->nullable();
            $table->foreignId('estado_id')->nullable()->constrained('estados_pedido');
            $table->timestamps();
        });

        Schema::create('detalles_pedido', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained('pedidos')->cascadeOnDelete();
            $table->foreignId('producto_id')->constrained('productos');
            $table->integer('cantidad');
            $table->decimal('precio_unitario', 18, 2);
            $table->decimal('subtotal', 18, 2);
            $table->timestamps();
        });

        Schema::create('tipos_ajuste_inventario', function (Blueprint $table) {
            $table->id();
            $table->string('clave')->unique(); // Ej: AJUSTE_FISICO, DONACION, CORRECCION
            $table->string('label');           // Nombre visible
            $table->string('descripcion')->nullable();
            $table->string('color')->nullable();
            $table->string('bg_color')->nullable();
            $table->string('text_color')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('tipo_mermas', function (Blueprint $table) {
            $table->id();
            $table->string('clave')->unique(); // Ej: VENCIMIENTO, DETERIORO
            $table->string('label');           // Nombre visible
            $table->string('descripcion')->nullable();
            $table->string('color')->nullable();
            $table->string('bg_color')->nullable();
            $table->string('text_color')->nullable();
            $table->boolean('requiere_aprobacion')->default(true);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('estado_mermas', function (Blueprint $table) {
            $table->id();
            $table->string('clave')->unique(); // Ej: PENDIENTE, APROBADO
            $table->string('label');
            $table->string('color')->nullable();
            $table->string('bg_color')->nullable();
            $table->string('text_color')->nullable();
            $table->json('actions')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // Movimiento de inventario básico
        Schema::create('movimientos_inventario', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_producto_id')->constrained('stock_productos');
            $table->integer('cantidad_anterior')->nullable();
            $table->integer('cantidad');
            $table->integer('cantidad_posterior')->nullable();
            $table->timestamp('fecha')->useCurrent();
            $table->string('observacion')->nullable();
            $table->string('numero_documento')->nullable(); // Ej: número de factura, pedido, etc. de referencia externo al sistema
            $table->string('tipo')->index();                // ENTRADA_*, SALIDA_* etc.
            $table->foreignId('user_id')->constrained('users');

            $table->foreignId('tipo_ajuste_inventario_id')->nullable()->constrained('tipos_ajuste_inventario')->nullOnDelete();
            $table->foreignId('tipo_merma_id')->nullable()->constrained('tipo_mermas')->nullOnDelete();
            $table->foreignId('estado_merma_id')->nullable()->constrained('estado_mermas')->nullOnDelete();
            // soporte de anulación
            $table->boolean('anulado')->default(false);
            $table->string('motivo_anulacion')->nullable();
            $table->foreignId('user_anulacion_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('fecha_anulacion')->nullable();
            // referencias externas
            $table->string('referencia_tipo')->nullable(); // Ej: PEDIDO, FACTURA, AJUSTE
            $table->unsignedBigInteger('referencia_id')->nullable();
            $table->index(['referencia_tipo', 'referencia_id']);
            // ip o dispositivo
            $table->string('ip_dispositivo')->nullable();
            // soft deletes
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Eliminar tablas en orden inverso, respetando dependencias de clave foránea
        Schema::dropIfExists('movimientos_inventario');  // Eliminar primero (tiene FKs)
        Schema::dropIfExists('tipos_ajuste_inventario'); // Luego eliminar padre
        Schema::dropIfExists('estado_mermas');
        Schema::dropIfExists('tipo_mermas');
        Schema::dropIfExists('detalles_pedido');
        Schema::dropIfExists('pedidos');
        Schema::dropIfExists('movimientos_caja');
        Schema::dropIfExists('cajas');
        Schema::dropIfExists('estados_pedido');
        Schema::dropIfExists('tipo_operacion_caja');
        Schema::dropIfExists('tipos_pago');
        Schema::dropIfExists('estados_documento');
        Schema::dropIfExists('tipos_documento');
        Schema::dropIfExists('proveedores');
        Schema::dropIfExists('fotos_lugar_cliente');
        Schema::dropIfExists('direcciones_cliente');
        Schema::dropIfExists('clientes');
        Schema::dropIfExists('stock_productos');
        Schema::dropIfExists('precios_producto'); // Eliminar antes que tipos_precio
        Schema::dropIfExists('tipos_precio');     // Eliminar después
        Schema::dropIfExists('imagenes_producto');
        Schema::dropIfExists('productos');
        Schema::dropIfExists('almacenes');
        Schema::dropIfExists('marcas');
        Schema::dropIfExists('categorias');
        Schema::dropIfExists('monedas');
    }
};
