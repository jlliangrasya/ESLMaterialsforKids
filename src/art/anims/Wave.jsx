// "The dinosaur was swimming in the sea when a big wave came."
// Calm: the dinosaur swims and bobs in the sea. Go: a big wave rolls in from the right, crashes over
// the dinosaur (splash, surprised face, jump), then the sea settles with foam.
// Still picture (reduced motion): the wave towers behind the surprised dinosaur, with splashes.
// Motion is in src/styles/anim.css (.wv …). Original drawing; the dinosaur is the app's own character.
import { ART } from '../../content/index.js';

const DX = 150, GROUND = 228; // dinosaur position (same scale as the still scenes)
const happy = ART.char('dino', DX, GROUND, 1, { mood: 'happy' });
const surprised = ART.char('dino', DX, GROUND, 1, { mood: 'surprised' });
const DROPS = [[-46, -38, 7], [-24, -62, 6], [4, -70, 8], [30, -56, 6], [52, -30, 7], [-60, -8, 5], [64, -4, 5]];

export default function Wave() {
  return (
    <>
      {/* sky and far sea */}
      <rect width="400" height="250" fill="#b8e6ff" />
      <circle cx="60" cy="44" r="24" fill="#ffd23f" />
      <g className="cloud"><ellipse cx="250" cy="48" rx="34" ry="13" fill="#fff" /><ellipse cx="272" cy="40" rx="22" ry="13" fill="#fff" /></g>
      <rect y="128" width="400" height="122" fill="#3ea0e8" />
      <rect y="128" width="400" height="8" fill="#6cc0f5" />
      <g className="wv-rip" stroke="#fff" strokeWidth="3" fill="none" opacity=".6" strokeLinecap="round">
        <path d="M20 152 q14 -7 28 0 M110 160 q14 -7 28 0 M300 150 q14 -7 28 0 M380 162 q14 -7 28 0 M-60 162 q14 -7 28 0" />
      </g>

      {/* the big wave, behind the dinosaur; its tip curls over the dinosaur's head */}
      <g transform="translate(262 206)">
        <g className="wv-wave">
          <path d="M150 0 C128 -40 100 -122 34 -142 C-16 -156 -70 -134 -84 -96 C-64 -112 -34 -110 -24 -90 C-14 -64 -44 -28 -104 0 Z" fill="#2b86d6" />
          <path d="M-24 -90 C-14 -64 -44 -28 -104 0 L-60 0 C-20 -30 0 -60 -6 -92 Z" fill="#5fb4f2" opacity=".8" />
          <ellipse cx="-44" cy="-100" rx="16" ry="9" fill="#1e6fb8" />
          <path d="M108 -64 C92 -112 66 -136 34 -142 C-16 -156 -70 -134 -84 -96" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />
          {[[-84, -96, 8], [-70, -116, 7], [-44, -136, 8], [-8, -146, 7], [30, -144, 7], [66, -128, 6]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" />)}
        </g>
      </g>

      {/* the dinosaur: jump on the hit, gentle bob all the time, happy face swaps to surprised */}
      <g className="wv-hit">
        <g className="wv-bob">
          <g className="wv-a" dangerouslySetInnerHTML={{ __html: happy }} />
          <g className="wv-b" dangerouslySetInnerHTML={{ __html: surprised }} />
        </g>
      </g>
      <g className="wv-bang">
        <circle cx="222" cy="82" r="15" fill="#ff4d4d" stroke="#fff" strokeWidth="3" />
        <text x="222" y="90" fontSize="22" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Nunito,sans-serif">!</text>
      </g>

      {/* water in front of the dinosaur (hides its legs: it is swimming) */}
      <g className="wv-front">
        <path d="M-20 190 Q20 180 60 190 T140 190 T220 190 T300 190 T380 190 T460 190 V260 H-20 Z" fill="#3ea0e8" />
        <path d="M-20 190 Q20 180 60 190 T140 190 T220 190 T300 190 T380 190 T460 190" stroke="#bfe6ff" strokeWidth="4" fill="none" />
      </g>

      {/* splash and foam */}
      {DROPS.map(([dx, dy, r], i) => (
        <circle key={i} className="wv-drop" cx="182" cy="124" r={r} fill="#fff" stroke="#5fb4f2" strokeWidth="2" style={{ '--dx': dx + 'px', '--dy': dy + 'px' }} />
      ))}
      <g className="wv-foam" fill="#fff">
        <ellipse cx="120" cy="192" rx="46" ry="7" /><ellipse cx="200" cy="188" rx="38" ry="6" /><ellipse cx="270" cy="194" rx="44" ry="7" />
      </g>
    </>
  );
}
Wave.cls = 'wv';
Wave.label = 'A dinosaur swimming in the sea when a big wave comes';
Wave.cueRole = 'event';
