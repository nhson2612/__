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
  async getWidgetData() {
    // Option 1: Use data embedded in page by Liquid (faster, no API call)
    if (window.__avadaWidgetData) {
      return window.__avadaWidgetData;
    }

    // Option 2: Fetch from API (when data can't be embedded)
    if (!this.shopDomain) {
      console.warn('[Avada] Shop domain not found');
      return null;
    }

    try {
      const url = `https://charms-cheaper-sic-istanbul.trycloudflare.com/clientApi/widget?shopifyDomain=${this.shopDomain}`;
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
  async trackEvent(eventType, notificationId, productId = '') {
    if (!notificationId) return;

    try {
      await makeRequest(
        `${this.apiUrl}/clientApi/events`,
        'POST',
        {
          shopifyDomain: this.shopDomain,
          notificationId,
          productId,
          type: eventType
        },
        {contentType: 'application/json'}
      );
    } catch (error) {
      console.warn('[Avada] Tracking failed:', error);
    }
  }

  /**
   * Get notifications for the current shop
   */
  async getNotifications() {
    if (!this.shopDomain) {
      console.warn('[Avada] Shop domain not found');
      return null;
    }

    try {
      const url = `${this.apiUrl}/clientApi/notifications?shopifyDomain=${this.shopDomain}`;
      return await makeRequest(url);
    } catch (error) {
      console.error('[Avada] Failed to get notifications:', error);
      return null;
    }
  }
}
