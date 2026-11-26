import { Link, useParams } from 'react-router-dom';
import { levelById } from '../content/index.js';
import Scene, { lessonArt } from '../art/Scene.jsx';
import LessonPreview from './LessonPreview.jsx';

export default function Lessons() {
  const { level = 'A1' } = useParams(), L = levelById(level);
  return (
    <div>
      <h2 style={{ fontSize: 30, margin: '6px 4px 14px' }}><span className="tag" style={{ background: L.color, fontSize: 22 }}>{L.id}</span> {L.name} lessons <span className="zh" style={{ display: 'inline' }}>{L.zh}</span></h2>
      <div className="grid">
        {L.lessons.map((l, i) => (
          <Link key={i} className="lc" to={`/play/lesson/${level}/${i}`}>
            <Scene {...lessonArt(l)} />
            <h3>{i + 1}. {l.n}</h3><p>“{l.ex}”<span className="zh">{l.zh}</span></p><span className="gram">{l.grammar}</span>
            <span className="st">▶ Play · {l.acts.reduce((a, s) => a + s[1], 1)} activities</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LessonPage() {
  const { level, i } = useParams(), L = levelById(level), lesson = L.lessons[+i];
  return <div className="card"><Link to={`/lessons/${level}`}>← {level} lessons</Link><h2 style={{ fontSize: 30, margin: '8px 0' }}>{level} · Lesson {+i + 1} · {lesson.n}</h2><Link className="go" to={`/play/lesson/${level}/${i}`}>▶ Play this lesson</Link><LessonPreview lesson={lesson} /></div>;
}
