/* Curriculum map: the single source for the app's Course plan and the Teacher's Handbook.
   Core levels (A1, A2, B1): 10 units × 2 classes (A = Lessons, B = Daily English) + 3 story classes + level check = 24 classes.
   Extension levels (B2, C1, C2): 10 lessons + 3 stories + check = 14 classes.
   lesson = Sentence Builders lesson number in that level (1–10). daily = Daily English topic id, or "review". */
window.CURRIC={
core:["A1","A2","B1"],
units:{
 A1:[
  {lesson:9,daily:"play",can:"I can show and name my things, and say my name.",canZh:"我会介绍自己的东西，说出我的名字。",target:"This is my ball. My name is…"},
  {lesson:7,daily:"school",can:"I can say what I have and ask to borrow things.",canZh:"我会说我有什么，会借东西。",target:"I have a pencil. Can I borrow a ruler?"},
  {lesson:3,daily:"morning",can:"I can describe things by size and colour.",canZh:"我会用大小和颜色描述东西。",target:"Where is my red hat? I have a big bag."},
  {lesson:4,daily:"shop",can:"I can count things and ask how much they cost.",canZh:"我会数东西，会问价格。",target:"I want three apples, please. How much is it?"},
  {lesson:5,daily:"meal",can:"I can say what I like and don't like, and ask for food.",canZh:"我会说喜欢和不喜欢，会要食物。",target:"I like noodles. I don't like carrots."},
  {lesson:8,daily:"sick",can:"I can say how I feel and what hurts.",canZh:"我会说我的感受和哪里疼。",target:"I am sad. My head hurts."},
  {lesson:1,daily:"bed",can:"I can say what someone is doing.",canZh:"我会说某人正在做什么。",target:"I'm sleepy. Grandma is reading."},
  {lesson:2,daily:"weekend",can:"I can say who is doing what.",canZh:"我会说谁在做什么事。",target:"Mum is cooking noodles. I went to the park."},
  {lesson:6,daily:"review",can:"I can say where things are.",canZh:"我会说东西在哪里。",target:"My teddy is on the bed. Where is my bag?"},
  {lesson:10,daily:"review",can:"I can ask and answer yes / no questions.",canZh:"我会问和回答是非问题。",target:"Is it a cat? Yes, it is!"}],
 A2:[
  {lesson:1,daily:"play",can:"I can say where people are and what they are doing.",canZh:"我会说人们在哪里、在做什么。",target:"We are playing on the slide in the park."},
  {lesson:7,daily:"shop",can:"I can say what there is in a place.",canZh:"我会说一个地方有什么。",target:"There are cookies on the shelf. There is a big bag."},
  {lesson:8,daily:"morning",can:"I can talk about my daily routine.",canZh:"我会说自己每天的习惯。",target:"I brush my teeth every morning."},
  {lesson:4,daily:"school",can:"I can say what I can and can't do, and ask for permission.",canZh:"我会说会做和不会做的事，会请求允许。",target:"Can I go to the toilet? I can't find my pencil."},
  {lesson:10,daily:"meal",can:"I can ask a friend questions and answer them.",canZh:"我会问朋友问题，也会回答。",target:"Do you like rice? Yes, I do! Can you use chopsticks?"},
  {lesson:9,daily:"bed",can:"I can join two ideas with and or but.",canZh:"我会用 and 或 but 连接两个想法。",target:"I'm tired, but I want to play."},
  {lesson:5,daily:"review",can:"I can compare two things.",canZh:"我会比较两样东西。",target:"My bag is bigger than your bag."},
  {lesson:3,daily:"weekend",can:"I can say what I did yesterday or at the weekend.",canZh:"我会说昨天或周末做了什么。",target:"Yesterday, I visited my grandma."},
  {lesson:2,daily:"sick",can:"I can give a reason with because.",canZh:"我会用 because 说原因。",target:"I'm in bed because I have a cold."},
  {lesson:6,daily:"review",can:"I can tell what happened in order.",canZh:"我会按顺序说发生了什么。",target:"First I woke up, then I ate breakfast, finally I went to school."}],
 B1:[
  {lesson:4,daily:"play",can:"I can describe what a person looks like and what they are wearing.",canZh:"我会描述一个人的样子和穿着。",target:"My friend has short hair and she is wearing a red dress."},
  {lesson:8,daily:"shop",can:"I can say which is the best, the biggest or the cheapest.",canZh:"我会说哪个最好、最大、最便宜。",target:"This is the cheapest ball in the shop."},
  {lesson:7,daily:"weekend",can:"I can talk about things I have and haven't done.",canZh:"我会说做过和没做过的事。",target:"Have you ever been to the zoo? I have been twice."},
  {lesson:9,daily:"sick",can:"I can give advice.",canZh:"我会给别人建议。",target:"You should drink some water and rest."},
  {lesson:10,daily:"meal",can:"I can explain problems with too and enough.",canZh:"我会用 too 和 enough 说问题。",target:"The soup is too hot. I'm not hungry enough."},
  {lesson:2,daily:"morning",can:"I can say what is going to happen.",canZh:"我会说将要发生什么。",target:"Hurry! We're going to be late!"},
  {lesson:3,daily:"bed",can:"I can say what will happen if…",canZh:"我会说“如果……就会……”。",target:"If I go to bed late, I will be tired."},
  {lesson:1,daily:"school",can:"I can say what was happening when something else happened.",canZh:"我会说一件事发生时另一件事正在进行。",target:"I was reading when the bell rang."},
  {lesson:5,daily:"review",can:"I can give my opinion and a reason.",canZh:"我会说自己的看法和理由。",target:"I think the park is better than the shop because…"},
  {lesson:6,daily:"review",can:"I can tell a story in the past.",canZh:"我会用过去时讲故事。",target:"Last weekend, we went to the beach. After that…"}],
 B2:[
  {lesson:1,can:"I can say which one I mean with who / that."},{lesson:2,can:"I can say what was done, using the passive."},
  {lesson:3,can:"I can imagine: If I were…, I would…"},{lesson:4,can:"I can compare two things with whereas."},
  {lesson:5,can:"I can make guesses with must / might / can't."},{lesson:6,can:"I can tell a story with feelings."},
  {lesson:7,can:"I can make wishes."},{lesson:8,can:"I can say what used to be true."},
  {lesson:9,can:"I can talk about what I enjoy and am good at."},{lesson:10,can:"I can say how long something has been happening."}],
 C1:[
  {lesson:1,can:"I can contrast ideas with although."},{lesson:2,can:"I can explain causes and results."},
  {lesson:3,can:"I can describe vividly with strong words."},{lesson:4,can:"I can guess about the past with must have / might have."},
  {lesson:5,can:"I can report what someone said."},{lesson:6,can:"I can tell a story with openers and dialogue."},
  {lesson:7,can:"I can set conditions with unless / as long as."},{lesson:8,can:"I can talk about regrets with should have."},
  {lesson:9,can:"I can start a sentence with an -ing or -ed phrase."},{lesson:10,can:"I can contrast with despite / in spite of."}],
 C2:[
  {lesson:1,can:"I can imagine a different past (third conditional)."},{lesson:2,can:"I can add emphasis with Not only… but also."},
  {lesson:3,can:"I can understand and use common idioms."},{lesson:4,can:"I can persuade someone with reasons."},
  {lesson:5,can:"I can describe mixed feelings precisely."},{lesson:6,can:"I can tell an epic story with advanced openers."},
  {lesson:7,can:"I can emphasise with What… was / It was… that."},{lesson:8,can:"I can link a past action to a present result."},
  {lesson:9,can:"I can report beliefs formally: It is said that…"},{lesson:10,can:"I can use common phrasal verbs."}]
}};
/* The class-by-class sequence for a level: [{n, type:"A"|"B"|"story"|"check"|"lesson", unit, ...}] */
window.CURRIC.sequence=lv=>{const C=window.CURRIC,U=C.units[lv],core=C.core.includes(lv),out=[];let n=0;
 const story=i=>out.push({n:++n,type:"story",story:i});
 U.forEach((u,i)=>{const unit=i+1;
  if(core){out.push({n:++n,type:"A",unit,...u});out.push({n:++n,type:"B",unit,...u})}
  else out.push({n:++n,type:"lesson",unit,...u});
  if(unit==3)story(0);if(unit==6)story(1);if(unit==9)story(2)});
 out.push({n:++n,type:"check"});return out};
