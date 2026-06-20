import React from 'react';
import { render, screen } from '@testing-library/react';
import { CarbonProvider } from '../context/CarbonContext';

// Mock recharts entirely before any imports to avoid SVG DOM issues in jsdom
jest.mock('recharts', () => {
  return {
    PieChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    Pie: ({ data }: { data?: { name: string; value: number }[] }) => (
      <div data-testid="pie">
        {(data || []).map((d) => (
          <span key={d.name} data-testid={`slice-${d.name}`}>
            {d.name}: {d.value}
          </span>
        ))}
      </div>
    ),
    Cell: () => <span data-testid="cell" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

// Import after mocking
import EmissionsBreakdownChart from '../components/DashboardCharts';

const renderChart = () =>
  render(
    <CarbonProvider>
      <EmissionsBreakdownChart />
    </CarbonProvider>
  );

describe('EmissionsBreakdownChart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders the responsive container', () => {
      renderChart();
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('renders the pie chart', () => {
      renderChart();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('renders the pie element', () => {
      renderChart();
      expect(screen.getByTestId('pie')).toBeInTheDocument();
    });

    it('renders emissions slices for Transportation category', () => {
      renderChart();
      expect(screen.getByTestId('slice-Transportation')).toBeInTheDocument();
    });

    it('renders emissions slices for Energy category', () => {
      renderChart();
      expect(screen.getByTestId('slice-Energy')).toBeInTheDocument();
    });

    it('renders emissions slices for Diet category', () => {
      renderChart();
      expect(screen.getByTestId('slice-Diet')).toBeInTheDocument();
    });

    it('renders emissions slices for Shopping category', () => {
      renderChart();
      expect(screen.getByTestId('slice-Shopping')).toBeInTheDocument();
    });

    it('renders a tooltip component', () => {
      renderChart();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('renders a legend component', () => {
      renderChart();
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
  });

  describe('Data integrity', () => {
    it('Transportation category has a positive value', () => {
      renderChart();
      const slice = screen.getByTestId('slice-Transportation');
      const value = parseFloat((slice.textContent || '').split(': ')[1]);
      expect(value).toBeGreaterThan(0);
    });

    it('Energy category has a positive value', () => {
      renderChart();
      const slice = screen.getByTestId('slice-Energy');
      const value = parseFloat((slice.textContent || '').split(': ')[1]);
      expect(value).toBeGreaterThan(0);
    });

    it('Diet category has a positive value', () => {
      renderChart();
      const slice = screen.getByTestId('slice-Diet');
      const value = parseFloat((slice.textContent || '').split(': ')[1]);
      expect(value).toBeGreaterThan(0);
    });

    it('Shopping category has a positive value', () => {
      renderChart();
      const slice = screen.getByTestId('slice-Shopping');
      const value = parseFloat((slice.textContent || '').split(': ')[1]);
      expect(value).toBeGreaterThan(0);
    });
  });
});
