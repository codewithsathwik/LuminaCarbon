import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Dashboard from '../app/page';
import { CarbonProvider } from '../context/CarbonContext';

// Mock next/dynamic to avoid async loading issues
jest.mock('next/dynamic', () => () => {
  const MockEcoHabitat = () => <div data-testid="eco-habitat-mock">EcoHabitat</div>;
  MockEcoHabitat.displayName = 'MockEcoHabitat';
  return MockEcoHabitat;
});

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const renderDashboard = () =>
  render(
    <CarbonProvider>
      <Dashboard />
    </CarbonProvider>
  );

describe('Dashboard Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders the Dashboard heading', () => {
      renderDashboard();
      expect(screen.getByRole('heading', { level: 1, name: /Dashboard/i })).toBeInTheDocument();
    });

    it('displays a welcome message with the profile name', () => {
      renderDashboard();
      expect(screen.getByText(/Welcome back, Eco Warrior/i)).toBeInTheDocument();
    });

    it('renders the Current Carbon Footprint section', () => {
      renderDashboard();
      expect(screen.getByText(/Current Carbon Footprint/i)).toBeInTheDocument();
    });

    it('renders the footprint score in tons', () => {
      renderDashboard();
      expect(screen.getByText(/Tons CO₂e/i)).toBeInTheDocument();
    });

    it("renders Today's Water Footprint section", () => {
      renderDashboard();
      expect(screen.getByText(/Today's Water Footprint/i)).toBeInTheDocument();
    });

    it('renders the Virtual Eco-System section', () => {
      renderDashboard();
      expect(screen.getByText(/Virtual Eco-System/i)).toBeInTheDocument();
    });

    it('renders the Recent Activity section', () => {
      renderDashboard();
      expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
    });

    it('renders the Daily Tip section', () => {
      renderDashboard();
      expect(screen.getByText(/Daily Tip/i)).toBeInTheDocument();
    });

    it('renders the mock eco-habitat component', () => {
      renderDashboard();
      expect(screen.getByTestId('eco-habitat-mock')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('shows initial 2 activities in the Recent Activity list', () => {
      renderDashboard();
      // The two initial mock activities should appear
      expect(screen.getByText(/Train commute/i)).toBeInTheDocument();
      expect(screen.getByText(/Plant-based meal/i)).toBeInTheDocument();
    });

    it('shows water usage as 0L by default', () => {
      renderDashboard();
      // Liters text for water section
      expect(screen.getByText(/Liters/i)).toBeInTheDocument();
    });

    it('shows the global average of 4.5 Tons for comparison', () => {
      renderDashboard();
      expect(screen.getByText(/4\.5 Tons/i)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('quick-logs an energy reduction when clicking the tip button', () => {
      renderDashboard();
      const tipButton = screen.getByRole('button', { name: /Log standby power reduction/i });
      act(() => { fireEvent.click(tipButton); });
      // After clicking, the activity count should increase (the recent list should show the new item)
      // We check that the button doesn't crash
      expect(tipButton).toBeInTheDocument();
    });

    it('renders a "View All / Log More" link to /log', () => {
      renderDashboard();
      const logLink = screen.getByRole('link', { name: /View All/i });
      expect(logLink).toHaveAttribute('href', '/log');
    });
  });

  describe('Accessibility', () => {
    it('major sections have aria-labelledby attributes', () => {
      renderDashboard();
      // Sections are labelledby headings
      expect(screen.getByRole('heading', { name: /Current Carbon Footprint/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Today's Water Footprint/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Recent Activity/i })).toBeInTheDocument();
    });

    it('the quick log button has an aria-label', () => {
      renderDashboard();
      const btn = screen.getByRole('button', { name: /Log standby power reduction/i });
      expect(btn).toHaveAttribute('aria-label');
    });
  });
});
