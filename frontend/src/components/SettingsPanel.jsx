import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { N8nSettings } from './settings/N8nSettings';
import { PerplexitySettings } from './settings/PerplexitySettings';
import { ClaudeSettings } from './settings/ClaudeSettings';
import { ThemeSettings } from './settings/ThemeSettings';
import { LoggingSettings } from './settings/LoggingSettings';

/**
 * Settings Panel component - manages API providers, theme, and logging
 */
export function SettingsPanel({ settings, onUpdateSettings, onClose }) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(settings.provider);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const tabs = ['n8n', 'perplexity', 'claude', 'theme', 'logging'];

  const getTabLabel = (tab) => {
    const labels = {
      n8n: 'N8N',
      perplexity: 'PERPLEXITY',
      claude: 'CLAUDE',
      theme: 'ערכת נושא',
      logging: 'לוגים',
    };
    return labels[tab] || tab;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (['n8n', 'perplexity', 'claude'].includes(tab)) {
      onUpdateSettings({ ...settings, provider: tab });
    }
  };

  const handleClearSettings = () => {
    localStorage.removeItem('taxRefundSettings');
    window.location.reload();
  };

  const styles = createStyles(theme);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>⚙️ הגדרות</h2>
          <button
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div style={styles.content}>
          {/* Tab Buttons */}
          <div style={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab ? styles.tabActive : {}),
                }}
              >
                {getTabLabel(tab)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={styles.tabContent}>
            {activeTab === 'n8n' && (
              <N8nSettings
                settings={settings}
                onUpdateSettings={onUpdateSettings}
                theme={theme}
                styles={styles}
              />
            )}

            {activeTab === 'perplexity' && (
              <PerplexitySettings
                settings={settings}
                onUpdateSettings={onUpdateSettings}
                theme={theme}
                styles={styles}
              />
            )}

            {activeTab === 'claude' && (
              <ClaudeSettings
                settings={settings}
                onUpdateSettings={onUpdateSettings}
                theme={theme}
                styles={styles}
              />
            )}

            {activeTab === 'theme' && (
              <ThemeSettings
                settings={settings}
                onUpdateSettings={onUpdateSettings}
                theme={theme}
                styles={styles}
              />
            )}

            {activeTab === 'logging' && (
              <LoggingSettings
                settings={settings}
                onUpdateSettings={onUpdateSettings}
                theme={theme}
                styles={styles}
              />
            )}
          </div>

          {/* Clear Settings Button */}
          <div style={styles.footerActions}>
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                style={styles.clearButton}
              >
                🗑️ Clear All Settings
              </button>
            ) : (
              <div style={styles.confirmBox}>
                <p style={styles.confirmText}>
                  Are you sure? This will reset all settings to defaults.
                </p>
                <div style={styles.confirmActions}>
                  <button
                    onClick={handleClearSettings}
                    style={styles.confirmYes}
                  >
                    Yes, Clear
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    style={styles.confirmNo}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generate theme-aware styles
 */
function createStyles(theme) {
  return {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.bg.overlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: theme.bg.elevated,
      borderRadius: '8px',
      boxShadow: theme.shadow.lg,
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      direction: 'rtl',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem',
      borderBottom: `1px solid ${theme.border.primary}`,
      backgroundColor: theme.special.settingsHeader,
    },
    title: {
      margin: 0,
      fontSize: '1.5rem',
      color: theme.text.primary,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: theme.text.secondary,
      padding: '0.5rem',
    },
    content: {
      padding: '2rem',
    },
    tabs: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1.5rem',
      borderBottom: `2px solid ${theme.border.primary}`,
      flexWrap: 'wrap',
    },
    tab: {
      padding: '0.75rem 1.5rem',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: theme.text.secondary,
      fontSize: '0.95rem',
      fontWeight: '500',
      borderBottom: '3px solid transparent',
      transition: 'all 0.2s',
    },
    tabActive: {
      color: theme.accent.primary,
      borderBottomColor: theme.accent.primary,
    },
    tabContent: {
      minHeight: '200px',
    },
    section: {
      marginBottom: '1.5rem',
    },
    sectionTitle: {
      fontSize: '1.1rem',
      color: theme.accent.primary,
      marginBottom: '1rem',
      marginTop: 0,
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: theme.text.primary,
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '4px',
      border: `1px solid ${theme.border.primary}`,
      fontSize: '0.95rem',
      fontFamily: 'monospace',
      boxSizing: 'border-box',
      backgroundColor: theme.bg.primary,
      color: theme.text.primary,
    },
    hint: {
      margin: '0.5rem 0 0 0',
      fontSize: '0.85rem',
      color: theme.text.tertiary,
    },
    radioGroup: {
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap',
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.95rem',
      color: theme.text.primary,
    },
    radio: {
      cursor: 'pointer',
    },
    infoBox: {
      padding: '1rem',
      backgroundColor: theme.accent.infoBg,
      borderLeft: `4px solid ${theme.accent.primary}`,
      borderRadius: '4px',
    },
    infoText: {
      margin: 0,
      fontSize: '0.9rem',
      color: theme.accent.infoText,
    },
    warningBox: {
      padding: '1rem',
      backgroundColor: theme.accent.warningBg,
      borderLeft: `4px solid ${theme.accent.warning}`,
      borderRadius: '4px',
    },
    warningText: {
      margin: 0,
      fontSize: '0.9rem',
      color: theme.accent.warningText,
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1.5rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    saveButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: theme.accent.success,
      color: theme.text.inverted,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '600',
      transition: 'background-color 0.2s',
    },
    loadButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: theme.accent.info,
      color: theme.text.inverted,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '600',
      transition: 'background-color 0.2s',
    },
    viewButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: theme.accent.info,
      color: theme.text.inverted,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '600',
    },
    clearButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: theme.accent.error,
      color: theme.text.inverted,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '600',
      transition: 'background-color 0.2s',
    },
    footerActions: {
      marginTop: '2rem',
      paddingTop: '1rem',
      borderTop: `1px solid ${theme.border.primary}`,
      display: 'flex',
      justifyContent: 'center',
    },
    confirmBox: {
      width: '100%',
    },
    confirmText: {
      margin: '0 0 1rem 0',
      color: theme.text.primary,
      textAlign: 'center',
    },
    confirmActions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    confirmYes: {
      padding: '0.75rem 1.5rem',
      backgroundColor: theme.accent.error,
      color: theme.text.inverted,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.95rem',
    },
    confirmNo: {
      padding: '0.75rem 1.5rem',
      backgroundColor: theme.text.tertiary,
      color: theme.text.inverted,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.95rem',
    },
  };
}
