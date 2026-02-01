import {render, h} from 'preact';
import NotificationPopup from './components/NotificationPopup/NotificationPopup';
import ApiManager from './managers/ApiManager';
import {insertAfter, findTargetElement} from './helpers/dom';

// Simple time ago formatter (since Moment.js is heavy)
function timeAgo(dateParam) {
  if (!dateParam) return null;
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

async function init() {
  try {
    const apiManager = new ApiManager();
    const response = await apiManager.getNotifications();

    if (!response || !response.success || !response.data) {
      console.log('[Avada] No data available');
      return;
    }

    const {settings, notifications} = response.data;
    const {triggers, display} = settings || {};

    // 1. Check Triggers (Page Restriction)
    const currentPath = window.location.pathname;
    if (triggers?.pageRestriction === 'specific') {
      const allowed = (triggers.specificPages || []).some(p => currentPath.includes(p.trim()));
      if (!allowed) return;
    }
    
    if (triggers?.excludedPages && triggers.excludedPages.length > 0) {
      const excluded = (triggers.excludedPages || []).some(p => currentPath.includes(p.trim()));
      if (excluded) return;
    }

    if (!notifications || notifications.length === 0) return;

    // 2. Prepare Display Logic
    const container = document.createElement('div');
    container.id = 'avada-notification-container';
    // Positioning
    Object.assign(container.style, {
      position: 'fixed',
      zIndex: '2147483647',
      [display?.position?.includes('bottom') ? 'bottom' : 'top']: '20px',
      [display?.position?.includes('left') ? 'left' : 'right']: '20px',
      maxWidth: '350px'
    });
    document.body.appendChild(container);

    let currentIndex = 0;
    
    const showNextNotification = () => {
      const notification = notifications[currentIndex];
      
      // Render
      render(
        <NotificationPopup
          firstName={notification.firstName}
          city={notification.city}
          country={notification.country}
          productName={notification.productName}
          productImage={notification.productImage}
          timestamp={display?.hideTimeAgo ? '' : timeAgo(notification.timestamp)}
          truncateContent={display?.truncateContent}
          onClose={() => {
            render(null, container); // Unmount
          }}
        />,
        container
      );

      // Schedule Hide
      setTimeout(() => {
        render(null, container); // Hide
        
        // Schedule Next Show
        currentIndex = (currentIndex + 1) % notifications.length;
        if (currentIndex < display?.maxPopups) { // Simple limit check
             setTimeout(showNextNotification, (display?.gapTime || 2) * 1000);
        }
      }, (display?.displayDuration || 5) * 1000);
    };

    // Start loop after initial delay
    setTimeout(showNextNotification, (display?.firstPopDelay || 0) * 1000);

  } catch (error) {
    console.error('[Avada] Init failed:', error);
  }
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}