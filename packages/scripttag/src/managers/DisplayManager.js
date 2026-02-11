import { insertAfter } from '../helpers/insertHelpers';
import { render } from 'preact';
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

    if (!this.checkPageRestriction(settings)) {
      console.log('[Avada] Page restricted, not showing notifications.');
      return;
    }

    this.insertContainer();
    this.displayLoop(notifications, settings);
  }

  checkPageRestriction(settings) {
    const {triggers} = settings;
    const {pageRestriction, specificPages, excludedPages} = triggers || {};
    const path = window.location.pathname;

    if (pageRestriction === 'specific') {
      return specificPages?.some(p => path.includes(p));
    }

    if (excludedPages?.some(p => path.includes(p))) {
      return false;
    }

    return true;
  }

  fadeOut() {
    const container = document.querySelector('#Avada-SalePop');
    render(null, container);
  }

  display({ notification }) {
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

    if (total === 0) {
      return;
    }

    const delay = (displaySettings.firstPopDelay || 0) * MS_IN_SECOND;
    const displayDuration = (displaySettings.displayDuration || 0) * MS_IN_SECOND;
    const gapTime = (displaySettings.gapTime || 0) * MS_IN_SECOND;
    let index = 0;

    const showNext = () => {
      if (index >= total) {
        return;
      }

      this.display({ notification: items[index] });
      index += 1;

      setTimeout(() => {
        this.fadeOut();
        if (index < total) {
          setTimeout(showNext, gapTime);
        }
      }, displayDuration);
    };

    setTimeout(showNext, delay);
  }
}
