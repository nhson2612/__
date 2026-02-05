const isWebhookExists = async (shopify, topic) => {
  if (!shopify || !topic) {
    return false;
  }

  try {
    const hooks = await shopify.webhook.list({topic});
    return Array.isArray(hooks) && hooks.length > 0;
  } catch (error) {
    console.error('Error checking webhook existence:', error);
    return false;
  }
};

export default isWebhookExists;
