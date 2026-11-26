import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { sequenceOf, planRecord, nextClass, classInfo } from '../engine/coursePlan.js';
import { CURRIC, levelById } from '../content/index.js';

export default function CoursePlan() {
  const { level = 'A1' } = useParams();
  const { students, currentStudentId, recordClass } = useStore();
  const stu = currentStudentId ? students[currentStudentId] : null;
  const nav = useNavigate();
  const L = levelById(level), seq = sequenceOf(level), rec = planRecord(stu, level), nx = nextClass(stu, level), core = CURRIC.core.includes(level);
  const groups = [];
  seq.forEach((c) => { const key = c.unit ? `Unit ${c.unit}` : c.type === 'story' ? 'Story class' : 'Level check'; const g = groups.at(-1); if (g && g.key === key && c.unit) g.items.push(c); else groups.push({ key, unit: c.unit, items: [c] }); });
  return (
    <div className="card">
      <h2 style={{ fontSize: 30 }}><span className="tag" style={{ background: L.color, fontSize: 22 }}>{level}</span> {L.name} · Course plan</h2>
      <p className="muted">{seq.length} classes of 25 minutes · about {Math.ceil(seq.length / 2)} weeks at 2 classes a week{!core && ' · Extension level: for older or advanced learners'}</p>
      {!stu && <p className="soon">Add a student to track progress.</p>}
      {groups.map((g) => (
        <div className="unit" key={g.key + g.items[0].n}>
          <h3>{g.key}{g.unit && <small>{CURRIC.units[level][g.unit - 1].can}</small>}</h3>
          {g.items.map((c) => {
            const i = classInfo(stu, level, c), r = rec[c.n], isNext = nx && nx.n === c.n;
            return (
              <div key={c.n} className={'pcls' + (r ? ' done' : '') + (isNext ? ' next' : '')}>
                <span className="num">{r ? '✓' : c.n}</span>
                <span className={'tag t-' + c.type}>{i.kind}</span>
                <div className="pt"><b>{i.title}</b><span>{i.sub}</span></div>
                <div className="row" style={{ marginTop: 0 }}>
                  {r && (r.result ? (r.result === 'pass' ? 'Passed ✅' : 'Repeat 🔁') : <b style={{ color: 'var(--answer)' }}>★ {r.b} ☆ {r.s}</b>)}
                  {c.type === 'check'
                    ? <><button className="ghost" disabled={!stu} onClick={() => recordClass({ level, n: c.n, kind: 'check', result: 'pass' })}>✅ Ready</button>
                        <button className="ghost" disabled={!stu} onClick={() => recordClass({ level, n: c.n, kind: 'check', result: 'repeat' })}>🔁 Repeat</button></>
                    : <button className={isNext ? 'go' : 'ghost'} onClick={() => nav(`/class/${level}/${c.n}`)}>{r ? 'Again' : isNext ? 'Start ▶' : 'Start'}</button>}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
