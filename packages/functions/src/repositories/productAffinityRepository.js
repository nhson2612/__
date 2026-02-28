import {Firestore} from '@google-cloud/firestore';

const firestoreConfig = {
  projectId: 'todo-app-frontend-7ff2'
};

const firestore = new Firestore(firestoreConfig);
const collection = firestore.collection('product_affinity');

const BATCH_SIZE = 500;

function buildDocId({shopId, productId, relatedProductId}) {
  return `${shopId}_${productId}_${relatedProductId}`;
}

/**
 * Upsert a single product affinity record
 * @param {object} data
 * @param {string} data.shopId
 * @param {string} data.productId
 * @param {string} data.relatedProductId
 * @param {number} data.ordersCount
 * @param {number} data.score
 * @returns {Promise<string>}
 */
export async function upsert(data) {
  const {shopId, productId, relatedProductId} = data;
  const docId = buildDocId({shopId, productId, relatedProductId});
  await collection.doc(docId).set(
    {
      ...data,
      updatedAt: new Date()
    },
    {merge: true}
  );
  return docId;
}

/**
 * Bulk upsert product affinity records
 * @param {Array<object>} items
 * @returns {Promise<number>} number of upserted docs
 */
export async function bulkUpsert(items = []) {
  if (!items.length) return 0;

  let count = 0;
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = firestore.batch();
    const chunk = items.slice(i, i + BATCH_SIZE);

    chunk.forEach(item => {
      const {shopId, productId, relatedProductId} = item;
      const docId = buildDocId({shopId, productId, relatedProductId});
      const ref = collection.doc(docId);
      batch.set(
        ref,
        {
          ...item,
          updatedAt: new Date()
        },
        {merge: true}
      );
    });

    await batch.commit();
    count += chunk.length;
  }

  return count;
}

/**
 * Get top related products for a given product
 * @param {string} shopId
 * @param {string} productId
 * @param {number} [limit=5]
 * @returns {Promise<Array<object>>}
 */
export async function getTopRelatedProducts(shopId, productId, limit = 5) {
  const snapshot = await collection
    .where('shopId', '==', shopId)
    .where('productId', '==', productId)
    .orderBy('score', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
}

/**
 * Delete all affinity records for a shop
 * @param {string} shopId
 * @returns {Promise<number>} number of deleted docs
 */
export async function deleteByShopId(shopId) {
  const snapshot = await collection.where('shopId', '==', shopId).get();
  if (snapshot.empty) return 0;

  let count = 0;
  for (let i = 0; i < snapshot.docs.length; i += BATCH_SIZE) {
    const batch = firestore.batch();
    const chunk = snapshot.docs.slice(i, i + BATCH_SIZE);
    chunk.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    count += chunk.length;
  }

  return count;
}
