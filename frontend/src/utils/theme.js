/**
 * Theme System - Light and Dark Mode Color Tokens
 *
 * Defines all colors used throughout the app in semantic categories.
 * Supports light, dark, and auto (system preference) themes.
 */

const THEME_TOKENS = {
  light: {
    // Backgrounds
    bg: {
      app: '#fafafa',           // Main app background
      primary: 'white',         // Cards, sections, modals
      secondary: '#f5f5f5',     // Alternate sections (ResultsDisplay container)
      tertiary: '#f9f9f9',      // File info boxes, note items
      elevated: 'white',        // Modal backgrounds
      overlay: 'rgba(0, 0, 0, 0.5)',  // Modal overlay
    },

    // Text colors
    text: {
      primary: '#333',          // Main text, labels
      secondary: '#666',        // Description text, values
      tertiary: '#999',         // Hints, timestamps
      inverted: 'white',        // Text on colored backgrounds
      disabled: '#999',
    },

    // Brand/Accent colors
    accent: {
      primary: '#1976d2',       // Primary blue (headers, titles, links)
      primaryHover: '#1565c0',  // Darker blue for hover
      success: '#4CAF50',       // Green (success, submit buttons)
      successAlt: '#2e7d32',    // Darker green (results title)
      error: '#f44336',         // Red (errors, clear button)
      errorBg: '#ffebee',       // Error background
      errorBorder: '#ef5350',   // Error border
      errorText: '#c62828',     // Error title
      warning: '#ffc107',       // Warning (footer warning)
      warningBg: '#fff3cd',     // Warning background
      warningText: '#856404',   // Warning text
      warningBorder: '#ff9800', // Warning border
      info: '#2196f3',          // Info blue (buttons, links)
      infoBg: '#e3f2fd',        // Info background
      infoText: '#0d47a1',      // Info text
      purple: '#7c4dff',        // Purple (support section)
      purpleBg: '#f3e5f5',      // Purple background
      dragActive: '#f0f8ff',    // Drag-and-drop active state
    },

    // Borders
    border: {
      primary: '#ddd',          // Standard borders
      secondary: '#e0e0e0',     // Section borders
      light: '#f5f5f5',         // Very light borders
      accent: '#1976d2',        // Accent borders
      dashed: '#ddd',           // Dashed borders (file upload)
      error: '#ef5350',
      warning: '#ff9800',
    },

    // Shadows
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,0.1)',
      md: '0 2px 4px rgba(0,0,0,0.1)',
      lg: '0 4px 20px rgba(0,0,0,0.15)',
    },

    // Special backgrounds
    special: {
      header: '#1976d2',
      footer: '#333',
      settingsHeader: '#f5f5f5',
      warningBox: '#fff3e0',
      infoBox: '#e3f2fd',
      errorBox: '#ffebee',
    },
  },

  dark: {
    // Backgrounds
    bg: {
      app: '#121212',           // Material dark background
      primary: '#1e1e1e',       // Cards, sections
      secondary: '#252525',     // Alternate sections
      tertiary: '#2a2a2a',      // File info boxes
      elevated: '#2c2c2c',      // Modal backgrounds
      overlay: 'rgba(0, 0, 0, 0.75)',  // Darker overlay for dark mode
    },

    // Text colors
    text: {
      primary: '#e0e0e0',       // Main text (87% opacity white)
      secondary: '#b0b0b0',     // Secondary text (60% opacity)
      tertiary: '#808080',      // Tertiary text (38% opacity)
      inverted: '#121212',      // Dark text on light backgrounds
      disabled: '#666',
    },

    // Brand/Accent colors (adjusted for dark mode)
    accent: {
      primary: '#42a5f5',       // Lighter blue for dark mode
      primaryHover: '#64b5f6',  // Even lighter on hover
      success: '#66bb6a',       // Lighter green
      successAlt: '#4caf50',    // Success variant
      error: '#ef5350',         // Keep error red
      errorBg: '#3a1a1a',       // Dark error background
      errorBorder: '#d32f2f',   // Error border
      errorText: '#ef5350',     // Error title
      warning: '#ffa726',       // Warning orange
      warningBg: '#3a2e1a',     // Dark warning background
      warningText: '#ffb74d',   // Warning text
      warningBorder: '#fb8c00', // Warning border
      info: '#42a5f5',          // Info blue
      infoBg: '#1a2a3a',        // Dark info background
      infoText: '#64b5f6',      // Info text
      purple: '#ab47bc',        // Purple
      purpleBg: '#2a1a3a',      // Dark purple background
      dragActive: '#1a2a3a',    // Drag-and-drop active
    },

    // Borders
    border: {
      primary: '#404040',       // Standard borders
      secondary: '#353535',     // Section borders
      light: '#2a2a2a',         // Light borders
      accent: '#42a5f5',        // Accent borders
      dashed: '#404040',        // Dashed borders
      error: '#d32f2f',
      warning: '#fb8c00',
    },

    // Shadows
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,0.3)',
      md: '0 2px 4px rgba(0,0,0,0.4)',
      lg: '0 4px 20px rgba(0,0,0,0.5)',
    },

    // Special backgrounds
    special: {
      header: '#1e3a52',        // Darker blue header
      footer: '#1a1a1a',        // Dark footer
      settingsHeader: '#252525',
      warningBox: '#3a2e1a',
      infoBox: '#1a2a3a',
      errorBox: '#3a1a1a',
    },
  },
};

/**
 * Get theme tokens for specified mode
 * @param {string} mode - 'light' or 'dark'
 * @returns {Object} Theme tokens object
 */
export function getTheme(mode) {
  return THEME_TOKENS[mode] || THEME_TOKENS.light;
}

export { THEME_TOKENS };
