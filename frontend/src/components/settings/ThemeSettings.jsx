/**
 * Theme settings tab component
 */
export function ThemeSettings({ settings, onUpdateSettings, theme, styles }) {
  const handleThemeChange = (newTheme) => {
    onUpdateSettings({ ...settings, theme: newTheme });
  };

  const themeOptions = [
    { value: 'light', label: '☀️ בהיר', description: 'Light theme' },
    { value: 'dark', label: '🌙 כהה', description: 'Dark theme' },
    { value: 'auto', label: '🔄 אוטומטי', description: 'Auto (match system)' },
  ];

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>ערכת נושא</h3>

      <div style={styles.formGroup}>
        <label style={styles.label}>בחר ערכת נושא:</label>
        <div style={styles.radioGroup}>
          {themeOptions.map(({ value, label }) => (
            <label key={value} style={styles.radioLabel}>
              <input
                type="radio"
                name="theme"
                value={value}
                checked={settings.theme === value}
                onChange={(e) => handleThemeChange(e.target.value)}
                style={styles.radio}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.infoBox}>
        <p style={styles.infoText}>
          {settings.theme === 'auto'
            ? '🔄 ערכת הנושא תתאים אוטומטית להעדפות המערכת שלך'
            : settings.theme === 'light'
              ? '☀️ בחרת בערכת נושא בהירה'
              : '🌙 בחרת בערכת נושא כהה'}
        </p>
      </div>
    </div>
  );
}
