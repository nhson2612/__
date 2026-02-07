# Architecture Patterns

## Part: assets (Frontend)

### Architecture Pattern: **Component-Based SPA (Single Page Application)**

**Description:**
React-based SPA with component hierarchy, hooks for state management, and client-side routing. Built with Vite for fast development and optimized production builds.

**Key Characteristics:**

- Component composition with React 18
- Functional components with hooks
- Client-side routing via React Router
- Shopified embedded app pattern
- Modular design with reusable Polaris components

**Data Flow:**

- Unidirectional data flow (React state)
- Props for parent-to-child communication
- Context API for global state
- Axios for API calls to backend functions

**State Management:**

- React hooks (useState, useEffect, useContext)
- Local component state for UI
- Firebase SDK for app-wide state

**Integration:**

- Shopify App Bridge for embedded app context
- Firebase for data persistence
- API calls to Firebase Functions

---

## Part: functions (Backend)

### Architecture Pattern: **Serverless API with Microservice Functions**

**Description:**
Firebase Functions providing HTTP endpoints and event-driven functions. Uses Koa as a lightweight server framework for routing and middleware.

**Key Characteristics:**

- Serverless compute (Firebase Functions)
- HTTP REST API endpoints
- Event-driven functions (PubSub triggers)
- Middleware-based request handling (Koa)
- Shopify API integration

**API Design:**

- RESTful HTTP endpoints
- Koa Router for route definitions
- Middleware for CORS, validation, logging
- GraphQL support via graphql-tag

**Data Layer:**

- Firestore for data persistence
- Firebase Admin SDK for server-side operations
- Firestore utils for common operations

**Authentication/Authorization:**

- Firebase Auth integration
- Shopify OAuth
- JWT tokens for API access

**Integration:**

- Shopify API (shopify-api-node)
- Google Cloud PubSub for async tasks
- Firestore for database operations

---

## Part: scripttag (Script Tag Component)

### Architecture Pattern: **Lightweight Client-Side Component**

**Description:**
Minimal Preact-based component injected as a script tag into Shopify store themes. Optimized for bundle size and performance.

**Key Characteristics:**

- Preact (React-compatible, smaller bundle)
- Component-based architecture
- Minimal dependencies
- Optimized for injection into themes

**Build Strategy:**

- Rspack for extremely fast builds
- Code splitting with vendor chunks
- Minimized output for production
- CSS modules for scoped styles

**Integration:**

- Injected via Shopify script tags
- Can make API calls to backend
- Runs in store frontend context

---

## Part: extension (Shopify Theme Extension)

### Architecture Pattern: **Shopify Theme Block Pattern**

**Description:**
Shopify Theme App Extension using Liquid templates for UI components injected into merchant themes.

**Key Characteristics:**

- Liquid templating for UI
- Block-based structure
- Asset management (JS, CSS)
- Localization support
- Theme-aware design

**Integration:**

- Integrated into theme editor
- Can interact with Shopify App Bridge
- Assets loaded from CDN or local server

---

## Overall Monorepo Architecture

### Pattern: **Modular Monorepo with Separate Concerns**

**Architecture Style:**

```
┌─────────────────────────────────────────────────────────────┐
│                      Monorepo Workspace                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Assets     │  │  Functions   │  │  ScriptTag   │  │
│  │  (Frontend)  │  │  (Backend)   │  │  (Script)    │  │
│  │              │  │              │  │              │  │
│  │  React SPA   │  │  Serverless  │  │  Preact      │  │
│  │  Vite        │  │  Firebase    │  │  Rspack      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │             │
│         │  HTTP API       │                  │             │
│         ├─────────────────┤                  │             │
│         │                 │                  │             │
│         ▼                 ▼                  │             │
│  ┌──────────────┐  ┌──────────────┐        │             │
│  │   Firebase   │  │   Shopify    │        │             │
│  │  Functions   │  │     API      │        │             │
│  │   +         │  │              │        │             │
│  │  Firestore   │  └──────────────┘        │             │
│  └──────────────┘                           │             │
│                                            │             │
│  ┌─────────────────────────────────────────────┴─────────┐  │
│  │           Extension (Theme Extension)                  │  │
│  │  Liquid Templates + Shopify App Bridge               │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Integration Points:**

- Assets ↔ Functions: REST API calls
- Functions ↔ Shopify API: Direct integration
- ScriptTag → Functions: API calls (optional)
- Assets ↔ Extension: App Bridge communication
- Extension → Functions: API calls (via App Bridge)

**Data Flow:**

1. Frontend (Assets) → Firebase Functions → Firestore
2. Firebase Functions → Shopify API
3. Shopify Theme Extension → App Bridge → Frontend
4. Script Tag (injected) → Functions (optional)

**Deployment:**

- Assets: Firebase Hosting / Vite build output
- Functions: Firebase Functions (Node.js 20)
- ScriptTag: Built via Rspack, served as static asset
- Extension: Shopify App Extension deployment

---

## Communication Patterns

### 1. REST API (Assets ↔ Functions)

- HTTP/HTTPS
- JSON payloads
- Axios client

### 2. Shopify API (Functions → Shopify)

- shopify-api-node SDK
- OAuth authentication
- REST and GraphQL

### 3. Firebase Integration (Assets + Functions)

- Firebase SDK (client)
- Firebase Admin (server)
- Firestore database

### 4. App Bridge (Embedded App Communication)

- @shopify/app-bridge
- Secure messaging between embedded app and Shopify admin

### 5. Script Tag Injection

- Script tag registered via Shopify API
- Preact component loaded into storefront
- Can make API calls independently
