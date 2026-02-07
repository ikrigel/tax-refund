/**
 * Reusable Section and Row components for displaying tax data
 */

/**
 * Section component - displays a titled section with content
 */
export const Section = ({ title, children, theme }) => {
  const styles = {
    section: {
      backgroundColor: theme.bg.primary,
      borderRadius: '6px',
      padding: '1rem',
      border: `1px solid ${theme.border.secondary}`,
    },
    sectionTitle: {
      margin: '0 0 1rem 0',
      color: theme.accent.primary,
      fontSize: '1rem',
      borderBottom: `2px solid ${theme.border.secondary}`,
      paddingBottom: '0.5rem',
    },
    sectionContent: {
      display: 'grid',
      gap: '0.5rem',
    },
  };

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      <div style={styles.sectionContent}>{children}</div>
    </div>
  );
};

/**
 * Row component - displays a label/value pair
 */
export const Row = ({ label, value, theme }) => {
  const styles = {
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      borderBottom: `1px solid ${theme.bg.secondary}`,
    },
    label: {
      fontWeight: 'bold',
      color: theme.text.primary,
      minWidth: '150px',
    },
    value: {
      color: theme.text.secondary,
      textAlign: 'left',
      direction: 'ltr',
    },
  };

  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}:</span>
      <span style={styles.value}>{value || 'לא זמין'}</span>
    </div>
  );
};
