# API Contracts - Functions (Backend)

## Base URL

```
/api
```

Prefix dynamically configured based on environment and embedded mode.

---

## API Endpoints

### Theme App Extension

#### GET `/status`

Get theme app extension status.

**Authentication:** Required (Shopify session)

**Response:**

```json
{
  "status": "active|inactive"
}
```

---

### Samples

#### GET `/samples`

Get sample data (example endpoint).

**Authentication:** Required

**Response:**

```json
{
  "data": [...]
}
```

---

### Shops

#### GET `/shops`

Get user's shops.

**Authentication:** Required

**Response:**

```json
{
  "shops": [
    {
      "id": "string",
      "name": "string",
      "domain": "string"
    }
  ]
}
```

---

### Subscription

#### GET `/subscription`

Get current shop subscription.

**Authentication:** Required

**Response:**

```json
{
  "id": "string",
  "plan": "string",
  "status": "active|inactive|cancelled",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

### App News

#### GET `/appNews`

Get app news/announcements.

**Authentication:** Required

**Query Parameters:**

- `limit` (optional): Number of items to return
- `page` (optional): Page number for pagination

**Response:**

```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "createdAt": "date"
    }
  ],
  "pageInfo": {
    "hasNext": boolean,
    "total": number
  }
}
```

---

### Subscriptions (CRUD)

#### GET `/subscriptions`

Get subscriptions list with pagination.

**Authentication:** Required

**Query Parameters:**

- `limit` (optional, default: 10): Items per page
- `sort` (optional): Sort field (e.g., "createdAt", "updatedAt")
- `direction` (optional): "asc" or "desc"
- `page` (optional): Page number

**Response:**

```json
{
  "data": [
    {
      "id": "string",
      "shopId": "string",
      "plan": "string",
      "status": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "total": 10,
  "pageInfo": {
    "hasNext": boolean,
    "hasPrev": boolean,
    "totalPage": number
  }
}
```

---

#### POST `/subscriptions`

Create a new subscription.

**Authentication:** Required

**Request Body:**

```json
{
  "plan": "string",
  "status": "string",
  "metadata": {}
}
```

**Response:**

```json
{
  "id": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

#### PUT `/subscriptions`

Update an existing subscription.

**Authentication:** Required

**Request Body:**

```json
{
  "id": "string",
  "plan": "string",
  "status": "string",
  "metadata": {}
}
```

**Response:**

```json
{
  "success": true,
  "updatedAt": "date"
}
```

---

#### DELETE `/subscriptions/:id`

Delete a subscription.

**Authentication:** Required

**URL Parameters:**

- `id`: Subscription ID

**Response:**

```json
{
  "success": true
}
```

---

### Settings

#### GET `/settings`

Get shop settings.

**Authentication:** Required

**Response:**

```json
{
  "shopId": "string",
  "display": {
    "position": "bottom-left",
    "hideTimeAgo": boolean,
    "truncateContent": boolean,
    "displayDuration": number,
    "firstPopDelay": number,
    "gapTime": number,
    "maxPopups": number
  },
  "triggers": {
    "pageRestriction": "all|specific",
    "specificPages": ["string"],
    "excludedPages": ["string"]
  }
}
```

---

#### PUT `/settings`

Update shop settings.

**Authentication:** Required

**Middleware:** `settingInputMiddleware` (input validation)

**Request Body:**

```json
{
  "display": {
    "position": "bottom-left",
    "hideTimeAgo": boolean,
    "truncateContent": boolean,
    "displayDuration": number,
    "firstPopDelay": number,
    "gapTime": number,
    "maxPopups": number
  },
  "triggers": {
    "pageRestriction": "all|specific",
    "specificPages": ["string"],
    "excludedPages": ["string"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "updatedAt": "date"
}
```

---

### Notifications

#### GET `/notifications`

Get notifications for the shop with pagination.

**Authentication:** Required

**Query Parameters:**

- `limit` (optional, default: 2): Number of items to return
- `sortOrder` (optional, default: "desc"): "asc" or "desc"
- `nextCursor` (optional): Cursor for next page (`{ts: number, id: string}`)
- `prevCursor` (optional): Cursor for previous page (`{ts: number, id: string}`)

**Response:**

```json
{
  "data": [
    {
      "id": "string",
      "shopId": "string",
      "orderId": "string",
      "firstName": "string",
      "city": "string",
      "country": "string",
      "productName": "string",
      "productImage": "string",
      "timestamp": "date"
    }
  ],
  "pageInfo": {
    "hasNext": boolean,
    "hasPrev": boolean,
    "nextCursor": { "ts": number, "id": "string" } | null,
    "prevCursor": { "ts": number, "id": "string" } | null
  }
}
```

---

#### GET `/notifications/sync`

Manually trigger notification sync from Shopify.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "syncedCount": number,
  "message": "string"
}
```

---

## Webhooks

### Orders

#### POST `/webhook/orders/new`

Webhook trigger for new order events.

**Authentication:** Shopify webhook signature

**Request Body:**

```json
{
  "id": "string",
  "order_number": "string",
  "email": "string",
  "total_price": "number",
  "created_at": "date"
}
```

**Response:**

```json
{
  "success": true
}
```

---

## Authentication

All API endpoints require Shopify session authentication, which includes:

- `session` object in request context
- Shopify shop domain
- Access tokens validated via middleware

---

## Error Responses

All endpoints may return standard error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

Common error codes:

- `UNAUTHORIZED`: Invalid or missing authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `INTERNAL_ERROR`: Server error
