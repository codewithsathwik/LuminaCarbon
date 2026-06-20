import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Settings from '../app/settings/page';

describe('Settings Page', () => {
  let originalConfirm: typeof window.confirm;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      'carbon_activities',
      JSON.stringify([{ id: '1', title: 'Test', category: 'Energy', impact: 1, date: new Date().toISOString() }])
    );
    localStorage.setItem(
      'carbon_profile',
      JSON.stringify({ name: 'Test User', monthlyGoal: 2, dailyWaterTarget: 100 })
    );
    localStorage.setItem('carbon_water_logs', JSON.stringify([]));

    // Replace confirm with a mock that returns true by default
    originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    jest.useFakeTimers();
  });

  afterEach(() => {
    window.confirm = originalConfirm;
    jest.runAllTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders the Settings heading', () => {
      render(<Settings />);
      expect(screen.getByRole('heading', { level: 1, name: /Settings/i })).toBeInTheDocument();
    });

    it('renders the Data Management section', () => {
      render(<Settings />);
      expect(screen.getByText(/Data Management/i)).toBeInTheDocument();
    });

    it('renders the Danger Zone section', () => {
      render(<Settings />);
      expect(screen.getByText(/Danger Zone/i)).toBeInTheDocument();
    });

    it('renders the Clear All Data button', () => {
      render(<Settings />);
      expect(screen.getByRole('button', { name: /Clear All Data/i })).toBeInTheDocument();
    });

    it('renders a warning description about the action being irreversible', () => {
      render(<Settings />);
      expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();
    });
  });

  describe('Clear Data interaction', () => {
    it('prompts for confirmation when Clear All Data is clicked', () => {
      render(<Settings />);
      const clearButton = screen.getByRole('button', { name: /Clear All Data/i });
      act(() => { fireEvent.click(clearButton); });
      expect(window.confirm).toHaveBeenCalledTimes(1);
    });

    it('passes the correct message to window.confirm', () => {
      render(<Settings />);
      const clearButton = screen.getByRole('button', { name: /Clear All Data/i });
      act(() => { fireEvent.click(clearButton); });
      expect(window.confirm).toHaveBeenCalledWith(
        expect.stringContaining('Are you sure')
      );
    });

    it('removes carbon_activities from localStorage when confirmed', () => {
      render(<Settings />);
      const clearButton = screen.getByRole('button', { name: /Clear All Data/i });
      act(() => { fireEvent.click(clearButton); });
      expect(localStorage.getItem('carbon_activities')).toBeNull();
    });

    it('removes carbon_profile from localStorage when confirmed', () => {
      render(<Settings />);
      const clearButton = screen.getByRole('button', { name: /Clear All Data/i });
      act(() => { fireEvent.click(clearButton); });
      expect(localStorage.getItem('carbon_profile')).toBeNull();
    });

    it('removes carbon_water_logs from localStorage when confirmed', () => {
      render(<Settings />);
      const clearButton = screen.getByRole('button', { name: /Clear All Data/i });
      act(() => { fireEvent.click(clearButton); });
      expect(localStorage.getItem('carbon_water_logs')).toBeNull();
    });

    it('shows "Data Cleared!" text after clicking clear and confirming', () => {
      render(<Settings />);
      const clearButton = screen.getByRole('button', { name: /Clear All Data/i });
      act(() => { fireEvent.click(clearButton); });
      expect(screen.getByText(/Data Cleared!/i)).toBeInTheDocument();
    });

    it('disables the button after clearing', () => {
      render(<Settings />);
      const clearButton = screen.getByRole('button', { name: /Clear All Data/i });
      act(() => { fireEvent.click(clearButton); });
      expect(clearButton).toBeDisabled();
    });

    it('does NOT clear data when user cancels the confirmation', () => {
      (window.confirm as jest.Mock).mockReturnValueOnce(false);
      render(<Settings />);
      const clearButton = screen.getByRole('button', { name: /Clear All Data/i });
      act(() => { fireEvent.click(clearButton); });
      expect(localStorage.getItem('carbon_activities')).not.toBeNull();
    });

    it('does NOT clear profile data when user cancels the confirmation', () => {
      (window.confirm as jest.Mock).mockReturnValueOnce(false);
      render(<Settings />);
      const clearButton = screen.getByRole('button', { name: /Clear All Data/i });
      act(() => { fireEvent.click(clearButton); });
      expect(localStorage.getItem('carbon_profile')).not.toBeNull();
    });

    it('does NOT show Data Cleared text when user cancels', () => {
      (window.confirm as jest.Mock).mockReturnValueOnce(false);
      render(<Settings />);
      const clearButton = screen.getByRole('button', { name: /Clear All Data/i });
      act(() => { fireEvent.click(clearButton); });
      expect(screen.queryByText(/Data Cleared!/i)).not.toBeInTheDocument();
    });
  });
});
