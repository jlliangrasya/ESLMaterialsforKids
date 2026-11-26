// The course plan: which class comes next, and what each class is.
// Same rules as the artifact and the Teacher's Handbook.
import { SB, DAILY, CURRIC, levelById } from '../content/index.js';

export const sequenceOf = (lv) => CURRIC.sequence(lv);
export const planRecord = (stu, lv) => (stu && stu.plan && stu.plan[lv]) || {};
export const nextClass = (stu, lv) => { const r = planRecord(stu, lv); return sequenceOf(lv).find((c) => !r[c.n]) || null; };

// Review classes replay the Daily English topic with the lowest share of big stars, among topics already taught in this level.
export function reviewTopic(stu, lv, n) {
  const used = sequenceOf(lv).filter((c) => c.type === 'B' && c.daily !== 'review' && c.n < n).map((c) => c.daily);
  const score = (id) => { const p = stu && stu.daily[id]; return p ? (p.b || 0) / Math.max(1, (p.b || 0) + (p.s || 0)) : -1; };
  const pool = used.length ? used : DAILY.map((t) => t.id);
  return [...pool].sort((a, b) => score(a) - score(b))[0];
}

export function classInfo(stu, lv, c) {
  const L = levelById(lv);
  if (c.type === 'A' || c.type === 'lesson') {
    const x = L.lessons[c.lesson - 1];
    return { kind: c.type === 'A' ? 'Learn it' : 'Lesson', title: `Lesson ${c.lesson}: ${x.n}`, sub: `Pattern: ${x.grammar} · “${x.ex}”`, goal: c.can, goalZh: c.canZh, lessonIndex: c.lesson - 1 };
  }
  if (c.type === 'B') {
    const id = c.daily === 'review' ? reviewTopic(stu, lv, c.n) : c.daily;
    const t = DAILY.find((d) => d.id === id);
    return { kind: 'Use it', title: (c.daily === 'review' ? 'Review: ' : 'Daily English: ') + t.t, sub: `Target: “${c.target}”`, goal: c.can, topicId: id };
  }
  if (c.type === 'story') { const s = SB.stories[lv][c.story]; return { kind: 'Story', title: `Story ${c.story + 1}: ${s.t}`, sub: 'Watch, put in order, retell', storyIndex: c.story }; }
  return { kind: 'Level check', title: `Level check: ${lv}`, sub: `Play the ${lv} games in English Quest, then record the result` };
}
