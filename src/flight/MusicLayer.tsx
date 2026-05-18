import { useEffect, useRef } from 'react';
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

  const inFlight = active?.step === 'inflight';
  const preset = inFlight ? findTrack(active?.lofiTrack) : null;
  const ytId = inFlight ? youtubeIdFromTrack(active?.lofiTrack) : null;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Sync volume changes to the preset <audio> element.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = musicVolume;
  }, [musicVolume]);

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
        <div style={hiddenStyle}>
          <iframe
            key={ytId}
            ref={iframeRef}
            // enablejsapi=1 lets us drive the player via postMessage.
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&enablejsapi=1`}
            title="In-flight music"
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => {
              const iframe = iframeRef.current;
              if (!iframe) return;
              // YouTube only accepts commands after a "listening" handshake.
              sendYouTubeCommand(iframe, 'addEventListener', ['onReady']);
              sendYouTubeCommand(iframe, 'setVolume', [Math.round(musicVolume * 100)]);
            }}
            style={{ width: '100%', height: '100%', border: 0 }}
          />
        </div>
      )}
    </>
  );
}
