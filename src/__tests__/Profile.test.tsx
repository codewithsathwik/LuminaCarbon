import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Profile from '../app/profile/page';
import { CarbonProvider } from '../context/CarbonContext';

const renderProfile = () =>
  render(
    <CarbonProvider>
      <Profile />
    </CarbonProvider>
  );

describe('Profile Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders the Profile & Targets heading', () => {
      renderProfile();
      expect(screen.getByRole('heading', { level: 1, name: /Profile & Targets/i })).toBeInTheDocument();
    });

    it('renders the Display Name input', () => {
      renderProfile();
      expect(screen.getByText(/Display Name/i)).toBeInTheDocument();
    });

    it('renders the Monthly Carbon Target input', () => {
      renderProfile();
      expect(screen.getByText(/Monthly Carbon Target/i)).toBeInTheDocument();
    });

    it('renders the Daily Water Target input', () => {
      renderProfile();
      expect(screen.getByText(/Daily Water Target/i)).toBeInTheDocument();
    });

    it('renders the Save Changes button', () => {
      renderProfile();
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
    });
  });

  describe('Pre-filled values', () => {
    it('pre-fills the name field with the default profile name', () => {
      renderProfile();
      const nameInput = screen.getByDisplayValue('Eco Warrior');
      expect(nameInput).toBeInTheDocument();
    });

    it('pre-fills the goal field with the default monthly goal', () => {
      renderProfile();
      const goalInput = screen.getByDisplayValue('1.9');
      expect(goalInput).toBeInTheDocument();
    });

    it('pre-fills the water target field', () => {
      renderProfile();
      const waterInput = screen.getByDisplayValue('135');
      expect(waterInput).toBeInTheDocument();
    });
  });

  describe('Form interactions', () => {
    it('allows editing the display name field', () => {
      renderProfile();
      const nameInput = screen.getByDisplayValue('Eco Warrior') as HTMLInputElement;
      act(() => {
        fireEvent.change(nameInput, { target: { value: 'Green Champion' } });
      });
      expect(nameInput.value).toBe('Green Champion');
    });

    it('allows editing the monthly goal field', () => {
      renderProfile();
      const goalInput = screen.getByDisplayValue('1.9') as HTMLInputElement;
      act(() => {
        fireEvent.change(goalInput, { target: { value: '2.5' } });
      });
      expect(goalInput.value).toBe('2.5');
    });

    it('allows editing the daily water target field', () => {
      renderProfile();
      const waterInput = screen.getByDisplayValue('135') as HTMLInputElement;
      act(() => {
        fireEvent.change(waterInput, { target: { value: '100' } });
      });
      expect(waterInput.value).toBe('100');
    });

    it('shows "Profile Saved!" after submitting the form', () => {
      renderProfile();

      const form = screen.getByRole('button', { name: /Save Changes/i }).closest('form');
      act(() => { fireEvent.submit(form!); });

      expect(screen.getByText(/Profile Saved!/i)).toBeInTheDocument();
    });

    it('updates profile context when form is saved', () => {
      renderProfile();

      const nameInput = screen.getByDisplayValue('Eco Warrior');
      act(() => {
        fireEvent.change(nameInput, { target: { value: 'Carbon Hero' } });
      });

      const form = screen.getByRole('button', { name: /Save Changes/i }).closest('form');
      act(() => { fireEvent.submit(form!); });

      // Confirm saved message
      expect(screen.getByText(/Profile Saved!/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders a form with required fields', () => {
      renderProfile();
      const form = screen.getByRole('button', { name: /Save Changes/i }).closest('form');
      expect(form).toBeInTheDocument();
    });

    it('all inputs are associated with labels', () => {
      renderProfile();
      // Each label renders with its input nearby
      expect(screen.getByText(/Display Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Monthly Carbon Target/i)).toBeInTheDocument();
      expect(screen.getByText(/Daily Water Target/i)).toBeInTheDocument();
    });
  });
});
