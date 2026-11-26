// Silly Sentence Machine: spin the reels for a random (often funny) sentence, then say it.
import { useEffect, useRef, useState } from 'react';
import { ROLE } from '../engine/roles.jsx';
import { G, pick, reelPool } from '../engine/banks.js';
import { sentence, nextItem } from '../engine/lesson.js';
import * as sfx from '../audio/sfx.js';
import { Art, Chunks, MarkRow, Hint, say } from './shared.jsx';

const R = (r) => ROLE[r] || ROLE.link;

export default function Silly({ x, ctx }) {
  const [reels, setReels] = useState(null), iv = useRef(null);
  useEffect(() => () => clearInterval(iv.current), []);
  const gen = ctx.l.gen && G[ctx.l.gen] ? G[ctx.l.gen] : () => nextItem(ctx.l, new Set());

  const spin = () => {
    clearInterval(iv.current);
    x.it = gen(); x.spun = 0; x.reveal = 0; ctx.update();
    const c = x.it.c; let n = 0;
    iv.current = setInterval(() => {
      n++; setReels(c.map((r, k) => (n < 14 + k * 5 ? pick(reelPool(r[0])) : r[2] || '✨'))); sfx.click();
      if (n >= 14 + c.length * 5) { clearInterval(iv.current); x.spun = 1; sfx.ok(); ctx.update(); }
    }, 90);
  };
  const c = x.it.c;
  return (
    <>
      <div className="reels">
        {c.map((r, k) => <div key={k} className="reel" style={{ '--c': R(r[0])[2] }}><div className="w"><span>{x.spun ? r[2] || '✨' : reels ? reels[k] : '❔'}</span></div><small>{R(r[0])[0]}</small></div>)}
      </div>
      {x.spun ? (
        <>
          <Art it={x.it} />
          <Chunks it={x.it} hideFrom={x.reveal ? Infinity : 0} />
          <div className="row">
            {x.reveal ? <button className="go" onClick={() => say(sentence(x.it))}>🔊 Listen<span className="zh">听一听</span></button>
              : <button className="go" onClick={() => { x.reveal = 1; ctx.update(); say(sentence(x.it)); }}>💡 Show the sentence<span className="zh">显示句子</span></button>}
            <button className="ghost" onClick={spin}>🎰 Spin again<span className="zh">再转一次</span></button>
          </div>
          <MarkRow ctx={ctx} x={x} />
        </>
      ) : (
        <>
          <div className="row"><button className="go" data-spin onClick={spin} disabled={!!reels && !x.spun} style={{ fontSize: 26, padding: '16px 36px' }}>🎰 SPIN!<span className="zh">转一转！</span></button></div>
          <Hint en="Spin, look at the picture and make a funny sentence!" zh="转一转，看图说一个好笑的句子！" />
        </>
      )}
    </>
  );
}
