import { useState } from 'react';
import { useFlightStore } from '../../store/flightStore';
import { useSettingsStore } from '../../store/settingsStore';

const DURATIONS = [15, 25, 45, 60, 90];

export default function Booking() {
  const { active, setDuration, setCategory, advance, abort } = useFlightStore();
  const { settings } = useSettingsStore();
  const [custom, setCustom] = useState('');

  const selectedDuration = active?.flight.plannedSeconds ? active.flight.plannedSeconds / 60 : null;
  const selectedCategory = active?.flight.category;
  const canProceed = !!selectedDuration && !!selectedCategory;

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

      <div className="flex gap-3 justify-end">
        <button onClick={abort} className="px-4 py-2 text-slate-500">Cancel</button>
        <button onClick={advance} disabled={!canProceed}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg disabled:opacity-40">
          Next: Choose seat →
        </button>
      </div>
    </div>
  );
}
