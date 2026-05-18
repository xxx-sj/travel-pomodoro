export type LofiTrack = {
  id: string;
  label: string;
  url: string;
  description: string;
};

export const LOFI_TRACKS: LofiTrack[] = [
  {
    id: 'rainy-pad',
    label: '🌧 Rainy Pad',
    url: '/lofi/rainy-pad.mp3',
    description: 'Cmaj7 패드 + 비 소리. 가장 정적인 분위기.',
  },
  {
    id: 'cafe',
    label: '☕ Cafe',
    url: '/lofi/cafe.mp3',
    description: 'Dm7 따뜻한 패드 + 소음. 카페 같은 배경.',
  },
  {
    id: 'forest',
    label: '🌲 Forest',
    url: '/lofi/forest.mp3',
    description: 'Am9 깊은 톤 + 바람 소리. 차분한 자연 분위기.',
  },
];

export function findTrack(id: string | null | undefined): LofiTrack | null {
  if (!id) return null;
  return LOFI_TRACKS.find(t => t.id === id) ?? null;
}
