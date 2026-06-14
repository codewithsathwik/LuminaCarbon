import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CarbonProvider, useCarbon } from '../context/CarbonContext';

// A simple test component to consume the context
const TestComponent = () => {
  const { activities, waterLogs, profile, footprintScoreTons, addActivity, addWaterLog } = useCarbon();

  return (
    <div>
      <div data-testid="profile-name">{profile.name}</div>
      <div data-testid="footprint-score">{footprintScoreTons}</div>
      <div data-testid="activity-count">{activities.length}</div>
      <div data-testid="water-count">{waterLogs.length}</div>
      <button 
        onClick={() => addActivity({ title: 'Test Activity', category: 'Energy', impact: 1.5 })}
        data-testid="add-activity"
      >
        Add Activity
      </button>
      <button 
        onClick={() => addWaterLog({ type: 'Shower', liters: 50 })}
        data-testid="add-water"
      >
        Add Water
      </button>
    </div>
  );
};

describe('CarbonContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('provides default values initially', () => {
    render(
      <CarbonProvider>
        <TestComponent />
      </CarbonProvider>
    );

    expect(screen.getByTestId('profile-name')).toHaveTextContent('Eco Warrior');
    expect(screen.getByTestId('activity-count')).toHaveTextContent('2'); // 2 initial mock activities
    expect(screen.getByTestId('water-count')).toHaveTextContent('0');
  });

  it('allows adding an activity', () => {
    render(
      <CarbonProvider>
        <TestComponent />
      </CarbonProvider>
    );

    const button = screen.getByTestId('add-activity');
    act(() => {
      button.click();
    });

    expect(screen.getByTestId('activity-count')).toHaveTextContent('3');
  });

  it('allows adding a water log', () => {
    render(
      <CarbonProvider>
        <TestComponent />
      </CarbonProvider>
    );

    const button = screen.getByTestId('add-water');
    act(() => {
      button.click();
    });

    expect(screen.getByTestId('water-count')).toHaveTextContent('1');
  });
});
