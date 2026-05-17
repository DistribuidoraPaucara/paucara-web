<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agrega:
     * 1. Campo deleted_at para SoftDeletes en tablas críticas
     * 2. Índices compuestos para mejorar performance de consultas
     */
    public function up(): void
    {
        // 1. Agregar deleted_at a stock_productos (si no existe)
        if (! Schema::hasColumn('stock_productos', 'deleted_at')) {
            Schema::table('stock_productos', function (Blueprint $table) {
                $table->softDeletes()->after('fecha_actualizacion');
            });
        }

        // 2. Agregar deleted_at a movimientos_inventario (ya existe en fillable)
        // El campo ya está en la tabla según el modelo, solo aseguramos el índice
        if (Schema::hasColumn('movimientos_inventario', 'deleted_at')) {
            Schema::table('movimientos_inventario', function (Blueprint $table) {
                if (! Schema::hasIndex('movimientos_inventario', 'movimientos_inventario_deleted_at_index')) {
                    $table->index('deleted_at');
                }
            });
        } else {
            Schema::table('movimientos_inventario', function (Blueprint $table) {
                $table->softDeletes()->after('ip_dispositivo');
            });
        }

        // 3. Agregar deleted_at a reservas_proforma (si no existe)
        if (Schema::hasTable('reservas_proforma')) {
            if (! Schema::hasColumn('reservas_proforma', 'deleted_at')) {
                Schema::table('reservas_proforma', function (Blueprint $table) {
                    $table->softDeletes()->after('estado');
                });
            }
        }

        // 4. Agregar índices compuestos para optimizar consultas frecuentes
        Schema::table('stock_productos', function (Blueprint $table) {
            // Índice compuesto para búsquedas por producto+almacén+lote
            if (! Schema::hasIndex('stock_productos', 'idx_stock_producto_almacen_lote')) {
                $table->index(['producto_id', 'almacen_id', 'lote'], 'idx_stock_producto_almacen_lote');
            }

            // Índice para consultas de stock disponible
            if (! Schema::hasIndex('stock_productos', 'idx_stock_disponible')) {
                $table->index(['producto_id', 'cantidad_disponible'], 'idx_stock_disponible');
            }

            // Índice para productos próximos a vencer
            if (! Schema::hasIndex('stock_productos', 'idx_stock_vencimiento')) {
                $table->index(['fecha_vencimiento', 'cantidad'], 'idx_stock_vencimiento');
            }
        });

        Schema::table('movimientos_inventario', function (Blueprint $table) {
            // Índice compuesto para búsquedas por documento+tipo
            if (! Schema::hasIndex('movimientos_inventario', 'idx_movimiento_documento_tipo')) {
                $table->index(['numero_documento', 'tipo'], 'idx_movimiento_documento_tipo');
            }

            // Índice para consultas por fecha
            if (! Schema::hasIndex('movimientos_inventario', 'movimientos_inventario_fecha_index')) {
                $table->index('fecha');
            }

            // Índice para consultas por producto (a través de stock)
            if (! Schema::hasIndex('movimientos_inventario', 'movimientos_inventario_stock_producto_id_index')) {
                $table->index('stock_producto_id');
            }
        });

        if (Schema::hasTable('reservas_proforma')) {
            Schema::table('reservas_proforma', function (Blueprint $table) {
                // Índice compuesto para reservas activas por proforma
                if (! Schema::hasIndex('reservas_proforma', 'idx_reserva_proforma_estado')) {
                    $table->index(['proforma_id', 'estado'], 'idx_reserva_proforma_estado');
                }

                // Índice para reservas expiradas
                if (! Schema::hasIndex('reservas_proforma', 'idx_reserva_expiracion')) {
                    $table->index(['fecha_expiracion', 'estado'], 'idx_reserva_expiracion');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar índices compuestos
        Schema::table('stock_productos', function (Blueprint $table) {
            if (Schema::hasIndex('stock_productos', 'idx_stock_producto_almacen_lote')) {
                $table->dropIndex('idx_stock_producto_almacen_lote');
            }
            if (Schema::hasIndex('stock_productos', 'idx_stock_disponible')) {
                $table->dropIndex('idx_stock_disponible');
            }
            if (Schema::hasIndex('stock_productos', 'idx_stock_vencimiento')) {
                $table->dropIndex('idx_stock_vencimiento');
            }
            if (Schema::hasColumn('stock_productos', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });

        Schema::table('movimientos_inventario', function (Blueprint $table) {
            if (Schema::hasIndex('movimientos_inventario', 'idx_movimiento_documento_tipo')) {
                $table->dropIndex('idx_movimiento_documento_tipo');
            }
            if (Schema::hasIndex('movimientos_inventario', 'idx_movimiento_fecha')) {
                $table->dropIndex('movimientos_inventario_fecha_index');
            }
            if (Schema::hasIndex('movimientos_inventario', 'movimientos_inventario_stock_producto_id_index')) {
                $table->dropIndex('movimientos_inventario_stock_producto_id_index');
            }
            if (Schema::hasColumn('movimientos_inventario', 'deleted_at')) {
                $table->dropColumn('deleted_at');
            }
        });

        if (Schema::hasTable('reservas_proforma')) {
            Schema::table('reservas_proforma', function (Blueprint $table) {
                if (Schema::hasIndex('reservas_proforma', 'idx_reserva_proforma_estado')) {
                    $table->dropIndex('idx_reserva_proforma_estado');
                }
                if (Schema::hasIndex('reservas_proforma', 'idx_reserva_expiracion')) {
                    $table->dropIndex('idx_reserva_expiracion');
                }
                if (Schema::hasColumn('reservas_proforma', 'deleted_at')) {
                    $table->dropColumn('deleted_at');
                }
            });
        }
    }

    // El método hasIndex ya no es necesario ya que usamos Schema::hasIndex()
};
