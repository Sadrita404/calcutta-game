// Tiny synthesized UI sounds (Web Audio) - no audio files to load, and fails silently
// on browsers without audio support.
let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  audioContext ??= new AudioCtor();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

function tone(frequency: number, startOffset: number, duration: number, volume: number, type: OscillatorType, endFrequency?: number) {
  try {
    const ctx = getContext();
    if (!ctx) return;
    const start = ctx.currentTime + startOffset;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  } catch {
    // Sound is decoration only - never let it break the game.
  }
}

/** Short tactile "tick" for every tap on an option or button. */
export function playClick() {
  tone(1400, 0, 0.06, 0.2, "triangle", 500);
}

/** Bright two-note chime for a correct answer. */
export function playCorrect() {
  tone(660, 0.1, 0.16, 0.14, "sine");
  tone(990, 0.22, 0.24, 0.14, "sine");
}

/** Juicy rising "plop" when a Rasogolla lands in the bowl. */
export function playCatch() {
  tone(520, 0, 0.12, 0.16, "sine", 1040);
  tone(1560, 0.05, 0.08, 0.06, "triangle");
}

/** Soft low buzz for a wrong answer. */
export function playWrong() {
  tone(240, 0.1, 0.28, 0.09, "sawtooth", 150);
}
