<?php
namespace App\Events;

use App\Models\NotificacionRecurrente;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificacionRecurrenteEmitida
{
    use Dispatchable, SerializesModels;

    public NotificacionRecurrente $notificacion;
    public int $totalEnviadas;

    public function __construct(
        NotificacionRecurrente $notificacion,
        int $totalEnviadas = 0
    ) {
        $this->notificacion = $notificacion;
        $this->totalEnviadas = $totalEnviadas;
        $this->notificacion->load("usuario");
    }
}
