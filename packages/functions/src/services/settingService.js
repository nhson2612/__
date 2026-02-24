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

/**
 * Build default settings for a shop
 * @param {string} shopId - Shop ID
 * @returns {Object} Default settings object
 */
export function buildDefaultSettings(shopId) {
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

/**
 * Get settings for a shop
 * @param {string} shopId - Shop ID
 * @returns {Promise<Object>} Settings in remote format
 */
export async function getSettings(shopId) {
  const settings = await settingRepository.getSettings(shopId);
  return toRemote(settings);
}

/**
 * Get settings with defaults applied
 * @param {string} shopId - Shop ID
 * @returns {Promise<Object>} Settings with defaults in remote format
 */
export async function getSettingsWithDefault(shopId) {
  const settings = await settingRepository.getSettings(shopId);
  const normalized = normalizeSettings(settings, shopId);
  return toRemote(normalized);
}

/**
 * Update settings for a shop
 * @param {string} shopId - Shop ID
 * @param {Object} data - Settings data to update
 * @returns {Promise<Object>} Updated settings in remote format
 */
export async function updateSettings(shopId, data) {
  const flatData = toLocal(data);
  const normalized = normalizeSettings(flatData, shopId);
  await settingRepository.save(shopId, normalized);
  return toRemote(normalized);
}

/**
 * Initialize default settings for a shop if not exists
 * @param {string} shopId - Shop ID
 * @returns {Promise<Object>} Current or default settings
 */
export async function initializeShopSettings(shopId) {
  try {
    const settings = await settingRepository.getSettings(shopId);
    if (settings) {
      return toRemote(normalizeSettings(settings, shopId));
    }
    const defaults = buildDefaultSettings(shopId);
    await settingRepository.save(shopId, defaults);
    return toRemote(defaults);
  } catch (error) {
    return toRemote(buildDefaultSettings(shopId));
  }
}
