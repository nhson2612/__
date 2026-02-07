# Project Workflow Documentation

This document outlines the end-to-end workflow of the project, covering development setup, codebase structure, and the request flows for both the Storefront and the Admin interface.

## 1. High-Level Architecture

The project is a Shopify App built with a Microservices-like architecture using Firebase.

```mermaid
graph TD
    User((User/Browser))
    Shopify((Shopify Platform))
    Cloudflare((Cloudflare Proxy))
    
    subgraph Local_Dev_Environment [Local Development Environment]
        Vite[Vite Dev Server\n(packages/assets)]
        Rspack[Rspack Watcher\n(packages/scripttag)]
        Firebase_Hosting[Firebase Hosting Emulator\n(Port 5050)]
        Firebase_Functions[Firebase Functions Emulator\n(Port 5000)]
        Firestore[(Firestore Emulator\n(Port 8080))]
    end

    User -->|Storefront Visit| Shopify
    User -->|Admin Visit| Shopify
    
    Shopify -->|App Embed Script| Cloudflare
    Shopify -->|App Bridge UI| Cloudflare
    
    Cloudflare -->|Tunnel| Vite
    
    Vite -->|/scripttag| Firebase_Hosting
    Vite -->|/api, /webhook| Firebase_Functions
    
    Firebase_Functions --> Firestore
    Rspack -->|Builds to static/scripttag| Firebase_Hosting
```

## 2. Codebase Structure & Responsibilities

| Package | Path | Tech Stack | Purpose |
| :--- | :--- | :--- | :--- |
| **Assets** | `packages/assets` | React, Vite | Main Admin UI (App Bridge), Standalone App. |
| **Functions** | `packages/functions` | Node.js, Firebase | Backend logic, API endpoints, Webhook handlers. |
| **Scripttag** | `packages/scripttag` | Preact, Rspack | Lightweight script for the Storefront. |
| **Extensions** | `extensions/theme-extension` | Liquid, JS | Shopify Theme App Extension (App Embed). |

## 3. Storefront Script Injection & Loading Flow

This workflow illustrates how the script appears on the merchant's store.

```mermaid
sequenceDiagram
    participant Browser
    participant Shopify_Storefront
    participant App_Embed_Liquid as extensions/theme-extension/blocks/avada-embed.liquid
    participant Cloudflare
    participant Vite_Proxy as Vite Server (packages/assets)
    participant Hosting_Emulator as Firebase Hosting (:5050)
    
    Note over Shopify_Storefront: Merchant enables App Embed

    Browser->>Shopify_Storefront: Visit Store Page
    Shopify_Storefront->>App_Embed_Liquid: Render Block
    App_Embed_Liquid-->>Browser: Return HTML with <script src="...avada-embed.js">
    
    Browser->>Browser: Execute avada-embed.js
    Note right of Browser: avada-embed.js creates new <script> tag\nsrc = "https://shopify.nhson2612.space/scripttag/..."
    
    Browser->>Cloudflare: GET /scripttag/avada-storefront.min.js
    Cloudflare->>Vite_Proxy: Forward Request (Tunnel)
    
    Note over Vite_Proxy: Matches proxy rule: ^/scripttag
    Vite_Proxy->>Hosting_Emulator: GET http://localhost:5050/scripttag/avada-storefront.min.js
    
    Hosting_Emulator-->>Vite_Proxy: Return JS File (built by Rspack)
    Vite_Proxy-->>Cloudflare: Return JS File
    Cloudflare-->>Browser: Return JS File
    
    Browser->>Browser: Execute Storefront Script
```

## 4. Admin UI & Backend API Flow

This workflow shows how the Merchant interacts with the app inside the Shopify Admin.

```mermaid
sequenceDiagram
    participant Merchant_Browser
    participant Shopify_Admin
    participant Vite_Server as Vite Server (packages/assets)
    participant Backend_API as Firebase Functions (:5000)
    participant Firestore
    
    Merchant_Browser->>Shopify_Admin: Open App
    Shopify_Admin->>Vite_Server: Load App UI (App Bridge)
    Vite_Server-->>Merchant_Browser: Return React App (Client-side)
    
    Note over Merchant_Browser: User performs action (e.g., Save Settings)
    
    Merchant_Browser->>Vite_Server: POST /api/settings
    Note over Vite_Server: Vite proxies /api to Backend
    Vite_Server->>Backend_API: POST http://localhost:5000/api/settings
    
    Backend_API->>Backend_API: Auth Verification (Shopify API node)
    Backend_API->>Firestore: Save Data
    Firestore-->>Backend_API: Success
    
    Backend_API-->>Vite_Server: JSON Response
    Vite_Server-->>Merchant_Browser: JSON Response
    Merchant_Browser->>Merchant_Browser: Update UI
```

## 5. Webhook Processing Flow

How Shopify notifies the app about events (e.g., Order Created).

```mermaid
sequenceDiagram
    participant Shopify
    participant Cloudflare
    participant Webhook_Controller as packages/functions/webhookController.js
    participant Notification_Repo as notificationRepository.js
    participant Firestore
    
    Note over Shopify: Event: Order Created
    Shopify->>Cloudflare: POST /webhook/orders/create
    Cloudflare->>Webhook_Controller: Forward Request
    
    Webhook_Controller->>Webhook_Controller: Validate HMAC & Domain
    Webhook_Controller->>Webhook_Controller: Extract Order Data
    
    Webhook_Controller->>Shopify: GraphQL (Get Product Images)
    Shopify-->>Webhook_Controller: Image Data
    
    Webhook_Controller->>Notification_Repo: Create Notification Object
    Notification_Repo->>Firestore: Save Notification
    
    Webhook_Controller-->>Shopify: 200 OK
```
