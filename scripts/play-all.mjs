// Plays every lesson, story and Daily English topic to the end in a real browser, plus the A1 course plan.
// Fails on any page error, console error or stuck screen. Run after `npm run build`:  npm run test:play
// Uses the Edge or Chrome already installed (no browser download). Set BROWSER=chrome to use Chrome.
import { spawn, spawnSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import SB from '../src/content/data.legacy.js';
import DAILY from '../src/content/daily.legacy.js';
import CURRIC from '../src/content/curriculum.legacy.js';

const PORT = 4317, BASE = `http://localhost:${PORT}`, WORKERS = 6;
const server = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe', shell: process.platform === 'win32' });
const ready = new Promise((res, rej) => { server.stdout.on('data', (d) => /localhost/.test(String(d)) && res()); server.on('exit', (c) => rej(new Error('preview exited ' + c))); setTimeout(() => rej(new Error('preview timeout')), 30000); });

// One step of "playing like a teacher": solve the current activity, or give a star, or press Next.
const step = () => {
  const q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  const click = (el) => { el.click(); return true; };
  if (q('.trophy')) return 'done';
  const yes = q('.marks .yes'); if (yes) return yes.disabled ? 'wait' : click(yes) && 'star';
  const tile = q('.tile[data-tile]:not(.used)');
  if (tile) { const filled = qa('.sent .ch:not(.slot)').length; const t = q(`.tile[data-tile="${filled}"]:not(.used)`); return t ? click(t) && 'build' : 'wait'; }
  const right = q('[data-right="1"]:not([disabled])'); if (right) return click(right) && 'pick';
  const order = qa('[data-o]:not(.used)'); if (order.length) { const got = qa('.oslot.f').length; const o = q(`[data-o="${got}"]`); return o ? click(o) && 'order' : 'wait'; }
  const sw = q('[data-sw]:not(.picked)'); if (sw) return click(sw) && 'swap';
  const spin = q('[data-spin]'); if (spin) return spin.disabled ? 'wait' : click(spin) && 'spin';
  const stretch = q('.play .tiles .tile'); if (stretch) return click(stretch) && 'stretch';
  const next = q('[data-next]'); if (next) return click(next) && 'next';
  return 'wait';
};

async function playTo(page, path, label) {
  await page.goto(BASE + path);
  await page.waitForSelector('.play');
  let waits = 0, steps = 0;
  for (;;) {
    const r = await page.evaluate(step);
    if (r === 'done') return steps;
    if (r === 'wait') { if (++waits > 120) throw new Error(`${label}: stuck (${await page.evaluate(() => document.querySelector('.act')?.textContent)})`); await page.waitForTimeout(150); continue; }
    waits = 0; steps++; if (steps > 400) throw new Error(`${label}: too many steps`);
    await page.waitForTimeout(r === 'star' ? 1250 : r === 'spin' ? 2600 : 120);
  }
}

const jobs = [];
for (const L of SB.levels) L.lessons.forEach((l, i) => jobs.push([`/play/lesson/${L.id}/${i}`, `${L.id} lesson ${i + 1} ${l.n}`]));
for (const [lv, list] of Object.entries(SB.stories)) list.forEach((s, i) => jobs.push([`/play/story/${lv}/${i}`, `${lv} story ${i + 1} ${s.t}`]));
for (const t of DAILY) jobs.push([`/play/daily/${t.id}`, `daily ${t.id}`]);
const a1 = CURRIC.sequence('A1').filter((c) => c.type !== 'check');

const seed = { state: { settings: { zh: true, voiceRate: 0.85, sounds: true, sidebar: true }, currentStudentId: 'stu_test', lastBackup: null, viewLevel: 'A1',
  students: { stu_test: { name: 'Mia', level: 'A1', ageGroup: '5-6', createdAt: '2026-11-26', notes: '', lessons: {}, daily: {}, stories: {}, plan: {}, stickers: [], assessments: [] } } }, version: 1 };

let failed = 0;
try {
  await ready;
  const browser = await chromium.launch({ channel: process.env.BROWSER === 'chrome' ? 'chrome' : 'msedge', headless: true });
  const t0 = Date.now();
  const worker = async (queue, w) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((s) => { if (!localStorage.getItem('sb.app.v1')) localStorage.setItem('sb.app.v1', JSON.stringify(s)); }, seed);
    const page = await ctx.newPage(), errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    while (queue.length) {
      const [path, label] = queue.shift();
      try {
        const n = await playTo(page, path, label);
        if (errs.length) throw new Error(errs.splice(0).join(' | '));
        console.log(`  ok  ${label} (${n} steps)`);
      } catch (e) { failed++; console.log(`  FAIL ${label}: ${e.message}`); errs.length = 0; }
    }
    return { ctx, page };
  };
  const queue = [...jobs];
  const pages = await Promise.all(Array.from({ length: WORKERS }, (_, w) => worker(queue, w)));

  // Course plan: play every A1 class in order in one browser, then check the plan was saved.
  const { page } = pages[0];
  for (const c of a1) {
    try { await playTo(page, `/class/A1/${c.n}`, `A1 class ${c.n}`); console.log(`  ok  A1 class ${c.n}`); } catch (e) { failed++; console.log(`  FAIL A1 class ${c.n}: ${e.message}`); }
  }
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('sb.app.v1')).state.students.stu_test);
  const planDone = Object.keys(saved.plan.A1 || {}).length;
  console.log(`\nSaved for Mia (this browser): ${Object.keys(saved.lessons).length} lessons, ${Object.keys(saved.stories).length} stories, ${Object.keys(saved.daily).length} topics, ${saved.stickers.length} stickers, ${planDone}/${a1.length} A1 classes`);
  if (planDone !== a1.length) { failed++; console.log('  FAIL course plan did not save every class'); }
  console.log(`${jobs.length + a1.length} sessions in ${Math.round((Date.now() - t0) / 1000)}s — ${failed ? failed + ' FAILED' : 'all passed'}`);
  await browser.close();
} catch (e) { failed++; console.error(e); }
if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F']); else server.kill();
process.exit(failed ? 1 : 0);
