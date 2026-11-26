import { useState } from 'react';
import { LEVELS, CURRIC, levelById, DAILY } from '../content/index.js';

const ROUTINE = [
  ['0–3', 'Warm-up', "Greet; ask 2 questions using last class's pattern"],
  ['3–8', 'Teach', 'Open “Learn the pattern”; point to each colour block and ask its question'],
  ['8–18', 'Practise in the app', 'Look and say, Build, Silly sentences, Your turn to talk; mark stars'],
  ['18–22', 'Speak without the app', 'The child makes 2–3 sentences about their own life with the pattern'],
  ['22–25', 'Wrap-up', 'Feedback screen, count stars, one homework sentence, copy feedback for parents'],
];

// The Teacher's Handbook inside the app. Phase 6 adds a full lesson plan for every class.
export default function TeacherGuide() {
  const [lv, setLv] = useState('A1');
  const L = levelById(lv);
  return (
    <>
      <div className="card">
        <h2 style={{ fontSize: 30 }}>Teacher guide 👩‍🏫</h2>
        <p className="muted">Phrases first, then the pattern, then swap words to make new sentences. Big star = said it alone; small star = needed help.</p>
        <h3 style={{ marginTop: 12 }}>The 25-minute class (Learn it)</h3>
        <table className="simple"><thead><tr><th>Minutes</th><th>Step</th><th>What the teacher does</th></tr></thead><tbody>{ROUTINE.map((r) => <tr key={r[0]}><td>{r[0]}</td><td><b>{r[1]}</b></td><td>{r[2]}</td></tr>)}</tbody></table>
        <p className="muted">Mastery rule: move on when at least half the activities earn big stars; otherwise repeat the class.</p>
      </div>
      <div className="card">
        <h3>Units by level</h3>
        <div className="row">{LEVELS.map((l) => <button key={l.id} className={'lvb' + (l.id === lv ? ' on' : '')} onClick={() => setLv(l.id)}>{l.id}</button>)}</div>
        <table className="simple" style={{ marginTop: 12 }}>
          <thead><tr><th>Unit</th><th>Class A: lesson</th><th>Class B: Daily English</th><th>Goal</th></tr></thead>
          <tbody>{CURRIC.units[lv].map((u, i) => <tr key={i}><td>{i + 1}</td><td>{L.lessons[u.lesson - 1].n}</td><td>{u.daily ? (u.daily === 'review' ? 'Review (weakest topic)' : DAILY.find((d) => d.id === u.daily).t) : '—'}</td><td>{u.can}{u.target && <span className="zh">Target: “{u.target}”</span>}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}
