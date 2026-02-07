/**
 * Claude settings tab component
 */
export function ClaudeSettings({ settings, onUpdateSettings, theme, styles }) {
  const handleClaudeKeyChange = (key) => {
    onUpdateSettings({
      ...settings,
      claude: { ...settings.claude, apiKey: key },
    });
  };

  return (
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
        <p style={styles.hint}>Your Claude API key from Anthropic</p>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>API URL:</label>
        <input
          type="url"
          value={settings.claude.url}
          disabled
          style={styles.input}
        />
        <p style={styles.hint}>API endpoint (auto-configured)</p>
      </div>

      <div style={styles.infoBox}>
        <p style={styles.infoText}>
          Get your API key from <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com</a>
        </p>
      </div>
    </div>
  );
}
