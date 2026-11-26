// The lesson model: builds the list of activity items for a lesson, story or Daily English topic,
// and turns the results into stars and feedback. Ported from reference/sentence-builders/index.html.
import { SB, DAILY, levelById } from '../content/index.js';
import { G, WHERE, shuf, pick, cap } from './banks.js';

/* ---------- activity names (English + Chinese) ---------- */
export const ACT = {
  words: ['🖼️', 'New words', '新单词'], find: ['🔎', 'Find the picture', '找图片'], phrase: ['💬', 'Useful phrases', '常用语'], what: ['🤔', 'What would you say?', '你会怎么说？'],
  role: ['🎭', 'Role-play', '角色扮演'], swap: ['🔁', 'Swap the word', '换个词'], convo: ['📺', 'Watch the conversation', '看对话'], teach: ['📘', 'Learn the pattern', '学句型'],
  watch: ['📺', 'Watch the story', '看故事'], order: ['🧩', 'Put it in order', '排顺序'], learn: ['👀', 'Look, listen & say', '看一看，听一听，说一说'], learnStory: ['👀', 'Listen to the story', '听故事'],
  build: ['🧱', 'Build the sentence', '搭句子'], silly: ['🎰', 'Silly Sentence Machine', '搞笑句子机'], speak: ['🗣️', 'Your turn to talk', '轮到你说了'], count: ['🔢', 'How many?', '有几个？'],
  stretch: ['🪀', 'Stretch it!', '把句子拉长！'], story: ['📖', 'Tell the story', '讲故事'],
};
const ACTNAME = { words: 'learning new words', find: 'finding the words', phrase: 'saying useful phrases', what: 'choosing what to say', role: 'role-play', swap: 'making new sentences', teach: 'learning the pattern', watch: 'watching the story', order: 'putting the story in order', learn: 'looking and saying sentences', learnStory: 'listening to the story', build: 'building sentences', count: 'counting sentences', silly: 'making silly sentences', speak: 'saying sentences on their own', stretch: 'stretching sentences', story: 'telling the story' };
const ACTNAMEZ = { words: '学新单词', find: '找单词', phrase: '说常用语', what: '选择怎么说', role: '角色扮演', swap: '说新句子', order: '给故事排顺序', learn: '看图说句子', build: '搭句子', count: '数数说句子', silly: '编搞笑句子', speak: '自己说句子', stretch: '把句子拉长', story: '讲故事' };

/* the question a hidden block asks (tap to peek) */
export const Q = {
  who: ['Who is it?', '是谁？'], who2: ['Compared with what?', '和什么比？'], doing: ['What is happening?', '在做什么？'], what: ['What is it?', '是什么？'], where: ['Where?', '在哪里？'], why: ['Why?', '为什么？'], when: ['When?', '什么时候？'],
  event: ['What happened?', '发生了什么？'], will: ['What will happen?', '会怎么样？'], cond: ["What's the situation?", '什么情况？'], result: ["What's the result?", '结果呢？'], can: ['What can it do?', '会做什么？'], cant: ["What can't it do?", '不会做什么？'],
  answer: ['Yes or no?', '是还是不是？'], size: ['Big or small?', '大还是小？'], colour: ['What colour?', '什么颜色？'], num: ['How many?', '几个？'], desc: ['What does it look like?', '是什么样的？'], link: ['Joining word', '连接词'], link2: ['Joining word', '连接词'],
};
/* "To improve" advice for the sentence part with the most mistakes */
const ROLEFB = {
  who: 'Start with WHO — the person or animal comes first.', who2: 'Remember to finish with the second thing you are comparing.', doing: 'Check the DOING block — the verb (is + -ing, or the right tense).', what: "Don't forget WHAT — the thing in the sentence.", where: 'Put WHERE (the place) near the end.',
  why: 'After “because”, say the reason.', when: 'Put the time word (Yesterday…) at the start.', link: 'Use the joining word in the right place (because / when / if / and / but).', link2: 'Use the joining word in the right place.', event: 'Say what happened with when + past.',
  will: 'Watch the helper words: will / would / must / might / is going to.', cond: 'Say the situation first (If… / Although… / the clue).', result: 'Finish with the result.', can: 'can + verb with no -s: can swim.', cant: "can't + verb: can't fly.",
  size: 'Size comes before colour: a big red ball.', colour: 'Size first, then colour.', num: 'Count, then say the number word.', desc: 'Describing words go before the noun.',
  answer: "Finish with a short answer: Yes, it is! / No, I don't!", word: 'Review the topic words: say each one with its picture.', reply: 'Think about the situation first: what would you really say?', order: 'Think about what happens first, next and last in the story.',
};
const ROLEFBZ = {
  word: '复习本课单词，看着图片说一说。', reply: '先想想情境：你真的会怎么说？', answer: '最后用简短回答：Yes, it is! / No, I don\'t!', order: '想一想故事先发生什么，然后呢，最后呢。', who: '先说“谁”。', doing: '注意动作词（动词的形式）。', what: '别忘了“什么”。', where: '地点放在后面。',
  why: 'because 后面说理由。', when: '时间词放在开头。', link: '连接词放在正确的位置。', will: '注意助词：will / would / must / might。', cond: '先说情况。', result: '最后说结果。', size: '大小在颜色前面。', colour: '先大小，后颜色。', num: '先数一数，再说数字。', desc: '描述词放在名词前面。',
  who2: '最后说出比较的另一方。', link2: '连接词放在正确的位置。', event: '用 when + 过去式说发生了什么。', can: 'can 后面的动词不加 -s。', cant: "can't 后面加动词原形。",
};

/* ---------- text helpers ---------- */
export const endsWithMark = (t) => /[.!?”]$/.test(t);
export const sentence = (it) => { const s = cap(it.c.map((x) => x[1]).join(' ')); return endsWithMark(s) ? s : s + '.'; };
export const withName = (s, name) => String(s).replace(/\{name\}/g, name || 'Leo');
export const nDistractors = (lv) => ({ A1: 0, A2: 1, B1: 1, B2: 1, C1: 2, C2: 2 })[lv] || 0;

// The sentence the teacher hears when they tap Listen / Try again.
export function curText(x) {
  switch (x.k) {
    case 'phrase': return x.text;
    case 'role': return x.sto.p[x.j].s;
    case 'swap': return x.f[0].replace('___', x.cur ? x.cur[1] : '…');
    case 'watch': case 'order': case 'learnStory': return x.sto.p.map((p) => p.s).join(' ');
    case 'story': return x.sto.p[x.pi].s;
    case 'what': return x.w[3][0];
    case 'find': return x.w[1];
    case 'stretch': return cap([x.it.c[0][1], x.it.c[1][1], x.where ? x.where[1] : '', x.stage >= 2 ? x.it.c[2][1] : ''].filter(Boolean).join(' ')) + '.';
    default: return x.it ? sentence(x.it) : '';
  }
}

/* ---------- items ---------- */
const bankFor = (l) => (l.gen ? null : l.items ? SB.items[l.items] : null);
export function nextItem(l, used) {
  if (l.gen) return G[l.gen]();
  const b = bankFor(l), free = b.map((_, i) => i).filter((i) => !used.has(i));
  const i = free.length ? pick(free) : pick(b.map((_, j) => j)); used.add(i);
  const x = b[i]; return { c: x.c.map(([r, t]) => [r, t, '']), sc: x.sc, shape: x.shape, mean: x.mean };
}
// Wrong blocks mixed into Build at higher levels: a block from another sentence of the same lesson.
export function distractors(l, it, n) {
  const out = [];
  for (let t = 0; t < 40 && out.length < n; t++) {
    const o = nextItem(l, new Set()); if (!o || !o.c || o.c.length < 2) continue;
    const ch = pick(o.c.slice(1));
    if (!it.c.some((x) => x[1] === ch[1]) && !out.some((x) => x[1] === ch[1])) out.push(ch);
  }
  return out;
}

const storyItems = (sto) => [{ k: 'watch', sto }, { k: 'order', sto, mist: {}, got: [] }, ...sto.p.map((_, pi) => ({ k: 'story', sto, pi }))];

// A lesson from the level's list (index 0–9).
export function buildLesson(level, idx) {
  const L = levelById(level), src = L.lessons[idx];
  const l = { ...src, lv: level, idx, kind: 'lesson' };
  const items = [];
  if (l.story) {
    const sto = shuf(SB.stories[l.story] || []);
    items.push({ k: 'teach', sto: sto[0] });
    sto.slice(0, 2).forEach((t) => items.push(...storyItems(t)));
  } else {
    const used = new Set();
    items.push({ k: 'teach', it: nextItem(l, used) });
    l.acts.forEach(([k, n]) => { for (let i = 0; i < n; i++) items.push({ k, it: k === 'stretch' ? G.why() : nextItem(l, used), mist: {}, filled: [], rv: [] }); });
  }
  return { kind: 'lesson', key: `${level}-${idx + 1}`, l, items };
}

const storyWords = (sto) => [...new Set(sto.p.map((p) => (/^([A-Z][A-Za-z' ]{1,22}),/.exec(p.s) || [])[1]).filter(Boolean))];
export { storyWords };

// A story from the level's story list (index 0-based).
export function buildStory(level, idx) {
  const sto = SB.stories[level][idx], L = levelById(level).lessons.find((x) => x.story);
  const l = {
    n: sto.t, lv: level, idx, kind: 'story', sticker: '📺', grammar: 'Story time',
    rule: L ? L.rule : 'Say what you see: This is… The cat is playing…', ruleZh: L ? L.ruleZh : '说出你看到的：This is… The cat is playing…',
    tip: L ? L.tip : 'Pause after each picture and ask “What is he doing?”', tipZh: L ? L.tipZh : '每张图后停一下，问“他在做什么？”',
  };
  return { kind: 'story', key: `${level}-${idx}`, l, items: [{ k: 'teach', sto }, ...storyItems(sto)] };
}

/* ---------- Daily English ---------- */
export const CAST = {
  me: { k: 'boy', o: { hair: 'short', hc: '#222', top: 'tshirt', tc: '#2f6fe0' } }, friend: { k: 'girl', o: { hair: 'long', hc: '#7a4a24', top: 'dress', tc: '#ff6fae' } },
  mum: { k: 'girl', s: 1.2, o: { hair: 'long', hc: '#222', top: 'dress', tc: '#d6336c' } }, dad: { k: 'boy', s: 1.2, o: { hair: 'short', hc: '#222', top: 'jacket', tc: '#2f6fe0' } },
  teacher: { k: 'girl', s: 1.2, o: { hair: 'bun', hc: '#222', top: 'jacket', tc: '#7c4ddb', glasses: true } }, grandma: { k: 'grandma', s: 1.12 },
  shop: { k: 'boy', s: 1.2, o: { hair: 'short', hc: '#7a4a24', top: 'sweater', tc: '#1e9e50', glasses: true } }, doctor: { k: 'girl', s: 1.2, o: { hair: 'short', hc: '#222', top: 'jacket', tc: '#dfeaf7', glasses: true } },
  keeper: { k: 'girl', s: 1.2, o: { hair: 'bun', hc: '#7a4a24', top: 'jacket', tc: '#1e9e50' } },
};
export const CASTNAME = { friend: 'Lily', mum: 'Mum', dad: 'Dad', teacher: 'Teacher', grandma: 'Grandma', shop: 'Shopkeeper', doctor: 'Doctor', keeper: 'Zookeeper' };
const PITCH = { me: 1.2, friend: 1.4, mum: 1.05, teacher: 1.05, doctor: 1, dad: 0.8, shop: 0.85, grandma: 0.95, keeper: 1.1 };
export const duoSc = (t, sp, act, mood) => ({ duo: 1, place: t.place, a: CAST[t.cast[0]], b: CAST[t.cast[1]], sp, act, ma: sp === 'a' ? mood : 'happy', mb: sp === 'b' ? mood : 'happy' });
const convoStory = (t, name) => ({ t: t.t, p: t.convo.map(([sp, s, zh, act, mood]) => ({ sc: duoSc(t, sp, act, mood), s: withName(s, name), zh: withName(zh, name), n: sp === 'a' ? CASTNAME[t.cast[0]] : (name || 'You'), pitch: PITCH[sp === 'a' ? t.cast[0] : t.cast[1]] })) });
// The student's own picture for a phrase (the "me" character).
export const meScene = (t, act, mood, place) => { let pl = place || t.place; if (pl === 'bath' && act !== '🛁') pl = 'none'; return { who: 'boy', act, mood: mood || 'happy', place: pl }; };

export function buildDaily(topicId, name) {
  const t = DAILY.find((d) => d.id === topicId), idx = DAILY.indexOf(t), sto = convoStory(t, name);
  const l = { n: t.t, lv: null, idx, kind: 'daily', t, grammar: 'Daily English', rule: 'Learn whole phrases first — then swap one word to make new sentences.', ruleZh: '先整句学会，再换一个词说出新句子。', tip: t.tip, tipZh: t.tipZh };
  const items = [
    { k: 'words', t, heard: [] },
    ...shuf(t.words).slice(0, 3).map((w) => ({ k: 'find', t, w, mist: {} })),
    ...shuf(t.ph).slice(0, 4).map((p) => ({ k: 'phrase', t, p, text: withName(p[0], name), zh: withName(p[1], name) })),
    { k: 'watch', sto, convo: 1 },
    ...shuf(t.what).map((w) => ({ k: 'what', t, w, mist: {}, opts: shuf(w[3]) })),
    ...sto.p.map((p, j) => (p.sc.sp === 'b' ? { k: 'role', t, sto, j } : null)).filter(Boolean),
    ...t.swap.map((f) => ({ k: 'swap', t, f, done: [] })),
  ];
  return { kind: 'daily', key: t.id, l, items };
}

export { WHERE };

/* ---------- feedback ---------- */
export function feedback(rec, l, name) {
  rec = rec.filter(Boolean); const n = name || 'You';
  const by = {}; rec.forEach((r) => { (by[r.k] = by[r.k] || []).push(r); });
  const mist = {}; rec.forEach((r) => Object.entries(r.mist || {}).forEach(([k, v]) => { mist[k] = (mist[k] || 0) + v; }));
  const totM = Object.values(mist).reduce((a, b) => a + b, 0), builds = (by.build || []).concat(by.count || []);
  const score = (k) => (by[k] ? by[k].reduce((a, r) => a + r.s, 0) / (2 * by[k].length) : 0);
  const best = Object.keys(by).filter((k) => !['learnStory', 'teach', 'watch', 'words'].includes(k)).sort((a, b) => score(b) - score(a))[0];
  const helpN = rec.filter((r) => r.help).length, big = rec.filter((r) => r.s === 2).length, small = rec.filter((r) => r.s === 1).length;
  const bestBig = best ? by[best].filter((r) => r.s === 2).length : 0;
  const perfect = builds.length && !totM;
  const strength = perfect ? `${n} built every sentence in the right order — no mistakes at all!` : best ? `${n} did really well at ${ACTNAME[best]} (${bestBig} big star${bestBig === 1 ? '' : 's'}).` : `${n} kept trying all the way through!`;
  const strengthZ = perfect ? '所有句子都按正确顺序搭好了，一个错误也没有！' : best ? `${ACTNAMEZ[best] || '这一部分'}做得特别好（${bestBig} 颗大星星）。` : '一直坚持到最后，真棒！';
  const worst = Object.entries(mist).sort((a, b) => b[1] - a[1])[0];
  const improve = worst ? ROLEFB[worst[0]] || 'Look carefully at the order of the blocks.' : helpN ? `Try saying the whole sentence without help next time (${helpN} needed help).` : by.speak && score('speak') < 1 ? 'Practise saying the sentences alone, without looking.' : 'Ready for the next lesson — or try this one again a little faster!';
  const improveZ = worst ? ROLEFBZ[worst[0]] || '注意积木的顺序。' : helpN ? '下次试着不看提示，自己说完整的句子。' : by.speak && score('speak') < 1 ? '练习不看提示，自己说句子。' : '可以学下一课了！';
  const acts = Object.keys(by).map((k) => `${ACT[k][0]} ${ACT[k][1]}: ${by[k].filter((r) => r.s === 2).length}★`);
  return { strength, strengthZ, improve, improveZ, big, small, weak: mist, acts };
}
