// The animated story player: one picture at a time, narrated, with the word being read highlighted (karaoke).
import { useEffect, useRef, useState } from 'react';
import Scene from '../art/Scene.jsx';
import { narrate } from '../audio/speech.js';

export default function StoryPlayer({ sto, auto = true, onEnd }) {
  const [i, setI] = useState(0), [on, setOn] = useState(false), [ended, setEnded] = useState(false);
  const [slow, setSlow] = useState(false), [word, setWord] = useState(-1), [reading, setReading] = useState(false);
  const R = useRef({ tok: 0, t: null, stop: null }), onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  const stop = () => { const r = R.current; r.tok++; clearTimeout(r.t); r.stop && r.stop(); r.stop = null; setOn(false); setReading(false); setWord(-1); };
  useEffect(() => () => { const r = R.current; r.tok++; clearTimeout(r.t); r.stop && r.stop(); }, []);

  // Read panel j aloud; then (if playing) move on to the next panel.
  const readPanel = (j, keepGoing, slowNow = slow) => {
    const r = R.current, tok = ++r.tok, p = sto.p[j];
    setI(j); setWord(-1); setReading(false);
    r.t = setTimeout(() => {
      if (tok !== r.tok) return;
      setReading(true);
      r.stop = narrate(p.s, {
        rate: slowNow ? 0.6 : 0.85, pitch: p.pitch || 1,
        onWord: (k) => tok === r.tok && setWord(k),
        onEnd: () => {
          if (tok !== r.tok) return;
          setWord(1e9);
          if (!keepGoing) { setOn(false); return; }
          if (j < sto.p.length - 1) r.t = setTimeout(() => tok === r.tok && readPanel(j + 1, true, slowNow), 1200);
          else { setOn(false); setEnded(true); onEndRef.current && onEndRef.current(); }
        },
      });
    }, keepGoing ? 1100 : 300);
  };
  const play = () => { if (on) { stop(); return; } const start = ended ? 0 : i; setEnded(false); setOn(true); readPanel(start, true); };
  const jump = (j) => { const wasOn = on; stop(); if (wasOn) { setOn(true); readPanel(j, true); } else setI(j); };

  useEffect(() => { if (auto) { setOn(true); readPanel(0, true); } }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const p = sto.p[i], words = p.s.split(' ');
  return (
    <div className="player">
      <div className="pstage"><div className="pv anim" key={i}><Scene spec={p.sc} animate /></div></div>
      <div className={'pcap' + (reading ? ' reading' : '')} aria-live="polite">
        {p.n && <span className="spkn">{p.n}:</span>}
        {words.map((w, k) => <span key={k} className={'w' + (k === word ? ' on' : '') + (k < word ? ' past' : '')}>{w}</span>)}
        {p.zh && <span className="zh pzh">{p.zh}</span>}
      </div>
      <div className="row">
        <button className="ghost ctl" title="Previous picture" aria-label="Previous picture" onClick={() => jump(Math.max(0, i - 1))}>⏮</button>
        <button className="go" onClick={play}>{on ? '⏸ Pause' : ended ? '🔁 Watch again' : '▶ Play the story'}<span className="zh">{on ? '暂停' : ended ? '再看一遍' : '播放故事'}</span></button>
        <button className="ghost ctl" title="Next picture" aria-label="Next picture" onClick={() => jump(Math.min(sto.p.length - 1, i + 1))}>⏭</button>
        <button className="ghost" onClick={() => setSlow(!slow)}>🐢 Slow: {slow ? 'on' : 'off'}<span className="zh">慢速：{slow ? '开' : '关'}</span></button>
      </div>
      <div className={'pthumbs' + (sto.p.length > 3 ? ' six' : '')}>
        {sto.p.map((q, j) => <button key={j} className={j === i ? 'cur' : ''} title={`Picture ${j + 1}`} onClick={() => { stop(); readPanel(j, false); }}><b>{j + 1}</b><Scene spec={q.sc} /></button>)}
      </div>
    </div>
  );
}
