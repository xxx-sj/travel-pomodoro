export type Country = {
  code: string;
  name: string;
  nameKo: string;
  lat: number;
  lng: number;
  iata: string; // 대표 공항 IATA 코드 (보딩패스용)
};

export const COUNTRIES: Country[] = [
  { code: 'KR', name: 'South Korea',   nameKo: '한국',     lat: 37.55,  lng: 126.97, iata: 'ICN' },
  { code: 'JP', name: 'Japan',         nameKo: '일본',     lat: 35.68,  lng: 139.69, iata: 'NRT' },
  { code: 'CN', name: 'China',         nameKo: '중국',     lat: 39.90,  lng: 116.41, iata: 'PEK' },
  { code: 'TW', name: 'Taiwan',        nameKo: '대만',     lat: 25.04,  lng: 121.56, iata: 'TPE' },
  { code: 'HK', name: 'Hong Kong',     nameKo: '홍콩',     lat: 22.32,  lng: 114.17, iata: 'HKG' },
  { code: 'SG', name: 'Singapore',     nameKo: '싱가포르', lat: 1.35,   lng: 103.82, iata: 'SIN' },
  { code: 'TH', name: 'Thailand',      nameKo: '태국',     lat: 13.76,  lng: 100.50, iata: 'BKK' },
  { code: 'VN', name: 'Vietnam',       nameKo: '베트남',   lat: 21.03,  lng: 105.85, iata: 'HAN' },
  { code: 'IN', name: 'India',         nameKo: '인도',     lat: 28.61,  lng: 77.21,  iata: 'DEL' },
  { code: 'AE', name: 'UAE',           nameKo: 'UAE',      lat: 25.20,  lng: 55.27,  iata: 'DXB' },
  { code: 'RU', name: 'Russia',        nameKo: '러시아',   lat: 55.75,  lng: 37.62,  iata: 'SVO' },
  { code: 'TR', name: 'Turkey',        nameKo: '튀르키예', lat: 41.01,  lng: 28.98,  iata: 'IST' },
  { code: 'IT', name: 'Italy',         nameKo: '이탈리아', lat: 41.90,  lng: 12.50,  iata: 'FCO' },
  { code: 'FR', name: 'France',        nameKo: '프랑스',   lat: 48.86,  lng: 2.35,   iata: 'CDG' },
  { code: 'GB', name: 'UK',            nameKo: '영국',     lat: 51.51,  lng: -0.13,  iata: 'LHR' },
  { code: 'DE', name: 'Germany',       nameKo: '독일',     lat: 52.52,  lng: 13.41,  iata: 'FRA' },
  { code: 'ES', name: 'Spain',         nameKo: '스페인',   lat: 40.42,  lng: -3.70,  iata: 'MAD' },
  { code: 'EG', name: 'Egypt',         nameKo: '이집트',   lat: 30.04,  lng: 31.24,  iata: 'CAI' },
  { code: 'ZA', name: 'South Africa',  nameKo: '남아공',   lat: -33.92, lng: 18.42,  iata: 'CPT' },
  { code: 'BR', name: 'Brazil',        nameKo: '브라질',   lat: -15.78, lng: -47.93, iata: 'GRU' },
  { code: 'AR', name: 'Argentina',     nameKo: '아르헨티나',lat: -34.61, lng: -58.38, iata: 'EZE' },
  { code: 'US', name: 'USA',           nameKo: '미국',     lat: 40.71,  lng: -74.00, iata: 'JFK' },
  { code: 'CA', name: 'Canada',        nameKo: '캐나다',   lat: 43.65,  lng: -79.38, iata: 'YYZ' },
  { code: 'MX', name: 'Mexico',        nameKo: '멕시코',   lat: 19.43,  lng: -99.13, iata: 'MEX' },
  { code: 'AU', name: 'Australia',     nameKo: '호주',     lat: -33.87, lng: 151.21, iata: 'SYD' },
  { code: 'NZ', name: 'New Zealand',   nameKo: '뉴질랜드', lat: -36.85, lng: 174.76, iata: 'AKL' },
];

export function findCountry(code: string | null | undefined): Country | null {
  if (!code) return null;
  return COUNTRIES.find((c) => c.code === code) ?? null;
}
