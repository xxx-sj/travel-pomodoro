import { useState } from 'react';
import { useFlightStore } from '../../store/flightStore';
import { useSettingsStore } from '../../store/settingsStore';
import { LOFI_TRACKS } from '../../lofi';
import { extractYouTubeId, isYouTubeTrack, youtubeIdFromTrack, YT_PREFIX } from '../../lib/youtube';
import { COUNTRIES } from '../../data/countries';

const DURATIONS = [15, 25, 45, 60, 90];

export default function Booking() {
  const { active, setDuration, setCategory, setLofiTrack, setOrigin, setDestination, advance, abort } = useFlightStore();
  const { settings } = useSettingsStore();
  const [custom, setCustom] = useState('');

  const selectedDuration = active?.flight.plannedSeconds ? active.flight.plannedSeconds / 60 : null;
  const selectedCategory = active?.flight.category;
  const selectedTrack = active?.lofiTrack ?? null;
  const origin = active?.origin ?? '';
  const destination = active?.destination ?? '';
  const canProceed = !!selectedDuration && !!selectedCategory && !!origin && !!destination && origin !== destination;

  const initialYtUrl = isYouTubeTrack(selectedTrack)
    ? `https://youtu.be/${youtubeIdFromTrack(selectedTrack)}`
    : '';
  const [ytUrl, setYtUrl] = useState(initialYtUrl);
  const [ytError, setYtError] = useState('');

  function applyYouTube() {
    const id = extractYouTubeId(ytUrl);
    if (!id) {
      setYtError('YouTube URL 확인 필요');
      return;
    }
    setYtError('');
    setLofiTrack(`${YT_PREFIX}${id}`);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-4">
      <h2 className="text-xl font-bold mb-3">Book your flight</h2>

      {/* Two-column grid: left = time/category/route; right = music */}
      <div className="grid lg:grid-cols-2 gap-x-6 gap-y-3">
        {/* LEFT column */}
        <div className="space-y-3">
          {/* Duration */}
          <section>
            <h3 className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">Duration</h3>
            <div className="flex flex-wrap gap-1.5">
              {DURATIONS.map((d) => (
                <button key={d} onClick={() => setDuration(d)}
                  className={`px-3 py-1.5 text-sm rounded-md border ${selectedDuration === d ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-300 bg-white'}`}>
                  {d}m
                </button>
              ))}
              <input type="number" min={1} max={300} placeholder="custom"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                onBlur={() => { const n = parseInt(custom); if (n > 0) setDuration(n); }}
                className="px-2 py-1.5 text-sm border border-slate-300 rounded-md w-20" />
            </div>
          </section>

          {/* Route */}
          <section>
            <h3 className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">
              Route <span className="text-red-500 normal-case">*필수</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <select value={origin} onChange={(e) => setOrigin(e.target.value || null)}
                className={`w-full px-2 py-1.5 text-sm border-2 rounded-md bg-white ${origin ? 'border-emerald-500' : 'border-red-300'}`}>
                <option value="">━ From ━</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.nameKo} ({c.iata})</option>
                ))}
              </select>
              <select value={destination} onChange={(e) => setDestination(e.target.value || null)}
                className={`w-full px-2 py-1.5 text-sm border-2 rounded-md bg-white ${destination ? 'border-emerald-500' : 'border-red-300'}`}>
                <option value="">━ To ━</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} disabled={c.code === origin}>{c.nameKo} ({c.iata})</option>
                ))}
              </select>
            </div>
            {origin && destination && origin !== destination && (
              <p className="text-[11px] text-emerald-700 mt-1">
                ✓ {COUNTRIES.find((c) => c.code === origin)?.nameKo} → {COUNTRIES.find((c) => c.code === destination)?.nameKo}
              </p>
            )}
            {origin && destination && origin === destination && (
              <p className="text-[11px] text-red-500 mt-1">출발지와 목적지가 같습니다</p>
            )}
          </section>

          {/* Category */}
          <section>
            <h3 className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">Category</h3>
            <div className="flex flex-wrap gap-1.5">
              {settings.categories.map((c) => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 text-sm rounded-md border ${selectedCategory === c.id ? 'text-white border-transparent' : 'border-slate-300 bg-white'}`}
                  style={selectedCategory === c.id ? { backgroundColor: c.color } : {}}>
                  {c.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT column */}
        <div className="space-y-3">
          {/* Music tracks */}
          <section>
            <h3 className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">In-flight music (optional)</h3>
            <div className="grid grid-cols-2 gap-1.5">
              <button onClick={() => setLofiTrack(null)}
                className={`px-3 py-2 rounded-md border text-left text-xs ${selectedTrack === null ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 bg-white'}`}>
                <div className="font-semibold">🔇 None</div>
                <div className="opacity-70 text-[10px]">엔진 소리만</div>
              </button>
              {LOFI_TRACKS.map((t) => (
                <button key={t.id} onClick={() => setLofiTrack(t.id)}
                  className={`px-3 py-2 rounded-md border text-left text-xs ${selectedTrack === t.id ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 bg-white'}`}>
                  <div className="font-semibold">{t.label}</div>
                  <div className="opacity-70 text-[10px]">{t.description}</div>
                </button>
              ))}
            </div>
          </section>

          {/* YouTube */}
          <section>
            <h3 className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">📺 YouTube URL (optional)</h3>
            <div className="flex gap-1.5">
              <input
                type="url"
                placeholder="https://youtu.be/... 붙여넣기"
                value={ytUrl}
                onChange={(e) => { setYtUrl(e.target.value); setYtError(''); }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white"
              />
              <button onClick={applyYouTube} className="bg-orange-500 text-white px-3 py-1.5 text-sm rounded-md">
                Set
              </button>
            </div>
            {ytError && <p className="text-[11px] text-red-500 mt-1">{ytError}</p>}
            {isYouTubeTrack(selectedTrack) && !ytError && (
              <p className="text-[11px] text-emerald-600 mt-1">✓ YouTube: {youtubeIdFromTrack(selectedTrack)}</p>
            )}
          </section>

          <p className="text-[10px] text-slate-400">선택한 트랙은 비행 시작 시점부터 재생됩니다.</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-[11px] text-red-500">
          {!canProceed && (
            <>
              {!selectedDuration && '시간 '}
              {!selectedCategory && '카테고리 '}
              {!origin && '출발지 '}
              {!destination && '목적지 '}
              {origin && destination && origin === destination && '출발지 ≠ 목적지'}
              {!canProceed && <span className="ml-1">미선택</span>}
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={abort} className="px-3 py-1.5 text-sm text-slate-500">Cancel</button>
          <button onClick={advance} disabled={!canProceed}
            className="bg-orange-500 text-white px-4 py-1.5 text-sm rounded-md disabled:opacity-40">
            Next: Boarding pass →
          </button>
        </div>
      </div>
    </div>
  );
}
