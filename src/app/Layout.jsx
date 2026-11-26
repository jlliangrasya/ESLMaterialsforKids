import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStore, totalsOf } from '../store/useStore.js';
import { LEVELS, levelById } from '../content/index.js';

export default function Layout() {
  const { students, currentStudentId, setCurrent, viewLevel, setViewLevel, settings, setSetting } = useStore();
  const stu = currentStudentId ? students[currentStudentId] : null;
  const t = totalsOf(stu);
  const nav = useNavigate();
  const lv = viewLevel || 'A1';

  useEffect(() => { document.body.classList.toggle('nozh', !settings.zh); }, [settings.zh]);
  useEffect(() => { document.body.classList.toggle('sidecol', !settings.sidebar); }, [settings.sidebar]);

  const fullScreen = () => {
    const el = document.documentElement;
    if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen?.().catch(() => alert('Full screen is blocked here. Press F11 (Windows) or Ctrl+Cmd+F (Mac).'));
  };
  const links = [
    ['/', '🏠', 'Today'], [`/plan/${lv}`, '🗺️', 'Course plan'], [`/lessons/${lv}`, '🧱', 'Lessons'], ['/daily', '💬', 'Daily English'],
    [`/stories/${lv}`, '📺', 'Stories'], ['/quest', '🎯', 'English Quest'], ['/coach', '🎙️', 'Speaking Coach'], ['/progress', '📈', 'Progress'],
    ['/guide', '👩‍🏫', 'Teacher guide'], ['/students', '👥', 'Students'], ['/settings', '⚙️', 'Settings'],
  ];

  return (
    <div className="shell">
      <aside className="side" aria-label="Main menu">
        <h2>Student</h2>
        <select className="student-pick" value={currentStudentId || ''} onChange={(e) => e.target.value === '+' ? nav('/students') : setCurrent(e.target.value)}>
          {!stu && <option value="">Choose a student…</option>}
          {Object.entries(students).map(([id, s]) => <option key={id} value={id}>{s.name} · {s.level}</option>)}
          <option value="+">+ Add a student</option>
        </select>
        <h2>Level</h2>
        <div className="lvgrid">
          {LEVELS.map((l) => (
            <button key={l.id} className={'lvb' + (l.id === lv ? ' on' : '')} title={l.name}
              onClick={() => { setViewLevel(l.id); const p = location.pathname; if (/^\/(plan|lessons|stories)\//.test(p)) nav(p.replace(/\/(A1|A2|B1|B2|C1|C2)(\/.*)?$/, '/' + l.id)); }}>
              {l.id}
            </button>
          ))}
        </div>
        <h2>Menu</h2>
        <nav className="nav">
          {links.map(([to, icon, label]) => <NavLink key={label} to={to} end={to === '/'}>{icon} {label}</NavLink>)}
        </nav>
      </aside>
      <div className="mainwrap">
        <header className="hud">
          <h1>Sentence <span>Builders</span> 🧱</h1>
          <div className="pills">
            <button className="pill" onClick={() => setSetting('sidebar', !settings.sidebar)}>☰ Menu</button>
            <span className="pill">{stu ? stu.name : 'No student'}</span>
            <span className="pill">{lv} · {levelById(lv).name}</span>
            <span className="pill">Big stars <b>{t.big}</b></span>
            <span className="pill">Small stars <b>{t.small}</b></span>
            <span className="pill">Stickers <b>{t.stickers}</b>/60</span>
            <button className="pill" onClick={() => setSetting('zh', !settings.zh)}>中文 {settings.zh ? 'on' : 'off'}</button>
            <button className="pill fs" onClick={fullScreen}>⛶ Full screen</button>
          </div>
        </header>
        <main><Outlet /></main>
      </div>
    </div>
  );
}
