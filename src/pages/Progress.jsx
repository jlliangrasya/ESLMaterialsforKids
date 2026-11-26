import { useStore, totalsOf } from '../store/useStore.js';
import { LEVELS } from '../content/index.js';
import { sequenceOf, planRecord } from '../engine/coursePlan.js';

// Phase 6 adds charts, weak sentence parts over time and printable parent reports.
export default function Progress() {
  const { students, currentStudentId } = useStore();
  const stu = currentStudentId ? students[currentStudentId] : null;
  if (!stu) return <div className="card">Choose a student first.</div>;
  const t = totalsOf(stu);
  return (
    <div className="card">
      <h2 style={{ fontSize: 30 }}>{stu.name}'s progress 📈</h2>
      <p className="muted">★ {t.big} big stars · ☆ {t.small} small stars · {t.stickers} stickers</p>
      <table className="simple">
        <thead><tr><th>Level</th><th>Classes done</th><th>Level check</th></tr></thead>
        <tbody>{LEVELS.map((l) => { const seq = sequenceOf(l.id), r = planRecord(stu, l.id), done = seq.filter((c) => r[c.n]).length, ck = r[seq.at(-1).n];
          return <tr key={l.id}><td><b>{l.id}</b> {l.name}</td><td>{done} / {seq.length}</td><td>{ck ? (ck.result === 'pass' ? 'Passed ✅' : 'Repeat 🔁') : '—'}</td></tr>; })}</tbody>
      </table>
    </div>
  );
}
