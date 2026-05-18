export type LofiTrack = {
  id: string;
  label: string;
  url: string;
  description: string;
};

export const LOFI_TRACKS: LofiTrack[] = [
  {
    id: 'rainy-pad',
    label: '🌧 Rain',
    url: '/lofi/rainy-pad.mp3',
    description: 'Pink noise 기반 비 소리 화이트노이즈. 가장 균질한 배경.',
  },
  {
    id: 'cafe',
    label: '☕ Cafe Murmur',
    url: '/lofi/cafe.mp3',
    description: 'Brown noise 럼블 + 미드주파 머머. 카페 배경 소음 느낌.',
  },
  {
    id: 'forest',
    label: '🌲 Wind & Leaves',
    url: '/lofi/forest.mp3',
    description: '저주파 바람 + 고주파 잎사귀. 야외 자연 화이트노이즈.',
  },
];

export function findTrack(id: string | null | undefined): LofiTrack | null {
  if (!id) return null;
  return LOFI_TRACKS.find(t => t.id === id) ?? null;
}
