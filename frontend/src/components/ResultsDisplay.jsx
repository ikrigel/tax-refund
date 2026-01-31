import { formatCurrency, formatNumber, formatDate, formatMonthlyIncome, getTaxYearDisplay } from '../utils/formatters.js';

/**
 * Results display component
 * Shows extracted tax form 106 data in organized sections
 */
export const ResultsDisplay = ({ data, extractedAt, onClear }) => {
  if (!data) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>✅ נתונים חולצו בהצלחה</h2>
        <button onClick={onClear} style={styles.clearButton}>עיבוד קובץ חדש</button>
      </div>

      <div style={styles.timestamp}>
        עובד: {extractedAt && formatDate(extractedAt)}
      </div>

      <div style={styles.sections}>
        {/* Tax Year */}
        <Section title="שנת המס">
          <Row label="שנה" value={data.tax_year} />
        </Section>

        {/* Employee Info */}
        {data.employee && (
          <Section title="פרטי העובד">
            <Row label="שם" value={data.employee.name} />
            <Row label="תעודת זהות" value={data.employee.id} />
            <Row label="כתובת" value={data.employee.address} />
            <Row label="טלפון" value={data.employee.phone} />
          </Section>
        )}

        {/* Employer Info */}
        {data.employer && (
          <Section title="פרטי המעסיק">
            <Row label="שם מעסיק" value={data.employer.name} />
            <Row label="מספר עוסק מורשה" value={data.employer.id} />
          </Section>
        )}

        {/* Income */}
        {data.income && (
          <Section title="הכנסה">
            <Row label="סה״כ הכנסה ברוטו" value={formatCurrency(data.income.total)} />
            <Row label="הכנסה חודשית" value={formatMonthlyIncome(data.income.monthly)} />
          </Section>
        )}

        {/* Tax Info */}
        {data.tax && (
          <Section title="מס">
            <Row label="סה״כ מס שנוכה" value={formatCurrency(data.tax.total_paid)} />
            <Row label="נקודות זיכוי" value={data.tax.credit_points ? formatNumber(data.tax.credit_points) : 'לא זמין'} />
          </Section>
        )}

        {/* Deductions */}
        {data.deductions && hasDeductions(data.deductions) && (
          <Section title="ניכויים וקיזוזים">
            <Row label="ביטוח לאומי" value={formatCurrency(data.deductions.national_insurance)} />
            <Row label="ביטוח בריאות" value={formatCurrency(data.deductions.health_insurance)} />
            <Row label="פנסיה - עובד" value={formatCurrency(data.deductions.pension_employee)} />
            <Row label="פנסיה - מעסיק" value={formatCurrency(data.deductions.pension_employer)} />
            <Row label="קרן השתלמות" value={formatCurrency(data.deductions.training_fund)} />
            <Row label="פיצויים" value={formatCurrency(data.deductions.severance_fund)} />
          </Section>
        )}

        {/* Work Period */}
        {data.work_period && hasWorkPeriod(data.work_period) && (
          <Section title="תקופת עבודה">
            <Row label="ימי עבודה" value={data.work_period.days ? formatNumber(data.work_period.days) : 'לא זמין'} />
            <Row label="חודשי עבודה" value={data.work_period.months ? formatNumber(data.work_period.months) : 'לא זמין'} />
          </Section>
        )}
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          הנתונים חוצלו באמצעות OCR ו-AI. אנא בדוק את הנתונים לדיוק.
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>{title}</h3>
    <div style={styles.sectionContent}>{children}</div>
  </div>
);

const Row = ({ label, value }) => (
  <div style={styles.row}>
    <span style={styles.label}>{label}:</span>
    <span style={styles.value}>{value || 'לא זמין'}</span>
  </div>
);

const hasDeductions = (deductions) => {
  return Object.values(deductions).some(v => v !== null && v !== undefined && v !== 0);
};

const hasWorkPeriod = (period) => {
  return period.days !== null || period.months !== null;
};

const styles = {
  container: {
    padding: '1.5rem',
    backgroundColor: '#f5f5f5',
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
    color: '#2e7d32',
    fontSize: '1.3rem',
  },
  clearButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  timestamp: {
    color: '#999',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
  },
  sections: {
    display: 'grid',
    gap: '1rem',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '6px',
    padding: '1rem',
    border: '1px solid #e0e0e0',
  },
  sectionTitle: {
    margin: '0 0 1rem 0',
    color: '#1976d2',
    fontSize: '1rem',
    borderBottom: '2px solid #e0e0e0',
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
    borderBottom: '1px solid #f5f5f5',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    minWidth: '150px',
  },
  value: {
    color: '#666',
    textAlign: 'left',
    direction: 'ltr',
  },
  footer: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#fff3cd',
    borderLeft: '4px solid #ffc107',
    borderRadius: '4px',
  },
  footerText: {
    margin: 0,
    color: '#856404',
    fontSize: '0.9rem',
  },
};
