// A soft little bell, synthesized with Web Audio (no sound files).

let ctx: AudioContext | null = null;
let out: GainNode | null = null;

// Sound only ever follows a real user action: handlers call allowSound(), and
// ding() is a no-op outside that window. Notes are never queued for later, so
// nothing can play by surprise (e.g. on page load after audio was blocked).
let soundAllowedUntil = 0;

/** Open a short window in which ding() may play. Call from user event handlers. */
export function allowSound(forMs = 1000) {
  soundAllowedUntil = Math.max(soundAllowedUntil, performance.now() + forMs);
}

const soundAllowed = () => performance.now() < soundAllowedUntil;

function audio() {
  // Rebuild if the browser closed the context
  if (!ctx || ctx.state === "closed") {
    // iOS mutes Web Audio with the silent switch unless the page declares
    // itself as media playback (Safari 17+; ignored elsewhere)
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) session.type = "playback";

    ctx = new AudioContext();
    // Gentle lowpass + master volume keeps it soft and unpiercing
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 3800;
    out = ctx.createGain();
    out.gain.value = 0.22;
    out.connect(lowpass).connect(ctx.destination);
  }
  return { ctx, out: out! };
}

// Bell-ish partials: [frequency ratio, relative gain, decay seconds]
const PARTIALS: [number, number, number][] = [
  [1, 1, 1.6],
  [2, 0.28, 0.9],
  [3.01, 0.1, 0.5],
  [4.2, 0.04, 0.3],
];

/** Schedule one bell at audio-clock time `t` (seconds). */
function play(ctx: AudioContext, out: GainNode, freq: number, t: number) {
  for (const [ratio, gain, decay] of PARTIALS) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    // A tiny downward "blip" into pitch makes it feel plucked and cute
    osc.frequency.setValueAtTime(freq * ratio * 1.012, t);
    osc.frequency.exponentialRampToValueAtTime(freq * ratio, t + 0.04);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(gain, t + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, t + decay);

    osc.connect(env).connect(out);
    osc.start(t);
    osc.stop(t + decay + 0.05);
  }
}

// A note that couldn't play within this long of being asked for is dropped:
// better a missing note than several bunched together when audio wakes up late
const MAX_LATENCY_MS = 120;

/**
 * Wake the audio engine (call from a user event). Resolves true once it's
 * running, so callers can schedule a sequence on the audio clock up front.
 */
export function prepareAudio(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  const { ctx } = audio();
  if (ctx.state === "running") return Promise.resolve(true);
  return ctx
    .resume()
    .then(() => ctx.state === "running")
    .catch(() => false);
}

/**
 * Schedule a sequence of bells `offsetsMs` apart on the audio clock (audio must
 * already be running, see prepareAudio). Returns each note's audio-clock time,
 * to compare against heardTime(), or null if nothing was scheduled.
 */
export function dingSequence(freqs: number[], offsetsMs: number[]): number[] | null {
  if (typeof window === "undefined" || !soundAllowed() || !ctx || ctx.state !== "running") {
    return null;
  }
  // A small lead so the first note's attack isn't clipped by the render quantum
  const start = ctx.currentTime + 0.03;
  const times = offsetsMs.map((ms) => start + ms / 1000);
  freqs.forEach((f, i) => play(ctx!, out!, f, times[i]));
  return times;
}

/**
 * The audio-clock time of what's coming out of the speaker right now. Lags
 * ctx.currentTime by the device's output delay (often 50-200ms on phones, more
 * over Bluetooth), so visuals keyed to it line up with the sound.
 */
export function heardTime(): number {
  if (!ctx) return 0;
  const ts = ctx.getOutputTimestamp?.();
  // Zero right after the audio wakes; plausible (0-500ms behind) otherwise
  if (ts?.contextTime && ts.performanceTime) {
    const t = ts.contextTime + (performance.now() - ts.performanceTime) / 1000;
    const behind = ctx.currentTime - t;
    if (behind >= 0 && behind <= 0.5) return t;
  }
  return ctx.currentTime - Math.min((ctx.outputLatency || 0) + (ctx.baseLatency || 0), 0.5);
}

/**
 * Play a bell, optionally `delay` seconds from now on the audio clock.
 * Scheduling on the audio clock keeps a sequence perfectly even even when
 * the page itself is busy (e.g. right after load on a phone).
 */
export function ding(freq: number, delay = 0) {
  if (typeof window === "undefined" || !soundAllowed()) return;
  const { ctx, out } = audio();
  if (ctx.state === "running") {
    play(ctx, out, freq, ctx.currentTime + delay);
    return;
  }
  // "suspended" (no gesture yet) or Safari's "interrupted" (after sleep or
  // another app took the audio): wake it up, then play only if that was quick
  const asked = performance.now();
  ctx
    .resume()
    .then(() => {
      if (soundAllowed() && performance.now() - asked < MAX_LATENCY_MS) {
        play(ctx, out, freq, ctx.currentTime + delay);
      }
    })
    .catch(() => {});
}
