import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
const collection = firestore.collection('settings');

export async function getSettings(shopId) {
  const doc = await collection.doc(shopId).get();
  return doc.exists ? doc.data() : null;
}

export async function setSettings(shopId, data) {
  return collection.doc(shopId).set({...data, shopId}, {merge: true});
}
