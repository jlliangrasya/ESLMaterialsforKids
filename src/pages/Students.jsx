import { useRef, useState } from 'react';
import { useStore } from '../store/useStore.js';
import { exportBackup, importBackup } from '../store/backup.js';
import { LEVELS } from '../content/index.js';
import AddStudentForm from './AddStudentForm.jsx';

export default function Students() {
  const { students, currentStudentId, setCurrent, updateStudent, removeStudent, lastBackup } = useStore();
  const file = useRef(), [msg, setMsg] = useState('');
  const onImport = async (e) => { const f = e.target.files[0]; if (!f) return; try { const n = await importBackup(f); setMsg(`Restored ${n} students.`); } catch (err) { setMsg(err.message); } e.target.value = ''; };
  return (
    <>
      <div className="card">
        <h2>Students</h2>
        <AddStudentForm />
        <table className="simple" style={{ marginTop: 16 }}>
          <thead><tr><th>Name</th><th>Level</th><th>Age</th><th>Started</th><th></th></tr></thead>
          <tbody>
            {Object.entries(students).map(([id, s]) => (
              <tr key={id} style={id === currentStudentId ? { background: '#f3edff' } : null}>
                <td><input className="text" value={s.name} onChange={(e) => updateStudent(id, { name: e.target.value })} aria-label="Name" /></td>
                <td><select className="text" value={s.level} onChange={(e) => updateStudent(id, { level: e.target.value })} aria-label="Level">{LEVELS.map((l) => <option key={l.id}>{l.id}</option>)}</select></td>
                <td>{s.ageGroup}</td><td>{s.createdAt}</td>
                <td><button className="ghost" onClick={() => setCurrent(id)}>{id === currentStudentId ? '✓ Current' : 'Teach'}</button>{' '}
                  <button className="ghost" onClick={() => confirm(`Delete ${s.name} and all their progress?`) && removeStudent(id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h2>Backup</h2>
        <p className="muted">Progress is saved in this browser only. Clearing browser data or changing computers loses it. Export a backup every week.<span className="zh">进度只保存在这个浏览器里，请每周导出备份。</span></p>
        <div className="row"><button className="go" onClick={exportBackup}>💾 Export backup</button><button className="ghost" onClick={() => file.current.click()}>Import backup</button>
          <input ref={file} type="file" accept="application/json" hidden onChange={onImport} /><span className="muted">{lastBackup ? `Last backup: ${lastBackup}` : 'No backup yet'}</span></div>
        {msg && <p><b>{msg}</b></p>}
      </div>
    </>
  );
}
