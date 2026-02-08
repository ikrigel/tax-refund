import { formatCurrency, formatNumber, formatDate, formatMonthlyIncome, getTaxYearDisplay } from '../utils/formatters.js';
import { useTheme } from '../hooks/useTheme';

/**
 * Results display component
 * Shows extracted tax form 106 data in organized sections
 */
export const ResultsDisplay = ({ data, extractedAt, onClear }) => {
  const theme = useTheme();

  if (!data) return null;

  const styles = createStyles(theme);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>✅ נתונים חולצו בהצלחה</h2>
        <button onClick={onClear} style={styles.clearButton}>עיבוד קובץ חדש</button>
      </div>

      <div style={styles.timestamp}>
        חולץ: {extractedAt && formatDate(extractedAt)}
      </div>

      <div style={styles.sections}>
        {/* Tax Year */}
        <Section title="שנת המס" theme={theme}>
          <Row label="שנה" value={data.tax_year} theme={theme} />
        </Section>

        {/* Income and Tax Summary */}
        <Section title="הכנסה ומס" theme={theme}>
          <Row label="סה״כ הכנסה ברוטו" value={formatCurrency(data.total_taxable_income)} theme={theme} />
          <Row label="סה״כ מס שנוכה" value={formatCurrency(data.total_tax_withheld)} theme={theme} />
          {data.weighted_credit_points && (
            <Row label="נקודות זיכוי משוקללות" value={formatNumber(data.weighted_credit_points)} theme={theme} />
          )}
          {data.yearly_credit_used && (
            <Row label="זיכוי שנתי משמש" value={formatCurrency(data.yearly_credit_used)} theme={theme} />
          )}
        </Section>

        {/* Tax Calculation Results */}
        {data.gross_tax_estimated !== undefined && (
          <Section title="חישוב מס הכנסה" theme={theme}>
            <Row label="מס ברוטו משוער" value={formatCurrency(data.gross_tax_estimated)} theme={theme} />
            <Row label="מס נקי משוער" value={formatCurrency(data.net_tax_estimated)} theme={theme} />
            <Row label="הוצאה/החזר משוערים (AI)" value={formatCurrency(data.refund_estimated)} theme={theme} />
            {data.refund_calc_without_ai !== undefined && (
              <Row label="הוצאה/החזר ידני" value={formatCurrency(data.refund_calc_without_ai)} theme={theme} />
            )}
            {data.refund_direction && (
              <Row
                label="כיוון ההחזר"
                value={getRefundDirection(data.refund_direction)}
                theme={theme}
              />
            )}
          </Section>
        )}

        {/* Employee Info */}
        {data.employee && (
          <Section title="פרטי העובד" theme={theme}>
            <Row label="שם" value={data.employee.name} theme={theme} />
            <Row label="תעודת זהות" value={data.employee.id} theme={theme} />
            <Row label="כתובת" value={data.employee.address} theme={theme} />
            <Row label="טלפון" value={data.employee.phone} theme={theme} />
          </Section>
        )}

        {/* Employer Info */}
        {data.employer && (
          <Section title="פרטי המעסיק" theme={theme}>
            <Row label="שם מעסיק" value={data.employer.name} theme={theme} />
            <Row label="מספר עוסק מורשה" value={data.employer.id} theme={theme} />
          </Section>
        )}

        {/* Income */}
        {data.income && (
          <Section title="הכנסה" theme={theme}>
            <Row label="סה״כ הכנסה ברוטו" value={formatCurrency(data.income.total)} theme={theme} />
            <Row label="הכנסה חודשית" value={formatMonthlyIncome(data.income.monthly)} theme={theme} />
          </Section>
        )}

        {/* Tax Info */}
        {data.tax && (
          <Section title="מס" theme={theme}>
            <Row label="סה״כ מס שנוכה" value={formatCurrency(data.tax.total_paid)} theme={theme} />
            <Row label="נקודות זיכוי" value={data.tax.credit_points ? formatNumber(data.tax.credit_points) : 'לא זמין'} theme={theme} />
          </Section>
        )}

        {/* Deductions */}
        {data.deductions && hasDeductions(data.deductions) && (
          <Section title="ניכויים וקיזוזים" theme={theme}>
            <Row label="ביטוח לאומי" value={formatCurrency(data.deductions.national_insurance)} theme={theme} />
            <Row label="ביטוח בריאות" value={formatCurrency(data.deductions.health_insurance)} theme={theme} />
            <Row label="פנסיה - עובד" value={formatCurrency(data.deductions.pension_employee)} theme={theme} />
            <Row label="פנסיה - מעסיק" value={formatCurrency(data.deductions.pension_employer)} theme={theme} />
            <Row label="קרן השתלמות" value={formatCurrency(data.deductions.training_fund)} theme={theme} />
            <Row label="פיצויים" value={formatCurrency(data.deductions.severance_fund)} theme={theme} />
          </Section>
        )}

        {/* Work Period */}
        {data.work_period && hasWorkPeriod(data.work_period) && (
          <Section title="תקופת עבודה" theme={theme}>
            <Row label="ימי עבודה" value={data.work_period.days ? formatNumber(data.work_period.days) : 'לא זמין'} theme={theme} />
            <Row label="חודשי עבודה" value={data.work_period.months ? formatNumber(data.work_period.months) : 'לא זמין'} theme={theme} />
          </Section>
        )}

        {/* Notes */}
        {data.notes && data.notes.length > 0 && (
          <Section title="הערות" theme={theme}>
            {data.notes.map((note, idx) => (
              <div key={idx} style={styles.noteItem}>
                {note}
              </div>
            ))}
          </Section>
        )}
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          הנתונים חולצו באמצעות OCR ו-AI. אנא בדוק את הנתונים לדיוק.
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, children, theme }) => {
  const styles = createStyles(theme);
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      <div style={styles.sectionContent}>{children}</div>
    </div>
  );
};

const Row = ({ label, value, theme }) => {
  const styles = createStyles(theme);
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}:</span>
      <span style={styles.value}>{value || 'לא זמין'}</span>
    </div>
  );
};

const hasDeductions = (deductions) => {
  return Object.values(deductions).some(v => v !== null && v !== undefined && v !== 0);
};

const hasWorkPeriod = (period) => {
  return period.days !== null || period.months !== null;
};

const getRefundDirection = (direction) => {
  const directionMap = {
    'refund': '✅ החזר כספי',
    'pay_more': '⚠️ תשלום נוסף',
    'none': '➖ אין הבדל'
  };
  return directionMap[direction] || direction;
};

function createStyles(theme) {
  return {
    container: {
      padding: '1.5rem',
      backgroundColor: theme.bg.secondary,
      borderRadius: '8px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    title: {
      margin: 0,
      color: theme.accent.success,
      fontSize: '1.3rem',
    },
    clearButton: {
      padding: '0.5rem 1rem',
      backgroundColor: theme.accent.info,
      color: theme.text.inverted,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    timestamp: {
      color: theme.text.tertiary,
      fontSize: '0.85rem',
      marginBottom: '1.5rem',
    },
    sections: {
      display: 'grid',
      gap: '1rem',
    },
    section: {
      backgroundColor: theme.bg.primary,
      borderRadius: '6px',
      padding: '1rem',
      border: `1px solid ${theme.border.primary}`,
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
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      borderBottom: `1px solid ${theme.border.light}`,
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
    noteItem: {
      padding: '0.75rem',
      backgroundColor: theme.bg.tertiary,
      borderLeft: `3px solid ${theme.accent.primary}`,
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
      color: theme.text.primary,
      lineHeight: '1.4',
    },
    footer: {
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: theme.accent.warningBg,
      borderLeft: `4px solid ${theme.accent.warning}`,
      borderRadius: '4px',
    },
    footerText: {
      margin: 0,
      color: theme.accent.warningText,
      fontSize: '0.9rem',
    },
  };
}
