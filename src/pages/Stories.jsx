import { Link, useParams } from 'react-router-dom';
import { SB } from '../content/index.js';
import Scene from '../art/Scene.jsx';

export default function Stories() {
  const { level = 'A1' } = useParams(), S = SB.stories[level] || [];
  return (
    <div>
      <h2 style={{ fontSize: 30, margin: '6px 4px 14px' }}>{level} stories 📺</h2>
      <div className="grid">{S.map((s, i) => <Link key={i} className="lc" to={`/play/story/${level}/${i}`}><Scene spec={s.p[0].sc} /><h3>{s.t}</h3><p>“{s.p[0].s}”</p><span className="st">▶ Watch · order · retell</span></Link>)}</div>
    </div>
  );
}

// Phase 3 turns this into the animated player (walk-in, karaoke words, order, retell).
export function StoryPreview({ story }) {
  return <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>{story.p.map((p, i) => <div key={i} className="lc"><Scene spec={p.sc} /><p style={{ color: 'var(--ink)', fontSize: 16 }}><b>{i + 1}.</b> {p.s}</p></div>)}</div>;
}

export function StoryPage() {
  const { level, i } = useParams(), s = SB.stories[level][+i];
  return <div className="card"><Link to={`/stories/${level}`}>← {level} stories</Link><h2 style={{ fontSize: 30, margin: '8px 0' }}>{s.t}</h2><Link className="go" to={`/play/story/${level}/${i}`}>▶ Play this story</Link><StoryPreview story={s} /></div>;
}
