import { useMemo } from 'react';
import { useFlightStore } from '../../store/flightStore';
import { loadHistory } from '../../lib/storage';
import { audioBus } from '../../lib/audio';
import SeatMap from '../../components/SeatMap';

// Map each seat label to a unique "view from window" gradient.
// Row → time-of-day progression (front=sunrise, back=night).
// Column → vertical mood shift (A/F window seats = vivid sky; aisle = softer).
function backgroundFor(seat: string | null | undefined): string {
  if (!seat) {
    return 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)';
  }
  const m = seat.match(/^(\d+)([A-F])$/);
  if (!m) return 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)';
  const row = parseInt(m[1], 10);  // 1..10
  const col = m[2];                // A..F
  const isWindow = col === 'A' || col === 'F';
  const isAisle = col === 'C' || col === 'D';

  // Row drives the hue progression: dawn → noon → dusk → night
  // Hue from 30 (warm orange dawn) → 200 (blue noon) → 280 (purple dusk) → 240 (deep blue night)
  const hues = [30, 50, 200, 210, 220, 240, 260, 280, 250, 230];
  const topHue = hues[row - 1];
  const bottomHue = (topHue + 30) % 360;

  // Saturation/lightness vary by column position
  const sat = isWindow ? 70 : isAisle ? 30 : 50;
  const topLight = isWindow ? 55 : 70;
  const bottomLight = isWindow ? 25 : 50;

  // Slight column offset to make adjacent seats differ
  const colShift = ('ABCDEF'.indexOf(col)) * 8 - 20;
  const finalTopHue = (topHue + colShift + 360) % 360;
  const finalBottomHue = (bottomHue + colShift + 360) % 360;

  return `linear-gradient(180deg, hsl(${finalTopHue}, ${sat}%, ${topLight}%) 0%, hsl(${finalBottomHue}, ${sat}%, ${bottomLight}%) 100%)`;
}

export default function SeatSelection() {
  const { active, setSeat, advance, abort } = useFlightStore();
  const recentlyUsed = useMemo(() => new Set(loadHistory().slice(0, 20).map(f => f.seat)), []);
  const seat = active?.flight.seat;

  return (
    <div
      className="min-h-screen transition-[background] duration-500 ease-out"
      style={{ background: backgroundFor(seat) }}
    >
      <div className="max-w-xl mx-auto p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white drop-shadow-md">Choose your seat</h2>
        <p className="text-white/80 text-sm drop-shadow">자리마다 창밖 풍경이 다릅니다 — 마음에 드는 자리를 골라보세요</p>
        <SeatMap
          selected={seat ?? null}
          recentlyUsed={recentlyUsed}
          onSelect={setSeat}
        />
        {seat && (
          <div className="text-center text-white/90 font-mono text-sm drop-shadow">
            Seat {seat}
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <button onClick={() => { audioBus.stopMusic(); abort(); }} className="px-4 py-2 text-white/70 hover:text-white">Cancel</button>
          <button onClick={advance} disabled={!seat}
            className="bg-white text-slate-900 px-6 py-2 rounded-lg disabled:opacity-40 font-semibold shadow-md">
            Next: Boarding pass →
          </button>
        </div>
      </div>
    </div>
  );
}
