// Building blocks shared by every activity.
import Scene from '../art/Scene.jsx';
import { ROLE } from '../engine/roles.jsx';
import { Q, endsWithMark } from '../engine/lesson.js';
import { cap } from '../engine/banks.js';
import { say as speak } from '../audio/speech.js';

export const say = (text, rate = 0.85, pitch = 1) => speak(text, { rate, pitch });
const R = (role) => ROLE[role] || ROLE.link;

// The picture for one practice item (an SVG scene, or counted shapes).
export function Art({ it, className }) {
  if (!it) return null;
  return <div className={className}>{it.shape ? <Scene shape={it.shape} /> : <Scene spec={it.sc} it={it} animate />}</div>;
}

const Dot = ({ c }) => (endsWithMark(c[c.length - 1][1]) ? null : <span className="dotfin">.</span>);
const Label = ({ role }) => <small>{R(role)[0]} <span className="zh" style={{ display: 'inline' }}>{R(role)[1]}</span></small>;

// Coloured sentence blocks. hidden = how many blocks are still hidden (the Teach animation hides all, then shows them one by one).
export function Chunks({ it, hideFrom = Infinity, fly = false }) {
  return (
    <div className="sent">
      {it.c.map(([role, text], i) => (
        <span key={i} className={'ch' + (i >= hideFrom ? ' hidden' : '') + (fly && i < hideFrom ? ' fly' : '')} style={{ '--c': R(role)[2] }}>
          <b>{i === 0 ? cap(text) : text}</b><Label role={role} />
        </span>
      ))}
      <Dot c={it.c} />
    </div>
  );
}

// Blocks that start as questions ("Who is it?") and open when tapped — the "tap to peek" step.
export function AskChunks({ it, rv, all, onPeek }) {
  return (
    <div className="sent">
      {it.c.map(([role, text], i) => {
        const open = all || rv.includes(i) || role === 'link' || role === 'link2';
        if (open) return <span key={i} className="ch" style={{ '--c': R(role)[2] }}><b>{i === 0 ? cap(text) : text}</b><Label role={role} /></span>;
        const q = Q[role] || Q.link;
        return (
          <button key={i} type="button" className="ch ask" style={{ '--c': R(role)[2] }} onClick={() => onPeek(i)} aria-label={`${q[0]} Tap to peek`}>
            <b>{q[0]}</b><small>tap to peek 👀 <span className="zh" style={{ display: 'inline' }}>{q[1]}</span></small>
          </button>
        );
      })}
      <Dot c={it.c} />
    </div>
  );
}

// The teacher's three buttons after the child speaks: big star (alone), small star (with help), try again.
export function MarkRow({ ctx, x }) {
  return (
    <div className="marks">
      <button className="yes" disabled={ctx.busy} onClick={() => ctx.mark(x, 2)}>Said it! ⭐<span className="zh">自己说出来了</span></button>
      <button className="mid" disabled={ctx.busy} onClick={() => ctx.mark(x, 1)}>With help ☆<span className="zh">在帮助下说出来</span></button>
      <button className="no" disabled={ctx.busy} onClick={() => ctx.again(x)}>🔁 Try again<span className="zh">再试一次</span></button>
    </div>
  );
}

export function Hint({ en, zh, id }) {
  return <div className="hint" id={id}>{en}{zh && <span className="zh">{zh}</span>}</div>;
}

export function Star({ size, fill = '#ffd23f' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,4 62,37 97,37 69,58 80,93 50,72 20,93 31,58 3,37 38,37" fill={fill} stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
      <polygon points="50,18 57,40 42,40" fill="#fff" opacity=".55" />
    </svg>
  );
}

// The big celebration when a star is given.
export function StarFx({ k }) {
  if (!k) return null;
  const sparks = k === 2 ? Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <span key={i} className="spark" style={{ '--x': `${Math.cos(a) * 220}px`, '--y': `${Math.sin(a) * 220}px`, background: i % 2 ? '#ffd23f' : '#fff' }} />; }) : null;
  return (
    <div className={'fx on ' + (k === 2 ? 'big' : 'small')} role="status">
      <div className="wrap">{sparks}<Star size={100} /><div className="lbl">{k === 2 ? 'Super! Big star!' : 'Nice! Small star!'}<span className="zh">{k === 2 ? '太棒了！大星星！' : '不错！小星星！'}</span></div></div>
    </div>
  );
}

// Shake an element after a wrong tap (restarts the CSS animation).
export function shake(el) { if (!el) return; el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad'); }
