/**
 * Centralized Logging System
 *
 * Provides level-based logging with localStorage persistence.
 * Logs are stored as JSON with metadata (timestamp, category, level, data).
 * Supports export to JSON file and sharing via WhatsApp.
 */

const LOG_LEVELS = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
};

const LOG_STORAGE_KEY = 'taxRefundLogs';
const MAX_LOG_ENTRIES = 1000;

class Logger {
  constructor() {
    this.level = this.getLogLevel();
  }

  /**
   * Get current log level from settings
   */
  getLogLevel() {
    try {
      const settings = JSON.parse(localStorage.getItem('taxRefundSettings') || '{}');
      return LOG_LEVELS[settings.logLevel] ?? LOG_LEVELS.INFO;
    } catch {
      return LOG_LEVELS.INFO;
    }
  }

  /**
   * Internal method to add log entry to localStorage
   */
  addEntry(level, category, message, data = null) {
    const levelValue = LOG_LEVELS[level];

    // Don't log if below current log level
    if (levelValue > this.level) return;

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: data ? this.sanitizeData(data) : null,
    };

    try {
      const logs = this.getLogs();
      logs.unshift(entry); // Add to beginning (most recent first)

      // Keep only MAX_LOG_ENTRIES
      const trimmed = logs.slice(0, MAX_LOG_ENTRIES);

      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (error) {
      // If localStorage is full, trim to make space
      console.warn('Failed to save log entry:', error);
      this.trimLogs(500); // Keep only 500 most recent
    }
  }

  /**
   * Sanitize data to prevent storing sensitive information
   */
  sanitizeData(data) {
    if (typeof data !== 'object') return data;

    const sanitized = { ...data };
    const sensitiveKeys = ['apiKey', 'password', 'token', 'secret', 'Authorization'];

    Object.keys(sanitized).forEach((key) => {
      if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Get all logs from localStorage
   */
  getLogs() {
    try {
      const logs = localStorage.getItem(LOG_STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    localStorage.removeItem(LOG_STORAGE_KEY);
  }

  /**
   * Trim logs to specified count
   */
  trimLogs(count) {
    const logs = this.getLogs().slice(0, count);
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  }

  /**
   * Export logs as JSON file (browser download)
   */
  exportLogs() {
    const logs = this.getLogs();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('Z')[0];
    const filename = `tax-refund-logs-${timestamp}.json`;

    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Get logs as JSON string for sharing
   */
  getLogsAsString() {
    return JSON.stringify(this.getLogs(), null, 2);
  }

  /**
   * Share logs via WhatsApp
   * Creates a summary message and opens WhatsApp Web/App
   */
  shareViaWhatsApp() {
    const logs = this.getLogs();
    const errorCount = logs.filter((l) => l.level === 'ERROR').length;
    const warnCount = logs.filter((l) => l.level === 'WARN').length;

    const summary =
      `מערכת החזרי מיסים - דוח לוגים\n` +
      `סה"כ רשומות: ${logs.length}\n` +
      `שגיאות: ${errorCount}, אזהרות: ${warnCount}\n` +
      `דוח משנשלח דרך: ${new Date().toLocaleString('he-IL')}\n\n` +
      `יש לבדוק את הלוגים המלאים בקובץ JSON המייצא מהיישום.`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(summary)}`;
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Copy logs to clipboard
   */
  async copyToClipboard() {
    const logsString = this.getLogsAsString();
    try {
      await navigator.clipboard.writeText(logsString);
      return true;
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = logsString;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  }

  /**
   * Public logging methods
   */

  debug(category, message, data) {
    this.addEntry('DEBUG', category, message, data);
  }

  info(category, message, data) {
    this.addEntry('INFO', category, message, data);
  }

  warn(category, message, data) {
    this.addEntry('WARN', category, message, data);
  }

  error(category, message, data) {
    this.addEntry('ERROR', category, message, data);
  }
}

// Export singleton instance
export default new Logger();
