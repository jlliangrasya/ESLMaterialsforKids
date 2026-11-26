import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { VERSION, migrate } from './migrations.js';

const today = () => new Date().toISOString().slice(0, 10);
const newId = () => 'stu_' + Math.random().toString(36).slice(2, 8);
const emptyStudent = (name, level = 'A1', ageGroup = '5-6') => ({
  name, level, ageGroup, createdAt: today(), notes: '',
  lessons: {},   // "A1-3": { b, s, done, date, weak:{role:count}, fb:{strength,improve} }
  daily: {},     // "morning": { b, s, done, date }
  stories: {},   // "A1-0": { b, s, done, date }
  plan: {},      // { A1: { "1": { b, s, date }, "24": { result:"pass"|"repeat" } } }
  stickers: [],
  assessments: [], // [{ type:"quest"|"coach"|"unit-check", level, date, stars, result }]
});

export const useStore = create(
  persist(
    (set, get) => ({
      settings: { zh: true, voiceRate: 0.85, sounds: true, sidebar: true, motion: true },
      currentStudentId: null,
      students: {},
      lastBackup: null,
      viewLevel: 'A1',

      // students
      addStudent: (name, level, ageGroup) => {
        const id = newId();
        set((s) => ({ students: { ...s.students, [id]: emptyStudent(name.trim(), level, ageGroup) }, currentStudentId: id, viewLevel: level || 'A1' }));
        return id;
      },
      updateStudent: (id, patch) => set((s) => ({ students: { ...s.students, [id]: { ...s.students[id], ...patch } } })),
      removeStudent: (id) => set((s) => { const { [id]: _, ...rest } = s.students; return { students: rest, currentStudentId: s.currentStudentId === id ? Object.keys(rest)[0] || null : s.currentStudentId }; }),
      setCurrent: (id) => set((s) => ({ currentStudentId: id, viewLevel: s.students[id]?.level || s.viewLevel })),
      setViewLevel: (lv) => set({ viewLevel: lv }),
      current: () => { const s = get(); return s.currentStudentId ? s.students[s.currentStudentId] : null; },

      // results: one call per finished class, from the class player
      recordClass: ({ level, n, kind, key, b, s, weak, fb, result }) => set((st) => {
        const id = st.currentStudentId; if (!id) return {};
        const stu = structuredClone(st.students[id]);
        const rec = { b, s, date: today() };
        // Keep the best result when a class is played again (same rule as the artifact).
        const best = (prev) => (prev && (prev.b || 0) > b ? { b: prev.b, s: prev.s, date: today() } : rec);
        if (kind === 'lesson') { stu.lessons[key] = { ...best(stu.lessons[key]), done: true, weak, fb }; if (!stu.stickers.includes(key)) stu.stickers.push(key); }
        if (kind === 'daily') stu.daily[key] = { ...best(stu.daily[key]), done: true };
        if (kind === 'story') stu.stories[key] = { ...best(stu.stories[key]), done: true };
        if (n) { stu.plan[level] = stu.plan[level] || {}; stu.plan[level][n] = result ? { result, date: today() } : rec; }
        return { students: { ...st.students, [id]: stu } };
      }),

      // settings
      setSetting: (k, v) => set((s) => ({ settings: { ...s.settings, [k]: v } })),

      // backup
      markBackup: () => set({ lastBackup: today() }),
      replaceAll: (data) => set(() => ({ ...data })),
    }),
    {
      name: 'sb.app.v1',
      version: VERSION,
      storage: createJSONStorage(() => localStorage),
      migrate: (state, from) => migrate(state, from),
      partialize: (s) => ({ settings: s.settings, currentStudentId: s.currentStudentId, students: s.students, lastBackup: s.lastBackup, viewLevel: s.viewLevel }),
    }
  )
);

// Totals for the top bar.
export const totalsOf = (stu) => {
  if (!stu) return { big: 0, small: 0, stickers: 0 };
  let big = 0, small = 0;
  [stu.lessons, stu.daily, stu.stories].forEach((group) => Object.values(group).forEach((r) => { big += r.b || 0; small += r.s || 0; }));
  return { big, small, stickers: stu.stickers.length };
};
