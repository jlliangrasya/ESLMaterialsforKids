// Look, listen & say. A1: the sentence is shown and read aloud. A2 and up: picture first, blocks hidden — tap to peek.
import { useEffect } from 'react';
import { sentence } from '../engine/lesson.js';
import { cap } from '../engine/banks.js';
import * as sfx from '../audio/sfx.js';
import { Art, Chunks, AskChunks, MarkRow, Hint, say } from './shared.jsx';

export default function Learn({ x, ctx }) {
  const peek = ctx.l.lv !== 'A1';
  useEffect(() => {
    if (peek || x.said) return; x.said = 1;
    const t = setTimeout(() => say(sentence(x.it)), 500); return () => clearTimeout(t);
  }, [x, peek]);
  const listen = (rate) => { if (peek && !x.reveal) { x.reveal = 1; ctx.update(); } say(sentence(x.it), rate); };
  const onPeek = (i) => { x.rv.push(i); sfx.click(); ctx.update(); say(cap(x.it.c[i][1]), 0.8); };
  return (
    <>
      <Art it={x.it} />
      {peek ? <AskChunks it={x.it} rv={x.rv} all={x.reveal} onPeek={onPeek} /> : <Chunks it={x.it} />}
      {x.it.mean && (!peek || x.reveal) && <div className="mean">{x.it.mean}</div>}
      {peek && <Hint en="Look at the picture and try to say the sentence first. Tap a block to peek!" zh="先看图试着说，点积木可以偷看！" />}
      <div className="row"><button className="go" onClick={() => listen(0.85)}>🔊 Listen<span className="zh">听一听</span></button><button className="ghost" onClick={() => listen(0.6)}>🐢 Slowly<span className="zh">慢一点</span></button></div>
      <MarkRow ctx={ctx} x={x} />
    </>
  );
}
