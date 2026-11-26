// Useful phrases: hear a whole phrase and say it like a real conversation.
import { useEffect } from 'react';
import Scene from '../art/Scene.jsx';
import { meScene } from '../engine/lesson.js';
import { MarkRow, Hint, say } from './shared.jsx';

export default function Phrase({ x, ctx }) {
  const [, , act, mood, place] = x.p;
  useEffect(() => { if (x.said) return; x.said = 1; const t = setTimeout(() => say(x.text, 0.85), 600); return () => clearTimeout(t); }, [x]);
  return (
    <>
      <Scene spec={meScene(x.t, act, mood, place)} />
      <div className="sent"><span className="ch phr" style={{ '--c': '#7c4ddb' }}><b>{x.text}</b><small>Useful phrase <span className="zh" style={{ display: 'inline' }}>常用语</span></small></span></div>
      <div className="mean zh" style={{ display: 'block' }}>{x.zh}</div>
      <Hint en="Listen, then say it like a real conversation!" zh="听一听，像真的对话一样说出来！" />
      <div className="row"><button className="go" onClick={() => say(x.text, 0.85)}>🔊 Listen<span className="zh">听一听</span></button><button className="ghost" onClick={() => say(x.text, 0.6)}>🐢 Slowly<span className="zh">慢一点</span></button></div>
      <MarkRow ctx={ctx} x={x} />
    </>
  );
}
