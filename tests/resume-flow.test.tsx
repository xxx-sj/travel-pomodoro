import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import { saveActive, loadHistory } from '../src/lib/storage';
import { useFlightStore } from '../src/store/flightStore';

describe('Resume flow', () => {
  beforeEach(() => {
    localStorage.clear();
    useFlightStore.setState({ active: null, lastCompleted: null });
  });

  it('shows resume modal when active exists on mount', async () => {
    saveActive({ step: 'inflight', flight: { id: 'x', startedAt: Date.now(), plannedSeconds: 1500, category: 'work', seat: '1A' } });
    render(<App />);
    expect(await screen.findByText(/비행을 이어갈까요/)).toBeInTheDocument();
  });

  it('Discard clears active and auto-opens a fresh Booking', async () => {
    saveActive({ step: 'inflight', flight: { id: 'x', startedAt: Date.now(), plannedSeconds: 1500, category: 'work', seat: '1A' } });
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByText('삭제'));
    // After discard, the intro screen is gone — we jump straight to Booking.
    expect(await screen.findByText('25m')).toBeInTheDocument();
  });

  it('lands immediately when resuming an already-expired flight', async () => {
    const past = Date.now() - 30 * 60 * 1000;
    saveActive({ step: 'inflight', flight: { id: 'x', startedAt: past, plannedSeconds: 60, category: 'work', seat: '1A' } });
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByText('이어가기'));
    expect(loadHistory().length).toBe(1);
  });
});
