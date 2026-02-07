import { useState, useEffect } from 'react';

const DEFAULT_SETTINGS = {
  provider: 'n8n', // 'n8n', 'perplexity', 'claude'
  theme: 'auto', // 'light', 'dark', 'auto'
  logLevel: 'INFO', // 'NONE', 'ERROR', 'WARN', 'INFO', 'DEBUG'
  n8n: {
    url: import.meta.env.VITE_WEBHOOK_URL || 'http://localhost:5678/webhook/tax-refund',
    environment: 'production', // 'production' or 'test'
  },
  perplexity: {
    apiKey: '',
    url: 'https://api.perplexity.ai',
  },
  claude: {
    apiKey: '',
    url: 'https://api.anthropic.com',
  },
};

const STORAGE_KEY = 'taxRefundSettings';

/**
 * Custom hook for managing application settings
 * Handles loading from localStorage and saving back to it
 */
export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (err) {
        console.error('Failed to parse saved settings:', err);
        setSettings(DEFAULT_SETTINGS);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  // Update a specific provider's settings
  const updateProvider = (providerName, updates) => {
    const updated = {
      ...settings,
      [providerName]: {
        ...settings[providerName],
        ...updates,
      },
    };
    updateSettings(updated);
  };

  // Switch the active provider
  const switchProvider = (providerName) => {
    updateSettings({ ...settings, provider: providerName });
  };

  // Get current active provider settings
  const getActiveProvider = () => {
    return {
      name: settings.provider,
      config: settings[settings.provider],
    };
  };

  // Reset all settings to defaults
  const resetSettings = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    updateProvider,
    switchProvider,
    getActiveProvider,
    resetSettings,
    isLoaded,
  };
}
