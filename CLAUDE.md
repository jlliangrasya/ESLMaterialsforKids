# Notes for Claude Code

This repo is the React version of three Claude artifacts: Sentence Builders (children's speaking curriculum),
English Quest (placement game) and Speaking Coach (adult AI assessment). Read README.md and the plan doc first.

## Rules
- Users are teachers of Chinese children aged 5–8 in 25-minute 1-on-1 online classes. Keep steps short and visual.
- Teaching approach: phrases first, one colour per sentence part (see src/styles/tokens.css and src/engine/roles.jsx),
  picture first with tap-to-peek, swap the word, topics return at each level, big star = alone / small star = with help.
- Every English instruction, label, rule, tip and feedback line has a Simplified Chinese version shown under it.
- Always light theme. White text only on the darker part colours. Respect prefers-reduced-motion.
- Only original SVG characters; no copyrighted characters.
- Storage is localStorage only (key `sb.app.v1`, Zustand persist). When the saved shape changes, bump VERSION and
  add a step in src/store/migrations.js. Never lose a teacher's data.
- No API keys or AI calls in the browser. AI correction (Speaking Coach) goes through a server in Phase 8.

## Porting activities
- The working behaviour of every activity is in reference/sentence-builders/index.html (search for `DBODY`,
  `render`, `bind`, `G={` for generators, `feedback=` for the feedback logic). Port them into src/activities/
  as React components, one per activity, sharing src/engine for logic.
- Content stays in src/content/*.legacy.js until Phase 2 splits it into plain modules.

## Checks before a phase is done
- `npm run build` passes; a Playwright script plays every lesson, story and topic to the end with no errors.
