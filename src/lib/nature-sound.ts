// A calm nature soundscape generated in the browser (no audio file needed):
// a flowing stream, soft wind through leaves, and birds chirping now and then.
// Must be started from a tap/click, since browsers block sound until then.

export type Ambience = {
  setMuted(muted: boolean): void;
  pause(): void;
  resume(): void;
  dispose(): void;
};

const VOLUME = 0.9;

export function startNatureAmbience(startMuted: boolean): Ambience | null {
  const Ctx =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;

  const ctx = new Ctx();
  let muted = startMuted;
  let birdTimer: ReturnType<typeof setTimeout> | undefined;

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  if (!muted) master.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + 3);

  function noise(kind: "white" | "brown") {
    const length = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        if (kind === "white") {
          data[i] = white;
        } else {
          last = (last + 0.02 * white) / 1.02;
          data[i] = last * 3.5;
        }
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.start();
    return source;
  }

  // Slowly wobble an audio parameter around its value.
  function wobble(param: AudioParam, rate: number, depth: number) {
    const lfo = ctx.createOscillator();
    const amount = ctx.createGain();
    lfo.frequency.value = rate;
    amount.gain.value = depth;
    lfo.connect(amount).connect(param);
    lfo.start();
  }

  // Stream: band-passed noise whose pitch and loudness ripple like water.
  const streamFilter = ctx.createBiquadFilter();
  streamFilter.type = "bandpass";
  streamFilter.frequency.value = 1100;
  streamFilter.Q.value = 0.7;
  const streamSoften = ctx.createBiquadFilter();
  streamSoften.type = "lowpass";
  streamSoften.frequency.value = 2600;
  const streamGain = ctx.createGain();
  streamGain.gain.value = 0.05;
  noise("white").connect(streamFilter).connect(streamSoften).connect(streamGain).connect(master);
  wobble(streamFilter.frequency, 0.7, 250);
  wobble(streamGain.gain, 0.13, 0.015);

  // Wind through leaves: deep noise that swells and settles.
  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.value = 450;
  const windGain = ctx.createGain();
  windGain.gain.value = 0.18;
  noise("brown").connect(windFilter).connect(windGain).connect(master);
  wobble(windGain.gain, 0.05, 0.1);
  wobble(windFilter.frequency, 0.08, 150);

  // Birds: short call of 2–5 quick chirps, placed left or right.
  function birdCall() {
    if (muted || ctx.state !== "running") return;
    const start = ctx.currentTime + 0.05;
    const pitch = 2200 + Math.random() * 1800;
    const chirps = 2 + Math.floor(Math.random() * 4);
    const rising = Math.random() > 0.5;

    const out = ctx.createGain();
    out.gain.value = 0.035 + Math.random() * 0.03;
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.6 - 0.8;
    out.connect(pan).connect(master);

    for (let n = 0; n < chirps; n++) {
      const t = start + n * (0.09 + Math.random() * 0.06);
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch * (rising ? 0.85 : 1.2), t);
      osc.frequency.exponentialRampToValueAtTime(pitch * (rising ? 1.25 : 0.8), t + 0.07);
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(1, t + 0.01);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(env).connect(out);
      osc.start(t);
      osc.stop(t + 0.1);
    }
  }
  function scheduleBirds() {
    birdTimer = setTimeout(() => {
      birdCall();
      scheduleBirds();
    }, 1500 + Math.random() * 5500);
  }
  scheduleBirds();

  function fadeTo(value: number, seconds: number) {
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(value, now + seconds);
  }

  return {
    setMuted(next) {
      muted = next;
      if (!next && ctx.state === "suspended") void ctx.resume();
      fadeTo(next ? 0 : VOLUME, 0.5);
    },
    pause() {
      void ctx.suspend();
    },
    resume() {
      if (!muted) void ctx.resume();
    },
    dispose() {
      clearTimeout(birdTimer);
      void ctx.close();
    },
  };
}

// Same controls for a looping audio file, if one is configured.
export function startAudioFile(src: string, startMuted: boolean): Ambience {
  const audio = new Audio(src);
  audio.loop = true;
  audio.muted = startMuted;

  // Fade in over ~3s. (iPhones ignore volume changes, so there it simply starts.)
  const target = 0.6;
  audio.volume = 0;
  const fade = setInterval(() => {
    audio.volume = Math.min(target, audio.volume + target / 30);
    if (audio.volume >= target) clearInterval(fade);
  }, 100);

  void audio.play().catch(() => {});
  return {
    setMuted(next) {
      audio.muted = next;
      if (!next) void audio.play().catch(() => {});
    },
    pause() {
      audio.pause();
    },
    resume() {
      if (!audio.muted) void audio.play().catch(() => {});
    },
    dispose() {
      clearInterval(fade);
      audio.pause();
      audio.src = "";
    },
  };
}
