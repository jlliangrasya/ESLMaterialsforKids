import { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { LEVELS } from '../content/index.js';

export default function AddStudentForm({ onDone }) {
  const addStudent = useStore((s) => s.addStudent);
  const [name, setName] = useState(''), [level, setLevel] = useState('A1'), [age, setAge] = useState('5-6');
  const submit = (e) => { e.preventDefault(); if (!name.trim()) return; addStudent(name, level, age); setName(''); onDone && onDone(); };
  return (
    <form className="row" onSubmit={submit}>
      <input className="text" placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} aria-label="Student first name" />
      <select className="text" value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Level">{LEVELS.map((l) => <option key={l.id} value={l.id}>{l.id} {l.name}</option>)}</select>
      <select className="text" value={age} onChange={(e) => setAge(e.target.value)} aria-label="Age group"><option value="5-6">Age 5–6</option><option value="7-8">Age 7–8</option><option value="9+">Age 9+</option></select>
      <button className="go" type="submit">Add student</button>
    </form>
  );
}
