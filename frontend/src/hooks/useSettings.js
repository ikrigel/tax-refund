import { useState, useEffect, useCallback } from 'react';

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
    const loadSettings = () => {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          // Deep merge to ensure we have all settings
          const merged = { ...DEFAULT_SETTINGS, ...parsed };
          setSettings(merged);
        } catch (err) {
          console.error('Failed to parse saved settings:', err);
          setSettings(DEFAULT_SETTINGS);
        }
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
      setIsLoaded(true);
    };

    loadSettings();
  }, []);

  // Save settings to localStorage whenever they change
  const updateSettings = useCallback((newSettings) => {
    // Ensure new settings object is created for React to detect change
    const mergedSettings = { ...DEFAULT_SETTINGS, ...newSettings };
    setSettings(mergedSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedSettings));
  }, []);

  // Update a specific provider's settings
  const updateProvider = useCallback((providerName, updates) => {
    setSettings(prevSettings => {
      const updated = {
        ...prevSettings,
        [providerName]: {
          ...prevSettings[providerName],
          ...updates,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Switch the active provider
  const switchProvider = useCallback((providerName) => {
    updateSettings({ ...settings, provider: providerName });
  }, [settings, updateSettings]);

  // Get current active provider settings
  const getActiveProvider = useCallback(() => {
    return {
      name: settings.provider,
      config: settings[settings.provider],
    };
  }, [settings]);

  // Reset all settings to defaults
  const resetSettings = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(DEFAULT_SETTINGS);
  }, []);

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

