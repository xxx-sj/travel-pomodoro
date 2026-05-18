const ROWS = 10;
const LEFT_COLS = ['A', 'B', 'C'] as const;
const RIGHT_COLS = ['D', 'E', 'F'] as const;
const WING_ROW = 5;  // 0-indexed; wings fan out from row 5 (= seat row 6)

type Props = {
  selected: string | null;
  recentlyUsed: Set<string>;
  onSelect: (seat: string) => void;
};

function Seat({ label, isSel, isUsed, onSelect }: { label: string; isSel: boolean; isUsed: boolean; onSelect: (s: string) => void }) {
  return (
    <button
      onClick={() => onSelect(label)}
      className={`aspect-square rounded-md text-[10px] font-mono transition-colors ${
        isSel ? 'bg-orange-500 text-white ring-2 ring-orange-300 shadow-md' :
        isUsed ? 'bg-slate-200/60 text-slate-400' :
        'bg-slate-100 text-slate-700 hover:bg-orange-100 hover:text-orange-700'
      }`}>
      {label}
    </button>
  );
}

export default function SeatMap({ selected, recentlyUsed, onSelect }: Props) {
  return (
    <div className="relative w-full max-w-[280px] mx-auto py-4">
      {/* Wings (decorative) - positioned absolute behind the fuselage */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-16 pointer-events-none"
           style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.35) 15%, rgba(148,163,184,0.5) 50%, rgba(148,163,184,0.35) 85%, transparent 100%)',
                    clipPath: 'polygon(0% 50%, 30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%)' }} />

      {/* Fuselage */}
      <div className="relative bg-slate-50 border border-slate-200 rounded-t-[100px] rounded-b-[60px] pt-8 px-4 pb-12 shadow-lg">
        {/* Cockpit indicator */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] tracking-widest text-slate-400 font-mono">
          ✈ COCKPIT
        </div>

        {/* Seat grid: 3-aisle-3 */}
        <div className="space-y-1.5">
          {Array.from({ length: ROWS }, (_, r) => {
            const isWingRow = r === WING_ROW || r === WING_ROW - 1;
            return (
              <div key={r} className="flex items-center gap-1.5">
                {/* Row number */}
                <span className="w-4 text-[9px] font-mono text-slate-400 text-right">{r + 1}</span>

                {/* Left 3 seats */}
                <div className="grid grid-cols-3 gap-1 flex-1">
                  {LEFT_COLS.map(c => {
                    const label = (r + 1) + c;
                    return <Seat key={label} label={label} isSel={label === selected} isUsed={recentlyUsed.has(label)} onSelect={onSelect} />;
                  })}
                </div>

                {/* Aisle */}
                <div className={`w-3 text-center ${isWingRow ? 'text-amber-500' : 'text-slate-300'}`}>
                  <span className="text-[8px]">·</span>
                </div>

                {/* Right 3 seats */}
                <div className="grid grid-cols-3 gap-1 flex-1">
                  {RIGHT_COLS.map(c => {
                    const label = (r + 1) + c;
                    return <Seat key={label} label={label} isSel={label === selected} isUsed={recentlyUsed.has(label)} onSelect={onSelect} />;
                  })}
                </div>

                {/* Row number right */}
                <span className="w-4 text-[9px] font-mono text-slate-400">{r + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Tail indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] tracking-widest text-slate-400 font-mono">
          TAIL ▼
        </div>
      </div>
    </div>
  );
}
