// Utilitaire pour jouer les sons de notification

// Type pour gérer les navigateurs avec webkitAudioContext
interface AudioContextWithWebkit extends Window {
  webkitAudioContext: typeof AudioContext;
}

class NotificationSound {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // Initialiser AudioContext seulement après interaction utilisateur
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as AudioContextWithWebkit).webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext non supporté:', error);
    }
  }

  // Son de notification pour SMS reçu (générés programmatiquement)
  async playNotificationSound() {
    if (!this.isEnabled || !this.audioContext) {
      return;
    }

    try {
      // Reprendre le contexte audio si suspendu
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Créer un son de notification agréable
      this.createNotificationBeep();
    } catch (error) {
      console.warn('Erreur lecture son:', error);
    }
  }

  private createNotificationBeep() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    // Connecter oscillateur -> gain -> destination
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Configuration du son (notification douce)
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime); // Fréquence haute
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1); // Descente
    
    // Volume avec fade in/out
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    // Jouer le son
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // Son de notification avec audio HTML5 (fallback)
  playHTMLAudioNotification() {
    if (!this.isEnabled) return;

    // Créer un son programmatiquement via data URI
    const audioData = this.generateNotificationDataURI();
    const audio = new Audio(audioData);
    
    audio.volume = 0.5;
    audio.play().catch(error => {
      console.warn('Erreur lecture audio HTML5:', error);
    });
  }

  private generateNotificationDataURI(): string {
    // Générer un son simple en data URI (bip court)
    return "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dvv2UfBTyA0u+5eSMFMIHN8+SEOgY=";
  }

  // Activer/désactiver les sons
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem('notificationSoundEnabled', enabled.toString());
  }

  isNotificationEnabled(): boolean {
    const stored = localStorage.getItem('notificationSoundEnabled');
    return stored !== null ? stored === 'true' : true; // Activé par défaut
  }

  // Initialiser avec les préférences utilisateur
  loadUserPreferences() {
    this.isEnabled = this.isNotificationEnabled();
  }
}

// Instance singleton
export const notificationSound = new NotificationSound();

// Hook pour utiliser dans React
export const useNotificationSound = () => {
  const playNotification = async () => {
    try {
      await notificationSound.playNotificationSound();
    } catch {
      // Fallback vers HTML5 Audio
      notificationSound.playHTMLAudioNotification();
    }
  };

  return {
    playNotification,
    setEnabled: notificationSound.setEnabled.bind(notificationSound),
    isEnabled: notificationSound.isNotificationEnabled(),
  };
};