import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFlightStore } from '../../store/flightStore';
import { useSettingsStore } from '../../store/settingsStore';
import Countdown from '../../components/Countdown';
import { requestWakeLock, releaseWakeLock } from '../../lib/wakelock';

function Cloud({ delay, top, scale }: { delay: number; top: string; scale: number }) {
  return (
    <motion.div
      className="absolute w-32 h-8 bg-paper/70 rounded-full blur-sm"
      style={{ top, scale }}
      initial={{ x: '-30vw' }}
      animate={{ x: '130vw' }}
      transition={{ duration: 30, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export default function InFlight() {
  const { active, land, abort } = useFlightStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  useEffect(() => {
    requestWakeLock();
    const onVis = () => { if (document.visibilityState === 'visible') requestWakeLock(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      releaseWakeLock();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  if (!active || !active.flight.startedAt || !active.flight.plannedSeconds) return null;
  const cat = settings.categories.find(c => c.id === active.flight.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-night via-deepblue to-sunset relative overflow-hidden flex flex-col items-center justify-center gap-6">
      <Cloud delay={0} top="30%" scale={1} />
      <Cloud delay={8} top="50%" scale={0.7} />
      <Cloud delay={15} top="70%" scale={0.9} />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Countdown startedAt={active.flight.startedAt} plannedSeconds={active.flight.plannedSeconds} onExpire={land} />
        <div className="text-amber-50 text-sm tracking-widest font-mono opacity-70">
          {cat?.label} · {active.flight.seat} · {(active.flight.plannedSeconds / 60)} MIN
        </div>
      </div>
      <button onClick={() => { if (confirm('Abort flight?')) abort(); }} className="absolute top-4 right-4 text-amber-50/40 text-xs z-10">
        Abort
      </button>
    </div>
  );
}
