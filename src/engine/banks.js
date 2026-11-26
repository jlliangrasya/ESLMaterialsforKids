// Word banks and sentence generators, ported from reference/sentence-builders/index.html (`G={`).
// A generator returns one practice item: { c: [[role, text, emoji]], sc | shape, ... }.
import { ART } from '../content/index.js';

export const shuf = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const pick = (a) => a[Math.floor(Math.random() * a.length)];
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const em = (k) => ART.EMO[k] || k;

// Who can be in a sentence. All of these are drawn as original SVG characters (src/content/art.legacy.js).
// The first 8 are used by the "why" generator, so keep people and the easiest animals first.
export const WHO = [
  ['boy', 'the boy', 'he'], ['girl', 'the girl', 'she'], ['cat', 'the cat', 'it'], ['dog', 'the dog', 'it'],
  ['panda', 'the panda', 'it'], ['rabbit', 'the rabbit', 'it'], ['grandma', 'Grandma', 'she'], ['bear', 'the bear', 'it'],
  ['dino', 'the dinosaur', 'it'], ['robot', 'the robot', 'it'], ['monkey', 'the monkey', 'it'], ['frog', 'the frog', 'it'],
  ['elephant', 'the elephant', 'it'], ['lion', 'the lion', 'it'], ['penguin', 'the penguin', 'it'],
];
export const ANIMALS = ['cat', 'dog', 'panda', 'rabbit', 'bear', 'monkey', 'frog', 'elephant', 'lion', 'penguin'];
export const DO = [['😴', 'is sleeping', 'tired', 'bed'], ['🏃', 'is running', 'happy', 'park'], ['💃', 'is dancing', 'happy', 'school'], ['🏊', 'is swimming', 'happy', 'beach'], ['🎤', 'is singing', 'happy', 'school'], ['😂', 'is laughing', 'happy', 'park'], ['🦘', 'is jumping', 'happy', 'park'], ['🧗', 'is climbing', 'happy', 'park'], ['😭', 'is crying', 'sad', 'bed'], ['👋', 'is waving', 'happy', 'beach']];
export const VO = [['🍽️', 'is eating', [['🍎', 'an apple'], ['🍕', 'a pizza'], ['🍌', 'a banana'], ['🍦', 'an ice cream'], ['🍔', 'a burger']], 'kitchen'], ['🥤', 'is drinking', [['🥛', 'milk'], ['🧃', 'juice'], ['💧', 'water']], 'kitchen'],
  ['📖', 'is reading', [['📕', 'a book'], ['🗺️', 'a map']], 'school'], ['🦶', 'is kicking', [['⚽', 'a ball']], 'park'], ['🎨', 'is painting', [['🌈', 'a rainbow'], ['🏠', 'a house'], ['🌻', 'a flower']], 'school'],
  ['🤲', 'is holding', [['🎈', 'a balloon'], ['🐟', 'a fish'], ['🎁', 'a present']], 'park'], ['👀', 'is watching', [['📺', 'TV'], ['🎆', 'fireworks']], 'bed']];
export const WHERE = [['park', 'in the park', '🌳'], ['beach', 'at the beach', '🏖️'], ['kitchen', 'in the kitchen', '🍳'], ['space', 'in space', '🚀'], ['bath', 'in the bathtub', '🛁'], ['school', 'at school', '🏫'], ['bed', 'in bed', '🛏️'], ['snow', 'in the snow', '❄️']];
export const REASON = [{ a: '🍽️', d: 'is eating', f: '😋', w: 'hungry', m: 'happy', p: 'kitchen' }, { a: '😴', d: 'is sleeping', f: '🥱', w: 'tired', m: 'tired', p: 'bed' }, { a: '💧', d: 'is drinking water', f: '🥵', w: 'thirsty', m: 'tired', p: 'kitchen' }, { a: '🧥', d: 'is wearing a coat', f: '🥶', w: 'cold', m: 'sad', p: 'snow', acc: 'scarf' },
  { a: '😂', d: 'is laughing', f: '😄', w: 'happy', m: 'happy', p: 'park' }, { a: '😭', d: 'is crying', f: '😢', w: 'sad', m: 'sad', p: 'bed' }, { a: '🏃', d: 'is running', f: '⏰', w: 'late', m: 'surprised', p: 'school' }, { a: '🕶️', d: 'is wearing sunglasses', f: '☀️', w: 'sunny', it: 1, m: 'happy', p: 'beach', acc: 'sunglasses' }];
export const whyText = (r, w) => (r.it ? `because it is ${r.w}` : `because ${w[2]} is ${r.w}`);
const COLOURS = [['red', '#ff4d4d'], ['blue', '#3a8bff'], ['green', '#2fbf5f'], ['yellow', '#ffd23f'], ['pink', '#ff6fae'], ['purple', '#9b6bff'], ['orange', '#ff9f1c']];
const SHAPES = [['ball', 'balls'], ['star', 'stars'], ['heart', 'hearts'], ['balloon', 'balloons'], ['box', 'boxes'], ['fish', 'fish']];
const NUMS = [[2, 'two'], [3, 'three'], [4, 'four'], [5, 'five']];
const FOODS = [['🍎', 'apples'], ['🍌', 'bananas'], ['🥕', 'carrots'], ['🍰', 'cake'], ['🍇', 'grapes'], ['🥦', 'broccoli'], ['🍪', 'cookies'], ['🥚', 'eggs'], ['🍕', 'pizza'], ['🍦', 'ice cream'], ['🍓', 'strawberries'], ['🍅', 'tomatoes']];
const PREP = { box: ['in', 'on', 'next to'], table: ['on', 'under', 'next to'], chair: ['on', 'under', 'next to'], bed: ['in', 'on', 'under', 'next to'] };
const PAST = [['⚽', 'played football', 'park'], ['🍕', 'ate pizza', 'kitchen'], ['👵', 'visited Grandma', 'kitchen'], ['📺', 'watched TV', 'bed'], ['🏖️', 'went to the beach', 'beach'], ['🎂', 'made a cake', 'kitchen'], ['🚲', 'rode a bike', 'park'], ['🎨', 'painted a picture', 'school'], ['🏊', 'swam in the sea', 'beach'], ['⛄', 'built a snowman', 'snow']];
export const WHEN = [['Yesterday,', '📅'], ['Last night,', '🌙'], ['Last weekend,', '🗓️'], ['This morning,', '🌅']];
const HAIRC = [['brown', '#7a4a24'], ['black', '#222'], ['blonde', '#f2c35b'], ['red', '#c4421a']];
const TOPS = { girl: [['dress', 'a'], ['T-shirt', 'a'], ['jacket', 'a'], ['sweater', 'a']], boy: [['T-shirt', 'a'], ['jacket', 'a'], ['sweater', 'a']] };
const TOPKEY = { dress: 'dress', 'T-shirt': 'tshirt', jacket: 'jacket', sweater: 'sweater' };
const ACCS = [['hat', 'a hat'], ['sunglasses', 'sunglasses'], ['scarf', 'a scarf'], ['party', 'a party hat']];
const VIVID = {
  adj: [['enormous, hungry', 'surprised'], ['tiny, curious', 'happy'], ['grumpy, old', 'sad'], ['sparkly, brave', 'happy'], ['sleepy, fluffy', 'tired'], ['clumsy, cheerful', 'happy']],
  noun: [['dino', 'dinosaur'], ['robot', 'robot'], ['cat', 'cat'], ['dog', 'dog'], ['bear', 'bear'], ['panda', 'panda'], ['elephant', 'elephant'], ['lion', 'lion'], ['penguin', 'penguin'], ['monkey', 'monkey']],
  verb: [['🦶', 'stomped'], ['🩰', 'tiptoed'], ['💨', 'zoomed'], ['🐧', 'waddled'], ['🐾', 'crept'], ['🐎', 'galloped']],
  place: [['park', 'through the silent forest', '🌲'], ['beach', 'along the sparkling shore', '🌊'], ['space', 'across the starry sky', '✨'], ['snow', 'over the frozen hills', '❄️'], ['kitchen', 'into the messy kitchen', '🍳'], ['school', 'into the empty classroom', '🏫']],
};
const nameOf = (k) => WHO.find((x) => x[0] === k)[1];

export const G = {
  wd() { const w = pick(WHO), d = pick(DO); return { c: [['who', w[1], em(w[0])], ['doing', d[1], d[0]]], sc: { who: w[0], act: d[0], mood: d[2], place: d[3] } }; },
  wdo() { const w = pick(WHO), v = pick(VO), o = pick(v[2]); return { c: [['who', w[1], em(w[0])], ['doing', v[1], v[0]], ['what', o[1], o[0]]], sc: { who: w[0], act: v[0], obj: o[0], mood: 'happy', place: v[3] } }; },
  wdw() { const w = pick(WHO), d = pick(DO), p = pick(WHERE); return { c: [['who', w[1], em(w[0])], ['doing', d[1], d[0]], ['where', p[1], p[2]]], sc: { who: w[0], act: d[0], mood: d[2], place: p[0] } }; },
  desc() { const c = pick(COLOURS), s = pick(SHAPES), z = pick([['big', 1], ['small', 0]]); return { c: [['link', 'I see a'], ['size', z[0], z[1] ? '🐘' : '🐭'], ['colour', c[0], '🎨'], ['what', s[0], '✨']], shape: { k: s[0], col: c[1], n: 1, big: z[1] } }; },
  count() { const c = pick(COLOURS), s = pick(SHAPES), n = pick(NUMS); return { c: [['link', 'There are'], ['num', n[1], '🔢'], ['colour', c[0], '🎨'], ['what', s[1], '✨']], shape: { k: s[0], col: c[1], n: n[0], big: 0 } }; },
  like() { const f = pick(FOODS), y = Math.random() < 0.55, w = pick(['boy', 'girl']); return { c: [['who', 'I', '🙋'], ['doing', y ? 'like' : "don't like", y ? '👍' : '👎'], ['what', f[1], f[0]]], sc: { who: w, mood: y ? 'happy' : 'sad', obj: f[0], act: y ? '👍' : '👎', place: 'kitchen' } }; },
  prep() { const t = pick(Object.keys(PREP)), r = pick(PREP[t]), w = pick(['cat', 'dog', 'bear', 'robot', 'boy', 'girl', 'panda', 'rabbit', 'penguin', 'frog']); return { c: [['who', nameOf(w), em(w)], ['link', 'is'], ['where', `${r} the ${t}`, '📍']], sc: { prep: { who: w, rel: r, thing: t } } }; },
  why() { const w = pick(WHO.slice(0, 8)), r = pick(REASON); return { c: [['who', w[1], em(w[0])], ['doing', r.d, r.a], ['why', whyText(r, w), r.f]], sc: { who: w[0], act: r.a, feel: r.f, mood: r.m, place: r.p, acc: r.acc }, rs: r, w }; },
  past() { const w = pick(WHO), p = pick(PAST), t = pick(WHEN); return { c: [['when', t[0], t[1]], ['who', w[1], em(w[0])], ['doing', p[1], p[0]]], sc: { who: w[0], act: p[0], feel: t[1], mood: 'happy', place: p[2] } }; },
  person() {
    const g = pick(['boy', 'girl']), pr = g === 'girl' ? 'she' : 'he', len = g === 'girl' ? pick(['long', 'short']) : pick(['short', 'curly']), hc = pick(HAIRC), tp = pick(TOPS[g]), tc = pick(COLOURS), gl = Math.random() < 0.3;
    return { c: [['who', `${cap(pr)} has`, '👤'], ['desc', `${len} ${hc[0]} hair`, '💇'], ['link', 'and', '➕'], ['doing', `${pr} is wearing ${gl ? 'glasses and ' : ''}${tp[1]} ${tc[0]} ${tp[0]}`, '👕']], sc: { person: { g, hair: len, hc: hc[1], top: TOPKEY[tp[0]], tc: tc[1], glasses: gl, mood: 'happy' } } };
  },
  rel() {
    const key = pick(['dog', 'cat', 'bear', 'robot', 'boy', 'girl', 'panda', 'penguin']), nm = nameOf(key), accs = shuf(ACCS).slice(0, 3), dos = shuf(DO.slice(0, 8)).slice(0, 3), t = Math.floor(Math.random() * 3), rp = key === 'boy' || key === 'girl' ? 'who' : 'that';
    return { c: [['who', nm, em(key)], ['link', `${rp} is wearing`, '👉'], ['what', accs[t][1], '🎩'], ['doing', dos[t][1], dos[t][0]]], sc: { crowd: 1, key, t, place: 'park', m: accs.map((a, i) => ({ acc: a[0], act: dos[i][0], mood: dos[i][2] })) } };
  },
  vivid() { const a = pick(VIVID.adj), n = pick(VIVID.noun), v = pick(VIVID.verb), p = pick(VIVID.place); return { c: [['desc', `the ${a[0]}`, '✨'], ['who', n[1], em(n[0])], ['doing', v[1], v[0]], ['where', p[1], p[2]]], sc: { who: n[0], act: v[0], mood: a[1], place: p[0] } }; },
};

// Emoji shown on the Silly Sentence Machine reels while they spin.
export const reelPool = (role) => ({
  who: WHO.map((w) => em(w[0])), doing: DO.map((d) => d[0]), what: VO.flatMap((v) => v[2].map((o) => o[0])),
  where: WHERE.map((p) => p[2]), why: REASON.map((r) => r.f), when: WHEN.map((w) => w[1]), desc: ['✨', '🌟', '💫'],
})[role] || ['✨'];
