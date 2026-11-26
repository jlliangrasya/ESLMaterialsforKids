// Short sound effects made with WebAudio — no audio files.
let ac = null;
const tone = (f, t0, d, type, vol) => {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + t0;
    o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + 0.05);
  } catch { /* audio not available */ }
};
export const bigStar = () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.35, 'triangle', 0.28)); [1568, 2093].forEach((f, i) => tone(f, 0.42 + i * 0.08, 0.3, 'sine', 0.12)); };
export const smallStar = () => [659, 988].forEach((f, i) => tone(f, i * 0.11, 0.4, 'triangle', 0.25));
export const ok = () => { tone(784, 0, 0.12, 'triangle', 0.2); tone(1047, 0.08, 0.18, 'triangle', 0.2); };
export const wrong = () => tone(196, 0, 0.25, 'sawtooth', 0.07);
export const click = () => tone(1200, 0, 0.04, 'square', 0.05);
