// Watch the story (or the Daily English conversation) before working with it.
import { useState } from 'react';
import StoryPlayer from './StoryPlayer.jsx';
import { Hint } from './shared.jsx';

export default function Watch({ x, ctx }) {
  const [seen, setSeen] = useState(!!x.seen);
  const label = seen ? (x.convo ? ['Next: what would you say? →', '下一步：你会怎么说？'] : ['Next: put it in order →', '下一步：排顺序']) : ['Skip →', '跳过'];
  return (
    <>
      <h3 className="tt">{x.sto.t}</h3>
      <StoryPlayer sto={x.sto} onEnd={() => { x.seen = 1; setSeen(true); }} />
      <Hint en="Watch and listen. Read along with the yellow word!" zh="看一看，听一听，跟着黄色的词读！" />
      <div className="row"><button className="go" data-next onClick={ctx.next}>{label[0]}<span className="zh">{label[1]}</span></button></div>
    </>
  );
}
