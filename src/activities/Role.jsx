// Role-play: the app says the other person's line; the child answers as themselves.
import { useEffect } from 'react';
import Scene from '../art/Scene.jsx';
import { MarkRow, say } from './shared.jsx';

export default function Role({ x, ctx }) {
  const L = x.sto.p, mine = L[x.j], prev = L[x.j - 1], me = ctx.name || 'You';
  useEffect(() => { if (x.said || !prev) return; x.said = 1; const t = setTimeout(() => say(prev.s, 0.85, prev.pitch), 600); return () => clearTimeout(t); }, [x, prev]);
  return (
    <>
      <h3 className="tt">You are {ctx.name || 'the student'}! <span className="zh" style={{ display: 'inline' }}>你来演自己！</span></h3>
      <Scene spec={mine.sc} />
      <div className="chat">
        {L.slice(Math.max(0, x.j - 3), x.j).map((m, k) => <div key={k} className={'msg ' + m.sc.sp}><b>{m.n}</b>{m.s}{m.zh && <span className="zh">{m.zh}</span>}</div>)}
        <div className="msg b me">
          <b>{me} — your turn! <span className="zh" style={{ display: 'inline' }}>轮到你了！</span></b>
          {x.reveal ? mine.s : <button className="peekline" onClick={() => { x.reveal = 1; ctx.update(); say(mine.s, 0.8, mine.pitch); }}>👀 Stuck? Tap to peek<span className="zh">想不起来？点这里看看</span></button>}
          <span className="zh">{mine.zh}</span>
        </div>
      </div>
      <div className="row">
        {prev && <button className="ghost" onClick={() => say(prev.s, 0.85, prev.pitch)}>🔊 Hear {prev.n} again<span className="zh">再听一遍</span></button>}
        {x.reveal && <button className="go" onClick={() => say(mine.s, 0.8, mine.pitch)}>🔊 Listen<span className="zh">听一听</span></button>}
      </div>
      <MarkRow ctx={ctx} x={x} />
    </>
  );
}
