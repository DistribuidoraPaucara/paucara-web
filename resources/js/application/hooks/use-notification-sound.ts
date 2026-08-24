import { useCallback } from 'react';
import { notificationSoundService } from '@/application/services/notification-sound.service';

export function useNotificationSound() {
  const playSound = useCallback(() => {
    notificationSoundService.playSound();
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    notificationSoundService.setSoundEnabled(enabled);
  }, []);

  const isSoundEnabled = useCallback(() => {
    return notificationSoundService.isSoundEnabled();
  }, []);

  return {
    playSound,
    setSoundEnabled,
    isSoundEnabled,
  };
}
