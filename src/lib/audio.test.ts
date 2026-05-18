import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioBus } from './audio';

class MockGain {
  value = 1;
  cancelScheduledValues = vi.fn();
  setValueAtTime = vi.fn();
  linearRampToValueAtTime = vi.fn();
}
class MockGainNode {
  gain = new MockGain();
  connect = vi.fn();
}
class MockAudioContext {
  destination = {};
  currentTime = 0;
  state = 'running';
  createGain() { return new MockGainNode(); }
  createMediaElementSource() { return { connect: vi.fn() }; }
  resume = vi.fn().mockResolvedValue(undefined);
}

describe('AudioBus', () => {
  beforeEach(() => {
    (globalThis as any).AudioContext = MockAudioContext;
    (globalThis as any).Audio = class { src = ''; preload = ''; loop = false; play = vi.fn().mockResolvedValue(undefined); pause = vi.fn(); currentTime = 0; constructor(src: string) { this.src = src; } };
  });

  it('starts with default volume 0.6', () => {
    const bus = new AudioBus();
    expect(bus.getVolume()).toBe(0.6);
  });

  it('setVolume clamps to [0,1]', () => {
    const bus = new AudioBus();
    bus.setVolume(1.5);
    expect(bus.getVolume()).toBe(1);
    bus.setVolume(-0.2);
    expect(bus.getVolume()).toBe(0);
  });

  it('no-ops when AudioContext is undefined', () => {
    delete (globalThis as any).AudioContext;
    delete (window as any).webkitAudioContext;
    const bus = new AudioBus();
    expect(() => { bus.init(); bus.play('takeoff'); bus.stop('engine'); }).not.toThrow();
  });
});
