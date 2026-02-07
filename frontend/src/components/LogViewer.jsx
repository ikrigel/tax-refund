import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import logger from '../utils/logger';

/**
 * LogViewer Modal Component
 * Displays, filters, searches, and exports logs
 */
export function LogViewer({ onClose }) {
  const theme = useTheme();
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    setLogs(logger.getLogs());
  };

  const filteredLogs = logs
    .filter((log) => filter === 'ALL' || log.level === filter)
    .filter((log) =>
      searchTerm === '' ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleCopy = async () => {
    const success = await logger.copyToClipboard();
    alert(success ? 'הועתק ללוח' : 'שגיאה בהעתקה');
  };

  const handleExport = () => {
    logger.exportLogs();
  };

  const handleClear = () => {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל הלוגים?')) {
      logger.clearLogs();
      loadLogs();
    }
  };

  const handleWhatsApp = () => {
    logger.shareViaWhatsApp();
  };

  const styles = getStyles(theme);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>📋 צפייה בלוגים</h2>
          <button onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.select}
          >
            <option value="ALL">כל הרמות</option>
            <option value="DEBUG">DEBUG</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>

          <input
            type="text"
            placeholder="חיפוש..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />

          <div style={styles.stats}>
            {filteredLogs.length} / {logs.length} רשומות
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button onClick={handleCopy} style={styles.actionButton}>
            📋 העתק
          </button>
          <button onClick={handleWhatsApp} style={styles.actionButton}>
            💬 WhatsApp
          </button>
          <button onClick={handleExport} style={styles.actionButton}>
            💾 ייצא
          </button>
          <button onClick={handleClear} style={styles.clearButton}>
            🗑️ מחק הכל
          </button>
        </div>

        {/* Log List */}
        <div style={styles.logList}>
          {filteredLogs.length === 0 ? (
            <div style={styles.emptyState}>אין לוגים להצגה</div>
          ) : (
            filteredLogs.map((log, idx) => (
              <LogEntry key={idx} log={log} theme={theme} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Individual log entry component
 */
function LogEntry({ log, theme }) {
  const [expanded, setExpanded] = useState(false);

  const levelColors = {
    DEBUG: theme.accent.info,
    INFO: theme.accent.success,
    WARN: theme.accent.warning,
    ERROR: theme.accent.error,
  };

  const styles = {
    logEntry: {
      padding: '0.75rem',
      marginBottom: '0.5rem',
      backgroundColor: theme.bg.tertiary,
      borderLeft: `3px solid ${levelColors[log.level]}`,
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    logHeader: {
      display: 'flex',
      gap: '1rem',
      fontSize: '0.85rem',
      marginBottom: '0.25rem',
      flexWrap: 'wrap',
    },
    logLevel: {
      fontWeight: 'bold',
      color: levelColors[log.level],
      minWidth: '60px',
    },
    logCategory: {
      color: theme.text.secondary,
      fontStyle: 'italic',
    },
    logTimestamp: {
      color: theme.text.tertiary,
      marginLeft: 'auto',
      fontSize: '0.8rem',
    },
    logMessage: {
      color: theme.text.primary,
      fontSize: '0.9rem',
      marginBottom: '0.25rem',
    },
    logData: {
      marginTop: '0.5rem',
      padding: '0.5rem',
      backgroundColor: theme.bg.primary,
      borderRadius: '4px',
      fontSize: '0.75rem',
      overflow: 'auto',
      color: theme.text.secondary,
      fontFamily: 'monospace',
    },
  };

  return (
    <div
      style={styles.logEntry}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={styles.logHeader}>
        <span style={styles.logLevel}>[{log.level}]</span>
        <span style={styles.logCategory}>{log.category}</span>
        <span style={styles.logTimestamp}>
          {new Date(log.timestamp).toLocaleString('he-IL')}
        </span>
      </div>
      <div style={styles.logMessage}>{log.message}</div>
      {expanded && log.data && (
        <pre style={styles.logData}>
          {JSON.stringify(log.data, null, 2)}
        </pre>
      )}
    </div>
  );
}

/**
 * Generate theme-aware styles for LogViewer
 */
function getStyles(theme) {
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
      zIndex: 2000,
    },
    modal: {
      backgroundColor: theme.bg.elevated,
      borderRadius: '8px',
      boxShadow: theme.shadow.lg,
      maxWidth: '900px',
      width: '90%',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      direction: 'rtl',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem',
      borderBottom: `1px solid ${theme.border.primary}`,
      backgroundColor: theme.special.settingsHeader,
    },
    title: {
      margin: 0,
      fontSize: '1.5rem',
      color: theme.text.primary,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: theme.text.secondary,
      padding: '0.5rem',
    },
    toolbar: {
      display: 'flex',
      gap: '1rem',
      padding: '1rem 1.5rem',
      borderBottom: `1px solid ${theme.border.primary}`,
      alignItems: 'center',
      backgroundColor: theme.bg.secondary,
      flexWrap: 'wrap',
    },
    select: {
      padding: '0.5rem',
      borderRadius: '4px',
      border: `1px solid ${theme.border.primary}`,
      backgroundColor: theme.bg.primary,
      color: theme.text.primary,
      fontSize: '0.9rem',
      cursor: 'pointer',
    },
    searchInput: {
      flex: 1,
      padding: '0.5rem',
      borderRadius: '4px',
      border: `1px solid ${theme.border.primary}`,
      backgroundColor: theme.bg.primary,
      color: theme.text.primary,
      fontSize: '0.9rem',
      minWidth: '150px',
    },
    stats: {
      color: theme.text.secondary,
      fontSize: '0.85rem',
      whiteSpace: 'nowrap',
    },
    actions: {
      display: 'flex',
      gap: '0.5rem',
      padding: '1rem 1.5rem',
      borderBottom: `1px solid ${theme.border.primary}`,
      flexWrap: 'wrap',
    },
    actionButton: {
      padding: '0.5rem 1rem',
      backgroundColor: theme.accent.info,
      color: theme.text.inverted,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.85rem',
    },
    clearButton: {
      padding: '0.5rem 1rem',
      backgroundColor: theme.accent.error,
      color: theme.text.inverted,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      marginLeft: 'auto',
    },
    logList: {
      flex: 1,
      overflow: 'auto',
      padding: '1rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '2rem',
      color: theme.text.tertiary,
    },
  };
}
