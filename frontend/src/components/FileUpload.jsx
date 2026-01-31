import { useRef, useState } from 'react';

/**
 * File upload component with drag-and-drop support
 * Handles PDF file selection and validation
 */
export const FileUpload = ({ onSubmit, disabled, fileName }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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

const styles = {
  container: {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  },
  dropZone: {
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  dropZoneActive: {
    borderColor: '#2196F3',
    backgroundColor: '#f0f8ff',
  },
  input: {
    display: 'none',
  },
  dragText: {
    color: '#666',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  fileInfo: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  fileName: {
    margin: '0 0 1rem 0',
    color: '#333',
    wordBreak: 'break-word',
  },
  submitButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  uploadedFile: {
    marginTop: '1rem',
    color: '#666',
  },
};
