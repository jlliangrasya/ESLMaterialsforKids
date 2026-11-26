// Find the picture: hear a word, tap the right picture.
import { useEffect, useState } from 'react';
import { shuf } from '../engine/banks.js';
import * as sfx from '../audio/sfx.js';
import { Hint, say, shake } from './shared.jsx';

export default function Find({ x, ctx }) {
  if (!x.opts) x.opts = shuf([x.w, ...shuf(x.t.words.filter((w) => w !== x.w)).slice(0, 3)]);
  const [wrong, setWrong] = useState(false);
  useEffect(() => { if (x.said) return; x.said = 1; const t = setTimeout(() => say(x.w[1], 0.8), 500); return () => clearTimeout(t); }, [x]);
  const tap = (w, el) => {
    if (w === x.w) { x.done = 1; ctx.score(x, x.mist.word ? 1 : 2); say(x.w[1], 0.8); ctx.update(); return; }
    x.mist.word = (x.mist.word || 0) + 1; shake(el); sfx.wrong(); say(x.w[1], 0.7); setWrong(true);
  };
  return (
    <>
      <h3 className="tt">Find: “{x.w[1]}” <span className="zh" style={{ display: 'inline' }}>{x.w[2]}</span></h3>
      <div className="wgrid four">{x.opts.map((w, k) => <button key={k} className={'wcard pic' + (x.done && w === x.w ? ' right' : '')} data-right={w === x.w ? 1 : 0} disabled={!!x.done} onClick={(e) => tap(w, e.currentTarget)} aria-label={x.done ? w[1] : `Picture ${k + 1}`}><i>{w[0]}</i>{x.done && <b>{w[1]}</b>}</button>)}</div>
      <div className="row"><button className="ghost" onClick={() => say(x.w[1], 0.8)}>🔊 Hear it again<span className="zh">再听一遍</span></button>{x.done && <button className="go" data-next onClick={ctx.next}>Next →<span className="zh">下一个</span></button>}</div>
      {x.done ? <Hint en="Great! Say the word!" zh="说出这个词！" /> : wrong ? <Hint en="Not that one — listen again!" zh="不是这个，再听一遍！" /> : <Hint en="Listen and tap the right picture." zh="听一听，点出正确的图片。" />}
    </>
  );
}
