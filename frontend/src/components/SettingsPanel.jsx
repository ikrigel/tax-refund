import { useState } from 'react';

/**
 * Settings Panel component - allows users to configure API providers and endpoints
 * Supports n8n, Perplexity, and Claude API providers
 */
export function SettingsPanel({ settings, onUpdateSettings, onClose }) {
  const [activeTab, setActiveTab] = useState(settings.provider);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleProviderChange = (provider) => {
    setActiveTab(provider);
    onUpdateSettings({ ...settings, provider });
  };

  const handleN8nUrlChange = (url) => {
    onUpdateSettings({
      ...settings,
      n8n: { ...settings.n8n, url },
    });
  };

  const handleN8nEnvChange = (env) => {
    onUpdateSettings({
      ...settings,
      n8n: { ...settings.n8n, environment: env },
    });
  };

  const handlePerplexityKeyChange = (key) => {
    onUpdateSettings({
      ...settings,
      perplexity: { ...settings.perplexity, apiKey: key },
    });
  };

  const handleClaudeKeyChange = (key) => {
    onUpdateSettings({
      ...settings,
      claude: { ...settings.claude, apiKey: key },
    });
  };

  const handleClearSettings = () => {
    localStorage.removeItem('taxRefundSettings');
    window.location.reload();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
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
          {/* Provider Tabs */}
          <div style={styles.tabs}>
            {['n8n', 'perplexity', 'claude'].map((provider) => (
              <button
                key={provider}
                onClick={() => handleProviderChange(provider)}
                style={{
                  ...styles.tab,
                  ...(activeTab === provider ? styles.tabActive : {}),
                }}
              >
                {provider.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={styles.tabContent}>
            {/* n8n Settings */}
            {activeTab === 'n8n' && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>n8n Webhook Configuration</h3>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Environment:</label>
                  <div style={styles.radioGroup}>
                    {['production', 'test'].map((env) => (
                      <label key={env} style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="n8nEnv"
                          value={env}
                          checked={settings.n8n.environment === env}
                          onChange={(e) => handleN8nEnvChange(e.target.value)}
                          style={styles.radio}
                        />
                        {env === 'production' ? '🌐 Production' : '🧪 Test'}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Webhook URL:</label>
                  <input
                    type="url"
                    value={settings.n8n.url}
                    onChange={(e) => handleN8nUrlChange(e.target.value)}
                    style={styles.input}
                    placeholder="https://your-n8n-instance.com/webhook/tax-refund"
                  />
                  <p style={styles.hint}>
                    Your n8n webhook endpoint for Form 106 extraction
                  </p>
                </div>

                <div style={styles.infoBox}>
                  <p style={styles.infoText}>
                    ℹ️ Default: {import.meta.env.VITE_WEBHOOK_URL || 'http://localhost:5678/webhook/tax-refund'}
                  </p>
                </div>
              </div>
            )}

            {/* Perplexity Settings */}
            {activeTab === 'perplexity' && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Perplexity API Configuration</h3>

                <div style={styles.formGroup}>
                  <label style={styles.label}>API Key:</label>
                  <input
                    type="password"
                    value={settings.perplexity.apiKey}
                    onChange={(e) => handlePerplexityKeyChange(e.target.value)}
                    style={styles.input}
                    placeholder="sk-..."
                  />
                  <p style={styles.hint}>
                    Your Perplexity API key for document analysis
                  </p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>API Endpoint:</label>
                  <input
                    type="url"
                    value={settings.perplexity.url}
                    disabled
                    style={{ ...styles.input, ...styles.disabledInput }}
                  />
                  <p style={styles.hint}>Fixed endpoint (not configurable)</p>
                </div>

                <div style={styles.warningBox}>
                  <p style={styles.warningText}>
                    ⚠️ API key is stored in browser localStorage. Keep it secure!
                  </p>
                </div>
              </div>
            )}

            {/* Claude Settings */}
            {activeTab === 'claude' && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Claude API Configuration</h3>

                <div style={styles.formGroup}>
                  <label style={styles.label}>API Key:</label>
                  <input
                    type="password"
                    value={settings.claude.apiKey}
                    onChange={(e) => handleClaudeKeyChange(e.target.value)}
                    style={styles.input}
                    placeholder="sk-ant-..."
                  />
                  <p style={styles.hint}>
                    Your Claude API key from Anthropic
                  </p>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>API Endpoint:</label>
                  <input
                    type="url"
                    value={settings.claude.url}
                    disabled
                    style={{ ...styles.input, ...styles.disabledInput }}
                  />
                  <p style={styles.hint}>Fixed endpoint (not configurable)</p>
                </div>

                <div style={styles.warningBox}>
                  <p style={styles.warningText}>
                    ⚠️ API key is stored in browser localStorage. Keep it secure!
                  </p>
                </div>
              </div>
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

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
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
    borderBottom: '1px solid #eee',
    backgroundColor: '#f5f5f5',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#333',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#666',
    padding: '0.5rem',
  },
  content: {
    padding: '2rem',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #eee',
  },
  tab: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#666',
    fontSize: '0.95rem',
    fontWeight: '500',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#1976d2',
    borderBottomColor: '#1976d2',
  },
  tabContent: {
    minHeight: '200px',
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    color: '#1976d2',
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
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '0.95rem',
    fontFamily: 'monospace',
    boxSizing: 'border-box',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
    cursor: 'not-allowed',
  },
  hint: {
    margin: '0.5rem 0 0 0',
    fontSize: '0.85rem',
    color: '#999',
  },
  radioGroup: {
    display: 'flex',
    gap: '2rem',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  radio: {
    cursor: 'pointer',
  },
  infoBox: {
    padding: '1rem',
    backgroundColor: '#e3f2fd',
    borderLeft: '4px solid #1976d2',
    borderRadius: '4px',
  },
  infoText: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#0d47a1',
  },
  warningBox: {
    padding: '1rem',
    backgroundColor: '#fff3e0',
    borderLeft: '4px solid #ff9800',
    borderRadius: '4px',
  },
  warningText: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#e65100',
  },
  footerActions: {
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'center',
  },
  clearButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  confirmBox: {
    width: '100%',
  },
  confirmText: {
    margin: '0 0 1rem 0',
    color: '#333',
    textAlign: 'center',
  },
  confirmActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  confirmYes: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  confirmNo: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#999',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
};
