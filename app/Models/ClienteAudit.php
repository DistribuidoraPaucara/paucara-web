<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClienteAudit extends Model
{
    use HasFactory;

    protected $table = 'cliente_audits';

    protected $fillable = [
        'cliente_id',
        'preventista_id',
        'usuario_id',
        'accion',
        'cambios',
        'motivo',
        'ip_address',
    ];

    protected $casts = [
        'cambios' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * ✅ Relación: Cliente
     */
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * ✅ Relación: Preventista (Empleado)
     */
    public function preventista()
    {
        return $this->belongsTo(Empleado::class, 'preventista_id');
    }

    /**
     * ✅ Relación: Usuario (Super-Admin, Admin)
     */
    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ✅ Scope: Por cliente
     */
    public function scopeForCliente($query, Cliente $cliente)
    {
        return $query->where('cliente_id', $cliente->id);
    }

    /**
     * ✅ Scope: Por preventista
     */
    public function scopeForPreventista($query, Empleado $preventista)
    {
        return $query->where('preventista_id', $preventista->id);
    }

    /**
     * ✅ Scope: Por acción
     */
    public function scopeByAccion($query, string $accion)
    {
        return $query->where('accion', $accion);
    }

    /**
     * ✅ Scope: Últimos cambios
     */
    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days))
            ->orderByDesc('created_at');
    }

    /**
     * ✅ Método: Obtener descripción legible de la acción
     */
    public function getAccionDescripcion(): string
    {
        $descripciones = [
            'created' => 'Cliente creado',
            'updated' => 'Cliente actualizado',
            'bloqueado' => 'Cliente bloqueado',
            'desbloqueado' => 'Cliente desbloqueado',
            'estado_cambio' => 'Estado cambió',
        ];

        return $descripciones[$this->accion] ?? $this->accion;
    }

    /**
     * ✅ Método: Quién hizo el cambio
     */
    public function getResponsableAttribute()
    {
        if ($this->preventista) {
            return $this->preventista->usuario->name ?? 'Desconocido';
        }

        if ($this->usuario) {
            return $this->usuario->name ?? 'Desconocido';
        }

        return 'Sistema';
    }

    /**
     * ✅ Método: Generar resumen del cambio
     */
    public function getResumenCambio(): string
    {
        if (empty($this->cambios)) {
            return 'Sin cambios registrados';
        }

        $cambios = [];
        foreach ($this->cambios as $campo => $valor) {
            // Ignorar campos técnicos
            if (in_array($campo, ['created_at', 'updated_at', 'id'])) {
                continue;
            }

            $cambios[] = "{$campo}: {$valor}";
        }

        return implode(', ', $cambios) ?: 'Sin cambios registrados';
    }
}
