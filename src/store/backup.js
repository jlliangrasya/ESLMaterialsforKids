import { useStore } from './useStore.js';
import { VERSION, migrate } from './migrations.js';

// Download everything as one JSON file. Teachers should do this weekly: localStorage lives in one browser only.
export function exportBackup() {
  const { settings, currentStudentId, students, viewLevel } = useStore.getState();
  const data = { app: 'sentence-builders', version: VERSION, exportedAt: new Date().toISOString(), settings, currentStudentId, students, viewLevel };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `sentence-builders-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  useStore.getState().markBackup();
}

// Restore from a backup file. Replaces what is in this browser.
export async function importBackup(file) {
  const data = JSON.parse(await file.text());
  if (data.app !== 'sentence-builders' || !data.students) throw new Error('This is not a Sentence Builders backup file.');
  const up = migrate({ settings: data.settings, currentStudentId: data.currentStudentId, students: data.students, viewLevel: data.viewLevel }, data.version || 1);
  Object.assign(data, up);
  useStore.getState().replaceAll({ settings: data.settings, currentStudentId: data.currentStudentId, students: data.students, viewLevel: data.viewLevel || 'A1' });
  return Object.keys(data.students).length;
}
