import { useTheme } from '../hooks/useTheme';

/**
 * Loading spinner component
 * Displays during form processing
 */
export const LoadingSpinner = () => {
  const theme = useTheme();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: `4px solid ${theme.bg.secondary}`,
      borderTop: `4px solid ${theme.accent.info}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    text: {
      color: theme.text.secondary,
      fontSize: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>מעבד את הקובץ...</p>
    </div>
  );
};

// Add keyframes for spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
