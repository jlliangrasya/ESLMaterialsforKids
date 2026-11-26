import Scene, { lessonArt } from '../art/Scene.jsx';
import { SB } from '../content/index.js';
import { Blocks } from '../engine/roles.jsx';

// Shows a lesson's teaching content. Phase 2 replaces this with the interactive lesson engine
// (Teach → Look and say → Build → Silly / Stretch → Speak → Feedback), ported from reference/sentence-builders/index.html.
export default function LessonPreview({ lesson }) {
  const bank = lesson.items ? SB.items[lesson.items] : null;
  const art = lessonArt(lesson);
  return (
    <div>
      <p><span className="gram">{lesson.grammar}</span></p>
      <Scene {...art} />
      <h3 style={{ textAlign: 'center', fontSize: 28, marginTop: 10 }}>“{lesson.ex}”</h3>
      <p className="muted" style={{ textAlign: 'center' }}>📘 {lesson.rule}<span className="zh">{lesson.ruleZh}</span></p>
      <details className="soon" style={{ marginTop: 10 }}><summary><b>Teacher tip 👩‍🏫</b></summary>{lesson.tip}<span className="zh">{lesson.tipZh}</span></details>
      {bank && (<><h3 style={{ marginTop: 16 }}>Practice sentences</h3>{bank.slice(0, 4).map((it, i) => <div key={i}><Scene spec={it.sc} /><Blocks chunks={it.c} />{it.mean && <p className="muted" style={{ textAlign: 'center' }}>{it.mean}</p>}</div>)}</>)}
      {lesson.gen && <p className="soon">This lesson makes new sentences every time, so each class is different. 这一课每次都会生成新的句子。</p>}
    </div>
  );
}
