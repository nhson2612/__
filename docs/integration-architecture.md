# Integration Architecture

## Overview

This document describes how different parts of the Avada Training App monorepo communicate and integrate with each other and external services.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          Monorepo Workspace                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐          ┌──────────────────┐        ┌──────────┐  │
│  │   Assets (FE)    │          │  Functions (BE) │        │  Shopify   │  │
│  │  React/Vite      │────API───▶│  Firebase        │──API───▶│   API     │  │
│  │  Firebase Client  │   HTTP    │  Node.js 20      │  GraphQL/  │           │  │
│  │  App Bridge      │          │  Koa Router      │   REST      │           │  │
│  └──────────────────┘          └────────┬─────────┘        └────┬─────┘  │
│         │                              │                        │           │  │
│         │           App Bridge          │                        │           │  │
│         └────────────────────────────────┘                        │           │  │
│                         │                                     │           │  │
│                         ▼                                     ▼           │  │
│               ┌──────────────────────┐                   ┌───────────┐ │  │
│               │  Theme Extension    │                   │  Shop DB   │ │  │
│               │  Liquid Templates   │                   │  Firestore  │ │  │
│               └──────────────────────┘                   └───────────┘ │  │
│         │                                                 │           │  │
│         │              Webhook                              │           │  │
│         └─────────────────────────────────────────────────────────┘           │  │
│                                                                              │
│  ┌──────────────────┐                                                  │  │
│  │   ScriptTag       │                                                  │  │
│  │  Preact/Rspack   │──Injected─────────────────────────────────────────▶│  │
│  └──────────────────┘    into theme                                      │  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration Points

### 1. Assets ↔ Functions (REST API)

**Integration Type:** HTTP API via Axios

**Protocol:** HTTPS

**Authentication:** Shopify session tokens

**Purpose:** Frontend calls backend for business operations

**API Endpoints Used:**

| Endpoint                  | Method              | Purpose                    |
| ------------------------- | ------------------- | -------------------------- |
| `/api/status`             | GET                 | Get theme extension status |
| `/api/samples`            | GET                 | Get sample data            |
| `/api/shops`              | GET                 | Get user's shops           |
| `/api/subscription`       | GET                 | Get subscription           |
| `/api/subscriptions`      | GET/POST/PUT/DELETE | Subscription CRUD          |
| `/api/appNews`            | GET                 | Get app news               |
| `/api/settings`           | GET/PUT             | Settings management        |
| `/api/notifications`      | GET                 | Get notifications          |
| `/api/notifications/sync` | GET                 | Sync notifications         |
| `/auth/**`                | POST                | Authentication             |
| `/embed/**`               | POST                | Embedded app requests      |
| `/apiClient/**`           | POST                | API client requests        |

**Data Flow:**

```
Assets (React Component)
    ↓ axios.get/post/put/delete()
    ↓ JSON payload
Functions (Koa Handler)
    ↓ Controller
    ↓ Repository
    ↓ Firestore
    ↓ Data
    ↑ JSON response
    ↑ axios response
Assets (Component State)
```

**Error Handling:**

- API errors caught in axios interceptors
- User displayed via Polaris Banner components
- Retry logic for network failures

---

### 2. Assets ↔ Shopify (App Bridge)

**Integration Type:** Shopify App Bridge SDK

**Protocol:** Secure messaging within iframe

**Authentication:** Shopify session tokens

**Purpose:** Embedded app integration with Shopify admin

**App Bridge Features Used:**

| Feature             | Description                      |
| ------------------- | -------------------------------- |
| App Bridge Provider | Context provider for React app   |
| Navigation          | Redirect within Shopify admin    |
| Title               | Update page title                |
| Actions             | Show toast notifications         |
| Modal               | Show modals within Shopify admin |

**Data Flow:**

```
Assets (React)
    ↓ @shopify/app-bridge-react
    ↓ AppBridgeProvider
    ↓ Secure Channel
Shopify Admin (iframe)
    ↓ Session Context
    ↓ Tokens
Assets (Authenticated State)
```

**Authentication Flow:**

1. User opens app in Shopify admin
2. Shopify loads app in iframe
3. App Bridge establishes secure channel
4. Shopify provides session token
5. App initializes Firebase Auth with Shopify token

---

### 3. Functions ↔ Shopify API

**Integration Type:** Direct API Integration

**Library:** `shopify-api-node` (v3.11.0)

**Authentication:** OAuth access tokens stored in Firestore

**Purpose:** Backend makes direct Shopify API calls

**Shopify APIs Used:**

| API        | Purpose                              |
| ---------- | ------------------------------------ |
| REST Admin | CRUD operations on Shopify resources |
| GraphQL    | Efficient data queries and mutations |
| Webhooks   | Event-driven data sync               |

**Data Flow:**

```
Functions (Controller)
    ↓ shopify-api-node
    ↓ Auth Token (from Firestore)
Shopify API
    ↓ JSON Response
    ↓ Shopify Data
Functions (Business Logic)
    ↓ Firestore
```

**Token Management:**

- Access tokens stored in `shops` collection
- Tokens refreshed as needed
- Scopes configured in Shopify Partner Dashboard

---

### 4. Functions ↔ Firebase

**Integration Type:** Firebase Admin SDK

**Protocol:** Google Cloud Protocol

**Purpose:** Database operations, authentication, messaging

**Firebase Services Used:**

| Service   | Purpose                                   |
| --------- | ----------------------------------------- |
| Firestore | NoSQL database (primary data store)       |
| Auth      | User authentication (synced with Shopify) |
| Functions | Serverless compute platform               |
| PubSub    | Asynchronous event messaging              |
| Storage   | File storage (assets, uploads)            |

**Data Flow:**

```
Functions (Repository)
    ↓ Firebase Admin SDK
    ↓ Firestore Client
    ↓ CRUD Operations
Firestore Database
    ↓ Document/Collection
    ↑ Data/Query Results
    ↑ Snapshots
Functions (Controller)
```

**Collection Relationships:**

```
shops (1) ─────── (N) notifications
   │
   ├── (1) ─────── (N) subscriptions
   │
   ├── (1) ─────── (1) settings
   │
   └── (1) ─────── (1) shopInfo
```

**Indexing Strategy:**

- Composite indexes for shopId queries
- Timestamp indexes for pagination
- Query optimization with Firestore query planner

---

### 5. Assets ↔ Firebase (Client SDK)

**Integration Type:** Firebase Client SDK

**Protocol:** HTTPS + WebSocket

**Purpose:** Real-time data sync, authentication

**Firebase Services Used:**

| Service            | Purpose                  |
| ------------------ | ------------------------ |
| Firestore (Client) | Real-time data listening |
| Auth               | Client authentication    |
| Analytics          | User behavior tracking   |

**Data Flow:**

```
Assets (React Component)
    ↓ firebase/firestore
    ↓ onSnapshot()
    ↓ WebSocket
Firebase Database
    ↓ Real-time Updates
Assets (Component Re-render)
```

**Real-time Features:**

- Notification updates via `onSnapshot()`
- Subscription status updates
- Settings synchronization

---

### 6. Extension ↔ Shopify Theme

**Integration Type:** Shopify Theme App Extension

**Protocol:** Liquid templating + JavaScript

**Purpose:** UI components injected into merchant themes

**Extension Components:**

| Component               | Type         | Purpose                      |
| ----------------------- | ------------ | ---------------------------- |
| `avada-sale-pop.liquid` | Block        | Main UI block for storefront |
| `stars.liquid`          | Snippet      | Star rating component        |
| `avada-sale-pop.min.js` | Script       | Frontend logic for block     |
| `en.default.json`       | Localization | English translations         |

**Data Flow:**

```
Shopify Theme Editor
    ↓ Select Extension Block
    ↓ Configure Block
Shopify Storefront
    ↓ Renders Liquid Template
    ↓ Loads Script Tag
    ↓ JavaScript Execution
Extension (Preact Component)
    ↓ Optional API Calls
    ↓ to Functions
Backend
```

**Communication with Functions:**

- Script tag can make API calls to backend
- Uses `BASE_URL` configured at build time
- Authentication via shop domain query parameter

---

### 7. ScriptTag → Shopify Stores

**Integration Type:** Script Tag Injection

**Protocol:** JavaScript (injected into storefront)

**Purpose:** Client-side functionality on storefront

**Injection Process:**

1. Functions register script tag via Shopify API
2. Shopify injects script into theme
3. Script loads from Firebase Hosting
4. Preact component renders in storefront

**Script Tag Configuration:**

| Property        | Value                                                            |
| --------------- | ---------------------------------------------------------------- |
| `src`           | `https://<firebase-hosting-url>/scripttag/avada-sale-pop.min.js` |
| `event`         | `onload` (loads when page loads)                                 |
| `display_scope` | `all` (all storefront pages)                                     |

**Data Flow:**

```
Functions (Installation Handler)
    ↓ Shopify Admin API
    ↓ registerScriptTag()
Shopify Storefront
    ↓ <script> Tag
    ↓ Browser Downloads
Firebase Hosting
    ↓ Serves .min.js
    ↓ Browser Executes
ScriptTag (Preact)
    ↓ Renders UI
    ↓ Optional API Calls
    ↓ to Functions
```

---

### 8. Webhooks Integration

**Integration Type:** Shopify Webhooks

**Protocol:** HTTPS POST (signed by Shopify)

**Purpose:** Event-driven data synchronization

**Webhook Endpoints:**

| Webhook      | Trigger           | Purpose         |
| ------------ | ----------------- | --------------- |
| `orders/new` | New order created | Sync order data |

**Data Flow:**

```
Shopify Event
    ↓ POST (signed)
Functions (Webhook Handler)
    ↓ Verify Signature
    ↓ Process Event
    ↓ Firestore Update
    ↓ Optional Third-party API
    ↑ Acknowledgment
Shopify
```

**Webhook Security:**

- Signature verification using Shopify secret
- Replay attack prevention
- Idempotency for duplicate events

---

## Cross-Part Communication

### Authentication Flow

```
1. Merchant installs app in Shopify Admin
   ↓
2. Shopify redirects to Firebase Functions /auth endpoint
   ↓
3. Functions verify Shopify OAuth code
   ↓
4. Functions exchange for access token
   ↓
5. Functions create shop record in Firestore
   ↓
6. Functions return auth token to frontend
   ↓
7. Assets initialize Firebase Auth
   ↓
8. Assets initialize App Bridge
   ↓
9. App loaded in Shopify Admin iframe
```

### Data Synchronization Flow

```
1. Shopify event occurs (e.g., new order)
   ↓
2. Shopify sends webhook to Functions
   ↓
3. Functions process and store in Firestore
   ↓
4. Assets listening to Firestore via onSnapshot()
   ↓
5. Components re-render with new data
```

### Real-time Updates Flow

```
1. User changes settings in Assets
   ↓
2. Assets calls PUT /api/settings
   ↓
3. Functions update Firestore
   ↓
4. Firestore triggers snapshot update
   ↓
5. Other components listening to onSnapshot() re-render
```

---

## Integration Configuration

### API Configuration

**Base URL:** Dynamic based on environment

```javascript
// Assets package
const API_BASE_URL =
  process.env.IS_EMBEDDED_APP === 'yes' ? '/api' : window.location.origin + '/api';
```

**Timeout:** Default axios timeout (can be overridden)

**Retry Strategy:** Axios retry interceptor

### App Bridge Configuration

```javascript
// Assets package
import {Provider as AppBridgeProvider} from '@shopify/app-bridge-react';

// Usage
<AppBridgeProvider config={{apiKey: SHOPIFY_API_KEY, forceRedirect: true}}>
  <App />
</AppBridgeProvider>;
```

### Firebase Configuration

**Client SDK:**

```javascript
import {initializeApp} from 'firebase/app';

const app = initializeApp({
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  appId: VITE_FIREBASE_APP_ID,
  measurementId: VITE_FIREBASE_MEASUREMENT_ID,
});
```

**Admin SDK (Functions):**

```javascript
import {initializeApp} from 'firebase-admin/app';

const adminApp = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
```

---

## Data Exchange Formats

### API Request Format

```json
{
  "method": "GET|POST|PUT|DELETE",
  "url": "/api/endpoint",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer <token>"
  },
  "data": {
    // Request payload for POST/PUT
  }
}
```

### API Response Format

```json
{
  "data": {
    // Response data
  },
  "pageInfo": {
    "hasNext": true|false,
    "total": number
  },
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

### Firestore Document Format

```json
{
  "id": "document-id",
  "shopId": "shop-domain.myshopify.com",
  "field1": "value",
  "field2": "value",
  "createdAt": {"_seconds": 1234567890, "_nanoseconds": 0},
  "updatedAt": {"_seconds": 1234567890, "_nanoseconds": 0}
}
```

---

## Error Handling Across Integrations

### API Errors

- HTTP status codes (200, 400, 401, 403, 404, 500)
- Error objects with code and message
- Axios interceptors for global error handling

### App Bridge Errors

- App Bridge errors (network, timeout)
- Session invalidation
- Reconnection logic

### Firebase Errors

- Firestore permission errors
- Auth token expired errors
- Network connectivity errors

### Shopify API Errors

- Rate limiting (429)
- Permission errors (403)
- Validation errors (422)

---

## Performance Considerations

### API Calls

- Batch operations where possible
- Pagination for large datasets
- Debouncing user inputs
- Caching frequently accessed data

### Firestore Queries

- Composite indexes for complex queries
- Limit returned documents
- Use server-side filtering

### Real-time Updates

- Unsubscribe from `onSnapshot()` on unmount
- Batch updates to reduce re-renders
- Optimize listener scope

### Webhook Processing

- Acknowledge webhooks quickly (<5 seconds)
- Use background processing (PubSub) for long tasks
- Implement retry logic for failed webhooks
