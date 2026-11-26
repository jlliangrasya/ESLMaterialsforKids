// What would you say? Read the situation, choose the best reply, then say it.
import { useState } from 'react';
import Scene from '../art/Scene.jsx';
import { meScene } from '../engine/lesson.js';
import * as sfx from '../audio/sfx.js';
import { Hint, say, shake } from './shared.jsx';

export default function What({ x, ctx }) {
  const w = x.w, right = w[3][0];
  const [wrong, setWrong] = useState(false);
  const tap = (o, el) => {
    if (o === right) { x.done = 1; ctx.score(x, x.mist.reply ? 1 : 2); setTimeout(() => say(o, 0.85), 500); ctx.update(); return; }
    x.mist.reply = (x.mist.reply || 0) + 1; shake(el); sfx.wrong(); setWrong(true);
  };
  return (
    <>
      <Scene spec={meScene(x.t, w[2], 'surprised')} />
      <h3 className="tt">{w[0]}</h3>
      <div className="zh" style={{ textAlign: 'center', fontWeight: 800 }}>{w[1]}</div>
      <div className="tt" style={{ fontSize: 20, color: 'var(--why)' }}>What would you say? <span className="zh" style={{ display: 'inline' }}>你会怎么说？</span></div>
      <div className="replies">{x.opts.map((o, k) => <button key={k} className={'reply' + (x.done && o === right ? ' right' : '')} data-right={o === right ? 1 : 0} disabled={!!x.done} onClick={(e) => tap(o, e.currentTarget)}>💬 {o}</button>)}</div>
      {x.done ? (
        <>
          <Hint en="Yes! Now say it out loud!" zh="对！大声说出来！" />
          <div className="row"><button className="go" onClick={() => say(right, 0.85)}>🔊 Listen<span className="zh">听一听</span></button><button className="ghost" data-next onClick={ctx.next}>Next →<span className="zh">下一个</span></button></div>
        </>
      ) : wrong ? <Hint en="Hmm… would you really say that here? Try again!" zh="你真的会这样说吗？再试试！" /> : <Hint en="Tap the best answer." zh="点最合适的回答。" />}
    </>
  );
}
