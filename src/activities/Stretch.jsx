// Stretch it! Start short, add a place (where), then a reason (because).
import { useState } from 'react';
import Scene from '../art/Scene.jsx';
import { WHERE, REASON, whyText, shuf } from '../engine/banks.js';
import { curText } from '../engine/lesson.js';
import * as sfx from '../audio/sfx.js';
import { Chunks, MarkRow, Hint, say, shake } from './shared.jsx';

export default function Stretch({ x, ctx }) {
  const it = x.it, stg = x.stage || 0;
  const [hint, setHint] = useState(null);
  const shown = { c: it.c.slice(0, 2).concat(x.where ? [['where', x.where[1]]] : []).concat(stg >= 2 ? [it.c[2]] : []) };
  const sc = { ...it.sc, place: x.where ? x.where[0] : 'none', feel: stg >= 2 ? it.sc.feel : null };
  if (stg === 0 && !x.wo) x.wo = shuf(WHERE).slice(0, 3);
  if (stg === 1 && !x.ro) x.ro = shuf([it.rs, ...shuf(REASON.filter((r) => r.w !== it.rs.w)).slice(0, 2)]);
  const pickWhy = (r, el) => {
    if (r.w === it.rs.w) { x.stage = 2; sfx.ok(); setHint(null); ctx.update(); setTimeout(() => say(curText(x)), 400); return; }
    x.mist.why = (x.mist.why || 0) + 1; shake(el); sfx.wrong(); setHint(['Hmm… does that make sense? Look at the picture!', '看看图，这样说对吗？']);
  };
  return (
    <>
      <Scene spec={sc} />
      <Chunks it={shown} />
      {stg === 0 && <><Hint en="Where? Add a place!" zh="加一个地方！" /><div className="tiles">{x.wo.map((p, k) => <button key={k} className="tile" style={{ '--c': 'var(--where)' }} onClick={() => { x.where = p; x.stage = 1; sfx.ok(); ctx.update(); }}><i>{p[2]}</i>{p[1]}</button>)}</div></>}
      {stg === 1 && <><Hint en={hint ? hint[0] : 'Why? Add “because”!'} zh={hint ? hint[1] : '为什么？加上 because！'} /><div className="tiles">{x.ro.map((r, k) => <button key={k} className="tile" data-right={r.w === it.rs.w ? 1 : 0} style={{ '--c': 'var(--why)' }} onClick={(e) => pickWhy(r, e.currentTarget)}><i>{r.f}</i>{whyText(r, it.w)}</button>)}</div></>}
      {stg >= 2 && <><Hint en="Wow, what a long sentence! Say it all!" zh="好长的句子！完整地说一遍！" /><div className="row"><button className="go" onClick={() => say(curText(x), 0.8)}>🔊 Listen<span className="zh">听一听</span></button></div><MarkRow ctx={ctx} x={x} /></>}
    </>
  );
}
