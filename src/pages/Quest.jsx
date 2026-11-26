import { QUEST } from '../content/index.js';

// Phase 5: port the English Quest games from reference/english-quest/index.html and save results to the student.
export default function Quest() {
  return (
    <div className="card">
      <h2 style={{ fontSize: 30 }}>English Quest 🎯 <span className="zh" style={{ display: 'inline' }}>英语大冒险</span></h2>
      <p className="muted">Placement test for new students, and the level check at class 24. The games are ported in Phase 5; the content is already here.</p>
      <table className="simple">
        <thead><tr><th>Level</th><th>Games</th></tr></thead>
        <tbody>{QUEST.levels.map((l) => <tr key={l.id}><td><b>{l.id}</b> {l.name}</td><td>{l.games.map((g) => g.title).join(' · ')}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
