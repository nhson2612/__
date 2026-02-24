# Notification Data Seeding

This document explains how to seed notification data for development and testing purposes.

## Overview

The notification seeding script creates sample notification records in Firestore to help with development and testing of the notification features.

## Data Structure

Each notification contains the following fields:

- `shopId`: The Shopify shop identifier
- `orderId`: The order identifier from Shopify
- `firstName`: Customer's first name
- `city`: Customer's city
- `country`: Customer's country
- `productName`: Name of the purchased product
- `productImage`: URL to the product image
- `timestamp`: When the order was created

## Seeding Process

### Prerequisites

Before running the seed script, ensure:

1. You have Firebase credentials configured
2. You have the necessary permissions to write to the Firestore database
3. The `GOOGLE_APPLICATION_CREDENTIALS` environment variable is set (for production)
4. You're authenticated with Firebase CLI (`firebase login`)

### Running the Seed Script

#### Method 1: Using Yarn/NPM Scripts

```bash
# Navigate to the functions directory
cd packages/functions

# Build the project first (to compile the seed script)
yarn development  # or npm run development

# Run the seed script
yarn seed-notifications  # or npm run seed-notifications
```

#### Method 2: Direct Execution

```bash
# Navigate to the functions directory
cd packages/functions

# Build the project first
yarn development

# Run the seed script directly
node lib/seeds/notificationSeed.js
```

### Setting the Shop ID

By default, the script uses `test-shop.myshopify.com` as the shop ID. To use a different shop ID, set the `SHOP_ID` environment variable:

```bash
SHOP_ID=your-shop.myshopify.com yarn seed-notifications
```

## Sample Data

The seed script creates 8 sample notifications with realistic data:

- Names from different regions
- Cities representing various countries
- Common product types
- Timestamps ranging from 5 minutes to 4 hours ago

## Verification

After running the seed script, you can verify the data was created by:

1. Checking the Firebase Console
2. Using the notifications API endpoint: `/api/notifications`
3. Looking at the notification list in the admin panel
4. Running the verification script:

```bash
cd packages/functions
FIRESTORE_EMULATOR_HOST=localhost:8080 NODE_ENV=development node -e "require('./lib/seeds/verifySeed.js').verifySeededData();"
```

## Notes

- The script will create new documents each time it runs, potentially duplicating data
- For production environments, ensure you have appropriate safeguards
- The placeholder images use `placehold.co` service