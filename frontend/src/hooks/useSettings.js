import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

/**
 * Custom hook for accessing shared application settings
 * Must be used within a SettingsProvider
 */
export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      'useSettings must be used within a SettingsProvider. ' +
      'Make sure your app is wrapped with <SettingsProvider>.'
    );
  }

  return context;
}

