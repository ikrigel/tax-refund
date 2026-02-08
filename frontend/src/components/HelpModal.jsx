import { useTheme } from '../hooks/useTheme';

/**
 * Help modal component
 * Displays FAQs and usage instructions for the tax refund extraction system
 */
export const HelpModal = ({ isOpen, onClose }) => {
  const theme = useTheme();

  if (!isOpen) return null;

  const styles = createStyles(theme);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>❓ עזרה וש"א</h2>
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
          {/* How to Use Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📖 איך להשתמש?</h3>
            <ol style={styles.list}>
              <li style={styles.listItem}>בחר קובץ טופס 106 ב-PDF</li>
              <li style={styles.listItem}>גרור את הקובץ או לחץ על "בחר קובץ"</li>
              <li style={styles.listItem}>לחץ על "העלה וחלץ נתונים"</li>
              <li style={styles.listItem}>המתן לעיבוד (בדרך כלל 2-5 שניות)</li>
              <li style={styles.listItem}>צפה בתוצאות החישוב וההחזר המיסים</li>
            </ol>
          </div>

          {/* Requirements Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>✅ דרישות קובץ</h3>
            <div style={styles.requirementBox}>
              <p style={styles.requirementItem}>
                <strong>סוג קובץ:</strong> PDF בלבד
              </p>
              <p style={styles.requirementItem}>
                <strong>גודל קובץ:</strong> עד 50MB
              </p>
              <p style={styles.requirementItem}>
                <strong>איכות:</strong> טופס ברור וקריא (סרוק או דיגיטלי)
              </p>
              <p style={styles.requirementItem}>
                <strong>שפה:</strong> טופס 106 ישראלי
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>❓ שאלות נפוצות</h3>

            <div style={styles.faqItem}>
              <h4 style={styles.faqQuestion}>מה זה טופס 106?</h4>
              <p style={styles.faqAnswer}>
                טופס 106 הוא דוח שנתי של הכנסות ממס הכנסה המציג הכנסות ומיסים ששולמו בשנת המס.
              </p>
            </div>

            <div style={styles.faqItem}>
              <h4 style={styles.faqQuestion}>הנתונים המוצגים מדויקים?</h4>
              <p style={styles.faqAnswer}>
                המערכת משתמשת ב-AI לחילוץ נתונים. התוצאות הן אומדנים בלבד ואינן מהווות ייעוץ מס רשמי. יש לאמת עם רואה חשבון.
              </p>
            </div>

            <div style={styles.faqItem}>
              <h4 style={styles.faqQuestion}>האם הקובץ שלי בטוח?</h4>
              <p style={styles.faqAnswer}>
                הקובצים מעובדים על סרברים מאובטחים ואינם נשמרים אחרי עיבוד. הנתונים הם שלך בלבד.
              </p>
            </div>

            <div style={styles.faqItem}>
              <h4 style={styles.faqQuestion}>כמה זמן לוקח לעבד?</h4>
              <p style={styles.faqAnswer}>
                בדרך כלל 2-5 שניות בהתאם לאינטרנט ולאיכות הטופס.
              </p>
            </div>

            <div style={styles.faqItem}>
              <h4 style={styles.faqQuestion}>מה אם הטופס לא עובד?</h4>
              <p style={styles.faqAnswer}>
                נסה בטופס ברור יותר. אם הבעיה נמשכת, פנה אל תמיכה טכנית.
              </p>
            </div>
          </div>

          {/* Troubleshooting Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🔧 פתרון בעיות</h3>

            <div style={styles.troubleItem}>
              <h4 style={styles.troubleTitle}>❌ הודעת שגיאה: "קובץ גדול מדי"</h4>
              <p style={styles.troubleAnswer}>
                הקובץ שלך גדול מ-50MB. ודא שבחרת את הקובץ הנכון או נסה לדחוס אותו.
              </p>
            </div>

            <div style={styles.troubleItem}>
              <h4 style={styles.troubleTitle}>❌ הודעת שגיאה: "בחר קובץ PDF"</h4>
              <p style={styles.troubleAnswer}>
                רק קובצי PDF זמינים. ודא שהקובץ בפורמט .pdf ולא סוג אחר.
              </p>
            </div>

            <div style={styles.troubleItem}>
              <h4 style={styles.troubleTitle}>⏳ העיבוד לוקח מאוד הרבה זמן</h4>
              <p style={styles.troubleAnswer}>
                בדוק את חיבור האינטרנט שלך. אם הבעיה נמשכת, טען מחדש את העמוד.
              </p>
            </div>

            <div style={styles.troubleItem}>
              <h4 style={styles.troubleTitle}>❌ כמה שדות לא הוצאו</h4>
              <p style={styles.troubleAnswer}>
                אם טופס אינו ברור, ה-AI עשוי להחמיץ שדות. נסה בקובץ איכותי יותר.
              </p>
            </div>
          </div>

          {/* Tips Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💡 עצות שימושיות</h3>
            <ul style={styles.tipsList}>
              <li style={styles.tipsItem}>
                📸 טופס סרוק משפיע על יכולת חילוץ - בחר סריקה ברורה
              </li>
              <li style={styles.tipsItem}>
                🔄 אתה יכול להעלות כמה טפסים בזה אחר זה
              </li>
              <li style={styles.tipsItem}>
                🌙 השתמש בנושא כהה בלילה כדי להקל על העיניים
              </li>
              <li style={styles.tipsItem}>
                📋 שמור את תוצאות החישוב לשלך רשומות
              </li>
              <li style={styles.tipsItem}>
                ⚖️ הנושא של תוצאות זה הערכה בלבד, בדוק עם רואה חשבון
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div style={styles.contactBox}>
            <p style={styles.contactTitle}>🤝 עדיין צריך עזרה?</p>
            <p style={styles.contactText}>
              אנא צור קשר עם התמיכה הטכנית דרך העמוד "אודות".
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
    list: {
      listStyle: 'decimal',
      paddingRight: '1.5rem',
      margin: 0,
      color: theme.text.secondary,
      fontSize: '0.95rem',
      lineHeight: '1.8',
    },
    listItem: {
      marginBottom: '0.5rem',
      color: theme.text.secondary,
    },
    requirementBox: {
      backgroundColor: theme.bg.secondary,
      padding: '1.5rem',
      borderRadius: '8px',
      borderLeft: `4px solid ${theme.accent.info}`,
    },
    requirementItem: {
      margin: '0.5rem 0',
      color: theme.text.secondary,
      fontSize: '0.95rem',
    },
    faqItem: {
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: `1px solid ${theme.border.primary}`,
    },
    faqQuestion: {
      margin: '0 0 0.5rem 0',
      fontSize: '1rem',
      color: theme.text.primary,
      fontWeight: '600',
    },
    faqAnswer: {
      margin: 0,
      color: theme.text.secondary,
      fontSize: '0.95rem',
      lineHeight: '1.6',
    },
    troubleItem: {
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: theme.bg.tertiary,
      borderRadius: '6px',
      borderRight: `3px solid ${theme.accent.error}`,
    },
    troubleTitle: {
      margin: '0 0 0.5rem 0',
      fontSize: '0.95rem',
      color: theme.text.primary,
      fontWeight: '600',
    },
    troubleAnswer: {
      margin: 0,
      color: theme.text.secondary,
      fontSize: '0.9rem',
      lineHeight: '1.5',
    },
    tipsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'grid',
      gap: '0.75rem',
    },
    tipsItem: {
      color: theme.text.secondary,
      padding: '0.75rem 1rem',
      backgroundColor: theme.bg.secondary,
      borderRadius: '6px',
      fontSize: '0.95rem',
      transition: 'background-color 0.2s',
    },
    contactBox: {
      padding: '1.5rem',
      backgroundColor: theme.accent.infoBg,
      borderLeft: `4px solid ${theme.accent.info}`,
      borderRadius: '6px',
      marginTop: '1rem',
    },
    contactTitle: {
      margin: '0 0 0.5rem 0',
      color: theme.accent.infoText,
      fontSize: '1rem',
      fontWeight: '600',
    },
    contactText: {
      margin: 0,
      color: theme.accent.infoText,
      fontSize: '0.95rem',
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
