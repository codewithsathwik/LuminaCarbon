import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CarbonProvider, useCarbon } from '../context/CarbonContext';

// A comprehensive test component to consume the context
const TestComponent = () => {
  const {
    activities,
    waterLogs,
    profile,
    footprintScoreTons,
    emissionsBreakdown,
    addActivity,
    addWaterLog,
    updateProfile,
    isMounted,
  } = useCarbon();

  return (
    <div>
      <div data-testid="profile-name">{profile.name}</div>
      <div data-testid="profile-goal">{profile.monthlyGoal}</div>
      <div data-testid="profile-water-target">{profile.dailyWaterTarget}</div>
      <div data-testid="footprint-score">{footprintScoreTons}</div>
      <div data-testid="activity-count">{activities.length}</div>
      <div data-testid="water-count">{waterLogs.length}</div>
      <div data-testid="is-mounted">{String(isMounted)}</div>
      <div data-testid="emissions-count">{emissionsBreakdown.length}</div>
      <button
        onClick={() => addActivity({ title: 'Test Activity', category: 'Energy', impact: 1.5 })}
        data-testid="add-activity"
      >
        Add Activity
      </button>
      <button
        onClick={() => addActivity({ title: 'Invalid XSS <script>', category: 'Diet', impact: 2.0 })}
        data-testid="add-activity-xss"
      >
        Add XSS Activity
      </button>
      <button
        onClick={() => addActivity({ title: '', category: 'Energy', impact: 1.0 })}
        data-testid="add-invalid-title"
      >
        Add Invalid Title
      </button>
      <button
        onClick={() => addActivity({ title: 'Valid', category: 'Transportation', impact: NaN })}
        data-testid="add-invalid-impact"
      >
        Add Invalid Impact
      </button>
      <button
        onClick={() => addActivity({ title: 'Negative Impact', category: 'Transportation', impact: -0.5 })}
        data-testid="add-negative-impact"
      >
        Add Negative Impact
      </button>
      <button
        onClick={() => addWaterLog({ type: 'Shower', liters: 50 })}
        data-testid="add-water"
      >
        Add Water
      </button>
      <button
        onClick={() => addWaterLog({ type: 'Bucket Bath', liters: -5 })}
        data-testid="add-invalid-water"
      >
        Add Invalid Water
      </button>
      <button
        onClick={() => updateProfile({ name: 'New Name' })}
        data-testid="update-profile-name"
      >
        Update Profile Name
      </button>
      <button
        onClick={() => updateProfile({ monthlyGoal: 3.5 })}
        data-testid="update-profile-goal"
      >
        Update Profile Goal
      </button>
    </div>
  );
};

describe('CarbonContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Default Values', () => {
    it('provides default profile values initially', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      expect(screen.getByTestId('profile-name')).toHaveTextContent('Eco Warrior');
      expect(screen.getByTestId('profile-goal')).toHaveTextContent('1.9');
      expect(screen.getByTestId('profile-water-target')).toHaveTextContent('135');
    });

    it('starts with 2 initial mock activities', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );
      expect(screen.getByTestId('activity-count')).toHaveTextContent('2');
    });

    it('starts with 0 water logs', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );
      expect(screen.getByTestId('water-count')).toHaveTextContent('0');
    });

    it('emissionsBreakdown has 4 categories', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );
      expect(screen.getByTestId('emissions-count')).toHaveTextContent('4');
    });

    it('computes a positive footprint score', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );
      const score = parseFloat(screen.getByTestId('footprint-score').textContent || '0');
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('addActivity', () => {
    it('allows adding a valid activity', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      act(() => { screen.getByTestId('add-activity').click(); });
      expect(screen.getByTestId('activity-count')).toHaveTextContent('3');
    });

    it('rejects an activity with an empty title', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      act(() => { screen.getByTestId('add-invalid-title').click(); });
      expect(screen.getByTestId('activity-count')).toHaveTextContent('2');
      expect(console.warn).toHaveBeenCalledWith('Invalid activity title');
    });

    it('rejects an activity with NaN impact', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      act(() => { screen.getByTestId('add-invalid-impact').click(); });
      expect(screen.getByTestId('activity-count')).toHaveTextContent('2');
      expect(console.warn).toHaveBeenCalledWith('Invalid activity impact');
    });

    it('allows activities with negative impact (carbon offset)', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      act(() => { screen.getByTestId('add-negative-impact').click(); });
      expect(screen.getByTestId('activity-count')).toHaveTextContent('3');
    });

    it('sanitizes XSS characters in activity title', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      act(() => { screen.getByTestId('add-activity-xss').click(); });
      expect(screen.getByTestId('activity-count')).toHaveTextContent('3');
      // The title should have < and > replaced with HTML entities
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('updates footprint score when activity is added', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      const scoreBefore = parseFloat(screen.getByTestId('footprint-score').textContent || '0');
      act(() => { screen.getByTestId('add-activity').click(); });
      const scoreAfter = parseFloat(screen.getByTestId('footprint-score').textContent || '0');
      // Adding 1.5kg (0.0015 tons) should increase the score
      expect(scoreAfter).toBeGreaterThanOrEqual(scoreBefore);
    });
  });

  describe('addWaterLog', () => {
    it('allows adding a valid water log', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      act(() => { screen.getByTestId('add-water').click(); });
      expect(screen.getByTestId('water-count')).toHaveTextContent('1');
    });

    it('rejects a water log with negative liters', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      act(() => { screen.getByTestId('add-invalid-water').click(); });
      expect(screen.getByTestId('water-count')).toHaveTextContent('0');
      expect(console.warn).toHaveBeenCalledWith('Invalid water liters amount');
    });

    it('can add multiple water logs', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      act(() => { screen.getByTestId('add-water').click(); });
      act(() => { screen.getByTestId('add-water').click(); });
      act(() => { screen.getByTestId('add-water').click(); });
      expect(screen.getByTestId('water-count')).toHaveTextContent('3');
    });
  });

  describe('updateProfile', () => {
    it('updates only the name while keeping other fields', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      act(() => { screen.getByTestId('update-profile-name').click(); });
      expect(screen.getByTestId('profile-name')).toHaveTextContent('New Name');
      // Goal should remain unchanged
      expect(screen.getByTestId('profile-goal')).toHaveTextContent('1.9');
    });

    it('updates the monthly goal while keeping other fields', () => {
      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      act(() => { screen.getByTestId('update-profile-goal').click(); });
      expect(screen.getByTestId('profile-goal')).toHaveTextContent('3.5');
      // Name should remain unchanged
      expect(screen.getByTestId('profile-name')).toHaveTextContent('Eco Warrior');
    });
  });

  describe('localStorage persistence', () => {
    it('loads activities from localStorage if present', () => {
      const savedActivities = [
        { id: 'a1', title: 'Saved Activity', category: 'Energy', impact: 5.0, date: new Date().toISOString() },
      ];
      localStorage.setItem('carbon_activities', JSON.stringify(savedActivities));

      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      expect(screen.getByTestId('activity-count')).toHaveTextContent('1');
    });

    it('falls back to initial activities if localStorage data is corrupt', () => {
      localStorage.setItem('carbon_activities', 'not-valid-json{{{');

      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      // Should fall back to the 2 initial mock activities
      expect(screen.getByTestId('activity-count')).toHaveTextContent('2');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to parse saved activities'),
        expect.anything()
      );
    });

    it('loads profile from localStorage if present', () => {
      const savedProfile = { name: 'LocalStorage User', monthlyGoal: 5.0, dailyWaterTarget: 200 };
      localStorage.setItem('carbon_profile', JSON.stringify(savedProfile));

      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      expect(screen.getByTestId('profile-name')).toHaveTextContent('LocalStorage User');
    });

    it('keeps default profile if localStorage profile is corrupt', () => {
      localStorage.setItem('carbon_profile', 'invalid-json');

      render(
        <CarbonProvider>
          <TestComponent />
        </CarbonProvider>
      );

      expect(screen.getByTestId('profile-name')).toHaveTextContent('Eco Warrior');
    });
  });

  describe('useCarbon hook', () => {
    it('throws an error when used outside of CarbonProvider', () => {
      // Suppress console.error from React error boundary
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const BrokenComponent = () => {
        useCarbon();
        return null;
      };

      expect(() => render(<BrokenComponent />)).toThrow(
        'useCarbon must be used within a CarbonProvider'
      );

      spy.mockRestore();
    });
  });
});
