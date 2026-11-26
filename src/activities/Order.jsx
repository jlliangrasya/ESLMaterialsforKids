// Put the story in order: tap the pictures first, next, last.
import { useState } from 'react';
import Scene from '../art/Scene.jsx';
import { shuf } from '../engine/banks.js';
import * as sfx from '../audio/sfx.js';
import { Hint, say, shake } from './shared.jsx';

const STEP = [['first', '最先'], ['next', '然后'], ['last', '最后']];

export default function Order({ x, ctx }) {
  const n = Math.min(3, x.sto.p.length);
  if (!x.ord) x.ord = shuf([...Array(n).keys()]);
  const [wrong, setWrong] = useState(false);
  const all = x.got.length === n;
  const tap = (j, el) => {
    if (j === x.got.length) {
      x.got.push(j); sfx.ok(); setWrong(false);
      if (x.got.length === n) { ctx.score(x, x.mist.order ? 1 : 2); setTimeout(() => say(x.sto.p.slice(0, n).map((p) => p.s).join(' '), 0.85), 700); } else say(x.sto.p[j].s, 0.85);
      ctx.update(); return;
    }
    x.mist.order = (x.mist.order || 0) + 1; shake(el); sfx.wrong(); setWrong(true);
  };
  const step = STEP[Math.min(x.got.length, 2)];
  return (
    <>
      <h3 className="tt">Put the story in order! <span className="zh" style={{ display: 'inline' }}>按顺序排好故事！</span></h3>
      <div className="ordslots">
        {[...Array(n).keys()].map((k) => { const j = x.got[k]; return j == null ? <div key={k} className="oslot">{k + 1}</div> : <div key={k} className="oslot f"><Scene spec={x.sto.p[j].sc} /><p>{x.sto.p[j].s}</p></div>; })}
      </div>
      {all ? (
        <>
          <Hint en="You did it! Now say it: First… then… finally…" zh="你做到了！现在说一说：First… then… finally…" />
          <div className="row"><button className="go" data-next onClick={ctx.next}>Next: tell the story →<span className="zh">下一步：讲故事</span></button></div>
        </>
      ) : (
        <>
          <div className="panels">{x.ord.map((j) => <button key={j} className={'panel opick' + (x.got.includes(j) ? ' used' : '')} data-o={j} aria-label={`Picture: ${x.sto.p[j].s}`} onClick={(e) => tap(j, e.currentTarget)}><Scene spec={x.sto.p[j].sc} /></button>)}</div>
          {wrong ? <Hint en={`Not yet! Look again — what happens ${step[0]}?`} zh="再看看！" /> : <Hint en={`Which picture comes ${step[0]}?`} zh={`哪张图${step[1]}？`} />}
        </>
      )}
    </>
  );
}
