export type Airport = {
  code: string;          // IATA (3 letters)
  city: string;          // English city
  cityKo: string;        // 한국어 도시/공항명
  countryCode: string;   // ISO 3166-1 alpha-2
  countryKo: string;     // 한국어 국가명
  lat: number;
  lng: number;
};

// Curated list of major international airports for each country.
export const AIRPORTS: Airport[] = [
  // 한국
  { code: 'ICN', city: 'Seoul', cityKo: '서울 인천', countryCode: 'KR', countryKo: '한국', lat: 37.4602, lng: 126.4407 },
  { code: 'GMP', city: 'Seoul', cityKo: '서울 김포', countryCode: 'KR', countryKo: '한국', lat: 37.5586, lng: 126.7944 },
  { code: 'PUS', city: 'Busan',  cityKo: '부산',     countryCode: 'KR', countryKo: '한국', lat: 35.1796, lng: 128.9380 },
  { code: 'CJU', city: 'Jeju',   cityKo: '제주',     countryCode: 'KR', countryKo: '한국', lat: 33.5113, lng: 126.4930 },

  // 일본
  { code: 'NRT', city: 'Tokyo',     cityKo: '도쿄 나리타',     countryCode: 'JP', countryKo: '일본', lat: 35.7720, lng: 140.3929 },
  { code: 'HND', city: 'Tokyo',     cityKo: '도쿄 하네다',     countryCode: 'JP', countryKo: '일본', lat: 35.5494, lng: 139.7798 },
  { code: 'KIX', city: 'Osaka',     cityKo: '오사카 간사이',   countryCode: 'JP', countryKo: '일본', lat: 34.4347, lng: 135.2330 },
  { code: 'ITM', city: 'Osaka',     cityKo: '오사카 이타미',   countryCode: 'JP', countryKo: '일본', lat: 34.7855, lng: 135.4382 },
  { code: 'FUK', city: 'Fukuoka',   cityKo: '후쿠오카',         countryCode: 'JP', countryKo: '일본', lat: 33.5859, lng: 130.4510 },
  { code: 'CTS', city: 'Sapporo',   cityKo: '삿포로',           countryCode: 'JP', countryKo: '일본', lat: 42.7752, lng: 141.6920 },
  { code: 'OKA', city: 'Okinawa',   cityKo: '오키나와',         countryCode: 'JP', countryKo: '일본', lat: 26.1958, lng: 127.6458 },
  { code: 'NGO', city: 'Nagoya',    cityKo: '나고야',           countryCode: 'JP', countryKo: '일본', lat: 34.8584, lng: 136.8054 },

  // 중국
  { code: 'PEK', city: 'Beijing',   cityKo: '베이징 수도',       countryCode: 'CN', countryKo: '중국', lat: 40.0801, lng: 116.5846 },
  { code: 'PKX', city: 'Beijing',   cityKo: '베이징 다싱',       countryCode: 'CN', countryKo: '중국', lat: 39.5098, lng: 116.4105 },
  { code: 'PVG', city: 'Shanghai',  cityKo: '상하이 푸동',       countryCode: 'CN', countryKo: '중국', lat: 31.1443, lng: 121.8083 },
  { code: 'CAN', city: 'Guangzhou', cityKo: '광저우',           countryCode: 'CN', countryKo: '중국', lat: 23.3924, lng: 113.2988 },
  { code: 'CTU', city: 'Chengdu',   cityKo: '청두',             countryCode: 'CN', countryKo: '중국', lat: 30.5785, lng: 103.9471 },

  // 대만
  { code: 'TPE', city: 'Taipei',    cityKo: '타이베이',         countryCode: 'TW', countryKo: '대만', lat: 25.0777, lng: 121.2328 },
  { code: 'KHH', city: 'Kaohsiung', cityKo: '가오슝',           countryCode: 'TW', countryKo: '대만', lat: 22.5773, lng: 120.3500 },

  // 홍콩
  { code: 'HKG', city: 'Hong Kong', cityKo: '홍콩',             countryCode: 'HK', countryKo: '홍콩', lat: 22.3080, lng: 113.9185 },

  // 싱가포르
  { code: 'SIN', city: 'Singapore', cityKo: '싱가포르 창이',     countryCode: 'SG', countryKo: '싱가포르', lat: 1.3644, lng: 103.9915 },

  // 태국
  { code: 'BKK', city: 'Bangkok',   cityKo: '방콕 수완나품',     countryCode: 'TH', countryKo: '태국', lat: 13.6900, lng: 100.7501 },
  { code: 'DMK', city: 'Bangkok',   cityKo: '방콕 돈므앙',       countryCode: 'TH', countryKo: '태국', lat: 13.9126, lng: 100.6068 },
  { code: 'HKT', city: 'Phuket',    cityKo: '푸켓',             countryCode: 'TH', countryKo: '태국', lat: 8.1132, lng: 98.3169 },
  { code: 'CNX', city: 'Chiang Mai',cityKo: '치앙마이',         countryCode: 'TH', countryKo: '태국', lat: 18.7706, lng: 98.9628 },

  // 베트남
  { code: 'HAN', city: 'Hanoi',     cityKo: '하노이',           countryCode: 'VN', countryKo: '베트남', lat: 21.2212, lng: 105.8072 },
  { code: 'SGN', city: 'Ho Chi Minh',cityKo: '호치민',          countryCode: 'VN', countryKo: '베트남', lat: 10.8189, lng: 106.6520 },
  { code: 'DAD', city: 'Da Nang',   cityKo: '다낭',             countryCode: 'VN', countryKo: '베트남', lat: 16.0438, lng: 108.1992 },

  // 인도
  { code: 'DEL', city: 'Delhi',     cityKo: '델리',             countryCode: 'IN', countryKo: '인도', lat: 28.5562, lng: 77.1000 },
  { code: 'BOM', city: 'Mumbai',    cityKo: '뭄바이',           countryCode: 'IN', countryKo: '인도', lat: 19.0896, lng: 72.8656 },
  { code: 'BLR', city: 'Bangalore', cityKo: '방갈로르',         countryCode: 'IN', countryKo: '인도', lat: 13.1986, lng: 77.7066 },

  // UAE
  { code: 'DXB', city: 'Dubai',     cityKo: '두바이',           countryCode: 'AE', countryKo: 'UAE', lat: 25.2528, lng: 55.3644 },
  { code: 'AUH', city: 'Abu Dhabi', cityKo: '아부다비',         countryCode: 'AE', countryKo: 'UAE', lat: 24.4330, lng: 54.6511 },

  // 러시아
  { code: 'SVO', city: 'Moscow',    cityKo: '모스크바 셰레메티예보', countryCode: 'RU', countryKo: '러시아', lat: 55.9726, lng: 37.4146 },
  { code: 'LED', city: 'St. Petersburg', cityKo: '상트페테르부르크', countryCode: 'RU', countryKo: '러시아', lat: 59.8003, lng: 30.2625 },

  // 튀르키예
  { code: 'IST', city: 'Istanbul',  cityKo: '이스탄불',         countryCode: 'TR', countryKo: '튀르키예', lat: 41.2753, lng: 28.7519 },
  { code: 'SAW', city: 'Istanbul',  cityKo: '이스탄불 사비하',  countryCode: 'TR', countryKo: '튀르키예', lat: 40.8983, lng: 29.3092 },

  // 이탈리아
  { code: 'FCO', city: 'Rome',      cityKo: '로마 피우미치노',   countryCode: 'IT', countryKo: '이탈리아', lat: 41.8003, lng: 12.2389 },
  { code: 'MXP', city: 'Milan',     cityKo: '밀라노 말펜사',     countryCode: 'IT', countryKo: '이탈리아', lat: 45.6306, lng: 8.7281 },
  { code: 'VCE', city: 'Venice',    cityKo: '베네치아',         countryCode: 'IT', countryKo: '이탈리아', lat: 45.5050, lng: 12.3519 },
  { code: 'NAP', city: 'Naples',    cityKo: '나폴리',           countryCode: 'IT', countryKo: '이탈리아', lat: 40.8860, lng: 14.2908 },

  // 프랑스
  { code: 'CDG', city: 'Paris',     cityKo: '파리 샤를드골',     countryCode: 'FR', countryKo: '프랑스', lat: 49.0097, lng: 2.5479 },
  { code: 'ORY', city: 'Paris',     cityKo: '파리 오를리',       countryCode: 'FR', countryKo: '프랑스', lat: 48.7233, lng: 2.3795 },
  { code: 'NCE', city: 'Nice',      cityKo: '니스',             countryCode: 'FR', countryKo: '프랑스', lat: 43.6584, lng: 7.2159 },
  { code: 'MRS', city: 'Marseille', cityKo: '마르세유',         countryCode: 'FR', countryKo: '프랑스', lat: 43.4393, lng: 5.2214 },

  // 영국
  { code: 'LHR', city: 'London',    cityKo: '런던 히드로',       countryCode: 'GB', countryKo: '영국', lat: 51.4700, lng: -0.4543 },
  { code: 'LGW', city: 'London',    cityKo: '런던 개트윅',       countryCode: 'GB', countryKo: '영국', lat: 51.1481, lng: -0.1903 },
  { code: 'MAN', city: 'Manchester',cityKo: '맨체스터',         countryCode: 'GB', countryKo: '영국', lat: 53.3537, lng: -2.2750 },
  { code: 'EDI', city: 'Edinburgh', cityKo: '에든버러',         countryCode: 'GB', countryKo: '영국', lat: 55.9500, lng: -3.3725 },

  // 독일
  { code: 'FRA', city: 'Frankfurt', cityKo: '프랑크푸르트',     countryCode: 'DE', countryKo: '독일', lat: 50.0379, lng: 8.5622 },
  { code: 'MUC', city: 'Munich',    cityKo: '뮌헨',             countryCode: 'DE', countryKo: '독일', lat: 48.3538, lng: 11.7861 },
  { code: 'BER', city: 'Berlin',    cityKo: '베를린 브란덴부르크', countryCode: 'DE', countryKo: '독일', lat: 52.3667, lng: 13.5033 },

  // 스페인
  { code: 'MAD', city: 'Madrid',    cityKo: '마드리드',         countryCode: 'ES', countryKo: '스페인', lat: 40.4983, lng: -3.5676 },
  { code: 'BCN', city: 'Barcelona', cityKo: '바르셀로나',       countryCode: 'ES', countryKo: '스페인', lat: 41.2974, lng: 2.0833 },

  // 이집트
  { code: 'CAI', city: 'Cairo',     cityKo: '카이로',           countryCode: 'EG', countryKo: '이집트', lat: 30.1219, lng: 31.4056 },

  // 남아공
  { code: 'JNB', city: 'Johannesburg', cityKo: '요하네스버그',  countryCode: 'ZA', countryKo: '남아공', lat: -26.1392, lng: 28.2460 },
  { code: 'CPT', city: 'Cape Town', cityKo: '케이프타운',       countryCode: 'ZA', countryKo: '남아공', lat: -33.9648, lng: 18.6017 },

  // 브라질
  { code: 'GRU', city: 'São Paulo', cityKo: '상파울루 과룰류스', countryCode: 'BR', countryKo: '브라질', lat: -23.4356, lng: -46.4731 },
  { code: 'GIG', city: 'Rio de Janeiro', cityKo: '리우데자네이루', countryCode: 'BR', countryKo: '브라질', lat: -22.8099, lng: -43.2505 },

  // 아르헨티나
  { code: 'EZE', city: 'Buenos Aires', cityKo: '부에노스아이레스', countryCode: 'AR', countryKo: '아르헨티나', lat: -34.8222, lng: -58.5358 },

  // 미국
  { code: 'JFK', city: 'New York',   cityKo: '뉴욕 JFK',        countryCode: 'US', countryKo: '미국', lat: 40.6413, lng: -73.7781 },
  { code: 'LAX', city: 'Los Angeles',cityKo: 'LA',              countryCode: 'US', countryKo: '미국', lat: 33.9416, lng: -118.4085 },
  { code: 'SFO', city: 'San Francisco', cityKo: '샌프란시스코',  countryCode: 'US', countryKo: '미국', lat: 37.6213, lng: -122.3790 },
  { code: 'ORD', city: 'Chicago',    cityKo: '시카고 오헤어',    countryCode: 'US', countryKo: '미국', lat: 41.9742, lng: -87.9073 },
  { code: 'MIA', city: 'Miami',      cityKo: '마이애미',        countryCode: 'US', countryKo: '미국', lat: 25.7959, lng: -80.2870 },
  { code: 'SEA', city: 'Seattle',    cityKo: '시애틀',          countryCode: 'US', countryKo: '미국', lat: 47.4502, lng: -122.3088 },
  { code: 'BOS', city: 'Boston',     cityKo: '보스턴',          countryCode: 'US', countryKo: '미국', lat: 42.3656, lng: -71.0096 },
  { code: 'DFW', city: 'Dallas',     cityKo: '댈러스',          countryCode: 'US', countryKo: '미국', lat: 32.8998, lng: -97.0403 },
  { code: 'HNL', city: 'Honolulu',   cityKo: '호놀룰루',        countryCode: 'US', countryKo: '미국', lat: 21.3187, lng: -157.9224 },

  // 캐나다
  { code: 'YYZ', city: 'Toronto',    cityKo: '토론토',          countryCode: 'CA', countryKo: '캐나다', lat: 43.6777, lng: -79.6248 },
  { code: 'YVR', city: 'Vancouver',  cityKo: '밴쿠버',          countryCode: 'CA', countryKo: '캐나다', lat: 49.1947, lng: -123.1792 },
  { code: 'YUL', city: 'Montreal',   cityKo: '몬트리올',        countryCode: 'CA', countryKo: '캐나다', lat: 45.4706, lng: -73.7408 },

  // 멕시코
  { code: 'MEX', city: 'Mexico City',cityKo: '멕시코시티',      countryCode: 'MX', countryKo: '멕시코', lat: 19.4361, lng: -99.0719 },
  { code: 'CUN', city: 'Cancun',     cityKo: '칸쿤',            countryCode: 'MX', countryKo: '멕시코', lat: 21.0365, lng: -86.8771 },

  // 호주
  { code: 'SYD', city: 'Sydney',     cityKo: '시드니',          countryCode: 'AU', countryKo: '호주', lat: -33.9399, lng: 151.1753 },
  { code: 'MEL', city: 'Melbourne',  cityKo: '멜버른',          countryCode: 'AU', countryKo: '호주', lat: -37.6690, lng: 144.8410 },
  { code: 'BNE', city: 'Brisbane',   cityKo: '브리즈번',        countryCode: 'AU', countryKo: '호주', lat: -27.3842, lng: 153.1175 },

  // 뉴질랜드
  { code: 'AKL', city: 'Auckland',   cityKo: '오클랜드',        countryCode: 'NZ', countryKo: '뉴질랜드', lat: -37.0082, lng: 174.7850 },
];

export function findAirport(code: string | null | undefined): Airport | null {
  if (!code) return null;
  return AIRPORTS.find((a) => a.code === code) ?? null;
}

// Country grouping order (for the optgroup labels in selects).
export const COUNTRY_GROUPS: { code: string; nameKo: string }[] = [
  { code: 'KR', nameKo: '한국' },
  { code: 'JP', nameKo: '일본' },
  { code: 'CN', nameKo: '중국' },
  { code: 'TW', nameKo: '대만' },
  { code: 'HK', nameKo: '홍콩' },
  { code: 'SG', nameKo: '싱가포르' },
  { code: 'TH', nameKo: '태국' },
  { code: 'VN', nameKo: '베트남' },
  { code: 'IN', nameKo: '인도' },
  { code: 'AE', nameKo: 'UAE' },
  { code: 'RU', nameKo: '러시아' },
  { code: 'TR', nameKo: '튀르키예' },
  { code: 'IT', nameKo: '이탈리아' },
  { code: 'FR', nameKo: '프랑스' },
  { code: 'GB', nameKo: '영국' },
  { code: 'DE', nameKo: '독일' },
  { code: 'ES', nameKo: '스페인' },
  { code: 'EG', nameKo: '이집트' },
  { code: 'ZA', nameKo: '남아공' },
  { code: 'BR', nameKo: '브라질' },
  { code: 'AR', nameKo: '아르헨티나' },
  { code: 'US', nameKo: '미국' },
  { code: 'CA', nameKo: '캐나다' },
  { code: 'MX', nameKo: '멕시코' },
  { code: 'AU', nameKo: '호주' },
  { code: 'NZ', nameKo: '뉴질랜드' },
];
