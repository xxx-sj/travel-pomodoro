import { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { requestPermission } from '../lib/notifications';

export default function Settings() {
  const { settings, setVolume, setSoundEnabled, setNotificationsEnabled, addCategory, removeCategory } = useSettingsStore();
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState('#888888');
  const [toast, setToast] = useState<string | null>(null);

  async function toggleNotif(checked: boolean) {
    if (checked) {
      const p = await requestPermission();
      if (p !== 'granted') {
        setNotificationsEnabled(false);
        setToast('알림 권한이 거부되어 토글을 다시 끕니다.');
        setTimeout(() => setToast(null), 3000);
        return;
      }
    }
    setNotificationsEnabled(checked);
  }

  function handleAddCategory() {
    const label = newLabel.trim();
    if (!label) return;
    const id = label.toLowerCase().replace(/\s+/g, '-');
    if (settings.categories.some(c => c.id === id)) {
      setToast('같은 이름의 카테고리가 이미 있어요.');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    addCategory({ id, label, color: newColor });
    setNewLabel('');
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8 relative">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section>
        <h2 className="font-bold mb-3">Categories</h2>
        <div className="space-y-2">
          {settings.categories.map(c => (
            <div key={c.id} className="flex items-center gap-3 p-3 bg-white rounded border border-slate-200">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: c.color }} />
              <span className="flex-1">{c.label}</span>
              <button onClick={() => removeCategory(c.id)} className="text-red-500 text-sm">Remove</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="라벨"
            className="px-3 py-2 border rounded flex-1" />
          <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)}
            className="w-12 h-10 border rounded" />
          <button onClick={handleAddCategory} className="bg-sunset text-white px-4 rounded">Add</button>
        </div>
      </section>

      <section>
        <h2 className="font-bold mb-3">Sound</h2>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={settings.soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} />
          Enable sounds
        </label>
        <div className="mt-3">
          <label className="text-sm">Volume: {Math.round(settings.volume * 100)}%</label>
          <input type="range" min={0} max={1} step={0.05} value={settings.volume}
            onChange={e => setVolume(parseFloat(e.target.value))} className="w-full" />
        </div>
      </section>

      <section>
        <h2 className="font-bold mb-3">Notifications</h2>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={settings.notificationsEnabled}
            onChange={e => toggleNotif(e.target.checked)} />
          알림으로 비행 종료 시점 받기
        </label>
      </section>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
