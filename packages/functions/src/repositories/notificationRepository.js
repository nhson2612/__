import {Firestore} from '@google-cloud/firestore';
import {paginateQuery} from './helper';

const firestoreConfig = {
  projectId: 'todo-app-frontend-7ff2'
};

const firestore = new Firestore(firestoreConfig);
const collection = firestore.collection('notifications');

export async function getList(
  shopDomain,
  {limit = 30, sort = 'timestamp', direction = 'desc', nextCursor, prevCursor} = {}
) {
  let query = collection.where('shopId', '==', shopDomain);
  query = query.orderBy(sort, direction);

  const paginationQuery = {
    limit,
    after: nextCursor,
    before: prevCursor
  };

  return await paginateQuery({
    queriedRef: query,
    collection,
    query: paginationQuery
  });
}

export async function create(notification) {
  const doc = await collection.add(notification);
  return doc.id;
}

export async function getById(notificationId) {
  if (!notificationId) return null;
  const doc = await collection.doc(notificationId).get();
  return doc.exists ? {id: doc.id, ...doc.data()} : null;
}

export async function getLatestByShopId(shopId, limit = 30) {
  const docs = await collection
    .where('shopId', '==', shopId)
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();
  return docs.docs.map(doc => ({id: doc.id, ...doc.data()}));
}

export async function deleteOne(notificationId, shopDomain) {
  const snapshot = await collection
    .where('id', '==', notificationId)
    .where('shopId', '==', shopDomain)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return false;
  }

  await snapshot.docs[0].ref.delete();
  return true;
}
