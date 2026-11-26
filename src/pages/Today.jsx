import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { nextClass, classInfo, sequenceOf } from '../engine/coursePlan.js';
import { levelById } from '../content/index.js';
import AddStudentForm from './AddStudentForm.jsx';

export default function Today() {
  const { students, currentStudentId, lastBackup } = useStore();
  const stu = currentStudentId ? students[currentStudentId] : null;
  const nav = useNavigate();
  if (!stu) return (
    <div className="card">
      <h2 style={{ fontSize: 34 }}>Let's build sentences!</h2>
      <p className="muted">Add your first student to start the course plan.<span className="zh">添加第一位学生，开始课程计划。</span></p>
      <AddStudentForm />
    </div>
  );
  const lv = stu.level, nx = nextClass(stu, lv), info = nx && classInfo(stu, lv, nx), total = sequenceOf(lv).length;
  const days = lastBackup ? Math.floor((Date.now() - Date.parse(lastBackup)) / 864e5) : null;
  return (
    <>
      <div className="card">
        <p className="muted">{stu.name} · {lv} {levelById(lv).name}</p>
        {nx ? (
          <>
            <h2 style={{ fontSize: 30 }}>Next class: {nx.n} of {total}</h2>
            <p><span className={'tag t-' + nx.type}>{info.kind}</span> <b style={{ fontSize: 22 }}>{info.title}</b></p>
            <p className="muted">{info.goal || info.sub}{info.goalZh && <span className="zh">{info.goalZh}</span>}</p>
            {nx.type !== 'check' && <button className="go" onClick={() => nav(`/class/${lv}/${nx.n}`)}>Start class {nx.n} ▶</button>}
            <Link className="ghost" style={{ marginLeft: 10, textDecoration: 'none' }} to={`/plan/${lv}`}>See course plan</Link>
          </>
        ) : <h2>Level {lv} complete! Choose the next level in Students. 🎉</h2>}
      </div>
      {(days === null || days >= 7) && (
        <div className="soon">💾 Progress is saved in this browser only. {days === null ? 'No backup yet.' : `Last backup ${days} days ago.`} <Link to="/students">Export a backup</Link></div>
      )}
    </>
  );
}
