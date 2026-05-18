import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFlightStore } from '../store/flightStore';
import { loadActive } from '../lib/storage';
import { isExpired } from '../lib/timer';
import { audioBus } from '../lib/audio';
import ResumeModal from './ResumeModal';
import Booking from './steps/Booking';
import BoardingPass from './steps/BoardingPass';
import CheckIn from './steps/CheckIn';
import InFlight from './steps/InFlight';
import Landed from './steps/Landed';

export default function FlightMachine() {
  const { active, lastCompleted, hydrate, startBooking, abort, land } = useFlightStore();
  const [showResume, setShowResume] = useState(false);

  // On mount, only check localStorage for a saved flight — DON'T hydrate the
  // store yet. Hydrating immediately would make <MusicLayer> see the active
  // flight and autoplay music before the user has confirmed Resume.
  useEffect(() => {
    const a = loadActive();
    if (a) setShowResume(true);
  }, []);

  function onResume() {
    setShowResume(false);
    // Resume button click is a user gesture — safe to wake AudioContext.
    audioBus.resume();
    // Now hydrate so the store (and <MusicLayer>) actually see the flight.
    hydrate();
    const a = useFlightStore.getState().active;

    if (
      a?.step === 'inflight' &&
      a.flight.startedAt &&
      a.flight.plannedSeconds &&
      isExpired(a.flight.startedAt, a.flight.plannedSeconds)
    ) {
      land();
      return;
    }

    if (a?.step === 'inflight') {
      audioBus.play('engine');
      // Music auto-starts via <MusicLayer> now that active is in the store.
    }
  }

  function onDiscard() {
    // Store is still empty (we never hydrated), but the legacy flight is in
    // localStorage. Clear it via the store action which also handles audio.
    hydrate();
    abort();
    setShowResume(false);
  }

  if (showResume) {
    return <ResumeModal onResume={onResume} onAbort={onDiscard} />;
  }

  if (!active && lastCompleted) return <Landed flight={lastCompleted} />;

  if (!active) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">FocusFlight</h1>
        <button onClick={startBooking} className="bg-orange-500 text-white px-6 py-3 rounded-lg">
          Book a flight
        </button>
      </div>
    );
  }

  function renderStep() {
    switch (active!.step) {
      case 'booking': return <Booking />;
      case 'boarding': return <BoardingPass />;
      case 'checkin': return <CheckIn />;
      case 'inflight': return <InFlight />;
      case 'landed': return <Landed flight={{ id: 'pending', category: '', plannedSeconds: 0, actualSeconds: 0, seat: '', startedAt: 0, completedAt: null, status: 'completed' }} />;
    }
  }

  return (
    <motion.div
      key={active.step}
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {renderStep()}
    </motion.div>
  );
}
