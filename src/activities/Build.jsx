// Build the sentence: tap the coloured blocks in order. A2 and up add a block that doesn't belong.
import { useState } from 'react';
import { ROLE } from '../engine/roles.jsx';
import { distractors, nDistractors, sentence, endsWithMark } from '../engine/lesson.js';
import { shuf, cap } from '../engine/banks.js';
import * as sfx from '../audio/sfx.js';
import { Art, Hint, say, shake } from './shared.jsx';

const R = (r) => ROLE[r] || ROLE.link;

export default function Build({ x, ctx }) {
  const l = ctx.l, nd = nDistractors(l.lv);
  if (!x.tiles) x.tiles = shuf([...x.it.c.map((r, i) => ({ r: r[0], t: r[1], e: r[2], i })), ...distractors(l, x.it, nd).map((r) => ({ r: r[0], t: r[1], e: r[2], i: -1 }))]);
  const [hint, setHint] = useState(null);

  const tap = (k, el) => {
    const t = x.tiles[k], need = x.filled.length, want = x.it.c[need];
    if (t.i === need || (t.t === want[1] && t.r === want[0])) {
      x.filled.push(need); sfx.click(); sfx.ok(); setHint(null);
      if (x.filled.length === x.it.c.length) {
        x.done = 1; const tot = Object.values(x.mist).reduce((a, b) => a + b, 0);
        ctx.score(x, tot ? 1 : 2); setTimeout(() => say(sentence(x.it)), 600);
      }
      ctx.update(); return;
    }
    x.mist[want[0]] = (x.mist[want[0]] || 0) + 1; shake(el); sfx.wrong();
    const W = R(want[0]);
    setHint(t.i < 0 ? ["That block doesn't belong in this sentence!", '这个积木不属于这个句子！']
      : t.r !== want[0] ? [`We need the “${W[0]}” block next!`, `下一个是“${W[1]}”积木！`]
        : want[0] === 'size' || want[0] === 'colour' ? ['Size comes before colour!', '大小在颜色前面！'] : ['Look at the picture again!', '再看看图！']);
  };

  return (
    <>
      <Art it={x.it} />
      {x.it.mean && x.done && <div className="mean">{x.it.mean}</div>}
      <div className="sent">
        {x.it.c.map((r, i) => {
          const f = x.filled.includes(i), nx = !f && i === x.filled.length;
          return <span key={i} className={'ch' + (f ? '' : ' slot') + (nx ? ' next' : '')} style={{ '--c': R(r[0])[2] }}><b>{f ? (i === 0 ? cap(r[1]) : r[1]) : ' '}</b><small>{R(r[0])[0]} <span className="zh" style={{ display: 'inline' }}>{R(r[0])[1]}</span></small></span>;
        })}
        {!endsWithMark(x.it.c[x.it.c.length - 1][1]) && <span className="dotfin">.</span>}
      </div>
      {x.done ? (
        <>
          <Hint en="Now say it!" zh="现在说一说！" />
          <div className="row"><button className="go" onClick={() => say(sentence(x.it))}>🔊 Listen<span className="zh">听一听</span></button><button className="ghost" data-next onClick={ctx.next}>Next →<span className="zh">下一个</span></button></div>
        </>
      ) : (
        <>
          <div className="tiles">
            {x.tiles.map((t, k) => (
              <button key={k} className={'tile' + (t.i >= 0 && x.filled.includes(t.i) ? ' used' : '')} data-tile={t.i} style={{ '--c': R(t.r)[2] }} onClick={(e) => tap(k, e.currentTarget)}>
                {t.e && <i>{t.e}</i>}{t.t}
              </button>
            ))}
          </div>
          {hint ? <Hint en={hint[0]} zh={hint[1]} /> : <Hint en={`Tap the blocks in order.${nd ? " One block doesn't belong!" : ''}`} zh={`按顺序点积木。${nd ? '有一个积木不属于这个句子！' : ''}`} />}
        </>
      )}
    </>
  );
}
