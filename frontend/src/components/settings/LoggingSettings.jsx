import { useState } from 'react';
import logger from '../../utils/logger';
import { LogViewer } from '../LogViewer';

/**
 * Logging settings tab component
 */
export function LoggingSettings({ settings, onUpdateSettings, theme, styles }) {
  const [showLogViewer, setShowLogViewer] = useState(false);

  const handleLogLevelChange = (level) => {
    onUpdateSettings({ ...settings, logLevel: level });
  };

  const handleExportLogs = () => {
    logger.exportLogs();
  };

  const handleClearLogs = () => {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל הלוגים?')) {
      logger.clearLogs();
      alert('הלוגים נמחקו בהצלחה');
    }
  };

  const logs = logger.getLogs();

  return (
    <>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>הגדרות לוגים</h3>

        <div style={styles.formGroup}>
          <label style={styles.label}>רמת לוג:</label>
          <select
            value={settings.logLevel || 'INFO'}
            onChange={(e) => handleLogLevelChange(e.target.value)}
            style={styles.input}
          >
            <option value="NONE">ללא לוגים</option>
            <option value="ERROR">שגיאות בלבד</option>
            <option value="WARN">אזהרות ושגיאות</option>
            <option value="INFO">מידע, אזהרות ושגיאות</option>
            <option value="DEBUG">כל הלוגים (פיתוח)</option>
          </select>
          <p style={styles.hint}>רמת הלוג קובעת אילו הודעות ישמרו ב-localStorage</p>
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={() => setShowLogViewer(true)}
            style={styles.viewButton}
          >
            📋 צפה בלוגים ({logs.length})
          </button>
          <button onClick={handleExportLogs} style={styles.saveButton}>
            💾 ייצא לוגים
          </button>
          <button onClick={handleClearLogs} style={styles.clearButton}>
            🗑️ נקה לוגים
          </button>
        </div>

        <div style={styles.warningBox}>
          <p style={styles.warningText}>
            ⓘ לוגים מאוחסנים ב-localStorage (מקסימום 1000 רשומות)
          </p>
        </div>
      </div>

      {showLogViewer && (
        <LogViewer onClose={() => setShowLogViewer(false)} />
      )}
    </>
  );
}
