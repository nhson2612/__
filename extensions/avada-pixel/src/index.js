import { register } from '@shopify/web-pixels-extension';

register(({ analytics, browser, settings, init }) => {
  console.log('[Avada Pixel v19 - Payload Fix] Initialized with settings:', settings);

  analytics.subscribe('avada_notif_clicked', async (event) => {
    console.log('[Avada Pixel] Received avada_notif_clicked:', event.customData);
    if (event.customData?.notif_id && event.customData?.product_id) {
      const attribution = JSON.stringify({
        notif_id: String(event.customData.notif_id),
        product_id: String(event.customData.product_id),
        clicked_at: event.timestamp
      });
      await browser.localStorage.setItem('avada_notif_attribution', attribution);
      console.log('[Avada Pixel] Attribution stored');
    }
  });

  analytics.subscribe('checkout_completed', async (event) => {
    console.log('[Avada Pixel] checkout_completed fired');
    try {
      const rawData = await browser.localStorage.getItem('avada_notif_attribution');
      console.log('[Avada Pixel] Attribution data:', rawData);
      if (!rawData) return;

      const attribution = JSON.parse(rawData);
      const checkout = event.data.checkout;

      const isProductBought = checkout.lineItems.some((item) => {
        const pId = String(item.variant?.product?.id || '');
        const attrId = String(attribution.product_id || '');
        return pId.includes(attrId) || attrId.includes(pId);
      });
      console.log('[Avada Pixel] Product matched:', isProductBought, 'Line items:', checkout.lineItems.map(i => i.variant?.product?.id));

      if (isProductBought && settings.appUrl) {
        const payload = {
          shopDomain: init.context.document.location.hostname || 'dung-thanh-n.myshopify.com',
          notifId: attribution.notif_id,
          productId: attribution.product_id,
          orderId: checkout.order?.id || checkout.token,
          revenue: checkout.subtotalPrice.amount,
          currency: checkout.subtotalPrice.currencyCode
        };
        console.log('[Avada Pixel] Sending conversion:', payload);

        const response = await fetch(`${settings.appUrl}/clientApi/pixel-conversion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        });
        console.log('[Avada Pixel] Response status:', response.status);
        await browser.localStorage.removeItem('avada_notif_attribution');
      }
    } catch (e) {
      console.error('[Avada Pixel] Error:', e);
    }
  });
});
