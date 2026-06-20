import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../components/Sidebar';

// Mock usePathname since it's a next/navigation hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

import { usePathname } from 'next/navigation';
const mockUsePathname = usePathname as jest.Mock;

describe('Sidebar', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  describe('Rendering', () => {
    it('renders the Lumina Carbon logo text', () => {
      render(<Sidebar />);
      expect(screen.getByText('Lumina')).toBeInTheDocument();
      expect(screen.getByText('Carbon')).toBeInTheDocument();
    });

    it('renders all 5 navigation items', () => {
      render(<Sidebar />);
      const navItems = ['Dashboard', 'Log Activity', 'Insights', 'Profile', 'Settings'];
      navItems.forEach(item => {
        const elements = screen.getAllByText(item);
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    it('renders a desktop aside sidebar element', () => {
      render(<Sidebar />);
      const aside = document.querySelector('aside');
      expect(aside).toBeInTheDocument();
    });

    it('renders a mobile bottom navigation', () => {
      render(<Sidebar />);
      const navElements = screen.getAllByRole('navigation');
      // One for desktop, one for mobile bottom nav
      expect(navElements.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the Monthly Goal progress section', () => {
      render(<Sidebar />);
      expect(screen.getByText('Monthly Goal')).toBeInTheDocument();
      expect(screen.getByText('60% Complete')).toBeInTheDocument();
    });
  });

  describe('Navigation links', () => {
    it('renders Dashboard link pointing to "/"', () => {
      render(<Sidebar />);
      const dashboardLinks = screen.getAllByRole('link', { name: /Dashboard/i });
      expect(dashboardLinks.length).toBeGreaterThan(0);
      expect(dashboardLinks[0]).toHaveAttribute('href', '/');
    });

    it('renders Log Activity link pointing to "/log"', () => {
      render(<Sidebar />);
      const links = screen.getAllByRole('link', { name: /Log Activity/i });
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveAttribute('href', '/log');
    });

    it('renders Insights link pointing to "/insights"', () => {
      render(<Sidebar />);
      const links = screen.getAllByRole('link', { name: /Insights/i });
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveAttribute('href', '/insights');
    });

    it('renders Profile link pointing to "/profile"', () => {
      render(<Sidebar />);
      const links = screen.getAllByRole('link', { name: /Profile/i });
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveAttribute('href', '/profile');
    });

    it('renders Settings link pointing to "/settings"', () => {
      render(<Sidebar />);
      const links = screen.getAllByRole('link', { name: /Settings/i });
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveAttribute('href', '/settings');
    });
  });

  describe('Active state highlighting', () => {
    it('marks Dashboard as active when path is "/"', () => {
      mockUsePathname.mockReturnValue('/');
      render(<Sidebar />);
      const dashboardLinks = screen.getAllByRole('link', { name: /Dashboard/i });
      // Active link should have the active class
      expect(dashboardLinks[0].className).toContain('bg-');
    });

    it('marks Log Activity as active when path is "/log"', () => {
      mockUsePathname.mockReturnValue('/log');
      render(<Sidebar />);
      const logLinks = screen.getAllByRole('link', { name: /Log Activity/i });
      expect(logLinks[0].className).toContain('bg-');
    });

    it('marks Insights as active when path is "/insights"', () => {
      mockUsePathname.mockReturnValue('/insights');
      render(<Sidebar />);
      const insightLinks = screen.getAllByRole('link', { name: /Insights/i });
      expect(insightLinks[0].className).toContain('bg-');
    });

    it('marks Profile as active when path is "/profile"', () => {
      mockUsePathname.mockReturnValue('/profile');
      render(<Sidebar />);
      const profileLinks = screen.getAllByRole('link', { name: /Profile/i });
      expect(profileLinks[0].className).toContain('bg-');
    });

    it('marks Settings as active when path is "/settings"', () => {
      mockUsePathname.mockReturnValue('/settings');
      render(<Sidebar />);
      const settingsLinks = screen.getAllByRole('link', { name: /Settings/i });
      expect(settingsLinks[0].className).toContain('bg-');
    });
  });

  describe('Accessibility', () => {
    it('navigation elements have aria-labels', () => {
      render(<Sidebar />);
      expect(screen.getByRole('navigation', { name: /Main Navigation/i })).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: /Mobile Navigation/i })).toBeInTheDocument();
    });

    it('all nav links have aria-label attributes', () => {
      render(<Sidebar />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('aria-label');
      });
    });
  });
});
