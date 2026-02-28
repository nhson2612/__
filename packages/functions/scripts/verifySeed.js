import * as admin from 'firebase-admin';
import {getList} from '../repositories/notificationRepository';

// Configure to use emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Initialize Firebase Admin SDK for emulator
if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: 'demo-test-project' // Default project ID for emulator
  });
}

const firestore = admin.firestore();

/**
 * Verify seeded notification data
 */
async function verifySeededData() {
  console.log('Verifying seeded notification data...');

  try {
    // Use the repository function to get notifications
    const shopId = process.env.SHOP_ID || 'test-shop.myshopify.com';

    // Get the list of notifications
    const result = await getList(shopId, {limit: 20});

    console.log(`Found ${result.data.length} notifications for shop: ${shopId}`);
    console.log('\nNotification details:');

    result.data.forEach((notification, index) => {
      console.log(
        `${index + 1}. Order: ${notification.orderId}, Customer: ${
          notification.firstName
        }, Product: ${notification.productName}, Time: ${notification.timestamp}`
      );
    });

    console.log('\nVerification completed successfully!');
  } catch (error) {
    console.error('Error verifying seeded data:', error);
    throw error;
  }
}

// Run the verification if this file is executed directly
if (require.main === module) {
  verifySeededData()
    .then(() => {
      console.log('Verification process completed.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Verification process failed:', error);
      process.exit(1);
    });
}

export {verifySeededData};
