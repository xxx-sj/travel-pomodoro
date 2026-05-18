export type SoundId = 'takeoff' | 'engine' | 'landing' | 'tear';

const URLS: Record<SoundId, string> = {
  takeoff: '/sounds/takeoff.mp3',
  engine: '/sounds/engine.mp3',
  landing: '/sounds/landing.mp3',
  tear: '/sounds/tear.mp3',
};

export class AudioBus {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private elements: Map<SoundId, HTMLAudioElement> = new Map();
  private volume = 0.6;

  init(): void {
    if (this.ctx) return;
    const Ctx: typeof AudioContext | undefined =
      (window as any).AudioContext ?? (window as any).webkitAudioContext;
    if (!Ctx) return;
    try {
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);

      for (const id of Object.keys(URLS) as SoundId[]) {
        const el = new Audio(URLS[id]);
        el.preload = 'auto';
        el.loop = id === 'engine';
        const source = this.ctx.createMediaElementSource(el);
        source.connect(this.master);
        this.elements.set(id, el);
      }
    } catch {
      this.ctx = null;
      this.master = null;
    }
  }

  async resume(): Promise<void> {
    if (this.ctx?.state === 'suspended') {
      try { await this.ctx.resume(); } catch { /* ignore */ }
    }
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.value = this.volume;
  }

  getVolume(): number { return this.volume; }

  private fade(toValue: number, durationMs = 200): void {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const g = this.master.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(toValue, now + durationMs / 1000);
  }

  play(id: SoundId): void {
    const el = this.elements.get(id);
    if (!el) return;
    el.currentTime = 0;
    this.fade(this.volume, 200);
    el.play().catch(() => { /* ignore — file may be missing */ });
  }

  stop(id: SoundId): void {
    const el = this.elements.get(id);
    if (!el) return;
    if (id === 'engine') {
      this.fade(0, 200);
      window.setTimeout(() => {
        el.pause();
        el.currentTime = 0;
        this.fade(this.volume, 200);
      }, 220);
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }
}

export const audioBus = new AudioBus();
