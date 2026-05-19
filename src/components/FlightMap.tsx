import { useEffect, useRef } from 'react';
import maplibregl, { type Map as MlMap, type Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { greatCircle } from '@turf/great-circle';
import { point } from '@turf/helpers';
import type { Feature, LineString, Position } from 'geojson';
export type ViewMode = 'overview' | 'follow';

// A map endpoint: airport, country, or any lat/lng pair with a short label.
export type MapPoint = {
  code: string;
  lat: number;
  lng: number;
};

type Props = {
  origin: MapPoint | null;
  destination: MapPoint | null;
  progress: number; // 0..1
  mode: ViewMode;
  followZoom?: number;
  overviewZoom?: number;
  satellite?: boolean;
  className?: string;
};

// OpenFreeMap dark style — fully free, no API key, OSM-derived vector tiles.
const STYLE_URL = 'https://tiles.openfreemap.org/styles/dark';

// ESRI World Imagery — free raster satellite tiles, no API key. Attribution required.
const SATELLITE_STYLE = {
  version: 8 as const,
  sources: {
    'esri-satellite': {
      type: 'raster' as const,
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: 'Tiles © Esri',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'esri-satellite',
      type: 'raster' as const,
      source: 'esri-satellite',
    },
  ],
};

function buildPath(o: MapPoint, d: MapPoint): Position[] {
  const path = greatCircle(point([o.lng, o.lat]), point([d.lng, d.lat]), {
    npoints: 200,
  }) as Feature<LineString>;
  return path.geometry.coordinates as Position[];
}

function bearingDeg(from: Position, to: Position): number {
  const lon1 = (from[0] * Math.PI) / 180;
  const lon2 = (to[0] * Math.PI) / 180;
  const lat1 = (from[1] * Math.PI) / 180;
  const lat2 = (to[1] * Math.PI) / 180;
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

function makePlaneEl(): HTMLDivElement {
  const el = document.createElement('div');
  el.style.cssText =
    'width:56px;height:56px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.65))';
  el.innerHTML = `
    <svg viewBox="-12 -12 24 24" width="56" height="56">
      <circle r="9" fill="#F4A261" opacity="0.18"/>
      <path d="M 8,0 L 2.6,-1 L 0.6,-4.6 L -1.3,-4.6 L -0.6,-1 L -5.3,-1 L -6.6,-2.3 L -8,-2.3 L -7,0 L -8,2.3 L -6.6,2.3 L -5.3,1 L -0.6,1 L -1.3,4.6 L 0.6,4.6 L 2.6,1 Z"
        fill="#F4A261" stroke="#0A1628" stroke-width="0.4" stroke-linejoin="round"/>
    </svg>
  `;
  return el;
}

function makeDotEl(color: string): HTMLDivElement {
  const el = document.createElement('div');
  el.style.cssText = `width:12px;height:12px;border-radius:50%;background:${color};box-shadow:0 0 0 4px ${color}40`;
  return el;
}

export default function FlightMap({ origin, destination, progress, mode, followZoom = 8.5, overviewZoom = 3, satellite = false, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const planeRef = useRef<Marker | null>(null);
  const pathRef = useRef<Position[]>([]);
  const loadedRef = useRef<boolean>(false);

  // Initialize the map once per (origin, destination) pair.
  useEffect(() => {
    if (!containerRef.current) return;

    const initialCenter: [number, number] = origin
      ? [origin.lng, origin.lat]
      : [0, 20];

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: satellite ? SATELLITE_STYLE : STYLE_URL,
      center: initialCenter,
      zoom: 2,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: { compact: true },
    });
    mapRef.current = map;

    map.on('load', () => {
      loadedRef.current = true;

      if (origin && destination) {
        const path = greatCircle(point([origin.lng, origin.lat]), point([destination.lng, destination.lat]), {
          npoints: 200,
        }) as Feature<LineString>;

        map.addSource('flight-path', { type: 'geojson', data: path });
        map.addLayer({
          id: 'flight-path-line',
          type: 'line',
          source: 'flight-path',
          layout: { 'line-cap': 'round' },
          paint: {
            'line-color': '#ffffff',
            'line-width': 1.6,
            'line-dasharray': [3, 3],
            'line-opacity': 0.9,
          },
        });

        // Static markers
        new maplibregl.Marker({ element: makeDotEl('#ffffff'), anchor: 'center' })
          .setLngLat([origin.lng, origin.lat])
          .addTo(map);
        new maplibregl.Marker({ element: makeDotEl('#F4A261'), anchor: 'center' })
          .setLngLat([destination.lng, destination.lat])
          .addTo(map);

        // Animated plane
        planeRef.current = new maplibregl.Marker({
          element: makePlaneEl(),
          anchor: 'center',
          rotationAlignment: 'map',
        })
          .setLngLat([origin.lng, origin.lat])
          .addTo(map);

        pathRef.current = buildPath(origin, destination);
      }
    });

    return () => {
      loadedRef.current = false;
      planeRef.current = null;
      pathRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // Recreate when origin/destination/satellite changes. (Satellite needs a
    // full re-init because MapLibre's setStyle would otherwise drop our
    // custom layers + markers and require re-installation.)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin?.code, destination?.code, satellite]);

  // Update plane position + camera every progress / mode tick.
  useEffect(() => {
    const map = mapRef.current;
    const path = pathRef.current;
    const plane = planeRef.current;
    if (!map || !loadedRef.current || !plane || path.length === 0) return;

    // Sub-segment interpolation — picks a point linearly between path[idx]
    // and path[idx+1] using the fractional part of t. Without this, the
    // plane would only snap to discrete path nodes, looking like teleports.
    const t = Math.max(0, Math.min(1, progress));
    const scaled = t * (path.length - 1);
    const idx = Math.min(path.length - 1, Math.floor(scaled));
    const next = Math.min(path.length - 1, idx + 1);
    const frac = scaled - idx;
    const a = path[idx];
    const b = path[next];
    const pos: [number, number] = [
      a[0] + frac * (b[0] - a[0]),
      a[1] + frac * (b[1] - a[1]),
    ];
    const bearing = bearingDeg(a, b);

    plane.setLngLat(pos);
    plane.setRotation(bearing - 90); // SVG plane points east; bearing 0 = north

    if (mode === 'follow') {
      map.easeTo({
        center: pos,
        zoom: followZoom,
        pitch: 72,
        bearing,
        duration: 100,
        easing: (t) => t,
        essential: true,
      });
    } else if (origin && destination) {
      // Overview: keep the camera centered on the great-circle midpoint at
      // the user's chosen zoom level. The plane is drawn as a marker on the
      // map, so it stays visible as it crosses the route.
      const mid: [number, number] = [
        (origin.lng + destination.lng) / 2,
        (origin.lat + destination.lat) / 2,
      ];
      map.easeTo({
        center: mid,
        zoom: overviewZoom,
        pitch: 0,
        bearing: 0,
        duration: 400,
        essential: true,
      });
    }
  }, [progress, mode, origin, destination, followZoom, overviewZoom]);

  return <div ref={containerRef} className={className} style={{ background: '#000' }} />;
}
