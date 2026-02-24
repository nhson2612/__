import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
const shopInfosRef = firestore.collection('shopInfos');

export async function getShopInfoByShopId(id) {
  const docs = await shopInfosRef
    .where('shopId', '==', id)
    .limit(1)
    .get();
  if (docs.empty) {
    return null;
  }
  return docs.docs.map(doc => ({id: doc.id, ...doc.data()}));
}
