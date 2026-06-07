class AudioService {
  private ctx: AudioContext | null = null;
  private muted: boolean = true;

  constructor() {
    // Load mute state from localStorage (default: muted)
    const stored = localStorage.getItem('husky-snow-muted');
    this.muted = stored === null ? true : stored === 'true';
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(val: boolean) {
    this.muted = val;
    localStorage.setItem('husky-snow-muted', String(val));
    if (!val) {
      this.initContext();
    }
  }

  private createOscillator(
    type: OscillatorType,
    freq: number,
    duration: number,
    gainStart: number,
    gainEnd: number = 0.001
  ): { osc: OscillatorNode; gain: GainNode } | null {
    if (this.muted) return null;
    this.initContext();
    if (!this.ctx) return null;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(gainStart, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(gainEnd, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    return { osc, gain };
  }

  public playClick() {
    const sound = this.createOscillator('triangle', 600, 0.05, 0.15);
    if (!sound) return;
    
    sound.osc.frequency.exponentialRampToValueAtTime(150, this.ctx!.currentTime + 0.05);
    sound.osc.start();
    sound.osc.stop(this.ctx!.currentTime + 0.05);
  }

  public playDiceRoll() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    // Synthesize rolling bumps
    const count = 6 + Math.floor(Math.random() * 4);
    let delay = 0;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (this.muted) return;
        const pitch = 80 + Math.random() * 60;
        const sound = this.createOscillator('sine', pitch, 0.1, 0.25);
        if (sound) {
          sound.osc.frequency.exponentialRampToValueAtTime(30, this.ctx!.currentTime + 0.1);
          sound.osc.start();
          sound.osc.stop(this.ctx!.currentTime + 0.1);
        }
      }, delay * 1000);
      delay += 0.12 + Math.random() * 0.15;
    }
  }

  public playChime() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    // Play a lovely major triad arpeggio (C major: C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.muted) return;
        const sound = this.createOscillator('sine', freq, 0.6, 0.18);
        if (sound) {
          sound.osc.start();
          sound.osc.stop(this.ctx!.currentTime + 0.6);
        }
      }, idx * 100);
    });
  }

  public playThud() {
    const sound = this.createOscillator('sine', 110, 0.4, 0.5);
    if (!sound) return;

    sound.osc.frequency.exponentialRampToValueAtTime(20, this.ctx!.currentTime + 0.4);
    sound.osc.start();
    sound.osc.stop(this.ctx!.currentTime + 0.4);
  }

  public playMagic() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    // Pitch sweep magic whoosh
    const duration = 0.8;
    const sound = this.createOscillator('triangle', 220, duration, 0.15);
    if (!sound) return;

    sound.osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + duration / 2);
    sound.osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + duration);
    
    sound.osc.start();
    sound.osc.stop(this.ctx.currentTime + duration);
  }

  public playFanfare() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    // Triumphant chord (major chord rising)
    const steps = [
      { notes: [261.63, 329.63, 392.00], time: 0 },
      { notes: [349.23, 440.00, 523.25], time: 0.15 },
      { notes: [392.00, 493.88, 587.33], time: 0.3 },
      { notes: [523.25, 659.25, 783.99], time: 0.45 },
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        if (this.muted) return;
        step.notes.forEach((freq) => {
          const sound = this.createOscillator('triangle', freq, 0.5, 0.08);
          if (sound) {
            sound.osc.start();
            sound.osc.stop(this.ctx!.currentTime + 0.5);
          }
        });
      }, step.time * 1000);
    });
  }
}

export const audioService = new AudioService();
export default audioService;
