import { create } from '../repositories/notificationRepository';

// Configure Firestore to use emulator if in development
const configureFirestoreEmulator = () => {
  if (process.env.FUNCTIONS_EMULATOR === 'true' || process.env.NODE_ENV === 'development') {
    process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
    console.log('Configuring Firestore to use emulator:', process.env.FIRESTORE_EMULATOR_HOST);
  }
};

configureFirestoreEmulator();

/**
 * Seed notification data for testing
 * Creates sample notification records in the Firestore database
 */
async function seedNotifications() {
  console.log('Seeding notification data...');

  // Fetch the first shop from Firestore
  const { Firestore } = require('@google-cloud/firestore');
  const firestoreSettings = {
    projectId: 'todo-app-frontend-7ff2',
  };
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    firestoreSettings.host = process.env.FIRESTORE_EMULATOR_HOST;
    firestoreSettings.ssl = false;
  }
  const firestore = new Firestore(firestoreSettings);

  let shopId = process.env.SHOP_ID;

  if (!shopId) {
    console.log('Fetching shop ID from Firestore...');
    const shopsSnapshot = await firestore.collection('shops').limit(1).get();
    if (!shopsSnapshot.empty) {
      shopId = shopsSnapshot.docs[0].id;
      console.log(`Found shop ID: ${shopId}`);
    } else {
      console.warn('No shops found in Firestore. Using fallback ID.');
      shopId = 'test-shop.myshopify.com';
    }
  } else {
    console.log(`Using provided SHOP_ID: ${shopId}`);
  }

  // Sample notification data based on the data model
  const sampleNotifications = [
    {
      shopId,
      orderId: '#1001',
      firstName: 'John',
      city: 'New York',
      country: 'USA',
      productName: 'Premium T-Shirt',
      productImage: 'https://placehold.co/100x100?text=T-Shirt',
      timestamp: new Date(Date.now() - 5 * 60000) // 5 minutes ago
    },
    {
      shopId,
      orderId: '#1002',
      firstName: 'Sarah',
      city: 'Los Angeles',
      country: 'USA',
      productName: 'Designer Jeans',
      productImage: 'https://placehold.co/100x100?text=Jeans',
      timestamp: new Date(Date.now() - 15 * 60000) // 15 minutes ago
    },
    {
      shopId,
      orderId: '#1003',
      firstName: 'Michael',
      city: 'London',
      country: 'UK',
      productName: 'Smart Watch',
      productImage: 'https://placehold.co/100x100?text=Watch',
      timestamp: new Date(Date.now() - 30 * 60000) // 30 minutes ago
    },
    {
      shopId,
      orderId: '#1004',
      firstName: 'Emma',
      city: 'Toronto',
      country: 'Canada',
      productName: 'Wireless Headphones',
      productImage: 'https://placehold.co/100x100?text=Headphones',
      timestamp: new Date(Date.now() - 45 * 60000) // 45 minutes ago
    },
    {
      shopId,
      orderId: '#1005',
      firstName: 'David',
      city: 'Sydney',
      country: 'Australia',
      productName: 'Leather Jacket',
      productImage: 'https://placehold.co/100x100?text=Jacket',
      timestamp: new Date(Date.now() - 60 * 60000) // 1 hour ago
    },
    {
      shopId,
      orderId: '#1006',
      firstName: 'Lisa',
      city: 'Berlin',
      country: 'Germany',
      productName: 'Running Shoes',
      productImage: 'https://placehold.co/100x100?text=Shoes',
      timestamp: new Date(Date.now() - 120 * 60000) // 2 hours ago
    },
    {
      shopId,
      orderId: '#1007',
      firstName: 'James',
      city: 'Tokyo',
      country: 'Japan',
      productName: 'Camera Lens',
      productImage: 'https://placehold.co/100x100?text=Lens',
      timestamp: new Date(Date.now() - 180 * 60000) // 3 hours ago
    },
    {
      shopId,
      orderId: '#1008',
      firstName: 'Olivia',
      city: 'Paris',
      country: 'France',
      productName: 'Designer Bag',
      productImage: 'https://placehold.co/100x100?text=Bag',
      timestamp: new Date(Date.now() - 240 * 60000) // 4 hours ago
    }
  ];

  try {
    // Create each notification
    for (const notification of sampleNotifications) {
      const id = await create(notification);
      console.log(`Created notification with ID: ${id}`);
    }

    console.log('Notification seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding notifications:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedNotifications()
    .then(() => {
      console.log('Seeding process completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedNotifications };