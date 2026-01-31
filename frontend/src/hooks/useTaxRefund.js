import { useState, useCallback } from 'react';
import api from '../services/api.js';

/**
 * Custom hook for tax refund form extraction
 * Manages state and API communication for the extraction workflow
 * @returns {Object} Hook state and handlers
 */
export const useTaxRefund = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [fileName, setFileName] = useState(null);

  const reset = useCallback(() => {
    setLoading(false);
    setSuccess(null);
    setError(null);
    setData(null);
    setFileName(null);
  }, []);

  const submitForm = useCallback(async (file) => {
    if (!file) {
      setError('בחר קובץ להעלאה');
      return;
    }

    reset();
    setLoading(true);
    setFileName(file.name);

    try {
      const response = await api.uploadForm106(file);

      if (!api.isValidResponse(response)) {
        throw new Error('Invalid response format from server');
      }

      if (api.isSuccess(response)) {
        setSuccess(true);
        setData(response.data);
        setError(null);
      } else {
        setSuccess(false);
        setError(api.getErrorMessage(response));
        setData(response.error?.details?.extracted_data || null);
      }
    } catch (err) {
      setSuccess(false);
      setError(err.message || 'שגיאה בהעלאת הקובץ');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  const clearResults = useCallback(() => {
    setSuccess(null);
    setError(null);
    setData(null);
    setFileName(null);
  }, []);

  const retrySubmit = useCallback((file) => {
    clearResults();
    submitForm(file);
  }, [clearResults, submitForm]);

  return {
    loading,
    success,
    error,
    data,
    fileName,
    submitForm,
    clearResults,
    retrySubmit,
    reset,
  };
};
