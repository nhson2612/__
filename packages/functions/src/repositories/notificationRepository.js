import { Firestore } from '@google-cloud/firestore';
import { presentDataAndFormatDate } from '../presenters/notificationPresenter';

// Configure Firestore with emulator if environment variable is set
const firestoreSettings = {
  projectId: 'todo-app-frontend-7ff2', // Force correct project ID
};
if (process.env.FIRESTORE_EMULATOR_HOST) {
  firestoreSettings.host = process.env.FIRESTORE_EMULATOR_HOST;
  firestoreSettings.ssl = false;
}

const firestore = new Firestore(firestoreSettings);
const collection = firestore.collection('notifications');

/**
 * Get list of notifications with pagination
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
  { limit = 10, sort = 'timestamp', direction = 'desc', nextCursor, prevCursor }
) {
  let query = collection.where('shopId', '==', shopId);

  // Sorting
  query = query.orderBy(sort, direction);
  // Add secondary sort for stable pagination
  query = query.orderBy('__name__', direction);

  // Pagination logic
  if (nextCursor) {
    const cursorDoc = await collection.doc(nextCursor).get();
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc);
    }
  } else if (prevCursor) {
    const cursorDoc = await collection.doc(prevCursor).get();
    if (cursorDoc.exists) {
      query = query.endBefore(cursorDoc).limitToLast(limit);
    }
  }

  // If not using prevCursor (reverse query), use standard limit
  if (!prevCursor) {
    query = query.limit(limit);
  }

  const snapshot = await query.get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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

    // Check if there are more items
    if (!prevCursor) {
      // Forward direction check
      const nextQuery = collection
        .where('shopId', '==', shopId)
        .orderBy(sort, direction)
        .orderBy('__name__', direction)
        .startAfter(lastDoc)
        .limit(1);
      const nextSnapshot = await nextQuery.get();
      hasNext = !nextSnapshot.empty;

      // Check if there are previous items (if not on first page)
      if (nextCursor) {
        // This is simplified, strictly usually we track page number or specific cursor logic
        hasPrev = true;
      }
    } else {
      // Backward direction check
      hasNext = true; // We came from a next page
      const prevQuery = collection
        .where('shopId', '==', shopId)
        .orderBy(sort, direction)
        .orderBy('__name__', direction)
        .endBefore(firstDoc)
        .limitToLast(1);
      const prevSnapshot = await prevQuery.get();
      hasPrev = !prevSnapshot.empty;
    }
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
