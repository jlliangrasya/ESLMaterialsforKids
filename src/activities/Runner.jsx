// Runs one session (lesson, story or Daily English topic): one activity at a time, stars, then feedback.
// Items are plain objects that activities update in place (x.done, x.mist…), then call ctx.update() to redraw —
// the same model as the artifact, so the port stays faithful.
import { useEffect, useReducer, useRef, useState } from 'react';
import { ACT, curText, feedback } from '../engine/lesson.js';
import * as sfx from '../audio/sfx.js';
import { StarFx, Star, say } from './shared.jsx';
import Teach from './Teach.jsx';
import Learn from './Learn.jsx';
import Build from './Build.jsx';
import Silly from './Silly.jsx';
import Speak from './Speak.jsx';
import Stretch from './Stretch.jsx';
import Watch from './Watch.jsx';
import Order from './Order.jsx';
import StoryTell, { LearnStory } from './StoryTell.jsx';
import Words from './Words.jsx';
import Find from './Find.jsx';
import Phrase from './Phrase.jsx';
import What from './What.jsx';
import Role from './Role.jsx';
import Swap from './Swap.jsx';

const ACTIVITY = { teach: Teach, learn: Learn, build: Build, count: Build, silly: Silly, speak: Speak, stretch: Stretch, watch: Watch, order: Order, story: StoryTell, learnStory: LearnStory, words: Words, find: Find, phrase: Phrase, what: What, role: Role, swap: Swap };

export default function Runner({ session, name, planBar, title, onFinish, doneActions, onExit }) {
  const { l, items } = session;
  const [i, setI] = useState(0), [, update] = useReducer((n) => n + 1, 0);
  const [fx, setFx] = useState(0), [busy, setBusy] = useState(false), [toast, setToast] = useState(null);
  const rec = useRef([]), timers = useRef([]), finished = useRef(null);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => { timers.current.forEach(clearTimeout); try { speechSynthesis.cancel(); } catch { /* none */ } }, []);
  useEffect(() => { window.scrollTo?.(0, 0); try { speechSynthesis.cancel(); } catch { /* none */ } }, [i]);

  const x = items[i];
  const next = () => { setBusy(false); setI((n) => n + 1); };
  const score = (item, s) => {
    rec.current[i] = { k: item.k, s, mist: item.mist || {}, help: !!item.reveal || !!(item.rv && item.rv.length) };
    s === 2 ? sfx.bigStar() : sfx.smallStar(); setFx(s); later(() => setFx(0), s === 2 ? 1400 : 1100);
  };
  const ctx = {
    l, name, busy, update, next, score,
    mark: (item, s) => { if (busy) return; setBusy(true); score(item, s); later(next, 1150); },
    again: (item) => { say(curText(item), 0.7); item.again = (item.again || 0) + 1; setToast(['Listen again, then try once more!', '再听一遍，再试一次！']); later(() => setToast(null), 4000); },
  };

  // Finished: work out the feedback once and hand it to the page to save.
  if (!x && !finished.current) finished.current = feedback(rec.current, l, name);
  useEffect(() => { if (!x && finished.current) { onFinish && onFinish(finished.current); later(sfx.bigStar, 200); later(sfx.bigStar, 700); } }, [x]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!x) return <div className="card play"><Done f={finished.current} l={l} name={name} actions={doneActions} /></div>;

  const A = ACTIVITY[x.k], AC = x.convo ? ACT.convo : ACT[x.k];
  return (
    <div className="card play">
      {planBar}
      <div className="top">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {onExit && <button className="mapbtn" onClick={onExit}>← Back</button>}
          <h2>{title}</h2>
        </div>
        <div className="dots" aria-label={`Activity ${i + 1} of ${items.length}`}>
          {items.map((_, j) => { const r = rec.current[j]; return <span key={j} className={'dot' + (r && r.s === 2 ? ' y' : r && r.s === 1 ? ' m' : !r && j < i ? ' seen' : '') + (j === i ? ' cur' : '')} />; })}
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <span className="act">{AC[0]} {AC[1]} <span className="zh" style={{ display: 'inline' }}>· {AC[2]}</span></span> <span className="gram">{l.grammar}</span>
      </div>
      {i === 0 && (
        <details className="teach"><summary>Teacher tip 👩‍🏫 <span className="zh" style={{ display: 'inline' }}>教师提示</span></summary>{l.tip}<span className="zh">{l.tipZh}</span>
          <div style={{ marginTop: 6 }}><b>Grammar:</b> {l.rule}<span className="zh">{l.ruleZh}</span></div></details>
      )}
      <A key={i} x={x} ctx={ctx} />
      <StarFx k={fx} />
      {toast && <div className="toast" role="status">{toast[0]}<span className="zh" style={{ color: '#dfe6f5' }}>{toast[1]}</span></div>}
    </div>
  );
}

function Done({ f, l, name, actions }) {
  const [copied, setCopied] = useState(null);
  const who = name || 'you', daily = l.kind === 'daily', story = l.kind === 'story';
  const head = daily ? [`Great talking! ${l.t.icon}`, '说得真好！'] : story ? ['Story finished! 📺', '故事讲完了！'] : ['Lesson complete! 🎉', '课程完成！'];
  const tip = daily ? [l.tip, l.tipZh] : [l.rule, l.ruleZh];
  const what = daily ? `Daily English: ${l.n}` : story ? `Story: ${l.n}` : `Sentence Builders ${l.lv} Lesson ${l.idx + 1}: ${l.n}`;
  const phrases = daily ? l.t.ph.map((p) => [p[0].replace(/\{name\}/g, name || 'Leo'), p[1].replace(/\{name\}/g, name || 'Leo')]) : [];
  const parent = `${name || 'Student'} – ${what} (${new Date().toLocaleDateString()})\nStars: ${f.big} big + ${f.small} small\nStrength: ${f.strength}\nTo improve: ${f.improve}\nTip: ${tip[0]}` + (phrases.length ? `\nPractise these at home:\n${phrases.map((p) => `• ${p[0]}  (${p[1]})`).join('\n')}` : '');
  const copy = () => navigator.clipboard?.writeText(parent).then(() => setCopied(['Copied!', '已复制']), () => setCopied(['Copy was blocked — select the text instead.', '无法复制，请手动选择文字。']));
  return (
    <div className="trophy">
      <h2 style={{ fontSize: 'clamp(32px,5vw,48px)' }}>{head[0]}</h2><div className="zh" style={{ fontSize: 18 }}>{head[1]}</div>
      {l.kind === 'lesson' && <div style={{ margin: '12px 0' }}><div className="bigstk">{l.sticker}</div><div style={{ font: "800 22px 'Baloo 2'" }}>A sticker for your book!<span className="zh">贴纸本里多了一张贴纸！</span></div></div>}
      <div className="coll">{Array.from({ length: f.big }, (_, k) => <Star key={'b' + k} size={48} />)}{Array.from({ length: f.small }, (_, k) => <Star key={'s' + k} size={28} />)}</div>
      <p style={{ fontWeight: 800, fontSize: 20, margin: '8px 0 0' }}>{f.big} big star{f.big === 1 ? '' : 's'} + {f.small} small star{f.small === 1 ? '' : 's'}<span className="zh">{f.big} 颗大星星 + {f.small} 颗小星星</span></p>
      <div className="actsum">{f.acts.map((a) => <span key={a}>{a}</span>)}</div>
      <div className="fbbox">
        <h3>Feedback for {who} <span className="zh" style={{ display: 'inline', fontSize: 16 }}>反馈</span></h3>
        <div className="fbg">
          <div><b>💪 Strength</b><p>{f.strength}<span className="zh">{f.strengthZ}</span></p></div>
          <div><b>🎯 To improve</b><p>{f.improve}<span className="zh">{f.improveZ}</span></p></div>
          <div><b>💡 Tip</b><p>{tip[0]}<span className="zh">{tip[1]}</span></p></div>
        </div>
        {phrases.length > 0 && <><h3 style={{ marginTop: 14, fontSize: 18 }}>🏠 Practise these at home <span className="zh" style={{ display: 'inline' }}>在家练习</span></h3><ul className="homelist">{phrases.map((p) => <li key={p[0]}>{p[0]}<span className="zh">{p[1]}</span></li>)}</ul></>}
        <div className="row" style={{ justifyContent: 'flex-start' }}>
          <button className="ghost" onClick={copy}>Copy feedback for parents<span className="zh">复制给家长的反馈</span></button>
          <button className="ghost" onClick={() => say(`${f.strength} ${f.improve} ${tip[0]}`, 0.85)}>🔊 Read aloud<span className="zh">朗读</span></button>
          {copied && <span className="muted">{copied[0]} <span className="zh" style={{ display: 'inline' }}>{copied[1]}</span></span>}
        </div>
      </div>
      <div className="row">{actions}</div>
    </div>
  );
}
