import {Firestore} from '@google-cloud/firestore';
import {formatDateFields} from '@avada/firestore-utils';

const firestore = new Firestore();
const collection = firestore.collection('shops');

export async function getShopById(id) {
  const doc = await collection.doc(id).get();
  return {id: doc.id, ...doc.data()};
}

export async function getShopByShopifyDomain(shopifyDomain) {
  try {
    return await getShopByField(shopifyDomain, 'shopifyDomain');
  } catch (error) {
    console.error('Error getting shop by Shopify domain:', error);
    return null;
  }
}

export async function getShopByField(value, field = 'shopifyDomain') {
  const docs = await collection
    .where(field, '==', value)
    .limit(1)
    .get();

  if (docs.docs.length === 0) {
    return null;
  }

  const doc = docs.docs[0];
  return {id: doc.id, ...formatDateFields(doc.data())};
}
