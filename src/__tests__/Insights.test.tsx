import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Insights from '../app/insights/page';
import { CarbonProvider } from '../context/CarbonContext';

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const renderInsights = () =>
  render(
    <CarbonProvider>
      <Insights />
    </CarbonProvider>
  );

describe('Insights Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders the Awareness & Action Hub heading', () => {
      renderInsights();
      expect(screen.getByRole('heading', { level: 1, name: /Awareness & Action Hub/i })).toBeInTheDocument();
    });

    it('renders the Monthly Carbon Goal section', () => {
      renderInsights();
      expect(screen.getByRole('heading', { name: /Monthly Carbon Goal/i })).toBeInTheDocument();
    });

    it('renders the Actionable Tips section', () => {
      renderInsights();
      expect(screen.getByText(/Actionable Tips/i)).toBeInTheDocument();
    });

    it('renders all 3 actionable tip cards', () => {
      renderInsights();
      expect(screen.getByText(/Upgrade to 5-Star BEE Appliances/i)).toBeInTheDocument();
      expect(screen.getByText(/Utilize Metro & Carpooling/i)).toBeInTheDocument();
      expect(screen.getByText(/Local & Seasonal Diet/i)).toBeInTheDocument();
    });

    it('renders the Waste Management section', () => {
      renderInsights();
      expect(screen.getByText(/Waste Management & E-Waste Hub/i)).toBeInTheDocument();
    });

    it('renders Urban Waste Segregation card', () => {
      renderInsights();
      expect(screen.getByText(/Urban Waste Segregation/i)).toBeInTheDocument();
    });

    it('renders E-Waste Disposal card', () => {
      renderInsights();
      expect(screen.getByText(/E-Waste Disposal/i)).toBeInTheDocument();
    });

    it('renders the Direct Action section with 3 initiatives', () => {
      renderInsights();
      expect(screen.getByText(/Cauvery Calling/i)).toBeInTheDocument();
      expect(screen.getByText(/Lake Cleanup Drives/i)).toBeInTheDocument();
      expect(screen.getByText(/PM Surya Ghar/i)).toBeInTheDocument();
    });
  });

  describe('Goal progress display', () => {
    it('shows current footprint value', () => {
      renderInsights();
      expect(screen.getByText(/Current/i)).toBeInTheDocument();
    });

    it('shows the monthly target value', () => {
      renderInsights();
      expect(screen.getByText(/Target/i)).toBeInTheDocument();
    });

    it('displays contextual remaining goal message', () => {
      renderInsights();
      // Default footprint is above 1.9t goal, so message should mention remaining or exceeded
      const messageEl = screen.getByText(/remaining|exceeded/i);
      expect(messageEl).toBeInTheDocument();
    });
  });

  describe('Tip actions', () => {
    it('renders action buttons for each tip', () => {
      renderInsights();
      // Each tip card has an ArrowRight button
      const actionButtons = document.querySelectorAll('button');
      // At least 3 tip buttons + other page buttons
      expect(actionButtons.length).toBeGreaterThanOrEqual(3);
    });

    it('marks a tip as completed when its action button is clicked', () => {
      renderInsights();
      const actionButtons = document.querySelectorAll('button');
      // Click the first tip action button
      act(() => { fireEvent.click(actionButtons[0]); });
      // After clicking, "Action Logged!" overlay should appear
      expect(screen.getByText(/Action Logged!/i)).toBeInTheDocument();
    });

    it('disables a tip action button after it is completed', () => {
      renderInsights();
      const actionButtons = document.querySelectorAll('button');
      act(() => { fireEvent.click(actionButtons[0]); });
      // The button should now be disabled
      expect(actionButtons[0]).toBeDisabled();
    });
  });

  describe('Waste segregation content', () => {
    it('shows wet waste green bin info', () => {
      renderInsights();
      expect(screen.getByText(/Wet Waste/i)).toBeInTheDocument();
    });

    it('shows dry waste blue bin info', () => {
      renderInsights();
      expect(screen.getByText(/Dry Waste/i)).toBeInTheDocument();
    });

    it('shows hazardous waste info', () => {
      renderInsights();
      expect(screen.getByText(/Hazardous/i)).toBeInTheDocument();
    });
  });
});
