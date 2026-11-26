// Tell the story: one picture at a time, the child says the sentence for it.
import Scene from '../art/Scene.jsx';
import { MarkRow, Hint, say } from './shared.jsx';

export default function StoryTell({ x, ctx }) {
  const sto = x.sto, cur = sto.p[x.pi];
  return (
    <>
      <h3 className="tt">{sto.t}</h3>
      <div className="panels">
        {sto.p.map((p, j) => (
          <div key={j} className={'panel' + (j === x.pi ? ' cur' : j < x.pi ? ' done' : '')}>
            <span className="lab">{j + 1}</span><Scene spec={p.sc} />
            {(j < x.pi || (j === x.pi && x.reveal)) && <div className="ptext">{p.s}</div>}
          </div>
        ))}
      </div>
      <Hint en={`Picture ${x.pi + 1}: what happens? Start with “${cur.s.split(/[ ,]/)[0]}…”`} zh={`看第 ${x.pi + 1} 张图说一句！`} />
      <div className="row">
        {x.reveal ? <button className="go" onClick={() => say(cur.s, 0.8)}>🔊 Listen<span className="zh">听一听</span></button>
          : <button className="ghost" onClick={() => { x.reveal = 1; ctx.update(); setTimeout(() => say(cur.s), 300); }}>💡 Help: show the sentence<span className="zh">提示：显示句子</span></button>}
      </div>
      <MarkRow ctx={ctx} x={x} />
    </>
  );
}

// Listen to the whole story with all pictures (used by story lessons).
export function LearnStory({ x, ctx }) {
  return (
    <>
      <h3 className="tt">{x.sto.t}</h3>
      <div className="panels">{x.sto.p.map((p, j) => <div key={j} className="panel"><span className="lab">{j + 1}</span><Scene spec={p.sc} /><div className="ptext">{p.s}</div></div>)}</div>
      <div className="row"><button className="go" onClick={() => say(x.sto.p.map((p) => p.s).join(' '), 0.8)}>🔊 Listen to the story<span className="zh">听故事</span></button></div>
      <MarkRow ctx={ctx} x={x} />
    </>
  );
}
