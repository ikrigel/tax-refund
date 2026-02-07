/**
 * Perplexity settings tab component
 */
export function PerplexitySettings({ settings, onUpdateSettings, theme, styles }) {
  const handlePerplexityKeyChange = (key) => {
    onUpdateSettings({
      ...settings,
      perplexity: { ...settings.perplexity, apiKey: key },
    });
  };

  return (
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
        <p style={styles.hint}>Your Perplexity API key for document analysis</p>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>API URL:</label>
        <input
          type="url"
          value={settings.perplexity.url}
          disabled
          style={styles.input}
        />
        <p style={styles.hint}>API endpoint (auto-configured)</p>
      </div>

      <div style={styles.infoBox}>
        <p style={styles.infoText}>
          Get your API key from <a href="https://www.perplexity.ai" target="_blank" rel="noreferrer">perplexity.ai</a>
        </p>
      </div>
    </div>
  );
}
