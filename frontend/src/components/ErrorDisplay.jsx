import { useTheme } from '../hooks/useTheme';

/**
 * Error display component
 * Shows validation errors and extraction failures
 */
export const ErrorDisplay = ({ error, onClear, onRetry, isDev = false }) => {
  const theme = useTheme();

  if (!error) return null;

  const styles = {
    container: {
      padding: '1rem 0',
    },
    errorBox: {
      backgroundColor: theme.accent.errorBg,
      border: `1px solid ${theme.accent.errorBorder}`,
      borderRadius: '8px',
      padding: '1.5rem',
    },
    title: {
      color: theme.accent.errorText,
      margin: '0 0 0.5rem 0',
      fontSize: '1.1rem',
    },
    message: {
      color: theme.text.secondary,
      margin: '0 0 1.5rem 0',
      lineHeight: '1.5',
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    button: {
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
      minWidth: '120px',
    },
    primaryButton: {
      backgroundColor: theme.accent.info,
      color: theme.text.inverted,
    },
    secondaryButton: {
      backgroundColor: theme.bg.secondary,
      color: theme.text.primary,
      border: `1px solid ${theme.border.primary}`,
    },
    devInfo: {
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: theme.bg.tertiary,
      borderRadius: '4px',
      fontSize: '0.85rem',
    },
    devSummary: {
      cursor: 'pointer',
      fontWeight: 'bold',
      color: theme.text.secondary,
    },
    devPre: {
      marginTop: '0.5rem',
      padding: '0.5rem',
      backgroundColor: theme.bg.primary,
      borderRadius: '4px',
      overflow: 'auto',
      fontSize: '0.8rem',
      color: theme.text.secondary,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.errorBox}>
        <h3 style={styles.title}>❌ שגיאה בעיבוד הקובץ</h3>
        <p style={styles.message}>{error}</p>

        <div style={styles.actions}>
          <button onClick={onClear} style={{ ...styles.button, ...styles.primaryButton }}>
            נסה שוב
          </button>
          <button onClick={onClear} style={styles.secondaryButton}>
            ניקוי
          </button>
        </div>

        {isDev && (
          <div style={styles.devInfo}>
            <details>
              <summary style={styles.devSummary}>פרטים טכניים</summary>
              <pre style={styles.devPre}>{error}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};
