import { useTheme } from '../hooks/useTheme';

/**
 * About modal component
 * Displays information about the application and developer contact details
 */
export const AboutModal = ({ isOpen, onClose }) => {
  const theme = useTheme();

  if (!isOpen) return null;

  const styles = createStyles(theme);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>📋 אודות המערכת</h2>
          <button
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* About Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>מערכת חישוב החזרי מיסים מטופס 106</h3>
            <p style={styles.description}>
              מערכת מתקדמת לחילוץ נתונים אוטומטי מטופס 106 השנתי של מס הכנסה.
              המערכת משתמשת בטכנולוגיית AI כדי לחלץ נתונים מדויקים ולחשב החזרי מיסים או תשלומים נוספים.
            </p>
          </div>

          {/* Features Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>✨ תכונות</h3>
            <ul style={styles.featuresList}>
              <li style={styles.featureItem}>🔄 חילוץ נתונים אוטומטי מ-PDF</li>
              <li style={styles.featureItem}>🤖 חישובים מבוססי AI</li>
              <li style={styles.featureItem}>🌙 תמיכה בנושא אור/כהה</li>
              <li style={styles.featureItem}>📊 תוצאות מפורטות וברורות</li>
              <li style={styles.featureItem}>🔒 עיבוד מאובטח וגלוי</li>
            </ul>
          </div>

          {/* Developer Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>👨‍💻 מפתח</h3>
            <div style={styles.developerCard}>
              <p style={styles.developerName}>Igal Krigel</p>

              <div style={styles.contactList}>
                <a href="mailto:ikrigel@gmail.com" style={styles.contactLink}>
                  📧 ikrigel@gmail.com
                </a>

                <a href="tel:+972546730401" style={styles.contactLink}>
                  📱 +972-54-673-0401
                </a>

                <a
                  href="https://www.linkedin.com/in/ikrigel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.contactLink}
                >
                  💼 LinkedIn
                </a>

                <a
                  href="https://github.com/ikrigel"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.contactLink}
                >
                  🔗 GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Technology Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🛠️ טכנולוגיה</h3>
            <p style={styles.techInfo}>
              בנוי ב-React עם n8n להזמת זרימות, ו-Google Gemini/OpenAI לחילוץ נתונים בעזרת AI.
            </p>
          </div>

          {/* Footer Note */}
          <div style={styles.footerNote}>
            <p style={styles.noteText}>
              💡 הערה: הנתונים המחולצים הם אומדנים בלבד ואינו מהווה ייעוץ מס רשמי.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div style={styles.footer}>
          <button onClick={onClose} style={styles.closeModalButton}>
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};

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
      borderRadius: '12px',
      boxShadow: theme.shadow.lg,
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
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
      position: 'sticky',
      top: 0,
    },
    title: {
      margin: 0,
      fontSize: '1.5rem',
      color: theme.text.primary,
      fontWeight: '600',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: theme.text.secondary,
      padding: '0.5rem',
      transition: 'color 0.2s',
    },
    content: {
      padding: '2rem',
    },
    section: {
      marginBottom: '2rem',
    },
    sectionTitle: {
      fontSize: '1.1rem',
      color: theme.accent.primary,
      marginBottom: '1rem',
      marginTop: 0,
      fontWeight: '600',
    },
    description: {
      color: theme.text.secondary,
      lineHeight: '1.6',
      margin: 0,
      fontSize: '0.95rem',
    },
    featuresList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'grid',
      gap: '0.75rem',
    },
    featureItem: {
      color: theme.text.secondary,
      padding: '0.75rem 1rem',
      backgroundColor: theme.bg.secondary,
      borderRadius: '6px',
      fontSize: '0.95rem',
      transition: 'background-color 0.2s',
    },
    developerCard: {
      backgroundColor: theme.bg.secondary,
      padding: '1.5rem',
      borderRadius: '8px',
      borderLeft: `4px solid ${theme.accent.primary}`,
    },
    developerName: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: theme.text.primary,
      margin: '0 0 1rem 0',
    },
    contactList: {
      display: 'grid',
      gap: '0.75rem',
    },
    contactLink: {
      color: theme.accent.primary,
      textDecoration: 'none',
      fontSize: '0.95rem',
      padding: '0.5rem 0',
      transition: 'color 0.2s',
      wordBreak: 'break-word',
    },
    techInfo: {
      color: theme.text.secondary,
      lineHeight: '1.6',
      margin: 0,
      fontSize: '0.95rem',
      padding: '1rem',
      backgroundColor: theme.bg.secondary,
      borderRadius: '6px',
    },
    footerNote: {
      padding: '1rem',
      backgroundColor: theme.accent.infoBg,
      borderLeft: `4px solid ${theme.accent.info}`,
      borderRadius: '6px',
      marginBottom: '1rem',
    },
    noteText: {
      margin: 0,
      color: theme.accent.infoText,
      fontSize: '0.9rem',
      lineHeight: '1.5',
    },
    footer: {
      padding: '1.5rem',
      borderTop: `1px solid ${theme.border.primary}`,
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: theme.special.settingsHeader,
    },
    closeModalButton: {
      padding: '0.75rem 2rem',
      backgroundColor: theme.accent.primary,
      color: theme.text.inverted,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '600',
      transition: 'opacity 0.2s',
    },
  };
}
