/* Sound effects, synthesised with WebAudio so there are no audio files to ship. */

export type Sfx = ReturnType<typeof createSfx>;

export function createSfx(pace: number) {
  let ac: AudioContext | null = null;
  let master: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  let muted = false;

  function audio(): AudioContext | null {
    if (!ac) {
      try {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ac = new Ctor();
        master = ac.createGain();
        master.gain.value = muted ? 0 : 0.9;
        master.connect(ac.destination);
      } catch {
        ac = null;
      }
    }
    if (ac && ac.state === 'suspended') {
      try { void ac.resume(); } catch { /* ignore */ }
    }
    return ac;
  }

  function nbuf(c: AudioContext): AudioBuffer {
    if (!noise) {
      noise = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return noise;
  }

  function burst(c: AudioContext, type: BiquadFilterType, f0: number, f1: number, dur: number, peak: number, q = 0, delay = 0) {
    const t = c.currentTime + delay;
    const s = c.createBufferSource();
    s.buffer = nbuf(c);
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    if (q) f.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.012, dur / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master!);
    s.start(t); s.stop(t + dur + 0.05);
  }

  function rise(c: AudioContext, type: BiquadFilterType, f0: number, f1: number, dur: number, peak: number, q = 0) {
    const t = c.currentTime;
    const s = c.createBufferSource();
    s.buffer = nbuf(c);
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    if (q) f.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + dur);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.04);
    s.connect(f); f.connect(g); g.connect(master!);
    s.start(t); s.stop(t + dur + 0.1);
  }

  function tone(c: AudioContext, f0: number, f1: number, dur: number, peak: number, type: OscillatorType = 'sine', delay = 0, rising = false) {
    const t = c.currentTime + delay;
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    if (rising) {
      g.gain.exponentialRampToValueAtTime(peak, t + dur);
      g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.04);
    } else {
      g.gain.exponentialRampToValueAtTime(peak, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    }
    o.connect(g); g.connect(master!);
    o.start(t); o.stop(t + dur + 0.1);
  }

  return {
    /** Unlocks audio on the first key press. */
    unlock() { audio(); },
    get muted() { return muted; },
    setMuted(on: boolean) {
      muted = on;
      if (master) master.gain.value = muted ? 0 : 0.9;
    },
    tap(i: number) {
      const c = audio(); if (!c) return;
      burst(c, 'highpass', 1800, 900, 0.08, 0.32);
      tone(c, 160 * Math.pow(2, i / 5), 80, 0.14, 0.38, 'triangle');
    },
    beat(i: number) {
      const c = audio(); if (!c) return;
      tone(c, 392 * Math.pow(2, i / 6), 392 * Math.pow(2, i / 6), 0.5, 0.2, 'sine');
      tone(c, 784 * Math.pow(2, i / 6), 784 * Math.pow(2, i / 6), 0.35, 0.07, 'sine', 0.02);
    },
    riser(dur: number) {
      const c = audio(); if (!c) return;
      rise(c, 'bandpass', 250, 3800, dur, 0.5, 2);
      tone(c, 70, 360, dur, 0.22, 'sawtooth', 0, true);
    },
    whoosh(dur: number) {
      const c = audio(); if (!c) return;
      rise(c, 'bandpass', 500, 5000, dur, 0.7, 1.1);
    },
    boom() {
      const c = audio(); if (!c) return;
      tone(c, 150, 32, 0.8, 1.0, 'sine');
      tone(c, 72, 26, 1.0, 0.8, 'sine');
      burst(c, 'lowpass', 2200, 180, 0.55, 0.9);
      burst(c, 'highpass', 3200, 1400, 0.14, 0.45);
    },
    crackle() {
      const c = audio(); if (!c) return;
      for (let k = 0; k < 10; k++) {
        burst(c, 'highpass', 2200 + Math.random() * 2400, 1400, 0.05, 0.1 + Math.random() * 0.1, 0, 0.05 + k * 0.05 + Math.random() * 0.03);
      }
    },
    swoosh() {
      const c = audio(); if (!c) return;
      rise(c, 'bandpass', 400, 2600, 0.5 * pace, 0.3, 0.8);
    },
    ding() {
      const c = audio(); if (!c) return;
      tone(c, 1175, 1175, 1.3, 0.16, 'sine');
      tone(c, 1760, 1760, 1.0, 0.09, 'sine', 0.05);
    },
  };
}
