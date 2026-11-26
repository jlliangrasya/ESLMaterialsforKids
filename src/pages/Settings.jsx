import { useStore } from '../store/useStore.js';
import { say } from '../audio/speech.js';

export default function Settings() {
  const { settings, setSetting } = useStore();
  return (
    <div className="card">
      <h2 style={{ fontSize: 30 }}>Settings ⚙️</h2>
      <div className="row"><label><input type="checkbox" checked={settings.zh} onChange={(e) => setSetting('zh', e.target.checked)} /> Show Chinese 中文</label></div>
      <div className="row"><label><input type="checkbox" checked={settings.sounds} onChange={(e) => setSetting('sounds', e.target.checked)} /> Sound effects</label></div>
      <div className="row"><label><input type="checkbox" checked={settings.motion !== false} onChange={(e) => setSetting('motion', e.target.checked)} /> Moving pictures <span className="zh" style={{ display: 'inline' }}>动画图片</span></label>
        <span className="muted">Pictures act out the sentence (rain falls, the wave comes…). Turn off for a slow computer.<span className="zh">图片会演出句子的意思。电脑慢时可以关掉。</span></span></div>
      <div className="row"><label>Voice speed {settings.voiceRate.toFixed(2)} <input type="range" min="0.5" max="1.1" step="0.05" value={settings.voiceRate} onChange={(e) => setSetting('voiceRate', +e.target.value)} /></label>
        <button className="ghost" onClick={() => say('The dinosaur is dancing in the bathtub.', { rate: settings.voiceRate })}>🔊 Test voice</button></div>
    </div>
  );
}
