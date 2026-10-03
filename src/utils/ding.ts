// A soft little bell, synthesized with Web Audio (no sound files).

let ctx: AudioContext | null = null;
let out: GainNode | null = null;

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

function play(ctx: AudioContext, out: GainNode, freq: number) {
  const t = ctx.currentTime;
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

export function ding(freq: number) {
  if (typeof window === "undefined") return;
  const { ctx, out } = audio();
  if (ctx.state === "running") {
    play(ctx, out, freq);
    return;
  }
  // "suspended" (no gesture yet) or Safari's "interrupted" (after sleep or
  // another app took the audio): wake it up, then play once it's running
  ctx
    .resume()
    .then(() => play(ctx, out, freq))
    .catch(() => {});
}
