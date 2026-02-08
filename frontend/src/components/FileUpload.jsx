import { useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * File upload component with drag-and-drop support
 * Handles PDF file selection and validation
 */
export const FileUpload = ({ onSubmit, disabled, fileName }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const theme = useTheme();

  const handleFile = (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('אנא בחר קובץ PDF');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('קובץ גדול מדי (מקסימום 50MB)');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type !== 'dragleave');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
      setSelectedFile(null);
    }
  };

  const styles = createStyles(theme);

  return (
    <div style={styles.container}>
      <div
        style={{ ...styles.dropZone, ...(dragActive ? styles.dropZoneActive : {}) }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          style={styles.input}
          disabled={disabled}
        />
        <p style={styles.dragText}>גרור קובץ PDF או</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{ ...styles.button, opacity: disabled ? 0.5 : 1 }}
          disabled={disabled}
        >
          בחר קובץ
        </button>
      </div>

      {selectedFile && (
        <div style={styles.fileInfo}>
          <p style={styles.fileName}>קובץ נבחר: {selectedFile.name}</p>
          <button
            onClick={handleSubmit}
            style={styles.submitButton}
            disabled={disabled}
          >
            {disabled ? 'שולח...' : 'העלה וחלץ נתונים'}
          </button>
        </div>
      )}

      {fileName && !selectedFile && (
        <p style={styles.uploadedFile}>📄 {fileName}</p>
      )}
    </div>
  );
};

function createStyles(theme) {
  return {
    container: {
      width: '100%',
      maxWidth: '500px',
      margin: '0 auto',
    },
    dropZone: {
      border: `2px dashed ${theme.border.dashed}`,
      borderRadius: '8px',
      padding: '2rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: theme.bg.primary,
    },
    dropZoneActive: {
      borderColor: theme.accent.primary,
      backgroundColor: theme.accent.dragActive,
    },
    input: {
      display: 'none',
    },
    dragText: {
      color: theme.text.secondary,
      marginBottom: '1rem',
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: theme.accent.info,
      color: theme.text.inverted,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
    },
    fileInfo: {
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: theme.bg.tertiary,
      borderRadius: '4px',
    },
    fileName: {
      margin: '0 0 1rem 0',
      color: theme.text.primary,
      wordBreak: 'break-word',
    },
    submitButton: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: theme.accent.success,
      color: theme.text.inverted,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
    },
    uploadedFile: {
      marginTop: '1rem',
      color: theme.text.secondary,
    },
  };
}
