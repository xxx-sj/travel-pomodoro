import { useState } from 'react';
import { useFlightStore } from '../../store/flightStore';
import { useSettingsStore } from '../../store/settingsStore';
import { audioBus } from '../../lib/audio';
import { LOFI_TRACKS, findTrack } from '../../lofi';

const DURATIONS = [15, 25, 45, 60, 90];

export default function Booking() {
  const { active, setDuration, setCategory, setLofiTrack, advance, abort } = useFlightStore();
  const { settings } = useSettingsStore();
  const [custom, setCustom] = useState('');

  const selectedDuration = active?.flight.plannedSeconds ? active.flight.plannedSeconds / 60 : null;
  const selectedCategory = active?.flight.category;
  const selectedTrack = active?.lofiTrack ?? null;
  const canProceed = !!selectedDuration && !!selectedCategory;

  function previewTrack(id: string | null) {
    audioBus.resume();
    setLofiTrack(id);
    const track = findTrack(id);
    if (track) audioBus.playMusic(track.url);
    else audioBus.stopMusic();
  }

  return (
    <div className="max-w-xl mx-auto p-8 space-y-8">
      <h2 className="text-2xl font-bold">Book your flight</h2>

      <section>
        <h3 className="text-sm uppercase tracking-wider mb-3">Duration</h3>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map(d => (
            <button key={d} onClick={() => setDuration(d)}
              className={`px-4 py-2 rounded-lg border ${selectedDuration === d ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-300'}`}>
              {d} min
            </button>
          ))}
          <input type="number" min={1} max={300} placeholder="custom"
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onBlur={() => { const n = parseInt(custom); if (n > 0) setDuration(n); }}
            className="px-3 py-2 border border-slate-300 rounded-lg w-24" />
        </div>
      </section>

      <section>
        <h3 className="text-sm uppercase tracking-wider mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {settings.categories.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-lg border ${selectedCategory === c.id ? 'text-white border-transparent' : 'border-slate-300'}`}
              style={selectedCategory === c.id ? { backgroundColor: c.color } : {}}>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm uppercase tracking-wider mb-3">In-flight music (optional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={() => previewTrack(null)}
            className={`px-4 py-3 rounded-lg border text-left ${selectedTrack === null ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300'}`}>
            <div className="font-semibold text-sm">🔇 None</div>
            <div className="text-xs opacity-70 mt-0.5">엔진 소리만</div>
          </button>
          {LOFI_TRACKS.map(t => (
            <button key={t.id} onClick={() => previewTrack(t.id)}
              className={`px-4 py-3 rounded-lg border text-left ${selectedTrack === t.id ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300'}`}>
              <div className="font-semibold text-sm">{t.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{t.description}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">선택하면 미리듣기 — 비행 중에도 계속 재생됩니다.</p>
      </section>

      <div className="flex gap-3 justify-end">
        <button onClick={() => { audioBus.stopMusic(); abort(); }} className="px-4 py-2 text-slate-500">Cancel</button>
        <button onClick={advance} disabled={!canProceed}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg disabled:opacity-40">
          Next: Choose seat →
        </button>
      </div>
    </div>
  );
}
