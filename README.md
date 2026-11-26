# Sentence Builders — React web app

An English speaking curriculum for young learners (Chinese children aged 5–8, 25-minute one-to-one online classes),
plus a Speaking Coach for adults. Version 1 runs fully in the browser and saves progress in localStorage.

The full plan (goal, approach, screens, look and feel, data model, phases) is in the
**Sentence Builders — React Web App Plan** doc: https://claude.ai/artifact/ULtn89ZN1ZV1FPZnoxMRZh
The teaching method and curriculum map are in the **Teacher's Handbook**: https://claude.ai/artifact/Q5jN2EnAKawyxcMEcWNpqq

## Run it

```bash
npm install
npm run dev        # opens http://localhost:5173
npm run build      # static site in dist/
```

Needs Node 18 or newer. Use Chrome or Edge for the best voices.

## What works now (Phases 0 and 2)

- App shell, students, backup export/import, Today, course plan, teacher guide (Phase 0)
- **Every lesson, story and Daily English topic is playable**: Teach the pattern, Look and say (tap to peek from A2),
  Build the sentence, Silly Sentence Machine, Speak, Stretch it; stories with a narrated karaoke player, Put it in order,
  Tell the story; Daily English words, Find the picture, phrases, What would you say?, role-play, Swap the word
- Big star / small star / try again after each answer; feedback card (strength, to improve, tip) with copy for parents
- The course plan's class player runs the real activities and saves stars, stickers and plan progress
- Animals drawn as original SVG characters: cat, dog, bear, panda, rabbit, monkey, frog, elephant, lion, penguin.
  They appear in the generated sentences, plus a new **At the zoo** Daily English topic
- English Quest and Speaking Coach: content ported, screens arrive in Phases 5 and 8

## Tests

```bash
npm run build && npm run test:play   # plays every lesson, story, topic and the A1 course plan in Chrome/Edge
```

The play test uses the Edge already installed (`BROWSER=chrome` for Chrome); no browser download is needed.

## Folder map

```
src/
  app/        App.jsx (routes), Layout.jsx (sidebar + top bar)
  pages/      one file per screen
  activities/ one component per activity, Runner.jsx runs a session
  engine/     lesson.js (items, feedback), banks.js (word banks, generators), coursePlan.js (next class, review topic), roles.jsx (sentence-part colours, <Blocks>)
  art/        Scene.jsx (SVG scenes; Phase 2 turns art into React components)
  audio/      speech.js (say, narrate with word timing), sfx.js (WebAudio tones)
  store/      useStore.js (Zustand + localStorage), backup.js, migrations.js
  content/    *.legacy.js = the artifacts' data, ported unchanged; index.js exports it
  styles/     tokens.css (colours, fonts), base.css
reference/    the three original artifacts (HTML + content) to port activities from
```

## Phases

| Phase | Ships |
| --- | --- |
| 0 Setup | This starter: shell, students, storage, course plan, content and art ported ✅ |
| 1 Shell and students | Settings, student switcher polish, backup reminders, Chinese strings |
| 2 Lessons ✅ | Lesson engine and activities (Teach, Look and say, Build, Silly, Stretch, Speak), feedback, stickers; art as React components |
| 3 Stories and Daily English | Animated story player with karaoke, ordering, retell; Daily English's 7 activities |
| 4 Course plan and Teacher guide | Class player runs real activities; handbook in the app |
| 5 English Quest | Placement and level check games; results saved |
| 6 Teacher materials and progress | Lesson plans per class, unit speaking checks, progress page, printable parent report |
| 7 Daily English by level | A2 and B1 versions of every topic |
| 8 Speaking Coach and AI | Coach ported; AI corrections through a small AWS Lambda server (never call the AI from the browser) |
| 9 Polish and pilot | PWA install and offline, accessibility, cross-browser, 2-week teacher pilot |
