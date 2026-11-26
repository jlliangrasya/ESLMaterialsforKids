// Text-to-speech with the browser's built-in voices (Web Speech API).
// narrate() also reports which word is being read, for karaoke highlighting (Phase 3).
// say() announces each sentence on window as 'sb:speech' ({ text, rate }) and each word it reaches as
// 'sb:word' ({ text, index }), so an animated scene can time its action to the voice (src/art/AnimScene.jsx).
const emit = (name, detail) => { try { window.dispatchEvent(new CustomEvent(name, { detail })); } catch { /* no window */ } };
const wordAt = (text, charIndex) => text.slice(0, charIndex).split(' ').length - 1;

export function say(text, { rate = 0.85, pitch = 1 } = {}) {
  emit('sb:speech', { text, rate });
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate; u.pitch = pitch;
    u.onboundary = (e) => { if (e.name && e.name !== 'word') return; emit('sb:word', { text, index: wordAt(text, e.charIndex) }); };
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch { /* speech not available */ }
}

export function narrate(text, { rate = 0.85, pitch = 1, onWord, onEnd } = {}) {
  emit('sb:speech', { text, rate });
  const words = text.split(' '), offsets = [];
  let pos = 0; words.forEach((w) => { offsets.push(pos); pos += w.length + 1; });
  let fired = false, done = false, timer;
  const finish = () => { if (done) return; done = true; clearInterval(timer); onEnd && onEnd(); };
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate; u.pitch = pitch;
    u.onboundary = (e) => { if (e.name && e.name !== 'word') return; fired = true; clearInterval(timer);
      const k = offsets.findIndex((o, j) => e.charIndex >= o && (j === offsets.length - 1 || e.charIndex < offsets[j + 1])); if (k >= 0 && onWord) onWord(k); };
    u.onend = () => setTimeout(finish, 300);
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch { /* fall through to the timer */ }
  // Backup timer when the voice gives no word timings.
  const per = Math.round(330 / rate);
  setTimeout(() => { if (fired || done) return; let k = 0; onWord && onWord(0); timer = setInterval(() => { k++; if (k < words.length) onWord && onWord(k); else clearInterval(timer); }, per); }, 500);
  setTimeout(finish, 500 + words.length * per + 1500);
  return () => { done = true; clearInterval(timer); try { speechSynthesis.cancel(); } catch {} };
}
