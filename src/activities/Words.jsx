// New words: tap each picture card to hear the word.
import { useEffect, useRef, useState } from 'react';
import * as sfx from '../audio/sfx.js';
import { Hint, say } from './shared.jsx';

export default function Words({ x, ctx }) {
  const [heard, setHeard] = useState(x.heard), T = useRef([]);
  useEffect(() => () => T.current.forEach(clearTimeout), []);
  const hear = (k) => { if (!x.heard.includes(k)) x.heard.push(k); setHeard([...x.heard]); sfx.click(); say(x.t.words[k][1], 0.8); };
  const sayAll = () => { T.current.forEach(clearTimeout); T.current = x.t.words.map((w, k) => setTimeout(() => hear(k), k * 1400)); };
  return (
    <>
      <h3 className="tt">New words <span className="zh" style={{ display: 'inline' }}>新单词</span></h3>
      <div className="wgrid">{x.t.words.map((w, k) => <button key={k} className={'wcard' + (heard.includes(k) ? ' on' : '')} onClick={() => hear(k)}><i>{w[0]}</i><b>{w[1]}</b><span className="zh">{w[2]}</span></button>)}</div>
      <Hint en="Tap each picture, listen and say the word!" zh="点图片，听一听，说一说！" />
      <div className="row"><button className="ghost" onClick={sayAll}>🔊 Say them all<span className="zh">全部读一遍</span></button><button className="go" data-next onClick={ctx.next}>I know them! →<span className="zh">我都会了！</span></button></div>
    </>
  );
}
