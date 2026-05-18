# Sound Credits

| 파일 | 생성 방법 | 길이 |
|---|---|---|
| `takeoff.mp3` | ffmpeg: brown noise crescendo + low-pass + compressor | 6s |
| `engine.mp3` | ffmpeg: brown noise 20s, low-pass 800Hz, **no fades** (seamless loop) | 20s loop |
| `landing.mp3` | ffmpeg: two-tone bell (880Hz → 523Hz) | ~1.1s |
| `captain_takeoff.mp3` | macOS `say -v Daniel` + ffmpeg PA filter (highpass 300Hz + lowpass 3400Hz + compressor) | ~8s |
| `captain_landing.mp3` | macOS `say -v Daniel` + ffmpeg PA filter | ~7s |

라이선스: 모두 합성 (라이선스 제약 없음).

## 기장 대사

- `captain_takeoff.mp3` — "Ladies and gentlemen, this is your captain speaking. We are cleared for takeoff. Sit back, relax, and have a focused flight."
- `captain_landing.mp3` — "Ladies and gentlemen, this is your captain. We have reached our destination. Thank you for flying FocusFlight."

## 재생 타이밍

이륙:
- t=0.35s — takeoff (엔진 굉음)
- t=1.85s — engine (캐빈 앰비언트, 루프 시작)
- t=3.85s — captain_takeoff (기장 안내)

착륙:
- t=0s — engine 페이드아웃
- t=0s — captain_landing (기장 안내)
- t=5.5s — landing (착륙 챠임)
