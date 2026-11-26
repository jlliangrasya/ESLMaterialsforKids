import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { sequenceOf, classInfo } from '../engine/coursePlan.js';
import { buildLesson, buildStory, buildDaily } from '../engine/lesson.js';
import Runner from '../activities/Runner.jsx';

// Runs one class from the course plan with the real activities, then saves stars to the plan and the student.
export default function ClassPlayer() {
  const { level, n } = useParams();
  const { students, currentStudentId, recordClass } = useStore();
  const stu = currentStudentId ? students[currentStudentId] : null;
  const nav = useNavigate();
  const seq = sequenceOf(level), c = seq.find((x) => x.n === +n);
  const [run, setRun] = useState(0);
  // Build once per class (not on every store change, or the activities would reshuffle mid-class).
  const info = useMemo(() => (c ? classInfo(stu, level, c) : null), [level, n]); // eslint-disable-line react-hooks/exhaustive-deps
  const session = useMemo(() => {
    if (!c) return null;
    if (c.type === 'A' || c.type === 'lesson') return buildLesson(level, c.lesson - 1);
    if (c.type === 'B') return buildDaily(info.topicId, stu?.name);
    if (c.type === 'story') return buildStory(level, c.story);
    return null;
  }, [level, n, run]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!c) return <div className="card">Class not found. <Link to={`/plan/${level}`}>Back to the course plan</Link></div>;
  if (!session) return <div className="card"><h2>{info.title}</h2><p className="muted">{info.sub}</p><Link className="go" to={`/plan/${level}`}>Back to the course plan</Link></div>;

  const next = seq.find((x) => x.n === c.n + 1);
  const goal = info.goal ? `Goal: ${info.goal}` : info.sub;
  const planBar = (
    <div className="planbar">🗺️ Class {c.n} of {seq.length}{c.unit ? ` · Unit ${c.unit}` : ''} · {info.kind}
      <span>{goal}</span>{info.goalZh && <span className="zh">{info.goalZh}</span>}
      {!stu && <span style={{ color: '#a84300' }}>No student chosen — stars won't be saved. 未选择学生，星星不会被保存。</span>}
    </div>
  );
  const finish = (f) => {
    if (!stu) return;
    const kind = session.kind;
    recordClass({ level, n: c.n, kind, key: session.key, b: f.big, s: f.small, weak: kind === 'lesson' ? f.weak : undefined, fb: kind === 'lesson' ? { strength: f.strength, improve: f.improve } : undefined });
  };
  return (
    <Runner key={`${level}-${n}-${run}`} session={session} name={stu?.name} planBar={planBar}
      title={`${level} · ${info.title}`} onExit={() => nav(`/plan/${level}`)} onFinish={finish}
      doneActions={<>
        {next && next.type !== 'check'
          ? <button className="go plan" onClick={() => nav(`/class/${level}/${next.n}`)}>🗺️ Next class: {next.n}. {classInfo(stu, level, next).title} →<span className="zh">下一节课</span></button>
          : <button className="go plan" onClick={() => nav(`/plan/${level}`)}>🗺️ Back to the course plan<span className="zh">回到课程计划</span></button>}
        <button className="ghost" onClick={() => setRun(run + 1)}>Play again<span className="zh">再玩一次</span></button>
      </>} />
  );
}
