import ApiManager from './managers/ApiManager';
import DisplayManager from './managers/DisplayManager';

async function init() {
  try {
    const apiManager = new ApiManager();
    const response = await apiManager.getNotifications();

    if (!response || !response.success || !response.data) {
      console.log('[Avada] No data available');
      return;
    }

    const {settings, notifications} = response.data;

    const displayManager = new DisplayManager();
    await displayManager.initialize({notifications, settings});
  } catch (error) {
    console.error('[Avada] Init failed:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
