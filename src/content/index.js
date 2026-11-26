// All curriculum content, in one place. The *.legacy.js files are the artifacts' data, ported unchanged.
import SB from './data.legacy.js';        // { levels:[{id,name,zh,color,lessons:[…10]}], items, stories }
import ART from './art.legacy.js';        // SVG scene builder: ART.scene(spec) -> SVG string
import DAILY from './daily.legacy.js';    // 8 Daily English topics
import CURRIC from './curriculum.legacy.js'; // units per level + sequence(level)
import QUEST from './quest.legacy.js';    // English Quest question banks (Phase 5)
import COACH from './coach.legacy.js';    // Speaking Coach content (Phase 8)

export { SB, ART, DAILY, CURRIC, QUEST, COACH };
export const LEVELS = SB.levels;
export const levelById = (id) => SB.levels.find((l) => l.id === id);
export const CORE_LEVELS = CURRIC.core; // ['A1','A2','B1'] — ages 5–8
