export type SoundId = 'takeoff' | 'engine' | 'landing' | 'captain_takeoff' | 'captain_landing';

const URLS: Record<SoundId, string> = {
  takeoff: '/sounds/takeoff.mp3',
  engine: '/sounds/engine.mp3',
  landing: '/sounds/landing.mp3',
  captain_takeoff: '/sounds/captain_takeoff.mp3',
  captain_landing: '/sounds/captain_landing.mp3',
};

// When music plays, engine ducks to this fraction of its normal volume.
const ENGINE_AMBIENT_FACTOR = 0.35;

/**
 * Effects-only audio bus (engine / captain / takeoff / landing). In-flight
 * music is rendered declaratively by <MusicLayer>; this class only needs to
 * know whether music is active so it can duck the engine accordingly.
 */
export class AudioBus {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private elements: Map<SoundId, HTMLAudioElement> = new Map();
  private volume = 0.6;
  private musicVolume = 0.4;
  private musicActive = false;
  // Tracks the in-flight engine fade-out animation. Without this, a quick
  // stop → play sequence (e.g. landing → new takeoff, or two stop() calls
  // from handleExpire + store.land()) would leave a stale setTimeout that
  // pauses the engine right after we restart it — which manifested as
  // "재시작할때 가끔 비행기 소리가 멈추는".
  private engineFadeTimer: number | null = null;

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
        if (id === 'engine') {
          // Safety net for browsers / WebAudio paths where `loop` doesn't
          // re-trigger reliably — restart playback from the top whenever the
          // engine element fires `ended`. No-op for non-engine sounds.
          el.addEventListener('ended', () => {
            if (!el.loop) return;
            el.currentTime = 0;
            el.play().catch(() => { /* ignore */ });
          });
        }
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

  setMusicVolume(v: number): void {
    this.musicVolume = Math.max(0, Math.min(1, v));
  }
  getMusicVolume(): number { return this.musicVolume; }

  /** Notify the bus that music is playing — used to duck engine ambient. */
  setMusicActive(active: boolean): void {
    this.musicActive = active;
    this.applyEngineDucking();
  }

  private applyEngineDucking(): void {
    const engine = this.elements.get('engine');
    if (engine) engine.volume = this.musicActive ? ENGINE_AMBIENT_FACTOR : 1.0;
  }

  private cancelEngineFade(): void {
    if (this.engineFadeTimer !== null) {
      clearTimeout(this.engineFadeTimer);
      this.engineFadeTimer = null;
    }
  }

  private engineTargetVolume(): number {
    return this.musicActive ? ENGINE_AMBIENT_FACTOR : 1.0;
  }

  play(id: SoundId): void {
    const el = this.elements.get(id);
    if (!el) return;
    if (id === 'engine') {
      // A pending fade-out would pause this element ~200ms after we start
      // it. Kill it first.
      this.cancelEngineFade();
      el.volume = this.engineTargetVolume();
    }
    const start = () => {
      el.currentTime = 0;
      el.play().catch(() => { /* file missing or blocked */ });
    };
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(start).catch(() => start());
    } else {
      start();
    }
  }

  stop(id: SoundId): void {
    const el = this.elements.get(id);
    if (!el) return;
    if (id === 'engine') {
      // Fade the engine's *own* volume to 0, then pause. The old impl
      // faded the master gain instead, which silenced every other sound
      // (captain announcements, landing roll) for ~200 ms after handleExpire.
      this.cancelEngineFade();
      const startVol = el.volume;
      const startedAt = performance.now();
      const durationMs = 200;
      const tick = () => {
        const t = Math.min(1, (performance.now() - startedAt) / durationMs);
        el.volume = startVol * (1 - t);
        if (t < 1) {
          this.engineFadeTimer = window.setTimeout(tick, 16);
        } else {
          el.pause();
          el.currentTime = 0;
          el.volume = this.engineTargetVolume();
          this.engineFadeTimer = null;
        }
      };
      tick();
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }
}

export const audioBus = new AudioBus();
