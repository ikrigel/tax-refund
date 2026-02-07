/**
 * Multi-provider API client for tax refund extraction
 * Supports: n8n, Perplexity, Claude API providers
 * Uses settings from localStorage to determine active provider
 */

import logger from '../utils/logger';

class TaxRefundAPI {
  constructor() {
    this.corsProxy = import.meta.env.VITE_CORS_PROXY || '';
  }

  /**
   * Get current settings from localStorage
   */
  getSettings() {
    const defaultSettings = {
      provider: 'n8n',
      n8n: {
        url: import.meta.env.VITE_WEBHOOK_URL || 'http://localhost:5678/webhook/tax-refund',
        environment: 'production',
      },
      perplexity: { apiKey: '', url: 'https://api.perplexity.ai' },
      claude: { apiKey: '', url: 'https://api.anthropic.com' },
    };

    try {
      const saved = localStorage.getItem('taxRefundSettings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  /**
   * Upload PDF file using configured provider
   * @param {File} file - PDF file to upload
   * @returns {Promise<Object>} Response from the API
   */
  async uploadForm106(file) {
    if (!file) throw new Error('File is required');
    if (file.type !== 'application/pdf') throw new Error('Only PDF files are supported');

    const settings = this.getSettings();
    const provider = settings.provider;

    logger.info('API', `Using provider: ${provider}`, { provider });

    switch (provider) {
      case 'n8n':
        return this.uploadViaWebhook(file, settings.n8n);
      case 'perplexity':
        return this.uploadViaPerplexity(file, settings.perplexity);
      case 'claude':
        return this.uploadViaClaude(file, settings.claude);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Upload via n8n webhook (raw binary POST)
   */
  async uploadViaWebhook(file, config) {
    try {
      const url = this.corsProxy ? this.corsProxy + config.url : config.url;
      logger.debug('WEBHOOK', 'Webhook URL:', { url });

      const response = await fetch(url, {
        method: 'POST',
        body: file,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `HTTP ${response.status}`);
      }

      let data = await response.json();

      logger.debug('RESPONSE', 'Raw response', { preview: JSON.stringify(data).substring(0, 200) });

      // Handle n8n response wrapper - unwrap if needed
      // Case 1: Array wrapper [{ response: {...} }]
      if (Array.isArray(data) && data.length > 0) {
        logger.debug('RESPONSE', 'Response is array, checking for wrapper');
        if (data[0].response) {
          logger.debug('RESPONSE', 'Found response property in array[0], unwrapping');
          data = data[0].response;
        } else if (data[0].status) {
          logger.debug('RESPONSE', 'Found status at array[0], using first item');
          data = data[0];
        }
      }
      // Case 2: Direct object wrapper { response: {...} }
      else if (data && data.response && !data.status && typeof data.response === 'object') {
        logger.debug('RESPONSE', 'Found response property at top level, unwrapping');
        data = data.response;
      }

      logger.info('RESPONSE', 'Processed data', { data });
      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Network error - ensure webhook URL is correct and CORS is enabled');
      }
      throw error;
    }
  }

  /**
   * Upload via Perplexity API
   */
  async uploadViaPerplexity(file, config) {
    if (!config.apiKey) {
      throw new Error('Perplexity API key is not configured');
    }

    try {
      const fileContent = await file.text();
      const response = await fetch(config.url + '/chat/completions', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-small-online',
          messages: [
            {
              role: 'user',
              content: `Extract tax form 106 data from this text:\n\n${fileContent}`,
            },
          ],
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        status: 'success',
        data: data.choices?.[0]?.message?.content || '',
      };
    } catch (error) {
      throw new Error(`Perplexity upload failed: ${error.message}`);
    }
  }

  /**
   * Upload via Claude API
   */
  async uploadViaClaude(file, config) {
    if (!config.apiKey) {
      throw new Error('Claude API key is not configured');
    }

    try {
      const fileContent = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(fileContent)));

      const response = await fetch(config.url + '/v1/messages', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'document',
                  source: {
                    type: 'base64',
                    media_type: 'application/pdf',
                    data: base64,
                  },
                },
                {
                  type: 'text',
                  text: 'Extract all data from this Israeli Form 106 tax document and return as JSON',
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        status: 'success',
        data: data.content?.[0]?.text || '',
      };
    } catch (error) {
      throw new Error(`Claude upload failed: ${error.message}`);
    }
  }

  /**
   * Validate response structure
   */
  isValidResponse(response) {
    if (!response) {
      logger.warn('VALIDATION', 'Response is null or undefined');
      return false;
    }

    // Check for valid status field
    const hasValidStatus = response.status && ['success', 'error'].includes(response.status);

    if (hasValidStatus) {
      logger.debug('VALIDATION', 'Response validation passed', { status: response.status });
      return true;
    }

    logger.error('VALIDATION', 'Response validation failed', {
      hasStatus: !!response.status,
      statusValue: response.status,
      responseKeys: Object.keys(response || {}),
      responsePreview: JSON.stringify(response).substring(0, 200),
    });
    return false;
  }

  /**
   * Check if response is successful
   */
  isSuccess(response) {
    return response?.status === 'success';
  }

  /**
   * Get error message from response
   */
  getErrorMessage(response) {
    return response?.error?.message || 'Unknown error occurred';
  }
}

export default new TaxRefundAPI();
