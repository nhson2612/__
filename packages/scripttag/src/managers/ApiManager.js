/**
 * API Manager
 *
 * Handles all API requests to the backend.
 * Uses XMLHttpRequest for maximum browser compatibility.
 */

import {makeRequest} from '../helpers/api/makeRequest';

export default class ApiManager {
  constructor() {
    this.shopDomain = window.Shopify?.shop || '';
    this.apiUrl = process.env.API_URL || '';
  }

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
}