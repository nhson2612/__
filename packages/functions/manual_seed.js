const {Firestore} = require('@google-cloud/firestore');

const firestoreSettings = {
  projectId: 'todo-app-frontend-7ff2' // Force correct project ID
};

if (process.env.FIRESTORE_EMULATOR_HOST) {
  firestoreSettings.host = process.env.FIRESTORE_EMULATOR_HOST;
  firestoreSettings.ssl = false;
}

const firestore = new Firestore(firestoreSettings);

async function seedShop() {
  const shopDomain = 'dung-thanh-n.myshopify.com';
  console.log(`Seeding shop: ${shopDomain}`);

  const snapshot = await firestore
    .collection('shops')
    .where('shopifyDomain', '==', shopDomain)
    .get();

  if (!snapshot.empty) {
    console.log('Shop already exists:', snapshot.docs[0].id);
    return snapshot.docs[0].id;
  }

  const shopData = {
    shopifyDomain: shopDomain,
    accessToken: 'test_token',
    email: 'nhson26122004@gmail.com', // Dummy email based on context
    name: 'Dung Thanh No',
    shopOwner: 'Dung Thanh',
    installedAt: new Date(),
    app_status: 'installed'
  };

  const docRef = await firestore.collection('shops').add(shopData);
  console.log('Created shop with ID:', docRef.id);
  return docRef.id;
}

seedShop()
  .then(async shopId => {
    // Also re-seed notifications for this shop
    const {seedNotifications} = require('./lib/seeds/notificationSeed');
    process.env.SHOP_ID = shopId;
    await seedNotifications();
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
