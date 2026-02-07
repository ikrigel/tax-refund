import { useState, useEffect } from 'react';

/**
 * N8n settings tab component
 */
export function N8nSettings({ settings, onUpdateSettings, theme, styles }) {
  const [n8nUrls, setN8nUrls] = useState({
    production: '',
    test: '',
  });

  // Load URLs from localStorage on mount
  useEffect(() => {
    const savedUrls = localStorage.getItem('n8nUrls');
    if (savedUrls) {
      setN8nUrls(JSON.parse(savedUrls));
    }
  }, []);

  const handleN8nEnvChange = (env) => {
    const urlToUse = n8nUrls[env] || settings.n8n.url;
    onUpdateSettings({
      ...settings,
      n8n: { ...settings.n8n, environment: env, url: urlToUse },
    });
  };

  const handleN8nUrlChange = (env, url) => {
    setN8nUrls({ ...n8nUrls, [env]: url });
  };

  const handleSaveUrls = () => {
    localStorage.setItem('n8nUrls', JSON.stringify(n8nUrls));
    const currentUrl = n8nUrls[settings.n8n.environment];
    if (currentUrl) {
      onUpdateSettings({
        ...settings,
        n8n: { ...settings.n8n, url: currentUrl },
      });
    }
    alert('URLs saved successfully!');
  };

  const handleLoadUrls = () => {
    const savedUrls = localStorage.getItem('n8nUrls');
    if (savedUrls) {
      const urls = JSON.parse(savedUrls);
      setN8nUrls(urls);
      alert('URLs loaded from storage!');
    } else {
      alert('No saved URLs found in storage');
    }
  };

  return (
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
        <label style={styles.label}>Production URL:</label>
        <input
          type="url"
          value={n8nUrls.production}
          onChange={(e) => handleN8nUrlChange('production', e.target.value)}
          style={styles.input}
          placeholder="https://your-production-instance.app.n8n.cloud/webhook/tax-refund"
        />
        <p style={styles.hint}>Your production n8n webhook endpoint</p>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Test URL:</label>
        <input
          type="url"
          value={n8nUrls.test}
          onChange={(e) => handleN8nUrlChange('test', e.target.value)}
          style={styles.input}
          placeholder="https://your-test-instance.app.n8n.cloud/webhook/tax-refund"
        />
        <p style={styles.hint}>Your test n8n webhook endpoint</p>
      </div>

      <div style={styles.buttonGroup}>
        <button onClick={handleSaveUrls} style={styles.saveButton}>
          💾 Save URLs
        </button>
        <button onClick={handleLoadUrls} style={styles.loadButton}>
          📂 Load URLs
        </button>
      </div>
    </div>
  );
}
