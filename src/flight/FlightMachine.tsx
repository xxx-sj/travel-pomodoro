import { useEffect } from 'react';
import { useFlightStore } from '../store/flightStore';
import Booking from './steps/Booking';
import SeatSelection from './steps/SeatSelection';
import BoardingPass from './steps/BoardingPass';
import CheckIn from './steps/CheckIn';
import InFlight from './steps/InFlight';
import Landed from './steps/Landed';

export default function FlightMachine() {
  const { active, lastCompleted, hydrate, startBooking } = useFlightStore();

  useEffect(() => { hydrate(); }, [hydrate]);

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

  switch (active.step) {
    case 'booking': return <Booking />;
    case 'seat': return <SeatSelection />;
    case 'boarding': return <BoardingPass />;
    case 'checkin': return <CheckIn />;
    case 'inflight': return <InFlight />;
    case 'landed': return <Landed flight={{ id: 'pending', category: '', plannedSeconds: 0, actualSeconds: 0, seat: '', startedAt: 0, completedAt: null, status: 'completed' }} />;
  }
}
