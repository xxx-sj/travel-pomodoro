import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFlightStore } from '../store/flightStore';
import { useSettingsStore } from '../store/settingsStore';
import { audioBus } from '../lib/audio';
import { findTrack } from '../lofi';
import { youtubeIdFromTrack } from '../lib/youtube';

const hiddenStyle: React.CSSProperties = {
  position: 'fixed',
  top: -400,
  left: -400,
  width: 320,
  height: 180,
  opacity: 0,
  pointerEvents: 'none',
};

const VIDEO_W = 320;
const VIDEO_H = 180;

// Volume control for the YouTube iframe uses postMessage to the embedded
// player. Requires `enablejsapi=1` in the iframe URL.
function sendYouTubeCommand(iframe: HTMLIFrameElement, func: string, args: unknown[] = []) {
  try {
    iframe.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      'https://www.youtube.com',
    );
  } catch {
    /* cross-origin or not ready yet — ignore */
  }
}

/**
 * Declarative music playback layer. Mounts the appropriate <audio> element or
 * YouTube <iframe> while the user is in-flight AND a track is selected. For
 * YouTube tracks, talks to the embedded player via postMessage so that the
 * sound panel's music-volume slider also adjusts YouTube volume.
 */
export default function MusicLayer() {
  const active = useFlightStore((s) => s.active);
  const musicVolume = useSettingsStore((s) =>
    s.settings.soundEnabled ? s.settings.musicVolume : 0
  );
  const showVideo = useSettingsStore((s) => s.settings.showMusicVideo);

  const inFlight = active?.step === 'inflight';
  const preset = inFlight ? findTrack(active?.lofiTrack) : null;
  const ytId = inFlight ? youtubeIdFromTrack(active?.lofiTrack) : null;

  // Seconds elapsed since the flight started — used to seek music forward on
  // reload so it stays in sync with the countdown instead of restarting.
  // Read once at mount via useRef so we don't keep re-rendering iframe src.
  const elapsedAtMountRef = useRef<number>(0);
  if (elapsedAtMountRef.current === 0 && inFlight && active?.flight.startedAt) {
    elapsedAtMountRef.current = Math.max(
      0,
      Math.floor((Date.now() - active.flight.startedAt) / 1000),
    );
  }
  const startAtSeconds = elapsedAtMountRef.current;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Sync volume changes to the preset <audio> element.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = musicVolume;
  }, [musicVolume]);

  // Seek preset audio to the elapsed position on mount so a refresh during a
  // long flight doesn't snap the loop back to 0:00.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || startAtSeconds <= 0) return;
    const seek = () => {
      if (el && isFinite(el.duration) && el.duration > 0) {
        el.currentTime = startAtSeconds % el.duration;
      }
    };
    if (el.readyState >= 1) seek();
    else el.addEventListener('loadedmetadata', seek, { once: true });
  }, [preset?.id, startAtSeconds]);

  // Sync volume to the YouTube iframe whenever it changes. The player API
  // expects integers 0..100. We re-send on a short delay too in case the
  // iframe wasn't ready yet on first call.
  useEffect(() => {
    if (!iframeRef.current || !ytId) return;
    const iframe = iframeRef.current;
    const pct = Math.round(musicVolume * 100);
    sendYouTubeCommand(iframe, 'setVolume', [pct]);
    const retry = window.setTimeout(() => sendYouTubeCommand(iframe, 'setVolume', [pct]), 800);
    return () => clearTimeout(retry);
  }, [musicVolume, ytId]);

  // Tell the FX bus when music is active so it can duck the engine.
  useEffect(() => {
    audioBus.setMusicActive(!!(preset || ytId));
    return () => audioBus.setMusicActive(false);
  }, [preset, ytId]);

  return (
    <>
      {preset && (
        <audio
          key={preset.id}
          ref={(el) => {
            audioRef.current = el;
            if (el) el.volume = musicVolume;
          }}
          src={preset.url}
          loop
          autoPlay
          style={hiddenStyle as React.CSSProperties}
        />
      )}
      {ytId && (
        showVideo ? (
          // Draggable mini player — Framer Motion drag on the wrapper, iframe
          // has pointer-events:none so the entire surface acts as a drag handle.
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.05}
            initial={{ y: '-50%' }}
            style={{
              position: 'fixed',
              top: '50%',
              left: 16,
              width: VIDEO_W,
              height: VIDEO_H + 22,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              zIndex: 60,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(0,0,0,0.85)',
              cursor: 'grab',
              touchAction: 'none',
            }}
            whileDrag={{ cursor: 'grabbing' }}
          >
            <div className="text-[10px] text-white/60 px-2 py-1 select-none border-b border-white/10">
              ⠿ 드래그하여 이동
            </div>
            <iframe
              key={ytId}
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&enablejsapi=1${startAtSeconds > 0 ? `&start=${startAtSeconds}` : ''}`}
              title="비행 중 음악"
              allow="autoplay; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => {
                const iframe = iframeRef.current;
                if (!iframe) return;
                sendYouTubeCommand(iframe, 'addEventListener', ['onReady']);
                sendYouTubeCommand(iframe, 'setVolume', [Math.round(musicVolume * 100)]);
                if (startAtSeconds > 0) {
                  sendYouTubeCommand(iframe, 'seekTo', [startAtSeconds, true]);
                }
              }}
              // Disable pointer events so the wrapper captures drag gestures.
              style={{ width: '100%', height: VIDEO_H, border: 0, pointerEvents: 'none' }}
            />
          </motion.div>
        ) : (
          <div style={hiddenStyle}>
            <iframe
              key={ytId}
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&enablejsapi=1${startAtSeconds > 0 ? `&start=${startAtSeconds}` : ''}`}
              title="비행 중 음악"
              allow="autoplay; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => {
                const iframe = iframeRef.current;
                if (!iframe) return;
                sendYouTubeCommand(iframe, 'addEventListener', ['onReady']);
                sendYouTubeCommand(iframe, 'setVolume', [Math.round(musicVolume * 100)]);
                if (startAtSeconds > 0) {
                  sendYouTubeCommand(iframe, 'seekTo', [startAtSeconds, true]);
                }
              }}
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          </div>
        )
      )}
    </>
  );
}
