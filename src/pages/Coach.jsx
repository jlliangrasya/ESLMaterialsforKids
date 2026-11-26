import { COACH } from '../content/index.js';

// Phase 8: port the Speaking Coach from reference/speaking-coach/index.html.
// AI correction must go through a small server (AWS Lambda) that holds the API key — never call the AI from the browser.
export default function Coach() {
  const cats = Object.keys(COACH.speaking);
  return (
    <div className="card">
      <h2 style={{ fontSize: 30 }}>Speaking Coach 🎙️</h2>
      <p className="muted">Live, AI-assisted assessment for adult learners: General, Business and IELTS; levels A1–C2; placement, skills, progress and exam assessments.</p>
      <p className="soon">Coming in Phase 8. Content already ported: grammar for {Object.keys(COACH.grammar).length} levels; writing, speaking, reading and listening for {cats.join(', ')}.</p>
    </div>
  );
}
