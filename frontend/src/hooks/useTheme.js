import { useEffect, useState } from 'react';
import { getTheme } from '../utils/theme';
import { useSettings } from './useSettings';

/**
 * Custom hook for theme resolution
 * Handles 'auto' mode by detecting system preference
 * Listens to system theme changes and updates in real-time
 *
 * @returns {Object} Resolved theme tokens for current mode
 */
export function useTheme() {
  const { settings } = useSettings();
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    const themePref = settings.theme || 'auto';

    if (themePref === 'auto') {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(prefersDark ? 'dark' : 'light');

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      };

      // Modern browsers
      mediaQuery.addEventListener('change', handleChange);

      // Cleanup
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Use explicit setting
      setResolvedTheme(themePref);
    }
  }, [settings.theme]);

  return getTheme(resolvedTheme);
}
