// Sound effects utility
export class SoundEffects {
  private static enabled = true;

  static toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', JSON.stringify(this.enabled));
  }

  static isEnabled() {
    const stored = localStorage.getItem('soundEnabled');
    return stored ? JSON.parse(stored) : true;
  }

  static play(type: 'click' | 'success' | 'error' | 'notification' | 'complete') {
    if (!this.isEnabled()) return;

    const frequencies: Record<string, number[]> = {
      click: [800, 0.1],
      success: [523.25, 0.2],
      error: [329.63, 0.15],
      notification: [659.25, 0.15],
      complete: [783.99, 0.25]
    };

    const [freq, duration] = frequencies[type];
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Silent fail if audio context not supported
    }
  }
}
