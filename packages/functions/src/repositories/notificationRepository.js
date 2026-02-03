import { Firestore } from '@google-cloud/firestore';
import { presentDataAndFormatDate } from '../presenters/notificationPresenter';

// Configure Firestore with emulator if environment variable is set
const firestoreSettings = {
  projectId: 'todo-app-frontend-7ff2'
};
if (process.env.FIRESTORE_EMULATOR_HOST) {
  firestoreSettings.host = process.env.FIRESTORE_EMULATOR_HOST;
  firestoreSettings.ssl = false;
}

const firestore = new Firestore(firestoreSettings);
const collection = firestore.collection('notifications');

/**
 * Get a list of notifications with pagination
 * @param {string} shopId
 * @param {Object} params
 * @param {number} params.limit
 * @param {string} params.sort
 * @param {string} params.direction
 * @param {string} params.nextCursor
 * @param {string} params.prevCursor
 * @returns {Promise<{data: any[], pageInfo: {hasNext: boolean, hasPrev: boolean, nextCursor: string, prevCursor: string}}>}
 */
export async function getList(
  shopId,
  {limit = 10, sort = 'timestamp', direction = 'desc', nextCursor, prevCursor}
) {
  const allowedSorts = new Set(['timestamp', 'createdAt']);
  const safeSort = allowedSorts.has(sort) ? sort : 'timestamp';
  let query = collection.where('shopId', '==', shopId);

  query = query.orderBy(safeSort, direction);
  query = query.orderBy('__name__', direction);
  if (nextCursor) {
    const cursorDoc = await collection.doc(nextCursor).get();
    if (!cursorDoc.exists) {
      return {
        data: [],
        pageInfo: {
          hasNext: false,
          hasPrev: false,
          nextCursor: null,
          prevCursor: null
        }
      };
    }
    query = query.startAfter(cursorDoc);
  } else if (prevCursor) {
    const cursorDoc = await collection.doc(prevCursor).get();
    if (!cursorDoc.exists) {
      return {
        data: [],
        pageInfo: {
          hasNext: false,
          hasPrev: false,
          nextCursor: null,
          prevCursor: null
        }
      };
    }
    query = query.endBefore(cursorDoc).limitToLast(limit);
  }

  if (!prevCursor) {
    query = query.limit(limit);
  }

  const snapshot = await query.get();
  const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

  // Pagination meta
  let hasNext = false;
  let hasPrev = false;
  let newNextCursor = null;
  let newPrevCursor = null;

  if (data.length > 0) {
    const firstDoc = snapshot.docs[0];
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    newPrevCursor = firstDoc.id;
    newNextCursor = lastDoc.id;

    const nextCheck = collection
      .where('shopId', '==', shopId)
      .orderBy(safeSort, direction)
      .orderBy('__name__', direction)
      .startAfter(lastDoc)
      .limit(1);
    const nextSnap = await nextCheck.get();
    hasNext = !nextSnap.empty;

    const prevCheck = collection
      .where('shopId', '==', shopId)
      .orderBy(safeSort, direction)
      .orderBy('__name__', direction)
      .endBefore(firstDoc)
      .limitToLast(1);
    const prevSnap = await prevCheck.get();
    hasPrev = !prevSnap.empty;
  }

  return {
    data: data.map(presentDataAndFormatDate),
    pageInfo: {
      hasNext,
      hasPrev,
      nextCursor: newNextCursor,
      prevCursor: newPrevCursor
    }
  };
}

/**
 * Create a new notification
 * @param {Object} data
 * @returns {Promise<string>}
 */
export async function create(data) {
  const docRef = await collection.add(data);
  return docRef.id;
}

/**
 * Create a new notification with a specific ID
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function createWithId(id, data) {
  await collection.doc(id).set(data);
}

/**
 * Get latest notifications by shopId without pagination
 * @param {string} shopId
 * @param {number} limit
 * @returns {Promise<any[]>}
 */
export async function getLatestByShopId(shopId, limit = 10) {
  console.log(">>>>>>>>>>>>>>> GETTING LATEST NOTIFICATIONS FOR SHOP: ", shopId, " WITH LIMIT: ", limit, " >>>>>>>>>>>>>>>>>>");
  const snapshot = await collection
    .where('shopId', '==', shopId)
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();

  const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  return data.map(presentDataAndFormatDate);
}
