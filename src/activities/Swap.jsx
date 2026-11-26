// Swap the word: one pattern, new words — tap a picture and say the new sentence.
import * as sfx from '../audio/sfx.js';
import { MarkRow, Hint, say } from './shared.jsx';

export default function Swap({ x, ctx }) {
  const [f, zh, opts] = x.f, need = Math.min(3, opts.length);
  const [before, after] = f.split('___');
  const tap = (k) => { const o = opts[k]; x.cur = o; if (!x.done.includes(k)) x.done.push(k); sfx.click(); sfx.ok(); ctx.update(); say(f.replace('___', o[1]), 0.85); };
  return (
    <>
      <h3 className="tt">Swap the word! <span className="zh" style={{ display: 'inline' }}>换个词，说新句子！</span></h3>
      <div className="sent"><span className="ch phr" style={{ '--c': '#7c4ddb' }}><b>{before}{x.cur ? <u>{x.cur[1]}</u> : '＿＿＿'}{after}</b><small>Pattern <span className="zh" style={{ display: 'inline' }}>句型</span></small></span></div>
      <div className="mean zh" style={{ display: 'block' }}>{zh}</div>
      <div className="tiles">{opts.map((o, k) => <button key={k} className={'tile' + (x.done.includes(k) ? ' picked' : '')} data-sw={k} style={{ '--c': 'var(--what)' }} onClick={() => tap(k)}><i>{o[0]}</i>{o[1]}</button>)}</div>
      {x.done.length < need ? <Hint en={`Tap a picture and say the new sentence! (${x.done.length}/${need})`} zh="点图片，说新句子！" /> : <Hint en="Super! You made new sentences! Say them again!" zh="太棒了！你说出了新句子！" />}
      {x.done.length >= need && <MarkRow ctx={ctx} x={x} />}
    </>
  );
}
