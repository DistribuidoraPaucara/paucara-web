<?php

namespace App\Notifications;

use App\Models\Producto;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StockBajoNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Producto $producto,
        public int $stockActual,
        public int $stockMinimo,
        public ?string $almacenNombre = null
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $ubicacion = $this->almacenNombre ? " en almacén {$this->almacenNombre}" : '';

        return (new MailMessage)
            ->subject('⚠️ Alerta de Stock Bajo - '.$this->producto->nombre)
            ->greeting('¡Atención!')
            ->line("El producto **{$this->producto->nombre}**{$ubicacion} tiene stock bajo.")
            ->line("Stock actual: **{$this->stockActual}** unidades")
            ->line("Stock mínimo: **{$this->stockMinimo}** unidades")
            ->action('Ver Inventario', route('inventario.stock-bajo'))
            ->line('Se recomienda realizar una reposición pronto.')
            ->salutation('Sistema de Inventario');
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'tipo' => 'stock_bajo',
            'producto_id' => $this->producto->id,
            'producto_nombre' => $this->producto->nombre,
            'stock_actual' => $this->stockActual,
            'stock_minimo' => $this->stockMinimo,
            'almacen_nombre' => $this->almacenNombre,
            'mensaje' => "Stock bajo: {$this->producto->nombre} ({$this->stockActual}/{$this->stockMinimo})",
            'url' => route('inventario.stock-bajo'),
            'prioridad' => 'media',
        ];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}
