// A picture that acts out the sentence.
// - Hand-made scenes: a spec with anim:"<name>" (listed in BESPOKE), e.g. the big wave.
// - Every other scene: src/art/motion.js builds the moving version from the act/feel emojis.
//
// Timing: scenes with a second beat (an event bubble, or a hand-made scene) start calm, then "go".
// "go" comes when the voice reaches the cue word — the joining word before the event block
// ("…the sea WHEN a big wave came"), else the start of the last block — or as soon as that block is said
// on its own. It listens to 'sb:speech' / 'sb:word' from src/audio/speech.js and uses a timer estimate
// when the voice gives no word timings; with no voice at all it plays after a pause.
// With prefers-reduced-motion it shows one still picture of the main moment (no timers, no movement).
import { useEffect, useMemo, useRef, useState } from 'react';
import Wave from './anims/Wave.jsx';
import { animatedScene, canAnimate } from './motion.js';
import '../styles/anim.css';

const BESPOKE = { wave: Wave };
export const hasAnim = (spec) => !!spec && (!!BESPOKE[spec.anim] || canAnimate(spec));

const norm = (t) => String(t || '').toLowerCase().replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();
const nWords = (t) => (norm(t) ? norm(t).split(' ').length : 0);
const reducedMotion = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };

// Which word of the whole sentence starts the second beat.
function cueOf(it) {
  if (!it || !it.c || !it.c.length) return null;
  let i = it.c.findIndex((c) => c[0] === 'event');
  if (i < 0) { i = it.c.length - 1; while (i > 0 && /^link/.test(it.c[i][0])) i--; }
  if (i <= 0) return null;
  const before = nWords(it.c.slice(0, i).map((c) => c[1]).join(' '));
  const prevIsLink = /^link/.test(it.c[i - 1][0]);
  return { word: prevIsLink ? before - nWords(it.c[i - 1][1]) : before, event: norm(it.c[i][1]) };
}

export default function AnimScene({ spec, it }) {
  const Bespoke = BESPOKE[spec.anim];
  const built = useMemo(() => (Bespoke ? null : animatedScene(spec)), [spec, Bespoke]);
  const two = Bespoke ? true : !!(built && built.two);
  const still = reducedMotion();
  const [run, setRun] = useState(0), [go, setGo] = useState(still || !two);
  const timer = useRef(0), wait = useRef(null);
  const whole = it ? norm(it.c.map((c) => c[1]).join(' ')) : '';
  const cue = cueOf(it);

  // Restart the scene calm, and "go" after `ms` (or earlier, on the cue word).
  const restart = (ms, waitFor = null) => {
    clearTimeout(timer.current); wait.current = waitFor;
    setGo(false); setRun((r) => r + 1);
    timer.current = setTimeout(() => { wait.current = null; setGo(true); }, ms);
  };
  const goNow = () => { clearTimeout(timer.current); wait.current = null; setGo(true); };

  useEffect(() => {
    if (still || !two) { setGo(true); return undefined; }
    restart(1800);
    const onSpeech = (e) => {
      const { text, rate = 0.85 } = e.detail || {}, t = norm(text);
      if (whole && t === whole && cue) restart(300 + cue.word * Math.round(330 / rate), { text, word: cue.word });
      else if (cue && t === cue.event) restart(150);
    };
    const onWord = (e) => {
      const w = wait.current, d = e.detail || {};
      if (w && d.text === w.text && d.index >= w.word) goNow();
    };
    window.addEventListener('sb:speech', onSpeech); window.addEventListener('sb:word', onWord);
    return () => { clearTimeout(timer.current); window.removeEventListener('sb:speech', onSpeech); window.removeEventListener('sb:word', onWord); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whole, still, two, built]);

  return (
    <div className={'scene-wrap anim-scene' + (go ? ' is-go' : '')}>
      {Bespoke
        ? <svg key={run} className={'scene ' + Bespoke.cls} viewBox="0 0 400 250" role="img" aria-label={Bespoke.label}><Bespoke /></svg>
        : <div key={run} className="mo-wrap" dangerouslySetInnerHTML={{ __html: built.svg }} />}
      {!still && two && (
        <button type="button" className="replay" onClick={() => restart(900)} aria-label="Play the picture again">
          ▶ Again<span className="zh">再看一次</span>
        </button>
      )}
    </div>
  );
}
