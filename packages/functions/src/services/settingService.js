import * as settingRepository from '../repositories/settingRepository';

const initialState = {
  display: {
    displayDuration: 5,
    firstPopDelay: 1,
    gapTime: 3,
    hideTimeAgo: false,
    maxPopups: 80,
    position: 'bottom-left',
    truncateContent: true
  },
  shopId: 'random_string',
  triggers: {
    excludedPages: [],
    pageRestriction: 'all',
    specificPages: []
  }
};

function buildDefaultSettings(shopId) {
  return {
    ...initialState,
    shopId
  };
}

function normalizeSettings(settings, shopId) {
  if (!settings) {
    return buildDefaultSettings(shopId);
  }

  return {
    ...buildDefaultSettings(shopId),
    ...settings,
    display: {
      ...initialState.display,
      ...settings.display
    },
    triggers: {
      ...initialState.triggers,
      ...settings.triggers
    }
  };
}

export async function getSettings(shopId) {
  return settingRepository.getSettings(shopId);
}

export async function getSettingsWithDefault(shopId) {
  const settings = await settingRepository.getSettings(shopId);
  return normalizeSettings(settings, shopId);
}

export async function updateSettings(shopId, data) {
  const normalized = normalizeSettings(data, shopId);
  await settingRepository.setSettings(shopId, normalized);
  return normalized;
}

export async function initializeShopSettings(shopId) {
  try {
    const settings = await settingRepository.getSettings(shopId);
    if (settings) {
      console.log('[AFTER INSTALL] Shop settings already exist');
      return normalizeSettings(settings, shopId);
    }
    console.log('[AFTER INSTALL] Initializing shop settings');
    const defaults = buildDefaultSettings(shopId);
    console.log('[AFTER INSTALL] Default settings:', defaults);
    await settingRepository.setSettings(shopId, defaults);
    console.log('[AFTER INSTALL] Shop settings initialized successfully');
    return defaults;
  } catch (error) {
    console.error('Error initializing shop settings:', error);
    console.log('[AFTER INSTALL] Fallback to default settings');
    return buildDefaultSettings(shopId);
  }
}
