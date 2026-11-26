// Sentence parts: label, Chinese, colour. One colour per part, everywhere in the app.
export const ROLE = {
  who: ['Who?', '谁？', 'var(--who)'], who2: ['Who?', '谁？', 'var(--who)'], doing: ['Doing?', '在做什么？', 'var(--doing)'],
  what: ['What?', '什么？', 'var(--what)'], where: ['Where?', '在哪里？', 'var(--where)'], why: ['Why?', '为什么？', 'var(--why)'],
  when: ['When?', '什么时候？', 'var(--when)'], link: ['Joining word', '连接词', 'var(--link)'], link2: ['Joining word', '连接词', 'var(--link)'],
  event: ['What happened?', '发生了什么？', '#0c8599'], will: ['Helper word', '助词', '#c2255c'], cond: ['The situation', '情况', '#a5651c'],
  result: ['The result', '结果', '#1b8a4a'], can: ['Can', '会', '#1e9e50'], cant: ["Can't", '不会', '#e03131'], answer: ['Answer', '回答', 'var(--answer)'],
  size: ['How big?', '多大？', 'var(--size)'], colour: ['What colour?', '什么颜色？', 'var(--colour)'], num: ['How many?', '几个？', 'var(--num)'], desc: ['Describe', '描述', '#d6336c'],
};

export function Blocks({ chunks }) {
  return (
    <div className="sent">
      {chunks.map(([role, text], i) => { const R = ROLE[role] || ROLE.link; return (
        <span key={i} className="ch" style={{ '--c': R[2] }}><b>{i === 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text}</b><small>{R[0]} <span className="zh" style={{ display: 'inline' }}>{R[1]}</span></small></span>
      ); })}
    </div>
  );
}
