import {Firestore} from '@google-cloud/firestore';

const firestoreConfig = {
  projectId: 'todo-app-frontend-7ff2'
};

const firestore = new Firestore(firestoreConfig);
const collection = firestore.collection('notification_events');

/**
 * Create a new notification event
 * @param {object} eventData
 * @returns {Promise<string>}
 */
export async function create(eventData) {
  const doc = await collection.add({
    ...eventData,
    timestamp: new Date()
  });
  return doc.id;
}

/**
 * Get aggregated stats for a shop
 * @param {string} shopId
 * @returns {Promise<object>}
 */
export async function getStatsByShopId(shopId) {
  const snapshot = await collection.where('shopId', '==', shopId).get();

  const stats = {
    view: 0,
    click: 0,
    conversion: 0,
    totalRevenue: 0
  };

  snapshot.forEach(doc => {
    const data = doc.data();
    stats[data.type]++;
    if (data.type === 'conversion' && data.revenue) {
      stats.totalRevenue += Number(data.revenue);
    }
  });

  return stats;
}

/**
 * Get stats per notification for a given shop
 * @param {string} shopId
 * @returns {Promise<object>}
 */
export async function getStatsPerNotification(shopId) {
  const snapshot = await collection.where('shopId', '==', shopId).get();

  const notificationStats = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const nid = data.notificationId;

    if (!nid) return;

    if (!notificationStats[nid]) {
      notificationStats[nid] = {
        view: 0,
        click: 0,
        conversion: 0,
        revenue: 0,
        productId: data.productId || ''
      };
    }

    if (data.productId && !notificationStats[nid].productId) {
      notificationStats[nid].productId = data.productId;
    }

    if (notificationStats[nid].hasOwnProperty(data.type)) {
      notificationStats[nid][data.type]++;
      if (data.type === 'conversion' && data.revenue) {
        notificationStats[nid].revenue += Number(data.revenue);
      }
    }
  });

  return notificationStats;
}

/**
 * Find conversion event by order ID (to avoid duplicates)
 * @param {string} orderId
 * @returns {Promise<object|null>}
 */
export async function getConversionByOrderId(orderId) {
  const snapshot = await collection
    .where('type', '==', 'conversion')
    .where('orderId', '==', orderId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return {id: snapshot.docs[0].id, ...snapshot.docs[0].data()};
}

/**
 * Get stats aggregated by productId for a given shop
 * @param {string} shopId
 * @returns {Promise<object>}
 */
export async function getStatsPerProduct(shopId) {
  const snapshot = await collection.where('shopId', '==', shopId).get();

  const productStats = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const pid = data.productId;
    if (!pid) return;

    if (!productStats[pid]) {
      productStats[pid] = {
        productId: pid,
        view: 0,
        click: 0,
        conversion: 0,
        revenue: 0
      };
    }

    if (data.type === 'view') productStats[pid].view++;
    if (data.type === 'click') productStats[pid].click++;
    if (data.type === 'conversion') {
      productStats[pid].conversion++;
      if (data.revenue) {
        productStats[pid].revenue += Number(data.revenue);
      }
    }
  });

  return productStats;
}

/**
 * Check if a product has any click events for a given shop
 * @param {string} shopId
 * @param {string} productId - can be a partial match (e.g. "123456" matches "gid://shopify/Product/123456")
 * @returns {Promise<boolean>}
 */
export async function hasClicksForProduct(shopId, productId) {
  const snapshot = await collection
    .where('shopId', '==', shopId)
    .where('type', '==', 'click')
    .get();

  return snapshot.docs.some(doc => {
    const pid = doc.data().productId || '';
    return String(pid).includes(productId);
  });
}
