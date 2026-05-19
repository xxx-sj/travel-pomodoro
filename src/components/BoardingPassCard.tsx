import type { Category } from '../types';

// Generic shape — accepts airports (cityKo + code) or legacy countries (nameKo + iata).
type Endpoint = { code: string; label: string };

type Props = {
  category: Category;
  durationMinutes: number;
  seat: string;
  origin?: Endpoint | null;
  destination?: Endpoint | null;
};

export default function BoardingPassCard({ category, durationMinutes, seat, origin, destination }: Props) {
  const fromCode = origin?.code ?? 'NOW';
  const fromLabel = origin?.label ?? '현재';
  const toCode = destination?.code ?? 'DONE';
  const toLabel = destination?.label ?? '완료';

  return (
    <div className="grid grid-cols-[1fr_auto] bg-amber-50 text-slate-900 rounded-xl overflow-hidden shadow-xl max-w-md mx-auto font-mono">
      <div className="p-6 border-r-2 border-dashed border-amber-200">
        <div className="flex justify-between mb-4 text-xs">
          <span className="font-bold tracking-widest">FOCUSFLIGHT</span>
          <span className="text-slate-500">FOCUS CLASS</span>
        </div>
        <div className="flex items-center justify-between mb-5">
          <div className="text-center">
            <div className="text-2xl font-extrabold">{fromCode}</div>
            <div className="text-[10px] text-slate-500">{fromLabel}</div>
          </div>
          <div className="text-orange-500 text-xl -rotate-12">✈</div>
          <div className="text-center">
            <div className="text-2xl font-extrabold">{toCode}</div>
            <div className="text-[10px] text-slate-500">{toLabel}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div><div className="text-slate-500 text-[9px] tracking-widest">CATEGORY</div><div className="font-bold" style={{ color: category.color }}>{category.label}</div></div>
          <div><div className="text-slate-500 text-[9px] tracking-widest">DURATION</div><div className="font-bold">{durationMinutes} MIN</div></div>
          <div><div className="text-slate-500 text-[9px] tracking-widest">GATE</div><div className="font-bold">F1</div></div>
        </div>
      </div>
      <div className="bg-orange-400 p-6 flex flex-col items-center justify-between min-w-[120px]">
        <div className="text-[9px] tracking-widest">SEAT</div>
        <div className="text-4xl font-extrabold">{seat}</div>
        <div className="text-[9px] tracking-widest opacity-70">TICKET</div>
      </div>
    </div>
  );
}
