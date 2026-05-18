import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import { useFlightStore } from '../src/store/flightStore';
import { loadHistory } from '../src/lib/storage';

describe('Flight full flow', () => {
  beforeEach(() => {
    localStorage.clear();
    useFlightStore.setState({ active: null, lastCompleted: null });
  });

  it('booking → landed via direct startFlight bypass appends to history', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    // Booking step auto-opens (no more "Book a flight" intro screen).
    // Wait for the Duration buttons to render.
    await screen.findByText('25m');
    await user.click(screen.getByText('25m'));
    await user.click(screen.getByText('일'));

    // New: origin + destination dropdowns
    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'KR');
    await user.selectOptions(selects[1], 'JP');

    await user.click(screen.getByText(/다음: 보딩패스/));
    await user.click(screen.getByText(/체크인/));

    // bypass drag — directly call startFlight
    useFlightStore.getState().startFlight();

    // advance clock past plannedSeconds; Countdown's onExpire should land()
    vi.advanceTimersByTime(25 * 60 * 1000 + 2000);
    await vi.runOnlyPendingTimersAsync();

    expect(loadHistory().length).toBe(1);
    expect(loadHistory()[0].category).toBe('work');
    // seat is auto-assigned (random) at startBooking now
    expect(loadHistory()[0].seat).toMatch(/^([1-9]|10)[A-F]$/);
    vi.useRealTimers();
  });
});
