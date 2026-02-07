# Data Models - Firestore Collections

## Overview

This project uses Google Cloud Firestore as the primary database. All data is organized in collections with the following schema.

---

## Collection: `shops`

**Purpose:** Store Shopify shop information and configuration.

**Document Structure:**

| Field         | Type                 | Required | Description                                            |
| ------------- | -------------------- | -------- | ------------------------------------------------------ |
| `id`          | string (document ID) | Yes      | Unique shop identifier (typically Shopify shop domain) |
| `name`        | string               | No       | Shop name from Shopify                                 |
| `domain`      | string               | Yes      | Shop domain (e.g., `example.myshopify.com`)            |
| `apiKey`      | string               | No       | Shopify API key for this shop                          |
| `accessToken` | string               | No       | Shopify access token                                   |
| `status`      | string               | No       | Shop status (`active`, `inactive`, `uninstalled`)      |
| `installedAt` | timestamp            | No       | Date when app was installed                            |
| `updatedAt`   | timestamp            | No       | Last update timestamp                                  |
| `config`      | map/object           | No       | Additional shop configuration                          |

**Indexes:**

- Primary: Document ID (`id`)
- Query: `domain`

**Repository:** `shopRepository.js`

---

## Collection: `notifications`

**Purpose:** Store sales notifications (Sales Pops) derived from Shopify orders.

**Document Structure:**

| Field          | Type                 | Required       | Description                                   |
| -------------- | -------------------- | -------------- | --------------------------------------------- |
| `id`           | string (document ID) | Auto-generated | Unique notification ID                        |
| `shopId`       | string               | Yes            | Reference to `shops` collection (shop domain) |
| `orderId`      | string               | Yes            | Original Shopify Order ID                     |
| `firstName`    | string               | No             | Customer first name                           |
| `city`         | string               | No             | Customer city                                 |
| `country`      | string               | No             | Customer country                              |
| `productName`  | string               | Yes            | Name of the first product in order            |
| `productImage` | string               | No             | URL of the product image                      |
| `timestamp`    | timestamp            | Yes            | When the order was created                    |

**Indexes:**

- Primary: Document ID (`id`)
- Compound: [`shopId`, `timestamp`, `__name__`] (for pagination)

**Repository:** `notificationRepository.js`

**Pagination:**

- Supports cursor-based pagination with `nextCursor` and `prevCursor`
- Sortable by `timestamp` (descending typically)
- Default limit: configurable

---

## Collection: `subscriptions`

**Purpose:** Store subscription plans and shop subscription status.

**Document Structure:**

| Field          | Type                 | Required       | Description                                                      |
| -------------- | -------------------- | -------------- | ---------------------------------------------------------------- |
| `id`           | string (document ID) | Auto-generated | Unique subscription ID                                           |
| `shopId`       | string               | Yes            | Reference to `shops` collection                                  |
| `plan`         | string               | Yes            | Subscription plan name (e.g., `free`, `basic`, `pro`)            |
| `status`       | string               | Yes            | Subscription status (`active`, `inactive`, `cancelled`, `trial`) |
| `createdAt`    | timestamp            | Yes            | When subscription was created                                    |
| `updatedAt`    | timestamp            | Yes            | Last update timestamp                                            |
| `billingCycle` | string               | No             | Billing cycle (`monthly`, `yearly`)                              |
| `trialEndsAt`  | timestamp            | No             | End date for trial period                                        |
| `cancelledAt`  | timestamp            | No             | When subscription was cancelled                                  |
| `metadata`     | map/object           | No             | Additional subscription data                                     |

**Indexes:**

- Primary: Document ID (`id`)
- Compound: [`shopId`, `createdAt`] (for querying shop subscriptions)
- Compound: [`shopId`, `updatedAt`] (for sorting and querying)

**Repository:** `subscriptionsRepository.js`

**Pagination:**

- Supports cursor-based pagination
- Sortable by any field (default: `createdAt`)
- Query with `limit`, `sortField`, and `direction`

---

## Collection: `settings`

**Purpose:** Store shop-specific app settings and preferences.

**Document Structure:**

| Field       | Type                 | Required | Description                                     |
| ----------- | -------------------- | -------- | ----------------------------------------------- |
| `id`        | string (document ID) | Yes      | Shop ID (same as `shops` collection)            |
| `shopId`    | string               | Yes      | Reference to `shops` collection                 |
| `display`   | map/object           | No       | Display settings (position, timing, etc.)       |
| `triggers`  | map/object           | No       | Trigger settings (pages, exclusions, etc.)      |
| `updatedAt` | timestamp            | Yes      | Last update timestamp                           |

**Indexes:**

- Primary: Document ID (`id`)
- Query: `shopId`

**Repository:** `settingRepository.js`

---

## Collection: `appNews`

**Purpose:** Store app news and announcements displayed to all users.

**Document Structure:**

| Field            | Type                 | Required       | Description                                     |
| ---------------- | -------------------- | -------------- | ----------------------------------------------- |
| `id`             | string (document ID) | Auto-generated | Unique news ID                                  |
| `title`          | string               | Yes            | News headline                                   |
| `content`        | string               | Yes            | News body content (markdown supported)          |
| `type`           | string               | Yes            | News type (`announcement`, `feature`, `update`) |
| `publishedAt`    | timestamp            | Yes            | When news was published                         |
| `createdAt`      | timestamp            | Yes            | Creation timestamp                              |
| `author`         | string               | No             | Author name                                     |
| `priority`       | number               | No             | Display priority (higher = more prominent)      |
| `imageUrl`       | string               | No             | Featured image URL                              |
| `targetAudience` | string               | No             | Target audience (`all`, `paid`, `free` plans)   |

**Indexes:**

- Primary: Document ID (`id`)
- Compound: [`publishedAt`, `createdAt`] (for chronological display)

**Repository:** `appNewsRepository.js`

---

## Collection: `samples`

**Purpose:** Store sample/test data for development and demonstration.

**Document Structure:**

| Field       | Type                 | Required       | Description         |
| ----------- | -------------------- | -------------- | ------------------- |
| `id`        | string (document ID) | Auto-generated | Unique sample ID    |
| `name`      | string               | Yes            | Sample name         |
| `data`      | map/object           | Yes            | Sample data payload |
| `category`  | string               | No             | Sample category     |
| `createdAt` | timestamp            | Yes            | Creation timestamp  |

**Indexes:**

- Primary: Document ID (`id`)

**Repository:** `sampleRepository.js`

---

## Collection: `shopInfo`

**Purpose:** Store additional shop information and metadata.

**Document Structure:**

| Field       | Type                 | Required | Description                     |
| ----------- | -------------------- | -------- | ------------------------------- |
| `id`        | string (document ID) | Yes      | Shop ID                         |
| `shopId`    | string               | Yes      | Reference to `shops` collection |
| `info`      | map/object           | No       | Additional shop information     |
| `metadata`  | map/object           | No       | Custom metadata                 |
| `updatedAt` | timestamp            | Yes      | Last update timestamp           |

**Indexes:**

- Primary: Document ID (`id`)
- Query: `shopId`

**Repository:** `shopInfoRepository.js`

---

## Database Schema Relationships

```
shops (1) ─────── (N) notifications
   │
   ├── (1) ─────── (N) subscriptions
   │
   ├── (1) ─────── (1) settings
   │
   └── (1) ─────── (1) shopInfo

appNews (1) ─────── (N) all shops (no direct relation)
```

**Relationship Types:**

- `shops` is the parent collection
- `notifications`, `subscriptions`, `settings`, `shopInfo` have `shopId` foreign key
- `appNews` is global, not tied to specific shops

---

## Firestore Utilities

**Used Utility Functions:**

- `presentDataAndFormatDate()` - Format dates and present data
- `paginateQuery()` - Generic pagination handler
- `getOrderBy()` - Parse sort parameters

**Helper Repository:** `repositories/helper.js`

---

## Data Access Patterns

### Reading Data

1. Single document: `collection.doc(id).get()`
2. Query by shop: `collection.where('shopId', '==', shopId).get()`
3. Paginated: Cursor-based with `startAt()` / `endAt()`

### Writing Data

1. Single document: `collection.add(data)` or `collection.doc(id).set(data)`
2. Batch operations: `db.batch().set() / .update() / .delete()`
3. Partial updates: `doc.update({field: value})`
4. Merge updates: `doc.set(data, {merge: true})`

### Deleting Data

1. Single document: `doc.delete()`
2. Query delete: (iterate and delete individually)

---

## Timestamp Format

All timestamps are stored as Firestore `Timestamp` objects:

- Client (Firebase SDK): `firebase.firestore.Timestamp`
- Server (Admin SDK): `@google-cloud/firestore`

When sending to client, timestamps are converted to:

- ISO strings for display
- Relative time strings (e.g., "2 hours ago") for notifications
