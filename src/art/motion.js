// Moving pictures for every level: turns a still scene spec into one animated SVG.
//
// How it works
// - Each act/feel emoji belongs to a motion group (swim, sleep, rain, …) listed in GROUPS.
// - The act sets how the character moves (class mo-<group> on the layer) plus its effect layer
//   (water, Zzz, music notes…), which plays from the start.
// - The feel bubble is the second beat: it is hidden at first and arrives on "go" (timed to the voice by
//   AnimScene), with its own effect layer (rain starts, phone rings, lights go out…).
//   For that, the scene is drawn twice: layer A = before (no feel bubble, calm face) and
//   layer B = after (the full picture). AnimScene cross-fades A → B on "go".
// - Each place has a little background life (waves, bath bubbles, twinkling stars).
// - A spec can override the feel effect with fx:"<group>" (e.g. fx:"dark" for "the lights went out").
// Default styles are a still picture (used with prefers-reduced-motion); movement is in src/styles/anim.css.
import { ART } from '../content/index.js';

const GROUPS = {
  swim: '🏊 🐋 🛟 🐬 🤿',
  run: '🏃 🚶 👟 🐾 🏁 🐺 🐆',
  jump: '🦘 🐸 🤸',
  ride: '🚲 🐎 🚌 🐪 🚆 🛹 🚗',
  fly: '🚀 🕊️ 🐦 🦸 🐉 ✈️ 👽 🎈 🦋',
  dance: '💃 🩰 🎉 🎭 🕺',
  sing: '🎤 🎻 🎹 🔊 🎵 🎶 🎸 🥁',
  sleep: '😴 🛌 🥱 🛏️ 🪫',
  climb: '🧗 ⛰️ 🌋 🏰 🪜',
  laugh: '😂 😄 😊 😆 🤣 😁',
  cry: '😭 😢 🤕 😟 😣 😨 😬 🤢 😳',
  wave: '👋 🤗 🤝 🙌',
  eat: '🍽️ 🍕 🍔 🍰 🍦 🍎 🍌 🍪 🥦 🍲 😋 🥣 🍬 🦴 🥪 🍝 🍓 🍇 🥕 🍅 🥚 🍏 🤤 🥤 🥛 💧 🧃 ☕',
  ball: '⚽ 🎾 🏀 🏈 🥅',
  work: '🎨 📝 ✍️ 📖 📚 📄 📰 📋 🧶 🔧 📏 🗺️ 🧺 ✉️ 🎒 🔑 🗝️',
  clean: '🧹 🪥 🛁 🧽',
  think: '🧠 💡 🤔',
  watch: '📺 🎮 👀 👂',
  celebrate: '🏆 🥇 🏅 👏 🎆 🌈 💯 ⭐ ✨ 🎁 🎂',
  love: '❤️ 💖 🥹 💕',
  cold: '🥶 ❄️ ⛄ 🧥',
  hot: '🥵 ☀️ 🏖️ 🕶️ 🔥',
  rain: '🌧️ ☔ ☂️ ☁️',
  storm: '⛈️',
  wind: '💨',
  ring: '📞 🔔 ⏰ 📱',
  night: '🌙 🌌 🌕',
  sunrise: '🌅',
  leap: '🐱 🐶 🐈 🐕',
};
const strip = (e) => String(e || '').replace(/️/g, '');
const EMO = {};
for (const [g, s] of Object.entries(GROUPS)) for (const e of s.split(' ')) if (e && !EMO[strip(e)]) EMO[strip(e)] = g;
export const groupOf = (e) => (e ? EMO[strip(e)] || null : null);

// Groups that move the whole character (others leave the mood animation: hop, jolt, sway…).
const BODY = new Set(['swim', 'run', 'jump', 'ride', 'fly', 'dance', 'sing', 'sleep', 'climb', 'laugh', 'cry', 'wave', 'eat', 'ball', 'work', 'clean', 'think', 'watch', 'celebrate', 'love', 'cold', 'hot', 'wind']);

/* ---------- geometry of a single-character scene (same numbers as ART.scene) ---------- */
const PLACES = ['park', 'beach', 'kitchen', 'space', 'bath', 'school', 'bed', 'snow', 'none'];
const HT = { boy: 160, girl: 160, grandma: 170, cat: 136, dog: 124, bear: 128, robot: 166, dino: 136, panda: 128, rabbit: 164, monkey: 124, frog: 108, elephant: 130, lion: 140, penguin: 114 };
const HX = { dino: 30 };
function geo(o) {
  const place = PLACES.includes(o.place) ? o.place : 'none';
  const k = place === 'bed' ? 0.78 : place === 'bath' ? 0.8 : 0.95, base = place === 'bed' ? 190 : place === 'bath' ? 210 : 232;
  const x = o.obj ? 150 : 175, ht = (HT[o.who] || 110) * k, top = base - ht, hx = x + (HX[o.who] || 0) * k;
  return { place, k, base, x, ht, top, hx, ab: { x: o.obj ? 258 : 270, y: Math.max(54, Math.min(top + 10, 90)), r: 36 }, fb: { x: 346, y: Math.max(110, Math.min(top + 70, 160)), r: 28 } };
}

/* ---------- effect layers ---------- */
const rnd = (seed) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
const sv = (o) => Object.entries(o).map(([k, v]) => `--${k}:${v}`).join(';');
const EMOJI_FONT = 'font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"';

const rain = (n = 30) => { const r = rnd(7); let s = '<rect class="o-tint" width="400" height="250" fill="#4a5a78" opacity=".18"/>';
  for (let i = 0; i < n; i++) { const x = r() * 420 - 10, y = r() * 240; s += `<line class="o-rain" x1="${x.toFixed(0)}" y1="-24" x2="${(x - 5).toFixed(0)}" y2="-8" stroke="#5f9bd8" stroke-width="3" stroke-linecap="round" style="${sv({ y: y.toFixed(0) + 'px', d: (-r() * 0.9).toFixed(2) + 's' })}"/>`; }
  return s; };
const flash = () => '<rect class="o-flash" width="400" height="250" fill="#fff"/><path class="o-bolt" d="M300 20 l-24 46 h18 l-16 40 l40 -54 h-18 l14 -32z" fill="#ffd23f" stroke="#fff" stroke-width="3"/>';
const snow = (n = 22, small = false) => { const r = rnd(11); let s = '';
  for (let i = 0; i < n; i++) { const x = r() * 400, y = r() * 240; s += `<circle class="o-snow" cx="${x.toFixed(0)}" cy="-10" r="${(small ? 2 : 3) + r() * 3}" fill="#fff" stroke="#cfe0f2" stroke-width="1" style="${sv({ y: y.toFixed(0) + 'px', d: (-r() * 5).toFixed(2) + 's' })}"/>`; }
  return s; };
const SUN = { park: [350, 42], beach: [60, 44] };
const sun = (g) => { const [x, y] = SUN[g.place] || [350, 42]; const own = SUN[g.place] ? '' : `<circle cx="${x}" cy="${y}" r="24" fill="#ffd23f"/>`;
  const rays = Array.from({ length: 10 }, (_, i) => { const a = (i * Math.PI) / 5; return `<line x1="${(x + 32 * Math.cos(a)).toFixed(1)}" y1="${(y + 32 * Math.sin(a)).toFixed(1)}" x2="${(x + 46 * Math.cos(a)).toFixed(1)}" y2="${(y + 46 * Math.sin(a)).toFixed(1)}"/>`; }).join('');
  return `${own}<g class="o-rays" stroke="#ffb703" stroke-width="5" stroke-linecap="round">${rays}</g><path class="o-sweat" d="M${g.hx + 30} ${g.top + 22} q-6 9 0 13 q6 -4 0 -13z" fill="#7cc8ff" stroke="#fff" stroke-width="1.5"/>`; };
const wind = () => { let s = '';
  [[60, 0], [100, 0.5], [140, 1.1], [180, 0.3], [80, 1.5]].forEach(([y, d]) => { s += `<path class="o-wind" d="M-80 ${y} q30 -10 60 0 t60 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9" style="${sv({ d: d + 's' })}"/>`; });
  return s + `<text class="o-leaf" x="-30" y="120" font-size="26" ${EMOJI_FONT}>🍃</text><text class="o-leaf" x="-30" y="70" font-size="20" ${EMOJI_FONT} style="--d:1.4s">🍃</text>`; };
const stars = (n = 8, tint = true) => { const r = rnd(3); let s = tint ? '<rect class="o-tint" width="400" height="250" fill="#1d2a78" opacity=".34"/><circle cx="340" cy="48" r="20" fill="#ffe28a"/><circle cx="348" cy="42" r="18" fill="#2d346e" opacity=".9"/>' : '';
  for (let i = 0; i < n; i++) { const x = 20 + r() * 360, y = 10 + r() * 90; s += `<path class="o-star" d="M${x.toFixed(0)} ${(y - 6).toFixed(0)} l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" fill="#fff8c4" style="${sv({ d: (-r() * 2).toFixed(2) + 's' })}"/>`; }
  return s; };
const sunrise = () => '<rect class="o-warm" width="400" height="250" fill="#ff9f43" opacity=".18"/><circle class="o-rise-sun" cx="70" cy="80" r="22" fill="#ffb703" stroke="#ffe08a" stroke-width="6"/>';
const confetti = (n = 20) => { const r = rnd(5), C = ['#ff5a5f', '#ffd23f', '#3a8bff', '#2fd08a', '#9b6bff', '#ff9f1c']; let s = '';
  for (let i = 0; i < n; i++) { const x = r() * 400, y = r() * 230; s += `<rect class="o-conf" x="${x.toFixed(0)}" y="-12" width="8" height="12" rx="2" fill="${C[i % C.length]}" style="${sv({ y: y.toFixed(0) + 'px', d: (-r() * 3).toFixed(2) + 's', r: (r() * 360).toFixed(0) + 'deg' })}"/>`; }
  return s; };
const rising = (g, glyphs, fill, cls) => glyphs.map((t, i) => `<text class="o-up ${cls}" x="${(g.hx + 26 + i * 14).toFixed(0)}" y="${(g.top + 6).toFixed(0)}" font-size="${22 + i * 4}" font-weight="800" fill="${fill}" font-family="Baloo 2, Nunito, sans-serif" style="--d:${(i * 0.7).toFixed(1)}s">${t}</text>`).join('');
const heart = (x, y, s, d) => `<path class="o-up o-heart" d="M${x} ${y + 8 * s} C${x - 12 * s} ${y} ${x - 8 * s} ${y - 9 * s} ${x} ${y - 4 * s} C${x + 8 * s} ${y - 9 * s} ${x + 12 * s} ${y} ${x} ${y + 8 * s}Z" fill="#ff4d8d" stroke="#fff" stroke-width="2" style="--d:${d}s"/>`;
const hearts = (g) => heart(g.hx - 30, g.top + 10, 1.2, 0) + heart(g.hx + 34, g.top, 1, 0.8) + heart(g.hx + 4, g.top - 8, 0.9, 1.6);
const tears = (g) => { const ey = g.top + g.ht * 0.24, dx = 10 * g.k; return [-dx, dx].map((d, i) => `<path class="o-tear" d="M${(g.hx + d).toFixed(0)} ${ey.toFixed(0)} q-5 8 0 11 q5 -3 0 -11z" fill="#5fb4f2" stroke="#fff" stroke-width="1.5" style="--d:${i * 0.6}s"/>`).join(''); };
const water = (g) => { if (g.place === 'bath') return ''; const wy = g.base - g.ht * 0.34, x0 = g.x - 100, x1 = g.x + 100;
  const yb = g.base + 6;
  return `<g class="o-water"><path d="M${x0} ${wy} q25 -8 50 0 t50 0 t50 0 t50 0 Q${x1 + 14} ${wy + 4} ${x1 + 6} ${(wy + yb) / 2} Q${x1} ${yb} ${x1 - 40} ${yb} H${x0 + 40} Q${x0} ${yb} ${x0 - 6} ${(wy + yb) / 2} Q${x0 - 14} ${wy + 4} ${x0} ${wy} Z" fill="#3ea0e8" opacity=".95"/><path d="M${x0} ${wy} q25 -8 50 0 t50 0 t50 0 t50 0" stroke="#bfe6ff" stroke-width="4" fill="none"/></g>`
    + [0, 1].map((i) => `<ellipse class="o-ripple" cx="${g.x}" cy="${wy + 4}" rx="60" ry="9" fill="none" stroke="#fff" stroke-width="3" style="--d:${i * 1.1}s"/>`).join(''); };
const dust = (g) => [0, 1, 2].map((i) => `<circle class="o-dust" cx="${g.x - 34 - i * 12}" cy="${g.base - 6}" r="${8 - i}" fill="#e9d8b8" style="--d:${(i * 0.18).toFixed(2)}s"/>`).join('');
const speed = (g) => [0, 1, 2].map((i) => `<line class="o-speed" x1="${g.x - 110}" y1="${g.base - 30 - i * 26}" x2="${g.x - 70}" y2="${g.base - 30 - i * 26}" stroke="#fff" stroke-width="5" stroke-linecap="round" style="--d:${(i * 0.2).toFixed(1)}s"/>`).join('');
const ball = (g, e) => `<text class="o-ball" x="${g.x + 64}" y="${g.base - 4}" font-size="30" text-anchor="middle" ${EMOJI_FONT}>${e}</text>`;
const flyer = (e, once) => `<text class="o-fly${once ? ' once' : ''}" x="-50" y="62" font-size="40" ${EMOJI_FONT}>${e}</text>`;
const ring = (b) => `<g class="o-ring" stroke="#ff5a5f" stroke-width="4" fill="none" stroke-linecap="round"><path d="M${b.x + b.r + 8} ${b.y - 14} q10 14 0 28"/><path d="M${b.x + b.r + 18} ${b.y - 22} q16 22 0 44"/><path d="M${b.x - b.r - 8} ${b.y - 14} q-10 14 0 28"/></g>`;
const glow = (b) => `<circle class="o-glow" cx="${b.x}" cy="${b.y}" r="${b.r + 10}" fill="#ffd23f" opacity=".35"/>`;
const sparkle = (b) => [[-1, -1], [1, -0.6], [0.8, 1], [-1, 0.7]].map(([dx, dy], i) => `<path class="o-star" d="M${b.x + dx * (b.r + 14)} ${b.y + dy * (b.r + 10) - 7} l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5z" fill="#ffd23f" stroke="#fff" stroke-width="1" style="--d:${(i * 0.4).toFixed(1)}s"/>`).join('');
const dark = () => '<rect class="o-dark" width="400" height="250" fill="#0b0e2a" opacity=".62"/>';

// The effect layer for one group. b = the bubble it belongs to (for rings and glows).
function effect(grp, g, b, e, once) {
  switch (grp) {
    case 'swim': return water(g);
    case 'run': return dust(g);
    case 'ride': return speed(g);
    case 'fly': return flyer(e, once);
    case 'sing': return rising(g, ['♪', '♫', '♪'], '#7c4ddb', 'o-note');
    case 'dance': return rising(g, ['♪', '♫'], '#ff6fae', 'o-note');
    case 'sleep': return rising(g, ['z', 'Z', 'Z'], '#fff', 'o-z');
    case 'cry': return tears(g);
    case 'love': return hearts(g);
    case 'ball': return ball(g, e);
    case 'celebrate': return confetti();
    case 'cold': return snow();
    case 'hot': return sun(g);
    case 'rain': return rain();
    case 'storm': return rain() + flash();
    case 'wind': return wind();
    case 'night': return stars(8, !['bed', 'space'].includes(g.place));
    case 'sunrise': return sunrise();
    case 'ring': return ring(b);
    case 'think': return glow(b);
    case 'work': case 'laugh': return sparkle(b);
    case 'dark': return dark();
    default: return '';
  }
}

// Always-on background life for each place.
function ambient(place) {
  switch (place) {
    case 'beach': return '<path class="o-shim" d="M-100 150 Q-75 142 -50 150 T0 150 T50 150 T100 150 T150 150 T200 150 T250 150 T300 150 T350 150 T400 150 T450 150" stroke="#fff" stroke-width="3" fill="none" opacity=".75"/>';
    case 'snow': return snow(12, true);
    case 'space': case 'bed': return stars(5, false);
    case 'bath': return [110, 160, 230, 280, 200].map((x, i) => `<circle class="o-bubble" cx="${x}" cy="160" r="${6 + (i % 3) * 2}" fill="#fff" stroke="#9fd0ef" stroke-width="2" style="--d:${(i * 0.5).toFixed(1)}s"/>`).join('');
    default: return '';
  }
}

/* ---------- composing the animated SVG ---------- */
const kindOf = (o) => (!o ? null : o.duo ? 'duo' : o.prep ? 'prep' : o.pair ? 'pair' : o.crowd && o.m ? 'crowd' : o.person ? 'person' : 'single');
const inner = (svg) => svg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const labelOf = (svg) => (/aria-label="([^"]*)"/.exec(svg) || [])[1] || 'Picture';
// Tag the act bubble (ab) and feel bubble (fb) so they can move on their own.
function tagBubbles(s, o, withFeel) {
  const tags = []; if (o.act && !o.say) tags.push('ab'); if (withFeel && o.feel) tags.push('fb');
  let i = 0; return s.replace(/<g class="pop bub">/g, (m) => (i < tags.length ? `<g class="pop bub ${tags[i++]}">` : m));
}

export const canAnimate = (o) => { const k = kindOf(o); return !!k && k !== 'duo'; };

// -> { svg, two } ; two = the scene has a second beat (the feel bubble / an fx) that waits for "go".
export function animatedScene(o) {
  const kind = kindOf(o); if (!kind || kind === 'duo') return null;
  const full = ART.scene(o), label = labelOf(full);
  const place = kind === 'single' ? geo(o).place : kind === 'crowd' ? (PLACES.includes(o.place) ? o.place : 'park') : 'none';
  let layers = '', fx = '', ax = '', two = false;
  if (kind === 'single') {
    // A crossed-out bubble (✗: "can't swim") is not acted out.
    const g = geo(o), act = o.actMark && o.actMark !== '✓' ? null : groupOf(o.act);
    const feelG = o.fx || (o.feelMark && o.feelMark !== '✓' ? null : groupOf(o.feel));
    two = !!(o.feel || o.fx);
    const calm = { ...o, feel: undefined, mood: two && o.mood === 'surprised' ? 'happy' : o.mood };
    const bodyA = BODY.has(act) ? act : '';
    const bodyB = BODY.has(feelG) ? feelG : two && o.mood === 'surprised' ? '' : bodyA;
    const cls = (body, f) => [body && 'mo-' + body, act && 'a-' + act, f && 'f-' + f].filter(Boolean).join(' ');
    if (two) layers += `<g class="lA ${cls(bodyA)}">${tagBubbles(inner(ART.scene(calm)), calm, false)}</g>`;
    layers += `<g class="lB${two ? ' two' : ''} ${cls(bodyB, feelG)}">${tagBubbles(inner(full), o, true)}</g>`;
    ax = act ? effect(act, g, g.ab, o.act, false) : '';
    if (feelG && feelG !== act) fx = effect(feelG, g, o.feel ? g.fb : g.ab, o.feel || o.act, true);
  } else {
    layers = `<g class="lB">${inner(full)}</g>`;
  }
  const rel = kind === 'prep' ? ` data-rel="${o.prep.rel}"` : '';
  const svg = `<svg class="scene mo k-${kind}"${rel} viewBox="0 0 400 250" role="img" aria-label="${label}">${layers}`
    + `<g class="amb">${ambient(place)}</g><g class="ax">${ax}</g><g class="fx">${fx}</g></svg>`;
  return { svg, two };
}
