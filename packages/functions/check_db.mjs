import { Firestore } from '@google-cloud/firestore';

const firestoreConfig = {
    projectId: 'todo-app-frontend-7ff2'
};
// We need to set FIRESTORE_EMULATOR_HOST because we are running outside the regular environment
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

const firestore = new Firestore(firestoreConfig);
const collection = firestore.collection('notification_events');

async function check() {
    const snap = await collection.where('type', '==', 'conversion').get();
    console.log(`Found ${snap.size} conversions`);
    snap.forEach(doc => {
        console.log(doc.id, doc.data());
    });
}
check().catch(console.error);
