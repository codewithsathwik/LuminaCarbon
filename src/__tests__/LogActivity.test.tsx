import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import LogActivity from '../app/log/page';
import { CarbonProvider } from '../context/CarbonContext';

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const renderLog = () =>
  render(
    <CarbonProvider>
      <LogActivity />
    </CarbonProvider>
  );

describe('Log Activity Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders the Log Activity heading', () => {
      renderLog();
      expect(screen.getByRole('heading', { level: 1, name: /Log Activity/i })).toBeInTheDocument();
    });

    it('renders the Carbon Footprint tab', () => {
      renderLog();
      expect(screen.getByRole('button', { name: /Carbon Footprint/i })).toBeInTheDocument();
    });

    it('renders the Water Footprint tab', () => {
      renderLog();
      expect(screen.getByRole('button', { name: /Water Footprint/i })).toBeInTheDocument();
    });

    it('shows the carbon form details input by default', () => {
      renderLog();
      // Use the id directly to avoid ambiguity
      const detailsInput = document.getElementById('details-input');
      expect(detailsInput).toBeInTheDocument();
    });

    it('shows the carbon form value input by default', () => {
      renderLog();
      const valueInput = document.getElementById('duration-input');
      expect(valueInput).toBeInTheDocument();
    });

    it("renders Today's Summary section", () => {
      renderLog();
      expect(screen.getByText(/Today's Summary/i)).toBeInTheDocument();
    });

    it('shows category selection options', () => {
      renderLog();
      // Use getAllByText to handle duplicate text (appears in form + summary)
      expect(screen.getAllByText('Transportation').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Energy').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Diet').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Shopping').length).toBeGreaterThan(0);
    });
  });

  describe('Tab switching', () => {
    it('switches to water form when Water Footprint tab is clicked', () => {
      renderLog();
      const waterTab = screen.getByRole('button', { name: /Water Footprint/i });
      act(() => { fireEvent.click(waterTab); });

      const litersInput = document.getElementById('liters-input');
      expect(litersInput).toBeInTheDocument();
    });

    it('shows water type options after switching to water tab', () => {
      renderLog();
      const waterTab = screen.getByRole('button', { name: /Water Footprint/i });
      act(() => { fireEvent.click(waterTab); });

      expect(screen.getByText('Bucket Bath')).toBeInTheDocument();
      expect(screen.getByText('Shower')).toBeInTheDocument();
      expect(screen.getByText('RO Reject Water')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });

    it('switches back to carbon form from water tab', () => {
      renderLog();
      const waterTab = screen.getByRole('button', { name: /Water Footprint/i });
      act(() => { fireEvent.click(waterTab); });

      const carbonTab = screen.getByRole('button', { name: /Carbon Footprint/i });
      act(() => { fireEvent.click(carbonTab); });

      const detailsInput = document.getElementById('details-input');
      expect(detailsInput).toBeInTheDocument();
    });
  });

  describe('Carbon form submission', () => {
    it('submits a carbon activity and shows success state', async () => {
      renderLog();

      const detailsInput = document.getElementById('details-input') as HTMLInputElement;
      const valueInput = document.getElementById('duration-input') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /Calculate & Log Impact/i });

      act(() => {
        fireEvent.change(detailsInput, { target: { value: 'Drove to work' } });
        fireEvent.change(valueInput, { target: { value: '10' } });
      });

      act(() => { fireEvent.click(submitButton); });

      // After successful submission, the button changes text
      expect(screen.getByText(/Activity Logged!/i)).toBeInTheDocument();
    });

    it('clears the form inputs after submission', () => {
      renderLog();

      const detailsInput = document.getElementById('details-input') as HTMLInputElement;
      const valueInput = document.getElementById('duration-input') as HTMLInputElement;

      act(() => {
        fireEvent.change(detailsInput, { target: { value: 'Drove to work' } });
        fireEvent.change(valueInput, { target: { value: '10' } });
      });

      act(() => { fireEvent.submit(detailsInput.closest('form')!); });

      expect(detailsInput.value).toBe('');
      expect(valueInput.value).toBe('');
    });
  });

  describe('Water form submission', () => {
    it('submits a water log and shows success state', () => {
      renderLog();

      const waterTab = screen.getByRole('button', { name: /Water Footprint/i });
      act(() => { fireEvent.click(waterTab); });

      const litersInput = document.getElementById('liters-input') as HTMLInputElement;
      act(() => {
        fireEvent.change(litersInput, { target: { value: '30' } });
      });

      const submitButton = screen.getByRole('button', { name: /Log Water Usage/i });
      act(() => { fireEvent.click(submitButton); });

      expect(screen.getByText(/Water Logged!/i)).toBeInTheDocument();
    });

    it('clears liters input after water log submission', () => {
      renderLog();

      const waterTab = screen.getByRole('button', { name: /Water Footprint/i });
      act(() => { fireEvent.click(waterTab); });

      const litersInput = document.getElementById('liters-input') as HTMLInputElement;
      act(() => {
        fireEvent.change(litersInput, { target: { value: '30' } });
      });

      act(() => { fireEvent.submit(litersInput.closest('form')!); });
      expect(litersInput.value).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('carbon details input has a unique id', () => {
      renderLog();
      expect(document.getElementById('details-input')).toBeInTheDocument();
    });

    it('carbon value input has a unique id', () => {
      renderLog();
      expect(document.getElementById('duration-input')).toBeInTheDocument();
    });

    it('contains an aria-live region for screen reader announcements', () => {
      renderLog();
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });

    it('water liters input has a unique id', () => {
      renderLog();
      const waterTab = screen.getByRole('button', { name: /Water Footprint/i });
      act(() => { fireEvent.click(waterTab); });
      expect(document.getElementById('liters-input')).toBeInTheDocument();
    });
  });
});
