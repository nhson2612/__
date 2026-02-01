/**
 * API Manager
 *
 * Handles all API requests to the backend.
 * Uses XMLHttpRequest for maximum browser compatibility.
 */

import {makeRequest} from '../helpers/api';

export default class ApiManager {
  constructor() {
    this.shopDomain = window.Shopify?.shop || '';
    this.apiUrl = process.env.API_URL || '';
  }

  /**
   * Get widget data from API
   * Falls back to window data if available (set by Liquid)
   */
  async getNotifications() {
    if (!this.shopDomain) return null;
    try {
      const url = `${this.apiUrl}/clientApi/notifications?shopifyDomain=${this.shopDomain}`;
      const response = await makeRequest(url);
      return response;
    } catch (error) {
      console.error('[Avada] API request failed:', error);
      return null;
    }
  }

  /**
   * Track an event (e.g., widget displayed, clicked)
   */
  async trackEvent(eventType, eventData = {}) {
    if (!this.apiUrl) return;

    try {
      await makeRequest(
        `${this.apiUrl}/clientApi/track`,
        'POST',
        {
          shopDomain: this.shopDomain,
          eventType,
          ...eventData
        },
        {contentType: 'application/json'}
      );
    } catch (error) {
      // Silent fail for tracking
      console.warn('[Avada] Tracking failed:', error);
    }
  }
}
