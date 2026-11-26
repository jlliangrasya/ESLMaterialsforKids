// Playing a lesson, story or Daily English topic on its own (outside the course plan).
import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { levelById, SB, DAILY } from '../content/index.js';
import { buildLesson, buildStory, buildDaily } from '../engine/lesson.js';
import Runner from '../activities/Runner.jsx';

export const useStudent = () => useStore((s) => (s.currentStudentId ? s.students[s.currentStudentId] : null));

// Saves the result for the current student; returns a note when there is no student to save to.
export function useSave() {
  const stu = useStudent(), recordClass = useStore((s) => s.recordClass);
  return (args) => { if (stu) recordClass(args); };
}

function NoStudentNote() {
  const stu = useStudent();
  if (stu) return null;
  return <div className="planbar" style={{ background: '#fff4d6', borderColor: '#f0c75e', color: '#6b4a00' }}>No student chosen — stars won't be saved. <Link to="/students">Add or choose a student</Link><span>未选择学生，星星不会被保存。</span></div>;
}

export function PlayLesson() {
  const { level, i } = useParams(), idx = +i, L = levelById(level), nav = useNavigate();
  const stu = useStudent(), save = useSave(), [run, setRun] = useState(0);
  const session = useMemo(() => buildLesson(level, idx), [level, idx, run]); // eslint-disable-line react-hooks/exhaustive-deps
  const next = L.lessons[idx + 1];
  return (
    <Runner key={`${level}-${idx}-${run}`} session={session} name={stu?.name} planBar={<NoStudentNote />}
      title={`${level} · Lesson ${idx + 1} · ${session.l.n}`} onExit={() => nav(`/lessons/${level}`)}
      onFinish={(f) => save({ level, kind: 'lesson', key: session.key, b: f.big, s: f.small, weak: f.weak, fb: { strength: f.strength, improve: f.improve } })}
      doneActions={<>
        {next && <button className="go" onClick={() => nav(`/play/lesson/${level}/${idx + 1}`)}>Next: {next.n} →<span className="zh">下一课</span></button>}
        <button className="ghost" onClick={() => setRun(run + 1)}>Play again<span className="zh">再玩一次</span></button>
        <button className="ghost" onClick={() => nav(`/lessons/${level}`)}>All lessons<span className="zh">全部课程</span></button>
      </>} />
  );
}

export function PlayStory() {
  const { level, i } = useParams(), idx = +i, nav = useNavigate();
  const stu = useStudent(), save = useSave(), [run, setRun] = useState(0);
  const session = useMemo(() => buildStory(level, idx), [level, idx, run]); // eslint-disable-line react-hooks/exhaustive-deps
  const next = SB.stories[level][idx + 1];
  return (
    <Runner key={`${level}-${idx}-${run}`} session={session} name={stu?.name} planBar={<NoStudentNote />}
      title={`${level} · Story time · ${session.l.n}`} onExit={() => nav(`/stories/${level}`)}
      onFinish={(f) => save({ level, kind: 'story', key: session.key, b: f.big, s: f.small })}
      doneActions={<>
        {next && <button className="go" onClick={() => nav(`/play/story/${level}/${idx + 1}`)}>Next story: {next.t} →<span className="zh">下一个故事</span></button>}
        <button className="ghost" onClick={() => setRun(run + 1)}>Watch again<span className="zh">再看一遍</span></button>
        <button className="ghost" onClick={() => nav(`/stories/${level}`)}>All stories<span className="zh">全部故事</span></button>
      </>} />
  );
}

export function PlayDaily() {
  const { topic } = useParams(), nav = useNavigate();
  const stu = useStudent(), save = useSave(), [run, setRun] = useState(0);
  const session = useMemo(() => buildDaily(topic, stu?.name), [topic, run]); // eslint-disable-line react-hooks/exhaustive-deps
  const idx = DAILY.findIndex((t) => t.id === topic), next = DAILY[idx + 1];
  return (
    <Runner key={`${topic}-${run}`} session={session} name={stu?.name} planBar={<NoStudentNote />}
      title={`Daily English · ${session.l.n}`} onExit={() => nav('/daily')}
      onFinish={(f) => save({ kind: 'daily', key: session.key, b: f.big, s: f.small })}
      doneActions={<>
        {next && <button className="go" onClick={() => nav(`/play/daily/${next.id}`)}>Next: {next.t} →<span className="zh">下一个话题</span></button>}
        <button className="ghost" onClick={() => setRun(run + 1)}>Play again<span className="zh">再玩一次</span></button>
        <button className="ghost" onClick={() => nav('/daily')}>All topics<span className="zh">全部话题</span></button>
      </>} />
  );
}
