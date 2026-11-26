import { ART } from '../content/index.js';
import AnimScene, { hasAnim } from './AnimScene.jsx';
import { useStore } from '../store/useStore.js';

// Draws one SVG scene from a scene spec (the same specs the artifact uses), e.g.
// <Scene spec={{ who: 'cat', act: '😴', place: 'bed', mood: 'tired' }} />
// For now it renders the ported string builder. Phase 2 replaces it with React components
// (<Character>, <Bubble>, <Place>, <PrepScene>, <DuoScene>) with the same props.
// The content is our own static data, so injecting the SVG string is safe here.
// animate: show the moving version (AnimScene) when the teacher has "Moving pictures" on. Thumbnails and
// cards leave it off. `it` (the practice item) lets the scene time its action to the voice.
export default function Scene({ spec, shape, it, animate = false }) {
  const motion = useStore((s) => s.settings.motion !== false);
  if (animate && motion && !shape && hasAnim(spec)) return <AnimScene spec={spec} it={it} />;
  const svg = shape ? ART.shapes(shape.k, shape.col, shape.n, shape.big) : ART.scene(spec);
  return <div className="scene-wrap" dangerouslySetInnerHTML={{ __html: svg }} />;
}

// The picture on a lesson card.
export function lessonArt(lesson) {
  const a = lesson.art || {};
  if (a.shape) return { shape: { k: a.shape, col: '#ff6fae', n: a.n || 1, big: a.n ? 0 : 1 } };
  if (a.crowd) return { spec: { crowd: 1, key: 'dog', t: 1, place: 'park', m: [{ acc: 'scarf', act: '🏃', mood: 'happy' }, { acc: 'hat', act: '😴', mood: 'tired' }, { acc: 'sunglasses', act: '🎤', mood: 'happy' }] } };
  return { spec: a };
}
