/**
 * API client for n8n tax refund extraction workflow
 * Handles communication with the webhook endpoint
 */

class TaxRefundAPI {
  constructor(webhookUrl = process.env.REACT_APP_WEBHOOK_URL || 'http://localhost:5678/webhook/tax-refund') {
    this.webhookUrl = webhookUrl;
  }

  /**
   * Upload a PDF file to the tax refund extraction workflow
   * @param {File} file - PDF file to upload
   * @returns {Promise<Object>} Response from the workflow
   */
  async uploadForm106(file) {
    if (!file) {
      throw new Error('File is required');
    }

    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are supported');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Network error - ensure the webhook URL is correct and CORS is enabled');
      }
      throw error;
    }
  }

  /**
   * Validate response structure
   * @param {Object} response - Response from the workflow
   * @returns {boolean} True if response is valid
   */
  isValidResponse(response) {
    return response && response.status && (response.status === 'success' || response.status === 'error');
  }

  /**
   * Check if response is a success
   * @param {Object} response - Response from the workflow
   * @returns {boolean} True if extraction was successful
   */
  isSuccess(response) {
    return response?.status === 'success';
  }

  /**
   * Get error message from response
   * @param {Object} response - Response from the workflow
   * @returns {string} Error message
   */
  getErrorMessage(response) {
    return response?.error?.message || 'Unknown error occurred';
  }
}

export default new TaxRefundAPI();
