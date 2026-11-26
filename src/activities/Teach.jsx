// Step 1 of every lesson: show today's pattern, then build the model sentence block by block with the voice.
import { useEffect, useState, useCallback } from 'react';
import { ROLE } from '../engine/roles.jsx';
import { Q, sentence, storyWords } from '../engine/lesson.js';
import { cap } from '../engine/banks.js';
import * as sfx from '../audio/sfx.js';
import { Art, Chunks, Hint, say } from './shared.jsx';

export default function Teach({ x, ctx }) {
  return x.it ? <TeachPattern x={x} ctx={ctx} /> : <TeachStory x={x} ctx={ctx} />;
}

function TeachPattern({ x, ctx }) {
  const it = x.it, l = ctx.l;
  const [shown, setShown] = useState(0), [run, setRun] = useState(1);
  const qs = [...new Set(it.c.map((r) => r[0]).filter((r) => r !== 'link' && r !== 'link2'))];
  const showMe = useCallback(() => { setShown(0); setRun((r) => r + 1); }, []);
  useEffect(() => {
    const T = it.c.map((c, j) => setTimeout(() => { setShown(j + 1); sfx.click(); say(cap(c[1]), 0.8); }, 700 + j * 1300));
    T.push(setTimeout(() => say(sentence(it), 0.8), 700 + it.c.length * 1300 + 300));
    return () => T.forEach(clearTimeout);
  }, [run, it]);
  return (
    <>
      <h3 className="tt">Today's pattern <span className="zh" style={{ display: 'inline' }}>今天的句型</span></h3>
      <div className="pattern">
        {it.c.map(([r], i) => { const R = ROLE[r] || ROLE.link; return <span key={i} style={{ display: 'contents' }}>{i > 0 && <span className="plus">+</span>}<span className="pb" style={{ '--c': R[2] }}>{R[0]}<small>{R[1]}</small></span></span>; })}
      </div>
      <Art it={it} />
      <Chunks it={it} hideFrom={shown} fly />
      {it.mean && <div className="mean">{it.mean}</div>}
      <div className="rulebox">📘 {l.rule}<span className="zh">{l.ruleZh}</span></div>
      <div className="asks">👩‍🏫 Ask: {qs.map((r) => <span key={r} style={{ '--c': (ROLE[r] || ROLE.link)[2] }}>{(Q[r] || Q.link)[0]}<span className="zh" style={{ display: 'inline' }}> {(Q[r] || Q.link)[1]}</span></span>)}</div>
      <div className="row"><button className="ghost" onClick={showMe}>▶ Show me again<span className="zh">再看一遍</span></button><button className="go" data-next onClick={ctx.next}>Let's practise →<span className="zh">开始练习</span></button></div>
    </>
  );
}

function TeachStory({ x, ctx }) {
  const w = storyWords(x.sto), l = ctx.l;
  return (
    <>
      <h3 className="tt">Story words <span className="zh" style={{ display: 'inline' }}>讲故事用的词</span></h3>
      {w.length > 0 && <div className="seqw">{w.map((t, i) => <span key={t} style={{ display: 'contents' }}>{i > 0 && <em>→</em>}<span>{t}</span></span>)}</div>}
      <div className="rulebox">📘 {l.rule}<span className="zh">{l.ruleZh}</span></div>
      <div className="asks">👩‍🏫 Ask: {[['What happened first?', '先发生了什么？'], ['And then?', '然后呢？'], ['How did they feel?', '他们感觉怎么样？'], ['What happened in the end?', '最后发生了什么？']].map(([q, z]) => <span key={q} style={{ '--c': 'var(--why)' }}>{q}<span className="zh" style={{ display: 'inline' }}> {z}</span></span>)}</div>
      <Hint en="Watch the story, put the pictures in order, then tell it yourself!" zh="看故事、排顺序、再自己讲！" />
      <div className="row"><button className="go" data-next onClick={ctx.next}>Watch the story →<span className="zh">看故事</span></button></div>
    </>
  );
}
