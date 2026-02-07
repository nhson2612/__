# Project Overview

## Project Name

Avada Training App

## Description

The Avada Training App is a multi-tenant SaaS application for Shopify merchants. It provides notification management, subscription management, app news delivery, and theme extension functionality. The application is built as a monorepo with separate packages for frontend, backend, and script tag components.

## Executive Summary

**Project Type:** Monorepo with 4 parts
**Primary Domain:** E-commerce/Shopify App Development
**Development Status:** Active with CI/CD configured
**Deployment:** Firebase Hosting + Functions + Shopify App Store

## Technology Stack Summary

| Category            | Technology                          | Purpose              |
| ------------------- | ----------------------------------- | -------------------- |
| **Frontend**        | React 18, Vite 6, Polaris UI        | User interface       |
| **Backend**         | Node.js 20, Firebase Functions, Koa | Serverless API       |
| **Database**        | Firestore                           | NoSQL data storage   |
| **Authentication**  | Firebase Auth + Shopify OAuth       | User auth            |
| **Script Tag**      | Preact, Rspack                      | Storefront injection |
| **Extension**       | Shopify Theme Extension             | Theme blocks         |
| **CI/CD**           | GitLab CI/CD                        | Automated deployment |
| **Package Manager** | Yarn Workspaces                     | Monorepo management  |

## Repository Structure

```
app-name/
├── packages/
│   ├── assets/              # React/Vite frontend
│   ├── functions/           # Firebase Functions backend
│   └── scripttag/          # Preact script tag
├── extensions/
│   └── avada-theme-app-extension/  # Theme extension
├── static/                   # Build output (Firebase Hosting)
├── docs/                     # Generated documentation
└── Configuration files...
```

## Architecture Type

**Monorepo Architecture** with separate concerns:

1. **Frontend (Assets)**: React SPA with Shopify App Bridge
2. **Backend (Functions)**: Firebase Functions with Koa
3. **Script Tag**: Preact component injected into storefronts
4. **Extension**: Shopify Theme App Extension

## Core Features

### 1. Multi-Tenancy

- Support for multiple Shopify stores
- Per-shop configuration
- Shop-specific data isolation

### 2. Notification System

- In-app notifications for shop owners
- Real-time updates via Firestore
- Pagination and filtering
- Notification types: info, warning, error, success

### 3. Subscription Management

- Subscription plans (free, basic, pro)
- CRUD operations for subscriptions
- Billing cycle management
- Trial support

### 4. Settings Management

- Per-shop settings
- Configuration preferences
- Display settings
- Trigger settings

### 5. App News

- Announcements and updates
- Feature announcements
- Priority-based display
- Rich content support

### 6. Shopify Integration

- Embedded app in Shopify Admin
- Standalone web app mode
- Shopify API integration
- Webhook event processing

### 7. Theme Extension

- Liquid template blocks
- Star rating snippets
- Custom storefront UI
- Localization support

### 8. Script Tag

- Preact-based component
- Storefront injection
- Popup notifications
- API communication capability

## Data Architecture

**Database:** Google Cloud Firestore

**Collections:**

- `shops` - Shop information
- `notifications` - Shop notifications
- `subscriptions` - Subscription data
- `settings` - Shop settings
- `appNews` - App-wide news
- `samples` - Sample data

**Relationships:**

```
shops (1:N) notifications
shops (1:N) subscriptions
shops (1:1) settings
shops (1:1) shopInfo
appNews (global)
```

## API Architecture

**REST API** served via Firebase Functions

**Endpoints:**

- 15 API endpoints for various operations
- 6 webhook endpoints for Shopify events
- Authentication endpoints (auth, authSa)
- Embedded app handlers

**Documentation:** See [API Contracts](api-contracts-functions.md)

## Component Architecture

**Frontend Components:** 30+ React components

**Categories:**

- Layout components (Footer, ErrorBoundary, Loading)
- Page components (HomePage, Settings, Notifications)
- Integration components (AppBridgeProvider)
- UI Molecules (Modal, Sheet, Banner)
- Utility components (RangeSlider, ScreenPreview)

**Documentation:** See [Component Inventory](component-inventory-assets.md)

## Development Workflow

1. **Development:**
   - `yarn dev` - Full stack development
   - Firebase emulators for local backend
   - Hot module replacement for frontend

2. **Testing:**
   - ESLint for code quality
   - Jest for unit tests (TODO)

3. **Deployment:**
   - GitLab CI/CD for production
   - Firebase CLI for manual deployment
   - Shopify CLI for app deployment

**Documentation:** See [Development Guide](development-guide.md)

## Deployment Architecture

**Hosting:** Firebase Hosting

**Compute:** Firebase Cloud Functions (Node.js 20)

**Database:** Firestore

**CI/CD:** GitLab CI/CD

**Deployment Flow:**

```
Git Tag → GitLab CI/CD → Build → Firebase Deploy
```

**Documentation:** See [Deployment Guide](deployment-guide.md)

## Integration Architecture

The application integrates with:

- Shopify API (REST + GraphQL)
- Firebase (Auth, Firestore, Functions)
- Shopify App Bridge (embedded app)
- Shopify Theme Extension (Liquid blocks)
- Shopify Webhooks (event-driven)

**Documentation:** See [Integration Architecture](integration-architecture.md)

## Entry Points

| Part      | Entry Point                                                   | Purpose                  |
| --------- | ------------------------------------------------------------- | ------------------------ |
| Assets    | `packages/assets/src/pages/App/App.js`                        | Main React app           |
| Functions | `packages/functions/src/index.js`                             | Firebase Functions entry |
| ScriptTag | `packages/scripttag/src/index.js`                             | Preact script tag        |
| Extension | `extensions/avada-theme-app-extension/shopify.extension.toml` | Shopify extension config |

## Generated Documentation

This project documentation includes:

- [Technology Stack](technology-stack.md) - Detailed technology information
- [Architecture Patterns](architecture-patterns.md) - Architecture style and patterns
- [API Contracts](api-contracts-functions.md) - API endpoint documentation
- [Data Models](data-models-functions.md) - Firestore schema
- [Component Inventory](component-inventory-assets.md) - UI components
- [Source Tree Analysis](source-tree-analysis.md) - Directory structure
- [Development Guide](development-guide.md) - Setup and development
- [Deployment Guide](deployment-guide.md) - Deployment procedures
- [Integration Architecture](integration-architecture.md) - Integration points

## Project Status

**Current Version:** Active development
**Last Updated:** 2026-01-31
**TODO Items:**

- [ ] Add comprehensive testing
- [ ] Additional documentation
- [ ] Performance optimization

## Next Steps

1. Review the [master index](index.md) for complete documentation structure
2. Use [API contracts](api-contracts-functions.md) for API development
3. Reference [data models](data-models-functions.md) for schema changes
4. Follow [development guide](development-guide.md) for setup
5. Use [deployment guide](deployment-guide.md) for deployment
