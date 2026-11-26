import { Link, useParams } from 'react-router-dom';
import { DAILY } from '../content/index.js';
import { useStore } from '../store/useStore.js';
import Scene from '../art/Scene.jsx';

// Cast for the conversations lives in the lesson engine (the student is "me").
import { CAST, CASTNAME } from '../engine/lesson.js';
export { CAST, CASTNAME };
export const duo = (t, sp, act) => ({ duo: 1, place: t.place, a: CAST[t.cast[0]], b: CAST[t.cast[1]], sp, act });

export default function Daily() {
  return (
    <div>
      <h2 style={{ fontSize: 30, margin: '6px 4px 14px' }}>Daily English 💬 <span className="zh" style={{ display: 'inline' }}>日常英语</span></h2>
      <div className="grid">
        {DAILY.map((t) => (
          <Link key={t.id} className="lc" to={`/play/daily/${t.id}`}>
            <Scene spec={duo(t, 'a', t.convo[0][3])} /><h3>{t.icon} {t.t}</h3><p>“{t.ph[1][0]}”<span className="zh">{t.zh}</span></p><span className="st">▶ Words · phrases · role-play</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function TopicPreview({ topic: t }) {
  const stu = useStore((s) => (s.currentStudentId ? s.students[s.currentStudentId] : null));
  const who = stu ? stu.name : 'Student', nm = (x) => x.replace(/\{name\}/g, who);
  return (
    <div>
      <h3>New words</h3>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))' }}>{t.words.map((w) => <div key={w[1]} className="lc" style={{ textAlign: 'center' }}><div style={{ fontSize: 48 }}>{w[0]}</div><b>{w[1]}</b><span className="zh">{w[2]}</span></div>)}</div>
      <h3 style={{ marginTop: 16 }}>Useful phrases</h3>
      <ul>{t.ph.map((p) => <li key={p[0]}><b>{p[0]}</b><span className="zh" style={{ display: 'inline', marginLeft: 8 }}>{p[1]}</span></li>)}</ul>
      <h3>Conversation</h3>
      <Scene spec={duo(t, 'a', t.convo[0][3])} />
      <table className="simple"><tbody>{t.convo.map((l, i) => <tr key={i}><td><b>{l[0] === 'a' ? CASTNAME[t.cast[0]] : who}</b></td><td>{nm(l[1])}<span className="zh">{nm(l[2])}</span></td></tr>)}</tbody></table>
      <h3 style={{ marginTop: 16 }}>Swap the word</h3>
      {t.swap.map((s) => <p key={s[0]}><b>{s[0]}</b> → {s[2].map((o) => `${o[0]} ${o[1]}`).join(' · ')}</p>)}
      <p className="muted">💡 {t.tip}<span className="zh">{t.tipZh}</span></p>
    </div>
  );
}

export function DailyTopic() {
  const { topic } = useParams(), t = DAILY.find((d) => d.id === topic);
  return <div className="card"><Link to="/daily">← Daily English</Link><h2 style={{ fontSize: 30, margin: '8px 0' }}>{t.icon} {t.t} <span className="zh" style={{ display: 'inline' }}>{t.zh}</span></h2><Link className="go" to={`/play/daily/${t.id}`}>▶ Play this topic</Link><TopicPreview topic={t} /></div>;
}
