import * as settingRepository from '../repositories/settingRepository';

const initialState = {
  displayDuration: 5,
  firstPopDelay: 1,
  gapTime: 3,
  hideTimeAgo: false,
  maxPopups: 80,
  position: 'bottom-left',
  truncateContent: true,
  shopId: 'random_string',
  excludedPages: [],
  pageRestriction: 'all',
  specificPages: []
};

function buildDefaultSettings(shopId) {
  return {
    ...initialState,
    shopId
  };
}

function toRemote(flatSettings) {
  if (!flatSettings) return null;
  const {
    displayDuration,
    firstPopDelay,
    gapTime,
    hideTimeAgo,
    maxPopups,
    position,
    truncateContent,
    excludedPages,
    pageRestriction,
    specificPages,
    shopId,
    ...rest
  } = flatSettings;

  return {
    display: {
      displayDuration,
      firstPopDelay,
      gapTime,
      hideTimeAgo,
      maxPopups,
      position,
      truncateContent
    },
    triggers: {
      excludedPages,
      pageRestriction,
      specificPages
    },
    shopId,
    ...rest
  };
}

function toLocal(nestedSettings) {
  if (!nestedSettings) return null;
  const {display, triggers, ...rest} = nestedSettings;
  return {
    ...rest,
    ...(display || {}),
    ...(triggers || {})
  };
}

function normalizeSettings(settings, shopId) {
  if (!settings) {
    return buildDefaultSettings(shopId);
  }
  return {
    ...buildDefaultSettings(shopId),
    ...settings
  };
}

export async function getSettings(shopId) {
  const settings = await settingRepository.getSettings(shopId);
  return toRemote(settings);
}

export async function getSettingsWithDefault(shopId) {
  const settings = await settingRepository.getSettings(shopId);
  const normalized = normalizeSettings(settings, shopId);
  return toRemote(normalized);
}

export async function updateSettings(shopId, data) {
  const flatData = toLocal(data);
  const normalized = normalizeSettings(flatData, shopId);
  await settingRepository.save(shopId, normalized);
  return toRemote(normalized);
}

export async function initializeShopSettings(shopId) {
  try {
    const settings = await settingRepository.getSettings(shopId);
    if (settings) {
      console.log('[AFTER INSTALL] Shop settings already exist');
      return toRemote(normalizeSettings(settings, shopId));
    }
    console.log('[AFTER INSTALL] Initializing shop settings');
    const defaults = buildDefaultSettings(shopId);
    console.log('[AFTER INSTALL] Default settings:', defaults);
    await settingRepository.save(shopId, defaults);
    console.log('[AFTER INSTALL] Shop settings initialized successfully');
    return toRemote(defaults);
  } catch (error) {
    console.error('Error initializing shop settings:', error);
    console.log('[AFTER INSTALL] Fallback to default settings');
    return toRemote(buildDefaultSettings(shopId));
  }
}
