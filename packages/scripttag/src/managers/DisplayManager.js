import { render } from 'preact';
import { h } from 'preact';
import NotificationPopup from '../components/NotificationPopup/NotificationPopup';
import { delay } from '../helpers/delay';
import DomManager from './DomManager';
import ApiManager from './ApiManager';

const MS_IN_SECOND = 1000;

const timeAgo = timestamp => {
  const time = new Date(timestamp).getTime();
  if (Number.isNaN(time)) {
    return '';
  }

  const seconds = Math.floor((Date.now() - time) / MS_IN_SECOND);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

export default class DisplayManager {
  constructor() {
    this.notifications = [];
    this.settings = {};
    this.domManager = new DomManager();
    this.apiManager = new ApiManager();
  }

  async initialize({notifications, settings}) {
    this.notifications = notifications;
    this.settings = settings;

    if (!this.domManager.checkPageRestriction(settings)) {
      console.log('[Avada] Page restricted, not showing notifications.');
      return;
    }

    this._setupContainer(settings);
    await this.displayLoop(notifications, settings);
  }

  _setupContainer(settings) {
    const container = this.domManager.insertContainer();
    const displaySettings = settings?.display || settings || {};
    this.domManager.applyPositionStyles(container, displaySettings);
  }

  /**
   * Fade out and remove the popup
   */
  fadeOut() {
    const container = this.domManager.getContainer();
    render(null, container);
  }

  /**
   * Display a notification popup
   * @param {Object} notification
   */
  display({notification}) {
    const container = this.domManager.getContainer();

    if (!notification) {
      this.fadeOut();
      return;
    }

    this.apiManager.trackEvent('view', notification.id, notification.productId);

    const displaySettings = this.settings?.display || this.settings || {};
    const productUrl = notification.productHandle ? `/products/${notification.productHandle}` : '#';

    render(
      <NotificationPopup
        {...notification}
        timestamp={displaySettings.hideTimeAgo ? '' : timeAgo(notification.timestamp)}
        truncateContent={displaySettings.truncateContent}
        productUrl={productUrl}
        onClose={() => {
          this.fadeOut();
        }}
        onClick={e => {
          if (e?.preventDefault) e.preventDefault();
          if (e?.stopPropagation) e.stopPropagation();

          this.apiManager.trackEvent('click', notification.id, notification.productId);

          if (productUrl !== '#') {
            window.location.href = productUrl;
          }
        }}
      />,
      container
    );
  }

  /**
   * Loop through notifications and display them sequentially
   * @param {Array} notifications
   * @param {Object} settings
   */
  async displayLoop(notifications, settings) {
    const displaySettings = settings?.display || settings || {};
    const items = Array.isArray(notifications) ? notifications : [];
    const total = Math.min(items.length, displaySettings.maxPopups);

    if (total === 0) {
      return;
    }

    const firstDelay = (displaySettings.firstPopDelay || 0) * MS_IN_SECOND;
    const displayDuration = (displaySettings.displayDuration || 0) * MS_IN_SECOND;
    const gapTime = (displaySettings.gapTime || 0) * MS_IN_SECOND;

    await delay(firstDelay);

    for (let index = 0; index < total; index++) {
      this.display({notification: items[index]});

      await delay(displayDuration);
      this.fadeOut();

      if (index < total - 1) {
        await delay(gapTime);
      }
    }
  }
}
