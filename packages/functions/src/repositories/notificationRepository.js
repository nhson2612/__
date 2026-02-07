import {Firestore} from '@google-cloud/firestore';

const firestoreConfig = {
  projectId: 'todo-app-frontend-7ff2'
};

if (process.env.FIRESTORE_EMULATOR_HOST) {
  firestoreConfig.host = process.env.FIREBASE_EMULATOR_HOST;
  firestoreConfig.ssl = false;
}

const firestore = new Firestore(firestoreConfig);
const collection = firestore.collection('notifications');

export async function getList(
  shopDomain,
  {limit = 30, sort = 'timestamp', direction = 'desc', firstElement, lastElement} = {}
) {
  let query = collection.where('shopId', '==', shopDomain);
  query = query.orderBy(sort, direction);

  if (firstElement) {
    const e = await collection.doc(firstElement).get();
    if (!e.exists) {
      console.log('>>>>>>>>>>>> RETURN EMPTY LIST CUZ FIRST ELEMENT DOES NOT EXIST');
      return {data: [], total: 0, pageInfo: {hasNext: false, hasPre: false}};
    }
    query.startAfter(e);
  } else if (lastElement) {
    const e = await collection.doc(lastElement).get();
    if (!e.exists) {
      console.log('>>>>>>>>>>>> RETURN EMPTY LIST CUZ LAST ELEMENT DOES NOT EXIST');
    }
    query = query.endBefore(e).limitToLast(limit);
  }

  if (!lastElement) {
    query = query.limit(limit);
  }

  const snapshot = await query.get();
  const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  console.log('>>>>>>>>>>>>> NOTIFICATIONS DATA : ', data);
  let hasNext = false;
  let hasPrev = false;
  let newFirstElement = null;
  let newLastElement = null;

  if (data.length > 0) {
    const first = snapshot.docs[0];
    const last = snapshot.docs[snapshot.docs.length - 1];

    newFirstElement = first.id;
    newLastElement = last.id;

    const nextCheck = await collection
      .where('shopId', '==', shopDomain)
      .orderBy(sort, direction)
      .startAfter(last)
      .limit(1)
      .get();
    const prevCheck = await collection
      .where('shopId', '==', shopDomain)
      .orderBy(sort, direction)
      .endBefore(first)
      .limit(1)
      .get();
    hasPrev = !prevCheck.empty;
    hasNext = !nextCheck.empty;
  }

  return {
    data,
    total: snapshot.size,
    pageInfo: {hasNext, hasPre: hasPrev, newFirstElement, newLastElement}
  };
}

export async function create(notification) {
  const doc = await collection.add(notification);
  return doc.id;
}

export async function getLatestByShopId(shopId, limit = 30) {
  const docs = await collection
    .where('shopId', '==', shopId)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();
  return docs.docs.map(doc => ({id: doc.id, ...doc.data()}));
}

export async function deleteOne(notificationId, shopDomain) {
  const notification = collection
    .where('id', '==', notificationId)
    .where('shopId', '==', shopDomain)
    .get();
  collection.delete(notification);
}
