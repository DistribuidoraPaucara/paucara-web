// Service: Notification service using react-toastify
import { toast, ToastOptions } from 'react-toastify';

export class NotificationService {
  // Success notifications
  static success(message: string, options?: ToastOptions) {
    return toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      ...options,
    });
  }

  // Error notifications
  static error(message: string, options?: ToastOptions) {
    return toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      ...options,
    });
  }

  // Warning notifications
  static warning(message: string, options?: ToastOptions) {
    return toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      ...options,
    });
  }

  // Info notifications
  static info(message: string, options?: ToastOptions) {
    return toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      ...options,
    });
  }

  // Loading notifications
  static loading(message: string, options?: ToastOptions) {
    return toast.loading(message, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "colored",
      ...options,
    });
  }

  // Update loading notification
  static update(toastId: string | number, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') {
    return toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: type === 'error' ? 5000 : 3000,
    });
  }

  // Dismiss notification
  static dismiss(toastId?: string | number) {
    return toast.dismiss(toastId);
  }

  // Confirmation dialog using toast
  static confirm(
    message: string,
    options?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
    }
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const title = options?.title || 'Confirmación';
      const confirmText = options?.confirmText || 'Confirmar';
      const cancelText = options?.cancelText || 'Cancelar';

      const toastContent = (
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-base mb-1">{title}</h3>
            <p className="text-sm">{message}</p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(toastId);
                resolve(false);
              }}
              className="px-3 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                toast.dismiss(toastId);
                resolve(true);
              }}
              className="px-3 py-1.5 text-sm rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </div>
      );

      const toastId = toast.warning(toastContent, {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        theme: "light",
      });
    });
  }

  // Promise-based notification with loading/success/error states
  static promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ) {
    return toast.promise(
      promise,
      {
        pending: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        ...options,
      }
    );
  }

  // ==========================================
  // CREDIT-SPECIFIC NOTIFICATIONS (FASE 3)
  // ==========================================

  /**
   * Notificación de crédito vencido
   * Se dispara cuando una cuenta de crédito vence
   */
  static creditoVencido(data: {
    clienteNombre: string;
    saldoPendiente: number;
    diasVencido: number;
  }, options?: ToastOptions) {
    const message = `⚠️ Crédito Vencido - ${data.clienteNombre}\nDeuda: Bs. ${data.saldoPendiente.toFixed(2)} | Vencido hace ${data.diasVencido} días`;
    return this.warning(message, {
      autoClose: 8000,
      ...options,
    });
  }

  /**
   * Notificación de crédito crítico
   * Se dispara cuando el utilización del crédito supera el 80%
   */
  static creditoCritico(data: {
    clienteNombre: string;
    porcentajeUtilizado: number;
    saldoDisponible: number;
  }, options?: ToastOptions) {
    const message = `🔴 Crédito Crítico - ${data.clienteNombre}\nUtilización: ${data.porcentajeUtilizado.toFixed(1)}% | Disponible: Bs. ${data.saldoDisponible.toFixed(2)}`;
    return this.error(message, {
      autoClose: 8000,
      ...options,
    });
  }

  /**
   * Notificación de crédito excedido
   * Se dispara cuando el cliente excede el límite de crédito
   */
  static creditoExcedido(data: {
    clienteNombre: string;
    montoExcedido: number;
  }, options?: ToastOptions) {
    const message = `❌ Crédito Excedido - ${data.clienteNombre}\nMonto excedido: Bs. ${data.montoExcedido.toFixed(2)}\nContacta a ventas para más información.`;
    return this.error(message, {
      autoClose: 10000,
      ...options,
    });
  }

  /**
   * Notificación de pago de crédito registrado
   * Se dispara cuando se registra un pago exitosamente
   */
  static creditoPagoRegistrado(data: {
    clienteNombre: string;
    monto: number;
    metodoPago: string;
    saldoRestante: number;
  }, options?: ToastOptions) {
    const message = `✅ Pago Registrado - ${data.clienteNombre}\nMonto: Bs. ${data.monto.toFixed(2)} vía ${data.metodoPago}\nSaldo restante: Bs. ${data.saldoRestante.toFixed(2)}`;
    return this.success(message, {
      autoClose: 5000,
      ...options,
    });
  }

  /**
   * Mostrar notificación del navegador para crédito
   * Requiere permisos de notificación del navegador
   */
  static showBrowserNotification(data: {
    title: string;
    body: string;
    tag?: string;
    icon?: string;
  }) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(data.title, {
        body: data.body,
        icon: data.icon || '/favicon.ico',
        tag: data.tag || 'credito-notification',
        badge: '/favicon.ico',
      });
    } else if ('Notification' in window) {
      console.log('Permisos de notificación no otorgados');
    }
  }
}

export default NotificationService;
