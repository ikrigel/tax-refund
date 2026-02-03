import { useState } from 'react';
import { useTaxRefund } from './hooks/useTaxRefund.js';
import { useSettings } from './hooks/useSettings.js';
import { FileUpload } from './components/FileUpload.jsx';
import { ResultsDisplay } from './components/ResultsDisplay.jsx';
import { ErrorDisplay } from './components/ErrorDisplay.jsx';
import { LoadingSpinner } from './components/LoadingSpinner.jsx';
import { SettingsPanel } from './components/SettingsPanel.jsx';

/**
 * Main application component
 * Orchestrates the tax form 106 extraction workflow
 */
function App() {
  const { loading, success, error, data, fileName, submitForm, clearResults } = useTaxRefund();
  const { settings, updateSettings, isLoaded } = useSettings();
  const isDev = process.env.NODE_ENV === 'development';
  const [showSettings, setShowSettings] = useState(false);

  const handleFileSubmit = async (file) => {
    await submitForm(file);
  };

  const handleClear = () => {
    clearResults();
  };

  const handleSettingsOpen = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.appTitle}>📋 מערכת חישוב החזרי מיסים מטופס 106</h1>
              <p style={styles.appSubtitle}>🐕🐈 פולו ומרקו אוהבים מיסים🐈🐕</p>
            </div>
            <button
              onClick={handleSettingsOpen}
              style={styles.settingsButton}
              aria-label="Open settings"
              title="Open settings"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.container}>
          {/* Title Section */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>העלה טופס 106 לחילוץ נתונים</h2>
            <p style={styles.description}>
              בחר קובץ PDF של טופס 106 שלך. המערכת תחלץ את כל הנתונים הרלוונטיים באופן אוטומטי.
            </p>
          </section>

          {/* Main Content Area */}
          <section style={styles.contentSection}>
            {loading && <LoadingSpinner />}

            {!loading && success === null && (
              <FileUpload
                onSubmit={handleFileSubmit}
                disabled={loading}
                fileName={fileName}
              />
            )}

            {success === true && data && (
              <ResultsDisplay
                data={data}
                extractedAt={data.extracted_at}
                onClear={handleClear}
              />
            )}

            {success === false && error && (
              <ErrorDisplay
                error={error}
                onClear={handleClear}
                isDev={isDev}
              />
            )}
          </section>

          {/* Info Section */}
          <section style={styles.infoSection}>
            <h3 style={styles.infoTitle}>📌 איך זה עובד?</h3>
            <ol style={styles.infoList}>
              <li>בחר קובץ PDF של טופס 106</li>
              <li>המערכת תעלה את הקובץ לעיבוד</li>
              <li>AI יחלץ את הנתונים מהטופס</li>
              <li>תוצאות יוצגו בתצוגה מובנית</li>
            </ol>
          </section>

          {/* Support Info */}
          <section style={styles.supportSection}>
            <h3 style={styles.supportTitle}>❓ שאלות?</h3>
            <p style={styles.supportText}>
              טופסי 106 תומכים: קובצי PDF בלבד, עד 50MB.
            </p>
            <p style={styles.supportText}>
              לשאלות טכניות, בדוק את <code>DEPLOYMENT.md</code>.
            </p>
          </section>
        </div>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2024 מערכת חישוב החזרי מיסים מטופס 106 | טכנולוגיות n8n ו-React
        </p>
      </footer>

      {/* Settings Panel Modal */}
      {isLoaded && showSettings && (
        <SettingsPanel
          settings={settings}
          onUpdateSettings={updateSettings}
          onClose={handleSettingsClose}
        />
      )}
    </div>
  );
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#fafafa',
  },
  header: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    direction: 'rtl',
    textAlign: 'right',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  settingsButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
    color: 'white',
    transition: 'transform 0.2s',
  },
  appTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  appSubtitle: {
    margin: 0,
    fontSize: '1rem',
    opacity: 0.9,
  },
  main: {
    flex: 1,
    padding: '2rem',
    direction: 'rtl',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '2rem',
    textAlign: 'right',
  },
  sectionTitle: {
    color: '#1976d2',
    fontSize: '1.5rem',
    marginBottom: '1rem',
    borderBottom: '3px solid #1976d2',
    paddingBottom: '0.5rem',
  },
  description: {
    color: '#666',
    lineHeight: '1.6',
    fontSize: '1.05rem',
  },
  contentSection: {
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  infoSection: {
    padding: '1.5rem',
    backgroundColor: '#e3f2fd',
    borderLeft: '4px solid #1976d2',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    textAlign: 'right',
  },
  infoTitle: {
    margin: '0 0 1rem 0',
    color: '#1976d2',
    fontSize: '1.1rem',
  },
  infoList: {
    margin: 0,
    paddingRight: '1.5rem',
    color: '#333',
    lineHeight: '1.8',
  },
  supportSection: {
    padding: '1.5rem',
    backgroundColor: '#f3e5f5',
    borderLeft: '4px solid #7c4dff',
    borderRadius: '4px',
    textAlign: 'right',
  },
  supportTitle: {
    margin: '0 0 1rem 0',
    color: '#7c4dff',
    fontSize: '1.1rem',
  },
  supportText: {
    margin: '0.5rem 0',
    color: '#333',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '1.5rem',
    marginTop: 'auto',
  },
  footerText: {
    margin: 0,
    fontSize: '0.9rem',
  },
};

export default App;
