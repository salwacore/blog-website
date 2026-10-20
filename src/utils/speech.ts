// Speech synthesis narration service

class NarrationService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private onStateChangeCallback?: (state: { isPlaying: boolean; isPaused: boolean; progress: number }) => void;
  private textLength: number = 0;
  private currentCharIndex: number = 0;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public registerCallback(cb: (state: { isPlaying: boolean; isPaused: boolean; progress: number }) => void) {
    this.onStateChangeCallback = cb;
  }

  public start(text: string, rate: number = 1.0) {
    if (!this.isSupported()) return;

    this.stop();

    // Clean markdown syntax for smooth speech
    const cleanText = text
      .replace(/#+\s+/g, '')
      .replace(/>\s+/g, '')
      .replace(/[*_~`]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    this.textLength = cleanText.length;
    this.currentCharIndex = 0;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick best English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notify();
    };

    utterance.onboundary = (event) => {
      if (event.charIndex) {
        this.currentCharIndex = event.charIndex;
        this.notify();
      }
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentCharIndex = this.textLength;
      this.notify();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.notify();
    };

    this.utterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (!this.isSupported()) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      this.isPaused = true;
      this.isSpeaking = false;
      this.notify();
    }
  }

  public resume() {
    if (!this.isSupported()) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
      this.isSpeaking = true;
      this.notify();
    }
  }

  public stop() {
    if (!this.isSupported()) return;
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentCharIndex = 0;
    this.notify();
  }

  public setRate(rate: number) {
    if (this.utterance && this.isSpeaking) {
      // SpeechSynthesisUtterance rate can't be changed live in some browsers without restarting
      const remainingProgress = this.textLength > 0 ? this.currentCharIndex / this.textLength : 0;
      // adjust rate on utterance
      this.utterance.rate = rate;
    }
  }

  private notify() {
    if (this.onStateChangeCallback) {
      const progress = this.textLength > 0 ? Math.min(100, Math.round((this.currentCharIndex / this.textLength) * 100)) : 0;
      this.onStateChangeCallback({
        isPlaying: this.isSpeaking,
        isPaused: this.isPaused,
        progress,
      });
    }
  }
}

export const narrationService = new NarrationService();
