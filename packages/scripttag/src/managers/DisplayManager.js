import {insertAfter} from '../helpers/insertHelpers';
import {render} from 'preact';
import NotificationPopup from '../components/NotificationPopup/NotificationPopup';
import React from 'react';

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
  }
  async initialize({notifications, settings}) {
    this.notifications = notifications;
    this.settings = settings;
    this.insertContainer();
    this.displayLoop(notifications, settings);
  }

  fadeOut() {
    const container = document.querySelector('#Avada-SalePop');
    container.innerHTML = '';
  }

  display({notification}) {
    if (!notification) {
      this.fadeOut();
      return;
    }

    const container = document.querySelector('#Avada-SalePop');
    const displaySettings = this.settings?.display || this.settings || {};
    render(
      <NotificationPopup
        firstName={notification.firstName}
        city={notification.city}
        country={notification.country}
        productName={notification.productName}
        productImage={notification.productImage}
        timestamp={displaySettings.hideTimeAgo ? '' : timeAgo(notification.timestamp)}
        truncateContent={displaySettings.truncateContent}
        onClose={() => {
          this.fadeOut();
        }}
      />,
      container
    );
  }

  insertContainer() {
    const popupEl = document.createElement('div');
    popupEl.id = `Avada-SalePop`;
    popupEl.classList.add('Avada-SalePop__OuterWrapper');
    const targetEl = document.querySelector('body').firstChild;
    const displaySettings = this.settings?.display || this.settings || {};
    const position = displaySettings.position || 'bottom-left';
    const [yAxis, xAxis] = position.split('-');

    Object.assign(popupEl.style, {
      position: 'fixed',
      zIndex: '999999',
      [yAxis || 'bottom']: '20px',
      [xAxis || 'left']: '20px'
    });

    if (targetEl) {
      insertAfter(popupEl, targetEl);
    } else {
      document.body.appendChild(popupEl);
    }

    return popupEl;
  }

  displayLoop(notifications, settings) {
    const displaySettings = settings?.display || settings || {};
    const items = Array.isArray(notifications) ? notifications : [];
    const maxPopups = Number.isFinite(displaySettings.maxPopups)
      ? displaySettings.maxPopups
      : items.length;
    const total = Math.min(items.length, Math.max(0, maxPopups));

    console.log('[Avada] displayLoop settings:', settings);
    console.log('[Avada] displayLoop displaySettings:', displaySettings);
    console.log('[Avada] displayLoop items length:', items.length);
    console.log('[Avada] displayLoop maxPopups:', maxPopups, 'total:', total);

    if (total === 0) {
      console.log('[Avada] displayLoop aborted: total is 0');
      return;
    }

    const delay = (displaySettings.firstPopDelay || 0) * MS_IN_SECOND;
    const displayDuration = (displaySettings.displayDuration || 0) * MS_IN_SECOND;
    const gapTime = (displaySettings.gapTime || 0) * MS_IN_SECOND;
    let index = 0;

    const showNext = () => {
      if (index >= total) {
        console.log('[Avada] displayLoop finished at index:', index);
        return;
      }

      console.log('[Avada] displayLoop show index:', index);
      this.display({notification: items[index]});
      index += 1;

      setTimeout(() => {
        this.fadeOut();
        if (index < total) {
          console.log('[Avada] displayLoop schedule next after gap:', gapTime);
          setTimeout(showNext, gapTime);
        }
      }, displayDuration);
    };

    console.log('[Avada] displayLoop start after delay:', delay);
    setTimeout(showNext, delay);
  }
}
