// Map each seat label to a unique "view from window" gradient.
// Row → time-of-day progression (front=dawn, back=night).
// Column → vivid (window) vs softer (aisle).

export function backgroundFor(seat: string | null | undefined): string {
  if (!seat) {
    return 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)';
  }
  const m = seat.match(/^(\d+)([A-F])$/);
  if (!m) return 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)';
  const row = parseInt(m[1], 10);
  const col = m[2];
  const isWindow = col === 'A' || col === 'F';
  const isAisle = col === 'C' || col === 'D';

  // Row drives the hue progression: dawn → noon → dusk → night
  const hues = [30, 50, 200, 210, 220, 240, 260, 280, 250, 230];
  const topHue = hues[Math.max(0, Math.min(9, row - 1))];
  const bottomHue = (topHue + 30) % 360;

  const sat = isWindow ? 70 : isAisle ? 30 : 50;
  const topLight = isWindow ? 55 : 70;
  const bottomLight = isWindow ? 25 : 50;

  const colShift = ('ABCDEF'.indexOf(col)) * 8 - 20;
  const finalTopHue = (topHue + colShift + 360) % 360;
  const finalBottomHue = (bottomHue + colShift + 360) % 360;

  return `linear-gradient(180deg, hsl(${finalTopHue}, ${sat}%, ${topLight}%) 0%, hsl(${finalBottomHue}, ${sat}%, ${bottomLight}%) 100%)`;
}
