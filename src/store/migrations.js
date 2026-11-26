// Every saved shape has a version. When the shape changes, add a step here so old saves upgrade on load.
export const VERSION = 2;

export const migrations = {
  // 0 -> 1: example for later. Version 1 is the first shape, so nothing to do yet.
  // 1 -> 2: "Moving pictures" setting (animated scenes), on by default.
  2: (state) => ({ ...state, settings: { ...(state.settings || {}), motion: (state.settings || {}).motion !== false } }),
};

export function migrate(state, fromVersion) {
  let s = state;
  for (let v = fromVersion + 1; v <= VERSION; v++) if (migrations[v]) s = migrations[v](s);
  return s;
}
