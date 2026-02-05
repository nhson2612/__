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
  const query = collection.where('shopId', '==', shopDomain);
  query.sort(sort, direction);

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
    query.endBefore(e).limitToLast(limit);
  }

  if (!firstElement) {
    query.limit(limit);
  }

  const docs = query.get();
  const data = docs.docs.map(doc => ({id: doc.id, ...doc.data()}));
  console.log('>>>>>>>>>>>>> NOTIFICATIONS DATA : ', data);
  let hasNext = false;
  let hasPrev = false;
  let newFirstElement = null;
  let newLastElement = null;

  if (data.length > 0) {
    const first = docs.docs[0];
    const last = docs.docs[docs.docs.length - 1];

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
    hasPrev = hasPrev && prevCheck.empty;
    hasNext = !nextCheck.empty;
  }

  return {
    data,
    total: docs.size,
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
