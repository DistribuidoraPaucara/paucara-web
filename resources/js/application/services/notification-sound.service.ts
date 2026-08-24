/**
 * Servicio centralizado de sonido para notificaciones
 * Reproduce un sonido distintivo cuando llega cualquier notificación
 */

export class NotificationSoundService {
  private audioContext: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Inicializar desde localStorage si existe
    const saved = localStorage.getItem('notification_sound_enabled');
    if (saved !== null) {
      this.soundEnabled = JSON.parse(saved);
    }
  }

  /**
   * Reproducir sonido de notificación
   * Sonido: dos beeps cortos y agradables
   */
  playSound(): void {
    if (!this.soundEnabled) return;

    try {
      // Crear AudioContext si no existe
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = this.audioContext;

      // Primer beep (800 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.frequency.setValueAtTime(800, ctx.currentTime);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.1);

      // Segundo beep (1000 Hz) - ligeramente más alto
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.setValueAtTime(1000, ctx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.25);
    } catch (error) {
      console.warn('No se pudo reproducir sonido de notificación:', error);
    }
  }

  /**
   * Habilitar/deshabilitar sonido
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    localStorage.setItem('notification_sound_enabled', JSON.stringify(enabled));
  }

  /**
   * Obtener estado del sonido
   */
  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }
}

// Singleton
export const notificationSoundService = new NotificationSoundService();
