// Your turn to talk: picture only, the child says the whole sentence. Peek at blocks if stuck.
import { sentence, curText } from '../engine/lesson.js';
import { cap } from '../engine/banks.js';
import * as sfx from '../audio/sfx.js';
import { Art, AskChunks, MarkRow, Hint, say } from './shared.jsx';

export default function Speak({ x, ctx }) {
  const onPeek = (i) => { x.rv.push(i); sfx.click(); ctx.update(); say(cap(x.it.c[i][1]), 0.8); };
  return (
    <>
      <Art it={x.it} />
      <AskChunks it={x.it} rv={x.rv} all={x.reveal} onPeek={onPeek} />
      {x.it.mean && x.reveal && <div className="mean">{x.it.mean}</div>}
      <Hint en="Look at the picture. Say the whole sentence!" zh="看图，说出完整的句子！" />
      <div className="row">
        {x.reveal ? <button className="go" onClick={() => say(sentence(x.it))}>🔊 Listen<span className="zh">听一听</span></button>
          : <button className="ghost" onClick={() => { x.reveal = 1; ctx.update(); setTimeout(() => say(curText(x)), 300); }}>💡 Show the whole sentence<span className="zh">显示整个句子</span></button>}
      </div>
      <MarkRow ctx={ctx} x={x} />
    </>
  );
}
