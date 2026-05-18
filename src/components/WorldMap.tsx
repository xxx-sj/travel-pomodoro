import type { Country } from '../data/countries';
import { COUNTRIES } from '../data/countries';

const MAP_W = 1000;
const MAP_H = 500;

// Equirectangular projection. lng [-180, 180] → x, lat [90, -90] → y
function project(lng: number, lat: number): { x: number; y: number } {
  return {
    x: ((lng + 180) / 360) * MAP_W,
    y: ((90 - lat) / 180) * MAP_H,
  };
}

/**
 * Hand-simplified continent paths in the same equirectangular projection used
 * for project(). Not geographically accurate, but they read as a recognisable
 * world map at a glance, in the minimal Pangaea-ish black-and-white aesthetic
 * the user asked for.
 */
const CONTINENT_PATHS: string[] = [
  // North America (very rough)
  'M 120,100 L 220,90 L 280,110 L 330,130 L 340,180 L 320,230 L 270,270 L 220,275 L 180,260 L 145,230 L 120,180 Z',
  // Central America
  'M 230,280 L 270,290 L 285,310 L 270,330 L 250,325 L 230,305 Z',
  // South America
  'M 280,320 L 330,310 L 360,340 L 360,400 L 330,440 L 295,420 L 275,370 Z',
  // Europe
  'M 470,130 L 540,120 L 575,140 L 580,175 L 540,195 L 480,180 L 465,160 Z',
  // Africa
  'M 480,200 L 570,210 L 600,260 L 595,320 L 565,365 L 520,375 L 490,340 L 470,290 Z',
  // Middle East / West Asia
  'M 580,180 L 645,180 L 660,220 L 635,250 L 590,235 L 580,210 Z',
  // Russia / North Asia
  'M 540,80 L 770,85 L 850,110 L 870,150 L 800,170 L 700,160 L 600,145 L 540,130 Z',
  // East Asia
  'M 760,170 L 850,170 L 870,220 L 830,255 L 780,250 L 750,210 Z',
  // South / SE Asia
  'M 660,225 L 730,235 L 770,260 L 760,295 L 700,290 L 670,260 Z',
  // Indonesia / Philippines
  'M 760,290 L 820,290 L 845,310 L 825,325 L 770,318 Z',
  // Australia
  'M 815,355 L 890,355 L 910,400 L 870,420 L 820,410 Z',
];

type Props = {
  origin?: Country | null;
  destination?: Country | null;
  progress?: number; // 0..1
  showAllCountries?: boolean;
  className?: string;
};

export default function WorldMap({
  origin,
  destination,
  progress = 0,
  showAllCountries = false,
  className = '',
}: Props) {
  const o = origin ? project(origin.lng, origin.lat) : null;
  const d = destination ? project(destination.lng, destination.lat) : null;

  // Arc the path so it doesn't sit flat on the equator.
  let pathD = '';
  let planePos = { x: 0, y: 0 };
  let planeAngle = 0;
  if (o && d) {
    const midX = (o.x + d.x) / 2;
    const arcLift = Math.min(180, Math.abs(d.x - o.x) * 0.25 + 40);
    const midY = (o.y + d.y) / 2 - arcLift;
    pathD = `M ${o.x},${o.y} Q ${midX},${midY} ${d.x},${d.y}`;
    const t = Math.max(0, Math.min(1, progress));
    const x = (1 - t) ** 2 * o.x + 2 * (1 - t) * t * midX + t ** 2 * d.x;
    const y = (1 - t) ** 2 * o.y + 2 * (1 - t) * t * midY + t ** 2 * d.y;
    planePos = { x, y };
    // Tangent direction for plane rotation
    const dx = 2 * (1 - t) * (midX - o.x) + 2 * t * (d.x - midX);
    const dy = 2 * (1 - t) * (midY - o.y) + 2 * t * (d.y - midY);
    planeAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      {/* Continent outlines */}
      <g stroke="rgba(255,255,255,0.55)" strokeWidth={1.2} fill="rgba(255,255,255,0.05)">
        {CONTINENT_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* All country dots (optional, when selecting) */}
      {showAllCountries && COUNTRIES.map((c) => {
        const p = project(c.lng, c.lat);
        return (
          <circle key={c.code} cx={p.x} cy={p.y} r={2} fill="rgba(255,255,255,0.35)" />
        );
      })}

      {/* Flight path */}
      {pathD && (
        <path
          d={pathD}
          stroke="white"
          strokeWidth={1.5}
          fill="none"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />
      )}

      {/* Origin / destination markers */}
      {o && origin && (
        <g>
          <circle cx={o.x} cy={o.y} r={5} fill="white" />
          <circle cx={o.x} cy={o.y} r={9} fill="none" stroke="white" strokeOpacity={0.4} />
          <text x={o.x + 12} y={o.y + 4} fill="white" fontSize={11} fontFamily="monospace">
            {origin.iata}
          </text>
        </g>
      )}
      {d && destination && (
        <g>
          <circle cx={d.x} cy={d.y} r={5} fill="white" />
          <circle cx={d.x} cy={d.y} r={9} fill="none" stroke="white" strokeOpacity={0.4} />
          <text x={d.x + 12} y={d.y + 4} fill="white" fontSize={11} fontFamily="monospace">
            {destination.iata}
          </text>
        </g>
      )}

      {/* Plane (only when route exists) */}
      {o && d && (
        <g transform={`translate(${planePos.x} ${planePos.y}) rotate(${planeAngle})`}>
          <path
            d="M -10,-4 L 10,0 L -10,4 L -6,0 Z"
            fill="white"
            stroke="white"
            strokeWidth={0.5}
          />
        </g>
      )}
    </svg>
  );
}
